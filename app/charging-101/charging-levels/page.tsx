import type { Metadata } from "next";
import { Home, Building2, Zap } from "lucide-react";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta } from "@/components/learn";

export const metadata: Metadata = {
  title: "EV Charging Levels Explained: Level 1, Level 2 & DC Fast | HubCharge",
  description:
    "Level 1, Level 2, and DC fast charging explained with real numbers: how many miles per hour each adds, when to use each, and where HubCharge's up-to-180kW DC fast chargers fit.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/charging-levels",
  },
};

const levels = [
  {
    icon: Home,
    name: "Level 1",
    spec: "120V household outlet · ~1.4–1.9 kW",
    adds: "~3–5 miles of range per hour",
    body: "The regular wall outlet. Fine for plug-in hybrids or very light daily driving — a full EV charge can take days. Best thought of as a trickle.",
  },
  {
    icon: Building2,
    name: "Level 2",
    spec: "240V · typically ~7–19 kW",
    adds: "~10–40 miles of range per hour",
    body: "Home wallboxes, workplaces, shopping centers. The overnight workhorse — most EV owners who can charge at home do most of their charging this way.",
  },
  {
    icon: Zap,
    name: "DC Fast Charging",
    spec: "Direct DC to the battery · 50–350+ kW",
    adds: "Can add 100+ miles in well under an hour",
    body: "Skips your car's onboard charger and feeds the battery directly. This is road-trip and quick-top-up charging — and it's what HubCharge does, at up to 180kW.",
    highlight: true,
  },
];

export default function ChargingLevelsPage() {
  return (
    <PageShell
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

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mb-12">
        {levels.map((l) => (
          <div
            key={l.name}
            className={`card-light p-6 ${
              l.highlight ? "ring-1 ring-brand/30 bg-brand/[0.03]" : ""
            }`}
          >
            <l.icon className="h-7 w-7 text-brand mb-4" />
            <h2 className="font-bold text-midnight-navy text-lg mb-1">
              {l.name}
            </h2>
            <p className="text-gray-400 text-xs mb-2">{l.spec}</p>
            <p className="text-brand font-semibold text-sm mb-3">{l.adds}</p>
            <p className="text-gray-600 text-sm">{l.body}</p>
          </div>
        ))}
      </div>

      <Prose>
        <h2>So which one do I need?</h2>
        <p>
          Most EV life is Level 2 overnight, plus DC fast charging when
          you&rsquo;re out and about, on a trip, or just need miles{" "}
          <em>now</em>. That last case is what HubCharge is built for: pull
          in, add up to 100 miles in about 10 minutes, and get on with your
          day — with an attendant handling the process at participating
          locations.
        </p>
        <p className="text-sm text-gray-400">
          Figures are typical ranges; actual speed varies by vehicle, battery
          state of charge, and temperature.
        </p>
      </Prose>

      <GuideCta />
    </PageShell>
  );
}
