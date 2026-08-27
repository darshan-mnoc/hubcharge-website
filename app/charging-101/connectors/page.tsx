import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Prose } from "@/components/page-shell";
import { ConnectorDiagram } from "@/components/connector-diagram";
import { GuideBreadcrumb, GuideCta, GuideFooter } from "@/components/learn";

export const metadata: Metadata = {
  title: "NACS vs CCS: EV Charging Connectors Explained | HubCharge",
  description:
    "The two DC fast-charging connectors in America — NACS (the Tesla plug, now SAE J3400) and CCS — explained in plain English, plus why HubCharge chargers carry both cables.",
  alternates: { canonical: "https://hubcharge.com/charging-101/connectors" },
};

export default function ConnectorsPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      image="/images/charging-service-v2.webp"
      imageAlt="A charging cable connected to an electric car"
      title="NACS vs CCS, explained"
      intro="America's EV world runs on two fast-charging plugs. Here's what they are, which cars use which — and why at HubCharge it doesn't matter."
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Connectors", "/charging-101/connectors"],
        ]}
      />

      <ConnectorDiagram />

      <Prose>
        <h2>Why HubCharge carries both cables</h2>
        <p>
          The industry is mid-transition from CCS to NACS, and it will take
          years. Rather than make you buy a $200+ adapter or hunt for the
          right charger, every HubCharge charger has <strong>both</strong> a
          NACS cable and a CCS cable. You plug in whichever matches your car
          — or at participating locations, our attendant does it for you.
        </p>

        <h2>About adapters (you won&rsquo;t need one here)</h2>
        <p>
          Two different adapters exist, and both get called &ldquo;the Tesla
          adapter,&rdquo; which causes confusion:
        </p>
        <ul>
          <li>
            <strong>CCS car → NACS charger:</strong> lets a CCS-port car (most
            Fords, VWs, Hondas…) use a NACS-only charger, like a Tesla
            Supercharger.
          </li>
          <li>
            <strong>NACS car → CCS charger:</strong> lets a Tesla or other
            NACS-port car use a CCS-only charger.
          </li>
        </ul>
        <p>
          Adapters matter at single-connector networks. At HubCharge, both
          cables are on the charger — so leave the adapter in the trunk.
        </p>

        <h2>What about CHAdeMO?</h2>
        <p>
          CHAdeMO is the older fast-charging standard used mainly by the
          2011–2025 Nissan Leaf. It&rsquo;s being phased out industry-wide,
          and our stations don&rsquo;t carry it — so those Leaf model years
          can&rsquo;t DC fast-charge here (the all-new 2026 Leaf uses NACS
          and works great). More in{" "}
          <Link href="/charging-101/can-my-ev-charge-here">
            our compatibility guide
          </Link>
          .
        </p>
      </Prose>

      <GuideFooter slug="connectors" />

      <GuideCta />
    </PageShell>
  );
}
