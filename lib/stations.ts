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
  phone: string;
  phoneE164: string;
  hasAttendant: boolean;
  services: string[];
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
    // TODO: replace with the new company address at MBS (pending exact address)
    address: "108 S Monterey St, Unit 102",
    city: "Alhambra",
    state: "CA",
    zip: "91801",
    chargers: 2,
    power: "Up to 180kW",
    maxKw: 180,
    connectors: ["NACS", "CCS"],
    hours: "6 AM - 10 PM",
    hoursSchema: { opens: "06:00", closes: "22:00" },
    phone: "(949) 391-4676",
    phoneE164: "+19493914676",
    hasAttendant: true,
    services: ["delivery", "pickup"],
    status: "open",
    note: "2 more HubCharge™ hubs coming soon here",
    coords: { lat: 34.095, lng: -118.127 },
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
    phone: "(949) 391-4676",
    phoneE164: "+19493914676",
    hasAttendant: true,
    services: ["delivery", "pickup"],
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
];

export const upcomingLocations = ["Round Rock", "West Covina"];

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
