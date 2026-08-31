import type { Metadata } from "next";
import { Term } from "@/components/term";
import Link from "next/link";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";
import { CostPerMile } from "@/components/cost-per-mile";
import { ReadingProgress } from "@/components/reading-progress";

export const metadata: Metadata = {
  title: "What Does EV Charging Cost? Public Charging Pricing Explained | HubCharge",
  description:
    "Per-kWh rates, per-minute billing, idle fees, memberships — how public EV charging pricing really works, and why HubCharge replaced all of it with one flat rate shown before you plug in.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/charging-cost",
  },
};

const SECTIONS: [string, string][] = [
  ["models", "Pricing models"],
  ["flat-rate", "Our flat rate"],
  ["fair-question", "Is it right for you?"],
  ["per-mile", "Cost per mile"],
];

export default function ChargingCostPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      image="/images/guide-cost-screen.webp"
      imageAlt="A HubCharge charger against a plain wall with a car connected, its screen showing the session details before charging starts."
      title="What does charging cost?"
      intro="Public charging pricing can be genuinely confusing. Here's how the industry's models work — and how we simplified ours."
    >
      <ReadingProgress sections={SECTIONS} />

      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Charging cost", "/charging-101/charging-cost"],
        ]}
      />

      <GuideShort slug="charging-cost" />

      <Prose>
        <h2 id="models">How most networks price charging</h2>
        <ul>
          <li>
            <strong>Per <Term id="kwh">kWh</Term></strong> — you pay for energy delivered, like a
            gas pump. Transparent in theory, but you need to know your
            car&rsquo;s efficiency to guess the final cost, and rates often
            change by time of day.
          </li>
          <li>
            <strong>Per minute</strong> — you pay for time plugged in. Fast
            cars win, slower cars pay more for the same miles.
          </li>
          <li>
            <strong>Memberships and tiers</strong> — many networks charge
            monthly fees for lower rates, so the price on the screen depends
            on which plan you carry.
          </li>
          <li>
            <strong>Idle fees</strong> — per-minute penalties if your car
            stays plugged in after charging finishes.
          </li>
          <li>
            <strong>Time-of-use spikes and surcharges</strong> — the same
            session can cost meaningfully more at 6 PM than at 6 AM.
          </li>
        </ul>
        <p>
          None of this is dishonest — but it does mean many drivers plug in
          without knowing what they&rsquo;ll pay.
        </p>

        <h2 id="per-mile">So what does a mile actually cost?</h2>
        <p>
          Per-<Term id="kw">kW</Term>h pricing is only meaningful once you divide it by your
          car&rsquo;s efficiency — which is the sum nobody does standing at a
          charger. Here it is, with your own rates:
        </p>

        <CostPerMile />

        <h2 id="flat-rate">The HubCharge model: one flat rate, known first</h2>
        <p>
          We charge a <strong>flat rate per session</strong>. Your exact
          price appears on your phone <em>before</em> you plug in — approve
          it, charge, done. No membership needed, no per-kWh math, no
          time-of-use surprises, no idle-fee anxiety: when your session ends,
          our attendant unplugs you at participating locations.
        </p>
        <p>
          Want more range? Extend in quick taps, up to 4 times per stop. The
          full model is on{" "}
          <Link href="/pricing">our pricing page</Link>.
        </p>

        <h2 id="fair-question">A fair question: is flat-rate right for everyone?</h2>
        <p>
          Honest answer: flat-rate is built for the quick top-up — our
          10-minute sweet-spot session. If you routinely need to charge a
          very large battery from near-empty to full, a per-kWh network may
          suit that trip better. For the everyday &ldquo;I need miles,
          now&rdquo; stop, knowing your price upfront is exactly the point.
        </p>
      </Prose>

      <GuideFooter slug="charging-cost" />

      <GuideCta headline="Know your price before you plug in." />
    </PageShell>
  );
}
