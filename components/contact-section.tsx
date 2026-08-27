"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Clock, Headphones, Send } from "lucide-react";
import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";
import { submitContact } from "@/lib/actions";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const result = await submitContact({ ...formData, company });
    setSending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-reveal
      className="relative section-padding bg-hero overflow-hidden"
    >
      {/* Background photo + navy overlay (§5a) */}
      <div className="absolute inset-0">
        <Image
          src="/images/charging-service-v2.webp"
          alt=""
          aria-hidden
          fill
          className="object-cover opacity-20"
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


      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-6">
            <p className="text-overline text-white/55">Support</p>
            <span aria-hidden className="mt-3 block h-px w-8 bg-brass" />
          </div>

          <h2 className="text-h2 text-white mb-4 max-w-headline">
            Questions?{" "}
            We&apos;re here.
          </h2>
          <p className="text-body-lg text-muted-dark max-w-lg">
            Our team is ready to help with charging, membership, or services.
          </p>
        </motion.div>

        {/* Contact Form - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-6 lg:p-8 max-w-xl mx-auto"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 mx-auto glass rounded-full flex items-center justify-center mb-5 border border-green-500/30"
              >
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-[#f4f3f2] mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-dark text-sm">
                We&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="text-muted-dark text-sm mb-2 block">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-muted-dark text-sm mb-2 block">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="text-muted-dark text-sm mb-2 block">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="input"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="text-muted-dark text-sm mb-2 block">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              {/* Honeypot — hidden from humans, bots fill it */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              {error && (
                <p role="alert" className="text-sm text-[#ffb4ab]">
                  {error}
                </p>
              )}

              <CtaButton type="submit" size="lg" fullWidth>
                <Send className="h-5 w-5" />
                {sending ? "Sending…" : "Send Message"}
              </CtaButton>
            </form>
          )}
        </motion.div>

        {/* Bottom: Phone & Hours - Small */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-10 pt-8 border-t border-[#334155]"
        >
          {/* Phone */}
          <a
            href="tel:+19493914676"
            className="flex items-center gap-3 text-muted-dark hover:text-brand transition-colors group"
          >
            <Phone className="h-4 w-4 text-brand" />
            <span className="text-sm font-medium">(949) 391-4676</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-[#334155]" />

          {/* Hours */}
          <div className="flex items-center gap-3 text-muted-dark">
            <Clock className="h-4 w-4 text-green-400" />
            <span className="text-sm">
              Mon–Fri, 9 AM – 6 PM PST
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
