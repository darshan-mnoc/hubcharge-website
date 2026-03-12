"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";

export function HeroLifestyle() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-stats",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        );

      // Floating animation for decorative elements
      gsap.to(".float-element", {
        y: -15,
        duration: 3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/home.png"
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <img
          src="/images/home.png"
          alt="HubCharge - Premium EV Charging with Valet Service"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Light overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white" />
      </div>

      {/* Soft gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[150px] float-element" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[120px] float-element" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-3 badge badge-primary mb-8">
          <Zap className="h-4 w-4" />
          <span className="text-sm font-medium">Full-Service EV Charging</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title heading-display text-gray-900 mb-8">
          We charge your car.
          <br />
          <span className="text-gradient">
            You enjoy your time.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-subtitle text-body-lg mb-12 max-w-2xl mx-auto">
          Our valet handles everything — plug in, charge, unplug.
          <span className="text-gray-900 font-medium"> You never leave your car.</span>
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#story"
            className="group btn btn-primary btn-lg"
          >
            See How It Works
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#locations"
            className="btn btn-outline btn-lg"
          >
            Find a Location
          </a>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats inline-flex flex-wrap justify-center gap-6 lg:gap-10 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
          {[
            { value: "180kW", label: "DC Fast Charging" },
            { value: "10 min", label: "100 Miles" },
            { value: "24/7", label: "Valet Service" },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-2xl lg:text-3xl font-bold text-orange-500 mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-gray-400 text-xs uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown className="h-5 w-5 text-orange-500 animate-bounce-soft" />
      </div>
    </section>
  );
}
