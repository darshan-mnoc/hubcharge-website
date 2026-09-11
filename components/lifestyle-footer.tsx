"use client";

import { useState } from "react";
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
import { COMPANY } from "@/lib/company";
import { statesWithCoverage } from "@/lib/stations";

const footerLinks = {
  experience: [
    { label: "Find a Hub", href: "/locations" },
    { label: "Alhambra Station", href: "/locations/alhambra" },
    { label: "Fontana Station", href: "/locations/fontana" },
    { label: "What to Expect", href: "/what-to-expect" },
    { label: "Plan Your Charge", href: "/plan-your-charge" },
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
  /* The pre-footer CTA used useInView from framer-motion to fade three
     blocks in. The site already ships ScrollReveal — 41 lines of
     IntersectionObserver, one observer for the whole document, driving
     [data-reveal] from CSS — so this was 167 KB of animation library doing
     what was already running for free. See globals.css §7c. */

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
    <footer className="relative bg-ink-900">
      {/* Pre-footer CTA */}
      <div className="relative py-20 overflow-hidden border-b border-ink-600">
        <div className="relative section-container">
          <div data-reveal className="mb-6">
            <p className="text-overline text-white/55">Get started</p>
            <h2 className="text-h2 text-white max-w-headline">
              Ready to reclaim your time?
            </h2>
          </div>
          <p data-reveal data-reveal-delay="1" className="text-body-lg text-on-dark/70 mb-10 max-w-[44ch]">
            Turn charging from a chore into an
            experience. Your first 10 minutes are waiting.
          </p>

          <div data-reveal data-reveal-delay="2" className="flex flex-col sm:flex-row gap-4">
            <CtaButton to="/locations" size="lg">
              <Zap className="h-5 w-5" />
              Find your hub
            </CtaButton>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link
                href="/"
                aria-label="HubCharge home"
                className="hc-move hc-grow-sm inline-block mb-6"
              >
                <Image
                  src="/images/hubcharge-logo-on-dark.webp"
                  alt="HubCharge"
                  width={1200}
                  height={189}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-muted-dark text-body-sm mb-6 max-w-xs">
                Transforming EV charging into lifestyle moments. Because your
                time deserves more than waiting.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-on-dark font-medium text-body-sm mb-3">
                  <span id="newsletter" className="scroll-mt-28">Get time-saving tips &amp; offers</span>
                </p>
                {/* The form's fade-OUT is gone and that is the right trade:
                    it played under the success message that replaced it, so
                    nobody could attend to both. What matters is that the
                    confirmation ARRIVES, and hc-rise/hc-pop say that on
                    mount for nothing. */}
                {subscribed ? (
                    <div className="hc-rise flex items-center gap-2 text-ok-on-dark text-body-sm">
                      <span className="hc-pop inline-flex">
                        <Heart className="h-4 w-4" />
                      </span>
                      <span>Thanks for subscribing!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
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
                      <button
                        type="submit"
                        aria-label="Subscribe"
                        className="hc-press hc-tint w-10 h-10 rounded-full bg-brand hover:bg-brand-hover hover:scale-110 hover:shadow-[0_0_20px_rgba(255,122,0,0.3)] flex items-center justify-center text-ink-900"
                      >
                        <ArrowRight aria-hidden className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                {subscribeError && (
                  <p role="alert" className="text-caption text-error-on-dark mt-2">
                    {subscribeError}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="hc-press hc-tint hc-raise-grow w-10 h-10 rounded-full bg-white/10 border border-ink-600 flex items-center justify-center text-muted-dark hover:text-brand hover:border-brand/30"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-white font-semibold mb-4">Experience</h2>
              <ul className="space-y-3">
                {footerLinks.experience.map((link, i) => (
                  <li key={i} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
                    <a
                      href={link.href}
                      className="hc-move hc-tint hc-nudge text-muted-dark hover:text-brand text-body-sm inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h2 className="text-white font-semibold mb-4">Learn</h2>
              <ul className="space-y-3">
                {footerLinks.learn.map((link, i) => (
                  <li key={i} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
                    <a
                      href={link.href}
                      className="hc-move hc-tint hc-nudge text-muted-dark hover:text-brand text-body-sm inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h2 className="text-white font-semibold mb-4">Support</h2>
              <ul className="space-y-3">
                {footerLinks.support.map((link, i) => (
                  <li key={i} data-reveal style={{ "--d": `${i * 0.05}s` } as React.CSSProperties}>
                    <a
                      href={link.href}
                      className="hc-move hc-tint hc-nudge text-muted-dark hover:text-brand text-body-sm inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-white font-semibold mb-4">Contact</h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="hc-move hc-tint hc-nudge flex items-center gap-2 text-muted-dark hover:text-brand text-body-sm transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="break-words">{COMPANY.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${COMPANY.phoneE164}`}
                    className="hc-move hc-tint hc-nudge flex items-center gap-2 text-muted-dark hover:text-brand text-body-sm transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {COMPANY.phone}
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2 text-muted-dark text-body-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <span className="block text-caption uppercase tracking-wider text-muted-dark">
                        Corporate office
                      </span>
                      {COMPANY.address.street}
                      <br />
                      {COMPANY.address.city}, {COMPANY.address.state}{" "}
                      {COMPANY.address.zip}
                      {/* Derived. This read "Stations: Alhambra & Fontana, CA"
                          as a typed string, which stopped being true the day
                          Round Rock got an address — and would stop being true
                          again at every opening. */}
                      <span className="mt-1 block text-caption text-muted-dark">
                        Stations:{" "}
                        {statesWithCoverage()
                          .map((g) =>
                            [...g.live, ...g.soon].map((st) => st.city).join(", ")
                          )
                          .filter(Boolean)
                          .join(" · ")}{" "}
                        —{" "}
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
      <div className="border-t border-ink-600 py-6">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.legal.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="tap-target hc-move hc-tint hc-raise text-muted-dark hover:text-muted-dark text-caption"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-muted-dark text-caption text-center md:text-right">
              © {new Date().getFullYear()} HubCharge™. All rights reserved.
              <br className="md:hidden" />
              <span className="hidden md:inline"> • </span>
              Made with{" "}
              <span className="hc-move inline-block hover:scale-125">
                <Heart className="inline h-3 w-3 text-brand" />
              </span>{" "}
              for your time.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom energy line */}
      {/* hc-fill draws from the left; this one grows from the middle, which
          is what its gradient is built around. */}
      <div
        className="hc-fill h-[2px] bg-gradient-to-r from-transparent via-brand/50 to-transparent"
        style={{ transformOrigin: "center", animationDuration: "1s" }}
      />
    </footer>
  );
}
