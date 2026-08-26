import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  Plug,
  Gauge,
  Timer,
  DollarSign,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideCta } from "@/components/learn";

export const metadata: Metadata = {
  title: "Charging 101 — EV Charging Explained Simply | HubCharge",
  description:
    "Everything you need to know about EV charging: which cars are compatible, NACS vs CCS connectors, charging levels and speeds, what public charging costs, and a plain-English glossary.",
  alternates: { canonical: "https://hubcharge.com/charging-101" },
};

const guides = [
  {
    href: "/charging-101/can-my-ev-charge-here",
    icon: Car,
    title: "Can my EV charge here?",
    desc: "Make-by-make compatibility — Tesla, Ford, Hyundai, Rivian & more. Spoiler: almost certainly yes, with no adapter.",
    highlight: true,
  },
  {
    href: "/charging-101/connectors",
    icon: Plug,
    title: "NACS vs CCS connectors",
    desc: "The two fast-charging plugs in America, explained — and why we carry both.",
  },
  {
    href: "/charging-101/charging-levels",
    icon: Gauge,
    title: "Charging levels explained",
    desc: "Level 1, Level 2, and DC fast charging — what the numbers actually mean.",
  },
  {
    href: "/charging-101/charging-speed",
    icon: Timer,
    title: "How long does charging take?",
    desc: "The charging curve, the 20–60% sweet spot, and why a 10-minute top-up is usually the smart move.",
  },
  {
    href: "/charging-101/charging-cost",
    icon: DollarSign,
    title: "What does charging cost?",
    desc: "Per-kWh, per-minute, idle fees, memberships — how public charging pricing works, and how we simplified it.",
  },
  {
    href: "/charging-101/glossary",
    icon: BookOpen,
    title: "EV charging glossary",
    desc: "kW vs kWh, SOC, preconditioning, Plug & Charge — every term, in plain English.",
  },
];

export default function Charging101Page() {
  return (
    <PageShell
      title="Charging 101"
      intro="New to EVs, or just want straight answers? Everything about charging, in plain English — no jargon, no sales pitch."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className={`card-light p-6 group block ${
              g.highlight ? "ring-1 ring-brand/30 bg-brand/[0.03]" : ""
            }`}
          >
            <g.icon className="h-7 w-7 text-brand mb-4" />
            <h2 className="font-bold text-midnight-navy mb-2 group-hover:text-brand transition-colors">
              {g.title}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{g.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm">
              Read the guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
      <GuideCta />
    </PageShell>
  );
}
