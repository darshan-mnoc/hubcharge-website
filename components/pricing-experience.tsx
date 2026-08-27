"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Coffee,
  Utensils,
  ShoppingBag,
  Sparkles,
  Check,
  X,
  Clock,
  BatteryCharging,
} from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { fadeUp, fadeUpStagger } from "@/lib/motion";
import { configuratorModels, simulateSession, STATION_KW, REFERENCE_START_SOC } from "@/lib/charging-math";

/* "Design your stop" — a number-free pricing experience.
   The user picks how far, their car, and what to enjoy; we preview the
   personalized session. The payoff is clarity, not a price. */

type DistanceId = "topup" | "half" | "full";

const distances: {
  id: DistanceId;
  label: string;
  time: string;
  fill: number;
  minutes: number;
}[] = [
  { id: "topup", label: "Quick top-up", time: "~10 min", fill: 38, minutes: 10 },
  { id: "half", label: "Half charge", time: "~20 min", fill: 68, minutes: 20 },
  { id: "full", label: "Full charge", time: "~30 min", fill: 96, minutes: 30 },
];

// Real models with real charging curves — simulated per session length
// rather than a per-make average times a fixed multiplier.
const cars = configuratorModels();

const addons = [
  { id: "coffee", label: "Coffee & drinks", icon: Coffee },
  { id: "food", label: "Food", icon: Utensils },
  { id: "errands", label: "Errands", icon: ShoppingBag },
  { id: "carcare", label: "Car care", icon: Sparkles },
] as const;

type AddonId = (typeof addons)[number]["id"];

// Real advantages of a flat, predictable session rate.
const gotchas = [
  "Unexpected final cost",
  "Unexpected final time",
  "Time-of-use pricing spikes",
  "Congestion surcharges",
];

export function PricingExperience() {
  const [distance, setDistance] = useState<DistanceId>("topup");
  const [carId, setCarId] = useState("tesla-model-y-lr");
  const [chosen, setChosen] = useState<Set<AddonId>>(new Set(["coffee"]));

  const dist = distances.find((d) => d.id === distance)!;
  const car = cars.find((c) => c.id === carId) ?? cars[0];
  // Simulated from the car's real curve against our output, not a multiplier.
  const sim = simulateSession(car.model, STATION_KW, REFERENCE_START_SOC, dist.minutes);
  const chosenList = addons.filter((a) => chosen.has(a.id));

  const toggle = (id: AddonId) =>
    setChosen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const included = useMemo(
    () => [
      "Your full charging session",
      "Pay right from your phone",
      ...chosenList.map((a) => `${a.label} delivered`),
    ],
    [chosenList],
  );

  return (
    <section
      id="pricing"
      data-reveal
      className="relative section-padding bg-paper-100 overflow-hidden"
    >

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUpStagger}
          className="mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-overline text-ink-500 mb-4"
          >
            Pricing, reimagined
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h2 text-ink-900 mb-4">
            One flat rate. No surprises.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-body-lg text-ink-600 max-w-xl"
          >
            Design your stop below. Whatever you pick, you&apos;ll{" "}
            <span className="font-semibold text-ink-800">
              know your flat rate before you plug in
            </span>
            .
          </motion.p>
        </motion.div>

        {/* Builder */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* LEFT — choices */}
          <div className="rounded-lg bg-white border border-paper-300 shadow-card p-6 lg:p-8 space-y-8">
            {/* 1. distance */}
            <div>
              <p className="text-overline text-ink-500 mb-3">
                1 · How far do you need?
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                role="radiogroup"
                aria-label="How much charge"
              >
                {distances.map((d) => {
                  const active = d.id === distance;
                  return (
                    <button
                      key={d.id}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setDistance(d.id)}
                      className={`rounded-lg border px-3 py-3 text-center transition-colors ${
                        active
                          ? "border-transparent bg-ink-900"
                          : "border-paper-300 hover:border-paper-400"
                      }`}
                    >
                      <span
                        className={`block text-body-sm font-semibold ${active ? "text-white" : "text-ink-800"}`}
                      >
                        {d.label}
                      </span>
                      <span className={`block text-caption mt-0.5 ${active ? "text-on-dark/70" : "text-ink-500"}`}>
                        {d.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. car */}
            <div>
              <p className="text-overline text-ink-500 mb-3">2 · Your car</p>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Your car"
              >
                {cars.map((c) => {
                  const active = c.id === carId;
                  return (
                    <button
                      key={c.id}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setCarId(c.id)}
                      className={`rounded-full border px-4 py-2 text-body-sm font-medium transition-all ${
                        active
                          ? "border-brand bg-brand text-ink-900"
                          : "border-paper-300 text-ink-700 hover:border-paper-400"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. addons */}
            <div>
              <p className="text-overline text-ink-500 mb-3">
                3 · While you charge
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {addons.map((a) => {
                  const active = chosen.has(a.id);
                  return (
                    <button
                      key={a.id}
                      aria-pressed={active}
                      onClick={() => toggle(a.id)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-transparent bg-ink-900"
                          : "border-paper-300 hover:border-paper-400"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${active ? "bg-white/10 text-brand" : "bg-paper-200 text-ink-500"}`}
                      >
                        <a.icon className="h-4 w-4" />
                      </span>
                      <span
                        className={`text-body-sm font-medium ${active ? "text-white" : "text-ink-600"}`}
                      >
                        {a.label}
                      </span>
                      <span className="ml-auto">
                        {active ? (
                          <Check className="h-4 w-4 text-brand" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-paper-400 block" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-caption text-ink-500 mt-2">
                Lifestyle services launching at select hubs.
              </p>
            </div>
          </div>

          {/* RIGHT — your stop (dark feature card) */}
          <div className="relative rounded-lg bg-ink-900 overflow-hidden p-6 lg:p-8 flex flex-col">

            <div className="relative">
              <p className="text-overline text-muted-dark mb-1">
                Your HubCharge™ stop
              </p>

              {/* battery */}
              <div className="mt-4 mb-5">
                {/* Announces the recalculated result to screen readers when a
                    distance / car / add-on selection changes (WCAG 4.1.3). */}
                <p aria-live="polite" className="sr-only">
                  {`About ${sim.milesLow} to ${sim.milesHigh} miles added to your ${car.name} in ${dist.time}.`}
                </p>
                <div className="flex items-center gap-2 mb-2 text-on-dark">
                  <BatteryCharging className="h-5 w-5 text-brand" />
                  <motion.span
                    key={`${carId}-${distance}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-h2"
                  >
                    {sim.milesLow}–{sim.milesHigh} mi
                  </motion.span>
                  <span className="text-body-sm text-muted-dark">
                    to your {car.name} · {dist.time}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-[#FFB068]"
                    animate={{ width: `${dist.fill}%` }}
                    transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  />
                </div>
                <p className="text-footnote text-muted-dark mt-1">
                  Estimated added range
                </p>
              </div>

              {/* extensions */}
              <div className="mb-5 flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2">
                <Clock className="h-4 w-4 text-brand flex-shrink-0" />
                <p className="text-caption text-muted-dark">
                  Need longer? Extend in quick taps —{" "}
                  <span className="text-on-dark font-medium">
                    up to 4 times
                  </span>
                  .
                </p>
              </div>

              {/* included */}
              <p className="text-overline text-muted-dark mb-2">Your stop</p>
              <ul className="space-y-2 mb-6">
                <AnimatePresence initial={false}>
                  {included.map((item) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2.5 text-body-sm text-on-dark"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/20">
                        <Check className="h-3 w-3 text-brand" />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>

            {/* payoff — the "A finale" */}
            <div className="relative mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-brand" />
                <span className="text-h4 text-on-dark">
                  One flat rate
                </span>
                <span className="text-body-sm text-muted-dark">
                  — known upfront.
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                {gotchas.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-1.5 text-caption text-muted-dark"
                  >
                    <X className="h-3.5 w-3.5 text-error-on-dark/80" />
                    <span className="line-through decoration-error/40">
                      {g}
                    </span>
                  </span>
                ))}
              </div>
              <CtaButton href="#locations" size="lg" fullWidth>
                Find your hub
              </CtaButton>
              <p className="flex items-center justify-center gap-1.5 text-footnote text-muted-dark mt-3">
                <Check className="h-3 w-3 text-brand" />
                Flat, fair, and predictable.{" "}
                <a
                  href="/pricing"
                  className="underline underline-offset-2 hover:text-brand"
                >
                  How our pricing works →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
