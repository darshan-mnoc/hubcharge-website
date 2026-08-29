"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Zap,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/ui/cta-button";
import { subscribeNewsletter } from "@/lib/actions";

const footerLinks = {
  experience: [
    { label: "Find a Hub", href: "/locations" },
    { label: "Alhambra Station", href: "/locations/alhambra" },
    { label: "Fontana Station", href: "/locations/fontana" },
    { label: "What to Expect", href: "/what-to-expect" },
    { label: "Pricing", href: "/pricing" },
  ],
  learn: [
    { label: "Charging 101", href: "/charging-101" },
    { label: "Can My EV Charge Here?", href: "/charging-101/can-my-ev-charge-here" },
    { label: "NACS vs CCS", href: "/charging-101/connectors" },
    { label: "How Long Does It Take?", href: "/charging-101/charging-speed" },
    { label: "Glossary", href: "/charging-101/glossary" },
  ],
  support: [
    { label: "FAQs", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

const socialLinks = [
  // { icon: Instagram, href: "#", label: "Instagram" },
  // { icon: Twitter, href: "#", label: "Twitter" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/micronocinc",
    label: "LinkedIn",
  },
  // { icon: Youtube, href: "#", label: "YouTube" },
];

export function LifestyleFooter() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribing) return;
    setSubscribing(true);
    setSubscribeError(null);
    const result = await subscribeNewsletter({ email, company: "" });
    setSubscribing(false);
    if (result.ok) {
      setSubscribed(true);
      setEmail("");
    } else {
      setSubscribeError(result.error ?? "Something went wrong — please try again.");
    }
  };

  return (
    <footer className="relative bg-[#0F172A]">
      {/* Pre-footer CTA */}
      <div
        ref={ctaRef}
        className="relative py-20 overflow-hidden border-b border-[#334155]"
      >
        <div className="relative section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <p className="text-overline text-white/55">Get started</p>
            <h2 className="text-h2 text-white max-w-headline">
              Ready to reclaim your time?
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-body-lg text-on-dark/70 mb-10 max-w-[44ch]"
          >
            Turn charging from a chore into an
            experience. Your first 10 minutes are waiting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <CtaButton to="/locations" size="lg">
              <Zap className="h-5 w-5" />
              Find your hub
            </CtaButton>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <motion.a
                href="/"
                aria-label="HubCharge home"
                whileHover={{ scale: 1.02 }}
                className="inline-block mb-6"
              >
                <Image
                  src="/images/hubcharge-logo-on-dark.webp"
                  alt="HubCharge"
                  width={900}
                  height={143}
                  className="h-8 w-auto"
                />
              </motion.a>
              <p className="text-muted-dark text-body-sm mb-6 max-w-xs">
                Transforming EV charging into lifestyle moments. Because your
                time deserves more than waiting.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-[#f4f3f2] font-medium text-body-sm mb-3">
                  <span id="newsletter" className="scroll-mt-28">Get time-saving tips &amp; offers</span>
                </p>
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-ok-on-dark text-body-sm"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        <Heart className="h-4 w-4" />
                      </motion.div>
                      <span>Thanks for subscribing!</span>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubscribe}
                      className="flex gap-2"
                    >
                      <input
                        type="email"
                        aria-label="Email address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="field-dark flex-1 rounded-full px-4 py-2.5 text-body-sm"
                        required
                      />
                      <motion.button
                        type="submit"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(255, 122, 0, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Subscribe"
                        className="w-10 h-10 rounded-full bg-brand hover:bg-brand-hover flex items-center justify-center text-ink-900 transition-colors"
                      >
                        <ArrowRight aria-hidden className="h-4 w-4" />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
                {subscribeError && (
                  <p role="alert" className="text-caption text-error-on-dark mt-2">
                    {subscribeError}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-[#f4f3f2]/10 border border-[#334155] flex items-center justify-center text-muted-dark hover:text-brand hover:border-brand/30 transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-[#f4f3f2] font-semibold mb-4">Experience</h2>
              <ul className="space-y-3">
                {footerLinks.experience.map((link, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-muted-dark hover:text-brand text-body-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h2 className="text-[#f4f3f2] font-semibold mb-4">Learn</h2>
              <ul className="space-y-3">
                {footerLinks.learn.map((link, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-muted-dark hover:text-brand text-body-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h2 className="text-[#f4f3f2] font-semibold mb-4">Support</h2>
              <ul className="space-y-3">
                {footerLinks.support.map((link, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4 }}
                      className="text-muted-dark hover:text-brand text-body-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-[#f4f3f2] font-semibold mb-4">Contact</h2>
              <ul className="space-y-3">
                <li>
                  <motion.a
                    href="mailto:info@micronocinc.com"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-muted-dark hover:text-brand text-body-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="break-words">{`info@micronocinc.com`}</span>
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="tel:+19493928755"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-muted-dark hover:text-brand text-body-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    (949) 392-8755
                  </motion.a>
                </li>
                <li>
                  <span className="flex items-start gap-2 text-muted-dark text-body-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="block text-caption uppercase tracking-wider text-muted-dark">
                        Corporate office
                      </span>
                      9383 Charles Smith Avenue
                      <br />
                      Rancho Cucamonga, CA 91730
                      <span className="mt-1 block text-caption text-muted-dark">
                        Stations: Alhambra &amp; Fontana, CA —{" "}
                        <Link href="/locations" className="underline hover:text-brand">
                          see locations
                        </Link>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#334155] py-6">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.legal.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  className="text-muted-dark hover:text-muted-dark text-caption transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <p className="text-muted-dark text-caption text-center md:text-right">
              © {new Date().getFullYear()} HubCharge™. All rights reserved.
              <br className="md:hidden" />
              <span className="hidden md:inline"> • </span>
              Made with{" "}
              <motion.span whileHover={{ scale: 1.2 }} className="inline-block">
                <Heart className="inline h-3 w-3 text-brand" />
              </motion.span>{" "}
              for your time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom energy line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent origin-center"
      />
    </footer>
  );
}
