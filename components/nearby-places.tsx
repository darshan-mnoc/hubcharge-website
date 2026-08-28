import Image from "next/image";
import { Star, Clock } from "lucide-react";
import type { NearbyPlace, PlaceCategory } from "@/lib/places";

const LABELS: Record<PlaceCategory, string> = {
  coffee: "Coffee & drinks",
  food: "Food",
  retail: "Shops & essentials",
};

/**
 * Nearby places around a station. Every row links out to Google Maps —
 * previously these rendered a pointer cursor with no click target at all.
 *
 * When the data is the curated fallback rather than the Places API, walk
 * times are labelled "approx." rather than presented as measured.
 */
export function NearbyPlaces({ places }: { places: NearbyPlace[] }) {
  if (places.length === 0) return null;
  const estimated = places.some((p) => p.estimated);

  return (
    <section>
      <h2 className="text-h3 text-ink-900 mb-1">What&rsquo;s nearby</h2>
      <p className="text-body-sm text-ink-500 mb-8">
        Everything below is a short walk from the chargers
        {estimated ? " (walking times approximate)" : ""}.
      </p>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {(["coffee", "food", "retail"] as const).map((cat) => {
          const items = places.filter((p) => p.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-overline text-ink-500">{LABELS[cat]}</h3>
              <span aria-hidden className="mt-3 mb-1 block h-px w-8 bg-brass" />
              <ul>
                {items.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.mapsUri ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 py-4 border-t border-paper-300 hover:bg-paper-100 transition-colors"
                    >
                      {p.photoUrl && (
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-paper-200">
                          <Image
                            src={p.photoUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized
                          />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-h4 text-ink-900 group-hover:text-brand-ink transition-colors">
                          {p.name}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-400">
                          {p.walkMinutes != null && (
                            <span>{p.walkMinutes} min walk</span>
                          )}
                          {p.rating != null && (
                            <span className="inline-flex items-center gap-1">
                              <Star
                                aria-hidden
                                className="h-3 w-3 fill-brass text-brass"
                              />
                              {p.rating.toFixed(1)}
                              {p.ratingCount != null && ` (${p.ratingCount})`}
                            </span>
                          )}
                          {p.openNow != null && (
                            <span
                              className={`inline-flex items-center gap-1 ${
                                p.openNow ? "text-ok-ink" : "text-ink-400"
                              }`}
                            >
                              <Clock aria-hidden className="h-3 w-3" />
                              {p.openNow ? "Open" : "Closed"}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
