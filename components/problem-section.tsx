"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowDown, Zap, Clock, User } from "lucide-react";
import Image from "next/image";

const solutionCards = [
  {
    icon: User,
    title: "Valet Greets You",
    desc: "A real person comes to your car the moment you arrive. No apps, no kiosks.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  },
  {
    icon: Zap,
    title: "They Handle It All",
    desc: "Plug in, payment, unplug when done. You stay in your car the entire time.",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
  },
  {
    icon: Clock,
    title: "You Live Your Life",
    desc: "Order coffee, food, groceries — delivered to your window while you charge.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
];

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge animation
      gsap.fromTo(
        ".problem-badge",
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

      // Headlines
      gsap.fromTo(
        ".problem-headline",
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
        ".problem-subtext",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Image reveal
      gsap.fromTo(
        ".problem-image",
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".problem-image", start: "top 85%" },
        }
      );

      // Solution cards
      gsap.fromTo(
        ".solution-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".solution-cards", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative section-padding bg-white overflow-hidden"
    >
      <div className="section-container">
        {/* The Problem */}
        <div className="text-center mb-16">
          <div className="problem-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 border border-red-200 mb-8">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-600 text-sm font-semibold uppercase tracking-wider">The Problem</span>
          </div>

          <h2 className="problem-headline heading-section mb-8 leading-tight">
            You spend 30-40 minutes<br />
            at "fast" chargers.
            <br />
            <span className="text-gray-400">What do you get back?</span>
          </h2>

          <p className="problem-subtext text-body-lg max-w-3xl mx-auto">
            Standing in parking lots. Watching your phone. Waiting for a percentage to move.
            <span className="text-gray-800 font-medium"> Your time is worth more than that.</span>
          </p>
        </div>

        {/* Problem Image */}
        <div className="problem-image relative max-w-4xl mx-auto mb-16">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="aspect-[16/9] relative">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                alt="Person waiting at EV charger"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            {/* Caption */}
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-white/90 text-lg lg:text-xl font-medium italic">
                "Another 35 minutes... just standing here."
              </p>
            </div>
          </div>
        </div>

        {/* Arrow Divider */}
        <div className="flex justify-center mb-16">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200 hover-lift">
            <ArrowDown className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* The Solution */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">The HubCharge Way</span>
          </div>

          <h2 className="heading-section mb-6 leading-tight">
            10 minutes. 100 miles.
            <br />
            <span className="text-gradient">A valet who handles everything.</span>
          </h2>
        </div>

        {/* Solution Cards */}
        <div className="solution-cards grid md:grid-cols-3 gap-6 lg:gap-8">
          {solutionCards.map((card, i) => (
            <div
              key={i}
              className="solution-card group card card-interactive overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-52 lg:h-60 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

                {/* Number badge */}
                <div className="absolute top-4 left-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-orange-500 font-bold">{i + 1}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-box icon-box-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading-card">{card.title}</h3>
                </div>
                <p className="text-body leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition to Journey */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-4">See it in action</p>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-3 link text-lg font-semibold group"
          >
            Watch the 10-minute journey
            <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
