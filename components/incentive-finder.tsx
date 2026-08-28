"use client";

import { useState } from "react";
import { ExternalLink, Check, X, HelpCircle, CircleSlash } from "lucide-react";
import { GuideFigure } from "@/components/guide-figure";

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
export const INCENTIVES_CHECKED = "27 August 2026";

type Answer = "yes" | "no" | "unsure";

type Programme = {
  id: string;
  name: string;
  body: string;
  url: string;
  what: string;
  relevant: (a: Record<string, Answer>) => boolean;
  note?: string;
  /**
   * Ended programmes stay on the page rather than being deleted.
   *
   * Someone searching "federal EV tax credit" needs to be told it ended and
   * when — finding nothing reads as a broken page and sends them to a blog
   * post that hasn't been updated either. `ended` carries the date so the
   * claim is checkable.
   */
  status: "live" | "ended";
  ended?: string;
};

const PROGRAMMES: Programme[] = [
  {
    id: "federal",
    name: "Federal clean vehicle credit (§30D)",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after",
    status: "ended",
    ended: "30 September 2025",
    what: "The federal credit against tax for a qualifying new EV. Terminated by the One Big Beautiful Bill Act in July 2025 for any vehicle acquired after 30 September 2025.",
    relevant: () => true,
    note: "The cut-off turns on when the vehicle was acquired, not when it was delivered — a binding written contract with a payment made on or before that date can still qualify. That is a question for your tax preparer, not for us.",
  },
  {
    id: "federal-used",
    name: "Used clean vehicle credit (§25E)",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/used-clean-vehicle-credit",
    status: "ended",
    ended: "30 September 2025",
    what: "The smaller credit for a qualifying used EV bought from a dealer. Ended on the same date and under the same law as the new-vehicle credit.",
    relevant: () => true,
  },
  {
    id: "cvrp",
    name: "Clean Vehicle Rebate Project (CVRP)",
    body: "California Air Resources Board",
    url: "https://ww2.arb.ca.gov/our-work/programs/clean-vehicle-rebate-project",
    status: "ended",
    ended: "late 2023",
    what: "California’s long-running purchase rebate, which put close to 600,000 clean vehicles on the road. Closed to new applications and not returning — the state has shifted its money toward income-qualified programmes instead.",
    relevant: (a) => a.california !== "no",
  },
  {
    id: "hov",
    name: "HOV lane access (Clean Air Vehicle decal)",
    body: "California DMV",
    url: "https://ww2.arb.ca.gov/end-californias-clean-air-vehicle-decal-program",
    status: "ended",
    ended: "1 October 2025",
    what: "Solo access to carpool lanes for zero-emission vehicles. The federal authority that let states run it lapsed on 30 September 2025; every decal expired the next day and the DMV had already stopped issuing them.",
    relevant: (a) => a.california !== "no",
    note: "California legislated an extension through 2027, but it needs federal approval under 23 U.S.C. §166 that has not been granted. If that changes, this comes back.",
  },
  {
    id: "ccfa",
    name: "Clean Cars 4 All",
    body: "California / regional air districts",
    url: "https://ww2.arb.ca.gov/our-work/programs/clean-cars-4-all",
    status: "live",
    what: "Pays substantially more than the old rebate did to scrap an older, higher-polluting car for a cleaner one. Run regionally, so the terms depend on your air district.",
    relevant: (a) => a.california !== "no" && a.income !== "no",
  },
  {
    id: "dcap",
    name: "Driving Clean Assistance Program (DCAP)",
    body: "California Air Resources Board",
    url: "https://ww2.arb.ca.gov/our-work/programs/driving-clean-assistance-program",
    status: "live",
    what: "The statewide programme that took over after CVRP closed. Aimed at first-time and lower-income buyers, and unlike Clean Cars 4 All it does not require scrapping an old car. Covers used EVs as well as new.",
    relevant: (a) => a.california !== "no" && a.income !== "no",
  },
  {
    id: "myfirstev",
    name: "MyFirstEV",
    body: "California",
    url: "https://ww2.arb.ca.gov/our-work/programs/driving-clean-assistance-program",
    status: "live",
    what: "An instant rebate applied at purchase rather than claimed later, launched in August 2026 and currently offered through a small number of manufacturers.",
    relevant: (a) => a.california !== "no" && a.buying !== "no",
    note: "New enough that participating brands are still changing. Confirm with the dealer before you count on it.",
  },
  {
    id: "utility",
    name: "Utility rates and charger rebates",
    body: "Your electricity provider",
    url: "https://www.energy.ca.gov/programs-and-topics/topics/transportation",
    status: "live",
    what: "Most California utilities run an EV-specific time-of-use rate, and some pay toward a home charger install. If you can charge where you park, this is usually the largest recurring saving on the list.",
    relevant: (a) => a.home !== "no",
  },
];

const QUESTIONS = [
  { id: "california", q: "Do you live in California?" },
  { id: "buying", q: "Are you buying or leasing a car soon?" },
  { id: "used", q: "Would you consider a used EV?" },
  { id: "home", q: "Can you charge where you park overnight?" },
  { id: "income", q: "Would you describe your household as income-qualified?" },
] as const;

export function IncentiveFinder() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const answered = Object.keys(answers).length;
  // Live first. An ended programme listed above a claimable one buries the
  // thing the reader can actually act on.
  const matching = PROGRAMMES.filter((p) => p.relevant(answers));
  const shown = [
    ...matching.filter((p) => p.status === "live"),
    ...matching.filter((p) => p.status === "ended"),
  ];
  const liveCount = matching.filter((p) => p.status === "live").length;

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
                        className={`rounded-full border px-3 py-1 text-caption capitalize transition-colors ${
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
            {shown.length - liveCount > 0 &&
              `, ${shown.length - liveCount} ended`}
            {answered > 0 ? " · matched to your answers" : " — answer to narrow"}
          </p>
          <ul>
            {shown.map((p) => (
              <li key={p.id} className="py-4 border-t border-paper-300 last:border-b">
                <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-baseline gap-1.5 text-h4 transition-colors ${
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GuideFigure>
  );
}
