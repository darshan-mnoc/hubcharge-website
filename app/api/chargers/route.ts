import { NextResponse } from "next/server";
import { z } from "zod";
import { nearbyChargers } from "@/lib/openchargemap";

/**
 * The browser cannot call OpenChargeMap, so it calls us.
 *
 * The radius is CLAMPED rather than merely validated: this is an open endpoint
 * spending somebody else's free quota, and without a ceiling one scripted
 * caller with distance=5000 empties it.
 */
const Query = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(1).max(50).default(15),
});

export async function GET(req: Request) {
  const parsed = Query.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "bad coordinates" }, { status: 400 });
  }
  const result = await nearbyChargers(parsed.data);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
