#!/usr/bin/env python3
"""Diff two runs of measure-weight.py --json."""
import json, sys
a = json.load(open(sys.argv[1])); b = json.load(open(sys.argv[2]))
A = {r["route"]: r for r in a["routes"]}; B = {r["route"]: r for r in b["routes"]}
kb = lambda n: f"{n/1024:.1f} KB"
rows = []
for k in sorted(set(A) & set(B)):
    d = B[k]["js"] - A[k]["js"]
    if abs(d) > 512: rows.append((d, k, A[k]["js"], B[k]["js"]))
rows.sort()
print(f"\n  {'route':<42} {'before':>10} {'after':>10} {'change':>11}")
print("  " + "─" * 76)
seen = set()
for d, k, x, y in rows:
    sig = (x, y)
    if sig in seen and len([r for r in rows if (r[2], r[3]) == sig]) > 3:
        continue
    seen.add(sig)
    print(f"  {k:<42} {kb(x):>10} {kb(y):>10} {kb(d):>11}")
    n = len([r for r in rows if (r[2], r[3]) == sig])
    if n > 3: print(f"  {'  (and '+str(n-1)+' more routes, same figures)':<42}")
print("  " + "─" * 76)
print(f"  {'.next/static total':<42} {kb(a['static_total']):>10} {kb(b['static_total']):>10} "
      f"{kb(b['static_total']-a['static_total']):>11}")
only_a = set(A) - set(B); only_b = set(B) - set(A)
if only_a: print(f"  routes gone: {sorted(only_a)}")
if only_b: print(f"  routes new:  {sorted(only_b)}")
print()
