import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter } from "@/components/learn";
import { GlossaryIndex } from "@/components/glossary-index";

export const metadata: Metadata = {
  title: "EV Charging Glossary: kW, kWh, SOC, NACS & More | HubCharge",
  description:
    "Plain-English definitions of every EV charging term you'll run into: kW vs kWh, state of charge, DCFC, NACS, CCS, charging curve, preconditioning, idle fees, Plug & Charge, and more.",
  alternates: { canonical: "https://hubcharge.com/charging-101/glossary" },
};

const GROUPS = [
  { id: "power-and-energy", label: "Power and energy", terms: ["kW (kilowatt)", "kWh (kilowatt-hour)", "SOC (State of Charge)", "Range per hour"] },
  { id: "connectors", label: "Connectors", terms: ["NACS (SAE J3400)", "CCS (CCS1)", "J1772", "CHAdeMO"] },
  { id: "charging-behaviour", label: "Charging behaviour", terms: ["DCFC (DC Fast Charging)", "Charging curve", "Preconditioning", "800V architecture"] },
  { id: "paying-and-access", label: "Paying and access", terms: ["Idle fees", "Plug & Charge"] },
];

const terms: { term: string; def: string }[] = [
  {
    term: "kW (kilowatt)",
    def: "Power — how fast energy is flowing right now. Higher kW = faster charging. Our chargers deliver up to 180kW.",
  },
  {
    term: "kWh (kilowatt-hour)",
    def: "Energy — the amount delivered or stored. Battery sizes are in kWh (a typical EV holds 60–100 kWh), and per-kWh networks bill on it. Think: kW is speed, kWh is distance.",
  },
  {
    term: "SOC (State of Charge)",
    def: "Your battery's current level, as a percentage — the EV version of the fuel gauge.",
  },
  {
    term: "DCFC (DC Fast Charging)",
    def: "Level 3 charging. Feeds direct current straight to the battery, bypassing the car's slower onboard charger. What HubCharge does.",
  },
  {
    term: "NACS (SAE J3400)",
    def: "North American Charging Standard — the compact connector Tesla created, standardized by SAE in 2023. Most automakers are adopting it. Every HubCharge charger has a NACS cable.",
  },
  {
    term: "CCS (CCS1)",
    def: "Combined Charging System — the fast-charging connector most non-Tesla EVs have used for years: a J1772 plug with two DC pins beneath. Every HubCharge charger has a CCS cable too.",
  },
  {
    term: "J1772",
    def: "The standard North American connector for Level 1 and Level 2 AC charging — also the top half of a CCS plug.",
  },
  {
    term: "CHAdeMO",
    def: "An older fast-charging standard used mainly by the 2011–2025 Nissan Leaf; being phased out industry-wide. Our stations don't carry it.",
  },
  {
    term: "Charging curve",
    def: "How your charging speed changes across a session: ramps up, peaks around 20–60% battery, then tapers near full. It's why quick top-ups are time-efficient and charging to 100% at a fast charger isn't.",
  },
  {
    term: "Preconditioning",
    def: "Your car warming its battery before fast charging so it can accept full power. Usually automatic when you navigate to a charger in the car's own navigation — do this on the way to us.",
  },
  {
    term: "Idle fees",
    def: "Per-minute penalties many networks charge when a car stays plugged in after charging finishes. At participating HubCharge locations the attendant unplugs you, so there's nothing to race back for.",
  },
  {
    term: "Plug & Charge",
    def: "A standard (ISO 15118) where the car and charger authenticate automatically when you plug in — no card or app. HubCharge takes a different no-app route: everything runs in your phone's browser.",
  },
  {
    term: "Range per hour",
    def: "Miles of driving range added per hour of charging at a given power level — the most intuitive way to compare charging speeds.",
  },
  {
    term: "800V architecture",
    def: "A higher-voltage vehicle design (Hyundai Ioniq 5, Kia EV6, Porsche Taycan…) that can charge very quickly. These cars are among the fastest-charging at our stations.",
  },
];

export default function GlossaryPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      toc={[
        ["Power and energy", "#power-and-energy"],
        ["Connectors", "#connectors"],
        ["Charging behaviour", "#charging-behaviour"],
        ["Paying and access", "#paying-and-access"],
      ]}
      title="EV charging glossary"
      intro="Every term you'll actually run into, in plain English — no engineering degree required."
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Glossary", "/charging-101/glossary"],
        ]}
      />

      <GlossaryIndex terms={terms} groups={GROUPS} />

      <GuideFooter slug="glossary" />

      <GuideCta />
    </PageShell>
  );
}
