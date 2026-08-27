import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Zap, Plug } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta } from "@/components/learn";
import { CtaButton } from "@/components/ui/cta-button";
import { vehicleMakes, RANGE_FOOTNOTE, VEHICLE_DATA_UPDATED } from "@/lib/vehicles";
import { stations } from "@/lib/stations";

export function generateStaticParams() {
  return vehicleMakes.filter((m) => m.id !== "other").map((m) => ({ make: m.id }));
}

function getMake(id: string) {
  return vehicleMakes.find((m) => m.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ make: string }>;
}): Promise<Metadata> {
  const { make } = await params;
  const m = getMake(make);
  if (!m) return {};
  const title = `Charging a ${m.name} at HubCharge | Alhambra & Fontana, CA`;
  const description = `${m.name} charging at HubCharge: ${m.portNote} Roughly ${
    m.tenMinMilesApprox ? `${m.tenMinMilesApprox[0]}–${m.tenMinMilesApprox[1]} miles` : "range"
  } added in about ten minutes at our up-to-180kW chargers in Alhambra and Fontana.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://hubcharge.com/charging-101/vehicles/${m.id}`,
    },
    openGraph: { title, description, type: "article" },
  };
}

const PORT_LABEL = {
  nacs: "NACS",
  ccs: "CCS",
  transitioning: "NACS or CCS, by model year",
} as const;

export default async function VehicleGuide({
  params,
}: {
  params: Promise<{ make: string }>;
}) {
  const { make } = await params;
  const m = getMake(make);
  if (!m) {
    return (
      <PageShell
        eyebrow="Guides"
        backTo={{ href: "/charging-101/vehicles", label: "All makes" }}
        title="We don't have a page for that make yet"
        intro="If your EV fast-charges with a NACS or CCS port, it charges at HubCharge — that covers nearly every EV sold in the US."
      >
        <CtaButton to="/charging-101/can-my-ev-charge-here" size="lg">
          Check compatibility
        </CtaButton>
      </PageShell>
    );
  }

  const range = m.tenMinMilesApprox;

  return (
    <PageShell
      eyebrow="Your car"
      backTo={{ href: "/charging-101/vehicles", label: "All makes" }}
      title={`Charging a ${m.name} at HubCharge`}
      intro={m.portNote}
      meta={<><span>Updated {VEHICLE_DATA_UPDATED}</span><span>2 min read</span></>}
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Your car", "/charging-101/vehicles"],
          [m.name, `/charging-101/vehicles/${m.id}`],
        ]}
      />

      <div className="max-w-measure">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="border-t border-paper-300 pt-5">
            <p className="text-overline text-ink-500 flex items-center gap-2">
              <Plug aria-hidden className="h-3.5 w-3.5 text-ink-700" />
              Your port
            </p>
            <p className="text-h3 text-ink-900 mt-2">{PORT_LABEL[m.port]}</p>
            <p className="text-body-sm text-ink-500 mt-1">
              Both cables are on every charger, so you plug straight in.
            </p>
          </div>
          {range && (
            <div className="border-t border-paper-300 pt-5">
              <p className="text-overline text-ink-500 flex items-center gap-2">
                <Zap aria-hidden className="h-3.5 w-3.5 text-ink-700" />
                Ten minutes gets you
              </p>
              <p className="text-h3 text-ink-900 mt-2">
                ~{range[0]}–{range[1]} miles
              </p>
              <p className="text-body-sm text-ink-500 mt-1">
                At our up-to-180kW chargers.*
              </p>
            </div>
          )}
        </div>

        {m.note && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 mb-12 flex items-start gap-3">
            <AlertTriangle aria-hidden className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-body-sm text-ink-700">{m.note}</p>
          </div>
        )}

        <h2 className="text-h3 text-ink-900 mb-4">
          What a stop looks like in a {m.name.split(" / ")[0]}
        </h2>
        <ol className="mb-12">
          {[
            "Pull up to any open charger — no app, no reservation.",
            "At participating locations our attendant plugs you in; you stay in your seat.*",
            "Approve your flat rate on your phone, in the browser. Nothing to download.",
            range
              ? `About ten minutes later you're roughly ${range[0]}–${range[1]} miles better off.`
              : "About ten minutes later you're on your way.",
            "We unplug. You drive off. No idle fees to race back for.",
          ].map((step, i) => (
            <li
              key={step}
              className="grid grid-cols-[3rem_1fr] gap-x-4 py-4 border-t border-paper-300 last:border-b"
            >
              <span className="text-index text-ink-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-body text-ink-600">{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="text-h3 text-ink-900 mb-4">Where to charge your {m.name.split(" / ")[0]}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {stations.map((s) => (
            <Link
              key={s.id}
              href={`/locations/${s.slug}`}
              className="group border-t border-paper-300 pt-5 hover:border-ink-400 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-overline text-ink-400">
                <CheckCircle2 aria-hidden className="h-3 w-3 text-green-700" />
                {s.city}
              </span>
              <span className="block text-h4 text-ink-900 mt-2 group-hover:text-brand-ink transition-colors">
                {s.name.replace("™", "")}
              </span>
              <span className="block text-caption text-ink-400 mt-1">
                {s.connectors.join(" + ")} · {s.power}
              </span>
            </Link>
          ))}
        </div>

        <p className="text-body-sm text-ink-500 mb-2">
          Not the right make?{" "}
          <Link href="/charging-101/vehicles" className="text-brand-ink underline">
            See all makes
          </Link>{" "}
          or{" "}
          <Link href="/charging-101/connectors" className="text-brand-ink underline">
            read up on the two connectors
          </Link>
          .
        </p>
        <p className="text-[11px] text-ink-400 mt-6">*{RANGE_FOOTNOTE}</p>
      </div>

      <GuideCta headline={`Ready to charge your ${m.name.split(" / ")[0]}?`} />
    </PageShell>
  );
}
