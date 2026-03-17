"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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

const footerLinks = {
  experience: [
    { label: "Find a Hub", href: "#locations" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Membership", href: "#membership" },
    { label: "Lifestyle", href: "#lifestyle" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Press", href: "#press" },
    { label: "Blog", href: "#blog" },
  ],
  support: [
    { label: "Help Center", href: "#help" },
    { label: "Contact Us", href: "#contact" },
    { label: "FAQs", href: "#faqs" },
    { label: "Accessibility", href: "#accessibility" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function LifestyleFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#080808]">
      {/* Pre-footer CTA */}
      <div
        ref={ctaRef}
        className="relative py-20 overflow-hidden border-b border-white/10"
      >
        {/* Gradient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500 rounded-full blur-[200px]"
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
          >
            Ready to reclaim your time?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/50 mb-10 max-w-2xl mx-auto"
          >
            Join thousands who've transformed charging from a chore into an
            experience. Your first 10 minutes are waiting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#locations"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(244, 130, 69, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 btn btn-primary btn-lg rounded-full"
            >
              <Zap className="h-5 w-5" />
              Find Your Hub
            </motion.a>
            <motion.a
              href="#app"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              Download the App
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                className="inline-block mb-6"
              >
                <Image
                  src="/images/hubcharge-logo.png"
                  alt="HubCharge"
                  width={140}
                  height={36}
                  className="h-8 w-auto"
                />
              </motion.a>
              <p className="text-white/40 text-sm mb-6 max-w-xs">
                Transforming EV charging into lifestyle moments. Because your
                time deserves more than waiting.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-white font-medium text-sm mb-3">
                  Get time-saving tips & offers
                </p>
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 text-emerald-400 text-sm"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 bg-white/10 rounded-full px-4 py-2.5 text-white text-sm placeholder:text-white/30 border border-white/10 focus:border-orange-500/50 focus:outline-none"
                        required
                      />
                      <motion.button
                        type="submit"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 0 20px rgba(244, 130, 69, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-colors"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
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
                    className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-orange-400 hover:border-orange-500/30 transition-colors"
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="text-white font-semibold mb-4">Experience</h4>
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
                      className="text-white/40 hover:text-orange-400 text-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, i) => (
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
                      className="text-white/40 hover:text-orange-400 text-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
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
                      className="text-white/40 hover:text-orange-400 text-sm transition-colors inline-block"
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <motion.a
                    href="mailto:hello@hubcharge.com"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-white/40 hover:text-orange-400 text-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    hello@hubcharge.com
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="tel:+19493914676"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-white/40 hover:text-orange-400 text-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    (949) 391-4676
                  </motion.a>
                </li>
                <li>
                  <span className="flex items-start gap-2 text-white/40 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    108 S Monterey St
                    <br />
                    Alhambra, CA 91801
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.legal.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <p className="text-white/30 text-xs text-center md:text-right">
              © {new Date().getFullYear()} HubCharge. All rights reserved.
              <br className="md:hidden" />
              <span className="hidden md:inline"> • </span>
              Made with{" "}
              <motion.span whileHover={{ scale: 1.2 }} className="inline-block">
                <Heart className="inline h-3 w-3 text-orange-500" />
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
        className="h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent origin-center"
      />
    </footer>
  );
}
