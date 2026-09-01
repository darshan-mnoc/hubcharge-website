"""Re-derive every geometric claim in the covers from the shipped source."""
import re, math, pathlib, subprocess, json, sys
src = pathlib.Path("components/guide-cover.tsx").read_text()
fails = []
def check(name, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")
    if not ok: fails.append(name)

# 1. clock: the lit arc must be exactly ten minutes = 60 degrees
m = re.search(r'd="M(\d+),(\d+) A(\d+),\d+ 0 0 1 ([\d.]+),([\d.]+)"', src)
sx, sy, r, ex, ey = float(m[1]), float(m[2]), float(m[3]), float(m[4]), float(m[5])
cx, cy = sx, sy + r
deg = math.degrees(math.atan2(ex - cx, cy - ey))
check("clock arc is ten minutes", abs(deg - 60) < 0.5, f"{deg:.1f}deg = {deg/6:.1f} min")

# 2. connectors: CCS1 must be the larger coupler AND on the left
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

# 6. cables still land on horn and in port
UW, UH, FLOOR = 34, 76, 152
horn = lambda x, sd: (x + (1 if sd=="right" else -1)*UW*0.29, FLOOR-UH-5.5)
port = lambda cx, s, sd: (cx + (-10.5 if sd=="front" else 10.5)*s, FLOOR-7*s)
for n, ux, cx2, cs, ps, hs in [("station",72,190,1.15,"front","right"),
                               ("arrival",222,112,1.05,"rear","left"),
                               ("bays",66,140,0.86,"front","right")]:
    b = re.search(rf"^  {n}: \{{.*?^  \}},", src, re.S|re.M).group(0)
    d = re.search(r'<Cable d="([^"]+)" live', b).group(1)
    v = [float(t) for t in re.findall(r"-?\d+\.?\d*", d)]
    h, pt = horn(ux, hs), port(cx2, cs, ps)
    check(f"{n} cable horn->port",
          abs(v[0]-h[0])<0.6 and abs(v[1]-h[1])<0.6
          and abs(v[-2]-pt[0])<=2.1*cs and abs(v[-1]-pt[1])<=2.1*cs)

# 7. nothing crops
check("preserveAspectRatio cannot crop", 'preserveAspectRatio="xMidYMid meet"' in src)
# 8. no stroked path left without fill="none" that would fill an area
def encloses_area(d):
    """H/V-only subpaths and single segments enclose nothing."""
    return len(re.findall(r"[LlCcQqSsAa]", d)) >= 2
risky = []
for m in re.finditer(r"<path\b[^>]*?/>", src, re.S):
    t = m.group(0)
    if "stroke=" not in t or "fill=" in t: continue
    d = (re.search(r'd=\{?"?([^"`]+)', t) or [None, ""])[1]
    if not encloses_area(d): continue
    # inherited fill from the nearest enclosing group
    before = src[:m.start()]
    g = None
    for gm in re.finditer(r"<g [^>]*>", before): g = gm.group(0)
    if g and 'fill="none"' in g: continue
    risky.append(d[:40])
check("no path fills its own corner", not risky, f"{len(risky)} risky")
print()
print(f"  {len(fails)} failing" if fails else "  ALL ACCURACY CHECKS PASS")
sys.exit(1 if fails else 0)
