"use client";

import { useState } from "react";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";
import { minutesBetweenSoc, STATION_KW, ESTIMATE_BASIS } from "@/lib/charging-math";
import { ModelPicker } from "@/components/model-picker";
import { GuideFigure, GuideSlider, Readout } from "@/components/guide-figure";

/* ── The week ─────────────────────────────────────────────────────────
 *
 * "About 2 stops a week, 25 minutes each" is a sentence you read and forget.
 * The same fact as seven columns with two blocks in them is a shape you can
 * hold, and it answers the question the guide is actually about — how much of
 * my week is this — in the units a week is measured in.
 *
 * The honest part is the fraction. 2.4 stops a week is not two-and-a-bit
 * stops; you never do 40% of a charging session. It is two stops most weeks
 * and three in some. So whole sessions are drawn solid and the remainder is
 * drawn ONCE, dashed, labelled "some weeks" — rather than as a short bar,
 * which would say you do a shorter session, which is not what the model says.
 *
 * Bar height is minutes, on a shared axis, so a big battery's longer stop is
 * visibly longer rather than being renormalised away. */
/* Full names so the seven are distinguishable — two Ts and two Ss otherwise,
   which is a list with no key. Only the initial is drawn. */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeekStrip({
  sessions,
  minsPerSession,
}: {
  sessions: number;
  minsPerSession: number;
}) {
  const whole = Math.floor(sessions);
  const frac = sessions - whole;
  /* Below this a remainder is a rounding artefact rather than a week you
     would notice, and drawing it implies a stop that mostly does not happen. */
  const showSpare = frac > 0.15;
  const count = whole + (showSpare ? 1 : 0);
  /* Under one stop a week the week is the wrong unit to say it in, and
     "some weeks" reads as an empty chart with a ghost in it. The model's own
     number — 0.78 stops a week — is 3 weeks out of every 4, which is both
     exactly what it says and the thing someone without a driveway wants to
     hear. Above one stop a week "some weeks" is right again, because then the
     remainder really is an extra stop rather than the whole of it. */
  const spareLabel =
    whole === 0 ? `${Math.round(sessions * 4)} weeks in 4` : "some weeks";

  /* The axis is in minutes and steps in quarter-hours, so it never lands on a
     number nobody thinks in. It only ever grows to fit — a longer session
     must LOOK longer, and an axis that rescaled per model would flatten
     exactly the difference the model picker exists to show. */
  const axisMax = Math.max(60, Math.ceil(minsPerSession / 15) * 15);
  const COL = 96, TOP = 16, H = 104;
  /* Spread across the week rather than clumped: stop k sits in the middle of
     its own 1/count share of the seven days. Which days is illustrative — the
     count and the length are the model's. */
  const dayOf = (k: number) => Math.min(6, Math.floor(((k + 0.5) * 7) / Math.max(1, count)));

  return (
    <svg
      viewBox="0 0 672 148"
      className="h-auto w-full"
      role="img"
      aria-label={`A week: ${whole}${showSpare ? " to " + (whole + 1) : ""} charging stop${
        whole === 1 && !showSpare ? "" : "s"
      }, about ${minsPerSession} minutes each.`}
    >
      {[axisMax, axisMax / 2].map((m) => (
        <g key={m}>
          <line
            x1="0" x2="672" y1={TOP + H - (m / axisMax) * H} y2={TOP + H - (m / axisMax) * H}
            stroke="#EDF0F4" strokeWidth="1"
          />
          <text x="0" y={TOP + H - (m / axisMax) * H - 4} fill="#647287" fontSize="10">
            {m} min
          </text>
        </g>
      ))}
      <line x1="0" y1={TOP + H} x2="672" y2={TOP + H} stroke="#DCE2E9" strokeWidth="1" />

      {DAYS.map((d, i) => (
        <text key={d} x={i * COL + COL / 2} y={TOP + H + 18} textAnchor="middle" fill="#647287" fontSize="11">
          {d[0]}
        </text>
      ))}

      {/* The ordinal IS the identity here: these are the first, second and
          third stop of a week, they never reorder, and a shorter week drops
          the last one. Same reasoning as the trip planner's legs. */}
      {Array.from({ length: count }, (_, k) => {
        const spare = showSpare && k === count - 1;
        const h = (minsPerSession / axisMax) * H;
        const cx = dayOf(k) * COL + COL / 2;
        return (
          <g key={`stop-${k}`}>
            {/* Full height, scaled by --v. The bar therefore grows on arrival
                AND follows the model picker afterwards, on one curve — see
                [data-bar] in globals.css. */}
            <rect
              data-bar
              x={cx - 22} y={TOP} width="44" height={H} rx="3"
              fill={spare ? "none" : "#FF7A00"}
              stroke={spare ? "#B34D00" : "none"}
              strokeWidth={spare ? 1.5 : 0}
              strokeDasharray={spare ? "4 3" : undefined}
              style={{ "--v": minsPerSession / axisMax, "--d": `${0.12 + k * 0.09}s` } as React.CSSProperties}
            />
            {spare && (
              <text x={cx} y={TOP + H - h - 6} textAnchor="middle" fill="#B34D00" fontSize="10">
                {spareLabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * What running an EV on public charging alone actually costs you in time.
 *
 * The honest question for someone without a driveway isn't "can I?" — it's
 * "how much of my week does this take?". So the output is stops per week and
 * minutes per week, not a reassurance.
 */
export function RoutinePlanner() {
  const [modelId, setModelId] = useState("tesla-model-y-lr");
  const [milesPerWeek, setMiles] = useState(150);
  const model = getModel(modelId) as EvModel;

  const miPerKwh = efficiencyMiPerKwh(model);
  const usable = model.usableKwh;
  // A practical public-charging session runs 20→80%: below 20 you're cutting
  // it fine, above 80 the taper makes the minutes stop being worth it.
  const milesPerSession = (usable * 0.6) / (1 / miPerKwh);
  const sessions = milesPerWeek / milesPerSession;
  const minutesPerSession = minutesBetweenSoc(model, STATION_KW, 20, 80);
  const minsPerWeek = Math.round(sessions * minutesPerSession);

  const stopsLabel =
    sessions < 1
      ? `About ${Math.round(sessions * 4)} a month`
      : `${sessions < 1.5 ? "1" : Math.round(sessions)} a week`;

  return (
    <GuideFigure
      eyebrow="Your week"
      title="What public-only charging actually takes"
      footnote={
        <>
          Which days the stops fall on is illustrative; how many there are and
          how long each takes is the model. Assumes a practical 20–80% session
          — below 20% you are cutting it fine and above 80% the taper stops
          paying for the minutes. {ESTIMATE_BASIS}
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="routine-model" value={modelId} onChange={setModelId} />
          <GuideSlider
            id="routine-miles"
            label="Miles you drive a week"
            value={milesPerWeek}
            onChange={setMiles}
            min={30}
            max={500}
            step={10}
            format={(n) => `${n} mi`}
            hint="The US average is around 250 miles a week."
          />
        </div>

        <div>
          <WeekStrip sessions={sessions} minsPerSession={minutesPerSession} />
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            <Readout label="Charging stops" value={stopsLabel} />
            {/* ONE UNIT, ALL THE WAY ACROSS.
                This switched to hours above sixty minutes, which was wrong
                twice over. Mechanically: value and unit were two independent
                ternaries changing on the same frame, so the animated number
                sprang across the boundary and rendered "50.3 hr/wk" — a
                figure the model cannot produce, in a unit it did not produce
                it in. (AnimatedNumber now jumps on a unit change, so that can
                no longer happen to anyone.) Editorially: the sub-line
                underneath has always been in minutes, so above an hour the
                headline and the line beneath it were in different units and
                the reader had to convert to relate them.

                The range here is about 4 to 150 minutes a week. "145 min/wk"
                is perfectly readable, and the week strip beside it is what
                actually makes the quantity felt. */}
            <Readout
              label="Time charging"
              value={minsPerWeek}
              decimals={0}
              unit="min/wk"
              sub={`${minutesPerSession} min per stop`}
            />
          </dl>

          <p className="text-body-sm text-ink-600 mt-6 max-w-measure">
            {/* This branch used to start at 1.2, so a model doing 0.78 stops a
                week was told "One stop a week" directly beneath a readout
                saying "About 3 a month". Both were the same number; only one
                of them was in the reader's units. */}
            {sessions < 0.85 ? (
              <>
                Not even every week — about {Math.round(sessions * 4)} stops a
                month, {minutesPerSession} minutes each. At this mileage public
                charging is an errand you run occasionally, not a routine you
                have to build a week around.
              </>
            ) : sessions <= 1.2 ? (
              <>
                One stop a week. For most people that is less time than a trip to
                a petrol station, because you are not standing at the pump —
                at our stations you are not even out of the car.
              </>
            ) : sessions <= 2.5 ? (
              <>
                Two stops a week, roughly {minutesPerSession} minutes each. That
                is a coffee, or the walk to the shop and back.
              </>
            ) : (
              <>
                You drive enough that public-only charging is a real commitment —
                about {Math.round(sessions)} stops a week. Worth checking whether
                your workplace has Level 2, which would absorb most of this.
              </>
            )}
          </p>
        </div>
      </div>
    </GuideFigure>
  );
}
