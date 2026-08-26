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
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
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

/** Closing CTA band shared by every Charging 101 page. */
export function GuideCta({
  headline = "Ready to try full-service charging?",
  sub = "Pull up, stay in your car, and let our team handle the rest — no app needed.",
}: {
  headline?: string;
  sub?: string;
}) {
  return (
    <div className="bg-ink-900 mt-24 -mx-6 lg:-mx-10 px-6 lg:px-10 py-20">
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
