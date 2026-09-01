import type { Metadata } from "next";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import { Term } from "@/components/term";
import Link from "next/link";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";
import { ChargingCurveChart } from "@/components/charging-curve-chart";
import { ReadingProgress } from "@/components/reading-progress";
import { RANGE_FOOTNOTE } from "@/lib/ev-models";

export const metadata: Metadata = {
  title: "How Long Does EV Charging Take? The Charging Curve | HubCharge",
  description:
    "Why EV charging speed changes during a session, the 20–60% sweet spot, battery preconditioning, and why a 10-minute top-up is usually smarter than charging to full.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/charging-speed",
  },
};

const SECTIONS: [string, string][] = [
  ["curve", "It's a curve"],
  ["top-up", "Why top-ups win"],
  ["factors", "What sets your speed"],
  ["preconditioning", "Preconditioning"],
  ["headline-numbers", "Headline numbers"],
];

export default function ChargingSpeedPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      image="/images/guide-speed-connector.webp"
      imageAlt="A charging cable seated and locked into the port of a white electric car at a roadside charger."
      title="How long does charging take?"
      intro="Honest answer: it depends — but in a predictable way. Understand the charging curve and you'll charge smarter than most EV owners."
    >
      <ReadingProgress sections={SECTIONS} />

      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Charging speed", "/charging-101/charging-speed"],
        ]}
      />

      <GuideShort slug="charging-speed" />

      <Prose>
        <h2 id="curve">Charging isn&rsquo;t a straight line — it&rsquo;s a curve</h2>
        <p>
          A battery doesn&rsquo;t accept power at one constant rate. Speed
          ramps up from a low <Term id="soc">state of charge</Term>, peaks somewhere in the{" "}
          <strong>20–60% window</strong>, then tapers — the last 20% of a
          charge can take as long as the first 60–70%. That&rsquo;s your
          car&rsquo;s battery management system protecting the cells, and
          it&rsquo;s the same on every fast-charging network.
        </p>

        <ChargingCurveChart />

        <h2 id="top-up">Which is why the quick top-up wins</h2>
        <p>
          Because the curve is fastest in the middle, the smartest use of a <Term id="dcfc">DC
          fast charger</Term> is usually a short session in that sweet spot — grab
          the miles you need and go. That&rsquo;s exactly how HubCharge is
          designed: a ~10-minute top-up that adds roughly {TEN_MINUTE_RANGE} miles for most
          popular EVs, with quick extensions if you want more. Charging to
          100% at a fast charger is almost never worth the time.
        </p>

        <h2 id="factors">What actually determines your speed</h2>
        <ul>
          <li>
            <strong>Your car&rsquo;s maximum charging rate</strong> — every
            model has its own ceiling; a charger can never exceed it.
          </li>
          <li>
            <strong>Battery state of charge</strong> — lower is faster (the
            curve again).
          </li>
          <li>
            <strong>Battery temperature</strong> — a cold pack can charge at
            roughly half its normal rate.
          </li>
          <li>
            <strong>Vehicle size and efficiency</strong> — a big electric
            truck adds miles more slowly than an efficient sedan, even at the
            same <Term id="kw">kW</Term>.
          </li>
        </ul>

        <h2 id="preconditioning">The one trick worth knowing: <Term id="preconditioning">preconditioning</Term></h2>
        <p>
          Most EVs warm their battery automatically when you{" "}
          <strong>navigate to a fast charger in the car&rsquo;s own
          navigation</strong>. Do that on your way to HubCharge and
          you&rsquo;ll often charge meaningfully faster — it&rsquo;s the
          single biggest thing you control.
        </p>

        <h2 id="headline-numbers">Beware the headline numbers</h2>
        <p>
          You&rsquo;ll see claims like &ldquo;200 miles in 10 minutes&rdquo;
          in car ads. Those usually assume 350kW+ chargers and perfect
          conditions. We&rsquo;d rather set honest expectations: at our
          up-to-180kW chargers, many popular EVs add{" "}
          <strong>roughly {TEN_MINUTE_RANGE} miles in about 10 minutes</strong>, and some
          vehicles charge more slowly. Check{" "}
          <Link href="/charging-101/can-my-ev-charge-here">
            your make&rsquo;s approximate figures
          </Link>
          .
        </p>
        <p className="text-body-sm text-ink-500">{RANGE_FOOTNOTE}</p>
      </Prose>

      <GuideFooter slug="charging-speed" />

      <GuideCta headline="Ten good minutes beats an hour of waiting." />
    </PageShell>
  );
}
