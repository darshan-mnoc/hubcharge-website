"use client";

import { useState } from "react";
import { Home, Building2, Zap } from "lucide-react";
import { ModelPicker } from "@/components/model-picker";
import { getModel, type EvModel } from "@/lib/ev-models";
import { acHours, minutesBetweenSoc, L1_KW, STATION_KW } from "@/lib/charging-math";

const L2_SUPPLIES = [
  { kw: 7.2, label: "7.2 kW", note: "30A circuit" },
  { kw: 9.6, label: "9.6 kW", note: "40A circuit" },
  { kw: 11.5, label: "11.5 kW", note: "48A circuit" },
  { kw: 19.2, label: "19.2 kW", note: "80A circuit" },
] as const;

function readable(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m >= 5 ? `${h} hr ${m} min` : `${h} hr`;
  }
  return `${(hours / 24).toFixed(1)} days`;
}

/**
 * The three levels, priced in the only currency that matters: your time.
 *
 * The Level 2 control is a supply picker rather than a fixed number because
 * the common mistake is buying a wallbox the car can't use — selecting
 * 19.2 kW on a Leaf shows it pinned at 7.2, which is the lesson.
 */
export function ChargingLevelsCompare() {
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [supplyKw, setSupplyKw] = useState<number>(11.5);
  const model = getModel(modelId) as EvModel;

  const l1 = acHours(model, L1_KW, 10, 80);
  const l2 = acHours(model, supplyKw, 10, 80);
  const dc = minutesBetweenSoc(model, STATION_KW, 10, 80) / 60;
  const throttled = supplyKw > model.acKw;

  const rows = [
    {
      icon: Home,
      name: "Level 1",
      supply: "120V wall outlet · 1.4 kW",
      hours: l1,
      body: "A regular household socket. Fine for a plug-in hybrid or a few miles a day.",
    },
    {
      icon: Building2,
      name: "Level 2",
      supply: throttled
        ? `${supplyKw} kW supply, throttled to ${model.acKw} kW by the car`
        : `240V · ${Math.min(supplyKw, model.acKw)} kW`,
      hours: l2,
      body: "Home wallboxes and workplaces. The overnight workhorse.",
    },
    {
      icon: Zap,
      name: "DC fast",
      supply: `Straight to the battery · up to ${STATION_KW} kW here`,
      hours: dc,
      body: "Skips the onboard charger entirely. This is what HubCharge does.",
      highlight: true,
    },
  ];

  const longest = Math.max(l1, l2, dc);

  return (
    <div className="breakout not-prose my-8 rounded-lg border border-paper-300 bg-white p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-end mb-7">
        <ModelPicker id="levels-model" value={modelId} onChange={setModelId} />
        <div>
          <p className="text-caption text-ink-500 mb-1.5">Your Level 2 supply</p>
          <div role="radiogroup" aria-label="Level 2 supply" className="flex flex-wrap gap-2">
            {L2_SUPPLIES.map((s) => {
              const active = s.kw === supplyKw;
              return (
                <button
                  key={s.kw}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSupplyKw(s.kw)}
                  className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                    active
                      ? "border-brand bg-brand text-ink-900"
                      : "border-paper-300 text-ink-600 hover:border-ink-300"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {`For a ${model.name}, 10 to 80 percent takes ${readable(l1)} on Level 1, ${readable(l2)} on Level 2, and ${readable(dc)} on DC fast charging.`}
      </p>

      <ul>
        {rows.map((r) => (
          <li
            key={r.name}
            className="grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_minmax(0,12rem)_1fr] gap-x-4 items-baseline py-5 border-t border-paper-300 last:border-b"
          >
            <r.icon
              aria-hidden
              className={`h-5 w-5 self-start mt-0.5 ${r.highlight ? "text-brand" : "text-ink-400"}`}
            />
            <div>
              <p className="text-h4 text-ink-900">{r.name}</p>
              <p className="text-caption text-ink-400 mt-0.5">{r.supply}</p>
            </div>
            <div className="col-span-2 sm:col-span-1 mt-3 sm:mt-0">
              <div className="flex items-baseline justify-between gap-4">
                <span className={`text-h3 ${r.highlight ? "text-brand-ink" : "text-ink-900"}`}>
                  {readable(r.hours)}
                </span>
                <span className="text-caption text-ink-400">10 → 80%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-paper-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${r.highlight ? "bg-brand" : "bg-ink-300"}`}
                  style={{ width: `${Math.max(1.5, (r.hours / longest) * 100)}%` }}
                />
              </div>
              <p className="text-body-sm text-ink-500 mt-2.5">{r.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] text-ink-400">
        AC figures assume steady power and about 12% conversion loss in the
        car&rsquo;s onboard charger; the {model.short} caps at {model.acKw} kW on
        AC no matter how big the wallbox. The DC figure models this car&rsquo;s
        published charging curve against our {STATION_KW} kW output.
      </p>
    </div>
  );
}
