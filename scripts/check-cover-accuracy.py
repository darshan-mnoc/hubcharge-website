"""Re-derive every geometric claim in the covers from the shipped source."""
import math
import re, math, pathlib, subprocess, json, sys
src = pathlib.Path("components/guide-cover.tsx").read_text()
fails = []
def check(name, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")
    if not ok: fails.append(name)

# 1. every guide-backed cover names the idea it draws, and its guide really
#    says that. This is the check that stops a cover drifting from its page —
#    `milestones` was three numbered dots and `paperwork` led with a currency
#    mark on a page whose first heading is "Why this page has no dollar
#    amounts on it".
content = pathlib.Path("lib/guide-content.tsx").read_text()
slugpage = pathlib.Path("app/charging-101/[slug]/page.tsx").read_text()
mapping = dict(re.findall(r'"?([a-z-]+)"?: "(\w+)",',
                          re.search(r"GUIDE_COVERS[^{]*\{(.*?)\};", slugpage, re.S).group(1)))
motifs = {m.group(1): m.group(2)
          for m in re.finditer(r"^  ([a-zA-Z]+): \{\n(.*?)^  \},", src, re.S | re.M)}
norm = lambda t: re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()
missing, wrong = [], []
for slug, motif in mapping.items():
    body = motifs.get(motif, "")
    t = re.search(r'teaches: "((?:[^"\\]|\\.)*)"', body)
    if not t:
        missing.append(motif); continue
    idea = norm(t.group(1).replace("\\u2013", "-").replace("\\u2014", "-"))
    guide = re.search(rf'"{slug}": \[(.*?)\n  \],', content, re.S)
    if guide and norm(guide.group(1)).find(idea) < 0:
        wrong.append((motif, idea[:40]))
check("every guide-backed cover declares what it teaches", not missing, str(missing))
check("every declared idea appears in its own guide's text", not wrong, str(wrong))

# the incentives page exists to avoid quoting amounts, so its cover must not
# a currency mark means text that RENDERS as one, not a JS template literal
rendered_text = lambda body: re.findall(r'text="([^"]*)"', body)
check("the incentives cover shows no currency mark",
      not any("$" in t for t in rendered_text(motifs.get("paperwork", ""))),
      str(rendered_text(motifs.get("paperwork", ""))))
# and the cost cover must still print no figure
check("the cost cover prints no price",
      not re.search(r'text="[^"]*\d', motifs.get("clock", "")))

# 2.
blk = re.search(r"^  connectors: \{.*?^  \},", src, re.S | re.M).group(0)
plugs = {k: (float(x), float(rr)) for x, rr, k in
         re.findall(r'<Plug x=\{(\d+)\} y=\{\d+\} r=\{(\d+)\} kind="(\w+)"', blk)}
labels = {t: float(x) for x, t in re.findall(r'<Label x=\{(\d+)\} y=\{\d+\} text="(CCS1|NACS)"', blk)}
check("CCS1 drawn larger than NACS", plugs["ccs1"][1] > plugs["nacs"][1],
      f"r {plugs['ccs1'][1]:.0f} vs {plugs['nacs'][1]:.0f}")
check("CCS1 on the left, as on the cabinet", plugs["ccs1"][0] < plugs["nacs"][0])
check("each label sits on its own plug",
      abs(labels["CCS1"] - plugs["ccs1"][0]) < 2 and abs(labels["NACS"] - plugs["nacs"][0]) < 2)

# 3. band: the 20/80 ticks must sit on the cell's actual fill edges
cell = re.search(r'<Cell x=\{(\d+)\} y=\{\d+\} w=\{(\d+)\} h=\{\d+\} from=\{([\d.]+)\} to=\{([\d.]+)\} />', src)
cxx, w, frm, to = float(cell[1]), float(cell[2]), float(cell[3]), float(cell[4])
ticks = sorted(float(x) for x in re.findall(r'\{ x: (\d+), t: "(?:20|80)" \}', src))
want = sorted([cxx - w/2 + frm*w, cxx - w/2 + to*w])
check("band ticks on the real fill edges", all(abs(a-b) < 1 for a, b in zip(ticks, want)),
      f"{ticks} vs {[round(v,1) for v in want]}")

# 4. climate: fills must equal the shared temperature constants
math_src = pathlib.Path("lib/charging-math.ts").read_text()
cold = float(re.search(r'cold: \{[^}]*factor: ([\d.]+)', math_src)[1])
hot  = float(re.search(r'hot: \{[^}]*factor: ([\d.]+)', math_src)[1])
check("climate fills come from TEMPERATURE_FACTORS",
      f"to={{TEMPERATURE_FACTORS.cold.factor}}" in src and f"to={{TEMPERATURE_FACTORS.hot.factor}}" in src,
      f"cold {cold}, hot {hot}")

# 5. curve: the plotted path must match min(avg vehicle curve, STATION_KW)
ev = pathlib.Path("lib/ev-models.ts").read_text()
curves = [{int(a): int(b) for a, b in re.findall(r"soc:(\d+),kw:(\d+)", g)}
          for g in re.findall(r"curve: \[(.*?)\]", ev, re.S)]
STATION = int(re.search(r"STATION_KW = (\d+)", math_src)[1])
def interp(c, soc):
    ks = sorted(c)
    if soc <= ks[0]: return c[ks[0]]
    if soc >= ks[-1]: return c[ks[-1]]
    for a, b in zip(ks, ks[1:]):
        if a <= soc <= b:
            return c[a] + (soc-a)/(b-a)*(c[b]-c[a])
delivered = lambda soc: sum(min(interp(c, soc), STATION) for c in curves)/len(curves)
vals = [(s, delivered(s)) for s in range(0, 101, 2)]
pk_soc, pk = max(vals, key=lambda t: t[1])
check("curve peaks while the battery is low", pk_soc <= 25, f"peak {pk:.0f} kW at {pk_soc}%")
check("curve tapers hard by 80%", delivered(80) < 0.45 * pk,
      f"{delivered(80):.0f} kW vs peak {pk:.0f}")
check("curve is derived, not hand-drawn",
      "const CURVE_PLOT" in src and "evModels" in src)

# ── the covers use the SHARED primitives, not a second local set ──────
check("no local car or charger survives in the covers",
      "function CarSide(" not in src and "function Unit(" not in src)
check("the covers import the shared primitives",
      'from "@/components/illustration/primitives"' in src)

# ── every element stands on the same ground line, by construction ──────
prim = pathlib.Path("components/illustration/primitives.tsx").read_text()
# CarSVG: wheels cy=53.5 r=9.6 in a 0 0 200 70 box
m = re.search(r'cy=\{([\d.]+)\} r="([\d.]+)" fill=\{ILLO\.tyre\}', prim)
wcy, wr = float(m[1]), float(m[2])
car_foot = (wcy + wr) / 70
declared = float(re.search(r"foot: ([\d.]+) / 70", src)[1]) / 70
check("the Car helper's foot matches CarSVG's real tyre contact",
      abs(car_foot - declared) < 0.002, f"{car_foot:.4f} vs declared {declared:.4f}")
# ChargerSVG: contact ellipse cy in a 0 0 48 88 box
ccy = float(re.search(r'<ellipse cx="24" cy="([\d.]+)"', prim)[1])
declared_u = float(re.search(r"foot: ([\d.]+) / 88", src)[1])
check("the Charger helper's foot matches ChargerSVG's contact shadow",
      abs(ccy - declared_u) < 0.01, f"{ccy} vs declared {declared_u}")

# ── every cable hangs under gravity ───────────────────────────────────
def lowest(x0, y0, x1, y1, sag):
    c1 = (x0 + (x1-x0)*0.3, y0 + sag)
    c2 = (x0 + (x1-x0)*0.7, y1 + sag*0.55)
    ys = []
    for k in range(51):
        t = k/50; u = 1-t
        ys.append(u**3*y0 + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t**3*y1)
    return max(ys)
calls = re.findall(r"sagPath\((\d+), (\d+), (\d+), (\d+), (\d+)\)", src)
check("every cable is drawn with the sag helper", len(calls) >= 4, f"{len(calls)} cables")
bad = []
for x0, y0, x1, y1, sag in calls:
    v = list(map(float, (x0, y0, x1, y1, sag)))
    if lowest(*v) <= max(v[1], v[3]) + 0.5:
        bad.append((x0, y0, x1, y1))
check("every cable sags BELOW both of its endpoints", not bad,
      "a cable that bulges upward is a suspension span, not a hanging cable")

# ── motion can actually be switched off ───────────────────────────────
check("covers hold the charger's SMIL still", "still />" in src or "still\n" in src,
      "SMIL ignores the reduced-motion CSS rule, so covers must not emit any")
check("cover motion is CSS, which the reduced-motion rule reaches",
      'className="hc-flow"' in src or "hc-draw" in src)

# ── colour discipline
illo = pathlib.Path("lib/illustration.ts").read_text()
TOK = dict(re.findall(r'^\s+([a-zA-Z]+): "(#[0-9A-Fa-f]{6})"', illo, re.M))

def lum(h):
    r, g, b = (int(h[i:i+2], 16) / 255 for i in (1, 3, 5))
    f_ = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f_(r) + 0.7152 * f_(g) + 0.0722 * f_(b)
PLATE = lum(TOK["stage"])
cr = lambda h: (max(lum(h), PLATE) + 0.05) / (min(lum(h), PLATE) + 0.05)

# every state colour must carry a label on the plate
for name in ("ok", "fault", "cold", "heat", "live"):
    check(f"state colour '{name}' is label-safe on the plate",
          name in TOK and cr(TOK[name]) >= 4.5,
          f"{TOK.get(name,'?')}  {cr(TOK[name]):.2f}:1" if name in TOK else "missing")

# every object ramp's DARKEST stop must still stand off the plate — the
# failure mode that made the car vanish, now guarded for all of them
RAMPS = {
    "cabinet": ("cabTop", "cabMid", "cabLow", "cabShade"),
    "paint":   ("paintTop", "paintMid", "paintLow"),
    "silver":  ("silverTop", "silverMid", "silverLow"),
    "graphite":("graphiteTop", "graphiteMid", "graphiteLow"),
}
for name, keys in RAMPS.items():
    missing = [k for k in keys if k not in TOK]
    if missing:
        check(f"{name} ramp is defined", False, f"missing {missing}"); continue
    worst = min(cr(TOK[k]) for k in keys)
    check(f"{name} ramp's darkest stop stays off the plate", worst >= 1.8,
          f"{worst:.2f}:1")

# one meaning, one colour: no two state tokens may collide
states = {n: TOK[n] for n in ("ok", "fault", "cold", "heat", "live") if n in TOK}
check("no two state colours are the same", len(set(states.values())) == len(states))

# green means free, orange means charging — never swapped, the way the
# connector names were
prim_src = pathlib.Path("components/illustration/primitives.tsx").read_text()
bars = re.search(r"fill=\{free \? ILLO\.(\w+) : lit \? ILLO\.(\w+) : ILLO\.(\w+)\}", prim_src)
check("a free bay's light is green and a charging one's is orange",
      bool(bars) and bars[1] == "ok" and bars[2] == "live",
      f"free->{bars[1]}, charging->{bars[2]}" if bars else "pattern not found")

# no colour may enter the covers except through the palette
toks_used = set(re.findall(r"ILLO\.([a-zA-Z]+)", src))
unknown = sorted(t for t in toks_used if t not in TOK)
check("every ILLO token used actually exists", not unknown, str(unknown))
raw = set(re.findall(r'"(#[0-9A-Fa-f]{6})"', src))
ALLOWED_RAW = {"#101E36", "#16233B"}   # two pre-existing gradient stops
check("no new raw hex literals in the covers", raw <= ALLOWED_RAW,
      f"unexpected {sorted(raw - ALLOWED_RAW)}")

# the car must not dissolve: every stop of its gradient clears the plate
stops = re.findall(r'id=\{`\$\{id\}-car`\}.*?</linearGradient>', src, re.S)
if stops:
    used = re.findall(r"stopColor=\{ILLO\.(\w+)\}", stops[0])
    worst = min(cr(TOK[u]) for u in used if u in TOK)
    check("no stop of the car gradient dissolves into the plate", worst >= 1.6,
          f"darkest stop {worst:.2f}:1")

print()
print(f"  {len(fails)} failing" if fails else "  ALL ACCURACY CHECKS PASS")
sys.exit(1 if fails else 0)
