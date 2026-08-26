import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta } from "@/components/learn";
import {
  vehicleMakes,
  RANGE_FOOTNOTE,
  VEHICLE_DATA_UPDATED,
} from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Can My EV Charge at HubCharge? Tesla, Ford, Hyundai & More | HubCharge",
  description:
    "HubCharge stations have both NACS and CCS cables, so nearly every EV — Tesla, Ford, Hyundai, Kia, Rivian, BMW, Chevy and more — plugs straight in with no adapter. Check your make.",
  alternates: {
    canonical: "https://hubcharge.com/charging-101/can-my-ev-charge-here",
  },
};

const portLabel = {
  nacs: "NACS port",
  ccs: "CCS port",
  transitioning: "NACS or CCS (varies by model year)",
} as const;

export default function CompatibilityPage() {
  return (
    <PageShell
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

      {/* Headline claim */}
      <div className="card-light p-6 max-w-4xl mb-10 flex items-start gap-4">
        <Zap className="h-6 w-6 text-brand shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-midnight-navy mb-1">
            Two connectors. No adapters. Nearly every EV.
          </p>
          <p className="text-gray-600 text-sm">
            Elsewhere, drivers often need a $200+ adapter to use a
            single-connector charger. At HubCharge you never do — whether your
            car has a NACS port (like every Tesla) or a CCS port (like most
            other EVs), the right cable is already on the charger. And at
            participating locations, our attendant plugs it in for you.
          </p>
        </div>
      </div>

      {/* Make-by-make grid */}
      <div className="max-w-4xl">
        <h2 className="text-h3 text-midnight-navy mb-2">Check your make</h2>
        <p className="text-gray-500 text-sm mb-6">
          Last updated: {VEHICLE_DATA_UPDATED}. Approximate added range is for
          a ~10-minute session.*
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {vehicleMakes.map((m) => (
            <div key={m.id} className="card-light p-5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-bold text-midnight-navy">{m.name}</h3>
                <span className="shrink-0 inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Charges here
                </span>
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">
                {portLabel[m.port]}
              </p>
              <p className="text-gray-600 text-sm mb-3">{m.portNote}</p>
              {m.tenMinMilesApprox && (
                <p className="text-sm">
                  <span className="text-brand font-bold">
                    ~{m.tenMinMilesApprox[0]}–{m.tenMinMilesApprox[1]} miles
                  </span>{" "}
                  <span className="text-gray-400">added in ~10 min*</span>
                </p>
              )}
              {m.note && (
                <p className="text-gray-500 text-xs mt-2 border-t border-gray-100 pt-2">
                  {m.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Honest exception */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 mb-8 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">
              One honest exception: older Nissan Leaf (2011–2025)
            </p>
            <p>
              Those model years fast-charge only with the older CHAdeMO
              connector, which our stations don&rsquo;t carry — so they
              can&rsquo;t DC fast-charge at HubCharge. The all-new 2026 Leaf
              switched to NACS and works great here. We&rsquo;d rather tell
              you before you drive over than after.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-2">*{RANGE_FOOTNOTE}</p>
        <p className="text-sm text-gray-600">
          Want the deeper story on the two connectors?{" "}
          <Link href="/charging-101/connectors" className="text-brand underline">
            NACS vs CCS, explained →
          </Link>
        </p>
      </div>

      <GuideCta headline="Your car works here. Come see how easy it is." />
    </PageShell>
  );
}
