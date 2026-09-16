# Design system

This file is an **index, not a copy**. Every value lives in
`tailwind.config.ts` or `app/globals.css`, with the reason it exists in a
comment beside it. Restating a hex code here would create a second source of
truth, which is the drift `/impeccable normalize` exists to remove.

What *is* here: where to look, and the handful of rules that are written down
nowhere else.

## Where the tokens live

| What | Where |
|---|---|
| Colour ramps, with measured contrast ratios | `tailwind.config.ts` → `theme.extend.colors` |
| Type scale (`.text-display` … `.text-footnote`) | `app/globals.css`, "Type scale" block |
| Radius ceiling, shadows, max-widths | `tailwind.config.ts` → `borderRadius`, `boxShadow`, `maxWidth` |
| Surfaces (`.card-light`, `.card`, `.glass`) | `app/globals.css` |
| Form fields (`.field`, `.field-dark`) | `app/globals.css` |
| Motion (`--hc-ease`, `.hc-tint`, `.hc-move`, `.hc-*`) | `app/globals.css` |
| Illustration palette | `lib/illustration.ts` (`ILLO`) |

## Rules

**Colour.** Only tokens. Tailwind's default ramps (`gray-`, `slate-`, `amber-`
…) are banned outright and currently have zero uses. No hex in a class name.

**`ILLO` is for drawings, not text.** `ILLO.seam` is `ink-500`, which is a
*light-ground* text token (6.46:1 on white, 2.73:1 on navy). It was being used
for status text on a navy card.

**Contrast floor on navy.** Derived, not asserted — `scripts/check-design-system.py`
computes it. On `ink-900`, `text-on-dark` needs **≥52%** opacity to clear
4.5:1; the site's convention is **/55** (4.91:1). Prefer the convention. Where
the intent is "secondary" rather than "faint", use `text-muted-dark` (6.23:1),
which is the token the system provides for exactly that.

**Opacities multiply.** A parent `opacity` and a child `rgba()` compound. Pick
one mechanism.

**Radius.** 4px base, **8px ceiling** on cards. `rounded-full` is fine for
pills and chips.

**Type.** Use the `.text-*` scale. The display serif is only for ≥20px and
never above weight 500 — a bold serif at 60px reads "clearance sale".

**Motion.** `--hc-ease` is the only easing. Tailwind's `transition-*` utilities
compile to Material's `cubic-bezier(0.4,0,0.2,1)` at build time, where a source
grep cannot see it — prefer `.hc-tint` / `.hc-move`. Two of this system's own
utilities had Material's curve hardcoded while a comment elsewhere complained
about it.

**Brass is rationed.** The warm tertiary is budgeted at **≤2 ornamental
moments per page** — a rule under a section eyebrow, a hairline divider.
Footnote asterisks are disclosure markers and do not count. The guard prints
per-component usage as a pressure gauge; the per-page total is a composition
question, so count it on the rendered route.

**Targets.** WCAG 2.5.8 wants 24×24 CSS px. A standalone caption-sized link is
19px tall, so use `.tap-target`, which grows the hit area with an overlay and
moves no layout. Links **inline inside a sentence** are exempt and must not get
it.

## Sanctioned exceptions

These are correct and must not be "normalised". They are also declared in
`scripts/check-design-system.py` → `ALLOW`, with the same reasons.

| Where | What | Why |
|---|---|---|
| `components/phone-charging-ui.tsx` | `rounded-[2.75rem]` and friends | concentric radii of a physical object; the config says arbitrary values intentionally opt out for these |
| `components/journey-battery.tsx`, `components/phone-charging-ui.tsx` | `text-[9px]` / `text-[10px]` | simulated device UI seen at a distance — "a picture of text, not text". Holding it to the reading scale breaks the illusion |
| `app/plan-your-charge/page.tsx`, `components/faq-search.tsx` | `text-xl` on the accordion `+` | UI furniture at a tap size, not type |
| `components/ui/cta-button.tsx` | explicit `transition-[…]` property list | the house curve is pinned inline via `ease-[cubic-bezier(0.16,1,0.3,1)]` |
| homepage journey stepper | 14px-wide segments | WCAG 2.5.8 *Equivalent*: the labelled stepper buttons below trigger the same action at full size |

## Checking

```
python3 scripts/check-design-system.py     # tokens, contrast floor, scale, easing
python3 scripts/check-cover-accuracy.py    # guide cover geometry and claims
python3 scripts/check-guide-motion.py      # figure motion vocabulary
python3 scripts/check-vehicle-data.py      # battery and charging-curve consistency
```

Static checks cannot see composed contrast, overflow or focus. For those,
render the routes in a real browser at 1440×900 and 390×844.

**Three ways a runtime probe lies**, all three of which produced phantom
failures on this site and were only settled by sampling rendered pixels:

1. **A DOM walk cannot find the painted background.** A `position: fixed` nav
   is not a DOM descendant of the hero it floats over, and a scrim is often a
   *sibling* with a `linear-gradient` rather than a `background-color` on an
   ancestor. Both default the walk to white. The nav measured 1.19:1 and is
   really 9.95:1.
2. **Opacity is inherited by painting, not by `getComputedStyle`.** An element
   whose framer-motion ancestor is mid-entrance at `opacity: 0` still reports
   `opacity: 1` itself. Measuring it measures text nobody can see: a caption
   reported 1.04:1 and is really 18.36:1 once settled. Multiply opacity up the
   ancestor chain before believing a reading.
3. **Programmatic `.focus()` does not match `:focus-visible`.** That produced
   982 phantom focus failures; real keyboard traversal over 2,160 focus events
   found one element, an embedded map iframe, which browsers do not ring.
