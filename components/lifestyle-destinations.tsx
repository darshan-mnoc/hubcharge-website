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
      className="relative section-padding bg-[#080808] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px]" />
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

          <h2 className="heading-section text-white mb-6">
            Charge your car, and
            <br />
            <span className="text-gradient text-glow">get things done.</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Why waste time waiting? Order food, grab coffee, or run errands —
            all delivered to your car window while your EV charges.
            <span className="text-white/80 font-medium">
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Car icon with charging animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 glass rounded-3xl flex items-center justify-center border border-white/10">
                    <Car
                      className="h-20 w-20 lg:h-24 lg:w-24 text-orange-400"
                      strokeWidth={1}
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-4 bg-orange-500 rounded-full blur-2xl -z-10"
                  />
                  {/* Charging indicator */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Zap className="h-4 w-4 text-white" />
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
                  <ArrowRight className="h-8 w-8 text-orange-400" />
                </div>
              </motion.div>

              {/* Services delivered to your car */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                  <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">
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
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Services delivered to your car
                </h3>
                <p className="text-white/50 mb-6 max-w-md">
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
                      className="group relative glass rounded-xl p-4 border border-white/10 hover:border-orange-500/30 cursor-pointer transition-all overflow-hidden"
                    >
                      {/* Hover glow */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                      />

                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                          <category.icon className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm group-hover:text-orange-50 transition-colors">
                            {category.label}
                          </p>
                          <p className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
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
              className="mt-8 pt-6 border-t border-white/5 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                  Full lifestyle services launching soon at select locations
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* What to expect teaser */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Services we're building</h3>
            <p className="text-white/50 text-sm">Everything delivered to your car while you charge</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "☕ Fresh coffee to your window",
              "🍔 Local restaurants delivered",
              "📦 Package pickup & drop-off",
              "🧹 Car cleaning while you wait",
              "🛒 Quick grocery runs",
              "✨ And surprises...",
            ].map((hint, i) => (
              <motion.div
                key={hint}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2.5 rounded-full glass border border-white/10 hover:border-orange-500/30 text-white/70 hover:text-white text-sm cursor-pointer transition-all"
              >
                {hint}
              </motion.div>
            ))}
          </div>
        </motion.div> */}

        {/* Features Grid */}
        {/* <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group card overflow-hidden cursor-pointer"
            >
             
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${feature.color}/30 to-transparent`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute top-4 left-4"
                >
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-orange-500/30 transition-colors">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                </motion.div>
              </div>

              <div className="p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-body leading-relaxed">{feature.desc}</p>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-center"
              />
            </motion.div>
          ))}
        </div> */}

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
                boxShadow: "0 0 40px rgba(244, 130, 69, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg"
            >
              Find a Station
              <ArrowRight className="h-5 w-5" />
            </motion.a>
            <span className="text-white/30 text-sm hidden sm:block">or</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Get notified when services launch →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
