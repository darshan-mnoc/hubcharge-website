import { notFound } from "next/navigation";
import { COVERS, GuideCover, type CoverMotif } from "@/components/guide-cover";

/**
 * Every cover, side by side.
 *
 * The set drifted for eight rounds because there was no way to look at it as a
 * set — twenty-one covers living one per guide page, seen minutes apart. Two
 * of them had their connector labels on the wrong plugs and nobody caught it.
 *
 * The frame here is copied from components/page-shell.tsx deliberately, and the
 * two widths are the two the covers really render at: 600px in the masthead's
 * right column at desktop, 343px at a 375px phone. A cover that only works at
 * one of those is not finished.
 *
 * Dev only. notFound() in production, and app/sitemap.ts enumerates its routes
 * explicitly, so this never reaches anybody.
 */
export default async function CoverSheet({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { w } = await searchParams;
  const mobile = w === "mobile";
  const keys = Object.keys(COVERS) as CoverMotif[];

  return (
    <main className="min-h-screen bg-paper px-8 py-10">
      <header className="mx-auto mb-8 max-w-[1400px]">
        <p className="text-overline text-ink-400">Contact sheet</p>
        <h1 className="text-h2 mt-2 text-ink-900">
          {keys.length} covers at {mobile ? "343" : "600"}px
        </h1>
        <nav className="text-body-sm mt-3 flex gap-4">
          <a className="text-brand-ink underline" href="/dev/covers">
            desktop 600px
          </a>
          <a className="text-brand-ink underline" href="/dev/covers?w=mobile">
            mobile 343px
          </a>
        </nav>
      </header>

      <div
        className={`mx-auto grid gap-x-8 gap-y-7 ${
          mobile
            ? "max-w-[1500px] grid-cols-[repeat(auto-fill,minmax(343px,1fr))]"
            : "max-w-[1288px] grid-cols-[repeat(auto-fill,minmax(600px,1fr))]"
        }`}
      >
        {keys.map((k) => (
          <figure key={k} style={{ maxWidth: mobile ? 343 : 600 }}>
            {/* the same frame components/page-shell.tsx puts a cover in */}
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-paper-300 shadow-card">
              <GuideCover motif={k} />
            </div>
            <figcaption className="mt-2 flex items-baseline justify-between gap-4">
              <span className="text-caption text-ink-600">{k}</span>
              <span className="text-footnote text-ink-400 truncate">
                {COVERS[k].teaches ?? "—"}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
