"use client";

import { useState } from "react";
import { Snowflake, Sun, ThermometerSun } from "lucide-react";
import { ModelPicker } from "@/components/model-picker";
import { getModel, type EvModel } from "@/lib/ev-models";
import {
  simulateSession,
  minutesBetweenSoc,
  chargeTempFactor,
  rangeTempFactor,
  STATION_KW,
  REFERENCE_START_SOC,
  TEMP_BASIS,
} from "@/lib/charging-math";

const PRESETS = [
  { degF: 25, label: "Sierra morning", icon: Snowflake },
  { degF: 45, label: "Winter dawn", icon: Snowflake },
  { degF: 72, label: "LA spring", icon: Sun },
  { degF: 105, label: "Inland summer", icon: ThermometerSun },
];

/**
 * The cold penalty, made concrete.
 *
 * Two effects compound and are constantly conflated: a cold battery accepts
 * power more slowly, and a cold car spends more energy per mile. Showing them
 * as separate rows is the whole point — one is why the stop takes longer, the
 * other is why the range you gained doesn't go as far.
 */
export function WeatherImpact() {
  const [modelId, setModelId] = useState("tesla-model-y-lr");
  const [degF, setDegF] = useState(72);
  const model = getModel(modelId) as EvModel;

  const chargeF = chargeTempFactor(degF);
  const rangeF = rangeTempFactor(degF);

  // The 70°F baseline, then scaled by both penalties at the chosen temperature.
  const mild = simulateSession(model, STATION_KW, REFERENCE_START_SOC, 10, "mild");
  const lo = Math.round(mild.milesLow * chargeF * rangeF);
  const hi = Math.round(mild.milesHigh * chargeF * rangeF);

  const mildFull = minutesBetweenSoc(model, STATION_KW, 10, 80, "mild");
  const fullNow = Math.round(mildFull / chargeF);

  const cold = degF < 55;

  return (
    <div className="breakout not-prose my-8 rounded-lg border border-paper-300 bg-white p-5 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="weather-model" value={modelId} onChange={setModelId} />
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="weather-temp" className="text-caption text-ink-500">
                Outside temperature
              </label>
              <span className="text-h4 text-ink-900 tabular-nums">{degF}°F</span>
            </div>
            <input
              id="weather-temp"
              type="range"
              min={10}
              max={110}
              step={1}
              value={degF}
              onChange={(e) => setDegF(Number(e.target.value))}
              className="range-brand mt-2 w-full"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {PRESETS.map((p) => (
                <button
                  key={p.degF}
                  onClick={() => setDegF(p.degF)}
                  aria-pressed={degF === p.degF}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-footnote transition-colors ${
                    degF === p.degF
                      ? "border-brand bg-brand text-ink-900"
                      : "border-paper-300 text-ink-600 hover:border-ink-300"
                  }`}
                >
                  <p.icon aria-hidden className="h-3 w-3" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p aria-live="polite" className="sr-only">
            {`At ${degF} degrees, a ten minute stop adds about ${lo} to ${hi} miles to a ${model.name}, and 10 to 80 percent takes about ${fullNow} minutes.`}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <dt className="text-caption text-ink-400">10 minutes adds</dt>
              <dd className="text-stat text-ink-900 whitespace-nowrap">
                {lo}–{hi}
                <span className="text-h4 text-ink-500 ml-1">mi</span>
              </dd>
              <dd className="text-footnote text-ink-400 mt-1">
                {mild.milesLow}–{mild.milesHigh} mi at 70°F
              </dd>
            </div>
            <div>
              <dt className="text-caption text-ink-400">10 → 80% takes</dt>
              <dd className="text-stat text-ink-900 whitespace-nowrap">
                {fullNow}
                <span className="text-h4 text-ink-500 ml-1">min</span>
              </dd>
              <dd className="text-footnote text-ink-400 mt-1">{mildFull} min at 70°F</dd>
            </div>
          </dl>

          <ul className="mt-7">
            {[
              {
                k: "Charging speed",
                v: chargeF,
                why: "A cold battery limits how much power it will accept.",
              },
              {
                k: "Miles per kWh",
                v: rangeF,
                why: "Cabin heat, denser air and stiffer tyres all take their cut.",
              },
            ].map((r) => (
              <li key={r.k} className="py-3.5 border-t border-paper-300 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-body-sm text-ink-900">{r.k}</span>
                  <span
                    className={`text-body-sm font-semibold tabular-nums ${
                      r.v < 0.95 ? "text-brand-ink" : "text-ink-500"
                    }`}
                  >
                    {Math.round(r.v * 100)}% of normal
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-paper-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-200"
                    style={{ width: `${r.v * 100}%` }}
                  />
                </div>
                <p className="text-footnote text-ink-400 mt-1.5">{r.why}</p>
              </li>
            ))}
          </ul>

          {cold && (
            <p className="mt-5 rounded-lg bg-paper-100 border border-paper-300 p-4 text-body-sm text-ink-700">
              Precondition before you arrive. Setting our station as your
              navigation destination tells most cars to warm the pack on the way
              in, and a warm pack recovers most of that first row — the single
              biggest thing you control.
            </p>
          )}
        </div>
      </div>

      <p className="mt-5 text-footnote text-ink-400">{TEMP_BASIS}</p>
    </div>
  );
}
