"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  // Set global GSAP defaults for consistent animations
  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });
}

export { gsap, ScrollTrigger, TextPlugin };

// Consistent animation presets used across all components
export const animations = {
  // Header/title animations
  fadeInUp: {
    from: { opacity: 0, y: 40 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
  },
  fadeInDown: {
    from: { opacity: 0, y: -40 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
  },
  // Content animations
  fadeInLeft: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
  },
  fadeInRight: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
  },
  // Card animations
  cardReveal: {
    from: { opacity: 0, y: 50, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
  },
  // Text reveal
  revealText: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
  },
};

// Consistent hover animation settings
export const hoverAnimations = {
  cardLift: {
    y: -8,
    duration: 0.3,
    ease: "power2.out",
  },
  cardLiftReset: {
    y: 0,
    duration: 0.3,
    ease: "power2.out",
  },
  iconScale: {
    scale: 1.15,
    rotate: 5,
    duration: 0.3,
    ease: "power2.out",
  },
  iconScaleReset: {
    scale: 1,
    rotate: 0,
    duration: 0.3,
    ease: "power2.out",
  },
  imageZoom: {
    scale: 1.1,
    duration: 0.6,
    ease: "power2.out",
  },
  imageZoomReset: {
    scale: 1,
    duration: 0.6,
    ease: "power2.out",
  },
};

// Scroll trigger defaults - consistent across all sections
export const scrollTriggerDefaults = {
  start: "top 85%",
  toggleActions: "play none none reverse",
};

// Stagger settings for card grids
export const staggerSettings = {
  cards: 0.15,
  features: 0.1,
  listItems: 0.08,
};
