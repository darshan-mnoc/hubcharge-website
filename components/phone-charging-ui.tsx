"use client";

import { motion } from "framer-motion";
import { Lock, ChevronRight, Wifi, Signal, BatteryFull } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The charging flow, rendered rather than photographed.
 *
 * The frame used to hold a photograph of a charger captioned as though it were
 * the interface, which meant the mockup and the prose beside it described
 * different things. This is the actual flow: browser chrome with our domain
 * (the whole point — no app), connector, session length, swipe.
 *
 * Deliberately no price on the screen. Our rate is real and shown in the
 * product before you plug in, but the site does not publish it, and a mockup
 * that leaked a number would be the one place it did.
 *
 * Bezel radii are concentric, each inset subtracted from the one outside it:
 * 44px shell, minus the 3px rim gives 41px, minus the 10px bezel gives 31px.
 * Get this wrong and the corners very slightly disagree, which is most of the
 * difference between a device and a rounded rectangle.
 */
export function PhoneChargingUI() {
  const reduced = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="A phone showing the HubCharge session screen open in a browser at hubcharge.com: NACS connector selected, a ten-minute session chosen, and a swipe-to-start control. No app is installed."
      className="relative w-[260px] sm:w-[290px] lg:w-[310px]"
    >
      {/* side hardware — the thing that separates a device from a card */}
      <span
        aria-hidden
        className="absolute -left-[3px] top-[104px] h-9 w-[3px] rounded-l-sm bg-ink-700"
      />
      <span
        aria-hidden
        className="absolute -left-[3px] top-[150px] h-9 w-[3px] rounded-l-sm bg-ink-700"
      />
      <span
        aria-hidden
        className="absolute -right-[3px] top-[130px] h-14 w-[3px] rounded-r-sm bg-ink-700"
      />

      {/* body */}
      <div className="relative rounded-[2.75rem] bg-gradient-to-b from-ink-700 via-ink-900 to-ink-800 p-[3px] shadow-[0_34px_70px_-22px_rgba(10,25,47,0.55)]">
        <div className="rounded-[2.5625rem] bg-ink-900 p-2.5">
          <div className="relative flex flex-col rounded-[1.9375rem] overflow-hidden bg-paper aspect-[9/17.5]">
            {/* screen glass */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-[1.9375rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28),inset_0_1px_14px_rgba(10,25,47,0.18)]"
            />

            {/* status bar */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-semibold text-ink-900">
              <span>9:41</span>
              <span
                aria-hidden
                className="absolute left-1/2 top-1.5 -translate-x-1/2 h-[18px] w-[62px] rounded-full bg-ink-900"
              />
              <span className="flex items-center gap-1">
                <Signal className="h-2.5 w-2.5" />
                <Wifi className="h-2.5 w-2.5" />
                <BatteryFull className="h-3 w-3" />
              </span>
            </div>

            {/* browser chrome — the argument, in one line */}
            <div className="px-3 pt-2.5 pb-2">
              <div className="flex items-center gap-1.5 rounded-full bg-paper-200 px-3 py-1.5">
                <Lock aria-hidden className="h-2.5 w-2.5 text-ink-400" />
                <span className="text-[10px] text-ink-600">hubcharge.com</span>
              </div>
            </div>

            {/* session screen */}
            <div className="flex flex-1 flex-col px-4 pt-1 pb-5">
              <p className="text-[9px] tracking-[0.14em] uppercase text-ink-400">
                Alhambra
              </p>
              <p className="text-[15px] font-semibold text-ink-900 mt-0.5">
                Charger 03
              </p>

              <p className="text-[9px] tracking-[0.14em] uppercase text-ink-400 mt-4 mb-1.5">
                Connector
              </p>
              <div className="flex gap-1.5">
                <span className="flex-1 rounded-lg bg-brand px-2 py-1.5 text-center text-[10px] font-semibold text-white">
                  NACS
                </span>
                <span className="flex-1 rounded-lg border border-paper-300 px-2 py-1.5 text-center text-[10px] text-ink-500">
                  CCS
                </span>
              </div>

              <p className="text-[9px] tracking-[0.14em] uppercase text-ink-400 mt-3.5 mb-1.5">
                Session
              </p>
              <div className="flex gap-1.5">
                <span className="flex-1 rounded-lg bg-ink-900 px-2 py-1.5 text-center text-[10px] font-semibold text-white">
                  10 min
                </span>
                <span className="flex-1 rounded-lg border border-paper-300 px-2 py-1.5 text-center text-[10px] text-ink-500">
                  20 min
                </span>
                <span className="flex-1 rounded-lg border border-paper-300 px-2 py-1.5 text-center text-[10px] text-ink-500">
                  30 min
                </span>
              </div>

              <p className="text-[9px] text-ink-400 mt-4 leading-snug">
                Your flat rate appears here for approval before charging starts.
              </p>

              {/* Unconditional facts about the hardware, not a live status the
                  mockup would be pretending to know. */}
              <dl className="mt-4 border-t border-paper-300 pt-3 space-y-2">
                {[
                  ["Cables on this charger", "NACS + CCS"],
                  ["Maximum output", "180 kW"],
                  ["Extensions", "Up to 4 per stop"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-2">
                    <dt className="text-[9px] text-ink-400">{k}</dt>
                    <dd className="text-[10px] font-semibold text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* swipe to start */}
              <div className="relative mt-auto h-11 rounded-full bg-ink-900 overflow-hidden">
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white/70">
                  Swipe to start
                </span>
                <motion.span
                  aria-hidden
                  className="absolute left-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand shadow-[0_2px_8px_rgba(10,25,47,0.35)]"
                  animate={reduced ? undefined : { x: [0, 118, 118, 0] }}
                  transition={
                    reduced
                      ? undefined
                      : {
                          duration: 3.4,
                          times: [0, 0.42, 0.72, 0.86],
                          repeat: Infinity,
                          repeatDelay: 1.4,
                          ease: "easeInOut",
                        }
                  }
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </motion.span>
              </div>

              <p className="text-center text-[9px] text-ink-400 mt-2.5">
                No app. No account required.
              </p>
            </div>

            {/* home indicator */}
            <span
              aria-hidden
              className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ink-900/25"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
