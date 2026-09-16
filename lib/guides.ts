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
  /**
   * The answer, before the explanation — two or three sentences a reader with
   * no EV vocabulary can act on. Enforced jargon-free: none of the 14 terms in
   * lib/glossary.ts may appear here. If a summary needs the jargon to make
   * sense, it is not a summary, it is the article.
   */
  short: string;
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
    short:
      "Almost certainly yes. Our chargers carry CCS1 and NACS — the two plug types used in America — so nearly every electric car sold here plugs straight in, with no adapter. We do not carry CHAdeMO.",
    group: "start",
    note: "Start here.",
  },
  {
    slug: "new-ev-owner",
    title: "Just got an EV? Start here",
    desc: "A short path through everything above, in the order it actually matters during your first month.",
    read: "3 min",
    short:
      "Three things sort out your first month: find out which plug your car takes, work out where it charges most nights, and make one deliberate stop at a fast charger before you actually need one. The rest you pick up as you go.",
    group: "start",
    note: "New owner? This first.",
  },
  {
    slug: "connectors",
    title: "NACS vs CCS, explained",
    desc: "The two fast-charging plugs in America, explained — and why we carry both.",
    read: "3 min",
    short:
      "There are two kinds of fast-charging plug in America, and every HubCharge charger has one of each hanging on it. Look at the socket on your car, take the cable that matches, and that is the whole decision. Pick up the wrong one and it simply will not fit.",
    group: "start",
  },
  {
    slug: "charging-levels",
    title: "Charging levels, explained",
    desc: "Level 1, Level 2 and DC fast charging — what the numbers actually mean.",
    read: "3 min",
    short:
      "Three speeds, really. An ordinary wall socket adds a few miles an hour and is fine overnight. A dedicated home unit fills most cars while you sleep. The kind we run tops you up in minutes instead of hours.",
    group: "how",
  },
  {
    slug: "charging-speed",
    title: "How long does charging take?",
    desc: "The charging curve, the 20–60% sweet spot, and why a ten-minute top-up is usually the smart move.",
    read: "5 min",
    short:
      "Charging is not one steady speed. It is quickest when your battery is fairly empty and slows right down as it fills, so a short stop that takes you from low to comfortable is far better value for your time than waiting for a full battery.",
    group: "how",
  },
  {
    slug: "charging-cost",
    title: "What does charging cost?",
    desc: "Per-kWh, per-minute, idle fees, memberships — how public charging pricing works, and how we simplified it.",
    read: "4 min",
    short:
      "Public charging is priced in several different ways, and the lowest headline number is often not the cheapest stop. We price by time rather than by energy, and you see what the stop will cost on the screen before anything starts.",
    group: "how",
  },
  {
    slug: "vehicles",
    title: "Charging guides by make",
    desc: "Tesla, Ford, Rivian, Hyundai and eleven more — what your car plugs into and roughly what ten minutes gets you.",
    read: "2 min",
    short:
      "Look up your make and you get two things: which of the two plugs your car uses, and roughly how far ten minutes here will take you. The figures come from published independent tests, not from manufacturer headlines.",
    group: "vehicles",
  },
  {
    slug: "etiquette",
    title: "Charging etiquette",
    desc: "The unwritten rules of a shared charger — when to move, when to wait, and what not to do.",
    read: "4 min",
    short:
      "Move your car when it is done. Do not fill to the very top when someone is waiting. Never unplug a stranger. That is most of it.",
    group: "practical",
  },
  {
    slug: "weather",
    title: "Charging in hot and cold weather",
    desc: "Why a cold battery charges at half speed, what preconditioning does, and how summer heat behaves differently.",
    read: "5 min",
    short:
      "Cold slows charging down, sometimes by half, because the battery has to warm up before it will take power quickly. Warming it on the drive over fixes most of that, and many cars do it for you if you set the charger as your destination. Heat is kinder to charging and harder on range.",
    group: "practical",
  },
  {
    slug: "battery-health",
    title: "Fast charging and battery health",
    desc: "Does DC fast charging hurt your battery? What the evidence says, and habits that actually matter.",
    read: "5 min",
    short:
      "Using fast chargers regularly does far less harm than most people fear. What actually ages a battery is sitting very full or very empty for long stretches, and heat. Day to day, roughly where you keep the needle matters more than where you plug in.",
    group: "practical",
  },
  {
    slug: "home-vs-public",
    title: "Home charging vs public charging",
    desc: "When each one makes sense, what a home install really costs, and what to do if you can't charge at home.",
    read: "5 min",
    short:
      "If you can plug in where you sleep, do — it is cheaper and you stop thinking about it. If you cannot, an EV still works perfectly well; you swap a nightly habit for a short weekly stop, which is the thing we are built for.",
    group: "practical",
  },
  {
    slug: "apartment-charging",
    title: "Charging an EV without a driveway",
    navTitle: "No driveway?",
    desc: "Renting, or parking on the street? How to run an EV on public charging alone, and what it takes each week.",
    read: "6 min",
    short:
      "You do not need a driveway. Most people without one settle into one or two quick stops a week, timed around something they were doing anyway. It takes some planning in the first month and almost none by the third.",
    group: "practical",
    note: "For renters and street parkers.",
  },
  {
    slug: "charging-troubleshooting",
    title: "When charging goes wrong",
    navTitle: "Troubleshooting",
    desc: "The session won't start, the car stopped early, the cable won't come out. What each symptom usually means.",
    read: "6 min",
    short:
      "Most failed sessions come down to a handful of causes, and nearly all of them clear if you unplug, wait a moment and try again. If that does not work, the support number is printed on the machine.",
    group: "practical",
  },
  {
    slug: "rideshare-drivers",
    title: "Charging for rideshare and delivery drivers",
    navTitle: "Rideshare & delivery",
    desc: "Fitting charging into a shift instead of around it — how many stops a day of driving actually needs.",
    read: "5 min",
    short:
      "The trick is charging during breaks you were taking anyway rather than making a separate trip for it. A full day of driving usually needs one or two short stops, and where you take them matters more than how long they last.",
    group: "practical",
  },
  {
    slug: "road-trip",
    title: "Planning an EV road trip",
    desc: "How to plan stops, how much buffer to leave, and the mistakes that strand people on their first long drive.",
    read: "6 min",
    short:
      "Plan around stops you would want anyway — food, coffee, a walk — and leave more spare range than feels necessary. The people who get stranded are almost always the ones who cut the last leg fine.",
    group: "trips",
  },
  {
    slug: "charging-corridors",
    title: "The corridors we charge on",
    navTitle: "Corridors",
    desc: "The I-10 and I-210 out of Los Angeles and I-35 through Round Rock — where HubCharge sits on them, and how to route a day around that.",
    read: "5 min",
    short:
      "Two motorways carry most of the driving around here, and we sit on both of them. If you are heading east out of Los Angeles, this covers where to stop and what traffic and heat will cost you on the way.",
    group: "trips",
  },
  {
    slug: "ev-incentives",
    title: "EV incentives, by where you live",
    navTitle: "Incentives",
    desc: "Federal credits, state and utility programmes in California and Texas — what exists, what has closed, who qualifies, and where to verify each one.",
    read: "7 min",
    short:
      "Several of the big programmes people still ask about have ended. This page shows what is genuinely open right now, what has closed and when, and sends you to the body that runs each one rather than quoting amounts that go out of date.",
    group: "reference",
  },
  {
    slug: "glossary",
    title: "EV charging glossary",
    desc: "kW vs kWh, state of charge, preconditioning, Plug & Charge — every term, in plain English.",
    read: "6 min",
    short:
      "Every bit of jargon you will meet at a charger, in ordinary English. Search it, or browse by topic.",
    group: "reference",
  },
];

export const guideHref = (slug: string) => `/charging-101/${slug}`;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/**
 * Ordered neighbours for prev/next chrome at the foot of a guide.
 *
 * Scoped to the guide's own group. Walking the flat array sent you from
 * "Charging guides by make" (Your car) straight into "Charging etiquette"
 * (Everyday charging) — a prev/next that crosses a section boundary reads as
 * a broken index rather than a reading order.
 */
export function guideNeighbours(slug: string): { prev?: Guide; next?: Guide } {
  const g = getGuide(slug);
  if (!g) return {};
  const siblings = guidesByGroup(g.group);
  const i = siblings.findIndex((x) => x.slug === slug);
  return { prev: siblings[i - 1], next: siblings[i + 1] };
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

/**
 * The anchor a guide section renders under. Lived inside the [slug] route,
 * which meant anything else linking to a section had to guess the same rules.
 */
export function guideSectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
