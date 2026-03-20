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
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Coffee,
    title: "Coffee & Drinks",
    desc: "Fresh coffee, boba, smoothies delivered hot to your window.",
    image: "/images/lifestyle-coffee.png",
    color: "from-amber-500",
  },
  {
    icon: Utensils,
    title: "Food & Meals",
    desc: "Breakfast, lunch, dinner — from local restaurants to your car.",
    image: "/images/lifestyle-food.png",
    color: "from-orange-500",
  },
  {
    icon: ShoppingBag,
    title: "Groceries & Errands",
    desc: "Quick essentials, pharmacy runs, anything you need picked up.",
    image: "/images/lifestyle-groceries.png",
    color: "from-blue-500",
  },
  {
    icon: Sparkles,
    title: "Services",
    desc: "Car detailing, dry cleaning pickup — make your 10 minutes count.",
    image: "/images/lifestyle-services.png",
    color: "from-purple-500",
  },
];

const floatingTags = [
  "Coffee",
  "Breakfast",
  "Lunch",
  "Groceries",
  "Packages",
  "Dry Cleaning",
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
              Your Car, Your Space
            </span>
          </div>

          <h2 className="heading-section text-white mb-6">
            Everything delivered
            <br />
            <span className="text-gradient text-glow">to your window</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Stay in your car. Our attendant brings everything to you — food, drinks,
            groceries, services.
            <span className="text-white/80 font-medium">
              {" "}
              Your 10 minutes, fully utilized.
            </span>
          </p>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative card p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Car icon */}
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

              {/* What comes to you */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3">
                  While you charge
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  The world comes to you
                </h3>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {floatingTags.map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.1, y: -4 }}
                      animate={{ y: [0, -6, 0] }}
                      style={{ animationDelay: `${i * 0.2}s` }}
                      className="glass text-orange-400 px-5 py-2.5 rounded-full text-sm lg:text-base font-semibold border border-orange-500/30 cursor-pointer"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
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
              {/* Image */}
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

                {/* Icon */}
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

              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-body leading-relaxed">{feature.desc}</p>
              </div>

              {/* Bottom glow */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-center"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="#locations"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(244, 130, 69, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
          >
            See What's Near You
            <ArrowRight className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
