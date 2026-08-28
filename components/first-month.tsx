"use client";

import { Plug, House, TrendingDown, Zap, Check } from "lucide-react";
import { GuideFigure } from "@/components/guide-figure";
import { guideSectionId } from "@/lib/guides";

/**
 * The first month with an EV, as a path rather than five headings.
 *
 * This is the guide a nervous new owner lands on, and it was five blocks of
 * prose with no picture at all — the reader could not see how much was ahead
 * of them or that it ends. A shape they can take in at a glance does more for
 * that anxiety than another paragraph.
 *
 * Each stop links to its own section, so it doubles as the contents.
 *
 * The headings are duplicated from GUIDE_BODIES.new-ev-owner because that
 * lives in a server file of JSX. They are the link targets, so if one changes
 * there the anchor here dies quietly — the test in the commit checks every
 * href resolves to a real section id on the rendered page.
 */
const STEPS = [
  {
    phase: "Week one",
    heading: "Week one: find out what plug you have",
    label: "Find your plug",
    plain: "Open the flap and look. It is one of two shapes, and we carry both.",
    Icon: Plug,
  },
  {
    phase: "Week one",
    heading: "Week one: sort out where you charge most nights",
    label: "Sort out most nights",
    plain: "Home, work or a regular stop nearby. Pick the easy one and make it the default.",
    Icon: House,
  },
  {
    phase: "Week two",
    heading: "Week two: learn the curve",
    label: "Learn the rhythm",
    plain: "Charging is fast when the battery is low and slow when it is nearly full.",
    Icon: TrendingDown,
  },
  {
    phase: "Week two",
    heading: "Week two: try one fast-charging stop deliberately",
    label: "Do one on purpose",
    plain: "Once, with time to spare, so the first real one is not the first one.",
    Icon: Zap,
  },
  {
    phase: "Month one",
    heading: "Month one: stop thinking about it",
    label: "Stop thinking about it",
    plain: "This is the actual destination. Most people get here and never look back.",
    Icon: Check,
  },
] as const;

export function FirstMonth() {
  return (
    <GuideFigure
      eyebrow="The shape of it"
      title="What the first month actually looks like"
      footnote="Five things, in the order they matter. Tap any of them to jump to it."
    >
      <ol className="relative grid gap-5 sm:grid-cols-5 sm:gap-3">
        {/* The through-line. Horizontal on a wide screen, vertical stacked. */}
        <span
          aria-hidden
          className="absolute left-[15px] top-2 bottom-2 w-px bg-paper-300
            sm:left-0 sm:right-0 sm:top-[15px] sm:bottom-auto sm:h-px sm:w-auto"
        />
        {STEPS.map((s, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={s.heading} className="relative flex gap-4 sm:block">
              <span
                aria-hidden
                className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full
                  ${last ? "bg-brand text-ink-900" : "bg-paper-200 text-ink-600"}`}
              >
                <s.Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0 sm:mt-3 sm:pr-3">
                <p className="text-overline text-ink-400">{s.phase}</p>
                <a
                  href={`#${guideSectionId(s.heading)}`}
                  className="mt-1 block text-body-sm font-semibold text-ink-900 hover:text-brand-ink"
                >
                  {s.label}
                </a>
                <p className="mt-1.5 text-caption leading-relaxed text-ink-500">{s.plain}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </GuideFigure>
  );
}
