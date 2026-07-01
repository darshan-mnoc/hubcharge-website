"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
    image: "/images/valet-greet-v2.png",
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
    image: "/images/charging-service-v2.png",
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
    image: "/images/coffee-delivery-v3.png",
    // charger sits on the left of the frame
    pos: "24% 50%",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

import { easeOut } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="story"
      data-reveal
      className="relative bg-surface overflow-hidden"
    >
      {/* White top: gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF9433]/5 rounded-full blur-[70px]" />

      <div className="section-container relative pt-24 lg:pt-32 pb-16">
        {/* SECTION 1: Rethink Fast Charging */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 mb-8"
          >
            <Zap className="h-4 w-4 text-[#FF7A00]" />
            <span className="text-[#FF7A00] text-sm font-semibold uppercase tracking-wider">
              Rethink Fast Charging
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-[1.15]"
          >
            Is "fast charging" really fast?
            <br />
            <span className="text-gradient text-glow">
              What if 10-30 minutes was enough?
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Chargers advertise big numbers your car can't actually use.{" "}
            <span className="text-gray-800">
              We advertise what we deliver — and deliver what you need.
            </span>
          </motion.p>

          {/* Power Reality Check */}
          <motion.div
            variants={itemVariants}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Others */}
              {/* <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  Other Networks
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-400 text-sm line-through">
                    250-350 kW
                  </span>
                  <span className="text-gray-500 text-xs">advertised</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-800 text-lg font-semibold">
                    150-200 kW
                  </span>
                  <span className="text-gray-500 text-xs">actual</span>
                </div>
              </div> */}

              {/* HubCharge */}
              {/* <div className="p-4 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20">
                <p className="text-[#FF7A00] text-xs uppercase tracking-wider mb-2">
                  HubCharge
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-600 text-sm">180 kW+</span>
                  <span className="text-gray-500 text-xs">advertised</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#FF7A00] text-lg font-semibold">
                    125-180 kW
                  </span>
                  <span className="text-gray-500 text-xs">actual</span>
                </div>
              </div> */}
            </div>
            {/* <p className="text-center text-gray-400 text-sm mt-4">
              What we advertise is what your car actually gets.
            </p> */}
          </motion.div>
        </motion.div>

        {/* Visual Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {/* Traditional Experience — full-bleed photo card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="group relative min-h-[460px] lg:min-h-[560px] rounded-3xl overflow-hidden border border-white/10"
            >
              <Image
                src="/images/waiting-v3.png"
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
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#0A192F]/50 text-white/90 backdrop-blur-md border border-white/15">
                    Traditional Charging
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A192F]/50 border border-white/15 backdrop-blur-sm">
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
              className="group relative min-h-[460px] lg:min-h-[560px] rounded-3xl overflow-hidden border border-[#FF7A00]/25"
            >
              <Image
                src="/images/valet-greet-v2.png"
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
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FF7A00]/15 to-transparent pointer-events-none" />

              <div className="relative flex h-full min-h-[460px] lg:min-h-[560px] flex-col justify-between p-6 lg:p-7">
                <div>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#FF7A00]/25 text-[#FF7A00] backdrop-blur-md border border-[#FF7A00]/40">
                    HubCharge®
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7A00]/25 border border-[#FF7A00]/40 backdrop-blur-sm">
                    <Zap className="h-3.5 w-3.5 text-[#FF7A00]" />
                    <span className="text-[#FF7A00] text-sm font-semibold">
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
            className="text-center mt-8"
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
            There's a better way
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
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF9433] flex items-center justify-center"
          >
            <ArrowDown className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* DARK band — "The HubCharge Difference" + How It Works (photo background) */}
      <div className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/charging-service-v2.png"
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
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                The HubCharge® Difference
              </span>
            </div>

            <h2 className="heading-section text-on-dark mb-6 leading-tight">
              10 minutes. Up to 100 miles.
              <br />
              <span className="text-gradient text-glow">
                Full-service convenience*
              </span>
            </h2>

            <p className="text-lg text-muted-dark max-w-xl mx-auto">
              Need enough charge to get home or to your destination?
              <span className="text-on-dark font-medium"> Top up and go.</span>
            </p>
          </motion.div>

          {/* How It Works - Simple Steps */}
          <div className="max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-muted-dark text-sm uppercase tracking-widest mb-8"
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
                  <div className="group/card relative min-h-[420px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-white/10 hover:border-[#FF7A00]/40 hover:-translate-y-1 transition-all duration-300">
                    <Image
                      src={step.image}
                      alt="HubCharge EV charging service"
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
                        <span className="text-5xl font-black text-white/70 transition-colors group-hover/card:text-[#FF7A00]">
                          {step.number}
                        </span>
                        <ArrowRight className="mt-2 h-5 w-5 text-[#FF7A00] opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0" />
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
                          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/30 px-3 py-1.5 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 text-[#FF7A00]" />
                            <span className="text-xs font-medium text-[#FF7A00]">
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
              className="mt-10 text-center"
            >
              <p className="text-muted-dark text-sm">
                <span className="text-red-500">*</span>Full-service attendant
                available at select locations.{" "}
                <a
                  href="#locations"
                  className="text-[#FF7A00] hover:text-[#FF9433] underline underline-offset-2"
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
            className="text-center mt-16"
          >
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 link text-lg font-semibold group"
            >
              See the full charging experience
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
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
