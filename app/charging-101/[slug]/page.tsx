import type { Metadata } from "next";
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
 * Masthead per guide.
 *
 * Six of these now point at real HubCharge-branded renders. The ones still on
 * charging-service-v2 and valet-greet-v2 are carrying known defects — a
 * gibberish tagline and a wordmark that reads HUB(NARGE respectively — and are
 * the next slots to replace. Assignments avoid two guides in the same group
 * sharing an image, which is where a repeat actually gets noticed.
 */
const GUIDE_IMAGES: Record<string, string> = {
  etiquette: "/images/guide-etiquette-evening.webp",
  weather: "/images/home.webp",
  "battery-health": "/images/guide-parking-garage.webp",
  "home-vs-public": "/images/guide-home-vs-public-split.webp",
  "apartment-charging": "/images/guide-apartment-forecourt.webp",
  "charging-troubleshooting": "/images/guide-trouble-banner.webp",
  "rideshare-drivers": "/images/lifestyle-food-v2.webp",
  "road-trip": "/images/guide-roadtrip-highway.webp",
  "socal-charging": "/images/guide-socal-night.webp",
  "new-ev-owner": "/images/guide-new-owner-residential.webp",
  "ev-incentives-california": "/images/lifestyle-coffee-v2.webp",
};

/**
 * Alt text per masthead. This was a hardcoded imageAlt="" for all eleven
 * data-driven guides, so every one of their mastheads was announced as
 * decorative and skipped — while the seven page-file guides all described
 * theirs. These are written from what is actually in each frame.
 */
const GUIDE_IMAGE_ALTS: Record<string, string> = {
  etiquette:
    "Several cars parked at a HubCharge charger at dusk outside a residential complex, one of them connected.",
  weather:
    "A HubCharge forecourt at dusk, cars charging beneath a lit canopy.",
  "battery-health":
    "A HubCharge charger in a concrete parking structure beside bay D12, screen lit and both connectors holstered.",
  "home-vs-public":
    "Split view: an electric car charging from a wall unit in a home garage on the left, and a row of cars at a solar-canopied public forecourt on the right.",
  "apartment-charging":
    "Electric vehicles charging at a HubCharge forecourt beside a retail building at dusk.",
  "charging-troubleshooting":
    "A charging cable connected to a dark electric car, overlaid with the words Troubleshooting Common EV Charging Issues.",
  "rideshare-drivers":
    "Electric cars parked at a HubCharge station on a city forecourt, an attendant beside one of them.",
  "road-trip":
    "The driver's view from inside a car on an open road at sunset, with navigation graphics overlaid on the windscreen.",
  "socal-charging":
    "A lit charging canopy at night with cars parked beneath it.",
  "new-ev-owner":
    "A HubCharge charger beside desert landscaping at a residential development, a car connected to it.",
  "ev-incentives-california":
    "A HubCharge station lit at dusk in front of a row of shops and offices.",
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
      image={GUIDE_IMAGES[slug]}
      imageAlt={GUIDE_IMAGE_ALTS[slug] ?? ""}
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
