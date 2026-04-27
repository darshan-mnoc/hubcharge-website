"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Clock, Headphones, Send } from "lucide-react";

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
      className="relative section-padding bg-[#080808] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px]" />

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

          <h2 className="heading-section text-white mb-4">
            Questions?{" "}
            <span className="text-gradient text-glow">We're here.</span>
          </h2>
          <p className="text-body-lg max-w-lg mx-auto">
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
              <h3 className="text-xl font-bold text-white mb-2">
                Message Sent!
              </h3>
              <p className="text-white/50 text-sm">
                We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-sm mb-2 block">
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
                  <label className="text-white/50 text-sm mb-2 block">
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
                <label className="text-white/50 text-sm mb-2 block">
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
                <label className="text-white/50 text-sm mb-2 block">
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

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(244, 130, 69, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn btn-primary btn-lg"
              >
                <Send className="h-5 w-5" />
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Bottom: Phone & Hours - Small */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/5"
        >
          {/* Phone */}
          <a
            href="tel:+19493914676"
            className="flex items-center gap-3 text-white/50 hover:text-orange-400 transition-colors group"
          >
            <Phone className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium">(949) 391-4676</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-white/10" />

          {/* Hours */}
          <div className="flex items-center gap-3 text-white/50">
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
