"use client";

import { useRef } from "react";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/ui/cta-button";
import { stations } from "@/lib/stations";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/**
 * Facts, presented as a hairline spec bar rather than a floating glass card.
 *
 * All three were hardcoded and all three disagreed with the rest of the site:
 *
 *   "160kW+"    — every other page, and STATION_KW, say up to 180. The hero
 *                 was underselling its own hardware.
 *   "up to 100 miles" — the estimator computes 135 for a Model 3 Long Range
 *                 and a median of 85 across 31 models, so this both
 *                 understated the ceiling and overstated the typical car.
 *   "& all EVs" — five pages state plainly that a 2011-2025 Leaf cannot fast
 *                 charge here. An overclaim the site elsewhere corrects.
 *
 * The power figure is read from the station record now, so it can't drift
 * again. The range is a band rather than a ceiling, because a band is the
 * shape of the truth and the estimator is one click away to prove it.
 */
const specs = [
  { value: stations[0].power, label: "DC fast charging, both connectors" },
  {
    value: "10 minutes",
    label: `Adds ${TEN_MINUTE_RANGE} miles*`,
    href: "/pricing#plan",
    cta: "Check yours",
  },
  { value: "No app", label: "It runs in your phone's browser" },
];

export function HeroLifestyle() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-[88vh] lg:min-h-[78vh] flex flex-col justify-end overflow-hidden bg-ink-900"
    >
      {/* Photograph at full strength. A single bottom-anchored scrim carries the
          type, instead of dimming the whole image to 40% and muddying it. */}
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-0"
      >
        <Image
          src="/images/home.webp"
          alt="A HubCharge station at dusk, cars charging beneath a lit canopy"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Vertical scrim carries the spec bar; the horizontal one carries the
            left-anchored type where it crosses the bright canopy.

            The horizontal one was cut for a hero that had a 44ch paragraph
            under the headline. With that gone the headline itself runs to 58%
            of the viewport at 84px, straight across the brightest part of the
            canopy, and the muted line measured 1.62:1 against it. The falloff
            now holds past where the type ends rather than fading out at 72%. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,25,47,0.94) 0%, rgba(10,25,47,0.80) 30%, rgba(10,25,47,0.46) 62%, rgba(10,25,47,0.14) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,25,47,0.88) 0%, rgba(10,25,47,0.74) 40%, rgba(10,25,47,0.40) 62%, rgba(10,25,47,0) 84%)",
          }}
        />
      </motion.div>

      {/* Type anchored bottom-left in a narrow column. Centred display type over
          a photograph is the composition of a stock quote card. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        // w-full matters here. The parent is a flex column, and inside one
        // `margin: auto` absorbs free space rather than centring a stretched
        // box — so .section-container's mx-auto was shrink-wrapping this
        // column to its content width and centring that. The hero type sat
        // ~300px right of the page gutter, aligned with nothing else on the
        // page, including the nav above it and the spec bar below.
        className="relative z-10 w-full section-container pt-32 pb-12 lg:pb-16"
      >
        {/* Both halves at display size, separated by colour rather than scale.

            The muted half was brass, and brass was wrong here for a reason
            worth recording: the photograph behind it is a canopy lit in warm
            gold, and #A8875C sits in that same hue family. There was nothing
            for the eye to separate, so it read muddy rather than secondary.
            It measured fine (5.3:1) and still looked off, because contrast
            against flat navy is not the thing being judged — the type is over
            a photograph, not over the token.

            So: separate by temperature instead. A cool neutral reads as
            clearly subordinate against gold light, and gets cleaner rather
            than muddier as the canopy behind it brightens.

            Descriptor first, payoff second: the bright line lands last. */}
        <motion.h1
          variants={item}
          className="text-display max-w-[15ch] text-balance [text-wrap:balance]"
        >
          {/* Two blocks, not one wrapped sentence. With the paragraph beneath
              it gone the headline carries the hero alone, and a couplet that
              breaks where the meaning breaks reads as composed — where the
              inline version broke wherever the measure happened to run out. */}
          <span className="block text-on-dark/70">Full-service EV charging.</span>
          <span className="block text-white">Reclaim your time.</span>
        </motion.h1>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 mt-9 w-full max-w-sm sm:max-w-none"
        >
          <CtaButton href="#story" size="lg" fullWidth wrapperClassName="sm:w-auto">
            See how it works
            <ArrowRight className="h-4 w-4" />
          </CtaButton>
          <CtaButton
            to="/locations"
            size="lg"
            variant="secondaryOnDark"
            fullWidth
            wrapperClassName="sm:w-auto"
          >
            Find a location
          </CtaButton>
        </motion.div>
      </motion.div>

      {/* Spec bar — rules, not a card */}
      <div className="relative z-10 border-t border-white/10">
        <div className="section-container grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {specs.map((s) => (
            <div key={s.value} className="py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="text-h3 text-white">{s.value}</p>
              <p className="text-caption text-on-dark/60 mt-1">
                {s.label}
                {s.href && (
                  <>
                    {" · "}
                    <Link
                      href={s.href}
                      className="text-brand hover:underline underline-offset-2"
                    >
                      {s.cta}
                    </Link>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="section-container flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-5">
          <p className="text-footnote text-on-dark/55 max-w-[64ch]">
            *Range added depends on your car, its state of charge and the
            temperature.
          </p>
          {/* A quiet cue that there is more below — the hero fills the
              viewport, so without one the fold reads as the end of the page. */}
          <a
            href="#story"
            className="group hidden sm:inline-flex items-center gap-2 text-footnote text-on-dark/55 hover:text-white transition-colors"
          >
            Scroll
            <ArrowDown
              aria-hidden
              className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
