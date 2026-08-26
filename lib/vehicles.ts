/**
 * Vehicle compatibility data for the Charging 101 hub and the pricing
 * configurator. Single source of truth — keep figures conservative.
 *
 * Facts discipline (verified Aug 2026, re-verify quarterly — the NACS
 * transition moves fast):
 * - HubCharge stations offer BOTH NACS and CCS1 cables, so drivers plug the
 *   matching cable straight in — no adapter needed at our stations.
 * - tenMinMilesApprox is an APPROXIMATE range added in ~10 minutes at our
 *   up-to-180kW hardware. Never quote 350-400kW marketing figures (e.g.
 *   "217 mi in 10 min") — our chargers cannot deliver them.
 * - Pre-2026 Nissan Leaf uses CHAdeMO and CANNOT fast-charge here. Say so.
 */

export const VEHICLE_DATA_UPDATED = "August 2026";

export type PortStatus = "nacs" | "ccs" | "transitioning";

export type VehicleMake = {
  id: string;
  name: string;
  port: PortStatus;
  /** Plain-language port situation, deliberately model-year-vague */
  portNote: string;
  /** Approximate miles added in ~10 min at up-to-180kW DC. null = see note. */
  tenMinMilesApprox: [number, number] | null;
  note?: string;
};

export const vehicleMakes: VehicleMake[] = [
  {
    id: "tesla",
    name: "Tesla",
    port: "nacs",
    portNote: "All models use NACS — plug straight into our NACS cable.",
    tenMinMilesApprox: [80, 100],
  },
  {
    id: "hyundai",
    name: "Hyundai / Kia / Genesis",
    port: "transitioning",
    portNote:
      "Newer models have a NACS port; earlier models use CCS. Either way, we have your cable.",
    tenMinMilesApprox: [80, 100],
    note: "800V models like Ioniq 5 and EV6 are among the fastest-charging EVs here.",
  },
  {
    id: "ford",
    name: "Ford",
    port: "ccs",
    portNote:
      "Mustang Mach-E, F-150 Lightning and E-Transit use CCS — plug straight into our CCS cable.",
    tenMinMilesApprox: [50, 60],
  },
  {
    id: "gm",
    name: "Chevrolet / GMC / Cadillac",
    port: "transitioning",
    portNote:
      "Most current models use CCS; the newest models are moving to NACS. We have both cables.",
    tenMinMilesApprox: [60, 80],
  },
  {
    id: "rivian",
    name: "Rivian",
    port: "transitioning",
    portNote:
      "Newer R1T / R1S / R2 have a NACS port; earlier models use CCS. Both work here.",
    tenMinMilesApprox: [55, 70],
    note: "Larger battery packs and vehicle size mean added range builds a little slower.",
  },
  {
    id: "bmw",
    name: "BMW / Mini",
    port: "transitioning",
    portNote:
      "Newer models are adopting NACS; most current models use CCS. Both plug in here.",
    tenMinMilesApprox: [55, 75],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    port: "transitioning",
    portNote:
      "Newer EQ models have a NACS port; earlier models use CCS. Both work here.",
    tenMinMilesApprox: [45, 65],
    note: "Charging speed varies widely across EQ models — smaller models charge more slowly.",
  },
  {
    id: "porsche",
    name: "Porsche / Audi / VW",
    port: "ccs",
    portNote:
      "Taycan, Macan EV, e-tron and ID models use CCS — plug straight into our CCS cable.",
    tenMinMilesApprox: [70, 90],
    note: "Porsche's 800V models are among the quickest CCS vehicles at our chargers.",
  },
  {
    id: "toyota",
    name: "Toyota / Lexus / Subaru",
    port: "transitioning",
    portNote:
      "The newest models have a NACS port; earlier models use CCS. We have both cables.",
    tenMinMilesApprox: [45, 65],
  },
  {
    id: "honda",
    name: "Honda / Acura",
    port: "ccs",
    portNote: "Prologue and ZDX use CCS — plug straight into our CCS cable.",
    tenMinMilesApprox: [50, 70],
  },
  {
    id: "nissan",
    name: "Nissan",
    port: "transitioning",
    portNote:
      "The all-new 2026 Leaf has a NACS port and fast-charges here. Ariya uses CCS and works too.",
    tenMinMilesApprox: [45, 65],
    note: "Heads up: 2011–2025 Leaf models use CHAdeMO for fast charging, which our stations don't offer — those models can't DC fast-charge here.",
  },
  {
    id: "volvo",
    name: "Volvo / Polestar",
    port: "ccs",
    portNote: "Current models use CCS — plug straight into our CCS cable.",
    tenMinMilesApprox: [50, 70],
  },
  {
    id: "lucid",
    name: "Lucid",
    port: "transitioning",
    portNote: "Gravity has a NACS port; Air uses CCS. Both plug in here.",
    tenMinMilesApprox: [70, 90],
  },
  {
    id: "stellantis",
    name: "Jeep / Dodge / Ram / Fiat",
    port: "ccs",
    portNote: "Current models use CCS — plug straight into our CCS cable.",
    tenMinMilesApprox: [45, 65],
  },
  {
    id: "other",
    name: "Other EV",
    port: "transitioning",
    portNote:
      "If your EV fast-charges with a NACS or CCS port, it works here — that covers nearly every EV sold in the US.",
    tenMinMilesApprox: [45, 85],
  },
];

/** Shared, legally-careful footnote for anywhere range figures appear. */
export const RANGE_FOOTNOTE =
  "Approximate figures at our up-to-180kW chargers. Actual charging speed and added range vary by vehicle, battery state of charge, and temperature. Larger trucks and some older EVs charge more slowly.";

/** Compact per-make list for the pricing configurator (id, label, midpoint range). */
export function configuratorCars() {
  const pick = ["tesla", "rivian", "ford", "hyundai", "bmw", "mercedes", "porsche", "other"];
  return pick.map((id) => {
    const m = vehicleMakes.find((v) => v.id === id)!;
    const [lo, hi] = m.tenMinMilesApprox ?? [45, 85];
    return {
      id: m.id,
      name: m.id === "hyundai" ? "Hyundai / Kia" : m.id === "porsche" ? "Porsche" : m.name,
      r: Math.round((lo + hi) / 2),
    };
  });
}
