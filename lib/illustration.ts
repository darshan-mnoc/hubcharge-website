/**
 * Palette for the hand-drawn journey illustration.
 *
 * The scene previously carried 111 hardcoded hex literals — fourteen distinct
 * navies against an `ink` ramp that defines seven, plus Tailwind-default
 * emerald, amber and slate values that appear nowhere else in the product.
 * That is why the charger, the cable and the attendant all looked like they
 * came from different drawings.
 *
 * One rule governs everything here:
 *
 *   Hardware is the ink ramp. Energy is brand orange. Nothing else.
 *
 * So a viewer learns the colour code once — orange means power is moving —
 * and it holds across all five steps. Idle hardware is dim; active hardware
 * is orange. There is no green "ready" state, because a second accent means
 * the reader has to learn a second thing to understand a five-second graphic.
 *
 * Values are the design tokens from tailwind.config.ts, restated here because
 * SVG `fill`/`stroke` cannot read Tailwind classes.
 */

export const ILLO = {
  /* ── Structure ─────────────────────────────────────────────── */
  /** Deepest shadow / ground contact. */
  shadow: "#050D18",
  /** The stage this scene is drawn on (bg-ink-900). */
  stage: "#0A192F",
  /** Recessed faces — screen wells, holster interiors. */
  recess: "#0D1A2E",
  /** Body panels facing away from the light. */
  bodyDark: "#16233D",
  /** Body panels facing the light (ink-800). */
  body: "#1B3252",
  /** Raised edges and top caps. */
  bodyLight: "#2C4468",
  /** Hairline separations inside dark hardware. */
  seam: "#48607F",

  /* ── The car ───────────────────────────────────────────────── */
  carTop: "#41556F",
  carMid: "#2E4159",
  carLow: "#1B2739",
  carRocker: "#111C2C",
  glassTop: "#8FA8C4",
  glassMid: "#33455F",
  glassLow: "#16233B",
  tyre: "#0E1725",
  rim: "#243449",
  hub: "#94A3B8",

  /* ── The attendant ─────────────────────────────────────────── */
  /** Uniform — the figure reads light against the navy stage. */
  uniform: "#E9EDF2",
  uniformShade: "#CDD6E0",
  /** Skin. Warm mid-tone; features are drawn in `feature` over it. */
  skin: "#C79B78",
  skinShade: "#A87E5D",
  /** Brow, eyes, mouth. Dark enough to read at 40px wide. */
  feature: "#2A1D14",
  /** Cap and trousers. */
  garment: "#16233D",

  /* ── Energy. The only accent in the scene. ─────────────────── */
  live: "#FF7A00",
  liveDim: "#B34D00",
  liveGlow: "#FFB068",
  /** Hardware at rest — deliberately quiet, so `live` is the event. */
  idle: "#3A4A63",

  /* ── The charger.
     Its body used to be #16233D against a #0A192F stage — barely three
     percent apart in luminance, so the whole unit dissolved into the
     background and read as a dark smudge with a stripe on it. These sit in
     the same value range as the car, which is the thing it has to stand
     beside. */
  unitTop: "#42566F",
  unitMid: "#2C3E57",
  unitLow: "#1B2739",
  /** The screen well — darker than the body so the glass reads as inset. */
  glass: "#0B1524",
  /** Brushed edge catching the canopy light. */
  edge: "#5E738D",
} as const;

/** Cable casing, outer to inner. Identical in every scene that draws one. */
export const CABLE_CASING = [
  { stroke: ILLO.shadow, width: 5 },
  { stroke: ILLO.body, width: 3.4 },
  { stroke: ILLO.seam, width: 1, opacity: 0.55 },
] as const;
