import type { Metadata } from "next";
import { PortByMake } from "@/components/port-by-make";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";
import { evMakes, EV_DATA_UPDATED, RANGE_FOOTNOTE } from "@/lib/ev-models";
import { makeTenMinuteBand } from "@/lib/charging-math";

export const metadata: Metadata = {
  title: "EV Charging Guides by Make — Tesla, Ford, Rivian & More | HubCharge",
  description:
    "Make-by-make charging guides: which port your EV has, what plugs in at HubCharge, and roughly how far ten minutes gets you. Tesla, Ford, Rivian, Hyundai, BMW and more.",
  alternates: { canonical: "https://hubcharge.com/charging-101/vehicles" },
};

const PORT_SHORT = {
  nacs: "NACS",
  ccs: "CCS",
  transitioning: "NACS or CCS",
} as const;

export default function VehiclesIndex() {
  const makes = evMakes.filter((m) => m.id !== "other");

  return (
    <PageShell
      eyebrow="Your car"
      backTo={{ href: "/charging-101", label: "All guides" }}
      image="/images/charging-service-v2.webp"
      imageAlt="A charging cable seated in an electric car's charge port"
      title="Charging guides by make"
      intro="Every make below charges at HubCharge. Find yours for the specifics — which cable, how fast, and anything worth knowing."
      meta={<><span>Updated {EV_DATA_UPDATED}</span><span>{makes.length} makes</span></>}
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          ["Your car", "/charging-101/vehicles"],
        ]}
      />

      <GuideShort slug="vehicles" />

      <PortByMake />

      <ol className="max-w-measure">
        {makes.map((m, i) => {
          const band = makeTenMinuteBand(m.id);
          return (
          <li key={m.id}>
            <Link
              href={`/charging-101/vehicles/${m.id}`}
              className="group grid grid-cols-[3rem_1fr] lg:grid-cols-[4rem_minmax(0,24ch)_minmax(0,1fr)_8rem] gap-x-6 items-baseline py-6 border-t border-paper-300 last:border-b hover:bg-paper-100 transition-colors"
            >
              <span className="text-index text-ink-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-h4 text-ink-900 transition-transform group-hover:translate-x-1">
                {m.name}
              </span>
              <span className="col-span-2 lg:col-span-1 text-body-sm text-ink-500 mt-2 lg:mt-0">
                {PORT_SHORT[m.port]}
                {band && ` · ~${band[0]}–${band[1]} mi in 10 min`}
              </span>
              <span className="hidden lg:flex items-baseline justify-end gap-2 text-caption text-ink-400">
                Guide
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-ink-900" />
              </span>
            </Link>
          </li>
          );
        })}
      </ol>

      <p className="text-footnote text-ink-400 mt-8 max-w-[70ch]">{RANGE_FOOTNOTE}</p>

      <GuideFooter slug="vehicles" />
      <GuideCta />
    </PageShell>
  );
}
