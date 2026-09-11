"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NO_MOTION, SPRING_LAYOUT, EASE_OUT, DUR } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GuideFigure } from "@/components/guide-figure";

type Fix = { what: string; why: string; then?: string };
type Symptom = { id: string; label: string; sub: string; fixes: Fix[]; call?: boolean };

/**
 * Symptom → likely cause → what to try.
 *
 * Ordered by how often each cause is actually the one, not by how dramatic it
 * sounds. Every entry ends in something the driver can do; where the honest
 * answer is "this one is ours", it says so and gives the number rather than
 * sending someone through five steps that were never going to work.
 */
const SYMPTOMS: Symptom[] = [
  {
    id: "wont-start",
    label: "The session won't start",
    sub: "You've plugged in and nothing happens",
    fixes: [
      {
        what: "Reseat the connector",
        why: "By far the most common cause. The latch has to seat fully — a connector that looks in can still be a few millimetres short, and the car won't begin a handshake it doesn't trust.",
        then: "Pull it out fully, line it up square, push until it clicks.",
      },
      {
        what: "Check the car isn't locked out",
        why: "Some models refuse a session while the car is locked, in drive, or has a charge schedule set for later. A scheduled overnight charge at home is the one that catches people at a public charger.",
        then: "Unlock the car, put it in park, and clear any departure timer.",
      },
      {
        what: "Try the other cable",
        why: "Every HubCharge station carries both NACS and CCS. If one connector is faulty the other is right there.",
      },
    ],
  },
  {
    id: "stopped-early",
    label: "It stopped before I expected",
    sub: "The session ended on its own",
    fixes: [
      {
        what: "Check your state of charge",
        why: "Most sessions that 'stop early' reached the limit the car was set to. An 80% charge limit is the factory default on several models and is genuinely good for the battery.",
        then: "Look at the charge limit in the car's own settings, not the charger.",
      },
      {
        what: "Consider the pack temperature",
        why: "A very hot pack after sustained fast driving, or a very cold one in winter, will make the car throttle hard or pause. That is the car protecting itself, and it happens on every network.",
        then: "Give it a few minutes, or precondition on the way next time.",
      },
      {
        what: "The session may simply have completed",
        why: "Our sessions run for the length you chose. If you picked ten minutes, ten minutes is what you got — extend in taps if you want more.",
      },
    ],
  },
  {
    id: "cable-stuck",
    label: "The cable won't come out",
    sub: "The connector is latched in the car",
    fixes: [
      {
        what: "Unlock the car first",
        why: "Nearly always this. The charge port latch is tied to the central locking on most EVs, so a locked car holds the cable deliberately — it's an anti-theft feature working correctly.",
        then: "Unlock with the key or the door handle, then pull.",
      },
      {
        what: "End the session before pulling",
        why: "A live session keeps the latch engaged so the connector can't be yanked out under load.",
        then: "Stop the session on your phone, wait for the light to change, then remove.",
      },
      {
        what: "Find the manual release",
        why: "Every EV has one — usually a cable or lever in the boot near the charge port, or in the frunk. It's in the owner's manual under 'emergency release'.",
      },
    ],
  },
  {
    id: "slow",
    label: "It's charging much slower than I expected",
    sub: "The kW reading is low",
    fixes: [
      {
        what: "Check where you are on the curve",
        why: "Above roughly 60% state of charge every EV tapers hard — that's the battery management system, not the charger. Arriving at 70% and expecting peak power is the single most common misreading of a charging session.",
        then: "See the charging curve for your car.",
      },
      {
        what: "Cold pack",
        why: "Below about 50°F a battery accepts far less power — often around half. Navigating to the charger in the car's own nav usually warms the pack on the way.",
      },
      {
        what: "Your car's own ceiling",
        why: "Plenty of EVs peak well below our 180kW. A Bolt tops out near 55kW and will do that on any charger in the world, including a 350kW one.",
      },
    ],
  },
  {
    id: "charged-wrong",
    label: "Something looks wrong with my charge",
    sub: "Billing or session questions",
    call: true,
    fixes: [
      {
        what: "This one is ours to fix",
        why: "Anything about what you were charged, a session that didn't complete, or a stall that isn't behaving is our problem rather than something to troubleshoot from the driver's seat.",
      },
    ],
  },
];

export function Troubleshooter() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = SYMPTOMS.find((s) => s.id === openId);

  const reduced = useReducedMotion();

  return (
    <GuideFigure
      resizes
      eyebrow="Work it out"
      title={active ? active.label : "What's happening?"}
    >
      {/* A raw ternary swapped these two views in one frame, and because the
          two are different heights the whole card jump-cut to a new size at
          the same moment. Wrapped, the height animates once and the panels
          cross with a direction: the detail arrives from the right, and going
          back sends it the other way, so the swap is a place you can be
          rather than a flash. popLayout, not wait — with wait the exit
          finishes before the enter starts and the height moves in two visible
          steps instead of one. */}
      <motion.div layout={!reduced} style={{ overflow: "hidden" }} transition={reduced ? NO_MOTION : SPRING_LAYOUT}>
      <AnimatePresence initial={false} mode="popLayout">
      {!active ? (
        <motion.ul
          key="list"
          /* The parent animates its own height by projection, which is a
             SCALE — so without a projection node of their own, these children
             get that scale baked in and the headings visibly squash and
             stretch through the swap. `layout` here is not a second animation;
             it is the correction that makes the first one not distort. */
          layout={!reduced}
          initial={reduced ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: -12 }}
          transition={reduced ? NO_MOTION : { duration: DUR.base, ease: EASE_OUT }}
        >
          {SYMPTOMS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setOpenId(s.id)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left border-t border-paper-300 last:border-b group"
              >
                <span className="min-w-0">
                  <span className="hc-tint block text-h4 text-ink-900 group-hover:text-brand-ink">
                    {s.label}
                  </span>
                  <span className="block text-body-sm text-ink-500 mt-0.5">{s.sub}</span>
                </span>
                <ChevronRight aria-hidden className="hc-move h-4 w-4 shrink-0 text-ink-400 group-hover:translate-x-1" />
              </button>
            </li>
          ))}
        </motion.ul>
      ) : (
        <motion.div
          key={active.id}
          /* Same correction as the list above. */
          layout={!reduced}
          initial={reduced ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: 12 }}
          transition={reduced ? NO_MOTION : { duration: DUR.base, ease: EASE_OUT }}
        >
          <button
            onClick={() => setOpenId(null)}
            className="hc-tint inline-flex items-center gap-1.5 text-caption text-ink-500 hover:text-ink-900 mb-5"
          >
            <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
            All symptoms
          </button>

          <ol>
            {active.fixes.map((f, i) => (
              <li
                key={f.what}
                className="grid grid-cols-[2rem_1fr] gap-x-4 py-4 border-t border-paper-300 last:border-b"
              >
                <span className="text-index text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="text-h4 text-ink-900">{f.what}</p>
                  <p className="text-body-sm text-ink-500 mt-1.5">{f.why}</p>
                  {f.then && (
                    <p className="text-body-sm text-ink-900 mt-2 border-l-2 border-brass pl-3">
                      {f.then}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <p className="text-body-sm text-ink-600 mt-5">
            {active.call ? (
              <>
                Call us on{" "}
                <a href="tel:+19493928755" className="text-brand-ink underline underline-offset-2">
                  (949) 392-8755
                </a>{" "}
                during opening hours, or{" "}
                <Link href="/contact" className="text-brand-ink underline underline-offset-2">
                  send it in writing
                </Link>
                .
              </>
            ) : (
              <>
                Still stuck? An attendant is on site at participating locations —
                wave. Otherwise{" "}
                <Link href="/contact" className="text-brand-ink underline underline-offset-2">
                  tell us what happened
                </Link>
                .
              </>
            )}
          </p>
        </motion.div>
      )}
      </AnimatePresence>
      </motion.div>
    </GuideFigure>
  );
}
