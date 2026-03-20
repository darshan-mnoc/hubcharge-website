"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Clock, Plus, Coffee, Utensils, Sparkles, Check, ArrowRight, Battery } from "lucide-react";

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative section-padding bg-[#0a0a0a] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[150px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Battery className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Simple Pricing</span>
          </div>

          <h2 className="heading-section text-white mb-6">
            Charging made
            <span className="text-gradient text-glow"> simple</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            One flat rate. No surprises. Attendant service included with every charge.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="relative card p-8 lg:p-12 overflow-hidden gradient-border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-[80px]" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              {/* Left - Price */}
              <div className="text-center lg:text-left">
                <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Base Charge Session</p>
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="flex items-baseline justify-center lg:justify-start gap-2 mb-4"
                >
                  <motion.span
                    animate={{ textShadow: ["0 0 20px rgba(244, 130, 69, 0.3)", "0 0 40px rgba(244, 130, 69, 0.6)", "0 0 20px rgba(244, 130, 69, 0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl lg:text-8xl font-black text-orange-400"
                  >
                    $12
                  </motion.span>
                  <span className="text-4xl lg:text-5xl font-bold text-amber-400">.50</span>
                </motion.div>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <div className="flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-white font-medium">10 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10">
                    <Zap className="h-4 w-4 text-green-400" />
                    <span className="text-white font-medium">100 miles</span>
                  </div>
                </div>
                <p className="text-white/40 text-sm">Full attendant service included. We handle everything.</p>
              </div>

              {/* Right - What's Included */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Everything Included:</h3>
                <ul className="space-y-3">
                  {[
                    "Attendant greets you at arrival",
                    "They plug in your car",
                    "Payment at your window",
                    "Attendant unplugs when ready",
                    "Order food to your car",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-white/70"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Extensions Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">Need More Time?</h3>
            <p className="text-white/50">Add up to 4 extensions of 5 minutes each</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((ext, i) => (
              <motion.div
                key={ext}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="card p-5 text-center cursor-pointer group"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 mx-auto glass rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500/20"
                >
                  <Plus className="h-5 w-5 text-orange-400" />
                </motion.div>
                <p className="text-2xl font-bold text-white">$3</p>
                <p className="text-white/50 text-sm">+5 minutes</p>
                <p className="text-xs text-white/30 mt-1">Extension {ext}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-6 glass rounded-xl p-4 max-w-lg mx-auto border border-white/10">
            <p className="text-white/60">
              <span className="font-semibold text-white">Maximum session:</span> 30 minutes =
              <span className="text-orange-400 font-bold"> $24.50</span>
            </p>
          </div>
        </motion.div>

        {/* Promo Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Promo Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Utensils className="h-7 w-7 text-white" />
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Coffee className="h-7 w-7 text-white" />
                </div>
              </motion.div>
              <h4 className="text-2xl lg:text-3xl font-bold text-white mb-3">Order Food</h4>
              <p className="text-white/90 text-lg mb-6">
                Get your <span className="font-bold">charge FREE</span> when you order $15+ of food or drinks
              </p>
              <motion.a
                href="#lifestyle"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                See What's Available
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Promo Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </motion.div>
              <h4 className="text-2xl lg:text-3xl font-bold text-white mb-3">Charge Up</h4>
              <p className="text-white/90 text-lg mb-6">
                Get a <span className="font-bold">FREE coffee</span> or snack with every charging session
              </p>
              <motion.a
                href="#locations"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                Find a Location
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/30 text-lg">
            <span className="text-white/50 font-medium">Charge & Chill.</span> It's that simple.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
