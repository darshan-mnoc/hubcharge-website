/**
 * The two connector faces, in millimetres, in one place.
 *
 * WHY THIS FILE EXISTS
 * The site drew these connectors twice and the two drawings disagreed.
 * components/connector-diagram.tsx dimensioned them from the published
 * standards; components/guide-cover.tsx re-typed them by eye as ratios of a
 * radius. The differences were not cosmetic:
 *
 *   - The cover filled CCS1's two AC pins solid orange. A DC cable does not
 *     populate them, which is why the figure draws them as empty wells — so
 *     the cover was saying power moves through contacts that are not there,
 *     against a palette rule where orange means exactly that.
 *   - The cover drew NACS's three small pins arched and all one size; the
 *     figure draws them in a row with a larger centre.
 *   - The cover put the two faces at 30:21, a ratio of 1.43. A J1772 face is
 *     43.5mm across and a NACS face is roughly half a J1772 wide, so the real
 *     ratio is nearer 2. The cover understated the single fact the guide it
 *     illustrates exists to teach.
 *
 * Millimetres, not ratios, because that is what the standards are written in
 * and it is what makes the two faces comparable to each other. Each consumer
 * scales; neither redraws.
 *
 * SOURCES
 *   SAE J1772 (en.wikipedia.org/wiki/SAE_J1772) for the J1772/CCS1 face and
 *   its pin offsets. SAE J3400 references for the NACS 3-over-2 arrangement.
 *   The exact J3400 face dimensions are inside the paywalled standard; the
 *   NACS numbers below are the ones connector-diagram.tsx has always used and
 *   are not newly invented here. Do not "tidy" them without a source.
 */

export type PinRole = "AC" | "PE" | "CP" | "PP" | "DC" | "SIGNAL";

export type PinSpec = {
  /** The contact's name in the standard — L1, PE, DC+ and so on. Also the
   *  React key, so neither drawing has to fall back on an array index. */
  id: string;
  /** Millimetres from the face centre. +x right, +y down. */
  dx: number;
  dy: number;
  /** Contact radius in millimetres. */
  r: number;
  role: PinRole;
  /**
   * An unpopulated well rather than a contact.
   *
   * CCS1's two AC pins are physically present on the inlet and absent on a DC
   * cable. Every cable HubCharge hangs is DC, so on our drawings they are
   * holes. This is the one property that must survive any redraw.
   */
  empty?: boolean;
  /** Carries current while charging — the only pins that may be drawn live. */
  power?: boolean;
};

/** The J1772 round face: 43-44mm across. */
export const J1772_FACE_R = 43.5 / 2;

/**
 * CCS1 = a complete J1772 face with two DC pins bolted underneath.
 * Offsets are from the centre of the ROUND face, so `dy` is positive for the
 * DC pair that hangs below it.
 *
 * The detail everyone draws wrong: the small signal pins sit WIDER apart
 * (21.3mm) than the large AC pins (15.7mm).
 */
export const CCS1_PINS: PinSpec[] = [
  { id: "L1", dx: -15.7 / 2, dy: -6.8, r: 4.2, role: "AC", empty: true },
  { id: "N/L2", dx: +15.7 / 2, dy: -6.8, r: 4.2, role: "AC", empty: true },
  { id: "PP", dx: -21.3 / 2, dy: +5.6, r: 2.3, role: "PP" },
  { id: "CP", dx: +21.3 / 2, dy: +5.6, r: 2.3, role: "CP" },
  { id: "PE", dx: 0, dy: +10.6, r: 4.2, role: "PE" },
  { id: "DC+", dx: -13, dy: +28, r: 8.4, role: "DC", power: true },
  { id: "DC-", dx: +13, dy: +28, r: 8.4, role: "DC", power: true },
];

/** The DC housing below the round face, as a box in the same millimetres.
 *  `radius` is a corner radius on a rounded rectangle. Drawn as SVG arc
 *  commands it bulged outward past the corners and rendered the housing 74
 *  units wide where the geometry says 48. */
export const CCS1_DC_HOUSING = { top: 10, bottom: 46, halfWidth: 24, radius: 12 };

/**
 * Overall extent of the CCS1 coupler, face centre to edges.
 *
 * halfWidth is the DC HOUSING's half-width, because the housing is the widest
 * part of the body — 48mm across against the round face's 43.5mm. It is not
 * the 68mm figure that appears in connector-diagram.tsx, which is that SVG's
 * viewBox including its 6mm padding on each side. Taking the viewBox for the
 * body is how this file first claimed a 2:1 size ratio against NACS; the real
 * drawn ratio is nearer 1.4:1, and overstating it would have been the same
 * class of error as the understating it replaced.
 */
export const CCS1_EXTENT = { halfWidth: 24, top: -32, bottom: 48 };

/**
 * NACS: one compact face doing both jobs. Three small pins in a ROW on top —
 * ground in the centre and slightly larger, CP and PP either side — over two
 * large pins that carry AC at home and DC here.
 *
 * It is a capsule, not a circle: 34mm wide by 44mm tall. Drawing it round is
 * what made the cover's size comparison wrong as well as its shape.
 */
export const NACS_FACE = { w: 34, h: 44 };

export const NACS_PINS: PinSpec[] = [
  { id: "PP", dx: -9, dy: -8, r: 2.6, role: "SIGNAL" },
  { id: "PE", dx: 0, dy: -9, r: 3.2, role: "PE" },
  { id: "CP", dx: +9, dy: -8, r: 2.6, role: "SIGNAL" },
  { id: "DC+/L1", dx: -7.4, dy: +8, r: 6.2, role: "DC", power: true },
  { id: "DC-/L2", dx: +7.4, dy: +8, r: 6.2, role: "DC", power: true },
];

/**
 * How much wider CCS1's body is than NACS's — 48mm against 34mm, about 1.4.
 * Both drawings must render at ONE scale so this ratio is what a reader sees;
 * that is the single fact the connectors guide exists to teach.
 */
export const CCS1_TO_NACS_WIDTH = (CCS1_EXTENT.halfWidth * 2) / NACS_FACE.w;
