import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Zap, Clock, ArrowRight, UserRound } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { stations, upcomingLocations } from "@/lib/stations";

export const metadata: Metadata = {
  title: "EV Charging Locations in California | HubCharge",
  description:
    "Find HubCharge full-service DC fast charging stations. Now open in Alhambra and Fontana, California — attendant service, NACS & CCS connectors, no app needed.",
  alternates: { canonical: "https://hubcharge.com/locations" },
};

const stationImages: Record<string, string> = {
  alhambra: "/images/valet-greet-v2.webp",
  fontana: "/images/charging-service-v2.webp",
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
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {stations.map((station) => (
          <Link
            key={station.id}
            href={`/locations/${station.slug}`}
            className="card-light overflow-hidden group block"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={stationImages[station.slug] ?? "/images/home.webp"}
                alt={`${station.name} charging station`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Open now
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-midnight-navy mb-2 group-hover:text-brand-ink transition-colors">
                {station.name}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {station.address}
                {station.address !== station.city && `, ${station.city}`},{" "}
                {station.state} {station.zip}
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-5">
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
              <span className="inline-flex items-center gap-1.5 text-brand-ink font-semibold text-sm">
                Station details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="card-light p-8 text-center">
        <MapPin className="h-8 w-8 text-ink-700 mx-auto mb-3" />
        <h2 className="text-h3 text-midnight-navy mb-2">
          More locations coming soon
        </h2>
        <p className="text-gray-500 mb-4">
          {upcomingLocations.join(" · ")} — and more on the way.
        </p>
        <Link
          href="/#locations"
          className="text-brand-ink font-semibold text-sm underline underline-offset-4"
        >
          Get notified when new hubs open →
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-8 max-w-2xl">
        *Attendant availability varies by location and time. Actual charging
        speed and added range vary by vehicle, battery state of charge, and
        temperature.
      </p>
    </PageShell>
  );
}
