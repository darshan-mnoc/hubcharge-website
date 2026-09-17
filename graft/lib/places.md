# lib/places.ts

- PlaceCategory · type · L23-L23 — type PlaceCategory = "coffee" | "food" | "retail";
- NearbyPlace · type · L25-L39 — type NearbyPlace = { id: string; name: string; category: PlaceCategory; /** Straight-line walking estimate in minutes, computed — never invented */ walkMinutes: number | null; rating: number | null; ratingCount: number | null; priceLevel: number | null; openNow: boolean | null; mapsUri: string | null; photoUrl: string | null; /** True when this came from the curated fallback, not the Places API */ estimated: boolean; };
- walkMinutesFrom · function · L50-L52 — function walkMinutesFrom(meters: number): number
- metersBetween · function · L54-L66 — function metersBetween( a: { lat: number; lng: number }, b: { lat: number; lng: number } ): number
- toRad · function · L59-L59 — toRad = (d: number)
- PlacesApiPlace · type · L68-L78 — type PlacesApiPlace = { id?: string; displayName?: { text?: string }; location?: { latitude?: number; longitude?: number }; rating?: number; userRatingCount?: number; priceLevel?: string; currentOpeningHours?: { openNow?: boolean }; googleMapsUri?: string; photos?: { name?: string }[]; };
- searchCategory · function · L87-L168 — async function searchCategory( station: Station, category: PlaceCategory, key: string ): Promise<NearbyPlace[]>
- curatedFor · function · L171-L193 — function curatedFor(stationId: number): NearbyPlace[]
- getNearbyPlaces · function · L195-L208 — async function getNearbyPlaces(station: Station): Promise<NearbyPlace[]>
- getNearbyBySlug · function · L210-L213 — async function getNearbyBySlug(slug: string): Promise<NearbyPlace[]>
