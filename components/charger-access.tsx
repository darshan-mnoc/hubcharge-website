"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { QrCode, Globe, Zap, Check, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { fadeUp, fadeUpStagger } from "@/lib/motion";

const steps = [
  {
    icon: QrCode,
    title: "Tap or scan",
    desc: "Tap your phone to the charger, or scan the code on its screen.",
  },
  {
    icon: Globe,
    title: "Opens in your browser",
    desc: "HubCharge® loads instantly — no app to download. Start as a guest, or sign in to see history of your sessions and easy quick access for nex time",
  },
  {
    icon: Zap,
    title: "Swipe to start",
    desc: "Pick your connector, add a card, and swipe. Charging begins.",
  },
];

const reassurance = [
  "No app to install",
  "Account optional",
  "Works on any phone",
];

export function ChargerAccess() {
  return (
    <section
      id="access"
      data-reveal
      className="relative section-padding bg-surface-warm overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#FF7A00]/5 rounded-full blur-[70px]" />

      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT — copy + steps */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpStagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-brand text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Get Charging
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-h1 text-gray-900 mb-4">
              No app. Just your browser.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-body-lg text-gray-600 mb-8 max-w-md"
            >
              Skip the download. HubCharge® runs right in your phone&apos;s
              browser — tap, scan, and you&apos;re charging in seconds.
            </motion.p>

            {/* steps */}
            <motion.ol variants={fadeUp} className="space-y-5 mb-8">
              {steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
                      <s.icon className="h-5 w-5 text-brand" />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ol>

            {/* reassurance + cta */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8"
            >
              {reassurance.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-2 text-sm text-gray-700"
                >
                  <Check className="h-4 w-4 text-brand" />
                  {r}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <CtaButton href="#locations" size="lg">
                Find a charger near you
                <ArrowRight className="h-5 w-5" />
              </CtaButton>
            </motion.div>
          </motion.div>

          {/* RIGHT — phone mockup with the real web UI */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            {/* glow */}
            <div className="absolute inset-0 mx-auto w-[300px] bg-brand/15 rounded-[3rem] blur-[70px]" />

            <div className="relative w-[260px] sm:w-[290px] lg:w-[310px]">
              {/* phone frame — dark, reads premium on the light section */}
              <div className="relative rounded-[2.75rem] bg-[#0A192F] p-2.5 shadow-[0_34px_70px_-22px_rgba(10,25,47,0.55)] border border-[#1E293B]">
                <div className="relative rounded-[2.25rem] overflow-hidden bg-black aspect-[9/16]">
                  <Image
                    src="/images/charging-service.jpeg"
                    alt="HubCharge web charging interface — choose connector, add card, swipe to start"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 260px, 310px"
                  />
                </div>
              </div>

              {/* floating "in your browser" badge — sits over the empty lower screen, not the UI */}
              <div className="absolute -left-3 bottom-6 hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_8px_24px_-8px_rgba(16,24,40,0.25)] border border-gray-100">
                <Globe className="h-4 w-4 text-brand" />
                <span className="text-xs font-semibold text-gray-800">
                  In your browser
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
