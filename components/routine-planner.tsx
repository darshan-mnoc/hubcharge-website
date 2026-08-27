"use client";

import { useState } from "react";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";
import { minutesBetweenSoc, STATION_KW, ESTIMATE_BASIS } from "@/lib/charging-math";
import { ModelPicker } from "@/components/model-picker";
import { GuideFigure, GuideSlider, Readout } from "@/components/guide-figure";

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
          Assumes a practical 20–80% session — below 20% you are cutting it fine
          and above 80% the taper stops paying for the minutes. {ESTIMATE_BASIS}
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
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <Readout label="Charging stops" value={stopsLabel} />
            <Readout
              label="Time charging"
              value={minsPerWeek < 60 ? minsPerWeek : (minsPerWeek / 60).toFixed(1)}
              unit={minsPerWeek < 60 ? "min/wk" : "hr/wk"}
              sub={`${minutesPerSession} min per stop`}
            />
          </dl>

          <p className="text-body-sm text-ink-600 mt-6 max-w-measure">
            {sessions <= 1.2 ? (
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
