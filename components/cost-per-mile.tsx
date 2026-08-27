"use client";

import { useState } from "react";
import { Fuel, Home, Zap, Info } from "lucide-react";
import Link from "next/link";
import { ModelPicker } from "@/components/model-picker";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";

/* Wall-to-battery losses. DC bypasses the onboard charger and loses less. */
const DC_LOSS = 0.93;
const AC_LOSS = 0.88;

function Slider({
  id, label, value, onChange, min, max, step, format, hint,
}: {
  id: string; label: string; value: number;
  onChange: (n: number) => void;
  min: number; max: number; step: number;
  format: (n: number) => string; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-caption text-ink-500">{label}</label>
        <span className="text-body-sm font-semibold text-ink-900 tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-brand mt-2 w-full"
      />
      {hint && <p className="text-footnote text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}

/**
 * Cost per mile — theirs, not ours.
 *
 * We publish no rate here on purpose: our price is flat per session and shown
 * before you plug in, so a cents-per-mile figure for HubCharge would be a
 * number we'd have to qualify into meaninglessness. What this does show is the
 * arithmetic every other model asks you to do in your head at the pump.
 *
 * The rates are sliders, not assertions. We don't set them, they move
 * constantly, and a driver knows their own better than we do.
 */
export function CostPerMile() {
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [dcRate, setDcRate] = useState(0.48);
  const [homeRate, setHomeRate] = useState(0.32);
  const [gasPrice, setGasPrice] = useState(4.7);
  const [mpg, setMpg] = useState(30);

  const model = getModel(modelId) as EvModel;
  const miPerKwh = efficiencyMiPerKwh(model);

  const rows = [
    {
      icon: Zap,
      name: "Public DC fast, billed per kWh",
      cost: dcRate / (miPerKwh * DC_LOSS),
      note: "The common highway-network model.",
    },
    {
      icon: Home,
      name: "Charging at home overnight",
      cost: homeRate / (miPerKwh * AC_LOSS),
      note: "Cheapest, if you have a driveway and time.",
    },
    {
      icon: Fuel,
      name: `Gasoline at ${mpg} mpg`,
      cost: gasPrice / mpg,
      note: "A comparable combustion car.",
    },
  ];
  const worst = Math.max(...rows.map((r) => r.cost));

  return (
    <div className="breakout not-prose my-8 rounded-lg border border-paper-300 bg-white p-5 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="cost-model" value={modelId} onChange={setModelId} />
          <p className="text-caption text-ink-400 -mt-2">
            {miPerKwh.toFixed(1)} mi/kWh · EPA
          </p>
          <Slider
            id="cost-dc" label="Public DC rate" value={dcRate}
            onChange={setDcRate} min={0.25} max={0.85} step={0.01}
            format={(n) => `$${n.toFixed(2)}/kWh`}
          />
          <Slider
            id="cost-home" label="Home electricity" value={homeRate}
            onChange={setHomeRate} min={0.1} max={0.6} step={0.01}
            format={(n) => `$${n.toFixed(2)}/kWh`}
          />
          <Slider
            id="cost-gas" label="Gasoline" value={gasPrice}
            onChange={setGasPrice} min={2.5} max={7} step={0.05}
            format={(n) => `$${n.toFixed(2)}/gal`}
          />
          <Slider
            id="cost-mpg" label="Comparison car" value={mpg}
            onChange={setMpg} min={15} max={55} step={1}
            format={(n) => `${n} mpg`}
          />
        </div>

        <div>
          <p className="text-overline text-ink-500">Cost per mile</p>
          <span aria-hidden className="mt-3 mb-5 block h-px w-8 bg-brass" />
          <p aria-live="polite" className="sr-only">
            {rows.map((r) => `${r.name}: ${(r.cost * 100).toFixed(1)} cents per mile.`).join(" ")}
          </p>
          <ul>
            {rows.map((r) => (
              <li key={r.name} className="py-4 border-t border-paper-300 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-2.5 text-body-sm text-ink-900 min-w-0">
                    <r.icon aria-hidden className="h-4 w-4 shrink-0 self-center text-ink-400" />
                    <span className="truncate">{r.name}</span>
                  </span>
                  <span className="text-h4 text-ink-900 tabular-nums whitespace-nowrap">
                    {(r.cost * 100).toFixed(1)}¢
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-paper-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ink-700 transition-[width] duration-300"
                    style={{ width: `${Math.max(2, (r.cost / worst) * 100)}%` }}
                  />
                </div>
                <p className="text-footnote text-ink-400 mt-1.5">{r.note}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg bg-paper-100 border border-paper-300 p-4">
            <p className="flex gap-2 text-body-sm text-ink-700">
              <Info aria-hidden className="h-4 w-4 shrink-0 mt-0.5 text-brand-ink" />
              <span>
                HubCharge isn&rsquo;t on this chart, because we don&rsquo;t bill
                per kWh. You get a flat rate for the session, shown in full
                before you plug in — so the sum above is one you never have to
                do.{" "}
                <Link href="/pricing" className="text-brand-ink underline underline-offset-2">
                  How our pricing works
                </Link>
              </span>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-footnote text-ink-400">
        Efficiency is the EPA combined figure for the selected trim. Charging
        losses are folded in — about 7% on DC, 12% on AC — because you pay for
        what leaves the charger, not what reaches the battery. Rates are yours
        to set; we don&rsquo;t publish other networks&rsquo; prices as fact
        because they change by site and time of day.
      </p>
    </div>
  );
}
