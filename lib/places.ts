import "server-only";
import { stations, type Station } from "@/lib/stations";
import { nearbyByStation } from "@/lib/stations";

/**
 * Nearby places for a station, from the Google Places API (New).
 *
 * Called on the server and cached for a day via fetch's `next.revalidate`,
 * so cost stays at cents per month regardless of traffic and pages stay
 * fast. (Next 16 replaced `unstable_cache` with the `use cache` directive,
 * which needs an experimental flag — a plain cached fetch is the supported
 * path for third-party HTTP.)
 *
 * When GOOGLE_PLACES_API_KEY is absent the curated list in lib/stations.ts
 * is returned instead, so the site never breaks on a missing key. The
 * curated entries carry `estimated: true` so the UI can label them honestly
 * rather than presenting invented walk times as measured ones.
 */

const REVALIDATE_SECONDS = 60 * 60 * 24;
const SEARCH_RADIUS_M = 800; // ~10 minutes' walk

export type PlaceCategory = "coffee" | "food" | "retail";

export type NearbyPlace = {
  id: string;
  name: string;
  category: PlaceCategory;
  /** Straight-line walking estimate in minutes, computed — never invented */
  walkMinutes: number | null;
  rating: number | null;
  ratingCount: number | null;
  priceLevel: number | null;
  openNow: boolean | null;
  mapsUri: string | null;
  photoUrl: string | null;
  /** True when this came from the curated fallback, not the Places API */
  estimated: boolean;
};

const CATEGORY_TYPES: Record<PlaceCategory, string[]> = {
  coffee: ["coffee_shop", "cafe"],
  food: ["restaurant", "meal_takeaway"],
  retail: ["supermarket", "shopping_mall", "convenience_store"],
};

const CATEGORY_LIMIT = 4;

/** Average walking pace ~3 mph. Straight-line, so deliberately rounded up. */
function walkMinutesFrom(meters: number): number {
  return Math.max(1, Math.round(meters / 80));
}

function metersBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

type PlacesApiPlace = {
  id?: string;
  displayName?: { text?: string };
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  currentOpeningHours?: { openNow?: boolean };
  googleMapsUri?: string;
  photos?: { name?: string }[];
};

const PRICE_LEVELS: Record<string, number> = {
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

async function searchCategory(
  station: Station,
  category: PlaceCategory,
  key: string
): Promise<NearbyPlace[]> {
  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": [
            "places.id",
            "places.displayName",
            "places.location",
            "places.rating",
            "places.userRatingCount",
            "places.priceLevel",
            "places.currentOpeningHours.openNow",
            "places.googleMapsUri",
            "places.photos",
          ].join(","),
        },
        body: JSON.stringify({
          includedTypes: CATEGORY_TYPES[category],
          maxResultCount: 8,
          rankPreference: "POPULARITY",
          locationRestriction: {
            circle: {
              center: {
                latitude: station.coords.lat,
                longitude: station.coords.lng,
              },
              radius: SEARCH_RADIUS_M,
            },
          },
        }),
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error(
        `[places] ${category} search failed for ${station.slug}: ${res.status}`
      );
      return [];
    }

    const data = (await res.json()) as { places?: PlacesApiPlace[] };
    return (data.places ?? [])
      .filter((p) => p.displayName?.text && p.location)
      .map((p) => {
        const loc = {
          lat: p.location!.latitude!,
          lng: p.location!.longitude!,
        };
        const photoName = p.photos?.[0]?.name;
        return {
          id: p.id ?? p.displayName!.text!,
          name: p.displayName!.text!,
          category,
          walkMinutes: walkMinutesFrom(metersBetween(station.coords, loc)),
          rating: p.rating ?? null,
          ratingCount: p.userRatingCount ?? null,
          priceLevel: p.priceLevel ? (PRICE_LEVELS[p.priceLevel] ?? null) : null,
          openNow: p.currentOpeningHours?.openNow ?? null,
          mapsUri: p.googleMapsUri ?? null,
          photoUrl: photoName
            ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=320&maxWidthPx=480&key=${key}`
            : null,
          estimated: false,
        } satisfies NearbyPlace;
      })
      .sort((a, b) => (a.walkMinutes ?? 99) - (b.walkMinutes ?? 99))
      .slice(0, CATEGORY_LIMIT);
  } catch (err) {
    console.error(`[places] ${category} search threw for ${station.slug}:`, err);
    return [];
  }
}

/** Curated fallback, flagged so the UI can be honest about it. */
function curatedFor(stationId: number): NearbyPlace[] {
  const curated = nearbyByStation[stationId];
  if (!curated) return [];
  const out: NearbyPlace[] = [];
  (["coffee", "food", "retail"] as const).forEach((category) => {
    curated[category].forEach((p) => {
      out.push({
        id: `${category}-${p.name}`,
        name: p.name,
        category,
        walkMinutes: parseInt(p.walk, 10) || null,
        rating: null,
        ratingCount: null,
        priceLevel: null,
        openNow: null,
        mapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}`,
        photoUrl: null,
        estimated: true,
      });
    });
  });
  return out;
}

export async function getNearbyPlaces(station: Station): Promise<NearbyPlace[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return curatedFor(station.id);

  const results = await Promise.all(
    (["coffee", "food", "retail"] as const).map((c) =>
      searchCategory(station, c, key)
    )
  );
  const flat = results.flat();
  // If Places returned nothing at all (bad key, quota, no results) fall back
  // rather than rendering an empty section.
  return flat.length > 0 ? flat : curatedFor(station.id);
}

export async function getNearbyBySlug(slug: string): Promise<NearbyPlace[]> {
  const station = stations.find((s) => s.slug === slug);
  return station ? getNearbyPlaces(station) : [];
}
