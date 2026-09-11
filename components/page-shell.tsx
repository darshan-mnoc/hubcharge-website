import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BatteryNav } from "@/components/battery-nav";
import { LifestyleFooter } from "@/components/lifestyle-footer";

type Tone = "light" | "dark";

/**
 * Shared shell for sub-pages (guides, locations, pricing, legal…).
 *
 * The masthead defaults to the warm paper ground, not navy: every sub-page
 * opening on the same dark band is what made the site read as one long dark
 * ribbon. Reserve tone="dark" for the two pages that earn it.
 *
 * The right column always does work — a photograph, or an "on this page"
 * index. When a page has neither, the grid collapses to a narrow measure
 * rather than holding six empty columns open, because an intentionally
 * narrow column reads as a decision and a half-empty grid reads as a
 * template that was never finished.
 */
export function PageShell({
  title,
  intro,
  eyebrow,
  image,
  imageAlt,
  cover,
  meta,
  toc,
  tone = "light",
  backTo,
  primary,
  children,
}: {
  title: string;
  intro?: string;
  /** Overline above the H1 — "Guides", "Locations", "Legal" */
  eyebrow?: string;
  /** Right-column photograph; bleeds to the right viewport edge */
  image?: string;
  imageAlt?: string;
  /** A drawn cover, used instead of a photograph. */
  cover?: ReactNode;
  /** Right-column fallback when there is no natural photograph */
  toc?: [label: string, href: string][];
  /** Small facts under the intro — "Updated August 2026" */
  meta?: ReactNode;
  tone?: Tone;
  /** Upward navigation. Every sub-page should offer one. */
  backTo?: { href: string; label: string };
  /**
   * Page-primary content, rendered full width directly under the masthead
   * with no padding above it.
   *
   * For a page whose whole job is one interactive thing: the masthead says
   * what the page is in two lines and then gets out of the way, so the tool
   * is in the first viewport instead of below a screen of preamble. Pages
   * that omit it are unaffected.
   */
  primary?: ReactNode;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  const hasAside = Boolean(image || cover || toc?.length);

  const titleCls = dark ? "text-white" : "text-ink-900";
  const introCls = dark ? "text-on-dark/80" : "text-ink-500";
  const eyebrowCls = dark ? "text-white/55" : "text-ink-500";
  const metaCls = dark ? "text-white/55" : "text-ink-400";

  const lead = (
    <>
      {backTo && (
        <Link
          href={backTo.href}
          className={`tap-target group inline-flex items-center gap-1.5 text-caption mb-6 transition-colors ${
            dark
              ? "text-on-dark/60 hover:text-white"
              : "text-ink-400 hover:text-ink-900"
          }`}
        >
          <ArrowLeft
            aria-hidden
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          />
          {backTo.label}
        </Link>
      )}
      {eyebrow && (
        <>
          <p className={`text-overline ${eyebrowCls}`}>{eyebrow}</p>
          <span aria-hidden className="mt-4 mb-6 block h-px w-8 bg-brass" />
        </>
      )}
      <h1 className={`text-h1 ${titleCls} max-w-[16ch]`}>{title}</h1>
      {intro && (
        <p className={`text-body-lg ${introCls} max-w-[46ch] mt-5`}>{intro}</p>
      )}
      {meta && (
        <div className={`text-caption ${metaCls} mt-7 flex flex-wrap gap-x-3`}>
          {meta}
        </div>
      )}
    </>
  );

  return (
    <main id="main" className="min-h-screen pb-16 lg:pb-0 bg-paper">
      <BatteryNav />

      <header className={dark ? "bg-ink-900" : "bg-paper"}>
        <div className="section-container pt-28 pb-12 sm:pt-32 lg:pt-32 lg:pb-16">
          {hasAside ? (
            <div
              // gap-x only from lg. Below that both children are col-span-12
              // and stack, so the 32px gap has nothing to separate — but a
              // col-span-12 element still spans all eleven gaps, making it
              // 352px wide inside a 350px grid. That 2px overflow pushed the
              // header image past the column everything below it lines up on.
              className="grid grid-cols-12 lg:gap-x-8 lg:items-center"
            >
              <div className="col-span-12 lg:col-span-6">{lead}</div>
              <div className="col-span-12 lg:col-span-6 mt-10 lg:mt-0">
                {cover || image ? (
                  /* Framed, not bled.
                   *
                   * This was a bare rectangle running off the right viewport
                   * edge: no radius, no border, no shadow. Against a #FBFAF8
                   * page a light photograph had no boundary at all, so it read
                   * as floating rather than placed — and it was the only
                   * element on these pages ignoring the container, which made
                   * it look unfinished rather than deliberate.
                   *
                   * It now wears the same surface the guide figures and cards
                   * already use: rounded-lg on a paper-300 hairline. The
                   * shadow is the light-mode one only; on the two dark-toned
                   * pages a shadow does nothing and a white hairline does the
                   * separating instead.
                   *
                   * 3:2 at every width, because the images are cropped to 3:2
                   * deliberately and the old 16/10 mobile box was re-cropping
                   * that work. */
                  <div
                    className={`relative aspect-[3/2] overflow-hidden rounded-lg border ${
                      dark ? "border-white/10" : "border-paper-300 shadow-card"
                    }`}
                  >
                    {cover ?? (
                      <Image
                        src={image!}
                        alt={imageAlt ?? ""}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    )}
                  </div>
                ) : (
                  <nav aria-label="On this page" className="lg:pl-10">
                    <p className={`text-overline ${eyebrowCls}`}>On this page</p>
                    <span aria-hidden className="mt-4 mb-2 block h-px w-8 bg-brass" />
                    <ul>
                      {toc!.map(([label, href]) => (
                        <li key={href}>
                          <a
                            href={href}
                            className={`block py-2.5 text-body-sm border-t ${
                              dark
                                ? "border-white/10 text-on-dark/70 hover:text-white"
                                : "border-paper-300 text-ink-500 hover:text-ink-900"
                            } transition-colors`}
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-[760px]">{lead}</div>
          )}
        </div>
        <div className="section-container">
          <hr className={dark ? "border-white/10" : "border-paper-300"} />
        </div>
      </header>

      {primary && (
        <div className="section-container pt-8 lg:pt-10">{primary}</div>
      )}

      <div className="section-container py-16 lg:py-24">{children}</div>
      <LifestyleFooter />
    </main>
  );
}

/** Prose wrapper for long-form legal/help text. */
/**
 * Body copy for the guides.
 *
 * The anchor rule used to be a bare `[&_a]`, so every link inside every
 * figure — timeline steps, etiquette cards, programme links — came out
 * brand-orange and underlined no matter what the component asked for.
 * `not-prose` reads like it should have stopped that and does not: nothing
 * here implements it except the list rule, which spells the exemption out.
 * The anchor rule now spells it out too, so `not-prose` means what it looks
 * like it means for both.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-prose space-y-6 text-ink-600 text-body [&_h2]:text-h3 [&_h2]:text-ink-900 [&_h2]:mt-12 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-ink-900 [&_h3]:mt-7 [&_h3]:mb-2 [&_ul:not(.not-prose_ul)]:list-disc [&_ul:not(.not-prose_ul)]:pl-6 [&_ul:not(.not-prose_ul)]:space-y-1.5 [&_a:not(.not-prose_a)]:text-brand-ink [&_a:not(.not-prose_a)]:underline [&_p+p]:mt-4 [&_p+ul]:mt-4 [&_ul+p]:mt-4">
      {children}
    </div>
  );
}
