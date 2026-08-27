import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell, Prose } from "@/components/page-shell";
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

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mb-12">
        {[
          {
            img: "/images/NACS.png",
            name: "NACS",
            sub: "North American Charging Standard (SAE J3400)",
            body: "Originally Tesla's connector, standardized by SAE in 2023. Compact, one port for both AC and DC charging. Every Tesla uses it, and most automakers are switching their new models to it.",
          },
          {
            img: "/images/CCS.png",
            name: "CCS",
            sub: "Combined Charging System (CCS1)",
            body: "The plug most non-Tesla EVs have used for years — the J1772 AC connector plus two DC pins below it. Ford, VW, Honda, Volvo and many current models still use it.",
          },
        ].map((c) => (
          <div key={c.name} className="card-light p-6 text-center">
            <div className="relative h-24 mb-4">
              <Image
                src={c.img}
                alt={`${c.name} connector`}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <h2 className="font-bold text-ink-900 text-lg">{c.name}</h2>
            <p className="text-ink-500 text-xs mb-3">{c.sub}</p>
            <p className="text-ink-600 text-sm text-left">{c.body}</p>
          </div>
        ))}
      </div>

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
