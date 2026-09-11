"use client";

import { GuideFigure, GuideSlider, Readout } from "@/components/guide-figure";
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

/**
 * The two temperature curves, drawn.
 *
 * lib/charging-math.ts has carried both of these since it was written and
 * nothing has ever plotted them. The figure showed their value AT ONE
 * TEMPERATURE as a pair of 6px bars, which tells you today's number and
 * nothing about the shape — and the shape is the entire lesson. Charging
 * speed falls off a cliff below about 50°F and sags again in real heat;
 * range declines steadily and much more gently. Two bars cannot say that.
 * Two lines say it without a word.
 *
 * Sampled from the exported functions rather than the private anchor tables,
 * so the plot cannot drift from the numbers the readouts above it print.
 */
function TempCurves({ degF }: { degF: number }) {
  const W = 660, H = 210;
  const PAD = { l: 34, r: 12, t: 26, b: 30 };
  const LO = 10, HI = 110;
  const px = (f: number) => PAD.l + ((f - LO) / (HI - LO)) * (W - PAD.l - PAD.r);
  const py = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b);

  const line = (fn: (f: number) => number) => {
    const pts: string[] = [];
    for (let f = LO; f <= HI; f += 2) pts.push(`${px(f).toFixed(1)},${py(fn(f)).toFixed(1)}`);
    return `M${pts.join(" L")}`;
  };
  const chargePath = line(chargeTempFactor);
  const rangePath = line(rangeTempFactor);
  const len = (d: string) => {
    const pts = d.slice(1).split(" L").map((q) => q.split(",").map(Number));
    let t = 0;
    for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return Math.ceil(t);
  };

  const here = px(degF);
  const cf = chargeTempFactor(degF);
  const rf = rangeTempFactor(degF);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Charging speed and miles per kWh against outside temperature. At ${degF} degrees Fahrenheit, charging speed is ${Math.round(cf * 100)} percent of normal and range is ${Math.round(rf * 100)} percent.`}
    >
      {[1, 0.75, 0.5].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={py(v)} y2={py(v)}
            stroke={v === 1 ? "#DCE2E9" : "#EDF0F4"} strokeWidth="1"
            strokeDasharray={v === 1 ? undefined : "3 4"} />
          <text x="0" y={py(v) + 4} fill="#647287" fontSize="11">{v * 100}%</text>
        </g>
      ))}
      {[20, 40, 60, 80, 100].map((f) => (
        <text key={f} x={px(f)} y={H - 8} textAnchor="middle" fill="#647287" fontSize="11">
          {f}°F
        </text>
      ))}

      {/* The reader's temperature, as a line through both curves. */}
      <line x1={here} x2={here} y1={PAD.t} y2={H - PAD.b} stroke="#48607F" strokeWidth="1" strokeDasharray="3 3" />

      <path data-draw d={rangePath} fill="none" stroke="#48607F" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ "--len": len(rangePath), "--d": "0.1s" } as React.CSSProperties} />
      <path data-draw d={chargePath} fill="none" stroke="#FF7A00" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ "--len": len(chargePath) } as React.CSSProperties} />

      <circle cx={here} cy={py(rf)} r="4.5" fill="#48607F" stroke="#FBFAF8" strokeWidth="2" />
      <circle cx={here} cy={py(cf)} r="5" fill="#FF7A00" stroke="#FBFAF8" strokeWidth="2" />

      {/* A legend rather than labels on the line ends. Both curves converge
          above 100°F — that is the point of the drawing — so anything written
          beside them there lands on top of the other one. */}
      {[
        { t: "Charging speed", c: "#FF7A00", x: PAD.l + 4 },
        { t: "Miles per kWh", c: "#48607F", x: PAD.l + 132 },
      ].map((g) => (
        <g key={g.t}>
          <rect x={g.x} y={PAD.t - 6} width="14" height="3" rx="1.5" fill={g.c} />
          <text x={g.x + 20} y={PAD.t - 1} fill="#48607F" fontSize="11.5" fontWeight="600">
            {g.t}
          </text>
        </g>
      ))}
    </svg>
  );
}

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

  /* THE TEMPERATURE GOES INSIDE THE INTEGRATION, NOT AFTER IT.
     This ran the simulator at the discrete "mild" bucket and then multiplied
     the answer by the continuous chargeTempFactor curve — so a cold session
     was penalised twice by two different models of the same effect, one of
     them already applied inside the loop. And the time to 80% was
     `mildMinutes / chargeF`, a flat inverse, which assumes the penalty is the
     same at every state of charge when the whole subject of this figure is
     that it is not.

     `simulateSession` and `minutesBetweenSoc` now take the reader's own
     factor, so the curve is integrated at the temperature they picked.
     rangeTempFactor still multiplies, because that one genuinely is a
     separate effect on miles per kWh rather than on the charging curve. */
  const session = simulateSession(model, STATION_KW, REFERENCE_START_SOC, 10, chargeF);
  const lo = Math.round(session.milesLow * rangeF);
  const hi = Math.round(session.milesHigh * rangeF);

  const fullNow = minutesBetweenSoc(model, STATION_KW, 10, 80, chargeF);
  const fullMild = minutesBetweenSoc(model, STATION_KW, 10, 80, "mild");
  const mildSession = simulateSession(model, STATION_KW, REFERENCE_START_SOC, 10, "mild");

  const cold = degF < 55;

  return (
    <GuideFigure>
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="weather-model" value={modelId} onChange={setModelId} />
          <div>
            {/* GuideSlider, not a private raw input. The shell's has a held
                state, pointer events rather than mouse events, and the house
                caption size; this file had reimplemented it without any of
                them. */}
            <GuideSlider
              id="weather-temp"
              label="Outside temperature"
              value={degF}
              onChange={setDegF}
              min={10}
              max={110}
              step={1}
              format={(n) => `${n}°F`}
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
              {PRESETS.map((p) => (
                <button
                  key={p.degF}
                  onClick={() => setDegF(p.degF)}
                  aria-pressed={degF === p.degF}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-footnote hc-tint ${
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
          {/* Readout, not hand-rolled <dd>s. These skipped AnimatedNumber
              entirely, so every number on the one figure with a slider on it
              jumped in hard steps while the reader dragged. The miles band
              keeps its own markup because it is a range, not a value. */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <dt className="text-caption text-ink-400">10 minutes adds</dt>
              <dd className="text-stat text-ink-900 whitespace-nowrap tabular-nums">
                {lo}–{hi}
                <span className="text-h4 text-ink-500 ml-1">mi</span>
              </dd>
              <dd className="text-footnote text-ink-400 mt-1">
                {Math.round(mildSession.milesLow)}–{Math.round(mildSession.milesHigh)} mi at 70°F
              </dd>
            </div>
            <Readout
              label="10 → 80% takes"
              value={fullNow}
              decimals={0}
              unit="min"
              sub={`${fullMild} min at 70°F`}
            />
          </dl>

          <div className="mt-6">
            <TempCurves degF={degF} />
          </div>

          {/* The two 6px tracks that used to live here are the two dots on
              the plot above, which also show where they came from. */}
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
    </GuideFigure>
  );
}
