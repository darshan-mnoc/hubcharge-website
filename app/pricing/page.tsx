import type { Metadata } from "next";
import { CheckCircle2, XCircle, Zap, Clock, Smartphone } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { PlanYourStop } from "@/components/plan-your-stop";
import {
  VerifiedCompatibility,
  OperationalTrust,
} from "@/components/verified-compatibility";
import { stations } from "@/lib/stations";
import { CtaButton } from "@/components/ui/cta-button";

export const metadata: Metadata = {
  title: "Flat-Rate EV Charging Pricing | HubCharge",
  description:
    "One flat rate per charging session — no per-kWh math, no surprise fees, no membership required. Your exact price is shown before you plug in at every HubCharge station.",
  alternates: { canonical: "https://hubcharge.com/pricing" },
};

const included = [
  "Your full charging session — a quick top-up adds up to 100 miles in about 10 minutes*",
  "Attendant service — we plug in and unplug for you*",
  "Pay right from your phone's browser — no app, no account required",
  "Need more? Extend your session in quick taps, up to 4 times",
];

const neverCharged = [
  "Per-kWh math you have to calculate",
  "Unexpected final cost",
  "Time-of-use price spikes",
  "Congestion surcharges",
  "Membership or subscription fees",
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
    q: "Are there idle fees?",
    a: "No. At participating locations our attendant unplugs you, so there is nothing to race back for.",
  },
  {
    q: "Does the price change by time of day?",
    a: "No. There are no time-of-use spikes and no congestion surcharges.",
  },
  {
    q: "What if I need more range than one session gives me?",
    a: "Extend in quick taps, up to four times per stop.",
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

export default function PricingPage() {
  const station = stations[0];
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Pricing"
      tone="dark"
      image="/images/coffee-delivery-v3.webp"
      imageAlt="A driver waiting comfortably in their car while it charges"
      title="One flat rate. No surprises."
      intro="You always know exactly what you'll pay before you plug in — that's the whole point."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="grid md:grid-cols-2 gap-8 mb-14 max-w-4xl">
        <div className="card-light p-8">
          <p className="flex items-center gap-2 text-brand-ink text-xs font-bold uppercase tracking-widest mb-4">
            <CheckCircle2 className="h-4 w-4" /> Included in your flat rate
          </p>
          <ul className="space-y-3">
            {included.map((line) => (
              <li key={line} className="flex items-start gap-3 text-ink-600 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-light p-8">
          <p className="flex items-center gap-2 text-ink-500 text-xs font-bold uppercase tracking-widest mb-4">
            <XCircle className="h-4 w-4" /> What you&apos;ll never see
          </p>
          <ul className="space-y-3">
            {neverCharged.map((line) => (
              <li key={line} className="flex items-start gap-3 text-ink-500 text-sm line-through decoration-gray-300">
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-hero rounded-lg p-8 lg:p-10 max-w-4xl mb-14">
        <h2 className="text-white text-xl lg:text-2xl font-bold mb-6">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
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
              desc: "Want more range? Add time in quick taps — up to 4 extensions per stop.",
            },
          ].map((step) => (
            <div key={step.title}>
              <step.icon className="h-6 w-6 text-brand mb-3" />
              <h3 className="text-white font-semibold mb-1.5">{step.title}</h3>
              <p className="text-on-dark/80 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-20">
        <PlanYourStop station={station} />
      </div>

      <div className="mb-20">
        <OperationalTrust stationCount={stations.length} hours={station.hours} />
      </div>

      <div className="mb-20">
        <VerifiedCompatibility />
      </div>

      <section className="max-w-measure mb-20">
        <p className="text-overline text-ink-500">Common questions</p>
        <span aria-hidden className="mt-4 mb-6 block h-px w-8 bg-brass" />
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

      <div className="max-w-measure">
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
            Pricing questions? See the FAQ
          </CtaButton>
        </div>
        <p className="text-xs text-ink-500 mt-8">
          *Attendant service at select locations and hours. Added range varies
          by vehicle, battery state of charge, and temperature. Your total
          price is always disclosed before your session starts.
        </p>
      </div>
    </PageShell>
  );
}
