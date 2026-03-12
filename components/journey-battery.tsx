"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { gsap } from "@/lib/gsap";

/**
 * HUBCHARGE JOURNEY - Clean, Aligned SVG Illustrations
 */

const journeySteps = [
  { id: 1, title: "ARRIVE", subtitle: "Valet greets you" },
  { id: 2, title: "TAP", subtitle: "Quick QR payment" },
  { id: 3, title: "RELAX", subtitle: "Valet plugs you in" },
  { id: 4, title: "ENJOY", subtitle: "Food & coffee delivered" },
  { id: 5, title: "GO", subtitle: "Valet unplugs • You're done" },
];

// ============================================
// CLEAN SVG COMPONENTS
// ============================================

// Simple modern EV car
function CarSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 180 60" className={className} style={style}>
      <defs>
        <linearGradient id="carBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
        <linearGradient id="carWindow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="90" cy="55" rx="70" ry="4" fill="#000" opacity="0.1" />

      {/* Main body - simple rounded shape */}
      <path
        d="M15,40 L20,35 L160,35 L165,40 L168,45 C170,48 168,50 160,50 L20,50 C12,50 10,48 12,45 Z"
        fill="url(#carBody)"
      />

      {/* Cabin - simple curve */}
      <path
        d="M35,35 L45,20 C55,12 125,12 135,20 L145,35 Z"
        fill="url(#carBody)"
      />

      {/* Windows - single continuous piece */}
      <path
        d="M48,33 L55,22 C63,15 117,15 125,22 L132,33 Z"
        fill="url(#carWindow)"
        opacity="0.9"
      />

      {/* Front wheel */}
      <circle cx="45" cy="47" r="10" fill="#111" />
      <circle cx="45" cy="47" r="7" fill="#333" />
      <circle cx="45" cy="47" r="3" fill="#555" />

      {/* Rear wheel */}
      <circle cx="135" cy="47" r="10" fill="#111" />
      <circle cx="135" cy="47" r="7" fill="#333" />
      <circle cx="135" cy="47" r="3" fill="#555" />

      {/* Headlight */}
      <ellipse cx="12" cy="42" rx="3" ry="2" fill="#fff" opacity="0.9" />

      {/* Taillight */}
      <ellipse cx="168" cy="42" rx="3" ry="2" fill="#ef4444" opacity="0.8" />

      {/* Charge port indicator */}
      <circle cx="155" cy="38" r="2" fill="#22c55e" opacity="0.8" />
    </svg>
  );
}

// Clean valet person
function ValetSVG({
  className = "",
  style = {},
  holding = "terminal",
}: {
  className?: string;
  style?: React.CSSProperties;
  holding?: "terminal" | "food";
}) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style}>
      {/* Shadow */}
      <ellipse cx="30" cy="97" rx="12" ry="2" fill="#000" opacity="0.08" />

      {/* Legs */}
      <rect x="22" y="60" width="6" height="35" rx="3" fill="#374151" />
      <rect x="32" y="60" width="6" height="35" rx="3" fill="#374151" />

      {/* Body */}
      <path
        d="M18,32 Q18,26 30,26 Q42,26 42,32 L44,60 L16,60 Z"
        fill="#f97316"
      />

      {/* Arms */}
      {holding === "terminal" ? (
        <>
          <rect
            x="10"
            y="34"
            width="8"
            height="22"
            rx="4"
            fill="#f97316"
            transform="rotate(-15, 14, 34)"
          />
          <rect
            x="42"
            y="34"
            width="8"
            height="22"
            rx="4"
            fill="#f97316"
            transform="rotate(15, 46, 34)"
          />
          {/* Terminal */}
          <rect
            x="18"
            y="48"
            width="24"
            height="32"
            rx="3"
            fill="#fff"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          <rect x="21" y="52" width="18" height="16" rx="2" fill="#111" />
          {/* QR dots */}
          <rect x="23" y="54" width="6" height="6" fill="#fff" />
          <rect x="31" y="54" width="6" height="6" fill="#fff" />
          <rect x="23" y="62" width="6" height="6" fill="#fff" />
          <circle cx="30" cy="75" r="2" fill="#22c55e" />
        </>
      ) : (
        <>
          <rect
            x="8"
            y="34"
            width="8"
            height="24"
            rx="4"
            fill="#f97316"
            transform="rotate(-20, 12, 34)"
          />
          <rect
            x="44"
            y="34"
            width="8"
            height="24"
            rx="4"
            fill="#f97316"
            transform="rotate(20, 48, 34)"
          />
          {/* Food bag */}
          <path
            d="M16,50 L18,85 Q18,90 30,90 Q42,90 42,85 L44,50 Z"
            fill="#f97316"
          />
          <path
            d="M20,50 L20,42 Q20,35 30,35 Q40,35 40,42 L40,50"
            stroke="#f97316"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="30" cy="68" r="8" fill="#fff" opacity="0.2" />
          <text
            x="30"
            y="72"
            textAnchor="middle"
            fontSize="10"
            fill="#fff"
            fontWeight="bold"
          >
            H
          </text>
        </>
      )}

      {/* Head */}
      <circle cx="30" cy="16" r="12" fill="#fcd9bd" />

      {/* Hair */}
      <path
        d="M19,12 Q19,5 30,5 Q41,5 41,12 Q41,8 30,8 Q19,8 19,12"
        fill="#4a3728"
      />

      {/* Face */}
      <circle cx="26" cy="15" r="1.5" fill="#333" />
      <circle cx="34" cy="15" r="1.5" fill="#333" />
      <path
        d="M27,20 Q30,23 33,20"
        stroke="#d4a88a"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

// Simple charger
function ChargerSVG({
  className = "",
  style = {},
  active = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <svg viewBox="0 0 40 80" className={className} style={style}>
      {/* Shadow */}
      <ellipse cx="20" cy="78" rx="12" ry="2" fill="#000" opacity="0.08" />

      {/* Base */}
      <rect x="10" y="70" width="20" height="8" rx="2" fill="#374151" />

      {/* Post */}
      <rect x="14" y="15" width="12" height="57" rx="2" fill="#4b5563" />

      {/* Screen */}
      <rect
        x="15"
        y="20"
        width="10"
        height="15"
        rx="1"
        fill={active ? "#22c55e" : "#e5e7eb"}
      >
        {active && (
          <animate
            attributeName="opacity"
            values="1;0.7;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </rect>

      {/* Cable holder */}
      <circle cx="20" cy="50" r="6" fill="#6b7280" />
      <circle cx="20" cy="50" r="4" fill={active ? "#22c55e" : "#9ca3af"}>
        {active && (
          <animate
            attributeName="fill"
            values="#22c55e;#4ade80;#22c55e"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Top */}
      <rect x="12" y="12" width="16" height="5" rx="2" fill="#6b7280" />
    </svg>
  );
}

// Charging cable
function CableSVG({
  className = "",
  style = {},
  active = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 40" className={className} style={style}>
      {/* Cable */}
      <path
        d="M5,20 Q30,35 50,20 Q70,5 95,20"
        stroke="#6b7280"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Energy flow */}
      {active && (
        <>
          <path
            d="M5,20 Q30,35 50,20 Q70,5 95,20"
            stroke="#22c55e"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 12"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-40"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
          <circle r="4" fill="#22c55e">
            <animateMotion
              dur="0.8s"
              repeatCount="indefinite"
              path="M5,20 Q30,35 50,20 Q70,5 95,20"
            />
          </circle>
        </>
      )}

      {/* Plug */}
      <rect x="90" y="15" width="10" height="12" rx="2" fill="#22c55e" />
    </svg>
  );
}

// Motion lines
function MotionSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={style}>
      <line
        x1="0"
        y1="8"
        x2="18"
        y2="8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.2"
      />
      <line
        x1="3"
        y1="15"
        x2="25"
        y2="15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="0"
        y1="22"
        x2="15"
        y2="22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.15"
      />
    </svg>
  );
}

// Floating card component
function FloatingCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ============================================
// SCENE PANELS - Clean and Centered
// ============================================

function Scene1({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Charger - consistent position */}
      <div
        className="absolute left-1 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={progress > 0.7} />
      </div>

      {/* Car arriving */}
      <div
        className="mb-4 ml-4 transition-all duration-700"
        style={{
          opacity: isActive ? 1 : 0.3,
          transform: `translateX(${isActive ? Math.min(progress * 20, 15) : -25}px)`,
        }}
      >
        <CarSVG className="w-28 lg:w-32" />
      </div>

      {/* Motion lines when arriving */}
      {isActive && progress < 0.6 && (
        <div
          className="absolute left-12 bottom-12"
          style={{ opacity: 0.5 - progress * 0.8 }}
        >
          <MotionSVG className="w-5 text-gray-400" />
        </div>
      )}
    </div>
  );
}

function Scene2({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Charger - consistent position */}
      <div
        className="absolute left-1 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={false} />
      </div>

      {/* Valet walking to car */}
      <div
        className="absolute left-8 bottom-4 transition-all duration-700 z-10"
        style={{
          opacity: isActive ? 1 : 0,
          transform: `translateX(${isActive ? Math.min(progress * 25, 18) : -10}px)`,
        }}
      >
        <ValetSVG className="w-9 h-14" holding="terminal" />
      </div>

      {/* Car */}
      <div className="mb-4 ml-4" style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}

function Scene3({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  const showBadge = isActive && progress > 0.4;

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Ultra-fast badge */}
      {showBadge && (
        <FloatingCard
          className="absolute top-3 right-2 transition-all duration-500"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600">
              Ultra-fast
            </span>
          </div>
        </FloatingCard>
      )}

      {/* Charger - consistent position */}
      <div
        className="absolute left-1 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={isActive && progress > 0.2} />
      </div>

      {/* Cable */}
      <div
        className="absolute bottom-10 left-5 transition-all duration-500 z-10"
        style={{ opacity: isActive && progress > 0.3 ? 1 : 0 }}
      >
        <CableSVG
          className="w-14 lg:w-16"
          active={isActive && progress > 0.4}
        />
      </div>

      {/* Car with glow */}
      <div
        className="mb-4 ml-4 relative"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CarSVG className="w-28 lg:w-32" />
        {isActive && progress > 0.4 && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-emerald-400 rounded-full blur-md"
            style={{ opacity: progress * 0.4 }}
          />
        )}
      </div>
    </div>
  );
}

function Scene4({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  const showNotif = isActive && progress > 0.2;

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Order notification - floating card at top */}
      {showNotif && (
        <FloatingCard
          className="absolute top-3 right-2 transition-all duration-500"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-800">
                Order ready!
              </p>
              <p className="text-[8px] text-gray-400">Arriving now</p>
            </div>
          </div>
        </FloatingCard>
      )}

      {/* Charger - consistent position (still charging) */}
      <div
        className="absolute left-1 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={isActive} />
      </div>

      {/* Cable - still connected during LIVE */}
      <div
        className="absolute bottom-10 left-5 z-10"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CableSVG className="w-14 lg:w-16" active={isActive} />
      </div>

      {/* Car with charging glow */}
      <div
        className="mb-4 ml-4 relative"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CarSVG className="w-28 lg:w-32" />
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-emerald-400 rounded-full blur-md opacity-30" />
        )}
      </div>

      {/* Valet with food - walks in front */}
      <div
        className="absolute right-2 bottom-4 transition-all duration-700 z-20"
        style={{
          opacity: isActive && progress > 0.3 ? 1 : 0,
          transform: `translateX(${isActive && progress > 0.3 ? 0 : 20}px)`,
        }}
      >
        <ValetSVG className="w-9 h-14" holding="food" />
      </div>
    </div>
  );
}

function Scene5({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  const showBadge = isActive && progress;

  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Ready to go badge */}
      {showBadge && (
        <FloatingCard
          className="absolute top-3 right-2 transition-all duration-500"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-600">
              Ready to go!
            </span>
          </div>
        </FloatingCard>
      )}

      {/* Charger - consistent position (idle now) */}
      <div
        className="absolute left-1 bottom-6"
        style={{ opacity: isActive ? 0.5 : 0.3 }}
      >
        <ChargerSVG className="w-7 h-14" active={false} />
      </div>

      {/* Motion lines */}
      {isActive && progress > 0.3 && (
        <div
          className="absolute left-10 bottom-12"
          style={{ opacity: progress * 0.5 }}
        >
          <MotionSVG className="w-5 text-gray-400" />
        </div>
      )}

      {/* Car leaving */}
      <div
        className="mb-4 ml-4 transition-all duration-700"
        style={{
          opacity: isActive ? 1 : 0.3,
          transform: `translateX(${isActive ? progress * 30 : 0}px)`,
        }}
      >
        <CarSVG className="w-32 lg:w-36" />
      </div>
    </div>
  );
}

// Memoized scene components to prevent re-renders
const MemoScene1 = memo(Scene1);
const MemoScene2 = memo(Scene2);
const MemoScene3 = memo(Scene3);
const MemoScene4 = memo(Scene4);
const MemoScene5 = memo(Scene5);

// ============================================
// MAIN COMPONENT
// ============================================

export function JourneyBattery() {
  const sectionRef = useRef<HTMLElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const scrollProgressRef = useRef(0);
  const lastStepRef = useRef(0);

  // Update panels directly via DOM to avoid React re-renders
  const updatePanels = useCallback((progress: number) => {
    if (!panelsRef.current || !progressBarsRef.current || !labelsRef.current)
      return;

    const panels = panelsRef.current.children;
    const bars = progressBarsRef.current.children;
    const labels = labelsRef.current.children;
    const currentStep = Math.min(Math.floor(progress * 5), 4);

    for (let i = 0; i < 5; i++) {
      const stepStart = i / 5;
      const stepEnd = (i + 1) / 5;
      let stepProgress = 0;
      if (progress >= stepEnd) stepProgress = 1;
      else if (progress > stepStart)
        stepProgress = (progress - stepStart) / (stepEnd - stepStart);

      const panel = panels[i] as HTMLElement;
      const bar = bars[i]?.firstChild as HTMLElement;
      const label = labels[i] as HTMLElement;
      const isActive = currentStep >= i;
      const isCurrent = currentStep === i;

      // Update panel background
      if (panel) {
        panel.style.backgroundColor = isActive
          ? `rgba(255, 237, 213, ${0.3 + stepProgress * 0.4})`
          : "rgba(249, 250, 251, 0.5)";
        const overlay = panel.querySelector("[data-overlay]") as HTMLElement;
        if (overlay) overlay.style.opacity = isActive ? "0" : "0.5";
        const dot = panel.querySelector("[data-dot]") as HTMLElement;
        if (dot) dot.style.display = isCurrent ? "block" : "none";
      }

      // Update progress bar
      if (bar) {
        bar.style.width = isCurrent
          ? `${stepProgress * 100}%`
          : isActive
            ? "100%"
            : "0%";
      }

      // Update labels
      if (label) {
        label.style.opacity = isActive ? "1" : "0.4";
        const title = label.querySelector("[data-title]") as HTMLElement;
        if (title)
          title.className = `text-xs lg:text-sm font-semibold mb-0.5 ${isCurrent ? "text-orange-500" : "text-gray-800"}`;
      }
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: batteryRef.current,
            start: "top 20%",
            end: "+=200%",
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
              const newStep = Math.min(Math.floor(self.progress * 5), 4);

              // Only trigger React re-render when step changes
              if (newStep !== lastStepRef.current) {
                lastStepRef.current = newStep;
                setActiveStep(newStep);
              }

              // Update DOM directly for smooth animation
              updatePanels(self.progress);
            },
          },
        },
      );

      gsap.fromTo(
        ".journey-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [updatePanels]);

  const getStepProgress = useCallback((i: number) => {
    const progress = scrollProgressRef.current;
    const start = i / 5,
      end = (i + 1) / 5;
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  }, []);

  const scenes = [MemoScene1, MemoScene2, MemoScene3, MemoScene4, MemoScene5];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-gradient-soft"
    >
      <div className="relative py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="journey-header text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 badge badge-primary mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wider">The Experience</span>
            </div>
            <h2 className="heading-section mb-4">
              Your 10-minute journey
            </h2>
            <p className="text-body-lg max-w-md mx-auto">
              From arrival to adventure. Every second designed for you.
            </p>
          </div>

          <div ref={batteryRef}>
            <div className="relative">
              <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
                {/* Battery terminal */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-r z-10" />

                {/* Panels */}
                <div
                  ref={panelsRef}
                  className="grid grid-cols-5 h-[180px] lg:h-[200px]"
                >
                  {journeySteps.map((step, i) => {
                    const isActive = activeStep >= i;
                    const isCurrent = activeStep === i;
                    const Scene = scenes[i];

                    return (
                      <div
                        key={step.id}
                        className={`relative ${i < 4 ? "border-r border-gray-100" : ""}`}
                      >
                        <Scene
                          progress={getStepProgress(i)}
                          isActive={isActive}
                        />

                        {/* Inactive overlay */}
                        <div
                          data-overlay
                          className="absolute inset-0 bg-gray-50/60 pointer-events-none"
                          style={{ opacity: isActive ? 0 : 0.5 }}
                        />

                        {/* Current dot */}
                        <div
                          data-dot
                          className="absolute top-2 left-1/2 -translate-x-1/2"
                          style={{ display: isCurrent ? "block" : "none" }}
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div ref={progressBarsRef} className="h-1 bg-gray-100 flex">
                  {journeySteps.map((_, i) => (
                    <div key={i} className="flex-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-400"
                        style={{
                          width:
                            activeStep === i
                              ? `${getStepProgress(i) * 100}%`
                              : activeStep > i
                                ? "100%"
                                : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Labels */}
              <div ref={labelsRef} className="grid grid-cols-5 mt-4">
                {journeySteps.map((step, i) => (
                  <div
                    key={step.id}
                    className="text-center"
                    style={{ opacity: activeStep >= i ? 1 : 0.4 }}
                  >
                    <p
                      data-title
                      className={`text-xs lg:text-sm font-semibold mb-0.5 ${activeStep === i ? "text-orange-500" : "text-gray-800"}`}
                    >
                      0{step.id}. {step.title}
                    </p>
                    <p className="text-[9px] lg:text-xs text-gray-400 hidden sm:block">
                      {step.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="relative max-w-5xl mx-auto px-6 pb-10 lg:pb-12">
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                Your car is your space
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Like home and office. We bring everything to you.
              </p>
            </div>
            <div className="flex items-center gap-5 lg:gap-6">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-orange-500">
                  10 min
                </p>
                <p className="text-gray-400 text-xs">100 miles</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-emerald-500">
                  Valet
                </p>
                <p className="text-gray-400 text-xs">plug & unplug</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-blue-500">
                  Lifestyle
                </p>
                <p className="text-gray-400 text-xs">delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Teaser */}
      <div className="relative max-w-5xl mx-auto px-6 pb-16 lg:pb-20">
        <div className="relative card p-6 lg:p-8 overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <p className="text-orange-500 text-sm font-medium uppercase tracking-widest mb-2">Coming Back?</p>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                Are you a HubCharge Member?
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                Members get free charging. Every $ you spend earns rewards.
              </p>
            </div>
            <a
              href="#membership"
              className="btn btn-primary"
            >
              Learn About Membership
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
