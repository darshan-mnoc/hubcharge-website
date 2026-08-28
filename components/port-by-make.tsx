"use client";

import { GuideFigure } from "@/components/guide-figure";
import { evMakes, evModels, type PortStatus } from "@/lib/ev-models";

/**
 * Which plug each make uses, at a glance.
 *
 * The guide it sits on was a list of links and 237 words — the reader had to
 * open a make's page to learn the one thing they came for. Every fact here is
 * read from lib/ev-models.ts, including the counts and the "both" bucket, so
 * a manufacturer switching connector updates this picture rather than
 * silently contradicting it.
 *
 * Colour is doing real work, so it is never the only signal: each group is a
 * separately headed list with its own count, readable with colour off.
 */
const GROUPS: { id: PortStatus; title: string; plain: string; dot: string }[] = [
  {
    id: "ccs",
    title: "The bigger plug",
    plain: "Every model these makes sell here takes it.",
    dot: "bg-ink-400",
  },
  {
    id: "nacs",
    title: "The smaller plug",
    plain: "Every model these makes sell here takes it.",
    dot: "bg-brand",
  },
  {
    id: "transitioning",
    title: "Depends on the year",
    plain: "These makes are mid-switch, so check the car rather than the badge.",
    dot: "bg-brass",
  },
];

export function PortByMake() {
  const counts = {
    ccs: evModels.filter((m) => m.port === "ccs").length,
    nacs: evModels.filter((m) => m.port === "nacs").length,
  };
  const total = evModels.length;

  return (
    <GuideFigure
      eyebrow="Before you read further"
      title="Which plug does your car take?"
      footnote={
        <>
          Built from the {total} models we hold charging data for, so it moves
          when they do. Whichever group you are in, both cables hang on every
          HubCharge charger — this only decides which one you pick up.
        </>
      }
    >
      {/* Proportion first: most people are in one of two camps, and seeing the
          split is more reassuring than reading it. */}
      <div className="mb-6">
        <div
          role="img"
          aria-label={`Of ${total} car models, ${counts.ccs} take the bigger plug and ${counts.nacs} take the smaller one.`}
          className="flex h-2 overflow-hidden rounded-full bg-paper-200"
        >
          <span className="bg-ink-400" style={{ width: `${(counts.ccs / total) * 100}%` }} />
          <span className="bg-brand" style={{ width: `${(counts.nacs / total) * 100}%` }} />
        </div>
        <p className="mt-2.5 text-caption text-ink-500 tabular-nums">
          {counts.ccs} of {total} models take the bigger plug · {counts.nacs} take
          the smaller one
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {GROUPS.map((g) => {
          const makes = evMakes.filter((m) => m.port === g.id);
          if (!makes.length) return null;
          return (
            <div key={g.id}>
              <p className="flex items-center gap-2 text-body-sm font-semibold text-ink-900">
                <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${g.dot}`} />
                {g.title}
              </p>
              <p className="mt-1.5 text-caption text-ink-500">{g.plain}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {makes.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-full border border-paper-300 px-2.5 py-1 text-caption text-ink-600"
                  >
                    {m.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Stated flat, not behind a condition. This was gated on a count of
          models with the old plug, which is always zero — we do not list a car
          we cannot charge — so the one exclusion that matters never appeared
          on the one page about which plug you have. */}
      <p className="mt-6 border-t border-paper-300 pt-4 text-body-sm text-ink-500">
        One exception worth knowing: the 2011&ndash;2025 Nissan Leaf uses an
        older plug that is being retired across the industry. We do not carry
        that cable, so a Leaf of those years cannot fast-charge with us.
      </p>
    </GuideFigure>
  );
}
