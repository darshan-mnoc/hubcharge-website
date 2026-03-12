"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  Utensils,
  Coffee,
  ShoppingBag,
  Sparkles,
  Car,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Coffee,
    title: "Coffee & Drinks",
    desc: "Fresh coffee, boba, smoothies delivered hot to your window.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    color: "bg-amber-500",
  },
  {
    icon: Utensils,
    title: "Food & Meals",
    desc: "Breakfast, lunch, dinner — from local restaurants to your car.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    color: "bg-orange-500",
  },
  {
    icon: ShoppingBag,
    title: "Groceries & Errands",
    desc: "Quick essentials, pharmacy runs, anything you need picked up.",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    color: "bg-blue-500",
  },
  {
    icon: Sparkles,
    title: "Services",
    desc: "Car detailing, dry cleaning pickup — make your 10 minutes count.",
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
    color: "bg-purple-500",
  },
];

export function LifestyleDestinations() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge
      gsap.fromTo(
        ".lifestyle-badge",
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

      // Headline
      gsap.fromTo(
        ".lifestyle-headline",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Hero visual
      gsap.fromTo(
        ".lifestyle-hero",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".lifestyle-hero", start: "top 85%" },
        }
      );

      // Feature cards
      gsap.fromTo(
        ".lifestyle-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".lifestyle-cards", start: "top 80%" },
        }
      );

      // Floating tags
      gsap.to(".float-tag", {
        y: -6,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lifestyle"
      className="relative section-padding bg-gray-50 overflow-hidden"
    >
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="lifestyle-badge inline-flex items-center gap-2 badge badge-primary mb-8">
            <Car className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Your Car, Your Space</span>
          </div>

          <h2 className="lifestyle-headline heading-section mb-6">
            Everything delivered
            <br />
            <span className="text-gradient">to your window</span>
          </h2>
          <p className="text-body-lg max-w-3xl mx-auto">
            Stay in your car. Our valet brings everything to you — food, drinks, groceries, services.
            <span className="text-gray-800 font-medium"> Your 10 minutes, fully utilized.</span>
          </p>
        </div>

        {/* Hero Visual */}
        <div className="lifestyle-hero mb-16">
          <div className="relative card p-8 lg:p-12 overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Car icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-orange-100">
                    <Car className="h-20 w-20 lg:h-24 lg:w-24 text-orange-500" strokeWidth={1} />
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-[2px] bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200" />
                  <ArrowRight className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              {/* What comes to you */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-orange-500 text-sm font-semibold uppercase tracking-widest mb-3">
                  While you charge
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  The world comes to you
                </h3>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {["Coffee", "Breakfast", "Lunch", "Groceries", "Packages", "Dry Cleaning"].map(
                    (item, i) => (
                      <span
                        key={item}
                        className="float-tag bg-white text-orange-600 px-5 py-2.5 rounded-full text-sm lg:text-base font-semibold border border-orange-200 shadow-sm"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="lifestyle-cards grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="lifestyle-card group card card-interactive overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                {/* Icon */}
                <div className="absolute top-4 left-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-body leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#locations"
            className="btn btn-primary btn-lg"
          >
            See What's Near You
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
