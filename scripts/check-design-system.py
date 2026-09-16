"""Hold the site to the design system it already documents.

WHY THIS EXISTS
tailwind.config.ts and app/globals.css carry a real design system — every
colour with its measured contrast ratio, a type scale, an 8px card-radius
ceiling, one easing token, a budget on the ornamental tertiary. What they
could not do is notice when a file ignored them. Two of the system's OWN
utilities had hardcoded Material's easing curve while a comment three hundred
lines away complained about exactly that, and sixteen pieces of text sat below
the contrast floor because the floor was never written down anywhere.

WHAT THIS IS NOT
It is not a style opinion. Every rule below is either a value the config
already declares, or arithmetic (the contrast maths is computed here, not
asserted, so the floor cannot drift from the ratio it is supposed to mean).

SANCTIONED EXCEPTIONS
Some violations are correct. The phone mockup uses rounded-[2.75rem] because
it is drawing a physical object, and the journey illustration uses text-[10px]
because it is drawing a picture of a device screen at a distance — holding
either to the reading scale would break the thing it exists to do. Both are
declared in ALLOW below, with the reason, because the previous guard written
for this repo was too blunt and failed a map, a chart and a document.
"""
import re, pathlib, sys

ROOTS = ["app", "components", "lib"]
fails = []

def check(name, ok, detail=""):
    print(f"  {'PASS' if ok else 'FAIL'}  {name}{('  — ' + detail) if detail else ''}")
    if not ok:
        fails.append(name)

def sources():
    for root in ROOTS:
        for p in pathlib.Path(root).rglob("*"):
            if p.suffix in (".tsx", ".ts", ".css") and p.is_file():
                yield p

def strip_comments(text, suffix):
    """Comments are prose, not code.

    The first run of this script failed on app/globals.css because the comment
    that DOCUMENTS the sanctioned text-[9px] exception contains the string
    text-[9px]. A guard that reads its own documentation as a violation will
    train people to ignore it.
    """
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    if suffix != ".css":
        text = re.sub(r"^\s*//.*$", "", text, flags=re.M)
    return text

FILES = {p: strip_comments(p.read_text(), p.suffix) for p in sources()}
check("the source tree is readable by this check",
      len(FILES) > 60, f"{len(FILES)} files — a silent glob failure reports PASS on nothing")

# ── sanctioned exceptions, each with the reason it is correct ──────────────
ALLOW = {
    "radius": {
        "components/phone-charging-ui.tsx":
            "concentric device radii — tailwind.config.ts: 'arbitrary values "
            "intentionally opt out for physical-object shapes'",
    },
    "microtype": {
        "components/phone-charging-ui.tsx":
            "status bar and address bar inside the phone frame, same reason",
    },
    "glyph": {
        "app/plan-your-charge/page.tsx":
            "the accordion's + marker is UI furniture at a tap size, not type",
        "components/faq-search.tsx": "same accordion marker",
        "components/ui/cta-button.tsx":
            "explicit transition property list with the house curve pinned inline",
    },
}
def allowed(kind, path):
    return str(path) in ALLOW[kind]

def hits(pattern, kind=None):
    out = []
    for p, s in FILES.items():
        if kind and allowed(kind, p):
            continue
        for m in re.finditer(pattern, s):
            line = s[: m.start()].count("\n") + 1
            out.append(f"{p}:{line} {m.group(0)}")
    return out

# ── 1. colour ─────────────────────────────────────────────────────────────
# Tailwind's default ramps were the escape hatch every off-system colour used.
DEFAULT_RAMPS = (
    r'\b(?:bg|text|border|from|to|via|ring|fill|stroke|decoration|divide|outline)-'
    r'(?:gray|slate|zinc|neutral|stone|amber|yellow|green|emerald|teal|cyan|sky|'
    r'blue|indigo|violet|purple|fuchsia|pink|rose|red|orange|lime)-[0-9]{2,3}\b'
)
h = hits(DEFAULT_RAMPS)
check("no Tailwind default-palette colour utilities", not h, "; ".join(h[:4]))

h = [x for x in hits(r'(?:bg|text|border|fill|stroke|from|to|via)-\[#[0-9A-Fa-f]{3,8}\]')]
check("no hardcoded hex in a class name", not h, "; ".join(h[:4]))

# Every colour token referenced must exist in the config.
cfg = pathlib.Path("tailwind.config.ts").read_text()
declared = set()
for fam in re.finditer(r"(\w[\w-]*): \{([^}]*)\}", cfg):
    name, body = fam.group(1), fam.group(2)
    for k in re.findall(r"'?([\w-]+)'?:\s*'#", body):
        declared.add(f"{name}-{k}".replace("-DEFAULT", ""))
    if "DEFAULT" in body:
        declared.add(name)
for solo in re.findall(r"'([\w-]+)': '#[0-9A-Fa-f]{6}'", cfg):
    declared.add(solo)
declared |= {"white", "black", "transparent", "current", "inherit"}

# ── 2. contrast floor on the navy ground, derived not asserted ────────────
def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
def lum(rgb):
    return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
def ratio(fg, bg):
    a, b = lum(fg), lum(bg)
    lo, hi = sorted((a, b))
    return (hi + 0.05) / (lo + 0.05)

INK900, ONDARK, WHITE = (10, 25, 47), (224, 227, 229), (255, 255, 255)
def composite(fg, bg, alpha):
    return tuple(alpha * f + (1 - alpha) * b for f, b in zip(fg, bg))

# The lowest opacity of `on-dark` that still clears 4.5:1 on ink-900.
FLOOR = next(o for o in range(20, 101)
             if ratio(composite(ONDARK, INK900, o / 100), INK900) >= 4.5)
CONVENTION = 55
print(f"        AA floor for text-on-dark on ink-900 is /{FLOOR} "
      f"({ratio(composite(ONDARK, INK900, FLOOR/100), INK900):.2f}:1); "
      f"the site's convention is /{CONVENTION} "
      f"({ratio(composite(ONDARK, INK900, CONVENTION/100), INK900):.2f}:1) — "
      f"prefer the convention, the floor is what fails the build")

bad = []
for p, s in FILES.items():
    if allowed("microtype", p):
        continue
    for m in re.finditer(r'text-(on-dark|white)/([0-9]{1,3})\b', s):
        tok, op = m.group(1), int(m.group(2))
        fg = ONDARK if tok == "on-dark" else WHITE
        r = ratio(composite(fg, INK900, op / 100), INK900)
        if r < 4.5:
            line = s[: m.start()].count("\n") + 1
            bad.append(f"{p}:{line} {m.group(0)} = {r:.2f}:1")
check(f"no text-on-dark/white below the {FLOOR}% AA floor", not bad, "; ".join(bad[:4]))

# ── 3. shape and type scale ───────────────────────────────────────────────
h = hits(r'rounded-(?:xl|2xl|3xl|full-\w+|\[[^\]]+\])', "radius")
check("no border radius above the 8px card ceiling", not h, "; ".join(h[:4]))

h = hits(r'text-\[[0-9.]+(?:px|rem)\]', "microtype")
check("no font size outside the .text-* scale", not h, "; ".join(h[:4]))

h = hits(r'\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b', "glyph")
check("no Tailwind font-size utility bypassing the scale", not h, "; ".join(h[:4]))

# ── 4. motion ─────────────────────────────────────────────────────────────
raw = pathlib.Path("app/globals.css").read_text()
css = strip_comments(raw, ".css")
stray = []
for m in re.finditer(r'cubic-bezier\([^)]*\)', css):
    decl = css[max(0, m.start() - 60):m.start()]
    if "--hc-ease" in decl:
        continue  # the one definition
    stray.append(f"line {css[:m.start()].count(chr(10)) + 1} {m.group(0)}")
check("globals.css states its easing once, as --hc-ease",
      not stray,
      "; ".join(stray[:4]) + "  (Material's curve is cubic-bezier(0.4,0,0.2,1))")

# ── 5. the ornamental budget ───────────────────────────────────────────────
# brass is capped at "<=2 ornamental moments per page" by the config. Per-page
# composition is a runtime question, so this only reports per-component use as
# a pressure gauge rather than failing.
brass = {str(p): len(re.findall(r'\bbg-brass\b', s)) for p, s in FILES.items()
         if re.search(r'\bbg-brass\b', s)}
print(f"        brass rules per component (page budget is 2): "
      + ", ".join(f"{k.split('/')[-1]}={v}" for k, v in sorted(brass.items())))

print()
if fails:
    print(f"{len(fails)} FAILED: " + "; ".join(fails))
    sys.exit(1)
print("all design-system checks passed")
