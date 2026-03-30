"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, Zap, Clock, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import WaitImg from "../public/images/waiting-v3.png";

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
    title: "We Handle Charging",
    desc: "Payment, plug-in, monitoring — all taken care of. Stay in your car.",
    highlight: "Zero effort required",
    image: "/images/charging-service-v2.png",
  },
  {
    number: "03",
    title: "Get Things Done",
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
      className="relative section-padding bg-[#0a0a0a] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[200px]" />

      <div className="section-container relative">
        {/* The Problem - Clear & Direct */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-amber-500"
            />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">
              The EV Charging Problem
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="heading-section text-white mb-6 leading-tight"
          >
            30 minutes at a "fast" charger.
            <br />
            <span className="text-gradient text-glow">What do you do with that time?</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Most DC fast chargers take <span className="text-white font-medium">30-40 minutes</span> to reach 80%.
            That's half an hour standing around, scrolling your phone, waiting.
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-white/80 font-medium mt-4"
          >
            What if that time could actually be useful?
          </motion.p>
        </motion.div>

        {/* Image with Context */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto mb-20"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10">
            <div className="aspect-[16/9] relative">
              <Image
                src={WaitImg}
                alt="EV driver waiting at traditional charging station - the problem HubCharge solves"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">30+ MIN WAIT</span>
                </div>
              </motion.div>
              <p className="text-white text-lg lg:text-xl font-medium">
                Sound familiar?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Arrow Divider with Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 mb-20"
        >
          <p className="text-white/40 text-sm uppercase tracking-widest">There's a better way</p>
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(244, 130, 69, 0.3)",
                "0 0 40px rgba(244, 130, 69, 0.6)",
                "0 0 20px rgba(244, 130, 69, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"
          >
            <ArrowDown className="h-7 w-7 text-white" />
          </motion.div>
        </motion.div>

        {/* The HubCharge Solution */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              The HubCharge Difference
            </span>
          </div>

          <h2 className="heading-section text-white mb-6 leading-tight">
            10 minutes. 100 miles.
            <br />
            <span className="text-gradient text-glow">
              Make every minute count.
            </span>
          </h2>

          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Ultra-fast <span className="text-white font-medium">180kW DC charging</span> with full-service convenience.
            Your car charges while you get things done.
          </p>
        </motion.div>

        {/* How It Works - Simple Steps */}
        <div className="max-w-5xl mx-auto">
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
                <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 lg:h-52 overflow-hidden">
                    <Image
                      src={step.image}
                      alt={`HubCharge EV charging service - ${step.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                    {/* Step Number on Image */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                      className="absolute top-4 left-4"
                    >
                      <span className="text-5xl font-black text-white/20 group-hover:text-orange-500/40 transition-colors">
                        {step.number}
                      </span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-50 transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/60 leading-relaxed mb-4">
                      {step.desc}
                    </p>

                    {/* Highlight Tag */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
                    >
                      <Sparkles className="h-3 w-3 text-orange-400" />
                      <span className="text-xs font-medium text-orange-400">
                        {step.highlight}
                      </span>
                    </motion.div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-orange-400" />
                  </div>
                </div>

                {/* Connector Line (desktop only) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-4 w-8 h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>

          {/* General Service Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-white/40 text-sm">
              Attendant service available at select locations. Visit our{" "}
              <a href="#locations" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">
                locations page
              </a>{" "}
              to see what's available near you.
            </p>
          </motion.div>
        </div>

        {/* Transition to Journey */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-white/30 text-sm uppercase tracking-widest mb-4">
            See it in action
          </p>
          <motion.a
            href="#how-it-works"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 link text-lg font-semibold group"
          >
            Experience your 10-minute charging journey
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
