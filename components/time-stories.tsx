"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const stories = [
  {
    id: 1,
    quote: "I used to dread charging. Now I look forward to it. Last Tuesday, I found my new favorite coffee spot while my car got 80 miles. I didn't want to leave.",
    author: "Sarah M.",
    role: "Product Designer",
    location: "San Francisco",
    timeSaved: "15 hours/month",
  },
  {
    id: 2,
    quote: "Hand over the keys, walk into a café, catch up on emails. By the time I've finished my espresso, I have 100 miles. It feels like a cheat code for life.",
    author: "Michael R.",
    role: "Founder",
    location: "Palo Alto",
    timeSaved: "20 hours/month",
  },
  {
    id: 3,
    quote: "My kids used to complain about charging stops. Now they ask 'can we go to the Hub?' That ice cream shop next door doesn't hurt.",
    author: "Jennifer L.",
    role: "Working Parent",
    location: "San Jose",
    timeSaved: "12 hours/month",
  },
  {
    id: 4,
    quote: "As a photographer, I now use those 10 minutes to scout the neighborhood. Charging became part of my creative process. Never saw that coming.",
    author: "David K.",
    role: "Photographer",
    location: "Berkeley",
    timeSaved: "18 hours/month",
  },
];

const impactStats = [
  { value: "47,832", label: "Hours reclaimed", sublabel: "This month" },
  { value: "2.4M", label: "Miles added", sublabel: "And counting" },
  { value: "98%", label: "Recommend", sublabel: "To friends" },
  { value: "4.9", label: "Rating", sublabel: "12k+ reviews" },
];

export function TimeStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStory, setCurrentStory] = useState(0);

  const nextStory = () => setCurrentStory((prev) => (prev + 1) % stories.length);
  const prevStory = () => setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stories-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = setInterval(nextStory, 6000);
    return () => clearInterval(timer);
  }, []);

  const story = stories[currentStory];

  return (
    <section ref={sectionRef} id="stories" className="relative py-32 lg:py-40 bg-[#F8F7F5] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="stories-content text-center mb-20">
          <p className="text-orange-500 text-sm font-medium uppercase tracking-[0.2em] mb-6">
            Real Stories
          </p>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6">
            Time well spent
          </h2>
        </div>

        {/* Story Card */}
        <div className="stories-content max-w-4xl mx-auto mb-20">
          <div className="relative bg-white border border-gray-100 rounded-3xl p-10 lg:p-16 shadow-xl">
            {/* Quote Icon */}
            <Quote className="absolute top-8 left-8 h-16 w-16 text-orange-200" strokeWidth={1} />

            {/* Quote */}
            <blockquote className="relative text-2xl lg:text-3xl text-gray-700 leading-relaxed mb-10 italic font-light">
              "{story.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                  {story.author.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">{story.author}</p>
                  <p className="text-gray-400">{story.role} · {story.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-orange-500 font-bold text-lg">{story.timeSaved}</p>
                  <p className="text-gray-400 text-sm">Time reclaimed</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-orange-500 fill-orange-500" />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={prevStory}
                className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStory(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentStory ? "w-8 bg-orange-500" : "w-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextStory}
                className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="stories-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {impactStats.map((stat, i) => (
              <div key={i} className="bg-white p-8 text-center">
                <p className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
                <p className="text-gray-400 text-sm">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
