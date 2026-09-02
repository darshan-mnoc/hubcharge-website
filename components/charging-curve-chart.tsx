"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { evModels, getModel, type EvModel } from "@/lib/ev-models";
import {
  powerAtSoc,
  STATION_KW,
  minutesBetweenSoc,
  ESTIMATE_BASIS,
} from "@/lib/charging-math";

const PAD = { t: 18, r: 16, b: 34, l: 44 };

/**
 * The viewBox tracks the rendered width so one CSS pixel is one user unit.
 * A fixed 720-wide box scaled into a 350px phone renders 11px axis labels at
 * five — legible in the design file, useless on the device.
 */
function useChartSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(720);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setW(Math.max(300, Math.round(entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const h = Math.round(Math.min(300, Math.max(230, w * 0.42)));
  return { ref, w, h };
}

/**
 * Charging curve, drawn.
 *
 * The prose explains that power tapers; seeing it fall off a cliff past 60%
 * teaches it in a second. The dashed line is our charger's output, so it's
 * immediately visible whether the car or the station is the limit — which is
 * the single most misunderstood thing about DC fast charging.
 */
export function ChargingCurveChart({
  defaultModelId = "hyundai-ioniq-5",
}: {
  defaultModelId?: string;
}) {
  const [modelId, setModelId] = useState(defaultModelId);
  const [hoverSoc, setHoverSoc] = useState<number | null>(null);
  const model = getModel(modelId) as EvModel;
  const { ref, w: W, h: H } = useChartSize();
  const PLOT_W = W - PAD.l - PAD.r;
  const PLOT_H = H - PAD.t - PAD.b;

  const maxKw = Math.max(STATION_KW, model.peakKw) * 1.1;
  const x = (soc: number) => PAD.l + (soc / 100) * PLOT_W;
  const y = (kw: number) => PAD.t + PLOT_H - (kw / maxKw) * PLOT_H;

  const { carPath, deliveredPath } = useMemo(() => {
    const pts: string[] = [];
    const del: string[] = [];
    for (let soc = 0; soc <= 100; soc += 1) {
      const kw = powerAtSoc(model, soc);
      pts.push(`${x(soc).toFixed(1)},${y(kw).toFixed(1)}`);
      del.push(`${x(soc).toFixed(1)},${y(Math.min(kw, STATION_KW)).toFixed(1)}`);
    }
    return {
      carPath: `M${pts.join(" L")}`,
      deliveredPath: `M${del.join(" L")} L${x(100)},${y(0)} L${x(0)},${y(0)} Z`,
    };
  }, [model, W, H]); // eslint-disable-line react-hooks/exhaustive-deps

  const readoutSoc = hoverSoc ?? 20;
  const carKw = Math.round(powerAtSoc(model, readoutSoc));
  const delivered = Math.round(Math.min(carKw, STATION_KW));
  const capped = carKw > STATION_KW;
  const tenEighty = minutesBetweenSoc(model, STATION_KW, 10, 80);

  const grouped = useMemo(() => {
    const by = new Map<string, EvModel[]>();
    evModels.forEach((m) => by.set(m.makeId, [...(by.get(m.makeId) ?? []), m]));
    return [...by.entries()];
  }, []);

  return (
    <figure className="breakout not-prose my-8 rounded-lg border border-paper-300 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <label htmlFor="curve-model" className="block text-caption text-ink-500 mb-1.5">
            Charging curve
          </label>
          <div className="relative">
            <select
              id="curve-model"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="field appearance-none w-auto pl-3 pr-9 py-2 text-body-sm"
            >
              {grouped.map(([makeId, models]) => (
                <optgroup key={makeId} label={models[0].name.split(" ")[0]}>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          </div>
        </div>

        <dl className="flex gap-5 text-right">
          <div>
            <dt className="text-caption text-ink-400">At {readoutSoc}%</dt>
            <dd className="text-h3 text-ink-900">{delivered} kW</dd>
          </div>
          <div>
            <dt className="text-caption text-ink-400">10–80%</dt>
            <dd className="text-h3 text-ink-900">{tenEighty} min</dd>
          </div>
        </dl>
      </div>

      <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Charging curve for the ${model.name}: power falls from about ${Math.round(powerAtSoc(model, 20))} kilowatts at 20 percent charge to about ${Math.round(powerAtSoc(model, 80))} at 80 percent. Our chargers deliver up to ${STATION_KW} kilowatts.`}
        onMouseLeave={() => setHoverSoc(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const soc = Math.round(((px - PAD.l) / PLOT_W) * 100);
          setHoverSoc(Math.max(0, Math.min(100, soc)));
        }}
      >
        {/* grid */}
        {(W < 460 ? [0, 90, 180, 270] : [0, 45, 90, 135, 180, 225, 270]).filter((k) => k <= maxKw).map((kw) => (
          <g key={kw}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(kw)} y2={y(kw)} stroke="#E4E0D8" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(kw) + 4} textAnchor="end" fontSize="11" fill="#7B8CA3">{kw}</text>
          </g>
        ))}
        {(W < 460 ? [0, 20, 50, 80, 100] : [0, 20, 40, 60, 80, 100]).map((soc) => (
          <text key={soc} x={x(soc)} y={H - 12} textAnchor="middle" fontSize="11" fill="#7B8CA3">{soc}%</text>
        ))}

        {/* what we actually deliver */}
        <path d={deliveredPath} fill="#FF7A00" fillOpacity="0.12" />

        {/* our ceiling */}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(STATION_KW)} y2={y(STATION_KW)} stroke="#B34D00" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={W - PAD.r} y={y(STATION_KW) - 7} textAnchor="end" fontSize="11" fill="#B34D00" fontWeight="600">
          {W < 460 ? `up to ${STATION_KW} kW` : `Our chargers · up to ${STATION_KW} kW`}
        </text>

        {/* the car */}
        <path d={carPath} fill="none" stroke="#0A192F" strokeWidth="2.5" strokeLinejoin="round" />

        {/* readout */}
        <g>
          <line x1={x(readoutSoc)} x2={x(readoutSoc)} y1={PAD.t} y2={PAD.t + PLOT_H} stroke="#48607F" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(readoutSoc)} cy={y(Math.min(carKw, STATION_KW))} r="5" fill="#FF7A00" stroke="#fff" strokeWidth="2" />
        </g>
      </svg>
      </div>

      <figcaption className="mt-4 text-body-sm text-ink-500">
        {capped ? (
          <>
            At {readoutSoc}% the {model.short} could take {carKw} kW, so our
            chargers are the limit here — it draws the full {STATION_KW} kW.
          </>
        ) : (
          <>
            At {readoutSoc}% the {model.short} accepts {carKw} kW, which is
            below our {STATION_KW} kW output — the car sets the pace, not the
            charger.
          </>
        )}{" "}
        The shaded area is what actually reaches the battery. Notice how it
        collapses past 60% — that is why a short top-up beats charging to full.
      </figcaption>
      <p className="mt-2 text-footnote text-ink-400">{ESTIMATE_BASIS}</p>
    </figure>
  );
}
