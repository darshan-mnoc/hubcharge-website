/**
 * What HubCharge can actually do for you, and when.
 *
 * WHY THIS FILE EXISTS
 * The site made three different promises about the same services. The
 * lifestyle section carried a "Coming Soon" badge and the FAQ said plainly
 * that delivery is "launching soon"; meanwhile the homepage's add-on picker
 * offered Coffee / Food / Errands / Car care with no marker at all and folded
 * whatever you picked into a list headed "included in your flat rate", and the
 * site-wide <meta name="description"> asserted "food & coffee delivered to
 * your car" in the present tense — in <head>, on every route, which made it
 * the single most widely published unqualified claim on the site.
 *
 * They were all editing the same fact in different files. So the fact lives
 * here once, with its own hedge attached, and the surfaces render it.
 *
 * THE RULE
 * `today` means a driver can count on it on this visit. `limited` means it
 * exists and is genuinely available, but not at every site or every hour —
 * so it must never be stated without its caveat. `soon` means it is not
 * bookable yet and must never be written in the present tense.
 */

export type Availability = "today" | "limited" | "soon";

export type Service = {
  id: string;
  label: string;
  /** One line, in a driver's words, of what they actually get. */
  desc: string;
  availability: Availability;
  /** The hedge, written once. Required for anything not `today`. */
  caveat?: string;
};

export const services: Service[] = [
  {
    id: "charging",
    label: "DC fast charging",
    desc: "Up to 180kW, NACS and CCS, at every open station.",
    availability: "today",
  },
  {
    id: "browser-pay",
    label: "Pay from your phone",
    desc: "Tap or scan and the checkout opens in your browser. No app, no account.",
    availability: "today",
  },
  {
    id: "self-serve",
    label: "Self-serve charging",
    desc: "Every charger works without any help from us, whenever the station is open.",
    availability: "today",
  },
  {
    id: "attendant",
    label: "Attendant service",
    desc: "Someone plugs in and unplugs for you while you stay in your seat.",
    availability: "limited",
    caveat: "At select locations and hours. Chargers are always self-serve capable.",
  },
  {
    id: "coffee",
    label: "Coffee & drinks",
    desc: "Brought to your window while you charge.",
    availability: "soon",
    caveat: "Launching at select locations. Cafés are a short walk in the meantime.",
  },
  {
    id: "food",
    label: "Food",
    desc: "Ordered from nearby restaurants and delivered to your car.",
    availability: "soon",
    caveat: "Launching at select locations. Restaurants are a short walk in the meantime.",
  },
  {
    id: "errands",
    label: "Errands",
    desc: "Groceries, pharmacy and package runs handled during your stop.",
    availability: "soon",
    caveat: "Launching at select locations.",
  },
  {
    id: "carcare",
    label: "Car care",
    desc: "Detailing and dry-cleaning pickup while the car charges.",
    availability: "soon",
    caveat: "Launching at select locations.",
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function servicesBy(availability: Availability): Service[] {
  return services.filter((s) => s.availability === availability);
}

/** Everything a driver can rely on at an open station, caveats included. */
export function availableNow(): Service[] {
  return services.filter((s) => s.availability !== "soon");
}

/** The label a badge should carry, or null when the thing simply works. */
export function availabilityLabel(a: Availability): string | null {
  return a === "today" ? null : a === "limited" ? "Limited" : "Coming soon";
}

/**
 * The one-line hedge for a set of services, deduplicated.
 *
 * Footnotes were being retyped per page and had drifted into four different
 * wordings of the same caveat.
 */
export function caveatsFor(list: Service[]): string[] {
  return [...new Set(list.map((s) => s.caveat).filter((c): c is string => Boolean(c)))];
}
