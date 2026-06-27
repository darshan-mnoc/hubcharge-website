"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, Receipt, Gauge, Check } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { fadeUp, fadeUpStagger } from "@/lib/motion";

/*
  PLACEHOLDER COPY — review/replace wording. Structure & styling follow the
  design system (dark "feature" section, directional overlay, CtaButton).
*/
const valueProps = [
  {
    icon: Gauge,
    title: "Keep fleets moving",
    desc: "Priority 180kW charging so drivers top up in minutes and get back on the road.",
  },
  {
    icon: Receipt,
    title: "One simple invoice",
    desc: "Consolidated monthly billing across every vehicle and location — no reconciling receipts.",
  },
  {
    icon: Building2,
    title: "Built for business",
    desc: "Dedicated account support, usage reporting, and flexible plans that scale with you.",
  },
];

export function FleetBusiness() {
  return (
    <section
      id="business"
      data-reveal
      className="relative overflow-hidden bg-hero py-section"
    >
      {/* Background image + directional overlay (§5a) */}
      <div className="absolute inset-0">
        <Image
          src="/images/charging-service-v2.png"
          alt=""
          aria-hidden
          fill
          className="object-cover object-right"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(10,25,47,0.97) 0%, rgba(10,25,47,0.9) 42%, rgba(10,25,47,0.6) 72%, rgba(10,25,47,0.3) 100%)",
          }}
        />
      </div>

      <div className="section-container relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUpStagger}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="text-brand text-sm font-semibold uppercase tracking-widest mb-4"
          >
            For Business &amp; Fleets
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-h1 text-on-dark mb-5">
            Power your whole fleet, not just one car
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-body-lg text-muted-dark mb-10"
          >
            From rideshare drivers to delivery fleets, HubCharge keeps your
            vehicles charged and your operation on schedule — with pricing and
            support designed for teams.
          </motion.p>

          <motion.ul variants={fadeUp} className="space-y-5 mb-10">
            {valueProps.map((vp) => (
              <li key={vp.title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/15">
                  <vp.icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-on-dark">{vp.title}</p>
                  <p className="text-sm text-muted-dark leading-relaxed">
                    {vp.desc}
                  </p>
                </div>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <CtaButton href="#contact" size="lg">
              Talk to our team
            </CtaButton>
            <span className="inline-flex items-center gap-2 text-sm text-muted-dark">
              <Check className="h-4 w-4 text-brand" />
              No long-term contracts
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
