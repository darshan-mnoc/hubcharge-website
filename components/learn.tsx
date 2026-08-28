import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { guideHref, guideNeighbours, getGuide } from "@/lib/guides";

/** Visible breadcrumb + BreadcrumbList JSON-LD for Charging 101 pages. */
export function GuideBreadcrumb({
  trail,
}: {
  /** [label, href] pairs ending with the current page (href ignored for last) */
  trail: [string, string][];
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, href], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `https://hubcharge.com${href}`,
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 -mt-6">
        <ol className="flex flex-wrap items-center gap-2 text-body-sm text-ink-500">
          {trail.map(([name, href], i) => {
            const last = i === trail.length - 1;
            return (
              <li key={href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {last ? (
                  <span className="text-ink-600 font-medium" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-brand-ink">
                    {name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * The answer, before the article.
 *
 * Every guide opened straight into explanation written for someone who
 * already knew the vocabulary — a reader who just wanted to know whether
 * their car works here had to read four paragraphs about pin counts to find
 * out. This puts two or three jargon-free sentences at the top of all
 * eighteen, from one place, and lib/guides.ts documents the rule they have to
 * satisfy: none of the fourteen glossary terms may appear in one.
 */
export function GuideShort({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  if (!guide?.short) return null;
  return (
    <aside
      aria-label="The short version"
      className="not-prose mb-10 rounded-lg border-l-2 border-brass bg-paper-100 px-5 py-5 sm:px-6"
    >
      <p className="text-overline text-ink-500">The short version</p>
      <p className="mt-3 text-body-lg text-ink-800">{guide.short}</p>
    </aside>
  );
}

/** Closing CTA band shared by every Charging 101 page. */
export function GuideCta({
  headline = "Ready to try full-service charging?",
  sub = "Pull up, stay in your car, and let our team handle the rest — no app needed.",
}: {
  headline?: string;
  sub?: string;
}) {
  return (
    <div className="bg-ink-900 mt-24 -mx-4 sm:-mx-6 px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid grid-cols-12 gap-x-8 items-end max-w-content mx-auto">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="text-h2 text-white max-w-headline">{headline}</h2>
          <p className="text-body-lg text-on-dark/75 mt-5 max-w-[42ch]">{sub}</p>
        </div>
        <div className="col-span-12 lg:col-start-9 lg:col-span-4 mt-8 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <CtaButton to="/locations" size="lg" fullWidth>
            Find your hub
          </CtaButton>
          <CtaButton to="/faq" size="lg" variant="secondaryOnDark" fullWidth>
            Questions? Read the FAQ
          </CtaButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Prev/next chrome at the foot of a guide. Without it every guide is a dead
 * end apart from the breadcrumb, which is a poor way to read a manual.
 */
export function GuideFooter({ slug }: { slug: string }) {
  const { prev, next } = guideNeighbours(slug);
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Guide navigation"
      className="mt-20 grid gap-4 sm:grid-cols-2 max-w-measure"
    >
      {prev ? (
        <Link
          href={guideHref(prev.slug)}
          className="group border-t border-paper-300 pt-5 hover:border-ink-400 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-overline text-ink-400">
            <ArrowLeft aria-hidden className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="block text-h4 text-ink-900 mt-2">
            {prev.navTitle ?? prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next && (
        <Link
          href={guideHref(next.slug)}
          className="group border-t border-paper-300 pt-5 hover:border-ink-400 transition-colors sm:text-right"
        >
          <span className="flex items-center gap-1.5 text-overline text-ink-400 sm:justify-end">
            Next
            <ArrowRight aria-hidden className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="block text-h4 text-ink-900 mt-2">
            {next.navTitle ?? next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
