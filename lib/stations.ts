/**
 * Single source of truth for HubCharge station data.
 * Consumed by the homepage station finder, the /locations pages,
 * the sitemap, and per-location JSON-LD structured data.
 *
 * NAP note (local SEO): keep name/address/phone character-identical with the
 * Google Business Profile and aggregator listings (PlugShare, OpenChargeMap…).
 */

export type NearbyPlace = { name: string; walk: string };
export type Nearby = {
  coffee: NearbyPlace[];
  food: NearbyPlace[];
  retail: NearbyPlace[];
};

export type Station = {
  id: number;
  /** URL segment for /locations/<slug> */
  slug: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  chargers: number;
  power: string;
  /** Rated maximum output in kW (equipment capacity, not guaranteed delivered rate) */
  maxKw: number;
  connectors: string[];
  hours: string;
  /** Opening hours in schema.org format */
  hoursSchema: { opens: string; closes: string };
  /** IANA zone. "Open now" is a clock question, and lib/hours.ts answered it
   *  in America/Los_Angeles for every site — which was right while every site
   *  was in California and two hours wrong the moment Round Rock existed. */
  tz: string;
  phone: string;
  phoneE164: string;
  hasAttendant: boolean;
  /**
   * How a session is sold here, as configured on the charger itself.
   *
   * A base period, then a fixed number of fixed-length extensions. Read off
   * the unit's own screen rather than assumed, which matters because the
   * "up to four extensions" promise was retyped as prose in five files and
   * the estimator offered 10/20/30 minutes — a set of durations the hardware
   * does not actually sell.
   *
   * No amounts live here. See `tariff`.
   */
  session: {
    baseMinutes: number;
    extensionMinutes: number;
    maxExtensions: number;
  };
  /**
   * Published rate. Absent on every station on purpose.
   *
   * The standing decision is that amounts appear on the charger and in the
   * browser checkout, not on the website — the promise the site makes is the
   * model, not the number. This field exists so that reversing that decision
   * is a data change and nothing else: every surface that could print money
   * already branches on `tariff` being undefined.
   */
  tariff?: {
    basePrice: number;
    extensionPrice: number;
    preAuth: number;
    /** Where the figure came from, e.g. "charger screen, MBS_1" */
    source: string;
    /** ISO month the rate was last confirmed against the charger */
    verified: string;
  };
  status: "open" | "coming-soon";
  note: string;
  coords: { lat: number; lng: number };
  /** Short marketing blurb used on the location page */
  blurb: string;
  /**
   * Real photographs of this site, first one leading.
   *
   * These live on the record rather than in a lookup because two identical
   * `stationImages` maps had grown in app/locations/page.tsx and
   * app/locations/[slug]/page.tsx, and find-your-hub had none at all — so a
   * station card on the homepage showed no photo while the same station's
   * page showed one. Same consolidation as lib/ev-models.ts.
   */
  photos: { src: string; alt: string }[];
};

export const stations: Station[] = [
  {
    id: 1,
    slug: "alhambra",
    name: "HubCharge™ Alhambra",
    address: "188 S Monterey St, Unit 108",
    city: "Alhambra",
    state: "CA",
    zip: "91801",
    chargers: 2,
    power: "Up to 180kW",
    maxKw: 180,
    connectors: ["NACS", "CCS"],
    hours: "6 AM - 10 PM",
    hoursSchema: { opens: "06:00", closes: "22:00" },
    tz: "America/Los_Angeles",
    phone: "(949) 392-8755",
    phoneE164: "+19493928755",
    hasAttendant: true,
    session: { baseMinutes: 10, extensionMinutes: 5, maxExtensions: 4 },
    status: "open",
    note: "2 more HubCharge™ hubs coming soon here",
    /* Geocoded from the street address above, not the block. The previous
       pair sat about 110 m west, back when the site was at 108. */
    coords: { lat: 34.0946, lng: -118.1236 },
    blurb:
      "DC fast charging in the heart of downtown Alhambra, steps from Main Street's cafés, restaurants, and shops. Pull up, and our attendant handles the rest.",
    photos: [
      {
        src: "/images/alhambra-station.webp",
        alt: "A HubCharge fast charger in the Alhambra parking structure, screen lit and status bars green",
      },
      {
        src: "/images/alhambra-charger.webp",
        alt: "The HubCharge unit at Alhambra showing pricing and connector QR codes on its screen, with CCS1 and NACS cables holstered",
      },
      {
        src: "/images/alhambra-unit.webp",
        alt: "Full view of a HubCharge charger at Alhambra between yellow bollards",
      },
      {
        src: "/images/alhambra-connectors.webp",
        alt: "Close view of the CCS1 and NACS connectors and card reader on the Alhambra charger",
      },
      {
        src: "/images/alhambra-bay.webp",
        alt: "A HubCharge charging bay at Alhambra with a car parked alongside",
      },
      {
        src: "/images/alhambra-wide.webp",
        alt: "The Alhambra charging bay seen from across the parking structure",
      },
    ],
  },
  {
    id: 2,
    slug: "fontana",
    name: "HubCharge™ at Fontana Nissan",
    address: "16444 S Highland Ave",
    city: "Fontana",
    state: "CA",
    zip: "92336",
    chargers: 1,
    power: "Up to 180kW",
    maxKw: 180,
    connectors: ["NACS", "CCS"],
    hours: "6 AM - 10 PM",
    hoursSchema: { opens: "06:00", closes: "22:00" },
    tz: "America/Los_Angeles",
    phone: "(949) 392-8755",
    phoneE164: "+19493928755",
    hasAttendant: true,
    session: { baseMinutes: 10, extensionMinutes: 5, maxExtensions: 4 },
    status: "open",
    note: "",
    coords: { lat: 34.0922, lng: -117.435 },
    blurb:
      "Fast, convenient DC charging at Fontana Nissan — an easy stop off the 10 with food, coffee, and big-box retail minutes away.",
    photos: [
      {
        src: "/images/fontana-station.webp",
        alt: "A red Tesla Model Y charging at the HubCharge station outside Fontana Nissan",
      },
      {
        src: "/images/fontana-charging.webp",
        alt: "A Tesla Model Y connected to the HubCharge charger at Fontana Nissan",
      },
      {
        src: "/images/fontana-forecourt.webp",
        alt: "The HubCharge charging bays on the Fontana Nissan forecourt",
      },
    ],
  },
  {
    /* Signed, addressed, and not yet open. `status: "coming-soon"` is the arm
       of the union that had no data in it until now — everything that counts
       stations reads `statesWithCoverage().live`, which filters on it, so this
       record can carry a real address without any surface claiming Texas is
       open. No opening date: "about a month" is not a date, and this file's
       whole job is to not imply more certainty than we have. */
    id: 3,
    slug: "round-rock",
    name: "HubCharge™ Round Rock",
    address: "2081 Double Creek Dr",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    chargers: 2,
    power: "Up to 180kW",
    maxKw: 180,
    connectors: ["NACS", "CCS"],
    hours: "6 AM - 10 PM",
    hoursSchema: { opens: "06:00", closes: "22:00" },
    tz: "America/Chicago",
    phone: "(949) 392-8755",
    phoneE164: "+19493928755",
    hasAttendant: true,
    session: { baseMinutes: 10, extensionMinutes: 5, maxExtensions: 4 },
    status: "coming-soon",
    note: "Opening soon — our first site in Texas",
    /* Geocoded from the street address, not the city centroid this replaced. */
    coords: { lat: 30.4953, lng: -97.6453 },
    blurb:
      "Our first Texas site, opening soon off Double Creek Drive in Round Rock, just north of Austin.",
    /* Empty on purpose. There is nothing built to photograph yet, and every
       surface that renders a photo checks the length first. */
    photos: [],
  },
];

/**
 * Cities we have announced, with no address yet.
 *
 * These were two bare city strings, which read as a list until you noticed
 * that Round Rock is in Texas — the site had no way to say so, and no way to
 * place either of them on a map. They carry a state now, and coordinates.
 *
 * Round Rock has since graduated out of here: it has a signed address, so it
 * is a real `coming-soon` station above rather than a dot on a city. That is
 * the distinction this list exists to hold — a place we have named against a
 * place we can point at.
 *
 * THE COORDINATES ARE CITY CENTROIDS, NOT STATION ADDRESSES. Nothing left in
 * this list has a confirmed address. Anything rendering these must say
 * "coming soon" and must not imply a street corner we have not signed for.
 */
export type UpcomingLocation = {
  city: string;
  state: string;
  /** City centroid. Approximate by design — see the note above. */
  coords: { lat: number; lng: number };
};

export const upcomingLocations: UpcomingLocation[] = [
  { city: "West Covina", state: "CA", coords: { lat: 34.0686, lng: -117.939 } },
];

/** Every state we are in or heading to, live sites first. */
export const STATE_NAMES: Record<string, string> = {
  CA: "California",
  TX: "Texas",
};

export function stateSlug(code: string): string {
  return (STATE_NAMES[code] ?? code).toLowerCase().replace(/\s+/g, "-");
}

export function stateFromSlug(slug: string): string | undefined {
  return Object.keys(STATE_NAMES).find((c) => stateSlug(c) === slug);
}

/** Live stations grouped by state, and the states we have announced but not
 *  opened. Both are derived, so adding a station to the array above is still
 *  the only step needed to make it appear everywhere. */
export function statesWithCoverage(): {
  code: string;
  name: string;
  slug: string;
  /** Open today. Twelve call sites read this to mean "you can charge here". */
  live: Station[];
  /** Addressed and signed, not open yet. Real coordinates, usually no photos. */
  soon: Station[];
  /** Announced as a city, no address. Coordinates are centroids. */
  upcoming: UpcomingLocation[];
}[] {
  const codes = Array.from(
    new Set([...stations.map((s) => s.state), ...upcomingLocations.map((u) => u.state)])
  );
  return codes
    .map((code) => ({
      code,
      name: STATE_NAMES[code] ?? code,
      slug: stateSlug(code),
      /* `status`, not just `state`. Every consumer of `live` treats its length
         as "is this state open" — the page title, the metadata description,
         the sitemap priority, the station count on the index. Letting a
         coming-soon record through here would have announced Texas as open
         the moment Round Rock got an address. */
      live: stations.filter((s) => s.state === code && s.status === "open"),
      soon: stations.filter((s) => s.state === code && s.status === "coming-soon"),
      upcoming: upcomingLocations.filter((u) => u.state === code),
    }))
    /* States with open sites first, then by how many. A state we have only
       announced should never outrank one a driver can actually charge in. */
    .sort((a, b) => b.live.length - a.live.length || a.name.localeCompare(b.name));
}

/** Nearby places keyed by station id (What's Nearby updates with the selected hub). */
export const nearbyByStation: Record<number, Nearby> = {
  // HubCharge™ Alhambra
  1: {
    coffee: [
      { name: "Twinkle Tea", walk: "1 min" },
      { name: "Starbucks", walk: "3 min" },
      { name: "Tea Station", walk: "2 min" },
    ],
    food: [
      { name: "Fosselman's Ice Cream", walk: "2 min" },
      { name: "Grill 'Em All", walk: "3 min" },
      { name: "Din Tai Fung", walk: "5 min" },
      { name: "Phoenix Food Boutique", walk: "2 min" },
    ],
    retail: [
      { name: "Target", walk: "5 min" },
      { name: "Alhambra Place", walk: "3 min" },
      { name: "Edwards Alhambra Renaissance", walk: "4 min" },
    ],
  },
  // HubCharge™ at Fontana Nissan — TODO: confirm exact nearby spots
  2: {
    coffee: [
      { name: "Starbucks", walk: "2 min" },
      { name: "Dutch Bros Coffee", walk: "4 min" },
      { name: "The Coffee Bean", walk: "5 min" },
    ],
    food: [
      { name: "In-N-Out Burger", walk: "3 min" },
      { name: "Chipotle", walk: "4 min" },
      { name: "Panda Express", walk: "2 min" },
    ],
    retail: [
      { name: "Costco", walk: "5 min" },
      { name: "Target", walk: "4 min" },
      { name: "Best Buy", walk: "6 min" },
    ],
  },
};

export function getStationBySlug(slug: string): Station | undefined {
  return stations.find((s) => s.slug === slug);
}

export function directionsUrl(station: Station): string {
  const q = encodeURIComponent(
    `${station.address} ${station.city} ${station.state}`
  );
  return `https://maps.google.com/?q=${q}`;
}

export function mapEmbedUrl(station: Station): string {
  return `https://maps.google.com/maps?q=${station.coords.lat},${station.coords.lng}&z=15&output=embed`;
}

/* ------------------------------------------------------------------ *
 * Session shape
 *
 * The charger sells one base period plus a bounded number of equal
 * extensions. Derived here rather than retyped, because "up to four
 * extensions" had been written by hand into five different files and a
 * duration set the hardware does not offer had been written into the
 * estimator.
 * ------------------------------------------------------------------ */

/** The longest stop this station will sell, in minutes. */
export function maxSessionMinutes(s: Station): number {
  const { baseMinutes, extensionMinutes, maxExtensions } = s.session;
  return baseMinutes + extensionMinutes * maxExtensions;
}

export type SessionStep = {
  /** Total elapsed minutes if you stop here. */
  minutes: number;
  /** How many extensions past the base period that is. */
  extensions: number;
};

/**
 * Every stop length this station can actually sell, shortest first.
 *
 * The base period is always the first entry, so a station configured with
 * zero extensions still yields exactly one valid duration.
 */
export function sessionSteps(s: Station): SessionStep[] {
  const { baseMinutes, extensionMinutes, maxExtensions } = s.session;
  return Array.from({ length: maxExtensions + 1 }, (_, i) => ({
    minutes: baseMinutes + extensionMinutes * i,
    extensions: i,
  }));
}

/**
 * What a given stop length is made of, in words.
 *
 * This is the closest thing to a bill the site prints: the amounts stay on
 * the charger, but how many chargeable pieces a stop contains is a fact the
 * hardware displays and the site never mentioned anywhere.
 */
export function sessionBreakdown(s: Station, step: SessionStep): string {
  const base = `${s.session.baseMinutes} min base`;
  if (step.extensions === 0) return base;
  const n = step.extensions;
  return `${base} + ${n} × ${s.session.extensionMinutes} min extension${n > 1 ? "s" : ""}`;
}
