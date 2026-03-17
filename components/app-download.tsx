"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Smartphone, MapPin, Bell, Zap, Star, Battery } from "lucide-react";

const features = [
  { icon: MapPin, title: "Find Hubs", description: "Real-time availability" },
  { icon: Bell, title: "Smart Alerts", description: "Know when you're ready" },
  // { icon: Battery, title: "Track Miles", description: "Not percentages" },
];

export function AppDownload() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      ref={sectionRef}
      id="app"
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500" />

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[200px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-black rounded-full blur-[150px]"
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20"
            >
              <Smartphone className="h-4 w-4 text-white" />
              <span className="text-white text-sm font-medium">
                Download the App
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Your time companion
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed"
            >
              Track your charge, discover experiences nearby, and make every
              minute count—all from one beautiful app.
            </motion.p>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="grid sm:grid-cols-3 gap-4 mb-10"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 cursor-pointer"
                >
                  <feature.icon
                    className="h-6 w-6 text-white mb-3"
                    strokeWidth={1.5}
                  />
                  <h4 className="text-white font-semibold mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-white/60 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Download Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold shadow-xl"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Download on the</p>
                  <p className="text-sm font-bold -mt-0.5">App Store</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold shadow-xl"
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Get it on</p>
                  <p className="text-sm font-bold -mt-0.5">Google Play</p>
                </div>
              </motion.a>
            </motion.div>

            {/* Rating */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 text-white fill-white" />
                  </motion.div>
                ))}
              </div>
              <p className="text-white/80 text-sm">
                <span className="font-semibold text-white">4.9</span> from
                12,000+ reviews
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotate: 3 }}
            animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone Frame */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border border-white/20"
              >
                {/* Screen */}
                <div className="w-full h-full bg-gray-950 rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-3">
                    <span className="text-white text-xs font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-white/50 rounded-sm" />
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="px-5 py-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-white/40 text-sm">Good morning</p>
                        <p className="text-white text-xl font-bold">Sarah</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500" />
                    </div>

                    {/* Active Charge Card */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(244, 130, 69, 0.3)",
                          "0 0 40px rgba(244, 130, 69, 0.5)",
                          "0 0 20px rgba(244, 130, 69, 0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative overflow-hidden rounded-2xl p-4 mb-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-white" />
                            <span className="text-white font-semibold">
                              Charging
                            </span>
                          </div>
                          <span className="text-white/80 text-sm">~4 min</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                          67 mi
                        </div>
                        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: ["60%", "75%", "60%"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="h-full bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Nearby */}
                    <p className="text-white/40 text-sm mb-3">
                      Nearby experiences
                    </p>
                    <div className="space-y-2">
                      {[
                        { emoji: "☕", name: "Blue Bottle", time: "2 min" },
                        { emoji: "🥗", name: "Farm Kitchen", time: "3 min" },
                      ].map((place, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <span className="text-lg">{place.emoji}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {place.name}
                            </p>
                            <p className="text-white/30 text-xs">
                              {place.time} walk
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -top-4 -left-4"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-[#111] rounded-2xl p-3 shadow-xl border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                    >
                      <Zap className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-white text-sm font-semibold">Ready!</p>
                      <p className="text-white/40 text-xs">+75 miles</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
