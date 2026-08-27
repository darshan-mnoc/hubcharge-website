import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Zap,
  Clock,
  Phone,
  UserRound,
  Navigation,
  Coffee,
  Utensils,
  ShoppingBag,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CtaButton } from "@/components/ui/cta-button";
import { GuideBreadcrumb } from "@/components/learn";
import { NearbyPlaces } from "@/components/nearby-places";
import { PlanYourStop } from "@/components/plan-your-stop";
import { getNearbyPlaces } from "@/lib/places";
import { stationStatus } from "@/lib/hours";
import {
  stations,
  getStationBySlug,
  directionsUrl,
  mapEmbedUrl,
} from "@/lib/stations";

const stationImages: Record<string, string> = {
  alhambra: "/images/valet-greet-v2.webp",
  fontana: "/images/charging-service-v2.webp",
};

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
  const title = `DC Fast EV Charging in ${station.city}, CA | ${station.name}`;
  const description = `${station.name}: full-service DC fast charging (${station.power}, ${station.connectors.join(
    " & "
  )}) in ${station.city}, California. Attendant service, no app needed. Open daily ${station.hours}.`;
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
  const status = stationStatus(station);

  // Local-business structured data for this specific station
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `https://hubcharge.com/locations/${station.slug}`,
    name: station.name.replace("™", ""),
    description: `Full-service DC fast EV charging (up to ${station.maxKw}kW, ${station.connectors.join(
      " and "
    )} connectors) with attendant service in ${station.city}, California.`,
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
    openingHoursSpecification: {
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
    },
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
      image={stationImages[station.slug] ?? "/images/home.webp"}
      imageAlt={`The HubCharge station in ${station.city}, California`}
      meta={
        <>
          <span>Open daily, {station.hours}</span>
          <span>{station.connectors.join(" + ")}</span>
          <span>{station.power}</span>
        </>
      }
      title={`DC fast EV charging in ${station.city}, California`}
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
              <p className="text-overline text-ink-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                Address
              </p>
              <p className="text-ink-600 text-sm">
                {station.address}
                <br />
                {station.city}, {station.state} {station.zip}
              </p>
            </div>
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                Hours
              </p>
              <p className="text-ink-600 text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-700" /> Open daily,{" "}
                {station.hours}
              </p>
              <p
                className={`text-caption mt-1 ${
                  status.open ? "text-green-700" : "text-ink-400"
                }`}
              >
                {status.text}
              </p>
            </div>
            <div className="card-light p-4">
              <p className="text-overline text-ink-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                Charging
              </p>
              <p className="text-ink-600 text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-ink-700" />
                {station.chargers} DC fast charger
                {station.chargers > 1 ? "s" : ""} · {station.power}
              </p>
              <p className="text-ink-500 text-xs mt-1">
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
              <p className="text-overline text-ink-500 mb-1 text-xs uppercase tracking-wider font-semibold">
                Contact
              </p>
              <a
                href={`tel:${station.phoneE164}`}
                className="text-ink-600 text-sm flex items-center gap-2 hover:text-brand-ink"
              >
                <Phone className="h-4 w-4 text-ink-700" /> {station.phone}
              </a>
            </div>
          </div>

          {/* Full service explainer */}
          <div className="bg-hero rounded-lg p-6 lg:p-8 mb-8">
            <p className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest mb-3">
              <UserRound className="h-4 w-4" /> Full-service charging
            </p>
            <h3 className="text-white text-xl font-bold mb-3">
              Stay in your car — we handle it
            </h3>
            <ul className="space-y-2">
              {[
                "An attendant plugs in and unplugs for you*",
                "Pay right from your phone's browser — no app to download",
                "Flat-rate pricing, shown before you plug in",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-on-dark text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {station.note && (
            <p className="text-sm text-brand-ink font-medium mb-8">
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
              Get Directions
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
            <p className="text-ink-500 text-sm">
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
        <PlanYourStop station={station} />
      </div>

      <div className="mb-16">
        <NearbyPlaces places={places} />
      </div>

      <p className="text-xs text-ink-400 max-w-2xl">
        *Attendant availability varies by location and time. Actual charging
        speed and added range vary by vehicle, battery state of charge, and
        temperature.
      </p>
    </PageShell>
  );
}
