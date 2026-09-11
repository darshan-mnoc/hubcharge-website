"use client";

import { useState } from "react";
import Link from "next/link";
import { Plug, Zap, Battery, Gauge } from "lucide-react";
import { modelsForMake, efficiencyMiPerKwh } from "@/lib/ev-models";
import { CurveSpark } from "@/components/curve-spark";
import {
  tenMinuteBand,
  tenToEighty,
  STATION_KW,
  REFERENCE_START_SOC,
  ESTIMATE_BASIS,
} from "@/lib/charging-math";

const PORT = { nacs: "NACS", ccs: "CCS", chademo: "CHAdeMO" } as const;

/**
 * Real model cards for a make.
 *
 * A make-level page can only ever say "roughly". These are the actual trims,
 * with the figure that differs between them — a Mach-E Standard Range and an
 * Extended Range are not the same car at a charger, and rounding them together
 * is how range claims stop being true.
 */
export function MakeModels({ makeId }: { makeId: string }) {
  const models = modelsForMake(makeId);
  const [openId, setOpenId] = useState<string | null>(models[0]?.id ?? null);
  if (models.length === 0) return null;

  return (
    <div className="not-prose">
      <ul>
        {models.map((m) => {
          const open = m.id === openId;
          const [lo, hi] = tenMinuteBand(m);
          const full = tenToEighty(m);
          const limited = m.peakKw < STATION_KW;
          return (
            <li key={m.id} className="border-t border-paper-300 last:border-b">
              <h3>
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  aria-expanded={open}
                  aria-controls={`model-${m.id}`}
                  className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,1fr)_10rem_auto] gap-x-5 items-center py-5 text-left group"
                >
                  <span className="min-w-0">
                    <span className="block text-h4 text-ink-900 group-hover:text-brand-ink transition-colors">
                      {m.name}
                    </span>
                    <span className="block text-caption text-ink-400 mt-1">
                      {PORT[m.port]} · {m.archV}V · {m.usableKwh} kWh usable
                    </span>
                  </span>
                  <CurveSpark model={m} className="hidden sm:block w-40 h-11" />
                  <span className="text-right whitespace-nowrap">
                    <span className="block text-body-sm font-semibold text-ink-900">
                      ~{lo}–{hi} mi
                    </span>
                    <span className="block text-caption text-ink-400">in 10 min</span>
                  </span>
                </button>
              </h3>

              {open && (
                <div id={`model-${m.id}`} className="pb-6">
                  <CurveSpark model={m} className="sm:hidden w-full h-14 mb-4" />
                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4">
                    {[
                      { icon: Zap, k: "Peak it will see here", v: `${Math.min(m.peakKw, STATION_KW)} kW` },
                      { icon: Gauge, k: "10 → 80%", v: `${full} min` },
                      { icon: Battery, k: "EPA range", v: `${m.epaMiles} mi` },
                      { icon: Plug, k: "Efficiency", v: `${efficiencyMiPerKwh(m).toFixed(1)} mi/kWh` },
                    ].map((s) => (
                      <div key={s.k}>
                        <dt className="flex items-center gap-1.5 text-caption text-ink-400">
                          <s.icon aria-hidden className="h-3.5 w-3.5" />
                          {s.k}
                        </dt>
                        <dd className="text-h4 text-ink-900 mt-1">{s.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="text-body-sm text-ink-500 mt-5 max-w-measure">
                    {limited ? (
                      <>
                        The {m.short} peaks at {m.peakKw} kW, so it — not our
                        charger — sets the pace. You&rsquo;ll see the same speed
                        here as on a 350 kW unit.
                      </>
                    ) : (
                      <>
                        The {m.short} can accept {m.peakKw} kW, more than our
                        chargers deliver, so it sits flat at {STATION_KW} kW
                        through the early part of the session rather than
                        tapering.
                      </>
                    )}{" "}
                    Figures run from {REFERENCE_START_SOC}% on a preconditioned
                    battery.
                  </p>

                  {m.note && (
                    <p className="text-body-sm text-ink-600 mt-3 border-l-2 border-brass pl-4 max-w-measure">
                      {m.note}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-body-sm text-ink-500 mt-6">
        Want to try your own numbers?{" "}
        <Link href="/plan-your-charge#plan" className="text-brand-ink underline underline-offset-2">
          Plan a stop with your starting battery and the weather
        </Link>
        .
      </p>
      <p className="text-footnote text-ink-400 mt-3">{ESTIMATE_BASIS}</p>
    </div>
  );
}
