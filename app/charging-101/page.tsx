import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideCta } from "@/components/learn";

export const metadata: Metadata = {
  title: "Charging 101 — EV Charging Explained Simply | HubCharge",
  description:
    "Everything you need to know about EV charging: which cars are compatible, NACS vs CCS connectors, charging levels and speeds, what public charging costs, and a plain-English glossary.",
  alternates: { canonical: "https://hubcharge.com/charging-101" },
};

/** Grouped 2 + 3 + 1 — six equal-weight items read as interchangeable;
 *  grouping does real IA work and breaks the "list of things" symmetry. */
const GROUPS: {
  label: string;
  guides: { href: string; n: string; title: string; desc: string; read: string; note?: string }[];
}[] = [
  {
    label: "Before you charge",
    guides: [
      {
        href: "/charging-101/can-my-ev-charge-here",
        n: "01",
        title: "Can my EV charge here?",
        desc: "Make-by-make compatibility — Tesla, Ford, Hyundai, Rivian and more. Almost certainly yes, with no adapter.",
        read: "4 min",
        note: "Start here.",
      },
      {
        href: "/charging-101/connectors",
        n: "02",
        title: "NACS vs CCS connectors",
        desc: "The two fast-charging plugs in America, explained — and why we carry both.",
        read: "3 min",
      },
    ],
  },
  {
    label: "How charging works",
    guides: [
      {
        href: "/charging-101/charging-levels",
        n: "03",
        title: "Charging levels explained",
        desc: "Level 1, Level 2 and DC fast charging — what the numbers actually mean.",
        read: "3 min",
      },
      {
        href: "/charging-101/charging-speed",
        n: "04",
        title: "How long does charging take?",
        desc: "The charging curve, the 20–60% sweet spot, and why a ten-minute top-up is usually the smart move.",
        read: "5 min",
      },
      {
        href: "/charging-101/charging-cost",
        n: "05",
        title: "What does charging cost?",
        desc: "Per-kWh, per-minute, idle fees, memberships — how public charging pricing works, and how we simplified it.",
        read: "4 min",
      },
    ],
  },
  {
    label: "Reference",
    guides: [
      {
        href: "/charging-101/glossary",
        n: "06",
        title: "EV charging glossary",
        desc: "kW vs kWh, state of charge, preconditioning, Plug & Charge — every term, in plain English.",
        read: "6 min",
      },
    ],
  },
];

export default function Charging101Page() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Guides"
      image="/images/valet-greet-v2.webp"
      imageAlt="A HubCharge attendant greeting a driver at the charger"
      title="Charging 101"
      intro="New to EVs, or just want straight answers? Everything about charging, in plain English — no jargon, no sales pitch."
    >
      <p className="text-quote text-ink-900 max-w-[34ch] mb-16">
        Nobody should need a manual to plug in a car. But if you want one,
        here it is.
      </p>

      {GROUPS.map((group, gi) => (
        <section key={group.label} className={gi > 0 ? "mt-20" : ""}>
          <h2 className="text-overline text-ink-500">{group.label}</h2>
          <span aria-hidden className="mt-4 mb-6 block h-px w-8 bg-brass" />
          <ol className="max-w-measure">
            {group.guides.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="group grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_minmax(0,22ch)_minmax(0,1fr)_5rem] gap-x-6 items-baseline py-7 border-t border-paper-300 last:border-b hover:bg-paper-100 transition-colors"
                >
                  <span className="text-index text-ink-400">{g.n}</span>
                  <span className="text-h4 text-ink-900 transition-transform group-hover:translate-x-1">
                    {g.title}
                    {g.note && (
                      <span className="block text-caption text-brand-ink mt-1">
                        {g.note}
                      </span>
                    )}
                  </span>
                  <span className="col-span-2 md:col-span-1 text-body-sm text-ink-500 mt-2 md:mt-0">
                    {g.desc}
                  </span>
                  <span className="hidden md:flex items-baseline justify-end gap-2 text-caption text-ink-400">
                    {g.read}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-ink-900" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <GuideCta />
    </PageShell>
  );
}
