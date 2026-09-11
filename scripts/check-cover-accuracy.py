"""Re-derive every geometric claim in the covers from the shipped source."""
import re, math, pathlib, subprocess, json, sys
src = pathlib.Path("components/guide-cover.tsx").read_text()
FLOOR = int(re.search(r"const FLOOR = (\d+)", src)[1])
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
    # `etiquette:` and `weather:` are UNQUOTED keys in guide-content.tsx, so
    # the quoted pattern found nothing for them and the `if guide` guard below
    # silently skipped two of the eleven covers — the check reported PASS on a
    # set it had never looked at.
    guide = re.search(rf'"?{slug}"?: \[(.*?)\n  \],', content, re.S)
    if guide and norm(guide.group(1)).find(idea) < 0:
        wrong.append((motif, idea[:40]))
check("every guide-backed cover declares what it teaches", not missing, str(missing))
unreadable = [s for s in mapping if not re.search(rf'"?{s}"?: \[', content)]
check("every guide-backed cover's body is actually readable by this check",
      not unreadable, str(unreadable) + "  — a skipped cover reports PASS having checked nothing")
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
         # Decimals allowed: these are millimetres scaled into cover units, and
         # pinning them to integers is how a corrected 21.25 silently stopped
         # parsing and took the whole connectors block with it.
         re.findall(r'<Plug x=\{([\d.]+)\} y=\{[\d.]+\} r=\{([\d.]+)\} kind="(\w+)"', blk)}
labels = {t: float(x) for x, t in re.findall(r'<Label x=\{(\d+)\} y=\{\d+\} text="(CCS1|NACS)"', blk)}
check("CCS1 drawn larger than NACS", plugs["ccs1"][1] > plugs["nacs"][1],
      f"r {plugs['ccs1'][1]:.0f} vs {plugs['nacs'][1]:.0f}")
check("CCS1 on the left, as on the cabinet", plugs["ccs1"][0] < plugs["nacs"][0])
check("each label sits on its own plug",
      abs(labels["CCS1"] - plugs["ccs1"][0]) < 2 and abs(labels["NACS"] - plugs["nacs"][0]) < 2)

# 3. band: the 20/80 ticks must sit on the cell's actual fill edges
# Trailing props are allowed — this check is here to verify the NUMBERS the
# ticks derive from, not to freeze the element's styling.
cell = re.search(r'<Cell x=\{(\d+)\} y=\{\d+\} w=\{(\d+)\} h=\{\d+\} from=\{([\d.]+)\} to=\{([\d.]+)\}[^/]*/>', src)
# Guarded: this regex is how the tick positions get verified at all, so if the
# call is ever reformatted onto several lines the run must FAIL and say why,
# not raise a TypeError three lines further down.
check("the band cover still declares a one-line Cell the ticks derive from",
      cell is not None, "keep <Cell .../> on one line, in this prop order")
cxx, w, frm, to = (float(cell[1]), float(cell[2]), float(cell[3]), float(cell[4])) if cell else (0, 0, 0, 0)
ticks = sorted(float(x) for x in re.findall(r'\{ x: (\d+), t: "(?:20|80)" \}', src))
want = sorted([cxx - w/2 + frm*w, cxx - w/2 + to*w])
check("band ticks on the real fill edges", all(abs(a-b) < 1 for a, b in zip(ticks, want)),
      f"{ticks} vs {[round(v,1) for v in want]}")

# ...and that the RECTANGLE agrees with them. The line above compares the tick
# to the same arithmetic the tick was written from, so it would pass happily
# while Cell drew the fill somewhere else entirely — which it did, by 2.4
# units, until the fraction was made to map across the full width.
cell_fn = re.search(r"function Cell\(.*?\n\}\n", src, re.S).group(0)
check("the band's lit rectangle starts where its tick says it does",
      "const fx = (f: number) => l + w * f;" in cell_fn
      and "x={fx(from)}" in cell_fn,
      "the inset inner width put the drawn edge 2.4 units off the mark beside it")

# 4. climate: fills must equal the shared temperature constants
math_src = pathlib.Path("lib/charging-math.ts").read_text()
motifs_all_early = {m.group(1): m.group(2)
                    for m in re.finditer(r"^  ([a-zA-Z]+): \{\n(.*?)^  \},", src, re.S | re.M)}
TEMPS = re.findall(r'label: "([^"]+)"', math_src)[:3]
cold = float(re.search(r'cold: \{[^}]*factor: ([\d.]+)', math_src)[1])
hot  = float(re.search(r'hot: \{[^}]*factor: ([\d.]+)', math_src)[1])
# All THREE, now. The cover used to draw cold and hot only, which left a 62%
# bar beside an 88% bar and no visible reference for either to be a share of.
mild = float(re.search(r'mild: \{[^}]*factor: ([\d.]+)', math_src)[1])
climate_body = motifs_all_early.get("climate", "")
missing_t = [k for k in ("cold", "mild", "hot") if f"TEMPERATURE_FACTORS.{k}" not in climate_body]
check("climate shows all three temperature factors", not missing_t,
      f"missing {missing_t}; cold {cold}, mild {mild}, hot {hot}")
check("climate's fills are computed from the factor, not typed",
      "f.factor" in climate_body and "* f.factor" in climate_body,
      "the bar height must be the factor, so the picture cannot drift from the arithmetic")
check("climate prints the real temperatures the factors carry",
      "f.label" in climate_body,
      f"charging-math labels them {TEMPS}")

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
hol_cx, hol_cy = (float(v) for v in
    re.search(r'<circle cx="(\d+)" cy="(\d+)" r="7.4" fill=\{ILLO\.shadow\}', prim).groups())
port_cx, port_cy = (float(v) for v in
    re.search(r'<circle cx="(\d+)" cy="(\d+)" r="2" fill=\{ILLO\.live\}', prim).groups())
FOOT_U = float(re.search(r"foot: ([\d.]+) / 88", src)[1])
FOOT_C = float(re.search(r"foot: ([\d.]+) / 70", src)[1])

def holster(x, h):
    return (x, FLOOR - h * (FOOT_U - hol_cy) / 88)
def car_port(x, w, flip):
    h = w * 70 / 200
    dx = (port_cx - 100) / 200 * w
    return (x + (-dx if flip else dx), FLOOR - h * (FOOT_C - port_cy) / 70)

calls = re.findall(
    r"sagPath\(holsterAt\((\d+), (\d+)\), portAt\((\d+), (\d+)(, true)?\)", src)

def lowest(x0, y0, x1, y1, sag):
    c1 = (x0 + (x1-x0)*0.3, y0 + sag)
    c2 = (x0 + (x1-x0)*0.7, y1 + sag*0.55)
    ys = []
    for k in range(51):
        t = k/50; u = 1-t
        ys.append(u**3*y0 + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t**3*y1)
    return max(ys)
calls = re.findall(r"sagPath\((\d+), (\d+), (\d+), (\d+), (\d+)\)", src)
anchored = re.findall(
    r"sagPath\(holsterAt\((\d+), (\d+)\), portAt\((\d+), (\d+)(, true)?\), (\d+)\)", src)
bad = []
for hx, hh, cx_, cw, flip, sag in anchored:
    a = holster(float(hx), float(hh))
    b = car_port(float(cx_), float(cw), bool(flip))
    if lowest(a[0], a[1], b[0], b[1], float(sag)) <= max(a[1], b[1]) + 0.5:
        bad.append((hx, cx_))
check("every cable sags BELOW both of its endpoints", not bad,
      "a cable that bulges upward is a suspension span, not a hanging cable")

# ── cables begin at a holster and end at a port ───────────────────────
#
# This check existed, caught exactly this bug, and I deleted it along with the
# old primitives — after which every live cable drifted 40-58 units off both
# anchors again. The anchors are read from primitives.tsx rather than restated
# here, so the two cannot diverge.
check("every live cable is anchored, not typed",
      len(anchored) == src.count("live animated"),
      f"{len(anchored)} anchored of {src.count('live animated')} live cables")
off = []
for hx, hh, cx_, cw, flip in calls:
    a = holster(float(hx), float(hh))
    b = car_port(float(cx_), float(cw), bool(flip))
    if a[1] < 100 or b[1] < 100:      # both must sit low on the scene
        off.append((hx, cx_))
check("cable anchors land on the hardware, not in the sky", not off, str(off))

# no <Cable> may simply stop in open air
# ── A HAND-TYPED LEAD MUST END ON SOMETHING ──────────────────────────
#
# The only rule here used to be that the path string contained a "C", which
# the NACS lead on the connectors cover satisfied while ending fifteen units
# above the board it was supposed to plug into and eight units past the end
# of it. "Has a curve in it" is not "is attached to anything".
#
# Anchored leads go through sagPath(holsterAt(...), portAt(...)) and are
# checked above. Everything else is typed, and a typed lead now has to name
# the thing it lands on: leadPath([x,y], [x, BOARD_Y]) reads the board's own
# top edge, so moving the board moves both leads with it.
loose = re.findall(r'<Cable d="(M[^"]+)"', src)
check("no cable is left with a typed, unterminated path",
      not loose,
      f"{len(loose)} hand-typed cable path(s): {loose}. Use sagPath() between "
      "two anchors, or leadPath() to a named landing like BOARD_Y")

leads = re.findall(r"leadPath\(\[([\d.]+), ([\d.]+)\], \[([\w.\[\]]+), ([\w.\[\]]+)\]\)", src)
check("every typed lead lands on a named edge, not a number",
      len(leads) == src.count("leadPath(["),
      "a lead whose end y is a literal is a lead that stops agreeing with the "
      "hardware the moment the hardware moves")
for x0, y0, x1, land in leads:
    # The landing must be a NAME. A literal is a number that stops agreeing
    # with the hardware the moment the hardware moves, which is how the NACS
    # relief ended up fifteen units off its own board.
    check(f"the lead from ({x0},{y0}) lands on a named point",
          not land.replace(".", "").isdigit(),
          f"ends at the literal {land}")


# a lead must reach the nearer flank, not cross the whole car
crossing = []
for hx, hh, cx_, cw, flip, sag in anchored:
    hxv, cxv = float(hx), float(cx_)
    px = car_port(cxv, float(cw), bool(flip))[0]
    on_left = px < cxv
    if (hxv < cxv) != on_left:
        crossing.append((hx, cx_))
check("every lead reaches the flank facing the charger", not crossing,
      "otherwise the cable is drawn straight through the bodywork")

# ── motion: entrance plays once, ambient loops, and the budget is real ──
#
# The rule here used to be "there is exactly one looping class in the whole
# file". That was a proxy for "nothing pulls the eye while somebody reads",
# and it bought the quiet honestly — but it bought it at the price of
# seventeen of twenty-one covers being a frozen image 1.6 seconds after load.
# A masthead that finishes moving before the reader has finished arriving is
# a still picture with a wind-up on it.
#
# The rule now says what it always meant, and says it PER COVER, which is the
# only scope a reader ever has: one cover, on one page, at one time.
motifs_all = {m.group(1): m.group(2)
              for m in re.finditer(r"^  ([a-zA-Z]+): \{\n(.*?)^  \},", src, re.S | re.M)}
check("the cover registry still parses", len(motifs_all) >= 21, f"{len(motifs_all)} motifs")
css = pathlib.Path("app/globals.css").read_text()
ENTRANCE = {"hc-rise", "hc-draw", "hc-fill", "hc-pop"}
AMBIENT  = {"hc-flow", "hc-standby", "hc-breathe", "hc-drift", "hc-meter"}
# the parallax frame: layout and compositing, not animation
FRAME = {"hc-cover", "hc-plane", "hc-atmo", "hc-sheen"}
# Not animations: a hover changing colour or nudging an icon has no timeline
# to play, and writing it as a keyframe would make it uninterruptible. These
# exist so no component reaches for Tailwind's transition-* utilities, which
# compile to cubic-bezier(0.4,0,0.2,1) at BUILD time — Material's curve, in a
# string no author ever types and no grep of the source can see.
def rule_of(sheet, c):
    """The body of `.c { ... }`, whether it is written on one line or many."""
    m = re.search(rf"^\.{c}\s*\{{(.*?)\}}", sheet, re.S | re.M)
    return m.group(1) if m else ""


def rule(c):
    return rule_of(css, c)


TRANSITION = {"hc-move", "hc-tint"}
# The site chrome. The nav and the footer render on all 60 routes and were the
# only framer-motion in the shared shell, which put a 171 kB chunk on every
# route's critical path — emitted three times over — to run entrance slides and
# hover scales. These replace it. hc-reveal and hc-sheet exist because an EXIT
# animation is the one thing CSS cannot do to an element React has unmounted:
# both surfaces stay mounted and animate on a data attribute instead.
SHELL = {"hc-drop", "hc-press", "hc-reveal", "hc-sheet"}
# The full name, not the first hyphenated word: the old pattern read
# `.hc-lift-in {` as `hc-lift` and then failed to match, so a whole family of
# modifier classes was invisible to the rule that exists to see all of them.
declared = {c for c in re.findall(r"^\.(hc-[a-z-]+?)(?::[a-z-]+)?[\s,]*\{", css, re.M)}
# Modifiers (-sm, -in, -grow) belong to the class they modify and are checked
# with it rather than being listed separately.
MODIFIER = {"hc-press-sm", "hc-lift-in", "hc-grow", "hc-grow-sm", "hc-nudge",
            "hc-raise", "hc-raise-grow"}
declared -= FRAME | MODIFIER
check("the hc-* animation vocabulary is exactly what globals.css declares",
      declared == ENTRANCE | AMBIENT | TRANSITION | SHELL,
      f"css has {sorted(declared)}, script expects {sorted(ENTRANCE | AMBIENT | TRANSITION | SHELL)}")

for c in sorted(SHELL):
    r = rule_of(css, c)
    check(f"chrome '{c}' costs no JavaScript", "animation" in r or "transition" in r)
check("the drawer can animate OUT, not just in",
      'visibility' in rule_of(css, "hc-sheet"),
      "conditional rendering cannot animate an exit, which is the whole reason "
      "AnimatePresence was here; keeping it mounted means visibility has to do "
      "the work of removing it from the tab order and the a11y tree")
check("an open surface is only open when it says so",
      '.hc-sheet[data-open="true"]' in css and '.hc-reveal[data-open="true"]' in css)


for c in sorted(ENTRANCE):
    check(f"entrance '{c}' plays once", "infinite" not in rule(c))
    check(f"entrance '{c}' settles visible under reduced motion",
          "backwards" in rule(c) or "forwards" in rule(c),
          "an entrance with no fill mode snaps back to its hidden `from` state "
          "and the element is invisible for good")
for c in sorted(AMBIENT):
    check(f"ambient '{c}' loops", "infinite" in rule(c))
for c in sorted(TRANSITION):
    r = rule(c)
    check(f"'{c}' is a transition, not a timeline", "transition" in r and "animation" not in r,
          "a hover has to be interruptible; a keyframe animation is not")
    check(f"'{c}' takes the house curve", "var(--hc-ease)" in r,
          "the entire point of these two classes is to be the thing reached "
          "for INSTEAD of Tailwind's, so a hard-coded curve here is worse than "
          "no class at all")

# Reduced motion parks an animation on its 100% frame, so 100% has to BE the
# resting state. An ambient pulse written 0%,100%{0.45} 50%{1} settles DIM.
for c in sorted(AMBIENT):
    kf = re.search(rf"@keyframes {c}\s*\{{(.*?)\}}\s*$", css, re.S | re.M)
    if not kf:
        continue
    end_op = re.search(r"(?:^|[,{ ])100%[^{]*\{\s*opacity:\s*([\d.]+)", kf.group(1))
    check(f"ambient '{c}' settles at full strength, not mid-cycle",
          end_op is None or float(end_op.group(1)) >= 0.95,
          f"settles at {end_op.group(1)}" if end_op else "no opacity keyframe")

staticc = [n for n, b in motifs_all.items()
           if not any(f'"{k}"' in b for k in ENTRANCE | AMBIENT) and "animated" not in b]
check("every cover has at least one motion", not staticc, str(staticc))

# The budget. It is a taste limit and a paint limit at the same number: SVG
# children are not compositor-promoted, so an animated <g> repaints its own
# bounding box every frame.
over = [(n, u) for n, b in motifs_all.items()
        for u in [sum(b.count(f'"{c}"') for c in AMBIENT) + b.count("animated")]
        if u > 2]
check("no cover runs more than two ambient loops", not over, str(over))

fast = []
for c in sorted(AMBIENT - {"hc-flow"}):
    d = re.search(r"animation:[^;]*?([\d.]+)s", rule(c))
    if d and float(d.group(1)) < 3.0:
        fast.append((c, d.group(1)))
check("only the live-cable flow loops faster than three seconds", not fast, str(fast))

cable_fn = re.search(r"function Cable\(.*?\n\}\n", src, re.S).group(0)
check("the fast flow loop still lives only inside Cable, gated on live power",
      src.count('"hc-flow"') == 1 and '"hc-flow"' in cable_fn
      and "animated && live" in cable_fn)

# Directly, and — the case that slipped through the first time — wrapped in a
# group whose only child is type. Both are the same offence.
wrapped = re.findall(r'className="hc-(?:flow|standby|breathe|drift|meter)"[^>]*>\s*((?:<(?:Label|Wordmark|Display)\b[^>]*/>\s*)+)</g>', src)
check("no ambient class is ever applied to type",
      not re.search(r"<(Label|Wordmark|Display)[^>]*hc-(flow|standby|breathe|drift|meter)", src)
      and not wrapped,
      f"type that moves while you read is the one thing a reader cannot tune out {wrapped}")

# ── motion can actually be switched off ───────────────────────────────
check("covers hold the charger's SMIL still", "still />" in src or "still\n" in src,
      "SMIL ignores the reduced-motion CSS rule, so covers must not emit any")
check("cover motion is CSS, which the reduced-motion rule reaches",
      "<animate" not in src and "animateMotion" not in src)
check("the parallax planes are switched off for reduced motion",
      re.search(r"prefers-reduced-motion[^}]*?\}.*?\.hc-plane\s*\{\s*\n?\s*transform: none", css, re.S)
      or ("transform: none !important" in css and ".hc-plane" in css),
      "the blanket rule only shortens transitions; it does not remove them")

# ── one curve, and it is the site's ───────────────────────────────────
mot = pathlib.Path("lib/motion.ts").read_text()
house = re.search(r"EASE_OUT = \[([\d., ]+)\]", mot).group(1).replace(" ", "")
var = re.search(r"--hc-ease:\s*cubic-bezier\(([\d., ]+)\)", css).group(1).replace(" ", "")
check("the cover easing IS the house easing from lib/motion.ts",
      house == var, f"motion.ts {house} vs css {var}")
rogue = [c for c in sorted(ENTRANCE)
         if re.search(r"cubic-bezier|\bease-out\b|\bease-in\b(?!-out)", rule(c))]
check("no entrance animation invents its own curve", not rogue, str(rogue))

# ── a dash reveal only works if the dash IS the path ──────────────────
#
# --len was typed as 420 against a path 203.1 units long, so the stroke stayed
# completely invisible until the offset fell below 217: the first 52% of a
# 1.4s reveal showed nothing at all, and then the curve snapped in.
check("the curve's dash length is derived from the plotted path, not typed",
      "CURVE_PLOT.len" in src and "pts.reduce" in src)

def path_len(d):
    toks = re.findall(r"([MLCHV])([^MLCHVZ]*)", d)
    x = y = 0.0
    total = 0.0
    for cmd, arg in toks:
        n = [float(v) for v in re.findall(r"-?[\d.]+", arg)]
        if cmd == "M":
            x, y = n[0], n[1]
        elif cmd == "L":
            for i in range(0, len(n), 2):
                total += math.hypot(n[i] - x, n[i + 1] - y); x, y = n[i], n[i + 1]
        elif cmd == "H":
            for v in n: total += abs(v - x); x = v
        elif cmd == "V":
            for v in n: total += abs(v - y); y = v
        elif cmd == "C":
            for i in range(0, len(n), 6):
                p0 = (x, y); p1 = (n[i], n[i+1]); p2 = (n[i+2], n[i+3]); p3 = (n[i+4], n[i+5])
                prev = p0
                for k in range(1, 25):
                    t = k / 24
                    m_ = 1 - t
                    px = (m_**3)*p0[0] + 3*(m_**2)*t*p1[0] + 3*m_*(t**2)*p2[0] + (t**3)*p3[0]
                    py = (m_**3)*p0[1] + 3*(m_**2)*t*p1[1] + 3*m_*(t**2)*p2[1] + (t**3)*p3[1]
                    total += math.hypot(px - prev[0], py - prev[1]); prev = (px, py)
                x, y = p3
    return total

for name in sorted(motifs_all):
    body = motifs_all[name]
    for m_ in re.finditer(r'd="([^"]+)"[^/]*?className="hc-draw"[^/]*?"--len" as string\]: "(\d+)"', body, re.S):
        real, declared_len = path_len(m_.group(1)), float(m_.group(2))
        check(f"{name}'s --len matches the path it traces",
              abs(real - declared_len) / real < 0.08,
              f"declared {declared_len:.0f}, path is {real:.1f}")

# ── A COVER IS NOT A MAP ──────────────────────────────────────────────
#
# Everything that used to live here asserted a projection: that the corridors
# cover drew real OpenStreetMap centrelines to one scale on both axes, that
# the declared bbox matched the geometry, and that Alhambra landed under 30%
# across the band while Fontana landed past 65%. Every one of those rules
# passed, and the drawing was still the problem — two pale squiggles on navy
# with no streets, no ground and nothing around the pins. Accurate, and not a
# map. A reader shown a picture of a map reads it as a map and then finds it
# answers none of a map's questions.
#
# The real map now lives in the guide's body, as OpenStreetMap tiles you can
# pan (components/corridor-map.tsx), and on the homepage station finder. A
# 300x200 masthead is server-rendered SVG with no JavaScript at all, so it
# cannot be one — which means the honest thing for it to do is stop trying.
# The rule that replaces all of them is therefore the opposite of the old
# ones: no cover may imitate a map.
BAKED_GEOMETRY = ("corridor-geometry", "texas-geometry")
for name in BAKED_GEOMETRY:
    check(f"no cover projects {name} into a drawing of a map",
          name not in src,
          "a masthead cannot pan, zoom or show what is around a site; "
          "components/corridor-map.tsx renders real tiles instead")
check("the covers hold no projection of their own",
      "Math.cos" not in src or "milesPerDeg" not in src,
      "an equirectangular projection in a 300x200 decorative plate is a map "
      "pretending to be an illustration, or the reverse")

# The real map, wherever it is rendered, must credit OpenStreetMap. The tiles
# are ODbL and the attribution is a condition of using them, not a courtesy.
mapsrc = pathlib.Path("components/hub-map.tsx").read_text()
check("the real map credits OpenStreetMap",
      "attributionControl" in mapsrc,
      "OpenFreeMap serves OSM data under ODbL; the credit is a licence term")
check("nothing is parked on top of the attribution control",
      "bottom-3 right-3" not in mapsrc,
      "MapLibre puts its attribution bottom-right, and the Directions pill "
      "sat on it — clipping the credit mid-sentence on every map on the site")

# ── the plate agrees with the objects standing on it ──────────────────
key = re.search(r'id=\{`\$\{id\}-key`\} cx="(\d+)%" cy="(\d+)%"', src)
check("the plate's key light is upper-left, like every object standing in it",
      key and int(key[1]) < 50 and int(key[2]) < 50,
      "CarSVG offsets its contact shadow right and highlights the beltline top; "
      "ChargerSVG puts its brushed edge on the left face")
vig = re.search(r'id=\{`\$\{id\}-vig`\} cx="(\d+)%" cy="(\d+)%"', src)
check("the vignette is centred on the key light, not on the frame",
      vig and int(vig[1]) < 50 and int(vig[2]) < 50)
check("the plate carries a horizon rather than a hairline",
      "-horizon`}" in src)
check("the plate is dithered against 8-bit banding",
      "feTurbulence" in src and 'type="fractalNoise"' in src,
      "stage->skyMid across a 400px masthead steps the blue channel every 57px, "
      "and no number of extra gradient stops changes that")
tile = re.search(r'id=\{`\$\{id\}-noise`\}[^>]*?width=\{(\d+)\} height=\{(\d+)\}', src)
check("the grain tile divides the plate exactly, so it cannot seam",
      tile and 300 % int(tile[1]) == 0 and 200 % int(tile[2]) == 0,
      f"tile {tile[1]}x{tile[2]}" if tile else "no pattern found")

# ── nothing floats ────────────────────────────────────────────────────
#
# The header comment has claimed "everything sits on FLOOR, so no cover
# floats" since round one. It was true of twelve of the twenty-one.
# ── ONE CONNECTOR GEOMETRY, NOT TWO ───────────────────────────────────
#
# The cover drew its own connector faces as ratios of a radius while
# components/connector-diagram.tsx dimensioned them in millimetres from the
# published standards. They disagreed on three things that matter: the cover
# filled CCS1's two AC pins solid orange where a DC cable leaves them EMPTY,
# it arched NACS's three small pins where they sit in a row, and it drew the
# pair at 1.43:1 when the drawn bodies are 48mm against 34mm.
geom = pathlib.Path("lib/connector-geometry.ts").read_text()
check("the cover's connector pins come from the shared table",
      "connector-geometry" in src and "CCS1_PINS" in src and "NACS_PINS" in src,
      "guide-cover.tsx must render lib/connector-geometry.ts rather than "
      "retyping pin positions")
check("the figure draws from the same table",
      "connector-geometry" in pathlib.Path("components/connector-diagram.tsx").read_text(),
      "two drawings of one object, from two sources, is how they drifted")
check("a DC cable's AC pins are unpopulated in the shared table",
      geom.count("empty: true") == 2 and 'role: "AC"' in geom,
      "CCS1's two AC contacts are not present on a DC cable; drawing them as "
      "live contacts says power moves through pins that are not there")
check("the connector faces are dimensioned in millimetres",
      "J1772_FACE_R = 43.5 / 2" in geom,
      "ratios of a radius cannot be checked against a standard")

# ── NEARER IS LARGER ──────────────────────────────────────────────────
#
# The road-trip cover drew two map pins on one ground plane: r=4 at y=146 and
# r=7 at y=124. The higher one is further away and was drawn nearly twice the
# size of the nearer one, so the picture's own perspective ran backwards.
#
# Screen y increases downward, so on any single ground plane a LOWER object is
# nearer and must not be smaller than one above it.
for name, b in motifs_all.items():
    pins = [(float(y), float(r)) for x, y, r in
            re.findall(r"<Pin x=\{([\d.]+)\} y=\{([\d.]+)\} r=\{([\d.]+)\}", b)]
    bad = [(a, c) for i2, a in enumerate(pins) for c in pins[i2 + 1:]
           if (a[0] - c[0]) * (a[1] - c[1]) < 0]
    check(f"{name} draws nearer things larger",
          not bad,
          f"{bad} — the lower pin is nearer and must not be the smaller one")

# ── A CHARGING GUIDE'S COVER CONTAINS CHARGING ────────────────────────
#
# milestones was three cars on a road and nothing else: the only one of the
# twenty-one with no charger, no plug and no cable anywhere in frame, on the
# guide a new owner reads first. The grounding rule below accepted a lone
# <Car> as "stands on the floor", so nothing caught it.
# Scoped to covers that draw CARS. A map, a battery chart or a stack of
# paperwork has no business containing a charger, and demanding one would just
# push the next author into decorating. But a scene with vehicles in it and no
# charging anywhere is a picture of driving, which is the one thing this
# company does not sell.
# portAt() marks the inlet on the car itself, which is how the `fleet` cover
# shows charging — its subject is which socket you have, so the socket is the
# hardware. milestones had none of these: not a charger, not a cable, not even
# its own cars' ports.
HARDWARE = ("<Charger", "<Plug", "<Cable", "portAt(")
for name, b in motifs_all.items():
    if "<Car " not in b:
        continue
    check(f"{name} shows what the cars are there for",
          any(h in b for h in HARDWARE),
          f"draws cars and none of {HARDWARE} — milestones was three cars on "
          "a road with no charger, plug or cable anywhere in frame, on the "
          "guide a new owner reads first")

# ── ORANGE MEANS POWER IS MOVING ──────────────────────────────────────
for name, b in motifs_all.items():
    if "energy: true" not in b:
        continue
    check(f"{name} has something live to justify its bloom",
          "live" in b or "active" in b or "ILLO.live" in b,
          "energy: true paints the orange power bloom over the plate; a cover "
          "with nothing live in it is claiming an event that is not happening")

GROUNDED = ("<Charger", "<Car ", "<Roof", "<Valet", "<Plinth", 'ground: "road"')
def stands(b):
    # an object, a dais, a road — or a leg run explicitly down to FLOOR
    return any(g in b for g in GROUNDED) or re.search(r"V\$\{FLOOR\}|,\$\{FLOOR\}", b)
floating = [n for n, b in motifs_all.items() if not stands(b)]
check("every cover stands on the floor line", not floating, str(floating))

# ── a free bay never pools orange ─────────────────────────────────────
for name, b in motifs_all.items():
    if "freePools" in b:
        continue
    if "pools:" in b and re.search(r"<Charger[^/]*free[^/]*/>", b) and not re.search(r"<Charger[^/]*active", b):
        check(f"{name} does not stand a free bay in an orange pool", False,
              "orange means power is moving; a free bay's own light blade is green")
check("free bays pool green and charging bays pool orange",
      "-poolfree`" in src and "ILLO.ok" in src.split("-poolfree`")[1][:400])

# ── type ──────────────────────────────────────────────────────────────
layout = pathlib.Path("app/layout.tsx").read_text()
loaded = set(re.findall(r'"(\d00)"', re.search(r"Plus_Jakarta_Sans\(\{(.*?)\}\)", layout, re.S).group(1)))
asked = set(re.findall(r"fontWeight=\{(\d+)\}", src))
check("every weight the covers ask for is actually loaded",
      asked <= loaded, f"asked {sorted(asked)}, layout loads {sorted(loaded)}")
for fn in ("Wordmark", "Label", "Display"):
    body = re.search(rf"function {fn}\(.*?\n\}}\n", src, re.S)
    check(f"{fn} names its own face rather than inheriting one",
          body and "--font-" in body.group(0),
          "inheritance works inside the app shell and nowhere else")
check("only Display sets the serif face", src.count("--font-fraunces") == 1)
mins = float(re.search(r"SERIF_MIN_UNITS = ([\d.]+)", src)[1])
check("the serif floor is the 20px rule at the narrowest masthead",
      abs(mins - 20 * 300 / 288) < 0.6,
      f"{mins} units; 20px at a 320px viewport with px-4 is {20*300/288:.2f}")
sizes = [float(x) for x in re.findall(r"<Display[^>]*size=\{([\d.]+)\}", src)]
check("no serif is set below the floor", all(v >= mins for v in sizes), str(sizes))

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
# Both surviving literals became tokens when the plate was rebuilt, so this
# can finally demand zero — and catch the three forms the old pattern missed:
# 3-digit hex, 8-digit hex, and rgba().
raw = set(re.findall(r'"(#[0-9A-Fa-f]{3,8})"', src)) | set(re.findall(r'"(rgba?\([^)]*\))"', src))
check("no raw colour literal in the covers", not raw, f"unexpected {sorted(raw)}")

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
