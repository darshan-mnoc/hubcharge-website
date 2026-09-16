"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NO_MOTION, SPRING_TRACK } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useState } from "react";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";
import {
  minutesBetweenSoc,
  rangeTempFactor,
  chargeTempFactor,
  STATION_KW,
  ESTIMATE_BASIS,
} from "@/lib/charging-math";
import { ModelPicker } from "@/components/model-picker";
import { GuideFigure, GuideSlider } from "@/components/guide-figure";

/**
 * A long drive, broken into legs.
 *
 * Trip planners in cars optimise for arrival time and hide the reasoning. The
 * thing a first-time road-tripper actually needs to see is that the stops are
 * short and there are fewer of them than they fear — and the arithmetic that
 * gets you there, so they can sanity-check it against their own route.
 *
 * Deliberately conservative: a 10% arrival buffer, and highway speed costs
 * real efficiency, which the EPA combined figure does not fully capture.
 */
const HIGHWAY_PENALTY = 0.85;

export function TripPlanner() {
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [distance, setDistance] = useState(350);
  const [temp, setTemp] = useState(70);
  const model = getModel(modelId) as EvModel;

  const miPerKwh = efficiencyMiPerKwh(model) * HIGHWAY_PENALTY * rangeTempFactor(temp);
  const fullRange = model.usableKwh * miPerKwh;
  // Leave with 90%, arrive at each stop with 10%, charge to 80%.
  const firstLeg = fullRange * 0.8;
  const laterLeg = fullRange * 0.7;
  const reduced = useReducedMotion();
  /* THE SAME TEMPERATURE ON BOTH SIDES OF THE TRIP.
     rangeTempFactor shortened the legs above, but this was computed at the
     default "mild" — so dragging the temperature slider changed how FAR you
     drove between stops and never how LONG each stop took, which is the
     larger of the two effects in real cold. A 20°F trip grew more stops and
     kept 70°F charging times. chargeTempFactor is the charging-curve half of
     the same weather the line above already applies to range. */
  const stopMinutes = minutesBetweenSoc(
    model,
    STATION_KW,
    10,
    80,
    chargeTempFactor(temp)
  );

  /* A leg's identity is its ORDINAL, not the mile it starts at.
     This keyed on the starting mile and the comment claimed that was stable.
     It is stable for the distance slider only: firstLeg and laterLeg are
     derived from rangeTempFactor(temp), so dragging TEMPERATURE changed every
     start mile, changed every key, and made AnimatePresence exit the entire
     row while a whole new row entered — so mid-drag the reader saw up to twice
     as many legs as the trip has. The same happened on a model change.

     "The third leg of this drive" is the thing that persists across both
     sliders, so that is what the key has to be. */
  const legs: { start: number; miles: number; charge: boolean }[] = [];
  let left = distance;
  let first = true;
  let travelled = 0;
  while (left > 0 && legs.length < 12) {
    const cap = first ? firstLeg : laterLeg;
    const go = Math.min(left, cap);
    left -= go;
    legs.push({ start: Math.round(travelled), miles: Math.round(go), charge: left > 0 });
    travelled += go;
    first = false;
  }
  const stops = legs.filter((l) => l.charge).length;
  const driveHours = distance / 62; // realistic average including traffic
  const totalHours = driveHours + (stops * stopMinutes) / 60;

  return (
    <GuideFigure
      eyebrow="Plan the drive"
      title="How a long trip actually breaks up"
      footnote={
        <>
          Assumes leaving at 90%, arriving at each stop near 10%, and charging
          to 80% — the fast part of the curve. Highway speed is modelled at 15%
          worse than the EPA combined figure, because sustained 70 mph costs
          real efficiency. {ESTIMATE_BASIS}
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="trip-model" value={modelId} onChange={setModelId} />
          <GuideSlider
            id="trip-distance" label="Trip distance" value={distance}
            onChange={setDistance} min={100} max={900} step={25}
            format={(n) => `${n} mi`}
            hint="LA to Vegas is about 270. LA to San Francisco is about 380."
          />
          <GuideSlider
            id="trip-temp" label="Temperature" value={temp}
            onChange={setTemp} min={20} max={105} step={5}
            format={(n) => `${n}°F`}
          />
        </div>

        <div>
          <dl className="grid grid-cols-3 gap-x-5 gap-y-4 mb-7">
            <div>
              <dt className="text-caption text-ink-500">Charging stops</dt>
              <dd className="text-h2 text-ink-900 mt-1">{stops}</dd>
            </div>
            <div>
              <dt className="text-caption text-ink-500">Added to the drive</dt>
              <dd className="text-h2 text-ink-900 mt-1">
                {stops * stopMinutes}<span className="text-h4 text-ink-500 ml-1">min</span>
              </dd>
            </div>
            <div>
              <dt className="text-caption text-ink-500">Door to door</dt>
              <dd className="text-h2 text-ink-900 mt-1">
                {totalHours.toFixed(1)}<span className="text-h4 text-ink-500 ml-1">hr</span>
              </dd>
            </div>
          </dl>

          {/* the drive as a line, stops marked on it */}
          <ol className="flex items-stretch gap-1 h-10">
            <AnimatePresence initial={false}>
            {legs.map((l, i) => (
              <motion.li
                key={`leg-${i}`}
                className="relative flex items-center justify-center rounded bg-ink-100 text-caption text-ink-600 overflow-hidden"
                /* flexGrow springs rather than jumping, so a leg getting
                   longer looks like it is getting longer. The layout pass this
                   forces is on one flex row of at most twelve items — the
                   documented exception to keeping width off the animated list.

                   The `layout` prop that used to sit above this comment has
                   gone. It turned on the projection engine the comment was
                   arguing against, so framer measured every item and applied a
                   corrective scale ON TOP of the flexGrow spring — giving the
                   mileage text inside exactly the distortion described here. */
                initial={{ opacity: 0, flexGrow: 0.001 }}
                animate={{ opacity: 1, flexGrow: l.miles }}
                exit={{ opacity: 0, flexGrow: 0.001 }}
                transition={reduced ? NO_MOTION : SPRING_TRACK}
                title={`${l.miles} mi`}
              >
                {l.miles > distance / 8 && `${l.miles} mi`}
                {l.charge && (
                  /* An end-cap, inside the bounds. This was `-right-1 w-2`
                     on an element whose parent is overflow-hidden, so exactly
                     half of every marker was clipped away — the half that was
                     meant to bridge the gap to the next leg never rendered at
                     all. Sitting flush at the leg's end also says the right
                     thing: you stop when that leg runs out. */
                  <span
                    aria-hidden
                    className="absolute right-0 inset-y-0 w-1.5 rounded-r bg-brand"
                  />
                )}
              </motion.li>
            ))}
            </AnimatePresence>
          </ol>
          {/* Where the line starts and ends, and what it is measured in. It
              was an unlabelled row of bars: no origin, no destination, and no
              scale, so the one number it drew to — total distance — appeared
              nowhere on the drawing. */}
          <div className="mt-1.5 flex items-baseline justify-between text-caption text-ink-400">
            <span>Leave · 0 mi</span>
            <span className="tabular-nums">Arrive · {distance} mi</span>
          </div>
          <p className="text-caption text-ink-400 mt-2">
            Each block is one leg, drawn to distance. Orange marks a stop of
            about {stopMinutes} minutes.
          </p>

          <p className="text-body-sm text-ink-600 mt-6 max-w-measure">
            {stops === 0 ? (
              <>This one is a single-charge trip. Leave full and drive.</>
            ) : (
              <>
                {stops === 1 ? "One stop" : `${stops} stops`}, adding{" "}
                {stops * stopMinutes} minutes to roughly {driveHours.toFixed(1)}{" "}
                hours of driving. Most people stop for about that long on a
                drive this length anyway — the question is whether the stops
                land where you want them, which is what a route planner in the
                car is genuinely good at.
              </>
            )}
          </p>
        </div>
      </div>
    </GuideFigure>
  );
}
