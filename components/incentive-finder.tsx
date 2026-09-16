"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NO_MOTION, SPRING_LAYOUT } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useState } from "react";
import { ExternalLink, Check, X, HelpCircle, CircleSlash, Clock } from "lucide-react";
import { GuideFigure } from "@/components/guide-figure";
import {
  INCENTIVES_CHECKED,
  QUESTIONS,
  matchingProgrammes,
  type Answer,
} from "@/lib/incentives";
import { STATE_NAMES } from "@/lib/stations";

/* California first, because that is where the open sites are — the same
   ordering rule statesWithCoverage() uses. "Somewhere else" is appended by
   the control rather than listed here. */
const STATE_ORDER = ["CA", "TX"];

/**
 * Incentive eligibility, without asserting amounts.
 *
 * Programme values, income caps and vehicle eligibility lists change often
 * enough that any figure printed here would be wrong within a year — and a
 * stale dollar amount on a charging company's website is worse than no amount,
 * because someone plans a purchase around it.
 *
 * So this routes rather than quotes: it tells you which programmes are worth
 * your time given your situation, and links each to the body that administers
 * it. Every claim is a link, and the page carries the date it was checked.
 */
export function IncentiveFinder() {
  /* A STATE, NOT A YES/NO ABOUT ONE STATE.
     This asked "Do you live in California?" and five of the eight programmes
     tested that one answer, so the page could only ever describe one state
     and a Texan who answered honestly was shown two ended federal credits and
     nothing else. Where you live is not a boolean. */
  const [state, setState] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  /* Object.keys counted a key whose value had been cleared to undefined, so
     de-selecting an answer still counted as answered. */
  const answered = Object.values(answers).filter(Boolean).length + (state ? 1 : 0);
  const shown = matchingProgrammes(state, answers);
  const liveCount = shown.filter((p) => p.status === "live").length;
  const closedCount = shown.filter((p) => p.status === "closed").length;

  const reduced = useReducedMotion();

  return (
    <GuideFigure
      eyebrow="Worth your time?"
      title="Which programmes apply to you"
      footnote={
        <>
          No amounts are printed here on purpose. Values, income caps and
          eligible-vehicle lists change often enough that a figure on this page
          would mislead somebody planning a purchase around it. Every programme
          links to the body that administers it — that is the number of record.
          Eligibility logic last reviewed {INCENTIVES_CHECKED}. This is not tax
          advice.
        </>
      }
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-12">
        <div>
          <p className="text-caption text-ink-500 mb-4">
            Answer what you can — the list narrows as you go.
          </p>
          <div className="mb-5">
            <p className="text-body-sm text-ink-900 mb-2">Where do you live?</p>
            <div role="group" aria-label="Where do you live?" className="flex flex-wrap gap-1.5">
              {[...STATE_ORDER, null].map((code) => {
                const on = state === code;
                return (
                  <button
                    key={code ?? "elsewhere"}
                    aria-pressed={on}
                    onClick={() => setState(on ? null : code)}
                    className={`rounded-full border px-3 py-1 text-caption hc-tint ${
                      on
                        ? "border-brand bg-brand text-ink-900"
                        : "border-paper-300 text-ink-600 hover:border-ink-300"
                    }`}
                  >
                    {code ? STATE_NAMES[code] : "Somewhere else"}
                  </button>
                );
              })}
            </div>
            {state === null && (
              <p className="text-footnote text-ink-400 mt-2">
                Everything below applies wherever you are until you pick a
                state.
              </p>
            )}
          </div>
          <ul className="space-y-4">
            {QUESTIONS.map(({ id, q }) => (
              <li key={id}>
                <p className="text-body-sm text-ink-900 mb-2">{q}</p>
                <div role="group" aria-label={q} className="flex gap-1.5">
                  {(["yes", "no", "unsure"] as Answer[]).map((v) => {
                    const on = answers[id] === v;
                    return (
                      <button
                        key={v}
                        aria-pressed={on}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [id]: prev[id] === v ? undefined! : v }))
                        }
                        className={`rounded-full border px-3 py-1 text-caption capitalize hc-tint ${
                          on
                            ? "border-brand bg-brand text-ink-900"
                            : "border-paper-300 text-ink-600 hover:border-ink-300"
                        }`}
                      >
                        {v === "yes" ? <Check aria-hidden className="inline h-3 w-3 mr-1" /> : v === "no" ? <X aria-hidden className="inline h-3 w-3 mr-1" /> : <HelpCircle aria-hidden className="inline h-3 w-3 mr-1" />}
                        {v}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p aria-live="polite" className="text-caption text-ink-400 mb-3">
            {liveCount} open {liveCount === 1 ? "programme" : "programmes"}
            {closedCount > 0 && `, ${closedCount} between rounds`}
            {shown.length - liveCount - closedCount > 0 &&
              `, ${shown.length - liveCount - closedCount} ended`}
            {answered > 0 ? " · matched to your answers" : " — answer to narrow"}
          </p>
          <ul>
            {/* Answering a question re-filters and re-sorts this list. It used
                to happen in one frame, so a reader could not tell whether their
                answer had removed a programme or simply moved it. layout is the
                right tool here and the only place in the set it is used: these
                items only translate vertically, so there is no scale distortion
                on the text to counter. */}
            <AnimatePresence initial={false}>
            {shown.map((p) => (
              <motion.li
                key={p.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                /* THE EXIT HAS TO TAKE THE PADDING WITH IT.
                   This animated marginTop and marginBottom, which are already
                   zero — so those two channels did nothing — while `py-4` and
                   the top border stayed put. Under border-box, height: 0 sets
                   the CONTENT box to zero and leaves 16px + 16px + 1px behind,
                   so a filtered-out programme collapsed to a 33px empty stripe
                   and then vanished. The reader saw a gap appear where a row
                   had been, which is the opposite of the thing this animation
                   exists to communicate. */
                exit={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderTopWidth: 0,
                      }
                }
                transition={reduced ? NO_MOTION : SPRING_LAYOUT}
                className="py-4 border-t border-paper-300 last:border-b overflow-hidden"
              >
                <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-baseline gap-1.5 text-h4 hc-tint ${
                      p.status === "ended"
                        ? "text-ink-500 hover:text-ink-900"
                        : "text-ink-900 hover:text-brand-ink"
                    }`}
                  >
                    {p.name}
                    <ExternalLink aria-hidden className="h-3.5 w-3.5 shrink-0 self-center opacity-50 group-hover:opacity-100" />
                        <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  {p.status === "ended" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-paper-200 px-2 py-0.5 text-caption text-ink-600">
                      <CircleSlash aria-hidden className="h-3 w-3" />
                      Ended {p.ended}
                    </span>
                  )}
                  {/* A different badge, because it is a different fact. Ended
                      means do not wait for it; closed means wait for it. */}
                  {p.status === "closed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brass/15 px-2 py-0.5 text-caption text-brass-ink">
                      <Clock aria-hidden className="h-3 w-3" />
                      Closed between rounds
                    </span>
                  )}
                </span>
                <p className="text-caption text-ink-400 mt-0.5">{p.body}</p>
                <p className={`text-body-sm mt-2 ${p.status === "ended" ? "text-ink-400" : "text-ink-500"}`}>
                  {p.what}
                </p>
                {p.note && (
                  <p className="text-body-sm text-ink-700 mt-2 border-l-2 border-brass pl-3">
                    {p.note}
                  </p>
                )}
              </motion.li>
            ))}
                      </AnimatePresence>
          </ul>
        </div>
      </div>
    </GuideFigure>
  );
}
