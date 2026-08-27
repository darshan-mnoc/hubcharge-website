"use client";

import { useRef } from "react";
import { motion, useInView, easeOut } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ArrowDown, ArrowRight, Sparkles, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const solutionSteps = [
  {
    number: "01",
    title: "Arrive & Relax",
    desc: "Pull up to any available charger. Our team handles everything from there.",
    highlight: "No apps to download",
    image: "/images/valet-greet-v2.webp",
    imageAlt: "A HubCharge attendant greeting a driver at their car window",
    // charger sits at the far left of the frame
    pos: "18% 50%",
  },
  {
    number: "02",
    title: (
      <>
        We Handle Charging
        <span className="text-brass-ink">*</span>
      </>
    ),
    desc: "Payment, plug-in, monitoring — all taken care of. Stay in your car.",
    highlight: "Zero effort required",
    image: "/images/charging-service-v2.webp",
    imageAlt: "An attendant plugging a charging cable into an electric car",
    pos: "45% 50%",
  },
  {
    number: "03",
    title: (
      <>
        Get Things Done
        <span className="text-brass-ink">*</span>
      </>
    ),
    desc: "Order food, coffee, or essentials. Delivered right to your window.",
    highlight: "Time well spent",
    image: "/images/coffee-delivery-v3.webp",
    imageAlt: "Coffee being delivered to a driver's car window while it charges",
    // charger sits on the left of the frame
    pos: "24% 50%",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};


const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

/* Four moments in one stop. Every cell in the HubCharge column is a claim
   made elsewhere on this site and checkable against it — the ten-minute band
   comes from the same curve integration the estimator uses, and the flat rate
   is the one on the charger screen. Nothing here is an adjective. */
const LEDGER = [
  {
    k: "You plug in",
    them: "You do it yourself, in whatever weather the forecast gave you.",
    us: "An attendant does it. You stay in the driver's seat.*",
  },
  {
    k: "You pay",
    them: "Per kWh, at a rate that can move by time of day — so the total only exists once you're finished.",
    us: "One flat rate for the session, shown on your phone for approval before the cable moves.",
  },
  {
    k: "You wait",
    them: "30–40 minutes, because the pitch is a full battery.",
    us: "10 minutes puts roughly 90–135 miles into most popular EVs. Extend in taps if you want more.",
  },
  {
    k: "You leave",
    them: "You watch the clock to get back before idle fees start.",
    us: "We unplug. There is no idle fee to race.",
  },
];

export function ProblemSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="story"
      data-reveal
      className="relative bg-paper overflow-hidden"
    >

      <div className="section-container relative pt-24 lg:pt-32 pb-16">
        {/* SECTION 1: Rethink Fast Charging */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <p className="text-overline text-ink-500">Rethink fast charging</p>
            <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-h2 text-ink-900 mb-6 max-w-headline"
          >
            <span className="text-ink-400">
              Is &ldquo;fast charging&rdquo; really fast?
            </span>{" "}
            What if 10&ndash;30 minutes was enough?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-body-lg text-ink-500 max-w-[46ch]"
          >
            Chargers advertise big numbers your car can&apos;t actually use.{" "}
            <span className="text-ink-900">
              We advertise what we deliver — and deliver what you need.
            </span>
          </motion.p>

        </motion.div>

        {/* The ledger.

            This was two photographs with adjectives written over them, and
            adjectives are what every charging network's homepage already says.
            A photograph can show you a person waiting; it cannot show you that
            you don't know the bill yet. So the argument is made in rows, and
            every cell on our side is a figure that appears elsewhere on this
            site and can be checked against it. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-overline text-ink-500">The same stop, twice</p>
            <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 lg:gap-14 items-start">
            <div>
              {/* Column heads. Hidden on phones, where the table stacks and
                  each cell carries its own inline label instead — three
                  columns in 390px gives ~90px a cell and eight-line wraps. */}
              <div className="hidden md:grid grid-cols-[minmax(0,10rem)_1fr_1fr] gap-x-8 pb-3">
                <span />
                <span className="text-overline text-ink-400">Most networks</span>
                <span className="text-overline text-brand-ink">HubCharge</span>
              </div>

              <dl>
                {LEDGER.map((row) => (
                  <motion.div
                    key={row.k}
                    variants={itemVariants}
                    className="grid gap-y-3 md:grid-cols-[minmax(0,10rem)_1fr_1fr] md:gap-x-8 md:gap-y-0 py-5 border-t border-paper-300 last:border-b items-start"
                  >
                    <dt className="text-h4 text-ink-900">{row.k}</dt>
                    <dd className="text-body-sm text-ink-500 flex gap-2">
                      <X aria-hidden className="h-3.5 w-3.5 mt-1 shrink-0 text-ink-300" />
                      <span>
                        <span className="md:hidden text-overline text-ink-400 block mb-0.5">
                          Most networks
                        </span>
                        {row.them}
                      </span>
                    </dd>
                    <dd className="text-body-sm text-ink-900 flex gap-2">
                      <Check aria-hidden className="h-3.5 w-3.5 mt-1 shrink-0 text-brand-ink" />
                      <span>
                        <span className="md:hidden text-overline text-brand-ink block mb-0.5">
                          HubCharge
                        </span>
                        {row.us}
                      </span>
                    </dd>
                  </motion.div>
                ))}
              </dl>

              <motion.p variants={itemVariants} className="text-caption text-ink-400 mt-5 max-w-[62ch]">
                <span className="text-brass-ink">*</span> Attendant service at
                select locations and hours. Range added in ten minutes varies by
                car, starting battery and temperature —{" "}
                <Link href="/pricing#plan" className="text-brand-ink underline underline-offset-2">
                  check yours
                </Link>
                .
              </motion.p>
            </div>

            {/* One photograph, beside the argument rather than under it. */}
            <motion.figure variants={itemVariants} className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src="/images/valet-greet-v2.webp"
                  alt="A HubCharge attendant at the driver's window while the car charges behind them"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 22rem"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,25,47,0.88) 0%, rgba(10,25,47,0.15) 45%, rgba(10,25,47,0) 70%)",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-overline text-white/70">While you sit there</p>
                  <p className="text-h4 text-white mt-1.5">
                    Ten minutes, and someone else handles the cable.
                  </p>
                </figcaption>
              </div>
            </motion.figure>
          </div>
        </motion.div>
      </div>

      {/* DARK band — "The HubCharge Difference" + How It Works (photo background) */}
      <div className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          <Image
            src="/images/charging-service-v2.webp"
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
                "linear-gradient(180deg, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.86) 50%, rgba(10,25,47,0.97) 100%)",
            }}
          />
        </div>
        <div className="relative section-container py-20 lg:py-28">
          {/* SECTION 2: The HubCharge Difference */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="mb-6">
              <p className="text-overline text-white/55">
                The HubCharge™ difference
              </p>
              <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
            </div>

            <h2 className="text-h2 text-white mb-6 max-w-[26ch]">
              <span className="text-on-dark/60">10 minutes. Up to 100 miles.</span>{" "}
              Full-service convenience*
            </h2>

            <p className="text-lg text-muted-dark max-w-xl">
              Need enough charge to get home or to your destination?
              <span className="text-on-dark font-medium"> Top up and go.</span>
            </p>
          </motion.div>

          {/* How It Works - Simple Steps */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-overline text-on-dark/55 mb-8"
            >
              How it works
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {solutionSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="group relative"
                >
                  <div className="group/card relative min-h-[420px] lg:min-h-[460px] rounded-lg overflow-hidden border border-white/10 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      className="object-cover transition-transform duration-[800ms] group-hover/card:scale-[1.05]"
                      style={{ objectPosition: step.pos }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Window gradient — number visible top, content readable bottom */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(10,25,47,0.55) 0%, rgba(10,25,47,0.1) 26%, rgba(10,25,47,0.5) 58%, rgba(10,25,47,0.96) 100%)",
                      }}
                    />

                    <div className="relative flex h-full min-h-[420px] lg:min-h-[460px] flex-col justify-between p-6">
                      {/* Top: step number + hover arrow */}
                      <div className="flex items-start justify-between">
                        <span className="text-5xl font-black text-white/70 transition-colors group-hover/card:text-brand">
                          {step.number}
                        </span>
                        <ArrowRight className="mt-2 h-5 w-5 text-brand opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0" />
                      </div>

                      {/* Bottom: title, desc, highlight */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                          {step.desc}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <div className="inline-flex items-center gap-2 rounded-full bg-brand/20 border border-brand/30 px-3 py-1.5 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3 text-brand" />
                            <span className="text-xs font-medium text-brand">
                              {step.highlight}
                            </span>
                          </div>
                          {i === 2 && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-brand/20 px-3 py-1.5 text-xs font-semibold text-brand border border-brand/30 backdrop-blur-sm">
                              Coming Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Service Note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <p className="text-muted-dark text-sm">
                <span className="text-brass-ink">*</span>Full-service attendant
                available at select locations.{" "}
                <a
                  href="#locations"
                  className="text-brand hover:text-brand-hover underline underline-offset-2"
                >
                  Check availability
                </a>
              </p>
            </motion.div>
          </div>

          {/* Transition to Journey */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-3 text-brand hover:text-brand-hover transition-colors text-lg font-semibold group"
            >
              See the full charging experience
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
