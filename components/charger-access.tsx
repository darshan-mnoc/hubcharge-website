"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { QrCode, Globe, Zap, Check, ArrowRight } from "lucide-react";
import { CtaButton } from "@/components/ui/cta-button";
import { PhoneChargingUI } from "@/components/phone-charging-ui";
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
    desc: "HubCharge™ loads instantly — no app to download. Start as a guest, or sign in to see your session history and get quick access next time",
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
              className="text-overline text-ink-500 mb-4"
            >
              Get Charging
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-h2 text-ink-900 mb-4">
              No app. Just your browser.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-body-lg text-ink-600 mb-8 max-w-md"
            >
              Skip the download. HubCharge™ runs right in your phone&apos;s
              browser — tap, scan, and you&apos;re charging in seconds.
            </motion.p>

            {/* steps */}
            <motion.ol variants={fadeUp} className="space-y-5 mb-8">
              {steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-paper-300 shadow-sm">
                      <s.icon className="h-5 w-5 text-ink-700" />
                    </div>
                    <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-ink-900">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">{s.title}</p>
                    <p className="text-sm text-ink-600 leading-relaxed">
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
                  className="inline-flex items-center gap-2 text-sm text-ink-700"
                >
                  <Check className="h-4 w-4 text-ink-700" />
                  {r}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <CtaButton href="#locations" size="lg">
                Find a charger near you
                <ArrowRight className="h-5 w-5" />
              </CtaButton>
              <p className="mt-4 text-sm text-ink-500">
                First visit?{" "}
                <Link href="/what-to-expect" className="text-brand-ink underline underline-offset-2">
                  See what to expect
                </Link>
                ,{" "}
                <Link href="/charging-101/can-my-ev-charge-here" className="text-brand-ink underline underline-offset-2">
                  check if your EV is compatible
                </Link>
                , or{" "}
                <Link href="/faq" className="text-brand-ink underline underline-offset-2">
                  read the FAQ
                </Link>
                .
              </p>
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
            {/* Phone mockup: arbitrary radii intentionally opt out of the 8px
                card clamp — this depicts a physical device, not a card. */}
            <div className="relative">
              <PhoneChargingUI />

              {/* floating badge — sits beside the browser bar it refers to */}
              <div className="absolute -left-5 bottom-28 hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_8px_24px_-8px_rgba(16,24,40,0.25)] border border-paper-300">
                <Globe aria-hidden className="h-4 w-4 text-ink-700" />
                <span className="text-xs font-semibold text-ink-900">
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
