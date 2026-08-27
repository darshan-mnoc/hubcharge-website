"use client";

import { useState } from "react";
import { ExternalLink, Check, X, HelpCircle } from "lucide-react";
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
export const INCENTIVES_CHECKED = "August 2026";

type Answer = "yes" | "no" | "unsure";

type Programme = {
  id: string;
  name: string;
  body: string;
  url: string;
  what: string;
  relevant: (a: Record<string, Answer>) => boolean;
  note?: string;
};

const PROGRAMMES: Programme[] = [
  {
    id: "federal",
    name: "Federal clean vehicle credit",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after",
    what: "A credit against federal tax for qualifying new EVs, with caps on both your income and the vehicle's price. Assembly and battery-sourcing rules narrow the eligible list considerably, and it changes by model year.",
    relevant: (a) => a.buying !== "no",
    note: "The eligible-vehicle list is the part that moves most. Check it against your exact trim and delivery date, not the model name.",
  },
  {
    id: "federal-used",
    name: "Used clean vehicle credit",
    body: "IRS",
    url: "https://www.irs.gov/credits-deductions/used-clean-vehicle-credit",
    what: "A separate, smaller credit for qualifying used EVs bought from a dealer, with its own price and income limits.",
    relevant: (a) => a.buying !== "no" && a.used !== "no",
  },
  {
    id: "cvrp",
    name: "California vehicle incentives",
    body: "California Air Resources Board",
    url: "https://cleanvehiclerebate.org/",
    what: "California has run several purchase-side programmes with different names and eligibility over the years, some income-capped, some region-specific. What is open at any moment varies.",
    relevant: (a) => a.california !== "no",
    note: "Check what is currently accepting applications before you buy — these open and close.",
  },
  {
    id: "income",
    name: "Income-qualified replacement programmes",
    body: "California / regional air districts",
    url: "https://ww2.arb.ca.gov/our-work/programs/clean-cars-4-all",
    what: "Programmes that pay considerably more to scrap an older combustion car for a cleaner one, aimed at lower-income households. Run regionally, so the terms depend on your air district.",
    relevant: (a) => a.california !== "no" && a.income !== "no",
  },
  {
    id: "hov",
    name: "HOV lane access",
    body: "California DMV / CAV decal",
    url: "https://www.dmv.ca.gov/portal/vehicle-registration/license-plates-decals-and-placards/clean-air-vehicle-decals-hov-lanes/",
    what: "A decal allowing solo drivers into carpool lanes. In Los Angeles traffic this is often worth more per week than any one-off rebate.",
    relevant: (a) => a.california !== "no",
    note: "This programme has had legislated end dates before. Confirm the current status with the DMV.",
  },
  {
    id: "utility",
    name: "Utility rates and rebates",
    body: "Your electricity provider",
    url: "https://www.energy.ca.gov/programs-and-topics/topics/transportation",
    what: "Most California utilities offer EV-specific time-of-use rates, and some offer rebates towards home charger installation. If you can charge at home this is usually the largest recurring saving available.",
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
  const shown = PROGRAMMES.filter((p) => p.relevant(answers));

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
                <div role="radiogroup" aria-label={q} className="flex gap-1.5">
                  {(["yes", "no", "unsure"] as Answer[]).map((v) => {
                    const on = answers[id] === v;
                    return (
                      <button
                        key={v}
                        role="radio"
                        aria-checked={on}
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
            {shown.length} of {PROGRAMMES.length} programmes
            {answered > 0 ? " match what you've told us" : " — answer to narrow"}
          </p>
          <ul>
            {shown.map((p) => (
              <li key={p.id} className="py-4 border-t border-paper-300 last:border-b">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-baseline gap-1.5 text-h4 text-ink-900 hover:text-brand-ink transition-colors"
                >
                  {p.name}
                  <ExternalLink aria-hidden className="h-3.5 w-3.5 shrink-0 self-center opacity-50 group-hover:opacity-100" />
                </a>
                <p className="text-caption text-ink-400 mt-0.5">{p.body}</p>
                <p className="text-body-sm text-ink-500 mt-2">{p.what}</p>
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
