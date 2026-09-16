import Image from "next/image";
import { Star, Clock, Coffee, Utensils, ShoppingBag } from "lucide-react";
import type { NearbyPlace, PlaceCategory } from "@/lib/places";

/* Label and icon together, so the two nearby UIs on this site agree.
   components/find-your-hub.tsx already pairs Coffee / Utensils / ShoppingBag
   with these same three categories; this reuses that vocabulary rather than
   inventing a second one. */
const CATEGORIES: Record<PlaceCategory, { label: string; Icon: typeof Coffee }> = {
  coffee: { label: "Coffee & drinks", Icon: Coffee },
  food: { label: "Food", Icon: Utensils },
  retail: { label: "Shops & essentials", Icon: ShoppingBag },
};

/**
 * Nearby places around a station. Every row links out to Google Maps —
 * previously these rendered a pointer cursor with no click target at all.
 *
 * When the data is the curated fallback rather than the Places API, walk
 * times are labelled "approx." rather than presented as measured.
 *
 * TWO DENSITIES
 * On the homepage this is a section in its own right. On a station page it is
 * not: it was ten rows in three columns, the widest block on the page, sitting
 * where a driver actually needed to know which level the charger was on. So
 * `compact` demotes it to a closing note — overline instead of an H2, two rows
 * per category, and no photographs or ratings, which also keeps the Places
 * photo URL (and the API key inside it) out of the markup.
 */
export function NearbyPlaces({
  places,
  variant = "full",
}: {
  places: NearbyPlace[];
  variant?: "full" | "compact";
}) {
  if (places.length === 0) return null;
  const estimated = places.some((p) => p.estimated);
  const compact = variant === "compact";
  const perCategory = compact ? 2 : Infinity;

  return (
    <section>
      {compact ? (
        /* No brass rule here. tailwind.config.ts budgets brass at "<=2
           ornamental moments per page" and /locations/alhambra was rendering
           three — this block, the access block and the calculator. A closing
           note is the right one to drop. */
        <p className="text-overline text-ink-500 mb-4">While you wait</p>
      ) : (
        <>
          <h2 className="text-h3 text-ink-900 mb-1">What&rsquo;s nearby</h2>
          <p className="text-body-sm text-ink-500 mb-8">
            Everything below is a short walk from the chargers
            {estimated ? " (walking times approximate)" : ""}.
          </p>
        </>
      )}

      <div
        className={
          compact
            ? "grid gap-x-8 gap-y-4 sm:grid-cols-3"
            : "grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {(["coffee", "food", "retail"] as const).map((cat) => {
          const items = places.filter((p) => p.category === cat).slice(0, perCategory);
          if (items.length === 0) return null;
          return (
            <div key={cat}>
              <h3
                className={`flex items-center gap-2 ${
                  compact
                    ? "text-caption font-semibold text-ink-700"
                    : "text-overline text-ink-500"
                }`}
              >
                {(() => {
                  const { Icon } = CATEGORIES[cat];
                  return (
                    <Icon
                      aria-hidden
                      className={`shrink-0 text-ink-700 ${compact ? "h-4 w-4" : "h-5 w-5"}`}
                    />
                  );
                })()}
                {CATEGORIES[cat].label}
              </h3>
              {!compact && (
                <span aria-hidden className="mt-3 mb-1 block h-px w-8 bg-brass" />
              )}
              <ul>
                {items.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.mapsUri ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-start gap-3 border-t border-paper-300 hover:bg-paper-100 transition-colors ${
                        compact ? "py-2" : "py-4"
                      }`}
                    >
                      {!compact && p.photoUrl && (
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
                        <span
                          className={`block text-ink-900 group-hover:text-brand-ink transition-colors ${
                            compact ? "text-body-sm" : "text-h4"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-400">
                          {p.walkMinutes != null && (
                            <span>{p.walkMinutes} min walk</span>
                          )}
                          {!compact && p.rating != null && (
                            <span className="inline-flex items-center gap-1">
                              <Star
                                aria-hidden
                                className="h-3 w-3 fill-brass text-brass"
                              />
                              {p.rating.toFixed(1)}
                              {p.ratingCount != null && ` (${p.ratingCount})`}
                            </span>
                          )}
                          {!compact && p.openNow != null && (
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

      {/* Compact mode drops the intro line, but walk times still render, so
          the caveat that they are estimated has to survive somewhere. */}
      {compact && estimated && (
        <p className="mt-4 text-footnote text-ink-400">
          Walking times are approximate.
        </p>
      )}
    </section>
  );
}
