import "server-only";

/**
 * Other operators' fast chargers, from OpenChargeMap.
 *
 * WHY IT IS PROXIED AND NOT CALLED FROM THE BROWSER
 * OCM needs a key. It is free and needs no card, but it is still a key, and
 * the last component that wanted one read it from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
 * — which is to say it would have published it to every visitor, had it ever
 * been set. This one is read here and nowhere else, and reaches the browser
 * only as data through app/api/chargers.
 *
 * WHY THE KEY CHECK IS LOAD-BEARING RATHER THAN DEFENSIVE
 * A keyless request does not come back as an empty list. It comes back 403
 * with a PLAIN TEXT body, so anything that reaches res.json() on a keyless
 * call throws. Verified against the live API.
 *
 * With no key this returns { configured: false, chargers: [] } and that is the
 * NORMAL state, not a degraded one — this site is about our own sites, and
 * other people's are context. Nothing renders differently except that the
 * other-networks affordance is not offered at all, because an empty toggle
 * advertising a feature that is not there is worse than no toggle.
 */

const ENDPOINT = "https://api.openchargemap.io/v3/poi/";
const REVALIDATE_SECONDS = 60 * 60 * 24;

export type PublicCharger = {
  id: number;
  title: string;
  operator: string | null;
  coords: { lat: number; lng: number };
  maxKw: number | null;
};

export type ChargerResult = { configured: boolean; chargers: PublicCharger[] };

/**
 * Snap to about a kilometre.
 *
 * The most important line here. Unsnapped, every pixel of pan is a distinct
 * URL, every URL is a cache miss, and a free quota belonging to a volunteer
 * project drains in an afternoon. Snapped, a whole city collapses onto a
 * handful of cache keys.
 */
const snap = (n: number) => Math.round(n * 100) / 100;

type OcmPoi = {
  ID: number;
  AddressInfo?: { Title?: string; Latitude?: number; Longitude?: number };
  OperatorInfo?: { Title?: string };
  Connections?: { PowerKW?: number }[];
};

export async function nearbyChargers({
  lat,
  lng,
  radius = 15,
  limit = 40,
}: {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}): Promise<ChargerResult> {
  const key = process.env.OPENCHARGEMAP_API_KEY;
  if (!key) return { configured: false, chargers: [] };

  const url = new URL(ENDPOINT);
  url.searchParams.set("output", "json");
  url.searchParams.set("latitude", String(snap(lat)));
  url.searchParams.set("longitude", String(snap(lng)));
  url.searchParams.set("distance", String(radius));
  url.searchParams.set("distanceunit", "Miles");
  url.searchParams.set("maxresults", String(limit));
  url.searchParams.set("compact", "true");
  url.searchParams.set("verbose", "false");
  /* Level 3 only. A destination wall box is not what this map is for, and
     including them would bury two DC sites under three hundred of them. */
  url.searchParams.set("levelid", "3");

  try {
    const res = await fetch(url, {
      /* A header, not a query parameter: a key in a URL lands in every access
         log and every Referer header it touches. */
      headers: { "X-API-Key": key, Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`[ocm] ${res.status} near ${snap(lat)},${snap(lng)}`);
      return { configured: true, chargers: [] };
    }
    const data = (await res.json()) as OcmPoi[];
    return {
      configured: true,
      chargers: data
        .filter((p) => p.AddressInfo?.Latitude != null && p.AddressInfo?.Longitude != null)
        .map((p) => ({
          id: p.ID,
          title: p.AddressInfo?.Title ?? "Charging station",
          operator: p.OperatorInfo?.Title ?? null,
          coords: { lat: p.AddressInfo!.Latitude!, lng: p.AddressInfo!.Longitude! },
          maxKw: p.Connections?.reduce((a, c) => Math.max(a, c.PowerKW ?? 0), 0) || null,
        })),
    };
  } catch (err) {
    console.error("[ocm] threw:", err);
    return { configured: true, chargers: [] };
  }
}
