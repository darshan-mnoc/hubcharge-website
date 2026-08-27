import {
  type EvModel,
  efficiencyMiPerKwh,
  modelsForMake,
  getModel,
} from "@/lib/ev-models";

/**
 * Charging simulation.
 *
 * Integrates the vehicle's power curve against the station's ceiling, minute
 * by minute, instead of multiplying a per-make midpoint by a fixed factor.
 * That matters because charging power is not constant: it plateaus, then
 * tapers hard past roughly 60% state of charge, so the same ten minutes
 * buys very different range depending on how full the battery already is.
 *
 * Deliberately conservative:
 * - Power is capped at min(vehicle curve, station output).
 * - A derate factor accounts for real-world losses — thermal management,
 *   cabin conditioning, cable and conversion loss.
 * - Results are returned as a BAND, not a single number. A band is what we
 *   can actually stand behind; false precision on a figure that swings with
 *   temperature and starting charge would be worse than useless.
 */

/** Charging is ~90% efficient at the pack after conversion and thermal load. */
const DELIVERY_EFFICIENCY = 0.9;

/** Cold packs charge far slower. Applied to the whole curve. */
export const TEMPERATURE_FACTORS = {
  cold: { id: "cold", label: "Cold (~40°F)", factor: 0.62 },
  mild: { id: "mild", label: "Mild (~70°F)", factor: 1.0 },
  hot: { id: "hot", label: "Hot (~95°F)", factor: 0.88 },
} as const;

export type TemperatureId = keyof typeof TEMPERATURE_FACTORS;

/** Linear interpolation of the vehicle's curve at an arbitrary SoC. */
export function powerAtSoc(model: EvModel, soc: number): number {
  const c = model.curve;
  if (soc <= c[0].soc) return c[0].kw;
  if (soc >= c[c.length - 1].soc) return c[c.length - 1].kw;
  for (let i = 0; i < c.length - 1; i++) {
    const a = c[i], b = c[i + 1];
    if (soc >= a.soc && soc <= b.soc) {
      const t = (soc - a.soc) / (b.soc - a.soc);
      return a.kw + t * (b.kw - a.kw);
    }
  }
  return c[c.length - 1].kw;
}

export type SessionResult = {
  /** Conservative and optimistic ends of the range band, in miles */
  milesLow: number;
  milesHigh: number;
  /** State of charge reached */
  endSoc: number;
  /** Average delivered power over the session, kW */
  avgKw: number;
  /** True when the station is the limit, not the car */
  stationLimited: boolean;
  /** True when the car's own ceiling is below the station's */
  vehicleLimited: boolean;
};

/**
 * Simulate a session.
 * @param stationKw the station's ceiling (e.g. 180)
 * @param startSoc  state of charge on arrival, 0-100
 * @param minutes   how long they stay
 */
export function simulateSession(
  model: EvModel,
  stationKw: number,
  startSoc: number,
  minutes: number,
  temperature: TemperatureId = "mild"
): SessionResult {
  const tempFactor = TEMPERATURE_FACTORS[temperature].factor;
  const stepSeconds = 10;
  const steps = Math.round((minutes * 60) / stepSeconds);

  let soc = startSoc;
  let kwhDelivered = 0;
  let powerSum = 0;
  let stationLimitedSteps = 0;

  for (let i = 0; i < steps && soc < 100; i++) {
    const vehicleKw = powerAtSoc(model, soc) * tempFactor;
    const deliveredKw = Math.min(vehicleKw, stationKw);
    if (stationKw < vehicleKw) stationLimitedSteps++;

    const kwh = (deliveredKw * stepSeconds) / 3600;
    kwhDelivered += kwh;
    powerSum += deliveredKw;
    soc += (kwh * DELIVERY_EFFICIENCY * 100) / model.usableKwh;
  }

  const usableKwh = kwhDelivered * DELIVERY_EFFICIENCY;
  const miles = usableKwh * efficiencyMiPerKwh(model);
  const avgKw = steps > 0 ? powerSum / steps : 0;

  // ±12% band: efficiency swings with speed, terrain, climate use and how
  // full the pack already is. Rounded to 5s so it doesn't read as precise.
  const round5 = (n: number) => Math.max(0, Math.round(n / 5) * 5);

  return {
    milesLow: round5(miles * 0.88),
    milesHigh: round5(miles * 1.12),
    endSoc: Math.min(100, Math.round(soc)),
    avgKw: Math.round(avgKw),
    stationLimited: stationLimitedSteps > steps * 0.3,
    vehicleLimited: model.peakKw < stationKw,
  };
}

/** Minutes to get from one state of charge to another. */
export function minutesBetweenSoc(
  model: EvModel,
  stationKw: number,
  fromSoc: number,
  toSoc: number,
  temperature: TemperatureId = "mild"
): number {
  const tempFactor = TEMPERATURE_FACTORS[temperature].factor;
  const stepSeconds = 10;
  let soc = fromSoc;
  let seconds = 0;
  const cap = 4 * 60 * 60; // don't spin forever on a very slow car

  while (soc < toSoc && seconds < cap) {
    const deliveredKw = Math.min(powerAtSoc(model, soc) * tempFactor, stationKw);
    if (deliveredKw <= 0.5) break;
    const kwh = (deliveredKw * stepSeconds) / 3600;
    soc += (kwh * DELIVERY_EFFICIENCY * 100) / model.usableKwh;
    seconds += stepSeconds;
  }
  return Math.round(seconds / 60);
}

/** The disclosure that must sit beside any figure these functions produce. */
export const ESTIMATE_BASIS =
  "Estimates model your car's published charging curve against our charger's output, assuming a preconditioned battery and a stall you're not sharing. Real results vary with temperature, starting charge, battery age and driving conditions.";

/** Our stations' output. Every published figure is modelled against this. */
export const STATION_KW = 180;

/** Reference conditions for published figures: arrive at 20%, mild weather. */
export const REFERENCE_START_SOC = 20;

/** What one model adds in ten minutes under reference conditions. */
export function tenMinuteBand(model: EvModel): [number, number] {
  const r = simulateSession(model, STATION_KW, REFERENCE_START_SOC, 10);
  return [r.milesLow, r.milesHigh];
}

/**
 * A make's ten-minute band, spanning its models. Derived rather than typed,
 * so it can never drift from the per-model data underneath it.
 */
export function makeTenMinuteBand(makeId: string): [number, number] | null {
  const models = modelsForMake(makeId);
  if (models.length === 0) return null;
  const bands = models.map(tenMinuteBand);
  return [
    Math.min(...bands.map((b) => b[0])),
    Math.max(...bands.map((b) => b[1])),
  ];
}

/** Minutes from 10% to 80% for a model at our stations. */
export function tenToEighty(model: EvModel): number {
  return minutesBetweenSoc(model, STATION_KW, 10, 80);
}


/**
 * Compact model list for the homepage configurator — one representative per
 * make so the control stays scannable, each carrying its real ten-minute band
 * rather than a hand-typed per-make average.
 */
export function configuratorModels() {
  const pick = [
    "tesla-model-y-lr",
    "hyundai-ioniq-5",
    "ford-mach-e-er",
    "chevy-equinox-ev",
    "rivian-r1t-large",
    "bmw-i4-edrive40",
    "porsche-taycan",
    "honda-prologue",
  ];
  return pick.flatMap((id) => {
    const model = getModel(id);
    if (!model) return [];
    const [lo, hi] = tenMinuteBand(model);
    return [{ id: model.id, name: model.short, lo, hi, model }];
  });
}
