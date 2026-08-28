import type { Metadata } from "next";
import { Term } from "@/components/term";
import { PageShell, Prose } from "@/components/page-shell";
import { ChargingLevelsCompare } from "@/components/charging-levels-compare";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";

export const metadata: Metadata = {
  title: "EV Charging Levels Explained: Level 1, Level 2 & DC Fast | HubCharge",
  description:
    "Level 1, Level 2, and DC fast charging explained with real numbers: how many miles per hour each adds, when to use each, and where HubCharge's up-to-180kW DC fast chargers fit.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/charging-levels",
  },
};

export default function ChargingLevelsPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      image="/images/home.webp"
      imageAlt="HubCharge DC fast chargers beneath a lit canopy"
      title="Charging levels, explained"
      intro="Level 1, Level 2, DC fast — the names sound technical, but the idea is simple: each level delivers power faster than the last."
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Charging levels", "/charging-101/charging-levels"],
        ]}
      />

      <GuideShort slug="charging-levels" />

      <p className="text-quote text-ink-900 max-w-[34ch] mb-8">
        The three levels aren&rsquo;t really about volts. They&rsquo;re about
        how much of your day charging takes.
      </p>

      <ChargingLevelsCompare />

      <Prose>
        <h2>So which one do I need?</h2>
        <p>
          Most EV life is Level 2 overnight, plus <Term id="dcfc">DC fast charging</Term> when
          you&rsquo;re out and about, on a trip, or just need miles{" "}
          <em>now</em>. That last case is what HubCharge is built for: pull
          in, add roughly 50–135 miles in about 10 minutes, and get on with your
          day — with an attendant handling the process at participating
          locations.
        </p>
        <p className="text-body-sm text-ink-400">
          Figures are typical ranges; actual speed varies by vehicle, battery
          <Term id="soc">state of charge</Term>, and temperature.
        </p>
      </Prose>

      <GuideFooter slug="charging-levels" />

      <GuideCta />
    </PageShell>
  );
}
