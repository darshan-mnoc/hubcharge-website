"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    value: "(949) 391-4676",
    subtitle: "Mon-Fri 9am-6pm PST",
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "info@micronocinc.com",
    subtitle: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "9383 Charles Smith Avenue",
    subtitle: "Rancho Cucamonga, CA 91730",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "6 AM - 10 PM",
    subtitle: "Open daily",
  },
];

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
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[150px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Get in Touch
            </span>
          </div>

          <h2 className="heading-section text-white mb-6">
            Questions?
            <span className="text-gradient text-glow"> We're here.</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            Reach out to our team. We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card p-6 group cursor-pointer"
              >
                <div className="icon-box icon-box-primary mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <info.icon className="h-6 w-6" />
                </div>
                <p className="text-white/40 text-sm mb-1">{info.title}</p>
                <p className="text-white text-lg font-semibold mb-1">
                  {info.value}
                </p>
                <p className="text-white/30 text-sm">{info.subtitle}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto glass rounded-full flex items-center justify-center mb-6 border border-green-500/30"
                >
                  <svg
                    className="w-10 h-10 text-green-400"
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
                <h3 className="text-2xl font-bold text-white mb-3">
                  Message Sent!
                </h3>
                <p className="text-white/50">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-white/50 text-sm mb-2 block">
                      Your Name
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
                      Email Address
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
        </div>
      </div>
    </section>
  );
}
