#!/usr/bin/env python3
"""What each route actually costs a visitor.

`next build` under Turbopack prints no size table, so the only honest source
is the prerendered HTML: every <script src> in it is JS the browser fetches
before the page is interactive. Sizes are uncompressed, which is what parse
and execute scale with; Brotli transfer is roughly a quarter of these.

Run it before and after a change and diff the two.
"""
import json, pathlib, re, sys, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRV = ROOT / ".next/server/app"
STATIC = ROOT / ".next/static"
if not SRV.exists():
    sys.exit("no build found — run `npm run build` first")

size = {}
for f in STATIC.rglob("*"):
    if f.is_file():
        size[f.name] = f.stat().st_size

SCRIPT = re.compile(r'<script[^>]+src="([^"]+)"')
LINK = re.compile(r'<link[^>]+href="(/_next/static/[^"]+\.css)"')

rows = []
for html in sorted(SRV.rglob("*.html")):
    body = html.read_text(errors="ignore")
    js = {pathlib.Path(m).name for m in SCRIPT.findall(body) if "/_next/static/" in m}
    css = {pathlib.Path(m).name for m in LINK.findall(body)}
    route = "/" + str(html.relative_to(SRV)).removesuffix(".html").removesuffix("/index")
    route = route.replace("//", "/")
    rows.append((route, sum(size.get(n, 0) for n in js), len(js),
                 sum(size.get(n, 0) for n in css)))

rows.sort(key=lambda r: -r[1])
total_static = sum(f.stat().st_size for f in STATIC.rglob("*") if f.is_file())

# Chunks nobody's HTML references are fetched on demand (dynamic imports).
referenced = set()
for html in SRV.rglob("*.html"):
    referenced |= {pathlib.Path(m).name for m in SCRIPT.findall(html.read_text(errors="ignore"))}
lazy = sorted(((n, s) for n, s in size.items()
               if n.endswith(".js") and n not in referenced and s > 20_000),
              key=lambda x: -x[1])

out = {
    "routes": [{"route": r, "js": j, "chunks": c, "css": s} for r, j, c, s in rows],
    "static_total": total_static,
    "baseline_js": min(r[1] for r in rows),
    "lazy": [{"chunk": n, "bytes": s} for n, s in lazy[:8]],
}
if "--json" in sys.argv:
    print(json.dumps(out, indent=1)); sys.exit()

kb = lambda b: f"{b/1024:8.1f} KB"
print(f"\n  {'route':<42} {'JS':>11}  chunks   CSS")
print("  " + "─" * 74)
for r, j, c, s in rows[:16]:
    print(f"  {r:<42} {kb(j)}  {c:>5}  {kb(s)}")
if len(rows) > 16:
    print(f"  … {len(rows)-16} more routes")
print("  " + "─" * 74)
print(f"  {'baseline (lightest route)':<42} {kb(out['baseline_js'])}")
print(f"  {'.next/static total':<42} {kb(total_static)}")
print("\n  Fetched on demand (in no page's HTML):")
for n, s in lazy[:6]:
    print(f"    {kb(s)}  {n}")
print()
