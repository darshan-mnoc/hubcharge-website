"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-badge",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".contact-headline",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: { trigger: ".contact-cards", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".contact-form",
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      value: "(626) 555-CHARGE",
      subtitle: "Mon-Fri 9am-6pm PST",
    },
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@hubcharge.com",
      subtitle: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value: "108 S Monterey St",
      subtitle: "Alhambra, CA 91801",
    },
    {
      icon: Clock,
      title: "Hours",
      value: "6 AM - 10 PM",
      subtitle: "Open daily",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative section-padding bg-gray-50 overflow-hidden"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="contact-badge inline-flex items-center gap-2 badge badge-primary mb-8">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
          </div>

          <h2 className="contact-headline heading-section mb-6">
            Questions?
            <span className="text-gradient"> We're here.</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            Reach out to our team. We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="contact-cards grid sm:grid-cols-2 gap-4">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="contact-card card p-6 group hover:border-orange-200"
              >
                <div className="icon-box icon-box-primary mb-4 group-hover:bg-orange-200 transition-colors">
                  <info.icon className="h-6 w-6" />
                </div>
                <p className="text-gray-400 text-sm mb-1">{info.title}</p>
                <p className="text-gray-900 text-lg font-semibold mb-1">{info.value}</p>
                <p className="text-gray-400 text-sm">{info.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="contact-form card p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h3>
                <p className="text-gray-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 text-sm mb-2 block">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="text-gray-500 text-sm mb-2 block">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="input resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary btn-lg rounded-full"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
