import { notFound } from "next/navigation";
import Link from "next/link";
import { GuideCover } from "@/components/guide-cover";
import { DirectionA } from "@/components/cover-lab/direction-a";
import { DirectionB } from "@/components/cover-lab/direction-b";
import { DirectionC } from "@/components/cover-lab/direction-c";

/** All three against the one they would replace. Dev only. */
export default function Compare() {
  if (process.env.NODE_ENV === "production") notFound();
  const items = [
    { k: "now", label: "Shipping today", node: <GuideCover motif="homeAway" /> },
    { k: "a", label: "A — Bold / graphic", node: <DirectionA /> },
    { k: "b", label: "B — Soft / dimensional", node: <DirectionB /> },
    { k: "c", label: "C — Refined / current palette", node: <DirectionC /> },
  ];
  return (
    <main className="min-h-screen bg-paper px-8 py-10">
      <p className="text-overline text-ink-400">Style test · home-vs-public</p>
      <h1 className="text-h2 text-ink-900 mt-2">Three directions, one cover</h1>
      <p className="text-body text-ink-600 mt-3 max-w-measure">
        Hover or tap each one. The current rules — navy plate, orange and green
        only, flat elevation, capped motion — are suspended for A and B, and
        kept honestly for C.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2 max-w-[1300px]">
        {items.map((i) => (
          <figure key={i.k}>
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-paper-300 shadow-card">
              {i.node}
            </div>
            <figcaption className="text-caption text-ink-600 mt-2 flex justify-between">
              <span>{i.label}</span>
              {i.k !== "now" && (
                <Link href={`/dev/covers/home-vs-public-${i.k}`} className="text-brand-ink underline">
                  detail
                </Link>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
