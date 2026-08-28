import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";
import { GlossaryIndex } from "@/components/glossary-index";
import { GLOSSARY_GROUPS, GLOSSARY_TERMS } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "EV Charging Glossary: kW, kWh, SOC, NACS & More | HubCharge",
  description:
    "Plain-English definitions of every EV charging term you'll run into: kW vs kWh, state of charge, DCFC, NACS, CCS, charging curve, preconditioning, idle fees, Plug & Charge, and more.",
  alternates: { canonical: "https://hubcharge.com/charging-101/glossary" },
};

export default function GlossaryPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      toc={GLOSSARY_GROUPS.map((g) => [g.label, `#${g.id}`] as [string, string])}
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

      <GuideShort slug="glossary" />

      <GlossaryIndex terms={GLOSSARY_TERMS} groups={GLOSSARY_GROUPS} />

      <GuideFooter slug="glossary" />

      <GuideCta />
    </PageShell>
  );
}
