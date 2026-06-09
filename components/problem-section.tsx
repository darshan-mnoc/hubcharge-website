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
      className="relative section-padding bg-[#262322] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff6b2c]/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f94d00]/5 rounded-full blur-[200px]" />

      <div className="section-container relative">
        {/* SECTION 1: Rethink Fast Charging */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f94d00]/10 border border-[#f94d00]/20 mb-8"
          >
            <Zap className="h-4 w-4 text-[#f94d00]" />
            <span className="text-[#f94d00] text-sm font-semibold uppercase tracking-wider">
              Rethink Fast Charging
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f4f3f2] mb-6 leading-[1.15]"
          >
            Is "fast charging" really fast?
            <br />
            <span className="text-gradient text-glow">
              What if 10-30 minutes was enough?
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg text-[#877f78] max-w-2xl mx-auto"
          >
            Chargers advertise big numbers your car can't actually use.{" "}
            <span className="text-[#f4f3f2]/80">
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
              <div className="p-4 rounded-xl bg-[#f4f3f2]/[0.03] border border-[#3a3533]">
                <p className="text-[#59524f] text-xs uppercase tracking-wider mb-2">
                  Other Networks
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[#f4f3f2]/30 text-sm line-through">
                    250-350 kW
                  </span>
                  <span className="text-[#59524f] text-xs">advertised</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#f4f3f2]/80 text-lg font-semibold">
                    150-200 kW
                  </span>
                  <span className="text-[#59524f] text-xs">actual</span>
                </div>
              </div>

              {/* HubCharge */}
              <div className="p-4 rounded-xl bg-[#f94d00]/10 border border-[#f94d00]/20">
                <p className="text-[#f94d00] text-xs uppercase tracking-wider mb-2">
                  HubCharge
                </p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[#877f78] text-sm">180 kW+</span>
                  <span className="text-[#59524f] text-xs">advertised</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#f94d00] text-lg font-semibold">
                    125-180 kW
                  </span>
                  <span className="text-[#59524f] text-xs">actual</span>
                </div>
              </div>
            </div>
            {/* <p className="text-center text-[#f4f3f2]/30 text-sm mt-4">
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
            {/* Traditional Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden group"
              style={{
                background:
                  "linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(15,15,15,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Image */}
              <div className="relative h-[280px] lg:h-[320px] overflow-hidden">
                <Image
                  src="/images/waiting-v3.png"
                  alt="Traditional EV charging - waiting outside"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/30 to-transparent" />

                {/* Badge - overlapping image */}
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-black/40 text-[#f4f3f2]/80 backdrop-blur-md border border-[#3a3533]">
                    Traditional Charging
                  </span>
                </div>

                {/* Time badge on image */}
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff6b2c]/20 border border-[#ff6b2c]/30 backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-semibold">
                      30-40 min
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-7">
                <ul className="space-y-3">
                  {[
                    "Variable kWh pricing — final cost unclear",
                    // "Waiting outside or sitting in your car",
                    "Self-service — handle everything yourself",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="flex items-start gap-3 text-[#877f78]"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="h-3 w-3 text-red-400/80" />
                      </div>
                      <span className="text-[15px] leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* HubCharge Experience */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden group"
              style={{
                background:
                  "linear-gradient(180deg, rgba(249,115,22,0.08) 0%, rgba(15,15,15,0.95) 100%)",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              {/* Glow effects */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#f94d00]/15 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f94d00]/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Image */}
              <div className="relative h-[280px] lg:h-[320px] overflow-hidden">
                <Image
                  src="/images/valet-greet-v2.png"
                  alt="HubCharge full-service EV charging"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-[#f94d00]/20 text-[#f94d00] backdrop-blur-md border border-[#f94d00]/30">
                    HubCharge
                  </span>
                </div>

                {/* Time badge on image */}
                <div className="absolute bottom-5 left-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f94d00]/20 border border-[#f94d00]/30 backdrop-blur-sm">
                    <Zap className="h-3.5 w-3.5 text-[#f94d00]" />
                    <span className="text-[#f94d00] text-sm font-semibold">
                      10 min • add up to 100 mi
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-7">
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
                      className="flex items-start gap-3 text-[#f4f3f2]/80"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-[15px] leading-relaxed">
                        {item.text}
                        {item.asterisk && (
                          <span className="text-red-500">*</span>
                        )}
                      </span>
                    </motion.li>
                  ))}
                </ul>
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
            {/* <p className="text-[#59524f] text-sm">
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
          <p className="text-[#59524f] text-sm uppercase tracking-widest">
            There's a better way
          </p>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(249, 77, 0, 0.3)",
                "0 0 40px rgba(249, 77, 0, 0.6)",
                "0 0 20px rgba(249, 77, 0, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f94d00] to-[#ff6b2c] flex items-center justify-center"
          >
            <ArrowDown className="h-6 w-6 text-[#f4f3f2]" />
          </motion.div>
        </motion.div>

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
              The HubCharge Difference
            </span>
          </div>

          <h2 className="heading-section text-[#f4f3f2] mb-6 leading-tight">
            10 minutes. Up to 100 miles.
            <br />
            <span className="text-gradient text-glow">
              Full-service convenience*
            </span>
          </h2>

          <p className="text-lg text-[#877f78] max-w-xl mx-auto">
            Need enough charge to get home or to your destination?
            <span className="text-[#f4f3f2]/80 font-medium"> Top up and go.</span>
          </p>
        </motion.div>

        {/* How It Works - Simple Steps */}
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[#59524f] text-sm uppercase tracking-widest mb-8"
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
                <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#f94d00]/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 lg:h-52 overflow-hidden">
                    <Image
                      src={step.image}
                      alt={`HubCharge EV charging service - ${step.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#262322] via-[#0a0a0a]/40 to-transparent" />
                    {/* Step Number */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                      className="absolute top-4 left-4"
                    >
                      <span className="text-5xl font-black text-[#f4f3f2]/20 group-hover:text-[#f94d00]/40 transition-colors">
                        {step.number}
                      </span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-bold text-[#f4f3f2] mb-3 group-hover:text-orange-50 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[#877f78] leading-relaxed mb-4">
                      {step.desc}
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f94d00]/10 border border-[#f94d00]/20"
                    >
                      <Sparkles className="h-3 w-3 text-[#f94d00]" />
                      <span className="text-xs font-medium text-[#f94d00]">
                        {step.highlight}
                      </span>
                    </motion.div>

                    {i === 2 && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-2 mt-2 ml-1 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30"
                      >
                        Coming Soon
                      </motion.div>
                    )}
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-[#f94d00]" />
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
            <p className="text-[#59524f] text-sm">
              <span className="text-red-500">*</span>Full-service attendant
              available at select locations.{" "}
              <a
                href="#locations"
                className="text-[#f94d00] hover:text-orange-300 underline underline-offset-2"
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
    </section>
  );
}
