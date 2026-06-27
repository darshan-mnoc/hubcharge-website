"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Clock,
  Plus,
  Coffee,
  Utensils,
  Sparkles,
  Check,
  ArrowRight,
  Battery,
} from "lucide-react";

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      data-reveal
      className="relative section-padding bg-surface-warm overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#FF7A00]/10 rounded-full blur-[70px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[60px]" />

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
            <span className="text-sm font-semibold uppercase tracking-wider">
              Simple Pricing
            </span>
          </div>

          <h2 className="heading-section text-gray-900 mb-6">
            Charging made
            <span className="text-gradient text-glow"> simple</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            One flat rate. Attendant service at select locations
            <span className="text-red-500">*</span>
          </p>
        </motion.div>

        {/* Main Pricing Card - Clean Design */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative overflow-hidden rounded-3xl border border-gray-200">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#FF7A00]/8 rounded-full blur-[60px]" />

            <div className="relative p-10 lg:p-14">
              {/* Price Hero - Centered */}
              <div className="text-center mb-12">
                <p className="text-gray-500 text-sm uppercase tracking-[0.15em] mb-6">
                  10-Minute Charge Session
                </p>
                <div className="flex items-start justify-center">
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 40px rgba(255, 122, 0, 0.3)",
                        "0 0 80px rgba(255, 122, 0, 0.5)",
                        "0 0 40px rgba(255, 122, 0, 0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-8xl lg:text-9xl font-black text-[#FF7A00]"
                  >
                    $12.50
                  </motion.span>
                  <span className="text-red-500 text-xl font-bold mt-4 ml-1">*</span>
                </div>
                <div className="flex items-center justify-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-5 w-5 text-[#FF7A00]" />
                    <span className="font-medium">10 minutes</span>
                  </div>
                  <div className="w-px h-5 bg-[#334155]" />
                  <div className="flex items-center gap-2 text-gray-500">
                    <Zap className="h-5 w-5 text-[#FF7A00]" />
                    <span className="font-medium">Up to 100 miles</span>
                  </div>
                </div>
              </div>

              {/* Two Cards */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Extension Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#FF7A00]/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-gray-900 font-semibold text-lg mb-1">Need more time?</h4>
                      <p className="text-gray-500 text-sm">Add 5-minute extensions as needed</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-start">
                        <span className="text-3xl font-bold text-[#FF7A00]">$3</span>
                        <span className="text-red-500 text-xs mt-1 ml-0.5">*</span>
                      </div>
                      <p className="text-gray-400 text-xs">per 5 min</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <p className="text-gray-400 text-sm">
                      Add up to 4 extensions for a maximum 30-minute session
                    </p>
                  </div>
                </motion.div>

                {/* What's Included Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-green-500/30 transition-all"
                >
                  <h4 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-1">
                    Full-Service Included
                    <span className="text-red-500 text-sm">*</span>
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Attendant greets you at arrival",
                      "We plug in your car",
                      "Pay at your window",
                      "We unplug when you're ready",
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 text-gray-500 text-sm"
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" strokeWidth={2.5} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-5 text-center text-sm text-gray-400"
          >
            <span className="text-red-500">*</span> Prices may vary. Full-service attendant at select locations.
          </motion.p>
        </motion.div>

        {/* Promo Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Promo Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4f3f2]/10 rounded-full blur-2xl" />

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4f3f2]/20 text-[#f4f3f2] backdrop-blur-sm border border-[#f4f3f2]/30">
                Coming Soon
              </span>
            </div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-14 h-14 bg-[#f4f3f2]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-7 w-7 text-[#f4f3f2]" />
                </div>
                <div className="w-14 h-14 bg-[#f4f3f2]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-7 w-7 text-[#f4f3f2]" />
                </div>
              </motion.div>
              <h4 className="text-2xl lg:text-3xl font-bold text-[#f4f3f2] mb-3">
                Charge Up
              </h4>
              <p className="text-[#f4f3f2]/90 text-lg mb-6">
                Get a <span className="font-bold">FREE coffee</span> or snack
                with every charging session
              </p>
              <motion.a
                href="#locations"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("locations");
                  if (element) {
                    const yOffset = 100;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#f4f3f2] text-green-600 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                Find a Location
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Promo Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-[#FF7A00]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f4f3f2]/10 rounded-full blur-2xl" />

            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f4f3f2]/20 text-[#f4f3f2] backdrop-blur-sm border border-[#f4f3f2]/30">
                Coming Soon
              </span>
            </div>

            <div className="relative">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-14 h-14 bg-[#f4f3f2]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Utensils className="h-7 w-7 text-[#f4f3f2]" />
                </div>
                <div className="w-14 h-14 bg-[#f4f3f2]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Coffee className="h-7 w-7 text-[#f4f3f2]" />
                </div>
              </motion.div>
              <h4 className="text-2xl lg:text-3xl font-bold text-[#f4f3f2] mb-3">
                Order Food
              </h4>
              <p className="text-[#f4f3f2]/90 text-lg mb-6">
                Get your <span className="font-bold">charge FREE</span> when you
                order $15+ of food or drinks
              </p>
              <motion.a
                href="#locations"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("locations");
                  if (element) {
                    const yOffset = 1000;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#f4f3f2] text-[#FF7A00] px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                See What's Available
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
          <p className="text-gray-400 text-lg">
            <span className="text-gray-600 font-medium">Charge & Chill.</span>{" "}
            It's that simple.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
