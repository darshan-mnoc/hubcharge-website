"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Zap, Clock, DollarSign, ShieldCheck } from "lucide-react";
import { fadeUp, fadeUpStagger } from "@/lib/motion";

// Factual product highlights (no vanity metrics)
const stats = [
  { icon: Zap, value: "180kW", label: "DC fast charging" },
  { icon: Clock, value: "10 min", label: "Up to 100 miles" },
  { icon: DollarSign, value: "$12.50", label: "Flat-rate pricing" },
  { icon: ShieldCheck, value: "Full-service", label: "We plug you in" },
];

// Connector compatibility — Tesla shown as a wordmark, CCS/NACS use existing assets
const connectors = [
  { name: "Tesla", img: null },
  { name: "CCS", img: "/images/CCS.png" },
  { name: "NACS", img: "/images/NACS.png" },
];

export function TrustBand() {
  return (
    <section
      data-reveal
      className="relative bg-surface py-section border-b border-gray-200"
    >
      <div className="section-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpStagger}
        >
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
                  <stat.icon className="h-5 w-5 text-brand" />
                </div>
                <p className="text-h2 text-gray-900">{stat.value}</p>
                <p className="text-caption text-gray-500 mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Connector compatibility */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col items-center gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:justify-center"
          >
            <p className="text-label-md text-gray-500">Works with</p>
            <div className="flex items-center gap-6">
              {connectors.map((c) =>
                c.img ? (
                  <Image
                    key={c.name}
                    src={c.img}
                    alt={`${c.name} connector`}
                    width={44}
                    height={44}
                    className="h-9 w-auto object-contain opacity-80"
                  />
                ) : (
                  <span
                    key={c.name}
                    className="text-lg font-bold tracking-tight text-gray-700"
                  >
                    {c.name}
                  </span>
                )
              )}
              <span className="text-sm font-medium text-gray-500">
                & all EVs
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
