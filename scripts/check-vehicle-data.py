"""Re-derive every vehicle claim the estimator depends on, from the shipped source.

WHY THIS EXISTS
Every figure the session calculator prints — range band, energy, ending state
of charge, average power — is an integration over one model's `curve` against
one station's ceiling. So a single transposed digit in lib/ev-models.ts does
not produce an obviously broken page; it produces a page that is confidently
wrong about one car, and nothing else on the site disagrees with it.

These checks are the internal consistency the data has to satisfy before any
of it is published. The integration below is written from scratch rather than
imported, so it is an independent second opinion on lib/charging-math.ts and
not a restatement of it.
"""
import re, pathlib, sys

src = pathlib.Path("lib/ev-models.ts").read_text()
fails = []
def check(name, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")
    if not ok: fails.append(name)

# ── parse ──────────────────────────────────────────────────────────────────
body = re.search(r"export const evModels: EvModel\[\] = \[(.*?)\n\];", src, re.S)
records = re.findall(r"\{\s*\n?\s*id: \"([a-z0-9-]+)\",(.*?)\n  \},", body.group(1), re.S) if body else []

def num(rec, field):
    m = re.search(rf"\b{field}: (-?[\d.]+)", rec)
    return float(m.group(1)) if m else None
def txt(rec, field):
    m = re.search(rf'\b{field}: "([^"]*)"', rec)
    return m.group(1) if m else None

models = []
for mid, rec in records:
    curve = [(int(a), float(b)) for a, b in re.findall(r"\{soc:(\d+),kw:([\d.]+)\}", rec)]
    models.append(dict(
        id=mid, makeId=txt(rec, "makeId"), port=txt(rec, "port"),
        usableKwh=num(rec, "usableKwh"), epaMiles=num(rec, "epaMiles"),
        peakKw=num(rec, "peakKw"), archV=num(rec, "archV"), acKw=num(rec, "acKw"),
        curve=curve,
    ))

# The lesson from check-cover-accuracy.py: a check that parsed nothing reports
# PASS having looked at nothing. Assert the shape of the input first.
declared = len(re.findall(r"^  \{$", body.group(1), re.M)) if body else 0
check("the model table is readable by this check",
      len(models) >= 30 and len(models) == declared,
      f"parsed {len(models)} of {declared} declared records — a silent parse failure reports PASS on an empty set")
if not models:
    print("\n  cannot continue: parsed no models"); sys.exit(1)
print(f"  ── {len(models)} models ──")

# ── 1. required fields present and positive ───────────────────────────────
missing = [m["id"] for m in models
           if not all(isinstance(m[f], float) and m[f] > 0
                      for f in ("usableKwh", "epaMiles", "peakKw", "acKw"))]
check("every model declares a positive pack, range, peak and AC ceiling", not missing, str(missing))

bad_arch = [m["id"] for m in models if m["archV"] not in (400.0, 800.0)]
check("every model's architecture is 400V or 800V", not bad_arch, str(bad_arch))

bad_port = [m["id"] for m in models if m["port"] not in ("nacs", "ccs", "chademo")]
check("every model's port is a member of the Port union", not bad_port, str(bad_port))

# ── 2. curve shape ────────────────────────────────────────────────────────
short = [m["id"] for m in models if len(m["curve"]) < 6]
check("every curve has enough points to integrate", not short, str(short))

unsorted_ = [m["id"] for m in models
             if [s for s, _ in m["curve"]] != sorted({s for s, _ in m["curve"]})]
check("every curve's state-of-charge axis strictly increases", not unsorted_, str(unsorted_))

bad_ends = [m["id"] for m in models if m["curve"][0][0] > 5 or m["curve"][-1][0] != 100]
check("every curve starts at or below 5% and ends at 100%", not bad_ends, str(bad_ends))

nonpos = [m["id"] for m in models if any(kw <= 0 for _, kw in m["curve"])]
check("no curve point claims zero or negative power", not nonpos, str(nonpos))

# A plateau may RISE before its peak — the Ioniq 5 opens at 225kW and climbs
# to 235kW by 20%. What must never happen is power recovering after the peak,
# which is not a thing a lithium pack does and is the signature of a typo.
recovers = []
for m in models:
    kws = [kw for _, kw in m["curve"]]
    after = kws[kws.index(max(kws)):]
    if any(b > a + 0.01 for a, b in zip(after, after[1:])):
        recovers.append(m["id"])
check("no curve recovers power after its peak", not recovers, str(recovers))

# ── 3. peakKw agrees with the curve it is meant to summarise ──────────────
# The file's own header warns about this: Cybertruck advertises 500kW and is
# seeded at 165kW. peakKw and the curve are two statements of one fact, and
# nothing else in the codebase notices when they disagree.
mismatch = [(m["id"], m["peakKw"], max(kw for _, kw in m["curve"]))
            for m in models if abs(max(kw for _, kw in m["curve"]) - m["peakKw"]) > 0.5]
check("every model's peakKw equals the maximum of its own curve", not mismatch, str(mismatch))

# ── 4. efficiency lands in a physically plausible band ────────────────────
# epaMiles / usableKwh. A transposed digit in either field lands outside this
# and skews every mile figure that model ever produces.
eff = [(m["id"], round(m["epaMiles"] / m["usableKwh"], 2)) for m in models]
implausible = [e for e in eff if not 1.8 <= e[1] <= 5.0]
check("every model's derived efficiency is between 1.8 and 5.0 mi/kWh", not implausible, str(implausible))
lo, hi = min(eff, key=lambda e: e[1]), max(eff, key=lambda e: e[1])
print(f"        least efficient {lo[0]} at {lo[1]} mi/kWh; most {hi[0]} at {hi[1]}")

# ── 5. the integration terminates and is plausible for every model ────────
# Independent re-implementation of simulateSession's Euler loop. If this and
# lib/charging-math.ts ever disagree on 10-to-80, one of them is wrong.
STATION_KW, EFF, STEP = 180.0, 0.9, 10

def power_at(curve, soc):
    if soc <= curve[0][0]: return curve[0][1]
    if soc >= curve[-1][0]: return curve[-1][1]
    for (s0, k0), (s1, k1) in zip(curve, curve[1:]):
        if s0 <= soc <= s1:
            return k0 + (soc - s0) / (s1 - s0) * (k1 - k0)
    return curve[-1][1]

def minutes_10_to_80(m):
    soc, secs = 10.0, 0
    while soc < 80 and secs < 4 * 3600:
        kw = min(power_at(m["curve"], soc), STATION_KW)
        if kw <= 0.5: break
        soc += ((kw * STEP / 3600) * EFF * 100) / m["usableKwh"]
        secs += STEP
    return secs / 60

times = [(m["id"], round(minutes_10_to_80(m))) for m in models]
stuck = [t for t in times if not 0 < t[1] < 120]
check("10-to-80% completes in a plausible time for every model", not stuck, str(stuck))
fastest, slowest = min(times, key=lambda t: t[1]), max(times, key=lambda t: t[1])
print(f"        fastest {fastest[0]} at {fastest[1]} min; slowest {slowest[0]} at {slowest[1]} min")

# ── 6. makes and models refer to each other ───────────────────────────────
copy_block = re.search(r"const MAKE_COPY[^{]*\{(.*?)\n\};", src, re.S)
make_keys = set(re.findall(r"^  ([a-z]+): \{", copy_block.group(1), re.M)) if copy_block else set()
model_makes = {m["makeId"] for m in models}
check("every model's makeId has a MAKE_COPY entry", not (model_makes - make_keys), str(model_makes - make_keys))
check("every MAKE_COPY entry has at least one model", not (make_keys - model_makes), str(make_keys - model_makes))

# ── 7. the station ceiling the figures are modelled against still matches ──
math_src = pathlib.Path("lib/charging-math.ts").read_text()
declared_kw = re.search(r"export const STATION_KW = (\d+)", math_src)
station_src = pathlib.Path("lib/stations.ts").read_text()
max_kws = {int(v) for v in re.findall(r"maxKw: (\d+)", station_src)}
check("STATION_KW matches what the stations actually declare",
      declared_kw and max_kws == {int(declared_kw.group(1))},
      f"STATION_KW={declared_kw.group(1) if declared_kw else '?'} vs station maxKw values {sorted(max_kws)}")

print()
if fails:
    print(f"{len(fails)} FAILED: " + "; ".join(fails)); sys.exit(1)
print("all vehicle-data checks passed")
