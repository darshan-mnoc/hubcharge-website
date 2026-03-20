"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Clock, Zap, Coffee, Utensils, ShoppingBag, Wine, ArrowRight, Check } from "lucide-react";

const timeActivities = [
  { time: 2, activity: "Order coffee", icon: Coffee, color: "bg-amber-500" },
  { time: 4, activity: "Browse menu", icon: Utensils, color: "bg-orange-500" },
  { time: 6, activity: "Food prepared", icon: Utensils, color: "bg-orange-500" },
  { time: 8, activity: "Delivered to car", icon: Check, color: "bg-emerald-500" },
  { time: 10, activity: "100 miles ready!", icon: Zap, color: "bg-orange-500" },
];

export function TimeValue() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Animate timeline
  useEffect(() => {
    if (isPlaying && currentMinute < 10) {
      const timer = setTimeout(() => {
        setCurrentMinute((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentMinute >= 10) {
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentMinute(0);
      }, 2000);
    }
  }, [isPlaying, currentMinute]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".time-value-content",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-play on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying && currentMinute === 0) {
          setTimeout(() => setIsPlaying(true), 500);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying, currentMinute]);

  return (
    <section
      ref={sectionRef}
      id="time-value"
      className="relative py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-orange-50 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 time-value-content">
          <p className="text-orange-500 text-sm font-medium uppercase tracking-[0.2em] mb-6">
            Time is Everything
          </p>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            What happens in
            <span className="text-orange-500"> 10 minutes</span>?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            While you charge, your lifestyle unfolds. Watch how every minute becomes value.
          </p>
        </div>

        {/* Interactive Timeline */}
        <div className="time-value-content mb-16">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 overflow-hidden">
            {/* Timer Display */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Elapsed Time</p>
                  <p className="text-4xl font-bold text-white">
                    {currentMinute}
                    <span className="text-white/50 text-xl ml-1">min</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white/50 text-sm">Range Added</p>
                <p className="text-4xl font-bold text-orange-400">
                  {currentMinute * 10}
                  <span className="text-orange-400/50 text-xl ml-1">mi</span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentMinute / 10) * 100}%` }}
                />
              </div>

              {/* Timeline Markers */}
              <div className="absolute -top-1 left-0 right-0 flex justify-between">
                {[0, 2, 4, 6, 8, 10].map((min) => (
                  <div
                    key={min}
                    className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      currentMinute >= min
                        ? "bg-orange-500 border-orange-400"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 lg:gap-4">
              {timeActivities.map((item, i) => {
                const isActive = currentMinute >= item.time;
                const isCurrent = currentMinute >= item.time - 2 && currentMinute < item.time;

                return (
                  <div
                    key={i}
                    className={`relative text-center p-4 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-white/10"
                        : isCurrent
                        ? "bg-white/5"
                        : "bg-transparent"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-all duration-500 ${
                        isActive ? item.color : "bg-white/5"
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 transition-colors ${
                          isActive ? "text-white" : "text-white/30"
                        }`}
                      />
                    </div>
                    <p className={`text-xs lg:text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-white/30"
                    }`}>
                      {item.activity}
                    </p>
                    <p className={`text-xs mt-1 ${isActive ? "text-orange-400" : "text-white/20"}`}>
                      {item.time} min
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Replay Button */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setCurrentMinute(0);
                  setTimeout(() => setIsPlaying(true), 100);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-medium transition-all"
              >
                <Zap className="h-4 w-4 text-orange-400" />
                {isPlaying ? "Playing..." : "Replay Timeline"}
              </button>
            </div>
          </div>
        </div>

        {/* What You Get Grid */}
        <div className="time-value-content grid md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Zap, value: "100", unit: "miles", label: "Added range", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: Coffee, value: "1", unit: "fresh", label: "Coffee delivered", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Utensils, value: "Hot", unit: "meal", label: "Food to your car", color: "text-red-500", bg: "bg-red-50" },
            { icon: Clock, value: "0", unit: "wait", label: "Time wasted", color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-6 text-center group hover:scale-105 transition-transform`}>
              <div className={`w-12 h-12 mx-auto rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-gray-500 text-sm">{item.unit}</p>
              <p className="text-gray-400 text-xs mt-2">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Don't Have Time - Attendant Service */}
        <div className="time-value-content">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <p className="text-orange-400 text-sm font-medium uppercase tracking-widest mb-3">Even Busier?</p>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Don't have time to unplug?
              </h3>
              <p className="text-white/60 max-w-md">
                Our attendant unplugs for you. Just tap "Ready to Go" in the app, and we handle the rest. Your time is sacred.
              </p>
            </div>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 whitespace-nowrap"
            >
              See Attendant Service
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
