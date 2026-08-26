import Link from "next/link";
import { CtaButton } from "@/components/ui/cta-button";

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
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
          {trail.map(([name, href], i) => {
            const last = i === trail.length - 1;
            return (
              <li key={href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {last ? (
                  <span className="text-gray-600 font-medium" aria-current="page">
                    {name}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-brand">
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

/** Closing CTA band shared by every Charging 101 page. */
export function GuideCta({
  headline = "Ready to try full-service charging?",
  sub = "Pull up, stay in your car, and let our team handle the rest — no app needed.",
}: {
  headline?: string;
  sub?: string;
}) {
  return (
    <div className="bg-hero rounded-lg p-8 lg:p-10 max-w-4xl text-center mt-14">
      <h2 className="text-white text-xl lg:text-2xl font-bold mb-3">{headline}</h2>
      <p className="text-on-dark/80 mb-6 max-w-xl mx-auto">{sub}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <CtaButton to="/locations" size="lg">
          Find your hub
        </CtaButton>
        <Link href="/faq" className="btn btn-outline btn-lg justify-center">
          Questions? Read the FAQ
        </Link>
      </div>
    </div>
  );
}
