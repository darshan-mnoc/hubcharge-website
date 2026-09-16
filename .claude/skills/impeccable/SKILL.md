---
name: impeccable
description: Audit, design and repair this site's user interface against its own design system. Use for UI review, visual polish, token normalisation, accessibility and contrast checks, typography and layout repair, microcopy clarity, edge-case hardening, and motion work. Invoked as /impeccable <command>, e.g. /impeccable audit, /impeccable polish, /impeccable normalize.
---

# Impeccable

You are an expert frontend engineer auditing, designing and repairing this
codebase's UI.

## The design authority, in precedence order

1. **The user's explicit words** in the current request.
2. **`DESIGN.md`** — the index of where the rules live, plus the rules that
   exist nowhere else (the contrast floor, the sanctioned exceptions).
3. **`tailwind.config.ts` and `app/globals.css`** — the tokens themselves.
   These are the source of truth for every value. They carry measured contrast
   ratios and the reason each token exists; read the comments, they are load
   bearing.
4. **`PRODUCT.md`** — product constraints that are not derivable from code.

Never introduce a value that is not in the config. Never restate a config
value in another file — a second copy is how drift starts.

## Before any fix command

Run `python3 scripts/check-design-system.py`. It enforces the mechanical rules
and derives the contrast floor rather than asserting it. If it fails, fix that
first: you are about to edit files it is already complaining about.

## Commands

### Setup
- **`init`** — record durable constraints into `PRODUCT.md` and `DESIGN.md`.
  Already done; re-run only when the token system itself changes.
- **`craft`** — end-to-end: shape the UX, plan tokens, then iterate visually.
- **`shape`** — turn a raw feature idea into a component-ready brief before any
  code is written.
- **`live`** — visual picking; aggregate CSS properties for consolidation.

### Audit (never writes code)
- **`audit`** — diagnostic pass. Report anti-patterns, accessibility and
  contrast gaps, hardcoded values, spacing and type-scale violations. Output a
  ranked list. **Change nothing.**
- **`critique`** — multi-persona visual evaluation of hierarchy, flow clarity
  and layout.

### Fix (writes code)
- **`polish`** — repair UI flaws, remove generic "AI tell" spacing, clean up
  component boundaries.
- **`normalize`** — map inline colours, hardcoded margins and mismatched radii
  back to tokens.
- **`clarify`** — microcopy, data labels, tooltips, empty states.
- **`harden`** — text overflow, huge lists, missing data, error boundaries.

### Adjust
- **`bolder`** / **`quieter`** — raise or lower visual intensity.
- **`distill`** — strip clutter to the functional essence.
- **`typeset`** — enforce the type scale, hierarchy, line height, rhythm.
- **`layout`** — repair flex/grid, spacing, responsive padding.
- **`colorize`** — balance colour using tokens only.
- **`animate`** — purposeful motion. Every transition uses `var(--hc-ease)`.
- **`onboard`** — skeletons, first-run tours, progressive disclosure.
- **`overdrive`** — premium effects and intricate layout.

## Rules that have already cost this codebase something

- **Verify against the rendered page, not the source.** A grid whose right
  column was `auto` looked correct in the source and collapsed its sibling to
  100px in the browser. Measure in a real viewport.
- **Do not "fix" a sanctioned exception.** `DESIGN.md` lists them with reasons.
  A guard written here once failed a map, a chart and a document because its
  rule was too blunt.
- **Comments are prose, not code.** The first design-system guard failed on the
  comment that documented the exception it was checking for.
- **Two dimming mechanisms multiply.** An `opacity: 0.4` button containing
  `rgba(255,255,255,0.22)` text renders at 0.088 — about 1.3:1.
- **Prove a new guard rule fails** by reintroducing the exact violation it
  targets, then restore. A rule that has never failed has never been tested.
- **A probe can lie.** Programmatic `.focus()` does not match
  `:focus-visible`, which produced 982 phantom focus failures; real keyboard
  traversal found one. Contrast measured by walking the DOM cannot see
  background images or `position: fixed` overlays.
