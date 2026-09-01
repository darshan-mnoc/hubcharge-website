/**
 * Palette for the hand-drawn journey illustration.
 *
 * The scene previously carried 111 hardcoded hex literals — fourteen distinct
 * navies against an `ink` ramp that defines seven, plus Tailwind-default
 * emerald, amber and slate values that appear nowhere else in the product.
 * That is why the charger, the cable and the attendant all looked like they
 * came from different drawings.
 *
 * Three rules govern everything here:
 *
 *   1. Objects take their own colour, sampled from the real thing and taken
 *      down to night levels. Every ramp's darkest stop is measured so no
 *      object dissolves into the plate.
 *   2. Orange means power is moving. Nothing else is ever orange.
 *   3. State gets the state set, below. Nothing else uses those five.
 *
 * Rule 1 has now been wrong twice. It began as "hardware is the ink ramp,
 * nothing else", which was written for a five-step scene with one variable.
 * It then became "objects are the ink ramp" plus a state set, which fixed
 * states but left the cabinet, the car, the tarmac and the sky all rendering
 * as the same navy — so nothing in a scene separated from anything else. The
 * values below are measured off public/images/alhambra-unit.webp and
 * fontana-station.webp rather than invented.
 *
 * Rule 2 replaces an earlier absolute — "energy is brand orange, nothing
 * else" — which was written for a five-step scene with one variable and did
 * not survive contact with twenty-one guide covers. Forcing orange to carry
 * both "power is flowing" and "this is fine" made a free bay and a charging
 * bay look identical, and it made the drawn cabinet disagree with the real
 * one, whose status bars are GREEN when the bay is free.
 *
 * The state set is deliberately tiny and, apart from the red, is not new:
 * green and brass already exist in tailwind.config.ts, whose own comments
 * exist to stop one meaning acquiring six colours. Every value below is
 * measured against the plate (#0A192F).
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
  /* ── Object colour ──────────────────────────────────────────
   *
   * Sampled from the photographs, then taken to night levels. The number
   * after each is its contrast against the plate: the DARKEST stop of every
   * ramp is the one that matters, because a ramp that bottoms out near the
   * background makes the object vanish — which is exactly what happened when
   * the car ran to carLow at 1.17:1.
   */
  /** The cabinet, from Alhambra's warm greige #847C65. 7.62 / 4.94 / 3.03 */
  cabTop: "#B3AA93",
  cabMid: "#8F8775",
  cabLow: "#6B6555",
  /** The flank in shadow. Darker than the front face but still 2.11:1 off the
   *  plate — a navy flank on a warm cabinet read as a different object. */
  cabShade: "#4E4A3E",
  /** Body colour, from the red Model Y in fontana-station.webp. 5.01/3.04/2.02 */
  paintTop: "#C4707F",
  paintMid: "#A04A5B",
  paintLow: "#7C3341",
  /** Second and third body colours, so a forecourt is not all one car. */
  silverTop: "#CDD3DB",
  silverMid: "#9AA3B0",
  silverLow: "#6E7681",
  graphiteTop: "#98A0AC",
  graphiteMid: "#6E7681",
  graphiteLow: "#4E555E",
  /** Tarmac. Deliberately DARKER than the sky — ground under a night sky is,
   *  and it only has to separate from what stands on it. */
  asphalt: "#262B2F",
  /** Glass at night: recessive, 3.76:1 against a lit cabinet face. */
  pane: "#223040",

  /* ── State ──────────────────────────────────────────────────
   *
   * One colour per meaning, contrast measured on the plate:
   *   ok    12.54:1   brass 5.27:1   cold 7.18:1
   *   fault  6.36:1   live  6.74:1
   * All five clear 4.5:1, so any of them can carry a label.
   */
  /** Available, correct, working. tailwind ok["on-dark"] — not a new colour. */
  ok: "#86EFAC",
  /** Broken, blocked, ruled out. The one value the system did not already have. */
  fault: "#F87171",
  /** Cold. Reuses the existing cool glass tone rather than inventing a blue. */
  cold: "#8FA8C4",
  /** Heat. tailwind brass, the site's single warm tertiary. */
  heat: "#A8875C",

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
