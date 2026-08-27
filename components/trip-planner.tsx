"use client";

import { useState } from "react";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";
import {
  minutesBetweenSoc,
  rangeTempFactor,
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
  const stopMinutes = minutesBetweenSoc(model, STATION_KW, 10, 80);

  const legs: { miles: number; charge: boolean }[] = [];
  let left = distance;
  let first = true;
  while (left > 0 && legs.length < 12) {
    const cap = first ? firstLeg : laterLeg;
    const go = Math.min(left, cap);
    left -= go;
    legs.push({ miles: Math.round(go), charge: left > 0 });
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
            {legs.map((l, i) => (
              <li
                key={i}
                className="relative flex items-center justify-center rounded bg-ink-100 text-caption text-ink-600"
                style={{ flexGrow: l.miles }}
                title={`${l.miles} mi`}
              >
                {l.miles > distance / 8 && `${l.miles} mi`}
                {l.charge && (
                  <span
                    aria-hidden
                    className="absolute -right-1 top-1/2 -translate-y-1/2 h-6 w-2 rounded-full bg-brand"
                  />
                )}
              </li>
            ))}
          </ol>
          <p className="text-caption text-ink-400 mt-2">
            Orange marks a stop of about {stopMinutes} minutes.
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
