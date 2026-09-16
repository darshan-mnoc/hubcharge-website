import type { Metadata } from "next";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import { CheckCircle2, XCircle, Zap, Clock, Smartphone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SessionCalculator } from "@/components/session-calculator";
import {
  VerifiedCompatibility,
  OperationalTrust,
} from "@/components/verified-compatibility";
import { stations, maxSessionMinutes } from "@/lib/stations";
import { CtaButton } from "@/components/ui/cta-button";

/* Every "up to four extensions" claim on this page now comes from the station
   record rather than being retyped. It was written by hand in five files. */
const SESSION = stations[0].session;

export const metadata: Metadata = {
  title: "Plan Your Charge — One Flat Rate | HubCharge",
  description:
    "One flat rate per charging session — no per-kWh math, no surprise fees, and no membership needed to charge. Your exact price is shown before you plug in at every HubCharge station.",
  alternates: { canonical: "https://hubcharge.com/plan-your-charge" },
};

const included = [
  `Your full charging session — a quick top-up adds roughly ${TEN_MINUTE_RANGE} miles in about 10 minutes*`,
  "Attendant service — we plug in and unplug for you*",
  "Pay right from your phone's browser — no app, no account required",
  `Need more? Extend in quick taps — up to ${SESSION.maxExtensions} times, for a stop of up to ${maxSessionMinutes(stations[0])} minutes`,
];

const neverCharged = [
  "Per-kWh math you have to calculate",
  "Unexpected final cost",
  "Time-of-use price spikes",
  "Congestion surcharges",
  "A membership before you can charge",
];

const PRICING_FAQS = [
  {
    q: "Is there a membership or subscription?",
    a: "No. Everyone pays the same flat rate — there is no member tier, no monthly fee and no commitment.",
  },
  {
    q: "When do I find out the price?",
    a: "Before you plug in. Your exact flat rate appears on your phone at the charger, and you approve it before the session starts.",
  },
  {
    q: "Will my charge price go up while I'm parked?",
    a: "No. The price you approve before you plug in is the price for the charge. At participating locations our attendant unplugs you, so there is nothing to race back for.",
  },
  {
    q: "Does the price change by time of day?",
    a: "No. There are no time-of-use spikes and no congestion surcharges.",
  },
  {
    q: "What if I need more range than 10 minutes gives me?",
    a: `Extend in quick taps, up to ${SESSION.maxExtensions} times per stop. A stop is the first ${SESSION.baseMinutes} minutes plus up to ${SESSION.maxExtensions} extensions of ${SESSION.extensionMinutes} minutes, so ${maxSessionMinutes(stations[0])} minutes is the longest single session.`,
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PlanYourChargePage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Plan Your Charge"
      tone="dark"
      /* No cover on purpose. With an aside the masthead is a 12-column grid
         about 480px tall, which pushed the calculator out of the first
         viewport — and the calculator is the reason to be on this page. With
         none, PageShell falls to its 760px single column. */
      title="Work out your charge"
      intro="Your car, your arrival charge, how long you stay — modelled from your car's own charging curve."
      primary={<SessionCalculator stations={stations} variant="hero" />}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="grid md:grid-cols-2 gap-8 mb-14 max-w-4xl">
        <div className="card-light p-8">
          <p className="flex items-center gap-2 text-brand-ink text-caption font-bold uppercase tracking-widest mb-4">
            <CheckCircle2 className="h-4 w-4" /> Included in your flat rate
          </p>
          <ul className="space-y-3">
            {included.map((line) => (
              <li key={line} className="flex items-start gap-3 text-ink-600 text-body-sm">
                <CheckCircle2 className="h-4 w-4 text-ok-on-dark mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-light p-8">
          <p className="flex items-center gap-2 text-ink-500 text-caption font-bold uppercase tracking-widest mb-4">
            <XCircle className="h-4 w-4" /> What you&apos;ll never see
          </p>
          <ul className="space-y-3">
            {neverCharged.map((line) => (
              <li key={line} className="flex items-start gap-3 text-ink-500 text-body-sm line-through decoration-ink-300">
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Numbered, on paper. This was a navy card sitting directly above the
          navy estimator — same #0A192F under two token names, 56px apart — so
          the two read as one slab and neither got any emphasis. The estimator
          keeps the dark treatment because it is the thing worth looking at. */}
      <div className="max-w-4xl mb-16">
        <h2 className="text-overline text-ink-500">How it works</h2>
        <span aria-hidden className="mt-3 mb-6 block h-px w-8 bg-brass" />
        <ol className="grid sm:grid-cols-3 gap-x-8 gap-y-6">
          {[
            {
              icon: Smartphone,
              title: "See your price first",
              desc: "Your exact flat rate is shown on your phone before you start — approve it, then charge.",
            },
            {
              icon: Zap,
              title: "Charge",
              desc: "A quick top-up takes about 10 minutes. Our attendant handles plugging in.*",
            },
            {
              icon: Clock,
              title: "Extend if you like",
              desc: `Want more range? Add time in quick taps — up to ${SESSION.maxExtensions} extensions of ${SESSION.extensionMinutes} minutes each.`,
            },
          ].map((step, i) => (
            <li key={step.title} className="border-t border-paper-300 pt-5">
              <span className="flex items-center gap-2.5 text-index text-ink-400">
                {String(i + 1).padStart(2, "0")}
                <step.icon aria-hidden className="h-4 w-4 text-brand-ink" />
              </span>
              <h3 className="text-h4 text-ink-900 mt-3 mb-1.5">{step.title}</h3>
              <p className="text-body-sm text-ink-500">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-20">
        <OperationalTrust
          stationCount={stations.length}
          hours={stations.map((s) => s.hours)}
          states={[...new Set(stations.map((s) => s.state))]}
        />
      </div>

      <div className="mb-20">
        <VerifiedCompatibility />
      </div>

      <section className="max-w-measure mb-20">
        <h2 className="text-overline text-ink-500 mb-5">Common questions</h2>
        {PRICING_FAQS.map((f) => (
          <details key={f.q} className="group border-t border-paper-300 last:border-b">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-h4 text-ink-900 hover:text-brand-ink transition-colors">
              {f.q}
              <span
                aria-hidden
                className="shrink-0 text-brand-ink text-xl leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-body-sm text-ink-500 pb-6 max-w-[62ch]">{f.a}</p>
          </details>
        ))}
      </section>

      <div id="price" className="max-w-measure scroll-mt-28">
        <h2 className="text-h3 text-ink-900 mb-3">
          Why don&rsquo;t we list a number here?
        </h2>
        <p className="text-ink-500 max-w-2xl mb-8">
          Rates can differ by station. Instead of publishing a number that
          might not match your hub, we show your exact flat rate on your phone
          at the charger — before you commit to anything. What we promise is
          the model: one flat price, known upfront, never a surprise on your
          card.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <CtaButton to="/locations" size="lg">
            Find your hub
          </CtaButton>
          <CtaButton to="/faq" size="lg" variant="secondary">
            Questions? See the FAQ
          </CtaButton>
        </div>
        <p className="text-caption text-ink-500 mt-8">
          Attendant service at select locations and hours. Added range varies
          by vehicle, battery state of charge, and temperature. Your total
          price is always disclosed before your session starts.
        </p>
      </div>
    </PageShell>
  );
}
