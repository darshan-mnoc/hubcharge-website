/**
 * Per-model EV charging data.
 *
 * WHY THIS EXISTS
 * The previous model was 15 make-level buckets — several of them multi-brand
 * ("Porsche / Audi / VW") — each carrying one range band that got collapsed to
 * a midpoint and multiplied by a fixed factor. A Model 3 and a Cybertruck
 * returned the same number, and the station's own power was never an input.
 *
 * FACTS DISCIPLINE
 * - Figures are for our hardware: DC, capped at the station's maxKw (180kW).
 * - `peakKw` is the vehicle's own sustained ceiling, NOT a marketing headline.
 *   Cybertruck advertises 500kW; measured 10-80% average is ~118kW. We use
 *   tested behaviour, never the press-release number.
 * - `curve` is power against state of charge. This is the thing that actually
 *   determines how many miles a ten-minute stop adds, because power is not
 *   constant — it plateaus, then tapers hard past roughly 60%.
 * - Efficiency comes from EPA figures (public domain, US test cycle), not
 *   WLTP, which flatters by 10-20% and is measured on a different cycle.
 * - Every number is a real published spec or an independent test result.
 *   Where sources disagreed the conservative figure was taken.
 *
 * MAINTENANCE
 * Model years move. Re-verify against EPA fueleconomy.gov and independent
 * DCFC tests (InsideEVs, Out of Spec, EVKX) at the cadence in DATA_UPDATED.
 */

export const EV_DATA_UPDATED = "August 2026";

export type Port = "nacs" | "ccs" | "chademo";

export type CurvePoint = { soc: number; kw: number };

export type EvModel = {
  id: string;
  makeId: string;
  /** Display name, e.g. "Ioniq 5 Long Range AWD" */
  name: string;
  /** Short label for compact UI */
  short: string;
  port: Port;
  /** Usable pack capacity in kWh (not gross) */
  usableKwh: number;
  /** EPA combined range, miles */
  epaMiles: number;
  /** Vehicle's own sustained DC ceiling in kW */
  peakKw: number;
  archV: 400 | 800;
  /** Onboard AC charger ceiling, kW — the limit for Level 1 and Level 2. */
  acKw: number;
  /** Power vs state of charge. Monotonic in soc. */
  curve: CurvePoint[];
  note?: string;
};

/** A 400V pack on a 180kW cabinet can be current-limited below the cap. */
export const ARCH_NOTE_400 =
  "400V architecture — real-world power depends on the charger's current rating as well as its kW.";
export const ARCH_NOTE_800 =
  "800V architecture — holds the charger's full output further up the curve.";

/**
 * Curves are simplified to the shape that matters: a plateau at the vehicle's
 * sustained ceiling, then the taper. Sourced from published specs plus
 * independent 10-80% tests; conservative where sources disagreed.
 */
export const evModels: EvModel[] = [
  // ── Tesla ──────────────────────────────────────────────────────────────
  {
    id: "tesla-model-3-lr", makeId: "tesla", name: "Model 3 Long Range", short: "Model 3 LR",
    port: "nacs", usableKwh: 75, epaMiles: 363, peakKw: 250, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:250},{soc:20,kw:220},{soc:30,kw:180},{soc:40,kw:160},{soc:50,kw:140},{soc:60,kw:100},{soc:70,kw:80},{soc:80,kw:60},{soc:90,kw:35},{soc:100,kw:12}],
  },
  {
    id: "tesla-model-y-lr", makeId: "tesla", name: "Model Y Long Range", short: "Model Y LR",
    port: "nacs", usableKwh: 75, epaMiles: 320, peakKw: 250, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:250},{soc:20,kw:215},{soc:30,kw:175},{soc:40,kw:155},{soc:50,kw:135},{soc:60,kw:100},{soc:70,kw:78},{soc:80,kw:58},{soc:90,kw:34},{soc:100,kw:12}],
  },
  {
    id: "tesla-cybertruck", makeId: "tesla", name: "Cybertruck AWD", short: "Cybertruck",
    port: "nacs", usableKwh: 123, epaMiles: 325, peakKw: 165, archV: 800, acKw: 11.5,
    curve: [{soc:5,kw:165},{soc:20,kw:155},{soc:30,kw:140},{soc:40,kw:130},{soc:50,kw:118},{soc:60,kw:100},{soc:70,kw:80},{soc:80,kw:60},{soc:90,kw:35},{soc:100,kw:12}],
    note: "Tesla advertises a 500kW peak; independent 10-80% testing measures roughly 118kW average. We use the tested figure.",
  },
  // ── Hyundai / Kia / Genesis (E-GMP, 800V) ──────────────────────────────
  {
    id: "hyundai-ioniq-5", makeId: "hyundai", name: "Ioniq 5 Long Range", short: "Ioniq 5",
    port: "nacs", usableKwh: 84, epaMiles: 318, peakKw: 235, archV: 800, acKw: 10.9,
    curve: [{soc:5,kw:225},{soc:20,kw:235},{soc:40,kw:230},{soc:50,kw:220},{soc:60,kw:150},{soc:70,kw:110},{soc:80,kw:85},{soc:90,kw:50},{soc:100,kw:15}],
    note: "One of the fastest-charging EVs on our chargers — it sits at our full output almost the whole way to 60%.",
  },
  {
    id: "hyundai-ioniq-6", makeId: "hyundai", name: "Ioniq 6 Long Range", short: "Ioniq 6",
    port: "nacs", usableKwh: 77, epaMiles: 342, peakKw: 233, archV: 800, acKw: 10.9,
    curve: [{soc:5,kw:220},{soc:20,kw:233},{soc:40,kw:225},{soc:50,kw:210},{soc:60,kw:145},{soc:70,kw:105},{soc:80,kw:80},{soc:90,kw:48},{soc:100,kw:15}],
  },
  {
    id: "kia-ev6", makeId: "hyundai", name: "Kia EV6 Long Range", short: "EV6",
    port: "nacs", usableKwh: 84, epaMiles: 319, peakKw: 235, archV: 800, acKw: 10.9,
    curve: [{soc:5,kw:225},{soc:20,kw:235},{soc:40,kw:228},{soc:50,kw:215},{soc:60,kw:148},{soc:70,kw:108},{soc:80,kw:82},{soc:90,kw:50},{soc:100,kw:15}],
  },
  {
    id: "kia-ev9", makeId: "hyundai", name: "Kia EV9 Long Range", short: "EV9",
    port: "nacs", usableKwh: 96, epaMiles: 304, peakKw: 210, archV: 800, acKw: 10.9,
    curve: [{soc:5,kw:200},{soc:20,kw:210},{soc:40,kw:195},{soc:50,kw:180},{soc:60,kw:140},{soc:70,kw:100},{soc:80,kw:75},{soc:90,kw:45},{soc:100,kw:14}],
  },
  // ── Ford ───────────────────────────────────────────────────────────────
  {
    id: "ford-mach-e-er", makeId: "ford", name: "Mustang Mach-E Extended Range", short: "Mach-E ER",
    port: "ccs", usableKwh: 88, epaMiles: 320, peakKw: 150, archV: 400, acKw: 10.5,
    curve: [{soc:5,kw:145},{soc:20,kw:150},{soc:30,kw:140},{soc:40,kw:125},{soc:50,kw:110},{soc:60,kw:90},{soc:70,kw:70},{soc:80,kw:50},{soc:90,kw:30},{soc:100,kw:10}],
  },
  {
    id: "ford-mach-e-sr", makeId: "ford", name: "Mustang Mach-E Standard Range", short: "Mach-E SR",
    port: "ccs", usableKwh: 70, epaMiles: 250, peakKw: 115, archV: 400, acKw: 10.5,
    curve: [{soc:5,kw:110},{soc:20,kw:115},{soc:40,kw:105},{soc:50,kw:92},{soc:60,kw:78},{soc:70,kw:62},{soc:80,kw:45},{soc:90,kw:27},{soc:100,kw:9}],
  },
  {
    id: "ford-lightning-er", makeId: "ford", name: "F-150 Lightning Extended Range", short: "F-150 Lightning",
    port: "ccs", usableKwh: 131, epaMiles: 320, peakKw: 155, archV: 400, acKw: 19.2,
    curve: [{soc:5,kw:150},{soc:20,kw:155},{soc:30,kw:145},{soc:40,kw:130},{soc:50,kw:115},{soc:60,kw:95},{soc:70,kw:72},{soc:80,kw:52},{soc:90,kw:30},{soc:100,kw:10}],
  },
  // ── GM ─────────────────────────────────────────────────────────────────
  {
    id: "chevy-equinox-ev", makeId: "gm", name: "Equinox EV LT", short: "Equinox EV",
    port: "ccs", usableKwh: 85, epaMiles: 319, peakKw: 150, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:145},{soc:20,kw:150},{soc:30,kw:138},{soc:40,kw:122},{soc:50,kw:105},{soc:60,kw:88},{soc:70,kw:68},{soc:80,kw:48},{soc:90,kw:28},{soc:100,kw:10}],
  },
  {
    id: "chevy-blazer-ev", makeId: "gm", name: "Blazer EV RS", short: "Blazer EV",
    port: "ccs", usableKwh: 85, epaMiles: 279, peakKw: 150, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:145},{soc:20,kw:150},{soc:30,kw:135},{soc:40,kw:120},{soc:50,kw:102},{soc:60,kw:85},{soc:70,kw:66},{soc:80,kw:47},{soc:90,kw:27},{soc:100,kw:10}],
  },
  {
    id: "chevy-bolt-legacy", makeId: "gm", name: "Bolt EV / EUV (2017–2023)", short: "Bolt (older)",
    port: "ccs", usableKwh: 65, epaMiles: 259, peakKw: 55, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:54},{soc:20,kw:55},{soc:40,kw:52},{soc:50,kw:46},{soc:60,kw:38},{soc:70,kw:30},{soc:80,kw:24},{soc:90,kw:16},{soc:100,kw:6}],
    note: "Peaks around 55kW, so our charger's output isn't the limit — the car is. A stop here takes noticeably longer than in a newer EV.",
  },
  // ── Rivian ─────────────────────────────────────────────────────────────
  {
    id: "rivian-r1t-large", makeId: "rivian", name: "R1T Large Pack", short: "R1T",
    port: "nacs", usableKwh: 109, epaMiles: 329, peakKw: 200, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:190},{soc:20,kw:200},{soc:30,kw:180},{soc:40,kw:160},{soc:50,kw:135},{soc:60,kw:108},{soc:70,kw:82},{soc:80,kw:58},{soc:90,kw:33},{soc:100,kw:11}],
    note: "Charges quickly, but it's a heavy truck — the same kWh buys fewer miles than in a sedan.",
  },
  {
    id: "rivian-r1s-large", makeId: "rivian", name: "R1S Large Pack", short: "R1S",
    port: "nacs", usableKwh: 109, epaMiles: 316, peakKw: 200, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:190},{soc:20,kw:200},{soc:30,kw:178},{soc:40,kw:158},{soc:50,kw:133},{soc:60,kw:106},{soc:70,kw:80},{soc:80,kw:57},{soc:90,kw:32},{soc:100,kw:11}],
  },
  // ── BMW ────────────────────────────────────────────────────────────────
  {
    id: "bmw-i4-edrive40", makeId: "bmw", name: "i4 eDrive40", short: "i4",
    port: "ccs", usableKwh: 81, epaMiles: 318, peakKw: 200, archV: 400, acKw: 11,
    curve: [{soc:5,kw:190},{soc:20,kw:200},{soc:30,kw:180},{soc:40,kw:158},{soc:50,kw:132},{soc:60,kw:105},{soc:70,kw:80},{soc:80,kw:56},{soc:90,kw:32},{soc:100,kw:11}],
  },
  {
    id: "bmw-ix-xdrive50", makeId: "bmw", name: "iX xDrive50", short: "iX",
    port: "ccs", usableKwh: 105, epaMiles: 307, peakKw: 195, archV: 400, acKw: 11,
    curve: [{soc:5,kw:185},{soc:20,kw:195},{soc:30,kw:178},{soc:40,kw:155},{soc:50,kw:130},{soc:60,kw:102},{soc:70,kw:78},{soc:80,kw:55},{soc:90,kw:31},{soc:100,kw:11}],
  },
  // ── Mercedes ───────────────────────────────────────────────────────────
  {
    id: "mercedes-eqe-350", makeId: "mercedes", name: "EQE 350+", short: "EQE",
    port: "nacs", usableKwh: 90, epaMiles: 308, peakKw: 170, archV: 400, acKw: 9.6,
    curve: [{soc:5,kw:165},{soc:20,kw:170},{soc:30,kw:158},{soc:40,kw:140},{soc:50,kw:120},{soc:60,kw:98},{soc:70,kw:75},{soc:80,kw:53},{soc:90,kw:30},{soc:100,kw:10}],
  },
  {
    id: "mercedes-eqs-450", makeId: "mercedes", name: "EQS 450+", short: "EQS",
    port: "nacs", usableKwh: 118, epaMiles: 352, peakKw: 200, archV: 400, acKw: 9.6,
    curve: [{soc:5,kw:190},{soc:20,kw:200},{soc:30,kw:180},{soc:40,kw:158},{soc:50,kw:133},{soc:60,kw:106},{soc:70,kw:80},{soc:80,kw:57},{soc:90,kw:32},{soc:100,kw:11}],
  },
  // ── Porsche / Audi / VW ────────────────────────────────────────────────
  {
    id: "porsche-taycan", makeId: "porsche", name: "Taycan", short: "Taycan",
    port: "ccs", usableKwh: 97, epaMiles: 318, peakKw: 270, archV: 800, acKw: 11,
    curve: [{soc:5,kw:260},{soc:20,kw:270},{soc:40,kw:255},{soc:50,kw:230},{soc:60,kw:170},{soc:70,kw:120},{soc:80,kw:88},{soc:90,kw:52},{soc:100,kw:16}],
    note: "800V — it holds our charger's full output right through the useful part of the curve.",
  },
  {
    id: "porsche-macan-ev", makeId: "porsche", name: "Macan Electric", short: "Macan EV",
    port: "ccs", usableKwh: 95, epaMiles: 308, peakKw: 270, archV: 800, acKw: 11,
    curve: [{soc:5,kw:255},{soc:20,kw:270},{soc:40,kw:250},{soc:50,kw:225},{soc:60,kw:165},{soc:70,kw:118},{soc:80,kw:86},{soc:90,kw:50},{soc:100,kw:16}],
  },
  {
    id: "vw-id4-pro", makeId: "vw", name: "ID.4 Pro (2024+)", short: "ID.4",
    port: "ccs", usableKwh: 77, epaMiles: 291, peakKw: 175, archV: 400, acKw: 11,
    curve: [{soc:5,kw:165},{soc:20,kw:175},{soc:30,kw:160},{soc:40,kw:140},{soc:50,kw:118},{soc:60,kw:95},{soc:70,kw:72},{soc:80,kw:52},{soc:90,kw:30},{soc:100,kw:10}],
    note: "Earlier ID.4s (2021–2023) peak around 135kW rather than 175kW.",
  },
  {
    id: "audi-q6-etron", makeId: "vw", name: "Audi Q6 e-tron", short: "Q6 e-tron",
    port: "ccs", usableKwh: 94, epaMiles: 307, peakKw: 260, archV: 800, acKw: 9.6,
    curve: [{soc:5,kw:250},{soc:20,kw:260},{soc:40,kw:240},{soc:50,kw:215},{soc:60,kw:160},{soc:70,kw:115},{soc:80,kw:85},{soc:90,kw:50},{soc:100,kw:16}],
  },
  // ── Toyota / Lexus / Subaru ────────────────────────────────────────────
  {
    id: "toyota-bz", makeId: "toyota", name: "bZ (2026)", short: "Toyota bZ",
    port: "nacs", usableKwh: 74, epaMiles: 314, peakKw: 150, archV: 400, acKw: 11,
    curve: [{soc:5,kw:145},{soc:20,kw:150},{soc:30,kw:136},{soc:40,kw:120},{soc:50,kw:102},{soc:60,kw:84},{soc:70,kw:65},{soc:80,kw:47},{soc:90,kw:27},{soc:100,kw:9}],
  },
  // ── Honda / Acura ──────────────────────────────────────────────────────
  {
    id: "honda-prologue", makeId: "honda", name: "Prologue", short: "Prologue",
    port: "ccs", usableKwh: 85, epaMiles: 296, peakKw: 155, archV: 400, acKw: 11.5,
    curve: [{soc:5,kw:150},{soc:20,kw:155},{soc:30,kw:142},{soc:40,kw:125},{soc:50,kw:107},{soc:60,kw:88},{soc:70,kw:68},{soc:80,kw:48},{soc:90,kw:28},{soc:100,kw:10}],
  },
  // ── Nissan ─────────────────────────────────────────────────────────────
  {
    id: "nissan-ariya", makeId: "nissan", name: "Ariya", short: "Ariya",
    port: "ccs", usableKwh: 87, epaMiles: 289, peakKw: 130, archV: 400, acKw: 7.2,
    curve: [{soc:5,kw:125},{soc:20,kw:130},{soc:30,kw:120},{soc:40,kw:108},{soc:50,kw:93},{soc:60,kw:78},{soc:70,kw:60},{soc:80,kw:44},{soc:90,kw:25},{soc:100,kw:9}],
  },
  {
    id: "nissan-leaf-2026", makeId: "nissan", name: "Leaf (2026, 75 kWh)", short: "Leaf 2026",
    port: "nacs", usableKwh: 75, epaMiles: 303, peakKw: 150, archV: 400, acKw: 7.2,
    curve: [{soc:5,kw:145},{soc:20,kw:150},{soc:30,kw:135},{soc:40,kw:118},{soc:50,kw:100},{soc:60,kw:82},{soc:70,kw:63},{soc:80,kw:45},{soc:90,kw:26},{soc:100,kw:9}],
    note: "The 2026 Leaf moved to NACS. Leafs from 2011–2025 use CHAdeMO and cannot fast-charge at our stations.",
  },
  // ── Volvo / Polestar ───────────────────────────────────────────────────
  {
    id: "polestar-2-lr", makeId: "volvo", name: "Polestar 2 Long Range", short: "Polestar 2",
    port: "ccs", usableKwh: 79, epaMiles: 320, peakKw: 205, archV: 400, acKw: 11,
    curve: [{soc:5,kw:195},{soc:20,kw:205},{soc:30,kw:185},{soc:40,kw:160},{soc:50,kw:133},{soc:60,kw:105},{soc:70,kw:80},{soc:80,kw:56},{soc:90,kw:32},{soc:100,kw:11}],
  },
  {
    id: "volvo-ex30", makeId: "volvo", name: "EX30 Extended Range", short: "EX30",
    port: "ccs", usableKwh: 64, epaMiles: 253, peakKw: 153, archV: 400, acKw: 11,
    curve: [{soc:5,kw:148},{soc:20,kw:153},{soc:30,kw:138},{soc:40,kw:120},{soc:50,kw:102},{soc:60,kw:84},{soc:70,kw:64},{soc:80,kw:46},{soc:90,kw:26},{soc:100,kw:9}],
  },
  // ── Lucid ──────────────────────────────────────────────────────────────
  {
    id: "lucid-gravity", makeId: "lucid", name: "Gravity Grand Touring", short: "Gravity",
    port: "nacs", usableKwh: 123, epaMiles: 450, peakKw: 260, archV: 800, acKw: 19.2,
    curve: [{soc:5,kw:250},{soc:20,kw:260},{soc:40,kw:240},{soc:50,kw:215},{soc:60,kw:160},{soc:70,kw:115},{soc:80,kw:85},{soc:90,kw:50},{soc:100,kw:16}],
    note: "Exceptional efficiency — the same kWh goes further here than in almost anything else.",
  },
  // ── Stellantis ─────────────────────────────────────────────────────────
  {
    id: "jeep-wagoneer-s", makeId: "stellantis", name: "Wagoneer S", short: "Wagoneer S",
    port: "ccs", usableKwh: 94, epaMiles: 294, peakKw: 200, archV: 400, acKw: 11,
    curve: [{soc:5,kw:190},{soc:20,kw:200},{soc:30,kw:180},{soc:40,kw:157},{soc:50,kw:132},{soc:60,kw:105},{soc:70,kw:80},{soc:80,kw:56},{soc:90,kw:32},{soc:100,kw:11}],
  },
];

export function modelsForMake(makeId: string): EvModel[] {
  return evModels.filter((m) => m.makeId === makeId);
}

export function getModel(id: string): EvModel | undefined {
  return evModels.find((m) => m.id === id);
}

/** Miles per kWh, derived from EPA range and usable capacity. */
export function efficiencyMiPerKwh(m: EvModel): number {
  return m.epaMiles / m.usableKwh;
}

// ─────────────────────────────────────────────────────────────────────────
// MAKE-LEVEL VIEW
//
// Derived from the models above rather than maintained separately, so the
// two can never disagree. This replaces the old lib/vehicles.ts, where a
// make carried its own hand-typed range band independent of any model.
// ─────────────────────────────────────────────────────────────────────────

export type PortStatus = "nacs" | "ccs" | "transitioning";

export type EvMake = {
  id: string;
  name: string;
  port: PortStatus;
  portNote: string;
  note?: string;
};

const MAKE_COPY: Record<string, { name: string; portNote: string; note?: string }> = {
  tesla: {
    name: "Tesla",
    portNote: "All models use NACS — plug straight into our NACS cable.",
  },
  hyundai: {
    name: "Hyundai / Kia / Genesis",
    portNote:
      "Newer models have a NACS port; earlier models use CCS. Either way, we have your cable.",
    note: "The 800V models — Ioniq 5, Ioniq 6, EV6 — are among the fastest-charging EVs on our chargers.",
  },
  ford: {
    name: "Ford",
    portNote:
      "Mustang Mach-E, F-150 Lightning and E-Transit use CCS — plug straight into our CCS cable.",
  },
  gm: {
    name: "Chevrolet / GMC / Cadillac",
    portNote:
      "Most current models use CCS; the newest are moving to NACS. We have both cables.",
    note: "Bolts from 2017–2023 peak around 55kW, so they charge noticeably slower than a current model.",
  },
  rivian: {
    name: "Rivian",
    portNote:
      "Newer R1T, R1S and R2 have a NACS port; earlier models use CCS. Both work here.",
    note: "Quick to charge, but they're heavy trucks — the same kWh buys fewer miles than in a sedan.",
  },
  bmw: {
    name: "BMW / Mini",
    portNote:
      "Most current models use CCS; the newest are adopting NACS. Both plug in here.",
  },
  mercedes: {
    name: "Mercedes-Benz",
    portNote:
      "Newer EQ models have a NACS port; earlier ones use CCS. Both work here.",
  },
  porsche: {
    name: "Porsche",
    portNote: "Taycan and Macan Electric use CCS — plug straight into our CCS cable.",
    note: "800V cars — they hold our charger's full output right through the useful part of the curve.",
  },
  vw: {
    name: "Volkswagen / Audi",
    portNote: "ID.4, Q6 e-tron and the rest use CCS — plug straight into our CCS cable.",
  },
  toyota: {
    name: "Toyota / Lexus / Subaru",
    portNote:
      "The newest models have a NACS port; earlier ones use CCS. We have both cables.",
  },
  honda: {
    name: "Honda / Acura",
    portNote: "Prologue and ZDX use CCS — plug straight into our CCS cable.",
  },
  nissan: {
    name: "Nissan",
    portNote:
      "The 2026 Leaf has a NACS port and charges here. Ariya uses CCS and works too.",
    note: "Leafs from 2011–2025 use CHAdeMO for fast charging, which our stations don't carry — those model years can't DC fast-charge here.",
  },
  volvo: {
    name: "Volvo / Polestar",
    portNote: "Current models use CCS — plug straight into our CCS cable.",
  },
  lucid: {
    name: "Lucid",
    portNote: "Gravity has a NACS port; Air uses CCS. Both plug in here.",
  },
  stellantis: {
    name: "Jeep / Dodge / Ram / Fiat",
    portNote: "Current models use CCS — plug straight into our CCS cable.",
  },
};

/** Port status for a make, derived from the ports its models actually use. */
function derivePort(models: EvModel[]): PortStatus {
  const ports = new Set(models.map((m) => m.port));
  if (ports.size === 1) return [...ports][0] === "nacs" ? "nacs" : "ccs";
  return "transitioning";
}

export const evMakes: EvMake[] = Object.keys(MAKE_COPY).map((id) => {
  const models = modelsForMake(id);
  const copy = MAKE_COPY[id];
  return { id, name: copy.name, portNote: copy.portNote, note: copy.note, port: derivePort(models) };
});

export function getMake(id: string): EvMake | undefined {
  return evMakes.find((m) => m.id === id);
}

/**
 * Range band a make adds in ten minutes, derived from the widest span across
 * its models rather than typed by hand — so it always reflects the data.
 */
export function makeRangeBand(
  makeId: string,
  simulate: (m: EvModel) => { milesLow: number; milesHigh: number }
): [number, number] | null {
  const models = modelsForMake(makeId);
  if (models.length === 0) return null;
  const results = models.map(simulate);
  return [
    Math.min(...results.map((r) => r.milesLow)),
    Math.max(...results.map((r) => r.milesHigh)),
  ];
}

/** The disclosure that must accompany any published range figure. */
export const RANGE_FOOTNOTE =
  "Approximate figures at our up-to-180kW chargers, modelled from each car's published charging curve. Actual charging speed and added range vary by vehicle, battery state of charge, temperature and battery age. Larger trucks and older EVs charge more slowly.";
