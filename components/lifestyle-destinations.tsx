"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Utensils,
  Coffee,
  ShoppingBag,
  Sparkles,
  Car,
  ArrowRight,
  Gift,
  Zap,
  Clock,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Coffee,
    title: "Coffee & Drinks",
    desc: "Fresh coffee, boba, smoothies delivered hot to your window.",
    image: "/images/lifestyle-coffee-v2.png",
    color: "from-amber-500",
  },
  {
    icon: Utensils,
    title: "Food & Meals",
    desc: "Breakfast, lunch, dinner — from local restaurants to your car.",
    image: "/images/lifestyle-food-v2.png",
    color: "from-orange-500",
  },
  {
    icon: ShoppingBag,
    title: "Groceries & Errands",
    desc: "Quick essentials, pharmacy runs, anything you need picked up.",
    image: "/images/lifestyle-groceries-v2.png",
    color: "from-blue-500",
  },
  {
    icon: Sparkles,
    title: "Services",
    desc: "Car detailing, dry cleaning pickup — make your 10 minutes count.",
    image: "/images/lifestyle-services-v2.png",
    color: "from-purple-500",
  },
];

// Categories of services - clear and straightforward
const serviceCategories = [
  { label: "Food & Drinks", icon: Coffee, desc: "Coffee, meals, snacks" },
  { label: "Errands", icon: ShoppingBag, desc: "Groceries, packages" },
  { label: "Car Care", icon: Sparkles, desc: "Detailing, cleaning" },
  { label: "And more", icon: Gift, desc: "New services added regularly" },
];

export function LifestyleDestinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="lifestyle"
      className="relative section-padding bg-[#1a1918] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#f94d00]/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Car className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              More Than Charging
            </span>
          </div>

          <h2 className="heading-section text-[#f4f3f2] mb-6">
            Charge your car, and
            <br />
            <span className="text-gradient text-glow">get things done.</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Why waste time waiting? Order food, grab coffee, or run errands —
            all delivered to your car window while your EV charges.
            <span className="text-[#f4f3f2]/80 font-medium">
              {" "}
              Stay in your car. We bring it to you.
            </span>
          </p>
        </motion.div>

        {/* Hero Visual - Coming Soon Excitement */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative card p-8 lg:p-12 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f94d00]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Car icon with charging animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 glass rounded-3xl flex items-center justify-center border border-[#3a3533]">
                    <Car
                      className="h-20 w-20 lg:h-24 lg:w-24 text-[#f94d00]"
                      strokeWidth={1}
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-4 bg-[#f94d00] rounded-full blur-2xl -z-10"
                  />
                  {/* Charging indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Zap className="h-4 w-4 text-[#f4f3f2]" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="hidden lg:flex items-center justify-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-20 h-[2px] energy-line" />
                  <ArrowRight className="h-8 w-8 text-[#f94d00]" />
                </div>
              </motion.div>

              {/* Services delivered to your car */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                  <p className="text-[#f94d00] text-sm font-semibold uppercase tracking-widest">
                    While you charge
                  </p>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold border border-purple-500/30"
                  >
                    Coming Soon
                  </motion.span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#f4f3f2] mb-4">
                  Services delivered to your car
                </h3>
                <p className="text-[#877f78] mb-6 max-w-md">
                  Food, coffee, errands — brought right to your window while
                  your EV charges. No waiting, no walking.
                </p>

                {/* Interactive service categories */}
                <div className="grid grid-cols-2 gap-3">
                  {serviceCategories.map((category, i) => (
                    <motion.div
                      key={category.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group relative glass rounded-xl p-4 border border-[#3a3533] hover:border-[#f94d00]/30 cursor-pointer transition-all overflow-hidden"
                    >
                      {/* Hover glow */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#f94d00]/10 to-transparent"
                      />

                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f94d00]/20 flex items-center justify-center group-hover:bg-[#f94d00]/30 transition-colors">
                          <category.icon className="h-5 w-5 text-[#f94d00]" />
                        </div>
                        <div>
                          <p className="text-[#f4f3f2] font-semibold text-sm group-hover:text-[#f4f3f2] transition-colors">
                            {category.label}
                          </p>
                          <p className="text-[#59524f] text-xs group-hover:text-[#877f78] transition-colors">
                            {category.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom teaser */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-6 border-t border-[#3a3533] text-center"
            >
              <div className="flex items-center justify-center gap-2 text-[#59524f] text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  Full lifestyle services launching soon at select locations
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA - Get notified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <motion.a
              href="#locations"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(249, 77, 0, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg"
            >
              Find a Station
              <ArrowRight className="h-5 w-5" />
            </motion.a>
            <span className="text-[#59524f] text-sm hidden sm:block">or</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[#f94d00] hover:text-[#ff6b2c] text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Get notified when services launch →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
