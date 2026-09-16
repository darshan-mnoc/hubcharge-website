import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Zap, Clock, ArrowRight, UserRound } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { statesWithCoverage, stations, upcomingLocations } from "@/lib/stations";

export const metadata: Metadata = {
  title: "EV Charging Locations in California | HubCharge",
  description:
    "Find HubCharge full-service DC fast charging stations. Now open in Alhambra and Fontana, California — attendant service, NACS & CCS connectors, no app needed.",
  alternates: { canonical: "https://hubcharge.com/locations" },
};

export default function LocationsPage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Locations"
      tone="dark"
      image="/images/home.webp"
      imageAlt="A HubCharge forecourt at dusk"
      title="Find your HubCharge station"
      intro="Full-service DC fast charging in Southern California. Pull up, stay in your car, and let our team handle the rest."
    >
      {/* Grouped by state, not one flat list. With every site in California a
          flat list was fine; the moment Round Rock opens it would put two
          places a thousand miles apart in the same column with nothing saying
          so. Derived from the station data, so adding a station is still the
          only step. */}
      {statesWithCoverage().map((group) => (
      <section key={group.code} className="mb-16">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <h2 className="text-h3 text-ink-900">{group.name}</h2>
          <Link
            href={`/locations/state/${group.slug}`}
            className="tap-target text-caption text-brand-ink hover:underline"
          >
            {group.live.length
              ? `${group.live.length} ${group.live.length === 1 ? "station" : "stations"}`
              : "Announced"}
          </Link>
        </div>
      <div className="grid md:grid-cols-2 gap-8">
        {group.live.map((station) => (
          <Link
            key={station.id}
            href={`/locations/${station.slug}`}
            className="card-light overflow-hidden group block"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={station.photos[0].src}
                alt={station.photos[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-ok-ink text-white text-caption font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Open now
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-h3 text-ink-900 mb-2 group-hover:text-brand-ink transition-colors">
                {station.name}
              </h2>
              <p className="text-ink-500 text-body-sm mb-4">
                {station.address}
                {station.address !== station.city && `, ${station.city}`},{" "}
                {station.state} {station.zip}
              </p>
              <ul className="space-y-2 text-body-sm text-ink-600 mb-5">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-ink-700" />
                  {station.chargers} DC fast charger
                  {station.chargers > 1 ? "s" : ""} · {station.power} ·{" "}
                  {station.connectors.join(" + ")}
                </li>
                <li className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-ink-700" />
                  Attendant service available*
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-ink-700" />
                  Open daily, {station.hours}
                </li>
              </ul>
              <span className="inline-flex items-center gap-1.5 text-brand-ink font-semibold text-body-sm">
                Station details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* Signed and addressed, not open. A different card from a live one on
          purpose: no photo, no "Open now" badge, no directions link — the
          things a driver would act on are exactly the things we cannot
          promise yet. It still carries the real address, because "coming to
          Round Rock" and "coming to 2081 Double Creek Dr" are different
          amounts of information. */}
      {group.soon.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {group.soon.map((station) => (
            <div key={station.id} className="rounded-lg border border-dashed border-paper-400 p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-200 px-3 py-1 text-caption font-semibold text-ink-600">
                <Clock className="h-3.5 w-3.5" />
                Opening soon
              </span>
              <h3 className="text-h3 text-ink-900 mt-3 mb-2">{station.name}</h3>
              <p className="text-ink-500 text-body-sm">
                {station.address}, {station.city}, {station.state} {station.zip}
              </p>
              <p className="text-body-sm text-ink-600 mt-3">{station.blurb}</p>
            </div>
          ))}
        </div>
      )}

      {group.upcoming.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-6">
          {group.upcoming.map((u) => (
            <li
              key={u.city}
              className="rounded-full border border-paper-300 px-4 py-2 text-body-sm text-ink-500"
            >
              {u.city} · announced
            </li>
          ))}
        </ul>
      )}
      </section>
      ))}

      <div className="card-light p-8 text-center">
        <MapPin className="h-8 w-8 text-ink-700 mx-auto mb-3" />
        <h2 className="text-h3 text-ink-900 mb-2">
          More locations coming soon
        </h2>
        <p className="text-ink-500 mb-4">
          {/* Each entry is a record now, not a string. Left as `.join()` this
              rendered "[object Object]" — and TypeScript was happy, because
              joining an array of objects is perfectly legal and simply calls
              toString on each one. */}
          {upcomingLocations.map((u) => `${u.city}, ${u.state}`).join(" · ")} — and
          more on the way.
        </p>
        <Link
          href="/#locations"
          className="tap-target text-brand-ink font-semibold text-body-sm underline underline-offset-4"
        >
          Get notified when new hubs open →
        </Link>
      </div>

      <p className="text-caption text-ink-500 mt-8 max-w-2xl">
        *Attendant availability varies by location and time. Actual charging
        speed and added range vary by vehicle, battery state of charge, and
        temperature.
      </p>
    </PageShell>
  );
}
