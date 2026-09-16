import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Coffee,
  Navigation,
  Phone,
  ShoppingBag,
  Smartphone,
  UserRound,
  Utensils,
  Zap,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CtaButton } from "@/components/ui/cta-button";
import { GuideBreadcrumb } from "@/components/learn";
import { NearbyPlaces } from "@/components/nearby-places";
import { SessionCalculator } from "@/components/session-calculator";
import { StationAccess } from "@/components/station-access";
import { accessFor } from "@/lib/station-access";
import { getService } from "@/lib/services";
import { getNearbyPlaces } from "@/lib/places";
import { stationStatus } from "@/lib/hours";
import {
  stations,
  getStationBySlug,
  directionsUrl,
  mapEmbedUrl,
  STATE_NAMES,
} from "@/lib/stations";

export function generateStaticParams() {
  return stations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) return {};
  /* State from the record, not the string "CA". Every one of these read
     "…, CA | …" and "…, California." regardless of where the site actually
     is, which was fine for exactly as long as every site was in one state. */
  const stateName = STATE_NAMES[station.state] ?? station.state;
  const soon = station.status === "coming-soon";
  const title = soon
    ? `HubCharge is coming to ${station.city}, ${station.state}`
    : `DC Fast EV Charging in ${station.city}, ${station.state} | ${station.name}`;
  const description = soon
    ? `${station.name} is opening soon at ${station.address}, ${station.city}, ${stateName}. Full-service DC fast charging, ${station.power}, ${station.connectors.join(" & ")}.`
    : `${station.name}: full-service DC fast charging (${station.power}, ${station.connectors.join(
        " & "
      )}) in ${station.city}, ${stateName}. Attendant service, no app needed. Open daily ${station.hours}.`;
  return {
    title,
    description,
    alternates: { canonical: `https://hubcharge.com/locations/${station.slug}` },
    openGraph: {
      title,
      description,
      url: `https://hubcharge.com/locations/${station.slug}`,
      type: "website",
    },
  };
}

export default async function StationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const station = getStationBySlug(slug);
  if (!station) notFound();

  const places = await getNearbyPlaces(station);
  const access = accessFor(station.id);
  const status = stationStatus(station);
  const soon = station.status === "coming-soon";
  const stateName = STATE_NAMES[station.state] ?? station.state;

  // Local-business structured data for this specific station
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `https://hubcharge.com/locations/${station.slug}`,
    name: station.name.replace("™", ""),
    description: `Full-service DC fast EV charging (up to ${station.maxKw}kW, ${station.connectors.join(
      " and "
    )} connectors) with attendant service in ${station.city}, ${stateName}.`,
    url: `https://hubcharge.com/locations/${station.slug}`,
    telephone: station.phoneE164,
    priceRange: "$$",
    image: "https://hubcharge.com/images/hubcharge-logo.webp",
    address: {
      "@type": "PostalAddress",
      streetAddress: station.address,
      addressLocality: station.city,
      addressRegion: station.state,
      ...(station.zip ? { postalCode: station.zip } : {}),
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: station.coords.lat,
      longitude: station.coords.lng,
    },
    /* A site that has not opened has no opening hours, and publishing them
       tells Google it can send someone there today. */
    ...(soon ? {} : { openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: station.hoursSchema.opens,
      closes: station.hoursSchema.closes,
    } }),
    parentOrganization: {
      "@type": "Organization",
      name: "HubCharge (Micronoc Inc.)",
      url: "https://hubcharge.com",
    },
  };

  return (
    <PageShell
      backTo={{ href: "/locations", label: "All locations" }}
      eyebrow={station.city}
      /* A site with nothing built yet has nothing to photograph. PageShell's
         image is optional; passing photos[0] unconditionally threw the moment
         a station shipped with an empty array. */
      image={station.photos[0]?.src}
      imageAlt={station.photos[0]?.alt}
      meta={
        <>
          <span>
            {station.status === "coming-soon"
              ? "Opening soon"
              : `Open daily, ${station.hours}`}
          </span>
          <span>{station.connectors.join(" + ")}</span>
          <span>{station.power}</span>
        </>
      }
      title={
        station.status === "coming-soon"
          ? `HubCharge is coming to ${station.city}`
          : `DC fast EV charging in ${station.city}, ${STATE_NAMES[station.state] ?? station.state}`
      }
      intro={station.blurb}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Locations", "/locations"],
          [station.city, `/locations/${station.slug}`],
        ]}
      />

      <div className="grid lg:grid-cols-5 gap-10 mb-16">
        {/* Left: details */}
        <div className="lg:col-span-3">
          <h2 className="text-h3 text-ink-900 mb-4">{station.name}</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-caption uppercase tracking-wider font-semibold">
                Address
              </p>
              <p className="text-ink-600 text-body-sm">
                {station.address}
                <br />
                {station.city}, {station.state} {station.zip}
              </p>
            </div>
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-caption uppercase tracking-wider font-semibold">
                Hours
              </p>
              <p className="text-ink-600 text-body-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-700" />
                {soon ? "Hours to be confirmed" : `Open daily, ${station.hours}`}
              </p>
              {/* stationStatus answers "is it open right now", which is not a
                  question a site without a ribbon cut can be asked. */}
              <p
                className={`text-caption mt-1 ${
                  !soon && status.open ? "text-ok-ink" : "text-ink-400"
                }`}
              >
                {soon ? "Opening soon" : status.text}
              </p>
            </div>
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-caption uppercase tracking-wider font-semibold">
                Charging
              </p>
              <p className="text-ink-600 text-body-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-ink-700" />
                {station.chargers} DC fast charger
                {station.chargers > 1 ? "s" : ""} · {station.power}
              </p>
              <p className="text-ink-500 text-caption mt-1">
                Connectors: {station.connectors.join(" + ")} — works with
                Tesla, BMW, Ford, Rivian, Hyundai, Kia &amp; more.{" "}
                <Link
                  href="/charging-101/can-my-ev-charge-here"
                  className="text-brand-ink underline"
                >
                  Check your EV
                </Link>
              </p>
            </div>
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-caption uppercase tracking-wider font-semibold">
                Contact
              </p>
              <a
                href={`tel:${station.phoneE164}`}
                className="text-ink-600 text-body-sm flex items-center gap-2 hover:text-brand-ink"
              >
                <Phone className="h-4 w-4 text-ink-700" /> {station.phone}
              </a>
            </div>
          </div>

          {/* Where the address's unanswered questions land: an address and a
              map are enough for a forecourt, not for a stall inside a parking
              structure. Renders nothing when we do not know. */}
          {access && <StationAccess station={station} access={access} />}

          {/* The rest of the photographs. A station page that shows the site
              once and then describes it in prose is asking to be trusted; a
              page that shows the equipment, the connectors and the bay is
              letting you check. These are the real units, not renders. */}
          {station.photos.length > 1 && (
            <div className="mb-8">
              <p className="text-overline text-ink-500 mb-4">At this station</p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {station.photos.slice(1).map((photo) => (
                  <li key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, 220px"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What this station can do for you.
              This block used to assert the same three bullets on every page,
              including Round Rock, which has no building on it yet — so the
              attendant line is now gated on the station's own flag, and the
              hedge comes from lib/services.ts rather than being retyped. */}
          <div className="bg-ink-900 rounded-lg p-6 lg:p-8 mb-8">
            <p className="flex items-center gap-2 text-brand text-caption font-bold uppercase tracking-widest mb-3">
              <UserRound className="h-4 w-4" />
              {soon
                ? "What this station will offer"
                : station.hasAttendant
                  ? "Full-service charging"
                  : "How charging works here"}
            </p>
            <h3 className="text-h3 text-white mb-3">
              {soon
                ? "Planned for this site"
                : station.hasAttendant
                  ? "Stay in your car — we handle it"
                  : "Self-serve, and nothing to download"}
            </h3>
            <ul className="space-y-2">
              {[
                /* A site with nothing built on it cannot be described in the
                   present tense. The record says hasAttendant for Round Rock,
                   which is a statement of intent rather than of fact, so the
                   attendant line and the self-serve line take the tense of the
                   station's status. The other two are true of the product
                   rather than of the site, and do not move. */
                station.hasAttendant &&
                  (soon
                    ? "An attendant will plug in and unplug for you*"
                    : access?.attendantHours
                      ? `An attendant plugs in and unplugs for you, ${access.attendantHours}`
                      : "An attendant plugs in and unplugs for you*"),
                "Pay right from your phone's browser — no app to download",
                "Flat-rate pricing, shown before you plug in",
                soon
                  ? "Self-serve whenever the station is open"
                  : "Every charger is self-serve capable, whenever the station is open",
              ]
                .filter(Boolean)
                .map((line) => (
                  <li
                    key={line as string}
                    className="flex items-start gap-2 text-on-dark text-body-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                    {line}
                  </li>
                ))}
            </ul>
            {/* Lifestyle services are not bookable yet anywhere. Saying so
                here, next to what the station can do today, is the split. */}
            <p className="mt-4 text-caption text-on-dark/55">
              {getService("coffee")?.caveat} Food, coffee and errands brought to
              your car are not available yet.
            </p>
          </div>

          {station.note && (
            <p className="text-body-sm text-brand-ink font-medium mb-8">
              {station.note}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <CtaButton
              href={directionsUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              <Navigation className="h-5 w-5" />
              Get directions
              <span className="sr-only"> (opens in a new tab)</span>
            </CtaButton>
            <CtaButton to="/what-to-expect" size="lg" variant="secondary">
              First visit? See what to expect
            </CtaButton>
          </div>
        </div>

        {/* Right: map + nearby */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden border border-paper-300 h-72">
            <iframe
              title={`Map of ${station.name}`}
              src={mapEmbedUrl(station)}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="card-light p-6">
            <p className="flex items-center gap-2 font-bold text-ink-900 mb-2">
              <Smartphone className="h-4 w-4 text-ink-700" /> No app needed
            </p>
            <p className="text-ink-500 text-body-sm">
              Tap your phone or scan the code at the charger — HubCharge runs
              right in your browser.{" "}
              <Link href="/faq" className="text-brand-ink underline">
                See how it works
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        {/* one site here — you are already on its page, so no picker */}
        <SessionCalculator stations={[station]} variant="section" />
      </div>

      {/* Demoted to a closing note. This was ten rows in three columns, the
          widest block on the page, and it sat where a driver needed to know
          which level the charger was on. */}
      <div className="mb-12">
        <NearbyPlaces places={places} variant="compact" />
      </div>

      <p className="text-caption text-ink-400 max-w-2xl">
        *Attendant availability varies by location and time. Actual charging
        speed and added range vary by vehicle, battery state of charge, and
        temperature.
      </p>
    </PageShell>
  );
}
