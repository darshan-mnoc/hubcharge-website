import { notFound } from "next/navigation";
import Link from "next/link";
import { GuideCover } from "@/components/guide-cover";
import { DirectionA } from "@/components/cover-lab/direction-a";
import { DirectionB } from "@/components/cover-lab/direction-b";
import { DirectionC } from "@/components/cover-lab/direction-c";

/**
 * The style test.
 *
 * Three directions for ONE cover — home-vs-public, the least modern of the
 * twenty-one — with the current rules suspended: the navy plate, the
 * orange/green-only palette, the flat side elevation, the motion cap and the
 * all-caps labels are all off the table here.
 *
 * The original cover is untouched and still shipping. Nothing on this route
 * is wired into the site; both accuracy scripts stay green because none of
 * their inputs moved. If all three are wrong, deleting this folder and
 * components/cover-lab/ reverts the entire experiment.
 *
 * Each direction is shown at the real masthead size, and again at 31px —
 * because a cover that only works large is not finished.
 */

const VARIANTS = {
  "home-vs-public-a": {
    letter: "A",
    name: "Bold / graphic",
    Cover: DirectionA,
    palette: "Bone paper, ultramarine and vermillion — overprinted",
    depth: "Hard offset shadow, no blur anywhere",
    angle: "3/4 carried by flat planes, no shading",
    bold: "The unit cropped off the top of the frame",
    motion: "Interaction only — a poster does not move on its own",
  },
  "home-vs-public-b": {
    letter: "B",
    name: "Soft / dimensional",
    Cover: DirectionB,
    palette: "Warm graphite to plum, cool cyan key, amber charge",
    depth: "Gradient, volumetric shaft, contact occlusion",
    angle: "3/4 with shaded planes and a lit arris",
    bold: "A shaft of the screen's own light across the floor",
    motion: "Hover ramps the charge; the light answers",
  },
  "home-vs-public-c": {
    letter: "C",
    name: "Refined / current palette",
    Cover: DirectionC,
    palette: "Navy, orange, green — the existing rule kept honestly",
    depth: "Long raking shadow and a rim on every near edge",
    angle: "3/4 with a low sun",
    bold: "Composition, not colour: one very long shadow",
    motion: "Hover moves power — blade green to orange, cable lights",
  },
} as const;

type Slug = keyof typeof VARIANTS;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { variant } = await params;
  const spec = VARIANTS[variant as Slug];
  if (!spec) notFound();
  const { Cover } = spec;

  return (
    <main className="min-h-screen bg-paper px-8 py-10">
      <p className="text-overline text-ink-400">Style test · home-vs-public</p>
      <h1 className="text-h2 text-ink-900 mt-2">
        {spec.letter} — {spec.name}
      </h1>

      <nav className="mt-4 flex flex-wrap gap-4 text-body-sm">
        {(Object.keys(VARIANTS) as Slug[]).map((v) => (
          <Link
            key={v}
            href={`/dev/covers/${v}`}
            className={v === variant ? "text-ink-900 font-semibold" : "text-brand-ink underline"}
          >
            {VARIANTS[v].letter} — {VARIANTS[v].name}
          </Link>
        ))}
        <Link href="/dev/covers/compare" className="text-brand-ink underline">
          All three
        </Link>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[600px_1fr] items-start">
        <div>
          <div className="relative aspect-[3/2] w-[600px] max-w-full overflow-hidden rounded-lg border border-paper-300 shadow-card">
            <Cover />
          </div>
          <p className="text-caption text-ink-400 mt-2">
            600px — the real masthead width. Hover or tap it.
          </p>

          <div className="mt-8 flex items-end gap-6">
            {[31, 60, 120].map((w) => (
              <div key={w}>
                <div
                  className="relative overflow-hidden rounded border border-paper-300"
                  style={{ width: w, aspectRatio: "3 / 2" }}
                >
                  <Cover />
                </div>
                <p className="text-footnote text-ink-400 mt-1">{w}px</p>
              </div>
            ))}
          </div>
          <p className="text-caption text-ink-400 mt-2 max-w-measure">
            31px is the narrowest this is ever drawn. If the silhouette does not
            survive here, the direction does not work.
          </p>
        </div>

        <dl className="text-body-sm max-w-measure">
          {(
            [
              ["Angle", spec.angle],
              ["Depth", spec.depth],
              ["Colour", spec.palette],
              ["Bold move", spec.bold],
              ["Motion", spec.motion],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="border-t border-paper-300 py-3">
              <dt className="text-overline text-ink-500">{k}</dt>
              <dd className="text-ink-700 mt-1">{v}</dd>
            </div>
          ))}
          <div className="border-t border-paper-300 py-3">
            <dt className="text-overline text-ink-500">What it replaces</dt>
            <dd className="mt-3">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded border border-paper-300">
                <GuideCover motif="homeAway" />
              </div>
              <p className="text-caption text-ink-400 mt-2">
                The cover shipping today — a wireframe house, flat elevation.
              </p>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
