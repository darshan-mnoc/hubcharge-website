"use client";

import { GuideFigure } from "@/components/guide-figure";
import { House, MapPin } from "lucide-react";

/**
 * Home charging against public charging, on the things people actually decide
 * on. The guide's own last section is called "The honest comparison" and was
 * a wall of prose; this is that section as something you can scan.
 *
 * Deliberately not a winner-takes-all table. The guide's position is that if
 * you can charge where you sleep you should, and that an EV works fine if you
 * cannot — a scorecard with a tick column would flatten exactly that.
 *
 * No costs appear. What a home install runs to varies by house by thousands,
 * and our own rate belongs on the pricing page, not in a comparison graphic.
 */
const ROWS: { q: string; home: string; out: string }[] = [
  {
    q: "When it happens",
    home: "While you sleep. You are not present for it.",
    out: "In a gap you already had — a shop, a meal, a coffee.",
  },
  {
    q: "How long you wait",
    home: "Nothing. You plug in and walk away.",
    out: "Minutes, not hours. Long enough to do the thing you stopped for.",
  },
  {
    q: "What it takes to set up",
    home: "An electrician, a permit, and somewhere to park that is yours.",
    out: "Nothing. Turn up.",
  },
  {
    q: "What it costs to run",
    home: "Your household electricity rate — usually the cheapest option there is.",
    out: "More per mile than home, less than petrol for most drivers.",
  },
  {
    q: "How often you think about it",
    home: "Almost never, after the first fortnight.",
    out: "Once or twice a week, and it becomes routine fast.",
  },
  {
    q: "Who it suits",
    home: "Anyone with a driveway, garage or an assigned space they can wire.",
    out: "Renters, street parkers, flat dwellers, and anyone doing a long day.",
  },
];

export function HomeVsPublic() {
  return (
    <GuideFigure
      eyebrow="Side by side"
      title="What each one is actually like"
      footnote="Most people end up doing both — mostly at home, topping up out when a day runs long. The two are not rivals so much as a default and a backstop."
    >
      <dl className="grid gap-px overflow-hidden rounded-lg bg-paper-300">
        <div className="grid bg-paper sm:grid-cols-[minmax(0,13rem)_1fr_1fr] sm:items-end">
          <span className="hidden sm:block" />
          {[
            { Icon: House, label: "Charging where you sleep" },
            { Icon: MapPin, label: "Charging out and about" },
          ].map((h) => (
            <p
              key={h.label}
              className="flex items-center gap-2 px-4 pb-3 pt-4 text-body-sm font-semibold text-ink-900"
            >
              <h.Icon aria-hidden className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={2} />
              {h.label}
            </p>
          ))}
        </div>

        {ROWS.map((r) => (
          <div key={r.q} className="grid gap-y-1 bg-paper p-4 sm:grid-cols-[minmax(0,13rem)_1fr_1fr] sm:gap-x-0">
            <dt className="text-caption text-ink-400 sm:pr-6 sm:pt-0.5">{r.q}</dt>
            {/* The label repeats on mobile because the column header scrolls
                away once the grid stacks, and "Nothing. Turn up." with no
                heading above it means nothing at all. */}
            <dd className="text-body-sm text-ink-700 sm:pr-6">
              <span className="mt-2 block text-caption font-semibold text-ink-500 sm:hidden">
                At home
              </span>
              {r.home}
            </dd>
            <dd className="text-body-sm text-ink-700">
              <span className="mt-2 block text-caption font-semibold text-ink-500 sm:hidden">
                Out and about
              </span>
              {r.out}
            </dd>
          </div>
        ))}
      </dl>
    </GuideFigure>
  );
}
