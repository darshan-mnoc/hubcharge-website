"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, Zap, Clock, User } from "lucide-react";
import Image from "next/image";
import WaitImg from "../public/images/waiting.jpg";

const solutionCards = [
  {
    icon: User,
    title: "Attendant Greets You",
    desc: "A real person comes to your car the moment you arrive. No apps, no kiosks.",
    image: "/images/valet-greet.png",
  },
  {
    icon: Zap,
    title: "They Handle It All",
    desc: "Plug in, payment, unplug when done. You stay in your car the entire time.",
    image: "/images/charging-service.png",
  },
  {
    icon: Clock,
    title: "You Live Your Life",
    desc: "Order coffee, food, groceries — delivered to your window while you charge.",
    image: "/images/coffee-delivery.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[200px]" />

      <div className="section-container relative">
        {/* The Problem */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">
              The Problem
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="heading-section text-white mb-8 leading-tight"
          >
            You spend 30-40 minutes
            <br />
            at "fast" chargers.
            <br />
            <span className="text-white/40">What do you get back?</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-body-lg max-w-3xl mx-auto"
          >
            Standing in parking lots. Watching your phone. Waiting for a
            percentage to move.
            <span className="text-white/80 font-medium">
              {" "}
              Your time is worth more than that.
            </span>
          </motion.p>
        </motion.div>

        {/* Problem Image */}
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
                alt="Person waiting at EV charger"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/70 text-lg lg:text-xl font-medium italic">
                "Another 35 minutes... just standing here."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Arrow Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(244, 130, 69, 0.3)",
                "0 0 40px rgba(244, 130, 69, 0.6)",
                "0 0 20px rgba(244, 130, 69, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"
          >
            <ArrowDown className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              The HubCharge Way
            </span>
          </div>

          <h2 className="heading-section text-white mb-6 leading-tight">
            10 minutes. 100 miles.
            <br />
            <span className="text-gradient text-glow">
              An attendant who handles everything.
            </span>
          </h2>
        </motion.div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {solutionCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group card overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 lg:h-60 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

                {/* Number badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                  className="absolute top-4 left-4"
                >
                  <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center">
                    <span className="text-orange-400 font-bold">{i + 1}</span>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-box icon-box-primary group-hover:bg-orange-500/30 transition-colors">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading-card text-white">{card.title}</h3>
                </div>
                <p className="text-body leading-relaxed">{card.desc}</p>
              </div>

              {/* Bottom glow line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-center"
              />
            </motion.div>
          ))}
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
            Watch the 10-minute journey
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
