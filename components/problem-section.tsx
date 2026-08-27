"use client";

import { useRef } from "react";
import { motion, useInView, easeOut } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  ArrowDown,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";

const solutionSteps = [
  {
    number: "01",
    title: "Arrive & Relax",
    desc: "Pull up to any available charger. Our team handles everything from there.",
    highlight: "No apps to download",
    image: "/images/valet-greet-v2.webp",
    imageAlt: "A HubCharge attendant greeting a driver at their car window",
    // charger sits at the far left of the frame
    pos: "18% 50%",
  },
  {
    number: "02",
    title: (
      <>
        We Handle Charging
        <span className="text-red-500">*</span>
      </>
    ),
    desc: "Payment, plug-in, monitoring — all taken care of. Stay in your car.",
    highlight: "Zero effort required",
    image: "/images/charging-service-v2.webp",
    imageAlt: "An attendant plugging a charging cable into an electric car",
    pos: "45% 50%",
  },
  {
    number: "03",
    title: (
      <>
        Get Things Done
        <span className="text-red-500">*</span>
      </>
    ),
    desc: "Order food, coffee, or essentials. Delivered right to your window.",
    highlight: "Time well spent",
    image: "/images/coffee-delivery-v3.webp",
    imageAlt: "Coffee being delivered to a driver's car window while it charges",
    // charger sits on the left of the frame
    pos: "24% 50%",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};


const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function ProblemSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="story"
      data-reveal
      className="relative bg-surface overflow-hidden"
    >

      <div className="section-container relative pt-24 lg:pt-32 pb-16">
        {/* SECTION 1: Rethink Fast Charging */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <p className="text-overline text-ink-500">Rethink fast charging</p>
            <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-h2 text-ink-900 mb-6 max-w-headline"
          >
            <span className="text-ink-400">
              Is &ldquo;fast charging&rdquo; really fast?
            </span>{" "}
            What if 10&ndash;30 minutes was enough?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-body-lg text-ink-500 max-w-[46ch]"
          >
            Chargers advertise big numbers your car can&apos;t actually use.{" "}
            <span className="text-ink-900">
              We advertise what we deliver — and deliver what you need.
            </span>
          </motion.p>

          {/* Power Reality Check */}
          <motion.div
            variants={itemVariants}
            className="mt-10 max-w-2xl mx-auto"
          >
          </motion.div>
        </motion.div>

        {/* Visual Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {/* Traditional Experience — full-bleed photo card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative min-h-[460px] lg:min-h-[560px] rounded-lg overflow-hidden border border-white/10"
            >
              <Image
                src="/images/waiting-v3.webp"
                alt="Traditional EV charging - waiting outside"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Window gradient — readable top (badge) + bottom (list), photo in the middle */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(10,25,47,0.82) 0%, rgba(10,25,47,0.25) 24%, rgba(10,25,47,0.32) 50%, rgba(10,25,47,0.82) 76%, rgba(10,25,47,0.97) 100%)",
                }}
              />

              <div className="relative flex h-full min-h-[460px] lg:min-h-[560px] flex-col justify-between p-6 lg:p-7">
                <div>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-hero/50 text-white/90 backdrop-blur-md border border-white/15">
                    Traditional Charging
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hero/50 border border-white/15 backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-amber-300" />
                    <span className="text-amber-300 text-sm font-semibold">
                      30-40 min
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Variable kWh pricing — final cost unclear",
                      "Self-service — handle everything yourself",
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-start gap-3 text-white/85"
                      >
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-red-300" />
                        </div>
                        <span className="text-[15px] leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* HubCharge Experience — full-bleed photo card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative min-h-[460px] lg:min-h-[560px] rounded-lg overflow-hidden border border-brand/25"
            >
              <Image
                src="/images/valet-greet-v2.webp"
                alt="HubCharge full-service EV charging"
                fill
                className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Window gradient + subtle brand glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(10,25,47,0.78) 0%, rgba(10,25,47,0.18) 24%, rgba(10,25,47,0.28) 50%, rgba(10,25,47,0.82) 76%, rgba(10,25,47,0.97) 100%)",
                }}
              />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand/15 to-transparent pointer-events-none" />

              <div className="relative flex h-full min-h-[460px] lg:min-h-[560px] flex-col justify-between p-6 lg:p-7">
                <div>
                  <span className="px-3 py-1.5 rounded-full text-overline text-white bg-white/15 backdrop-blur-md border border-white/25">
                    HubCharge™
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/25 border border-brand/40 backdrop-blur-sm">
                    <Zap className="h-3.5 w-3.5 text-brand" />
                    <span className="text-brand text-sm font-semibold">
                      10 min • add up to 100 mi
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      {
                        text: "Flat rate — know exactly what you'll pay",
                        asterisk: false,
                      },
                      {
                        text: "Stay in your car — attendant handles it",
                        asterisk: true,
                      },
                      {
                        text: "Quick top-up — get the miles you need, go",
                        asterisk: false,
                      },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        className="flex items-start gap-3 text-white/90"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-300" />
                        </div>
                        <span className="text-[15px] leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          {item.text}
                          {item.asterisk && (
                            <span className="text-red-400">*</span>
                          )}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            {/* <p className="text-[#475569] text-sm">
              Built for drivers who need a quick charge — not a full battery.
            </p> */}
          </motion.div>
        </motion.div>

        {/* Arrow Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3 mb-16"
        >
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            There&apos;s a better way
          </p>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 122, 0, 0.3)",
                "0 0 40px rgba(255, 122, 0, 0.6)",
                "0 0 20px rgba(255, 122, 0, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-[#FF9433] flex items-center justify-center"
          >
            <ArrowDown className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* DARK band — "The HubCharge Difference" + How It Works (photo background) */}
      <div className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/charging-service-v2.webp"
            alt=""
            aria-hidden
            fill
            className="object-cover opacity-[0.18]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.86) 50%, rgba(10,25,47,0.97) 100%)",
            }}
          />
        </div>
        <div className="relative section-container py-20 lg:py-28">
          {/* SECTION 2: The HubCharge Difference */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="mb-6">
              <p className="text-overline text-white/55">
                The HubCharge™ difference
              </p>
              <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
            </div>

            <h2 className="text-h2 text-white mb-6 max-w-[26ch]">
              <span className="text-on-dark/60">10 minutes. Up to 100 miles.</span>{" "}
              Full-service convenience*
            </h2>

            <p className="text-lg text-muted-dark max-w-xl">
              Need enough charge to get home or to your destination?
              <span className="text-on-dark font-medium"> Top up and go.</span>
            </p>
          </motion.div>

          {/* How It Works - Simple Steps */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-overline text-on-dark/55 mb-8"
            >
              How it works
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {solutionSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="group/card relative min-h-[420px] lg:min-h-[460px] rounded-lg overflow-hidden border border-white/10 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      className="object-cover transition-transform duration-[800ms] group-hover/card:scale-[1.05]"
                      style={{ objectPosition: step.pos }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Window gradient — number visible top, content readable bottom */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(10,25,47,0.55) 0%, rgba(10,25,47,0.1) 26%, rgba(10,25,47,0.5) 58%, rgba(10,25,47,0.96) 100%)",
                      }}
                    />

                    <div className="relative flex h-full min-h-[420px] lg:min-h-[460px] flex-col justify-between p-6">
                      {/* Top: step number + hover arrow */}
                      <div className="flex items-start justify-between">
                        <span className="text-5xl font-black text-white/70 transition-colors group-hover/card:text-brand">
                          {step.number}
                        </span>
                        <ArrowRight className="mt-2 h-5 w-5 text-brand opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0" />
                      </div>

                      {/* Bottom: title, desc, highlight */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          {step.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/30 px-3 py-1.5 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 text-brand" />
                            <span className="text-xs font-medium text-brand">
                              {step.highlight}
                            </span>
                          </div>
                          {i === 2 && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1.5 text-xs font-semibold text-brand border border-brand/30 backdrop-blur-sm">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Service Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <p className="text-muted-dark text-sm">
                <span className="text-red-500">*</span>Full-service attendant
                available at select locations.{" "}
                <a
                  href="#locations"
                  className="text-brand hover:text-[#FF9433] underline underline-offset-2"
                >
                  Check availability
                </a>
              </p>
            </motion.div>
          </div>

          {/* Transition to Journey */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 link text-lg font-semibold group"
            >
              See the full charging experience
              <motion.span
                              >
                <ArrowDown className="h-5 w-5" />
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
