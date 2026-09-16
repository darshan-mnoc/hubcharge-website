import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import {
  STATE_NAMES,
  stateFromSlug,
  stateSlug,
  statesWithCoverage,
} from "@/lib/stations";

/**
 * One state's coverage.
 *
 * Lives at /locations/state/<name> rather than /locations/<name> because
 * /locations/[slug] already belongs to the stations, and Next.js will not
 * accept two differently-named dynamic segments at the same level. Nesting it
 * is also the safer answer: a station slug and a state name can never shadow
 * one another, which they could if both sat directly under /locations.
 *
 * The site had a `state` field on every station and used it for nothing but an
 * address line — no grouping, no route, no page. That was fine while every
 * site was in one state, and stops being fine the moment Round Rock opens,
 * because "Locations" would then be a flat list mixing two places a thousand
 * miles apart with nothing to say so.
 *
 * These pages are deliberately honest about coverage: a state we have
 * announced but not opened gets a page that says exactly that, rather than
 * being hidden until it is ready or dressed up as if it were live.
 */
export function generateStaticParams() {
  return statesWithCoverage().map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const code = stateFromSlug(state);
  if (!code) return {};
  const group = statesWithCoverage().find((g) => g.code === code)!;
  const name = STATE_NAMES[code];
  const title = group.live.length
    ? `EV Charging Locations in ${name} | HubCharge`
    : `HubCharge is coming to ${name}`;
  return {
    title,
    /* `soon` as well as `upcoming`. Round Rock moved out of the city-centroid
       list the day it got a signed address, and this line read "We are
       opening in ." for the whole of Texas until it counted both. */
    description: group.live.length
      ? `Full-service DC fast charging in ${name}: ${group.live.map((s) => s.city).join(", ")}.`
      : `We are opening in ${[...group.soon.map((s) => s.city), ...group.upcoming.map((u) => u.city)].join(", ")}. See where HubCharge already runs.`,
    alternates: { canonical: `https://hubcharge.com/locations/state/${state}` },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const code = stateFromSlug(state);
  if (!code) notFound();
  const group = statesWithCoverage().find((g) => g.code === code);
  if (!group) notFound();

  return (
    <PageShell
      eyebrow="Locations"
      title={group.live.length ? `Charging in ${group.name}` : `Coming to ${group.name}`}
      intro={
        group.live.length
          ? `${group.live.length} full-service ${group.live.length === 1 ? "station" : "stations"} in ${group.name}, with an attendant who handles the cable for you.`
          : `We have not opened in ${group.name} yet. Here is where we are heading.`
      }
    >
      <section className="section-container pb-24">
        <Link
          href="/locations"
          className="tap-target inline-flex items-center gap-1.5 text-caption text-ink-500 hover:text-ink-900 transition-colors mb-8"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5" />
          All locations
        </Link>

        {group.live.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {group.live.map((s) => (
              <Link
                key={s.slug}
                href={`/locations/${s.slug}`}
                className="card-light group block overflow-hidden rounded-lg border border-paper-300"
              >
                {s.photos[0] && (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={s.photos[0].src}
                      alt={s.photos[0].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-h4 text-ink-900 group-hover:text-brand-ink transition-colors">
                    {s.name}
                  </p>
                  <p className="text-body-sm text-ink-500 mt-1">
                    {s.address}, {s.city}, {s.state} {s.zip}
                  </p>
                  <p className="text-caption text-ink-400 mt-3">
                    {s.chargers} {s.chargers === 1 ? "charger" : "chargers"} · {s.power} ·{" "}
                    {s.connectors.join(" and ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Addressed, not open. Given its own block above the announced-city
            pills because it is a materially different claim: we can tell you
            the street. */}
        {group.soon.length > 0 && (
          <div className={group.live.length ? "mt-10" : ""}>
            <p className="text-overline text-ink-500">Opening soon</p>
            <span aria-hidden className="mt-3 mb-4 block h-px w-8 bg-brass" />
            <div className="grid gap-4 md:grid-cols-2">
              {group.soon.map((s2) => (
                <div key={s2.id} className="rounded-lg border border-dashed border-paper-400 p-6">
                  <h2 className="text-h3 text-ink-900 mb-2">{s2.name}</h2>
                  <p className="text-ink-500 text-body-sm">
                    {s2.address}, {s2.city}, {s2.state} {s2.zip}
                  </p>
                  <p className="text-body-sm text-ink-600 mt-3">{s2.blurb}</p>
                  <p className="text-caption text-ink-400 mt-3">
                    {s2.chargers} DC fast chargers · {s2.power} ·{" "}
                    {s2.connectors.join(" + ")} — planned
                  </p>
                </div>
              ))}
            </div>
            <p className="text-caption text-ink-400 mt-4 max-w-measure">
              The address is confirmed; the opening date is not. We will publish
              hours here before it takes its first car.
            </p>
          </div>
        )}

        {group.upcoming.length > 0 && (
          <div className={group.live.length || group.soon.length ? "mt-10" : ""}>
            <p className="text-overline text-ink-500">Announced</p>
            <span aria-hidden className="mt-3 mb-4 block h-px w-8 bg-brass" />
            <ul className="flex flex-wrap gap-2">
              {group.upcoming.map((u) => (
                <li
                  key={u.city}
                  className="rounded-full border border-paper-300 px-4 py-2 text-body-sm text-ink-600"
                >
                  {u.city}
                </li>
              ))}
            </ul>
            {/* Said plainly, because the coordinates behind these are city
                centroids and no address here is confirmed yet. */}
            <p className="text-caption text-ink-400 mt-4 max-w-measure">
              These are announced, not open. We will publish the exact address and
              hours for each one before it takes its first car.
            </p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
