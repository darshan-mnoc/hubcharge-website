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
import { CtaButton } from "@/components/ui/cta-button";

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
    color: "from-brand",
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
      data-reveal
      className="relative section-padding bg-hero overflow-hidden"
    >
      {/* Background photo + navy overlay (§5a) */}
      <div className="absolute inset-0">
        <Image
          src="/images/lifestyle-coffee-v2.png"
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
              "linear-gradient(180deg, rgba(10,25,47,0.94) 0%, rgba(10,25,47,0.82) 45%, rgba(10,25,47,0.96) 100%)",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#FF7A00]/10 rounded-full blur-[70px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[60px]" />

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
          <p className="text-body-lg text-muted-dark max-w-3xl mx-auto">
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/10 rounded-full blur-[50px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand/10 rounded-full blur-[40px]" />

            <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-16">
              {/* Full image panel */}
              <div className="group relative w-full lg:w-80 flex-shrink-0 self-stretch min-h-[280px] lg:min-h-[340px] rounded-3xl overflow-hidden border border-white/10 shadow-card-hover">
                <Image
                  src="/images/coffee-delivery-v3.png"
                  alt="HubCharge attendant delivering coffee to a car window"
                  fill
                  className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/55 via-transparent to-transparent" />
                {/* Charging badge */}
                <div className="absolute top-4 right-4 w-9 h-9 bg-brand rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#0A192F]/40">
                  <Zap className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                className="hidden lg:flex items-center justify-center"
              >
                <div className="flex items-center gap-2">
                  <div className="w-20 h-[2px] energy-line" />
                  <ArrowRight className="h-8 w-8 text-[#FF7A00]" />
                </div>
              </motion.div>

              {/* Services delivered to your car */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                  <p className="text-[#FF7A00] text-sm font-semibold uppercase tracking-widest">
                    While you charge
                  </p>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-2 py-0.5 rounded-full bg-brand/15 text-brand text-xs font-semibold border border-brand/25"
                  >
                    Coming Soon
                  </motion.span>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#f4f3f2] mb-4">
                  Services delivered to your car
                </h3>
                <p className="text-[#8A9BB5] mb-6 max-w-md">
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
                      className="group relative glass rounded-xl p-4 border border-[#334155] hover:border-[#FF7A00]/30 cursor-pointer transition-all overflow-hidden"
                    >
                      {/* Hover glow */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#FF7A00]/10 to-transparent"
                      />

                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FF7A00]/20 flex items-center justify-center group-hover:bg-[#FF7A00]/30 transition-colors">
                          <category.icon className="h-5 w-5 text-[#FF7A00]" />
                        </div>
                        <div>
                          <p className="text-[#f4f3f2] font-semibold text-sm group-hover:text-[#f4f3f2] transition-colors">
                            {category.label}
                          </p>
                          <p className="text-[#475569] text-xs group-hover:text-[#8A9BB5] transition-colors">
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
              className="mt-8 pt-6 border-t border-[#334155] text-center"
            >
              <div className="flex items-center justify-center gap-2 text-[#475569] text-sm">
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
            <CtaButton href="#locations" size="lg">
              Find a Station
              <ArrowRight className="h-5 w-5" />
            </CtaButton>
            <span className="text-[#475569] text-sm hidden sm:block">or</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-[#FF7A00] hover:text-[#FF9433] text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Get notified when services launch →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
