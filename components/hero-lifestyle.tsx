"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";

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

/** Facts, presented as a hairline spec bar rather than a floating glass card. */
const specs = [
  { value: "160kW+", label: "DC fast chargers" },
  { value: "10 min", label: "Adds up to 100 miles" },
  { value: "NACS + CCS", label: "Tesla, BMW, Ford & all EVs" },
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
      className="relative min-h-[88vh] lg:min-h-[78vh] flex flex-col justify-end overflow-hidden bg-hero"
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
            left-anchored type where it crosses the bright canopy. */}
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
              "linear-gradient(to right, rgba(10,25,47,0.78) 0%, rgba(10,25,47,0.45) 42%, rgba(10,25,47,0) 72%)",
          }}
        />
      </motion.div>

      {/* Type anchored bottom-left in a narrow column. Centred display type over
          a photograph is the composition of a stock quote card. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 section-container pt-40 pb-14 lg:pb-20"
      >
        <motion.span
          variants={item}
          aria-hidden
          className="mb-7 block h-px w-8 bg-brass"
        />

        <motion.h1 variants={item} className="text-display text-white max-w-[15ch]">
          <span className="text-white/55">Full service EV charging.</span>{" "}
          Reclaim your time.
        </motion.h1>

        <motion.p
          variants={item}
          className="text-body-lg text-on-dark/80 max-w-[44ch] mt-6"
        >
          Our attendant plugs you in — you stay in your car.
          <span className="text-brass">*</span> No app needed; it all runs in
          your browser.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-sm sm:max-w-none"
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
              <p className="text-caption text-white/55 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="section-container text-[11px] text-white/35 pb-5">
          *Attendant service at select locations and hours. Charging speed and
          added range vary by vehicle, battery state of charge, and temperature.
        </p>
      </div>
    </section>
  );
}
