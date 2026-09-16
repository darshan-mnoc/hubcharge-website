import { notFound } from "next/navigation";
import { stations } from "@/lib/stations";
import { StationMap } from "@/components/station-map";

/**
 * The map, on its own, in a fixed box.
 *
 * Sibling of /dev/covers. The map lives inside a scroll-animated grid item on
 * the homepage, which makes "is the map broken or is its container?" hard to
 * answer. Here it has a plain, statically-sized parent and nothing else on the
 * page, so a failure is the map's own.
 *
 * Dev only.
 */
export default function DevMap() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="min-h-screen bg-paper p-8">
      <h1 className="text-h3 text-ink-900 mb-4">Map harness</h1>
      <div className="rounded-lg overflow-hidden border border-paper-300" style={{ width: 900, height: 560 }}>
        <StationMap stations={stations} selectedId={stations[0].id} className="h-full w-full" />
      </div>
    </main>
  );
}
