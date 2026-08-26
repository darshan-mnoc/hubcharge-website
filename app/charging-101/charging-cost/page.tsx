import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta } from "@/components/learn";

export const metadata: Metadata = {
  title: "What Does EV Charging Cost? Public Charging Pricing Explained | HubCharge",
  description:
    "Per-kWh rates, per-minute billing, idle fees, memberships — how public EV charging pricing really works, and why HubCharge replaced all of it with one flat rate shown before you plug in.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/charging-cost",
  },
};

export default function ChargingCostPage() {
  return (
    <PageShell
      eyebrow="Guides"
      image="/images/valet-greet-v2.webp"
      imageAlt="A HubCharge attendant greeting a driver"
      title="What does charging cost?"
      intro="Public charging pricing can be genuinely confusing. Here's how the industry's models work — and how we simplified ours."
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Charging cost", "/charging-101/charging-cost"],
        ]}
      />

      <Prose>
        <h2>How most networks price charging</h2>
        <ul>
          <li>
            <strong>Per kWh</strong> — you pay for energy delivered, like a
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

        <h2>The HubCharge model: one flat rate, known first</h2>
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

        <h2>A fair question: is flat-rate right for everyone?</h2>
        <p>
          Honest answer: flat-rate is built for the quick top-up — our
          10-minute sweet-spot session. If you routinely need to charge a
          very large battery from near-empty to full, a per-kWh network may
          suit that trip better. For the everyday &ldquo;I need miles,
          now&rdquo; stop, knowing your price upfront is exactly the point.
        </p>
      </Prose>

      <GuideCta headline="Know your price before you plug in." />
    </PageShell>
  );
}
