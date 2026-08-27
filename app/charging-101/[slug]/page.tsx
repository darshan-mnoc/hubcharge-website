import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter } from "@/components/learn";
import { getGuide } from "@/lib/guides";
import { GUIDE_BODIES } from "@/lib/guide-content";

/**
 * Renders the prose guides from the registry + content map. The older guides
 * (connectors, charging-speed, glossary…) keep their own hand-built pages
 * because they carry bespoke layouts; these are straight long-form.
 */
export function generateStaticParams() {
  return Object.keys(GUIDE_BODIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g || !GUIDE_BODIES[slug]) return {};
  return {
    title: `${g.title} | HubCharge`,
    description: g.desc,
    alternates: { canonical: `https://hubcharge.com/charging-101/${slug}` },
    openGraph: { title: g.title, description: g.desc, type: "article" },
  };
}

const GUIDE_IMAGES: Record<string, string> = {
  etiquette: "/images/charging-service-v2.webp",
  weather: "/images/home.webp",
  "battery-health": "/images/charging-service-v2.webp",
  "home-vs-public": "/images/valet-greet-v2.webp",
  "road-trip": "/images/home.webp",
  "socal-charging": "/images/home.webp",
  "new-ev-owner": "/images/valet-greet-v2.webp",
};

export default async function ProseGuide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const sections = GUIDE_BODIES[slug];
  if (!guide || !sections) notFound();

  return (
    <PageShell
      eyebrow="Guides"
      backTo={{ href: "/charging-101", label: "All guides" }}
      image={GUIDE_IMAGES[slug]}
      imageAlt=""
      title={guide.title}
      intro={guide.desc}
      meta={<span>{guide.read} read</span>}
    >
      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          [guide.navTitle ?? guide.title, `/charging-101/${slug}`],
        ]}
      />

      <Prose>
        {sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body}
          </section>
        ))}
      </Prose>

      <GuideFooter slug={slug} />
      <GuideCta />
    </PageShell>
  );
}
