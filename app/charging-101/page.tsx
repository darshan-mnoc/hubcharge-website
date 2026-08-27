import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GuideCta } from "@/components/learn";
import { GUIDE_GROUPS, guides, guidesByGroup, guideHref } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Charging 101 — EV Charging Explained Simply | HubCharge",
  description:
    "Everything you need to know about EV charging: which cars are compatible, NACS vs CCS connectors, charging levels and speeds, what public charging costs, and a plain-English glossary.",
  alternates: { canonical: "https://hubcharge.com/charging-101" },
};

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

      {GUIDE_GROUPS.map((group, gi) => {
        const items = guidesByGroup(group.id);
        if (items.length === 0) return null;
        return (
          <section key={group.id} className={gi > 0 ? "mt-20" : ""}>
            <h2 className="text-overline text-ink-500">{group.label}</h2>
            <span aria-hidden className="mt-4 mb-6 block h-px w-8 bg-brass" />
            <ol className="max-w-measure">
              {items.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={guideHref(g.slug)}
                    className="group grid grid-cols-[3rem_1fr] md:grid-cols-[4rem_minmax(0,22ch)_minmax(0,1fr)_5rem] gap-x-6 items-baseline py-7 border-t border-paper-300 last:border-b hover:bg-paper-100 transition-colors"
                  >
                    <span className="text-index text-ink-400">
                      {String(guides.indexOf(g) + 1).padStart(2, "0")}
                    </span>
                    <span className="text-h4 text-ink-900 transition-transform group-hover:translate-x-1">
                      {g.navTitle ?? g.title}
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
        );
      })}

      <GuideCta />
    </PageShell>
  );
}
