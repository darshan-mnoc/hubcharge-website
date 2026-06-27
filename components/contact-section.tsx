"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Clock, Headphones, Send } from "lucide-react";
import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          src="/images/charging-service-v2.png"
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

      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF7A00]/10 rounded-full blur-[70px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
            <Headphones className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Support
            </span>
          </div>

          <h2 className="heading-section text-[#f4f3f2] mb-4">
            Questions?{" "}
            <span className="text-gradient text-glow">We're here.</span>
          </h2>
          <p className="text-body-lg text-muted-dark max-w-lg mx-auto">
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
              <p className="text-[#8A9BB5] text-sm">
                We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#8A9BB5] text-sm mb-2 block">
                    Name
                  </label>
                  <input
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
                  <label className="text-[#8A9BB5] text-sm mb-2 block">
                    Email
                  </label>
                  <input
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
                <label className="text-[#8A9BB5] text-sm mb-2 block">
                  Subject
                </label>
                <input
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
                <label className="text-[#8A9BB5] text-sm mb-2 block">
                  Message
                </label>
                <textarea
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

              <CtaButton type="submit" size="lg" fullWidth>
                <Send className="h-5 w-5" />
                Send Message
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
            className="flex items-center gap-3 text-[#8A9BB5] hover:text-[#FF7A00] transition-colors group"
          >
            <Phone className="h-4 w-4 text-[#FF7A00]" />
            <span className="text-sm font-medium">(949) 391-4676</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-[#334155]" />

          {/* Hours */}
          <div className="flex items-center gap-3 text-[#8A9BB5]">
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
