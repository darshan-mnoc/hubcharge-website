import {
  type EvModel,
  efficiencyMiPerKwh,
  evModels,
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

/**
 * A temperature, either as one of the three named buckets or as the actual
 * fraction of normal power the pack will take.
 *
 * WHY BOTH
 * The three buckets are right for a cover or a comparison table: they are the
 * whole vocabulary those surfaces have. They are wrong for a figure with a
 * temperature slider on it, and weather-impact.tsx showed exactly how wrong.
 * It ran the simulator at the discrete "mild" bucket and then multiplied the
 * ANSWER by the continuous chargeTempFactor curve — two temperature models
 * stacked on each other, one of which had already been applied inside the
 * integration. A pack at 45°F does not charge at (mild rate) x (45°F factor);
 * it charges at the 45°F rate, and the only way to get that is to integrate
 * with it.
 *
 * Passing a number here puts the reader's own temperature inside the loop.
 */
export type Temperature = TemperatureId | number;

/** The multiplier a Temperature stands for. */
export function temperatureFactor(t: Temperature): number {
  return typeof t === "number" ? t : TEMPERATURE_FACTORS[t].factor;
}

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
  /**
   * Mean delivered power across the time actually spent charging, kW.
   *
   * A session average including the taper, NOT a peak — a car that opens at
   * 235kW and ends at 85kW averages neither figure, and labelling this as
   * anything but an average invites a reader to expect the plateau for the
   * whole stop.
   */
  avgKw: number;
  /** Energy metered at the plug, kWh — what a per-kWh network would bill. */
  kwhMetered: number;
  /**
   * Energy that reaches the battery, kWh.
   *
   * This is the one a driver means by "how much did I get": it is what moved
   * the state of charge, and it is the figure the range band is derived from.
   * Lower than `kwhMetered` by the conversion and thermal losses.
   */
  kwhToBattery: number;
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
  temperature: Temperature = "mild"
): SessionResult {
  const tempFactor = temperatureFactor(temperature);
  const stepSeconds = 10;
  const steps = Math.round((minutes * 60) / stepSeconds);

  let soc = startSoc;
  let kwhDelivered = 0;
  let powerSum = 0;
  let stationLimitedSteps = 0;
  /* Counted separately from `steps`, because the loop stops early once the
     pack is full. Averaging over the requested duration instead of the
     charging duration reported a power the car never delivered — too low,
     and the more so the earlier it filled. */
  let stepsRun = 0;

  for (let i = 0; i < steps && soc < 100; i++) {
    const vehicleKw = powerAtSoc(model, soc) * tempFactor;
    const deliveredKw = Math.min(vehicleKw, stationKw);
    if (stationKw < vehicleKw) stationLimitedSteps++;

    const kwh = (deliveredKw * stepSeconds) / 3600;
    kwhDelivered += kwh;
    powerSum += deliveredKw;
    stepsRun++;
    soc += (kwh * DELIVERY_EFFICIENCY * 100) / model.usableKwh;
  }

  /* DELIVERY_EFFICIENCY is applied to the total here and inside the loop to
     the state of charge. That is one loss with two consumers, not a double
     count: the pack receives 90% of what the plug meters, and both the SoC
     and the range band need that same pack-side figure. */
  const usableKwh = kwhDelivered * DELIVERY_EFFICIENCY;
  const miles = usableKwh * efficiencyMiPerKwh(model);
  const avgKw = stepsRun > 0 ? powerSum / stepsRun : 0;

  // ±12% band: efficiency swings with speed, terrain, climate use and how
  // full the pack already is. Rounded to 5s so it doesn't read as precise.
  const round5 = (n: number) => Math.max(0, Math.round(n / 5) * 5);

  return {
    milesLow: round5(miles * 0.88),
    milesHigh: round5(miles * 1.12),
    endSoc: Math.min(100, Math.round(soc)),
    avgKw: Math.round(avgKw),
    /* One decimal. A tenth of a kWh is inside the noise of this model, but
       whole kilowatt-hours on a ten-minute stop round 4.4 and 5.4 to the
       same answer, which reads as a stuck number as the slider moves. */
    kwhMetered: Math.round(kwhDelivered * 10) / 10,
    kwhToBattery: Math.round(usableKwh * 10) / 10,
    stationLimited: stationLimitedSteps > steps * 0.3,
    vehicleLimited: model.peakKw < stationKw,
  };
}

/**
 * Minutes to get from one state of charge to another.
 *
 * Memoised, because this is a ten-second-step Euler integration — up to 1,440
 * iterations, each one a linear scan of the model's curve — and eight
 * components call it, several of them from inside a render that re-runs on
 * every frame of a dragged slider. The curve chart recomputed its 10-to-80
 * figure on every pointer pixel, and that figure depends only on the model.
 *
 * The result is a pure function of these five arguments, so the cache can
 * never go stale: thirty-one models against a handful of ranges is a few
 * hundred entries at most.
 */
const timingCache = new Map<string, number>();

export function minutesBetweenSoc(
  model: EvModel,
  stationKw: number,
  fromSoc: number,
  toSoc: number,
  temperature: Temperature = "mild"
): number {
  /* A continuous factor is quantised into the key so a slider dragged across
     a hundred values cannot mint a hundred cache entries per model. Three
     decimal places is finer than the curve's own resolution. */
  const tempKey =
    typeof temperature === "number" ? temperature.toFixed(3) : temperature;
  const key = `${model.id}|${stationKw}|${fromSoc}|${toSoc}|${tempKey}`;
  const hit = timingCache.get(key);
  if (hit !== undefined) return hit;
  const result = computeMinutesBetweenSoc(model, stationKw, fromSoc, toSoc, temperature);
  timingCache.set(key, result);
  return result;
}

function computeMinutesBetweenSoc(
  model: EvModel,
  stationKw: number,
  fromSoc: number,
  toSoc: number,
  temperature: Temperature
): number {
  const tempFactor = temperatureFactor(temperature);
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

/**
 * The disclosure for the energy and average-power figures specifically.
 *
 * Separate from ESTIMATE_BASIS because it qualifies different numbers: the
 * energy figure is what reaches the battery rather than what the meter reads,
 * and the power figure is a session mean rather than the peak a spec sheet
 * quotes. Both are routinely misread as the other.
 */
export const POWER_BASIS =
  "Average power is the mean across your whole stop, including the taper as the battery fills — not a peak figure. Energy shown is what reaches the battery; a little more than that passes through the meter, as conversion and thermal losses.";

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

/**
 * The span across every model we hold data for, for a session of N minutes.
 *
 * The homepage configurator offers eight cars out of the thirty-one in
 * lib/ev-models.ts, so a driver of an ID.4, an EV6, a Model 3 or an F-150
 * Lightning finds nothing of theirs and the block stops answering them. This
 * is what it shows before they narrow it down: the honest outer edges of what
 * a stop of that length adds, across everything we have curves for.
 *
 * Derived rather than typed, like makeTenMinuteBand above it, so it can never
 * disagree with the per-car figures quoted elsewhere on the site.
 */
export function fleetBand(minutes: number): {
  low: number;
  high: number;
  count: number;
} {
  const results = evModels.map((m) =>
    simulateSession(m, STATION_KW, REFERENCE_START_SOC, minutes)
  );
  return {
    low: Math.min(...results.map((r) => r.milesLow)),
    high: Math.max(...results.map((r) => r.milesHigh)),
    count: evModels.length,
  };
}

/**
 * The ten-minute range band as it appears in copy.
 *
 * Nine places across the site quoted "50-135" as a literal. Neither reading
 * of the data supports it: across every model here it is 30-135, and even
 * setting aside the discontinued 2017-2023 Bolt it is 45-135. The floor was
 * overstated by between five and twenty miles, which for an older Bolt owner
 * is a figure two-thirds above what they will actually see.
 *
 * Exported formatted so the prose and the configurator cannot drift apart.
 */
export const TEN_MINUTE_RANGE = (() => {
  const f = fleetBand(10);
  return `${f.low}\u2013${f.high}`;
})();

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

/* ------------------------------------------------------------------ *
 * Temperature
 *
 * Two separate penalties, routinely confused. A cold battery accepts
 * power more slowly (chemistry), and a cold car uses more energy per
 * mile (cabin heat, denser air, stiffer tyres). They compound, so a
 * winter stop adds far less range than the same stop in June.
 *
 * Anchors follow Recurrent Auto's 2024 fleet study (~10,000 vehicles)
 * and AAA's cold-weather testing; interpolated linearly between them.
 * ------------------------------------------------------------------ */

const CHARGE_TEMP_CURVE: [degF: number, factor: number][] = [
  [0, 0.42], [20, 0.52], [32, 0.58], [40, 0.62], [50, 0.78],
  [60, 0.92], [70, 1.0], [80, 0.97], [95, 0.88], [110, 0.78],
];

const RANGE_TEMP_CURVE: [degF: number, factor: number][] = [
  [0, 0.54], [20, 0.64], [32, 0.72], [40, 0.79], [50, 0.88],
  [60, 0.95], [70, 1.0], [80, 0.99], [90, 0.97], [100, 0.93], [110, 0.88],
];

function interpolate(curve: [number, number][], x: number): number {
  if (x <= curve[0][0]) return curve[0][1];
  const last = curve[curve.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < curve.length - 1; i++) {
    const [x0, y0] = curve[i];
    const [x1, y1] = curve[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return 1;
}

/** How much of its normal charging power a battery accepts at this temperature. */
export function chargeTempFactor(degF: number): number {
  return interpolate(CHARGE_TEMP_CURVE, degF);
}

/** How much of its rated driving range the car delivers at this temperature. */
export function rangeTempFactor(degF: number): number {
  return interpolate(RANGE_TEMP_CURVE, degF);
}

export const TEMP_BASIS =
  "Temperature effects follow Recurrent Auto's 2024 study of roughly 10,000 vehicles and AAA cold-weather testing, interpolated between measured anchor points. Your car, your heat-pump, and whether you preconditioned will move the figure.";

/* ------------------------------------------------------------------ *
 * AC charging
 *
 * Level 1 and Level 2 run at near-constant power, so no curve is
 * needed — but the ceiling is the lower of the outlet and the car's
 * own onboard charger, which is the part people miss when they buy an
 * 11 kW wallbox for a 7.2 kW car.
 * ------------------------------------------------------------------ */

export const AC_EFFICIENCY = 0.88;
export const L1_KW = 1.4;

/** Hours to move between two states of charge on AC at the given supply. */
export function acHours(
  model: EvModel,
  supplyKw: number,
  fromSoc: number,
  toSoc: number
): number {
  const kw = Math.min(supplyKw, model.acKw);
  const kwh = (model.usableKwh * (toSoc - fromSoc)) / 100;
  return kwh / (kw * AC_EFFICIENCY);
}
