/**
 * The glossary, as data.
 *
 * These definitions used to live in a `const terms` inside
 * app/charging-101/glossary/page.tsx, which meant the one page that explains
 * the vocabulary was the only page that could reach it. Meanwhile the guides
 * used `kW` 42 times, `DC` 45 times and `taper` 11 times without defining any
 * of them — the explanation existed and simply could not be linked to.
 *
 * Moved here so <Term> can pull a definition into running copy anywhere.
 * The glossary page imports the same array and renders exactly as before.
 *
 * `id` is the deep-link anchor. `def` is the full entry the glossary page
 * shows; `short` is what fits in a popover next to a word mid-sentence — when
 * a term has no `short`, its `def` was already short enough.
 */

export type GlossaryTerm = {
  /** URL-safe anchor — /charging-101/glossary#kw */
  id: string;
  term: string;
  def: string;
  /** Popover-length version, when `def` runs long. */
  short?: string;
};

export type GlossaryGroup = { id: string; label: string; terms: string[] };

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "kw",
    term: "kW (kilowatt)",
    def: "Power — how fast energy is flowing right now. Higher kW = faster charging. Our chargers deliver up to 180kW.",
    short: "How fast energy is flowing right now. Higher number, faster charging.",
  },
  {
    id: "kwh",
    term: "kWh (kilowatt-hour)",
    def: "Energy — the amount delivered or stored. Battery sizes are in kWh (a typical EV holds 60–100 kWh), and per-kWh networks bill on it. Think: kW is speed, kWh is distance.",
    short: "How much energy, rather than how fast. If kW is speed, kWh is distance.",
  },
  {
    id: "soc",
    term: "SOC (State of Charge)",
    def: "Your battery's current level, as a percentage — the EV version of the fuel gauge.",
    short: "How full your battery is, as a percentage. The EV fuel gauge.",
  },
  {
    id: "dcfc",
    term: "DCFC (DC Fast Charging)",
    def: "Level 3 charging. Feeds direct current straight to the battery, bypassing the car's slower onboard charger. What HubCharge does.",
    short: "The fast kind. Power goes straight to the battery instead of through the car's slower built-in charger.",
  },
  {
    id: "nacs",
    term: "NACS (SAE J3400)",
    def: "North American Charging Standard — the compact connector Tesla created, standardized by SAE in 2023. Most automakers are adopting it. Every HubCharge charger has a NACS cable.",
    short: "The smaller of the two plugs — the one Tesla designed. Every HubCharge charger has this cable.",
  },
  {
    id: "ccs",
    term: "CCS (CCS1)",
    def: "Combined Charging System — the fast-charging connector most non-Tesla EVs have used for years: a J1772 plug with two DC pins beneath. Every HubCharge charger has a CCS cable too.",
    short: "The bigger of the two plugs, used by most non-Tesla EVs. Every HubCharge charger has this cable too.",
  },
  {
    id: "j1772",
    term: "J1772",
    def: "The standard North American connector for Level 1 and Level 2 AC charging — also the top half of a CCS plug.",
    short: "The everyday slow-charging plug. It is also the top half of a CCS plug.",
  },
  {
    id: "chademo",
    term: "CHAdeMO",
    def: "An older fast-charging standard used mainly by the 2011–2025 Nissan Leaf; being phased out industry-wide. Our stations don't carry it.",
    short: "An older plug, mostly on the 2011–2025 Nissan Leaf. We do not carry this cable.",
  },
  {
    id: "charging-curve",
    term: "Charging curve",
    def: "How your charging speed changes across a session: ramps up, peaks around 20–60% battery, then tapers near full. It's why quick top-ups are time-efficient and charging to 100% at a fast charger isn't.",
    short: "Charging is not one steady speed. It is quickest in the middle of the battery and slows right down near full.",
  },
  {
    id: "preconditioning",
    term: "Preconditioning",
    def: "Your car warming its battery before fast charging so it can accept full power. Usually automatic when you navigate to a charger in the car's own navigation — do this on the way to us.",
    short: "Your car warming its battery on the way so it can charge at full speed. Usually automatic if you navigate to us in the car.",
  },
  {
    id: "idle-fees",
    term: "Idle fees",
    def: "Per-minute penalties many networks charge when a car stays plugged in after charging finishes. At participating HubCharge locations the attendant unplugs you, so there's nothing to race back for.",
    short: "What other networks charge you for leaving the car plugged in after it has finished.",
  },
  {
    id: "plug-and-charge",
    term: "Plug & Charge",
    def: "A standard (ISO 15118) where the car and charger authenticate automatically when you plug in — no card or app. HubCharge takes a different no-app route: everything runs in your phone's browser.",
    short: "Where the car and charger sort out payment between themselves. We do the same job in your phone's browser instead.",
  },
  {
    id: "range-per-hour",
    term: "Range per hour",
    def: "Miles of driving range added per hour of charging at a given power level — the most intuitive way to compare charging speeds.",
    short: "Miles added per hour of charging — the easiest way to compare one charger with another.",
  },
  {
    id: "800v",
    term: "800V architecture",
    def: "A higher-voltage vehicle design (Hyundai Ioniq 5, Kia EV6, Porsche Taycan…) that can charge very quickly. These cars are among the fastest-charging at our stations.",
    short: "A car design that takes power unusually quickly. The Ioniq 5, EV6 and Taycan are the well-known ones.",
  },
];

export const GLOSSARY_GROUPS: GlossaryGroup[] = [
  {
    id: "power-and-energy",
    label: "Power and energy",
    terms: ["kW (kilowatt)", "kWh (kilowatt-hour)", "SOC (State of Charge)", "Range per hour"],
  },
  {
    id: "connectors",
    label: "Connectors",
    terms: ["NACS (SAE J3400)", "CCS (CCS1)", "J1772", "CHAdeMO"],
  },
  {
    id: "charging-behaviour",
    label: "Charging behaviour",
    terms: ["DCFC (DC Fast Charging)", "Charging curve", "Preconditioning", "800V architecture"],
  },
  { id: "paying-and-access", label: "Paying and access", terms: ["Idle fees", "Plug & Charge"] },
];

/** Every id, as a union, so <Term id="…"> cannot point at a term we don't have. */
export type GlossaryId = (typeof GLOSSARY_TERMS)[number]["id"];

const BY_ID = new Map(GLOSSARY_TERMS.map((t) => [t.id, t]));

export function glossaryTerm(id: string): GlossaryTerm | undefined {
  return BY_ID.get(id);
}

/** What a popover should say: the short form when there is one. */
export function glossaryBrief(t: GlossaryTerm): string {
  return t.short ?? t.def;
}

export const GLOSSARY_HREF = "/charging-101/glossary";
