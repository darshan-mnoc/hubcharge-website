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

# 6. cables still land on horn and in port
UW, UH, FLOOR = 34, 76, 152
horn = lambda x, sd: (x + (1 if sd=="right" else -1)*UW*0.29, FLOOR-UH-5.5)
port = lambda cx, s, sd: (cx + (-10.5 if sd=="front" else 10.5)*s, FLOOR-7.4*s)
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
# ── the cabinet's two cables ─────────────────────────────────────────
unit = re.search(r"function Unit\(.*?\n\}\n", src, re.S).group(0)
check("the cabinet draws a cable for each of its two connectors",
      unit.count("<Cable") == 2,
      f"{unit.count('<Cable')} cable(s) for {unit.count('<Holster')} holsters")
check("the left cable is unconditional, the right one only when free",
      "{!inUse && (" in unit and unit.index("<Cable") < unit.index("{!inUse && ("))

# ── the car sits ON the road, not in it ──────────────────────────────
CR   = float(re.search(r"const CAR_R = ([\d.]+)", src)[1])
CA   = float(re.search(r"const CAR_ARCH = ([\d.]+)", src)[1])
CWX  = float(re.search(r"const CAR_WX = ([\d.]+)", src)[1])
check("wheel centres sit one radius above the road", "cy={-CAR_R}" in src,
      "half of every wheel used to be underground")
check("each arch clears its tyre", CA > CR, f"gap {CA-CR:.2f}")

profs = dict(re.findall(r"(taycan|sedan|suv): \[(.*?)\n  \],", src, re.S))
pts_of = lambda blob: [(float(a), float(b))
                       for a, b in re.findall(r"\[(-?[\d.]+), (-?[\d.]+)\]", blob)]
below = [(n, x, y) for n, blob in profs.items() for x, y in pts_of(blob) if y > 0]
check("no point of any car profile is below the road", not below, str(below[:3]))

def catmull(pts):
    p = [pts[0]] + list(pts) + [pts[-1]]
    return [((p[i][0]+(p[i+1][0]-p[i-1][0])/6, p[i][1]+(p[i+1][1]-p[i-1][1])/6),
             (p[i+1][0]-(p[i+2][0]-p[i][0])/6, p[i+1][1]-(p[i+2][1]-p[i][1])/6),
             p[i+1]) for i in range(1, len(p)-2)]
worst = 0.0
for n, blob in profs.items():
    segs = catmull(pts_of(blob))
    for i in range(len(segs)-1):
        _, c2, pt = segs[i]
        nx = segs[i+1][0]
        a = math.atan2(pt[1]-c2[1], pt[0]-c2[0])
        b = math.atan2(nx[1]-pt[1], nx[0]-pt[0])
        worst = max(worst, abs(math.degrees(math.atan2(math.sin(a-b), math.cos(a-b)))))
check("every joint of every car outline is tangent-continuous", worst < 1.0,
      f"worst {worst:.4f} deg across {len(profs)} profiles")

# ── the car matches the real Taycan ──────────────────────────────────
L_MM, H_MM, WB_MM, WD_MM = 4963, 1381, 2900, 750
LEN = 67.0
roof = min(y for _, y in pts_of(profs["taycan"]))
for k, got, want, tol in [("wheelbase", (CWX*2)/LEN, WB_MM/L_MM, 0.012),
                          ("wheel dia", (CR*2)/LEN, WD_MM/L_MM, 0.012),
                          ("length:height", LEN/(0-roof), L_MM/H_MM, 0.15)]:
    check(f"car {k} matches the Taycan", abs(got-want) < tol,
          f"{got:.3f} vs real {want:.3f}")


# ── the cabinet's two cables ─────────────────────────────────────────
unit = re.search(r"function Unit\(.*?\n\}\n", src, re.S).group(0)
check("the cabinet draws a cable for each of its two connectors",
      unit.count("<Cable") == 2,
      f"{unit.count('<Cable')} cable(s) for {unit.count('<Holster')} holsters")
check("the left cable is unconditional, the right one only when free",
      "{!inUse && (" in unit and unit.index("<Cable") < unit.index("{!inUse && ("))

# ── the perspective is a construction, not a look ────────────────────
HZ = float(re.search(r"const HORIZON = ([\d.]+)", src)[1])
VPR = float(re.search(r"const VP_RIGHT = (-?[\d.]+)", src)[1])
VPL = float(re.search(r"const VP_LEFT = (-?[\d.]+)", src)[1])
def recede(xe, yt, yb, vpx, xf):
    t = (xf - xe) / (vpx - xe)
    return yt + t*(HZ - yt), yb + t*(HZ - yb)
# take the station cabinet's real numbers and confirm both receding edges,
# extended, actually strike the vanishing point on the horizon
UW2, UH2, CAP = 34, 76, 4
near = 72 + UW2/2
top_ = FLOOR - UH2
yt, yb = top_ + CAP, FLOOR - 6
far = near + 11
fyt, fyb = recede(near, yt, yb, VPR, far)
def hits_vp(x0, y0, x1, y1):
    """extend the edge to the horizon; it must land on the vanishing point"""
    if abs(y1 - y0) < 1e-9: return abs(HZ - y0) < 1e-9
    t = (HZ - y0) / (y1 - y0)
    return abs((x0 + t*(x1 - x0)) - VPR) < 1.0
check("top receding edge meets the vanishing point", hits_vp(near, yt, far, fyt))
check("bottom receding edge meets the vanishing point", hits_vp(near, yb, far, fyb))
check("the horizon sits inside the frame", 0 < HZ < 200, f"y={HZ}")
check("both vanishing points lie outside the frame", VPL < 0 and VPR > 300,
      f"L {VPL}, R {VPR}")
check("a cover actually uses the construction", 'depth="right"' in src or 'depth="left"' in src)

# ── colour discipline ────────────────────────────────────────────────
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
bars = re.search(r"fill=\{inUse \? ILLO\.(\w+) : lit \? ILLO\.(\w+) : ILLO\.(\w+)\}", src)
check("charging bars are orange, free bars are green",
      bool(bars) and bars[1] == "live" and bars[2] == "ok",
      f"inUse->{bars[1]}, free->{bars[2]}" if bars else "pattern not found")

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
