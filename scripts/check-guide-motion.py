#!/usr/bin/env python3
"""Re-derive the motion rules for the figures inside guide articles.

Sibling to check-cover-accuracy.py, and the same idea: the covers are guarded
because a picture can quietly stop agreeing with its page, and these are
guarded because motion can quietly stop agreeing with itself.

What went wrong here before this existed, all of it found by measurement
rather than by reading:

  - The whole set had exactly one piece of real motion. framer-motion was
    imported by 1 of 16 files, EASE_OUT by 0, and the hc-* vocabulary by 0.
  - Readout, the shared numeric display, had no tabular-nums while the slider
    label twelve lines below it in the same file did — so every calculator's
    number jittered sideways as it changed, and hard-jumped as it changed.
  - charging-curve-chart bound onMouseMove only, so it was inert on every
    phone: no crosshair, no readout, no indication it was interactive at all.
  - trip-planner keyed a variable-length list by index, so its legs were
    destroyed and rebuilt in a single frame on every slider tick.
  - minutesBetweenSoc, a 1,440-step integration, ran once per pointer pixel.
"""
import math
import pathlib
import re
import sys

fails = []


def check(name, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")
    if not ok:
        fails.append(name)


read = lambda p: pathlib.Path(p).read_text()


def code(src: str) -> str:
    """The source with comments removed.

    These files explain themselves, and several of the explanations name the
    very thing the rule forbids — "it was transition-all", "this bound
    onMouseMove". Checking raw text flags the apology as if it were the
    offence, so the rules below read code and the prose is left alone.
    """
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    return re.sub(r"(?<!:)//[^\n]*", "", src)
SRC = {p: p.read_text() for p in pathlib.Path("components").glob("*.tsx")}
CARD = "breakout not-prose my-8 rounded-lg border border-paper-300"
SHELL = pathlib.Path("components/guide-figure.tsx")

# The set enrols itself: anything using the shell, or hand-rolling the card the
# shell exists to own. A new figure that hand-rolls it is caught precisely
# because it hand-rolled it.
figures = {p: code(s) for p, s in SRC.items() if "<GuideFigure" in s or CARD in s}
figures.pop(SHELL, None)
check("the figure set derives itself rather than being listed", len(figures) >= 14,
      f"{len(figures)} figures found")

# ── one shell ─────────────────────────────────────────────────────────
strays = sorted(p.name for p, s in figures.items() if "<GuideFigure" not in s)
check("every figure uses the shared shell", not strays,
      f"{strays} hand-roll the card, so they get no scroll reveal")
# Only the CARD's ground. connector-diagram uses bg-white on a marker dot over
# a photograph, which is a different thing entirely and correct there.
ground = sorted(p.name for p, s in figures.items()
                if re.search(rf"{re.escape(CARD)}[^\"]*bg-white", s))
check("no figure invents its own card ground", not ground,
      f"{ground} — the shell is bg-paper (#FBFAF8); bg-white is a different card")

# ── one curve ─────────────────────────────────────────────────────────
mot = read("lib/motion.ts")
css = read("app/globals.css")
house = re.search(r"EASE_OUT = \[([\d., ]+)\]", mot)[1].replace(" ", "")
plate = re.search(r"--hc-ease:\s*cubic-bezier\(([\d., ]+)\)", css)[1].replace(" ", "")
check("the figures' easing IS the covers' easing", house == plate, f"{house} vs {plate}")
check("the shell imports the curve rather than retyping it",
      "EASE_OUT" in read(SHELL) and "[0.16, 1, 0.3, 1]" not in code(read(SHELL)))
for p, s in sorted(figures.items()):
    check(f"{p.name} invents no easing of its own",
          not re.search(r"cubic-bezier", s) and "lib/gsap" not in s,
          "EASE_OUT and the springs come from lib/motion.ts; gsap defaults to "
          "power3.out, which is a different curve entirely")
    check(f"{p.name} animates named properties, not all of them",
          "transition-all" not in s,
          "transition-all animates colour and border alongside the one "
          "property that was meant")
    # THE HOLE THE RULE ABOVE HAD, AND WHY IT MATTERED.
    # The cubic-bezier grep can only see a curve an author TYPED. Tailwind's
    # transition-* utilities compile to cubic-bezier(0.4, 0, 0.2, 1) —
    # Material's curve, not ours — and they do it at build time, in a string
    # that appears nowhere in the source. So five figures animated off-house
    # for months while this file reported PASS on every run.
    tw = sorted(set(re.findall(
        r"\btransition-(?:\[[^\]]+\]|colors|opacity|transform|shadow)\b", s)))
    check(f"{p.name} takes the house curve, not Tailwind's", not tw,
          f"{tw} compile to cubic-bezier(0.4,0,0.2,1). hc-tint and hc-move are "
          "the same idea on var(--hc-ease), and cost nothing")

# The rule above reads the source. This one reads what actually shipped, so a
# utility nobody thought of cannot slip past a list of utility names. Scoped to
# our own stylesheet: the maplibre chunk carries its vendor's curves, which are
# not ours to police, and it identifies itself unambiguously.
def norm(c: str) -> str:
    """Minified CSS writes 0.16 as .16, so compare the numbers, not the text."""
    return ",".join(str(float(x)) for x in c.replace(" ", "").split(","))


built = pathlib.Path(".next/static/chunks")
sheets = [f for f in built.glob("*.css")] if built.exists() else []
if not sheets:
    print("  SKIP  only the house curve reaches the built stylesheet "
          "— no build found, run `npm run build`")
else:
    foreign = set()
    for f in sheets:
        out = f.read_text(errors="ignore")
        if ".maplibregl-map" in out:
            continue
        for m in re.finditer(r"cubic-bezier\(([\d.,\s-]+)\)", out):
            if norm(m.group(1)) != norm(house):
                foreign.add(m.group(1).strip())
    # A BUDGET, NOT A BAN — for now. The figures are clean; the rest of the
    # site still has ~110 Tailwind transition-* utilities across the marketing
    # pages, and each one compiles to a curve nobody typed. This number may go
    # down and may never go up, which is the useful property: it turns an
    # invisible drift into a thing you have to look at to make worse.
    check("no NEW off-house curve reaches the built stylesheet",
          len(foreign) <= 2,
          f"{sorted(foreign)} shipped — every one is a transition-* utility "
          "compiling to its own easing. hc-tint and hc-move replace them")

# ── a readout may not change dimension mid-flight ─────────────────────
for p, s in sorted(figures.items()):
    for call in re.findall(r"<Readout\b.*?/>", s, re.S):
        check(f"{p.name}: no readout picks its unit with a ternary",
              not re.search(r"unit=\{[^}]*\?", call),
              "59 min/wk and 1.0 hr/wk are the same quantity, so a spring "
              "between them renders every value in between — labelled with "
              "whichever unit happens to be showing. '50.3 hr/wk' is what that "
              "looks like, and the model never produced it")
check("a change of unit is a jump, not a journey",
      "unitChanged" in code(read(SHELL)) and "mv.jump" in code(read(SHELL)),
      "the first fix for this re-keyed the component so React would mount a "
      "fresh one; React never removed the old span and they accumulated, one "
      "per crossing, until the readout read '21 1.0 59 1.0 hr/wk'")

# ── a JS animator is not spent on an entrance ─────────────────────────
# The exemptions are the four figures where a finger is driving or a list
# reflows, which CSS cannot do, plus the shell's animated counter.
DRIVEN = {"trip-planner.tsx", "soc-window.tsx", "troubleshooter.tsx",
          "incentive-finder.tsx"}
for p, s in sorted(figures.items()):
    if p.name in DRIVEN:
        continue
    check(f"{p.name} does not import an animation library to fade in",
          "framer-motion" not in s,
          "the figure shell already carries the scroll-in reveal, and the "
          "[data-draw]/[data-fill]/[data-bar] vocabulary in globals.css is on "
          "var(--hc-ease), reduced-motion gated, and costs 0 kB")

# ── the springs are physical, not chosen by feel ──────────────────────
springs = re.findall(
    r"export const (SPRING_\w+) = \{[^}]*?stiffness:\s*([\d.]+),\s*damping:\s*([\d.]+),"
    r"\s*mass:\s*([\d.]+)", mot, re.S)
check("the spring vocabulary is small enough to hold in your head",
      2 <= len(springs) <= 5, f"{len(springs)} springs")
for name, k, c, m in springs:
    k, c, m = float(k), float(c), float(m)
    zeta = c / (2 * math.sqrt(k * m))
    settle = 4 / (zeta * math.sqrt(k / m))
    # A readout that overshoots displays, for a few frames, a number the model
    # never produced. For that one spring the damping is a correctness
    # constraint rather than a taste one.
    if name in ("SPRING_READOUT", "SPRING_TRACK"):
        check(f"{name} cannot overshoot the value it reports", zeta >= 1.0,
              f"zeta = {zeta:.3f}")
    check(f"{name} settles inside 400ms", settle < 0.40, f"{settle * 1000:.0f}ms")

# ── numbers ───────────────────────────────────────────────────────────
shell = read(SHELL)
check("the shared readout uses tabular figures", "tabular-nums" in shell,
      "without it a readout going 9 to 10 shifts sideways as it changes")
check("the shared readout animates its value", "AnimatedNumber" in shell)
check("the animated number owns its own reduced-motion gate",
      "useReducedMotion" in shell,
      "gated in the primitive, so no caller can forget")
# The property, not the mechanism: whatever React renders into that span must
# be frozen at mount, so React never has a reason to touch the node again.
# Rendering {value} there means React rewrites the TARGET on every parent
# render and the spring writes the CURRENT value back a frame later — under a
# dragged slider, a visibly vibrating number, which is worse than the hard
# jump the animation was added to remove.
check("the animated number does not let React own its text node",
      "useState(() =>" in code(shell)
      and not re.search(r"<span ref=\{ref\}>\{value", code(shell)),
      "the rendered string must be computed once at mount and never change")
check("the readout takes an explicit precision",
      "decimals?" in shell,
      "inferred precision renders 4.833333333333333 with fifteen decimals, and "
      "pre-formatting to a string to avoid that drops out of the animation")

# ── touch parity, and the per-frame budget ────────────────────────────
for p, s in sorted(figures.items()):
    # The attribute, not the word — a file may well explain in a comment why
    # it no longer uses one.
    check(f"{p.name} is not mouse-only", "onMouseMove={" not in s,
          "pointer events cover cursor and thumb alike; onMouseMove leaves the "
          "figure completely inert on a phone")
    check(f"{p.name} keys lists by identity, not by index",
          not re.search(r"key=\{(i|idx|index)\}", s),
          "an index key makes a list that changes length teleport")

check("the charging integration is memoised",
      "timingCache" in read("lib/charging-math.ts"),
      "a 1,440-step Euler integration ran once per pointer pixel across five "
      "figures, for a result that depends only on the model")

# ── the map degrades honestly ─────────────────────────────────────────
#
# These used to guard a Google map that had NEVER RENDERED: it needed a browser
# key AND a provisioned vector Map ID, neither existed, and so every visitor
# got the keyless iframe the checks were guarding. The map that replaced it
# needs no key at all, so the questions change — but the shape of the question
# does not: what does this do when the outside world is not there?
mapsrc = read("components/station-map.tsx")
hub = read("components/hub-map.tsx")
ocm = read("lib/openchargemap.ts")

check("the basemap needs no key at all",
      "tiles.openfreemap.org" in hub
      and not re.search(r"[?&](api_?key|access_token|key)=", hub),
      "OpenFreeMap serves vector tiles keylessly. A key in here is a key that "
      "will one day be missing — which is exactly how the Google map died")
check("the map never renders on the server",
      "ssr: false" in mapsrc and "next/dynamic" in mapsrc,
      "maplibre-gl touches window at module scope")
check("the map is tinted from the palette, not from typed hex",
      "ILLO." in hub and not re.findall(r'"#[0-9A-Fa-f]{6}"', code(hub)),
      "the stock OpenFreeMap styles are light; a literal here is a colour that "
      "does not answer to lib/illustration.ts")
check("the map repaints before it paints",
      'm.on("styledata"' in hub,
      "maplibre paints the background as soon as the style parses, long before "
      "`load` — tinting on load meant a flash of near-white in a 500px panel")
check("the map resizes after the panel it lives in finishes animating",
      "ResizeObserver" in hub,
      "find-your-hub animates the map's wrapper on scroll-into-view; a canvas "
      "sized during that animation stays the wrong size for good")
check("one finger still scrolls the page",
      "cooperativeGestures" in hub,
      "the map this replaced set gestureHandling='cooperative' deliberately; a "
      "full-width map that eats one-finger drag traps the reader on a phone")
# Scoped to the ERROR HANDLER. isStyleLoaded() is a perfectly good guard
# elsewhere — the refit effect uses it correctly. It is only wrong here.
err_handler = re.search(r'm\.on\("error".*?\}\);', code(hub), re.S)
check("a failed tile is not a failed map",
      err_handler is not None
      and "styleArrived" in err_handler.group(0)
      and "isStyleLoaded" not in err_handler.group(0),
      "isStyleLoaded() is false for the whole startup window, so testing it in "
      "the error handler latched the failure panel on the first 404 forever")
check("the map is not announced as an application",
      'role="application"' not in hub,
      "that tells assistive tech to forward every keystroke into the widget")
check("there is a text route to what the map shows",
      "sr-only" in hub)
check("the map is created once, not on every render",
      "NO_EXTRA" in hub,
      "a default [] parameter allocates a new array per render, which rebuilt "
      "the map before it could ever request a tile")

check("OpenChargeMap is proxied, never called from the browser",
      "server-only" in ocm
      and "OPENCHARGEMAP" not in hub
      and "NEXT_PUBLIC_OPENCHARGEMAP" not in read(".env.example"),
      "a NEXT_PUBLIC_ key is a published key")
check("the OpenChargeMap key travels as a header, not in a URL",
      "X-API-Key" in ocm and 'searchParams.set("key"' not in ocm,
      "a key in a query string lands in every log and every Referer")
check("the site works with no OpenChargeMap key",
      "if (!key) return { configured: false" in ocm,
      "OCM answers a keyless request with 403 and a PLAIN TEXT body, so a "
      "keyless call that reaches res.json() throws rather than degrading")
check("repeated pans do not each cost a new OpenChargeMap call",
      "Math.round(n * 100) / 100" in ocm,
      "unsnapped coordinates make every pixel of pan a distinct cache key on "
      "somebody else's free quota")
check("the map credits the data it draws",
      "OpenStreetMap" in hub or "openfreemap" in hub.lower())
check("the OpenChargeMap key is documented",
      "OPENCHARGEMAP_API_KEY" in read(".env.example"))

# ── states ────────────────────────────────────────────────────────────
st = read("lib/stations.ts")
check("upcoming locations carry a state and coordinates",
      "UpcomingLocation" in st and "centroid" in st.lower(),
      "they were bare city strings, one of which (Round Rock) is in Texas")
check("state grouping is derived from the station data",
      "statesWithCoverage" in st,
      "so adding a station is still the only step to make it appear")
check("the state pages are in the sitemap",
      "locations/state/" in read("app/sitemap.ts"))
check("structured data names the state, not only the cities",
      '"State"' in read("app/layout.tsx"))

print()
print(f"  {len(fails)} failing" if fails else "  ALL GUIDE MOTION CHECKS PASS")
sys.exit(1 if fails else 0)
