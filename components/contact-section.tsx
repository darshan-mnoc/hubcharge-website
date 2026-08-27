"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, ArrowRight, LifeBuoy } from "lucide-react";
import { stations } from "@/lib/stations";

/**
 * Homepage contact prompt.
 *
 * This used to be the only contact surface on the site — a full form on the
 * homepage, with "Contact" in the nav pointing at its anchor, so on any
 * sub-page clicking Contact threw you back to the homepage and made you find
 * it again. The form now lives at /contact with routed topics and the station
 * details beside it; this is a doorway, not a duplicate.
 */
export function ContactSection() {
  const phone = stations[0];
  return (
    <section id="contact" className="relative section-padding bg-ink-900 overflow-hidden">
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
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.88) 50%, rgba(10,25,47,0.97) 100%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="relative section-container"
      >
        <p className="text-overline text-white/55">Support</p>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-end">
          <div>
            <h2 className="text-h2 text-white max-w-[18ch]">Questions? We&rsquo;re here.</h2>
            <p className="text-body-lg text-on-dark/80 max-w-[46ch] mt-5">
              Most answers are already on the site: compatibility, pricing,
              what to do when a session misbehaves. If yours isn&rsquo;t, tell
              us what you need and it reaches the right person.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-semibold text-ink-900 transition-colors hover:bg-brand-hover"
            >
              <LifeBuoy aria-hidden className="h-4 w-4" />
              Contact &amp; support
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${phone.phoneE164}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3 font-semibold text-on-dark transition-colors hover:border-brand hover:text-brand"
            >
              <Phone aria-hidden className="h-4 w-4" />
              {phone.phone}
            </a>
          </div>
        </div>

        <p className="text-caption text-on-dark/60 mt-8">
          Stations open {phone.hours} daily.{" "}
          <Link href="/locations" className="text-brand hover:underline underline-offset-2">
            Addresses and directions
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
