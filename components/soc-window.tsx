"use client";

import { useState } from "react";
import { getModel, type EvModel } from "@/lib/ev-models";
import { minutesBetweenSoc, STATION_KW } from "@/lib/charging-math";
import { ModelPicker } from "@/components/model-picker";
import { GuideFigure } from "@/components/guide-figure";

/**
 * The daily driving window, drawn against the full pack.
 *
 * Battery-health advice is usually a list of rules people half-remember. The
 * single most useful fact is geometric: the band you should live in most days
 * is the middle, and it is also the band that charges fastest — so the
 * healthy habit and the quick habit are the same habit. That is much easier
 * to show than to argue.
 */
export function SocWindow() {
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [lo, setLo] = useState(20);
  const [hi, setHi] = useState(80);
  const model = getModel(modelId) as EvModel;

  const mins = minutesBetweenSoc(model, STATION_KW, lo, Math.max(lo + 5, hi));
  const miles = Math.round((model.epaMiles * (hi - lo)) / 100);
  const strain = hi >= 95 ? "high" : hi >= 90 ? "some" : lo <= 5 ? "some" : "low";

  return (
    <GuideFigure
      eyebrow="Your daily window"
      title="The healthy band and the fast band are the same band"
      footnote={
        <>
          Time is modelled from this car&rsquo;s published charging curve at our
          180 kW output. The degradation guidance is directional: pack chemistry
          and thermal management differ by model, and every manufacturer
          warranties its battery for at least eight years.
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="soc-model" value={modelId} onChange={setModelId} />
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="soc-lo" className="text-caption text-ink-500">Charge from</label>
              <span className="text-body-sm font-semibold text-ink-900">{lo}%</span>
            </div>
            <input
              id="soc-lo" type="range" min={0} max={60} step={5} value={lo}
              onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 5))}
              className="range-brand mt-2 w-full"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="soc-hi" className="text-caption text-ink-500">Charge to</label>
              <span className="text-body-sm font-semibold text-ink-900">{hi}%</span>
            </div>
            <input
              id="soc-hi" type="range" min={40} max={100} step={5} value={hi}
              onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 5))}
              className="range-brand mt-2 w-full"
            />
          </div>
        </div>

        <div>
          {/* the pack, with your window marked on it */}
          <div className="relative h-16 rounded-lg bg-paper-200 overflow-hidden">
            <div
              className="absolute inset-y-0 bg-brand/25 border-x-2 border-brand transition-all duration-200"
              style={{ left: `${lo}%`, width: `${hi - lo}%` }}
            />
            {[0, 20, 40, 60, 80, 100].map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute inset-y-0 w-px bg-paper-400"
                style={{ left: `${t}%` }}
              />
            ))}
            <span className="absolute inset-y-0 left-0 w-[10%] bg-ink-900/10" />
            <span className="absolute inset-y-0 right-0 w-[10%] bg-ink-900/10" />
          </div>
          <div className="flex justify-between mt-1.5 text-caption text-ink-400">
            {[0, 20, 40, 60, 80, 100].map((t) => <span key={t}>{t}%</span>)}
          </div>

          <dl className="grid grid-cols-3 gap-x-5 gap-y-4 mt-7">
            <div>
              <dt className="text-caption text-ink-500">Usable range</dt>
              <dd className="text-h3 text-ink-900 mt-1 tabular-nums">{miles} mi</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-500">Time to fill it</dt>
              <dd className="text-h3 text-ink-900 mt-1 tabular-nums">{mins} min</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-500">Long-term strain</dt>
              <dd className={`text-h3 mt-1 capitalize ${strain === "low" ? "text-ok-ink" : strain === "some" ? "text-note-ink" : "text-error-ink"}`}>
                {strain}
              </dd>
            </div>
          </dl>

          <p className="text-body-sm text-ink-600 mt-6 max-w-measure">
            {hi >= 95 ? (
              <>
                Charging to 100% every day is the one habit worth changing. The
                last few percent are where a lithium-ion cell spends the most
                time at its highest voltage, and they are also the slowest
                minutes you will ever buy at a fast charger. Save it for the
                morning of a long drive.
              </>
            ) : lo <= 5 ? (
              <>
                Running to near-empty routinely is the other end of the same
                problem, and it leaves you no margin if a charger is occupied.
              </>
            ) : (
              <>
                This is the band most manufacturers point at for daily use, and
                it is the fast part of the curve — which is why a 20&ndash;80%
                stop takes {mins} minutes while the last 20% alone can take
                nearly as long.
              </>
            )}
          </p>
        </div>
      </div>
    </GuideFigure>
  );
}
