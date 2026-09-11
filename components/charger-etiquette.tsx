"use client";

import { GuideFigure } from "@/components/guide-figure";
import { guideSectionId } from "@/lib/guides";
import { Car, BatteryMedium, Unplug, Cable, Clock } from "lucide-react";

/**
 * The five rules, as five things you can take in without reading.
 *
 * Etiquette was the last guide on the site with no visual of any kind, and
 * it is the one most likely to be read in a hurry — somebody standing at a
 * charger wondering whether they are the problem. Prose is the wrong shape
 * for that; a set of rules you can scan in ten seconds is the right one.
 *
 * Each card links to its own section for the reasoning behind it.
 *
 * NO SECOND ILLUSTRATION HERE, ON PURPOSE. The obvious drawing for rule one
 * — bays in plan, one of them holding a car that has finished — is the exact
 * subject of the `bays` cover sitting a few hundred pixels above this, so it
 * would read as the same picture twice rather than as two facts. What this
 * figure was actually missing was arrival and affordance: five cards that
 * appeared all at once and gave nothing back when you pointed at them, in the
 * one guide most likely to be read standing at a charger. So it gets the
 * stagger and the hover, and the cover keeps the drawing.
 */
const RULES = [
  {
    heading: "Move when you're done",
    rule: "Move when you're done",
    why: "A finished car in a bay is the single most common complaint in public charging.",
    Icon: Car,
  },
  {
    heading: "Don't charge to 100% at a fast charger",
    rule: "Don't fill to the top",
    why: "The last stretch is the slowest. Take what you need and leave the bay free.",
    Icon: BatteryMedium,
  },
  {
    heading: "Never unplug someone else's car",
    rule: "Never unplug a stranger",
    why: "Most cars lock the cable anyway, and it is the fastest way to start a row.",
    Icon: Unplug,
  },
  {
    heading: "Leave the space as you found it",
    rule: "Rehang the cable",
    why: "Off the ground, back in its holster. The next driver arrives in the dark.",
    Icon: Cable,
  },
  {
    heading: "Queue politely, and be honest about time",
    rule: "Be honest about time",
    why: "If someone asks how long you'll be, tell them the real number.",
    Icon: Clock,
  },
] as const;

export function ChargerEtiquette() {
  return (
    <GuideFigure
      eyebrow="The whole thing"
      title="Five rules, and that is genuinely all of them"
      footnote="None of this is enforced anywhere. It holds because everyone at the charger is having the same day you are."
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RULES.map((r, i) => (
          <li key={r.rule} data-rise style={{ "--d": `${0.06 + i * 0.07}s` } as React.CSSProperties}>
            <a
              href={`#${guideSectionId(r.heading)}`}
              /* hc-tint rather than Tailwind's colour utility, which compiles
                 to cubic-bezier(0.4,0,0.2,1) — Material's curve, not ours, and
                 written by the compiler where the easing guard cannot see it. */
              className="hc-tint group flex h-full gap-3.5 rounded-lg border border-paper-300 p-4 hover:border-ink-300 hover:bg-paper-100"
            >
              <span
                aria-hidden
                className="hc-tint mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper-200 text-ink-600 group-hover:bg-brand group-hover:text-ink-900"
              >
                <r.Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-body-sm font-semibold text-ink-900">{r.rule}</span>
                <span className="mt-1 block text-caption leading-relaxed text-ink-500">
                  {r.why}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </GuideFigure>
  );
}
