import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MapPin, Clock, Navigation, ArrowUpRight, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";
import { stations } from "@/lib/stations";
import { stationStatus } from "@/lib/hours";
import { CONTACT_TOPICS } from "@/lib/contact-topics";

export const metadata: Metadata = {
  title: "Contact HubCharge | Alhambra & Fontana, CA",
  description:
    "Reach HubCharge: station addresses and phone numbers for Alhambra and Fontana, opening hours, and a contact form routed by what you need — charging problems, billing, hosting a site, accessibility or press.",
  alternates: { canonical: "https://hubcharge.com/contact" },
};

/**
 * Self-serve answers first.
 *
 * Most people arriving here have a question that already has an answer
 * somewhere on the site, and making them wait a business day for it is a poor
 * trade when the alternative is one link. The form is below, not above.
 */
const SELF_SERVE = [
  {
    q: "Something went wrong at a charger",
    a: "Session won't start, the car stopped early, the cable won't release — most of these clear in under a minute.",
    href: "/charging-101/charging-troubleshooting",
    cta: "Work through it",
  },
  {
    q: "Will my car charge here?",
    a: "Every station carries both NACS and CCS. Check your exact model and what it will draw.",
    href: "/charging-101/can-my-ev-charge-here",
    cta: "Check your car",
  },
  {
    q: "How does the pricing work?",
    a: "One flat rate per session, shown on your phone for approval before you plug in.",
    href: "/pricing",
    cta: "See how it works",
  },
  {
    q: "Where are you, and are you open?",
    a: "Two stations live in Southern California, with live status and directions.",
    href: "/locations",
    cta: "Find a station",
  },
];

export default function ContactPage() {
  /**
   * LocalBusiness structured data, one node per station. Fontana is omitted
   * from the address field rather than published wrong — a mismatched NAP
   * actively damages local search ranking, so an absent address is the safer
   * failure until the real one is confirmed.
   */
  const ld = {
    "@context": "https://schema.org",
    "@graph": stations.map((s) => ({
      "@type": "LocalBusiness",
      "@id": `https://hubcharge.com/locations/${s.slug}`,
      name: s.name,
      telephone: s.phoneE164,
      url: `https://hubcharge.com/locations/${s.slug}`,
      ...(s.zip
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: s.address,
              addressLocality: s.city,
              addressRegion: s.state,
              postalCode: s.zip,
              addressCountry: "US",
            },
          }
        : { areaServed: `${s.city}, ${s.state}` }),
      geo: { "@type": "GeoCoordinates", latitude: s.coords.lat, longitude: s.coords.lng },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        opens: s.hoursSchema.opens,
        closes: s.hoursSchema.closes,
      },
    })),
  };

  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Contact"
      title="Talk to us"
      intro="Most questions have an answer on this site already — those are first. If yours doesn't, the form routes by what you need so it reaches the right person."
      toc={[
        ["Quick answers", "#quick"],
        ["Stations", "#stations"],
        ["Send a message", "#form"],
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* ── Self-serve ─────────────────────────────────────────── */}
      <section id="quick" className="scroll-mt-28 mb-20">
        <p className="text-overline text-ink-500">Quick answers</p>
        <span aria-hidden className="mt-3 mb-6 block h-px w-8 bg-brass" />
        <ul className="grid sm:grid-cols-2 gap-x-8">
          {SELF_SERVE.map((s) => (
            <li key={s.q} className="border-t border-paper-300 py-5">
              <Link href={s.href} className="group block">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-h4 text-ink-900 group-hover:text-brand-ink transition-colors">
                    {s.q}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 mt-1 text-ink-400 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
                <span className="block text-body-sm text-ink-500 mt-1.5">{s.a}</span>
                <span className="block text-caption text-brand-ink mt-2">{s.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Stations (NAP) ─────────────────────────────────────── */}
      <section id="stations" className="scroll-mt-28 mb-20">
        <p className="text-overline text-ink-500">Our stations</p>
        <span aria-hidden className="mt-3 mb-6 block h-px w-8 bg-brass" />
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
          {stations.map((s) => {
            const status = stationStatus(s);
            const hasAddress = Boolean(s.zip);
            const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              hasAddress ? `${s.address}, ${s.city}, ${s.state} ${s.zip}` : `${s.name}, ${s.city}, ${s.state}`
            )}`;
            return (
              <div key={s.id} className="border-t border-paper-300 pt-5">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`h-2 w-2 rounded-full ${status.open ? "bg-ok-ink" : "bg-ink-300"}`}
                  />
                  <span className="text-caption text-ink-500">
                    {status.open ? "Open now" : "Closed"}
                  </span>
                </div>
                <h3 className="text-h3 text-ink-900 mt-2">{s.name.replace("™", "")}</h3>

                <dl className="mt-4 space-y-2.5 text-body-sm">
                  <div className="flex gap-2.5">
                    <dt className="sr-only">Address</dt>
                    <MapPin aria-hidden className="h-4 w-4 shrink-0 mt-0.5 text-ink-400" />
                    <dd className="text-ink-600">
                      {hasAddress ? (
                        <>
                          {s.address}
                          <br />
                          {s.city}, {s.state} {s.zip}
                        </>
                      ) : (
                        <span className="flex items-start gap-1.5 text-ink-500">
                          <span>
                            {s.city}, {s.state} — exact street address confirming.{" "}
                            <span className="text-ink-400">
                              We&rsquo;d rather leave it blank than publish one that sends you
                              to the wrong forecourt.
                            </span>
                          </span>
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2.5">
                    <dt className="sr-only">Phone</dt>
                    <Phone aria-hidden className="h-4 w-4 shrink-0 mt-0.5 text-ink-400" />
                    <dd>
                      <a href={`tel:${s.phoneE164}`} className="text-brand-ink hover:underline underline-offset-2">
                        {s.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2.5">
                    <dt className="sr-only">Hours</dt>
                    <Clock aria-hidden className="h-4 w-4 shrink-0 mt-0.5 text-ink-400" />
                    <dd className="text-ink-600">{s.hours}, daily</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-caption">
                  <a
                    href={maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-ink hover:underline underline-offset-2"
                  >
                    <Navigation aria-hidden className="h-3.5 w-3.5" />
                    Directions
                  </a>
                  <Link
                    href={`/locations/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-brand-ink hover:underline underline-offset-2"
                  >
                    Station details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Form ───────────────────────────────────────────────── */}
      <section id="form" className="scroll-mt-28 max-w-2xl">
        <p className="text-overline text-ink-500">Send a message</p>
        <span aria-hidden className="mt-3 mb-6 block h-px w-8 bg-brass" />
        <ContactForm />

        <p className="flex gap-2 text-caption text-ink-400 mt-7">
          <AlertCircle aria-hidden className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            If you&rsquo;re stuck at a charger right now, call rather than write —
            the response targets above are for written enquiries, and{" "}
            {CONTACT_TOPICS.charging.sla.toLowerCase()} is slower than a phone
            call during opening hours.
          </span>
        </p>
      </section>
    </PageShell>
  );
}
