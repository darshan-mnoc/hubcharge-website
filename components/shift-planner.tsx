"use client";

import { useState } from "react";
import { getModel, efficiencyMiPerKwh, type EvModel } from "@/lib/ev-models";
import { minutesBetweenSoc, STATION_KW, ESTIMATE_BASIS } from "@/lib/charging-math";
import { ModelPicker } from "@/components/model-picker";
import { GuideFigure, GuideSlider, Readout } from "@/components/guide-figure";

/**
 * A driving shift, in charging terms.
 *
 * Rideshare and delivery drivers are the one audience for whom charging time
 * is directly lost income, so the useful output is minutes off the road and
 * what fraction of the shift that is — not range.
 */
export function ShiftPlanner() {
  const [modelId, setModelId] = useState("tesla-model-3-lr");
  const [shiftMiles, setShiftMiles] = useState(280);
  const [shiftHours, setShiftHours] = useState(8);
  const model = getModel(modelId) as EvModel;

  const miPerKwh = efficiencyMiPerKwh(model);
  // Rideshare driving is city-heavy and stop-start, which is the one case
  // where real-world efficiency beats the EPA combined figure rather than
  // trailing it. Held flat here rather than claimed as a bonus.
  const usableWindow = model.usableKwh * 0.6; // 20→80%
  const milesPerSession = usableWindow * miPerKwh;
  // Leave at 90%, keep a 15% reserve — no working driver runs to zero.
  const startBuffer = model.epaMiles * 0.75;
  const needed = Math.max(0, shiftMiles - startBuffer);
  const sessions = needed <= 0 ? 0 : Math.ceil(needed / milesPerSession);
  const perSession = minutesBetweenSoc(model, STATION_KW, 20, 80);
  const totalMin = sessions * perSession;
  /* ONE value, clamped once, read by both the number and the bar.
     The bar used to clamp at 100 while the readout beside it printed 140% —
     so the drawing said there was still driving time left and the number said
     there wasn't. A figure must not contradict itself. */
  const rawPct = (totalMin / (shiftHours * 60)) * 100;
  const pctOfShift = Math.round(Math.min(100, rawPct));
  const overrun = rawPct > 100;

  return (
    <GuideFigure
      eyebrow="Your shift"
      title="How much of a driving day goes to charging"
      footnote={
        <>
          Assumes you start near full and top up in 20–80% windows. City driving
          is stop-start and usually beats the EPA figure; we hold the EPA number
          rather than claim the difference. {ESTIMATE_BASIS}
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-10">
        <div className="space-y-5">
          <ModelPicker id="shift-model" value={modelId} onChange={setModelId} />
          <GuideSlider
            id="shift-miles" label="Miles in a shift" value={shiftMiles}
            onChange={setShiftMiles} min={50} max={400} step={10}
            format={(n) => `${n} mi`}
            hint="A busy full-time day in LA runs 250–350."
          />
          <GuideSlider
            id="shift-hours" label="Shift length" value={shiftHours}
            onChange={setShiftHours} min={4} max={14} step={1}
            format={(n) => `${n} hr`}
          />
        </div>

        <div>
          <dl className="grid grid-cols-3 gap-x-5 gap-y-5">
            <Readout label="Stops needed" value={sessions} sub={sessions === 0 ? "starts full" : `${perSession} min each`} />
            {/* step: this is sessions x perSession, so it can only ever be a
                multiple of perSession. Without the step the spring rendered
                31, 38 and 44 minutes on its way from 26 to 52 — none of which
                this model can produce. */}
            <Readout label="Off the road" value={totalMin} unit="min" step={perSession} />
            <Readout
              label="Of your shift"
              value={pctOfShift}
              unit="%"
              sub={overrun ? "more than a full shift" : undefined}
            />
          </dl>

          {/* The shift as a bar — charging time against driving time */}
          <div className="mt-7">
            <div className="flex h-3 rounded-full overflow-hidden bg-paper-200">
              {/* Twice off Tailwind's transition-[width], which compiles to
                  its own cubic-bezier at build time and animated on a curve
                  nothing else here uses. The first fix was a framer spring —
                  correct, and 49 kB of animation runtime on a route that had
                  no other reason to load it, to move one bar. [data-track]
                  does the same on the house curve, from CSS, and animates a
                  transform rather than a width so it never touches layout. */}
              <div
                data-track
                className="h-full w-full bg-brand"
                style={{ "--v": pctOfShift / 100 } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between mt-2 text-caption text-ink-400">
              <span>Charging</span>
              <span>Driving</span>
            </div>
          </div>

          <p className="text-body-sm text-ink-600 mt-6 max-w-measure">
            {sessions === 0 ? (
              <>A shift this length fits inside one charge. Plug in overnight and you never stop.</>
            ) : (
              <>
                {sessions === 1 ? "One stop" : `${sessions} stops`} of{" "}
                {perSession} minutes. Ten-minute top-ups spread across the day
                land you in the fast part of the curve every time, which is why
                several short stops usually beat one long one for a working
                driver.
              </>
            )}
          </p>
        </div>
      </div>
    </GuideFigure>
  );
}
