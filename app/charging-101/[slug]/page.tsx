import type { Metadata } from "next";
import { GuideCover, type CoverMotif } from "@/components/guide-cover";
import { notFound } from "next/navigation";
import { PageShell, Prose } from "@/components/page-shell";
import { GuideBreadcrumb, GuideCta, GuideFooter, GuideShort } from "@/components/learn";
import { ReadingProgress } from "@/components/reading-progress";
import { getGuide, guideSectionId } from "@/lib/guides";
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

/**
 * Cover per guide.
 *
 * These were photographs until they were not worth defending: a 3:2 frame cut
 * a third off every square one, and several carried claims the page below
 * them contradicted. A drawn cover is authored at the frame's own ratio and
 * contains no text, so neither failure is available to it.
 */
const GUIDE_COVERS: Record<string, CoverMotif> = {
  etiquette: "bays",
  weather: "climate",
  "battery-health": "band",
  "home-vs-public": "homeAway",
  "apartment-charging": "street",
  "charging-troubleshooting": "fault",
  "rideshare-drivers": "shift",
  "road-trip": "highway",
  "charging-corridors": "corridors",
  "new-ev-owner": "milestones",
  "ev-incentives": "paperwork",
};

/** Stable anchor from a heading — the scroll-spy and the rail must agree. */
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
      cover={<GuideCover motif={GUIDE_COVERS[slug]} />}
      title={guide.title}
      intro={guide.desc}
      meta={<span>{guide.read} read</span>}
    >
      <ReadingProgress sections={sections.map((s) => [guideSectionId(s.heading), s.heading])} />

      <GuideBreadcrumb
        trail={[
          ["Home", "/"],
          ["Charging 101", "/charging-101"],
          [guide.navTitle ?? guide.title, `/charging-101/${slug}`],
        ]}
      />

      <GuideShort slug={slug} />

      <Prose>
        {sections.map((s) => (
          <section key={s.heading} id={guideSectionId(s.heading)} className="scroll-mt-28">
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
