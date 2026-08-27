/**
 * Single registry for every Charging 101 guide.
 *
 * Feeds the guides index, the nav dropdown, prev/next navigation at the foot
 * of each guide, and the sitemap — so a guide is added in exactly one place.
 */

export type GuideGroup = "start" | "how" | "vehicles" | "practical" | "trips" | "reference";

export type Guide = {
  slug: string; // path after /charging-101/
  title: string;
  /** Shorter label for nav and prev/next chrome */
  navTitle?: string;
  desc: string;
  read: string;
  group: GuideGroup;
  /** Plain-English nudge shown on the index for the entry point */
  note?: string;
};

export const GUIDE_GROUPS: { id: GuideGroup; label: string; blurb?: string }[] = [
  { id: "start", label: "Before you charge" },
  { id: "how", label: "How charging works" },
  { id: "vehicles", label: "Your car" },
  { id: "practical", label: "Everyday charging" },
  { id: "trips", label: "Road trips" },
  { id: "reference", label: "Reference" },
];

export const guides: Guide[] = [
  {
    slug: "can-my-ev-charge-here",
    title: "Can my EV charge at HubCharge?",
    navTitle: "Can my EV charge here?",
    desc: "Make-by-make compatibility — Tesla, Ford, Hyundai, Rivian and more. Almost certainly yes, with no adapter.",
    read: "4 min",
    group: "start",
    note: "Start here.",
  },
  {
    slug: "new-ev-owner",
    title: "Just got an EV? Start here",
    desc: "A short path through everything above, in the order it actually matters during your first month.",
    read: "3 min",
    group: "start",
    note: "New owner? This first.",
  },
  {
    slug: "connectors",
    title: "NACS vs CCS, explained",
    desc: "The two fast-charging plugs in America, explained — and why we carry both.",
    read: "3 min",
    group: "start",
  },
  {
    slug: "charging-levels",
    title: "Charging levels, explained",
    desc: "Level 1, Level 2 and DC fast charging — what the numbers actually mean.",
    read: "3 min",
    group: "how",
  },
  {
    slug: "charging-speed",
    title: "How long does charging take?",
    desc: "The charging curve, the 20–60% sweet spot, and why a ten-minute top-up is usually the smart move.",
    read: "5 min",
    group: "how",
  },
  {
    slug: "charging-cost",
    title: "What does charging cost?",
    desc: "Per-kWh, per-minute, idle fees, memberships — how public charging pricing works, and how we simplified it.",
    read: "4 min",
    group: "how",
  },
  {
    slug: "vehicles",
    title: "Charging guides by make",
    desc: "Tesla, Ford, Rivian, Hyundai and eleven more — what your car plugs into and roughly what ten minutes gets you.",
    read: "2 min",
    group: "vehicles",
  },
  {
    slug: "etiquette",
    title: "Charging etiquette",
    desc: "The unwritten rules of a shared charger — when to move, when to wait, and what not to do.",
    read: "4 min",
    group: "practical",
  },
  {
    slug: "weather",
    title: "Charging in hot and cold weather",
    desc: "Why a cold battery charges at half speed, what preconditioning does, and how summer heat behaves differently.",
    read: "5 min",
    group: "practical",
  },
  {
    slug: "battery-health",
    title: "Fast charging and battery health",
    desc: "Does DC fast charging hurt your battery? What the evidence says, and habits that actually matter.",
    read: "5 min",
    group: "practical",
  },
  {
    slug: "home-vs-public",
    title: "Home charging vs public charging",
    desc: "When each one makes sense, what a home install really costs, and what to do if you can't charge at home.",
    read: "5 min",
    group: "practical",
  },
  {
    slug: "road-trip",
    title: "Planning an EV road trip",
    desc: "How to plan stops, how much buffer to leave, and the mistakes that strand people on their first long drive.",
    read: "6 min",
    group: "trips",
  },
  {
    slug: "socal-charging",
    title: "Charging across Southern California",
    desc: "The I-10 and I-210 corridors, where HubCharge sits on them, and how to route a day of driving around LA.",
    read: "5 min",
    group: "trips",
  },
  {
    slug: "glossary",
    title: "EV charging glossary",
    desc: "kW vs kWh, state of charge, preconditioning, Plug & Charge — every term, in plain English.",
    read: "6 min",
    group: "reference",
  },
];

export const guideHref = (slug: string) => `/charging-101/${slug}`;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Ordered neighbours for prev/next chrome at the foot of a guide. */
export function guideNeighbours(slug: string): { prev?: Guide; next?: Guide } {
  const i = guides.findIndex((g) => g.slug === slug);
  if (i === -1) return {};
  return { prev: guides[i - 1], next: guides[i + 1] };
}

export function guidesByGroup(group: GuideGroup): Guide[] {
  return guides.filter((g) => g.group === group);
}

/** The handful surfaced in the nav dropdown — not all fourteen. */
export const NAV_GUIDES = [
  "can-my-ev-charge-here",
  "connectors",
  "charging-speed",
  "charging-cost",
  "vehicles",
  "glossary",
] as const;
