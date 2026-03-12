"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Zap, Clock, Plus, Coffee, Utensils, Sparkles, Check, ArrowRight, Battery } from "lucide-react";

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge animation
      gsap.fromTo(
        ".pricing-badge",
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

      // Header
      gsap.fromTo(
        ".pricing-headline",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Main card
      gsap.fromTo(
        ".pricing-main-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pricing-main-card", start: "top 85%" },
        }
      );

      // Extensions cards
      gsap.fromTo(
        ".extension-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: ".extensions-section", start: "top 85%" },
        }
      );

      // Promo cards
      gsap.fromTo(
        ".promo-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: { trigger: ".promo-section", start: "top 85%" },
        }
      );

      // Floating icons
      gsap.to(".float-icon", {
        y: -8,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative section-padding bg-white overflow-hidden"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="pricing-badge inline-flex items-center gap-2 badge badge-primary mb-8">
            <Battery className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Simple Pricing</span>
          </div>

          <h2 className="pricing-headline heading-section mb-6">
            Charging made
            <span className="text-gradient"> simple</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            One flat rate. No surprises. Valet service included with every charge.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="pricing-main-card max-w-4xl mx-auto mb-16">
          <div className="relative card p-8 lg:p-12 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              {/* Left - Price */}
              <div className="text-center lg:text-left">
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Base Charge Session</p>
                <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-4">
                  <span className="text-7xl lg:text-8xl font-black text-orange-500">$12</span>
                  <span className="text-4xl lg:text-5xl font-bold text-amber-500">.50</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-700 font-medium">10 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                    <Zap className="h-4 w-4 text-emerald-500" />
                    <span className="text-gray-700 font-medium">100 miles</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Full valet service included. We handle everything.</p>
              </div>

              {/* Right - What's Included */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 font-semibold mb-4">Everything Included:</h3>
                <ul className="space-y-3">
                  {[
                    "Valet greets you at arrival",
                    "They plug in your car",
                    "Payment at your window",
                    "Valet unplugs when ready",
                    "Order food to your car",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Extensions Section */}
        <div className="extensions-section max-w-4xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Need More Time?</h3>
            <p className="text-gray-500">Add up to 4 extensions of 5 minutes each</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((ext) => (
              <div
                key={ext}
                className="extension-card card p-5 text-center cursor-pointer group hover:border-orange-200"
              >
                <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                  <Plus className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">$3</p>
                <p className="text-gray-500 text-sm">+5 minutes</p>
                <p className="text-xs text-gray-400 mt-1">Extension {ext}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 bg-gray-50 rounded-xl p-4 max-w-lg mx-auto border border-gray-100">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Maximum session:</span> 30 minutes =
              <span className="text-orange-500 font-bold"> $24.50</span>
            </p>
          </div>
        </div>

        {/* Promo Section */}
        <div className="promo-section">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Best Part?
            </h3>
            <p className="text-body-lg">Your charge session includes more than just electricity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Promo Card 1 */}
            <div className="promo-card relative overflow-hidden rounded-3xl p-8 group hover:scale-[1.02] transition-transform duration-300">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative">
                <div className="float-icon flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Utensils className="h-7 w-7 text-white" />
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Coffee className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-bold text-white mb-3">Order Food</h4>
                <p className="text-white/90 text-lg mb-6">
                  Get your <span className="font-bold">charge FREE</span> when you order $15+ of food or drinks
                </p>
                <a href="#lifestyle" className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg">
                  See What's Available
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="promo-card relative overflow-hidden rounded-3xl p-8 group hover:scale-[1.02] transition-transform duration-300">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative">
                <div className="float-icon flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl lg:text-3xl font-bold text-white mb-3">Charge Up</h4>
                <p className="text-white/90 text-lg mb-6">
                  Get a <span className="font-bold">FREE coffee</span> or snack with every charging session
                </p>
                <a href="#locations" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg">
                  Find a Location
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-lg">
            <span className="text-gray-600 font-medium">Charge & Chill.</span> It's that simple.
          </p>
        </div>
      </div>
    </section>
  );
}
