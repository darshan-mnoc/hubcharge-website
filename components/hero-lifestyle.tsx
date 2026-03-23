"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1] as [number, number, number, number],
    },
  },
};

export function HeroLifestyle() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.9], [1, 1, 0]);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/home.png"
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <img
          src="/images/home.png"
          alt="HubCharge - Premium EV Charging"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80" />
      </motion.div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500 rounded-full blur-[200px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[150px]"
      />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 badge badge-primary mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="h-4 w-4 text-orange-400" />
          </motion.div>
          <span className="text-sm font-medium">Full-Service EV Charging</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="heading-display text-white mb-8"
        >
          We charge your car.
          <br />
          <span className="text-gradient text-glow">You enjoy your time.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-body-lg mb-12 max-w-2xl mx-auto"
        >
          Our attendant handles everything — plug in, charge, unplug.
          <span className="text-white font-medium">
            {" "}
            You never leave your car.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.a
            href="#story"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(244, 130, 69, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group btn btn-primary btn-lg"
          >
            See How It Works
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#locations"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline btn-lg"
          >
            Find a Location
          </motion.a>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={itemVariants}
          className="inline-flex flex-wrap justify-center gap-6 lg:gap-10 glass-card px-8 py-6"
        >
          {[
            { value: "180kW", label: "DC Fast Charging" },
            { value: "10 min", label: "100 Miles" },
            { value: "24/7", label: "Attendant Service" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.15 }}
              className="text-center px-4"
            >
              <p className="text-2xl lg:text-3xl font-bold text-orange-400 text-glow mb-1">
                {stat.value}
              </p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-orange-400" />
        </motion.div>
      </motion.div>

      {/* Bottom Energy Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
    </section>
  );
}
