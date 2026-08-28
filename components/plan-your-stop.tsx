"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging, Info } from "lucide-react";
import { getModel, type EvModel } from "@/lib/ev-models";
import { ModelPicker } from "@/components/model-picker";
import { CurveSpark } from "@/components/curve-spark";
import {
  simulateSession,
  minutesBetweenSoc,
  TEMPERATURE_FACTORS,
  type TemperatureId,
  ESTIMATE_BASIS,
} from "@/lib/charging-math";
import type { Station } from "@/lib/stations";

const STAYS = [
  { id: "topup", label: "Quick top-up", minutes: 10 },
  { id: "half", label: "Half stop", minutes: 20 },
  { id: "long", label: "Longer stop", minutes: 30 },
] as const;

const START_SOCS = [10, 20, 40, 60] as const;

/** A numbered control group. Four unlabelled stacks read as one long list;
 *  numbering them says there are exactly four decisions and you're on the second. */
function Step({
  n,
  label,
  children,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr] gap-x-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-footnote text-on-dark/70"
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-caption text-on-dark/60 mb-2">{label}</p>
        {children}
      </div>
    </div>
  );
}

/**
 * Per-station charging estimate.
 *
 * Simulates the selected car's actual charging curve against this station's
 * output, rather than multiplying a per-make average. Starting state of
 * charge is a control because it is the single largest factor in how much
 * range a short stop adds — a car at 20% charges roughly twice as fast as
 * the same car at 60%.
 */
export function PlanYourStop({ station }: { station: Station }) {
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [stayId, setStayId] = useState<(typeof STAYS)[number]["id"]>("topup");
  const [startSoc, setStartSoc] = useState<number>(20);
  const [temp, setTemp] = useState<TemperatureId>("mild");

  const model = getModel(modelId) as EvModel;
  const stay = STAYS.find((s) => s.id === stayId)!;

  const result = useMemo(
    () => simulateSession(model, station.maxKw, startSoc, stay.minutes, temp),
    [model, station.maxKw, startSoc, stay.minutes, temp]
  );

  const tenToEighty = useMemo(
    () => minutesBetweenSoc(model, station.maxKw, 10, 80, temp),
    [model, station.maxKw, temp]
  );

  return (
    <section id="plan" className="bg-ink-900 rounded-lg p-5 sm:p-8 scroll-mt-28">
      <p className="text-overline text-white/55">Plan your stop</p>
      <span aria-hidden className="mt-3 mb-5 block h-px w-8 bg-brass" />
      <h2 className="text-h3 text-white mb-6">
        What {station.city} adds to your car
      </h2>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-12 items-start">
        <div className="space-y-5 min-w-0">
          {/* Model */}
          <Step n={1} label="Your car">
            <div className="max-w-sm">
              <ModelPicker
                id="pys-model"
                value={modelId}
                onChange={setModelId}
                label=""
                tone="dark"
              />
            </div>
          </Step>

          {/* Starting charge */}
          <Step n={2} label="Battery when you arrive">
            <div
              role="group"
              aria-label="Battery when you arrive"
              className="flex flex-wrap gap-2"
            >
              {START_SOCS.map((s) => {
                const active = s === startSoc;
                return (
                  <button
                    key={s}
                    aria-pressed={active}
                    onClick={() => setStartSoc(s)}
                    className={`rounded-full border px-4 py-1.5 text-caption transition-colors ${
                      active
                        ? "border-brand bg-brand text-ink-900"
                        : "border-white/20 text-on-dark/75 hover:border-white/45"
                    }`}
                  >
                    {s}%
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Stay length */}
          <Step n={3} label="How long you stay">
            <div
              role="group"
              aria-label="How long you stay"
              className="flex flex-wrap gap-2"
            >
              {STAYS.map((s) => {
                const active = s.id === stayId;
                return (
                  <button
                    key={s.id}
                    aria-pressed={active}
                    onClick={() => setStayId(s.id)}
                    className={`rounded-full border px-4 py-1.5 text-caption transition-colors ${
                      active
                        ? "border-brand bg-brand text-ink-900"
                        : "border-white/20 text-on-dark/75 hover:border-white/45"
                    }`}
                  >
                    {s.label}
                    <span className="ml-1.5 opacity-60">{s.minutes} min</span>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Weather */}
          <Step n={4} label="Weather">
            <div role="group" aria-label="Weather" className="flex flex-wrap gap-2">
              {Object.values(TEMPERATURE_FACTORS).map((t) => {
                const active = t.id === temp;
                return (
                  <button
                    key={t.id}
                    aria-pressed={active}
                    onClick={() => setTemp(t.id as TemperatureId)}
                    className={`rounded-full border px-4 py-1.5 text-caption transition-colors ${
                      active
                        ? "border-brand bg-brand text-ink-900"
                        : "border-white/20 text-on-dark/75 hover:border-white/45"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Step>
        </div>

        {/* Result */}
        <div className="lg:text-right lg:min-w-[17ch] border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10">
          <p aria-live="polite" className="sr-only">
            {`About ${result.milesLow} to ${result.milesHigh} miles added to your ${model.name} in ${stay.minutes} minutes.`}
          </p>
          <span className="flex items-center gap-2 lg:justify-end text-on-dark/60 text-caption mb-1">
            <BatteryCharging aria-hidden className="h-4 w-4 text-brand" />
            Estimated range added
          </span>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${modelId}-${stayId}-${startSoc}-${temp}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="text-stat text-white whitespace-nowrap"
            >
              {result.milesLow}–{result.milesHigh}
              <span className="text-h2 text-on-dark/60 ml-2">mi</span>
            </motion.p>
          </AnimatePresence>

          {/* The shape behind the number — same curve the estimate integrates. */}
          <CurveSpark model={model} tone="dark" className="mt-4 h-9 w-full max-w-[17ch] lg:ml-auto" />

          <dl className="mt-5 space-y-1.5 text-caption">
            <div className="flex gap-2 lg:justify-end">
              <dt className="text-on-dark/60">Battery after</dt>
              <dd className="text-on-dark">{startSoc}% → {result.endSoc}%</dd>
            </div>
            <div className="flex gap-2 lg:justify-end">
              <dt className="text-on-dark/60">Average power</dt>
              <dd className="text-on-dark">{result.avgKw} kW</dd>
            </div>
            <div className="flex gap-2 lg:justify-end">
              <dt className="text-on-dark/60">10–80% here</dt>
              <dd className="text-on-dark">{tenToEighty} min</dd>
            </div>
          </dl>

          {result.vehicleLimited && (
            <p className="mt-4 flex gap-1.5 lg:justify-end text-caption text-brass">
              <Info aria-hidden className="h-3 w-3 mt-0.5 shrink-0" />
              <span className="lg:text-right">
                This car peaks at {model.peakKw}kW — it, not our charger, sets
                the pace.
              </span>
            </p>
          )}
        </div>
      </div>

      {model.note && (
        <p className="mt-7 flex gap-2 text-caption text-on-dark/60 max-w-[80ch]">
          <Info aria-hidden className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brass" />
          {model.note}
        </p>
      )}
      <p className="text-caption text-on-dark/60 mt-3 max-w-[80ch]">{ESTIMATE_BASIS}</p>
    </section>
  );
}
