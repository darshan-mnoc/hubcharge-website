/**
 * How to physically reach the charger once you have arrived at the address.
 *
 * WHY THIS FILE EXISTS
 * An address and a map are enough for a dealership forecourt you can see from
 * the road. They are not enough for Alhambra, which is inside a multi-level
 * parking structure: the station page gave a street address, a Google embed,
 * and then ten restaurant listings, and a driver sitting at the structure
 * entrance still did not know which entrance, which level, which stall,
 * whether they were about to be charged for parking, or what to do if both
 * units were taken. That information is worth more at that moment than any
 * coffee recommendation.
 *
 * THE RULE FOR THIS FILE
 * Every field is optional and nothing in it is inferred. A field that is not
 * known is absent, and an absent field renders nothing — no placeholder, no
 * "TBC", no "contact us for details". Publishing a guess about which level a
 * charger is on is worse than publishing nothing, because a driver acts on it.
 *
 * What is seeded below was read off the photographs in public/images or is
 * already asserted elsewhere in the codebase. Entrance, level, stall numbers,
 * parking cost, validation, clearance and attendant hours are NOT known and
 * are deliberately missing until someone confirms them on site.
 */

export type AccessUnit = {
  /**
   * What a driver would call this cabinet on sight.
   *
   * Both units here carry CCS1 and NACS, so the connector list is the one
   * thing that cannot tell them apart — the cards were headed "CCS1 + NACS"
   * twice. The colour and the make can be read from twenty feet away, so
   * that is the heading.
   */
  label?: string;
  /** The ID printed on the unit's own screen, e.g. "MBS_1". */
  id?: string;
  /** Connectors on this specific cabinet, in the order they are labelled. */
  connectors: string[];
  /** Where this cabinet stands, for someone scanning the deck for it. */
  note?: string;
};

export type StationAccess = {
  /** The kind of place this is, in one line. */
  setting?: string;
  /** Which driveway, in the words a driver reads off the street. */
  entrance?: string;
  /** "Level 2", "Ground floor, rear". */
  level?: string;
  /** Stall numbers or a painted zone. */
  stalls?: string;
  /** Gates, tickets, barriers, posted restrictions — what governs the space. */
  accessNotes?: string[];
  /** Overhead clearance in feet. Parking structures are where this bites. */
  clearanceFt?: number;
  /** What parking costs, and whether charging validates it. */
  parking?: { cost: string; validation?: string };
  /** When an attendant is actually on site. */
  attendantHours?: string;
  /** The individual cabinets, which are not always identical. */
  units?: AccessUnit[];
  /** What to do when every stall is taken or a unit is down. */
  ifOccupied?: string[];
};

/**
 * Keyed by `station.id`, the same pattern as `nearbyByStation`.
 *
 * A station with no entry here renders no access block at all, which is the
 * correct behaviour for a site that has not opened.
 */
export const stationAccess: Record<number, StationAccess> = {
  // ── 1 · Alhambra ────────────────────────────────────────────────────────
  // Seeded from public/images/alhambra-{station,charger,wide,bay}.webp. The
  // two cabinets are visibly different hardware, which is why units are
  // described individually rather than as "2 × 180kW".
  1: {
    setting:
      "Inside the parking structure at 188 S Monterey St. The chargers sit in marked EV stalls on the parking deck, not on the street.",
    accessNotes: [
      "Signed “Electric vehicle parking — only while charging”. The stall is for charging, not parking.",
      "Look for yellow bollards either side of the cabinet, with a concrete wheel stop at the front.",
    ],
    units: [
      {
        label: "Cream HubCharge cabinet",
        connectors: ["CCS1", "NACS"],
        note: "On the open deck, against the perimeter wall. CCS1 is the left holster, NACS the right, and the card reader sits between them.",
      },
      {
        label: "Dark Winline cabinet",
        connectors: ["CCS1 (A)", "NACS"],
        note: "Under cover, against the concrete wall. Its screen asks you to pick a connector first: A is CCS1, on the left, and NACS is on the right.",
      },
    ],
    ifOccupied: [
      "There are two chargers here, and they are different cabinets — if one is busy or will not start, try the other.",
      "Every charger is self-serve capable, so you never have to wait for an attendant to be free.",
      "Still stuck? Call the station and we will tell you what is actually free right now.",
    ],
  },

  // ── 2 · Fontana ─────────────────────────────────────────────────────────
  // A dealership forecourt, visible from the road — see
  // public/images/fontana-forecourt.webp. Most of this type is not needed
  // here, which is the point of every field being optional.
  2: {
    setting:
      "On the Fontana Nissan forecourt, off S Highland Ave. The charging bays are outdoors and visible from the lot, with no structure to navigate.",
    ifOccupied: [
      "Every charger is self-serve capable, so you never have to wait for an attendant to be free.",
      "If the charger is busy or will not start, call the station and we will tell you what is free right now.",
    ],
  },

  // ── 3 · Round Rock ──────────────────────────────────────────────────────
  // Deliberately absent. Nothing is built yet, so there is nothing true to
  // say about finding it, and the station page renders no access block.
};

export function accessFor(stationId: number): StationAccess | undefined {
  const a = stationAccess[stationId];
  if (!a) return undefined;
  // An entry that exists but holds nothing should behave as though it does not
  // exist, so a half-filled record never renders an empty heading.
  return Object.values(a).some((v) => (Array.isArray(v) ? v.length > 0 : v !== undefined))
    ? a
    : undefined;
}
