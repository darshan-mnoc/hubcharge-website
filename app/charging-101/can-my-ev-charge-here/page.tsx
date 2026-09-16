import type { Metadata } from "next";
import { KitCover } from "@/components/kit-illustration";
import { Term } from "@/components/term";
import Link from "next/link";
import { AlertTriangle, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { VehicleFinder } from "@/components/vehicle-finder";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";

export const metadata: Metadata = {
  title: "Can My EV Charge at HubCharge? Tesla, Ford, Hyundai & More | HubCharge",
  description:
    "HubCharge stations have both NACS and CCS cables, so nearly every EV — Tesla, Ford, Hyundai, Kia, Rivian, BMW, Chevy and more — plugs straight in with no adapter. Check your make.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/can-my-ev-charge-here",
  },
};

export default function CompatibilityPage() {
  return (
    <PageShell
      backTo={{ href: "/charging-101", label: "All guides" }}
      eyebrow="Guides"
      cover={<KitCover name="hubcharge-no-adapter" />}
      title="Can my EV charge at HubCharge?"
      intro="Almost certainly yes. Every HubCharge charger carries both NACS and CCS cables — the two fast-charging connectors used by nearly every EV sold in the US. Just plug in the cable that matches your car. No adapter needed."
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Can my EV charge here?", "/charging-101/can-my-ev-charge-here"],
        ]}
      />

      <GuideShort slug="can-my-ev-charge-here" />

      {/* Headline claim */}
      <div className="card-light p-6 max-w-4xl mb-10 flex items-start gap-4">
        <Zap className="h-6 w-6 text-ink-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-ink-900 mb-1">
            Two connectors. No adapters. Nearly every EV.
          </p>
          <p className="text-ink-600 text-body-sm">
            Elsewhere, drivers often need a $200+ adapter to use a
            single-connector charger. At HubCharge you never do — whether your
            car has a <Term id="nacs">NACS</Term> port (like every Tesla) or a <Term id="ccs">CCS</Term> port (like most
            other EVs), the right cable is already on the charger. And at
            participating locations, our attendant plugs it in for you.
          </p>
        </div>
      </div>

      {/* Make-by-make grid */}
      <div className="max-w-4xl">
        <h2 className="text-h3 text-ink-900 mb-2">Check your car</h2>
        <p className="text-body-sm text-ink-500 mb-6">
          Search by model — every row shows the connector, the power that car will actually see here, and how long 10 to 80% takes.
        </p>
        <VehicleFinder />

        {/* Honest exception */}
        <div className="rounded-lg border border-note-line bg-note-surface p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-note-ink shrink-0 mt-0.5" />
          <div className="text-body-sm text-ink-700">
            <p className="font-semibold mb-1">
              One honest exception: CHAdeMO
            </p>
            <p>
              We carry CCS1 and NACS only. If your car fast-charges with the
              older <Term id="chademo">CHAdeMO</Term> connector, it
              can&rsquo;t DC fast-charge at HubCharge. The all-new 2026 Leaf
              switched to NACS and works great here. We&rsquo;d rather tell
              you before you drive over than after.
            </p>
          </div>
        </div>

        <p className="text-body-sm text-ink-600">
          Want the deeper story on the two connectors?{" "}
          <Link href="/charging-101/connectors" className="text-brand-ink underline">
            NACS vs CCS, explained →
          </Link>
        </p>
      </div>

      <GuideFooter slug="can-my-ev-charge-here" />

      <GuideCta headline="Your car works here. Come see how easy it is." />
    </PageShell>
  );
}
