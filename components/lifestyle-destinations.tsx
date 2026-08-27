"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Utensils,
  Coffee,
  ShoppingBag,
  Sparkles,
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
    image: "/images/lifestyle-coffee-v2.webp",
    color: "from-brand",
  },
  {
    icon: Utensils,
    title: "Food & Meals",
    desc: "Breakfast, lunch or dinner, brought from local restaurants to your car.",
    image: "/images/lifestyle-food-v2.webp",
    color: "from-brand",
  },
  {
    icon: ShoppingBag,
    title: "Groceries & Errands",
    desc: "Quick essentials, pharmacy runs, anything you need picked up.",
    image: "/images/lifestyle-groceries-v2.webp",
    color: "from-brand",
  },
  {
    icon: Sparkles,
    title: "Services",
    desc: "Detailing and dry-cleaning pickup. Make the ten minutes count.",
    image: "/images/lifestyle-services-v2.webp",
    color: "from-brand",
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
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="lifestyle"
      data-reveal
      className="relative section-padding bg-ink-900 overflow-hidden"
    >
      {/* Background photo + navy overlay (§5a) */}
      <div className="absolute inset-0">
        <Image
          src="/images/lifestyle-coffee-v2.webp"
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



      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-8">
            <p className="text-overline text-white/55">More than charging</p>
          </div>

          <h2 className="text-h2 text-white mb-6 max-w-headline">
            Charge your car, and{" "}
            <br />
            get things done.
          </h2>
          <p className="text-body-lg text-muted-dark max-w-3xl">
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
          <div className="relative card p-5 sm:p-8 lg:p-12 overflow-hidden">

            <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-16">
              {/* Full image panel */}
              <div className="group relative w-full lg:w-80 flex-shrink-0 self-stretch min-h-[280px] lg:min-h-[340px] rounded-lg overflow-hidden border border-white/10 shadow-card-hover">
                <Image
                  src="/images/lifestyle-food-v2.webp"
                  alt="HubCharge attendant delivering coffee to a car window"
                  fill
                  className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/55 via-transparent to-transparent" />
                {/* Charging badge */}
                <div className="absolute top-4 right-4 w-9 h-9 bg-brand rounded-full flex items-center justify-center shadow-card-hover ring-4 ring-[#0A192F]/40">
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
                  <div className="w-8 h-px bg-ink-400" />
                  <ArrowRight className="h-8 w-8 text-brand" />
                </div>
              </motion.div>

              {/* Services delivered to your car */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-3">
                  <p className="text-overline text-on-dark/70">
                    While you charge
                  </p>
                  <motion.span
                                        className="px-2 py-0.5 rounded-full bg-brand/15 text-brand text-caption font-semibold"
                  >
                    Coming Soon
                  </motion.span>
                </div>
                <h3 className="text-h2 text-[#f4f3f2] mb-4">
                  Services delivered to your car
                </h3>
                <p className="text-muted-dark mb-6 max-w-md">
                  Food, coffee and errands, brought to your window while
                  your EV charges. No waiting, no walking.
                </p>

                {/* Interactive service categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceCategories.map((category, i) => (
                    <motion.div
                      key={category.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group relative glass rounded-lg p-4 border border-[#334155] hover:border-brand/30 cursor-pointer transition-all overflow-hidden"
                    >
                      {/* Hover glow */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent"
                      />

                      <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center group-hover:bg-brand/30 transition-colors">
                          <category.icon className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-[#f4f3f2] font-semibold text-body-sm group-hover:text-[#f4f3f2] transition-colors">
                            {category.label}
                          </p>
                          <p className="text-muted-dark text-caption group-hover:text-muted-dark transition-colors">
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
              className="mt-8 pt-6 border-t border-white/10"
            >
              <div className="flex items-center justify-center gap-2 text-muted-dark text-body-sm">
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
          className=""
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <CtaButton href="#locations" size="lg">
              Find your hub
              <ArrowRight className="h-5 w-5" />
            </CtaButton>
            <span className="text-muted-dark text-body-sm hidden sm:block">or</span>
            <motion.a
              href="#newsletter"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-brand hover:text-[#FF9433] text-body-sm font-medium underline underline-offset-4 transition-colors"
            >
              Get notified when services launch →
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
