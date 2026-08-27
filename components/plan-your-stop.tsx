"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging } from "lucide-react";
import { configuratorCars, RANGE_FOOTNOTE } from "@/lib/vehicles";
import type { Station } from "@/lib/stations";

const cars = configuratorCars();

const LENGTHS = [
  { id: "topup", label: "Quick top-up", minutes: "~10 min", mult: 1 },
  { id: "half", label: "Half charge", minutes: "~20 min", mult: 1.9 },
  { id: "full", label: "Longer stop", minutes: "~30 min", mult: 2.7 },
] as const;

/**
 * Per-station version of the homepage configurator: pick your car, see the
 * range this station adds. Reuses the same vehicle figures so the two can
 * never drift apart.
 */
export function PlanYourStop({ station }: { station: Station }) {
  const [carId, setCarId] = useState(cars[0].id);
  const [lengthId, setLengthId] = useState<(typeof LENGTHS)[number]["id"]>("topup");

  const car = cars.find((c) => c.id === carId)!;
  const length = LENGTHS.find((l) => l.id === lengthId)!;
  const miles = Math.round((car.r * length.mult) / 5) * 5;

  return (
    <section className="bg-ink-900 rounded-lg p-6 lg:p-8">
      <p className="text-overline text-white/55">Plan your stop</p>
      <span aria-hidden className="mt-3 mb-5 block h-px w-8 bg-brass" />
      <h2 className="text-h3 text-white mb-6">
        What {station.city} adds to your car
      </h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-10 items-end">
        <div className="space-y-5">
          <div>
            <p className="text-caption text-on-dark/60 mb-2">Your car</p>
            <div
              role="radiogroup"
              aria-label="Your car"
              className="flex flex-wrap gap-2"
            >
              {cars.map((c) => {
                const active = c.id === carId;
                return (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCarId(c.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-white/20 text-on-dark/75 hover:border-white/45"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-caption text-on-dark/60 mb-2">How long you stay</p>
            <div
              role="radiogroup"
              aria-label="How long you stay"
              className="flex flex-wrap gap-2"
            >
              {LENGTHS.map((l) => {
                const active = l.id === lengthId;
                return (
                  <button
                    key={l.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setLengthId(l.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-white/20 text-on-dark/75 hover:border-white/45"
                    }`}
                  >
                    {l.label}
                    <span className="ml-1.5 opacity-60">{l.minutes}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:text-right lg:min-w-[15ch]">
          <p aria-live="polite" className="sr-only">
            {`About ${miles} miles added to your ${car.name} in ${length.minutes}.`}
          </p>
          <span className="flex items-center gap-2 lg:justify-end text-on-dark/60 text-caption mb-1">
            <BatteryCharging aria-hidden className="h-4 w-4 text-brand" />
            Estimated range added
          </span>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${carId}-${lengthId}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-stat text-white"
            >
              ~{miles} mi
            </motion.p>
          </AnimatePresence>
          <p className="text-caption text-on-dark/55 mt-1">
            {length.minutes} at {station.power.toLowerCase()}
          </p>
        </div>
      </div>

      <p className="text-[11px] text-white/35 mt-7 max-w-[70ch]">{RANGE_FOOTNOTE}</p>
    </section>
  );
}
