"use client";

import { useEffect, useId, useRef, useState, useCallback, memo } from "react";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onSmoothScroll } from "@/lib/smooth-scroll-bus";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ILLO, CABLE_CASING } from "@/lib/illustration";
import * as Base from "@/components/illustration/primitives";

/**
 * HUBCHARGE JOURNEY - Premium UX Redesign
 */

const journeySteps = [
  { id: 1, title: "Arrive", subtitle: "Pick a charger spot" },
  { id: 2, title: "Easy payment", subtitle: "Stay in your car" },
  { id: 3, title: "Charge", subtitle: "We plug you in" },
  { id: 4, title: "Add time or services", subtitle: "Extend or order food" },
  { id: 5, title: "Finish", subtitle: "We unplug • You're done" },
];

// ============================================
// SVG COMPONENTS — visually refined
// ============================================

/* The drawings themselves now live in components/illustration/primitives.tsx
   so the guide covers can use the same ones. These wrappers exist only to
   supply the gradient namespace that useId() used to provide inside each
   component, so every call site here is unchanged. */
function CarSVG(p: Omit<Parameters<typeof Base.CarSVG>[0], "id">) {
  return <Base.CarSVG id={useId().replace(/[^a-zA-Z0-9-]/g, "")} {...p} />;
}
function ValetSVG(p: Omit<Parameters<typeof Base.ValetSVG>[0], "id">) {
  return <Base.ValetSVG id={useId().replace(/[^a-zA-Z0-9-]/g, "")} {...p} />;
}
function ChargerSVG(p: Omit<Parameters<typeof Base.ChargerSVG>[0], "id" | "still">) {
  /* The SMIL here ignored prefers-reduced-motion entirely: the blanket CSS
     rule in globals.css only zeroes animation-duration, which <animate> does
     not read. /accessibility promises motion is off when that setting is on. */
  const still = useReducedMotion();
  return <Base.ChargerSVG id={useId()} still={still} {...p} />;
}
function CableSVG(p: Omit<Parameters<typeof Base.CableSVG>[0], "id" | "still">) {
  const still = useReducedMotion();
  return <Base.CableSVG id={useId().replace(/[^a-zA-Z0-9-]/g, "")} still={still} {...p} />;
}
function MotionSVG(p: Omit<Parameters<typeof Base.MotionSVG>[0], "id">) {
  return <Base.MotionSVG id={useId().replace(/[^a-zA-Z0-9-]/g, "")} {...p} />;
}

function Scene1({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.3;
  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const chargerPosition = isMobile
    ? "absolute left-1 bottom-4"
    : "absolute left-2 bottom-6";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Pick your spot
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            NACS or CCS
          </p>
        </div>
      )}

      {/* Charger */}
      <div className={chargerPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <ChargerSVG className="w-9 h-[4.15rem]" active={progress > 0.7} />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>

      {/* Motion lines */}
      {isActive && progress < 0.6 && (
        <div
          className="absolute left-12 bottom-10"
          style={{ opacity: 0.5 - progress * 0.8 }}
        >
          <MotionSVG className="w-5 text-white/55" />
        </div>
      )}
    </div>
  );
}

function Scene2({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.2;
  const valetPosition = isMobile
    ? "absolute left-[25%] bottom-3 transition-all duration-700 z-10"
    : "absolute left-[45%] bottom-4 transition-all duration-700 z-10";

  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Stay in your car */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Stay in your car<span className="text-brass">*</span>
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            We come to you
          </p>
        </div>
      )}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={false} />
      </div>

      {/* Attendant with terminal */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive ? 1 : 0,
          transform: `translateX(${isActive ? Math.min(progress * 15, 10) : -10}px)`,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="terminal" />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}

function Scene3({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.5;
  const showCable = isActive && progress > 0.4;

  const valetStart = isMobile ? 25 : 30;
  const valetMove = isMobile ? 18 : 25;

  const valetPosition = isActive
    ? Math.min(progress * valetMove, valetMove)
    : 0;

  // const valetPosition = isActive ? Math.min(progress * 25, 18) : 0;

  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Charge 10 minutes
          </p>
        </div>
      )}
      {/* Floating badge */}
      {/* {showBadge && (
        <div
          className="absolute top-8 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-brand"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[10px] font-semibold text-brand-ink tracking-tight">
              Ultra-fast
            </span>
          </div>
        </div>
      )} */}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={progress > 0.15} />
      </div>

      {/* Attendant walking with cable */}
      <div
        className="absolute bottom-4 z-20 transition-all duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          left: `calc(17% + ${valetPosition}px)`,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="cable" />
      </div>

      {/* Cable connecting charger to car */}
      <div
        className="absolute bottom-8 left-6 z-10 transition-all duration-300"
        style={{ opacity: showCable ? 1 : 0 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={showCable}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {showCable && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-brand rounded-full blur-md opacity-35" />
        )}
      </div>
    </div>
  );
}

function Scene4({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showNotif = isActive && progress > 0.2;
  const showBadge = isActive && progress > 0.5;
  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const valetPosition = isMobile
    ? "absolute right-40 bottom-3 transition-all duration-700 z-20"
    : "absolute right-2 bottom-4 transition-all duration-700 z-20";

  return (
    <div className="relative w-full h-full">
      {/* Notification card */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Select your services
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            or add more charging time
          </p>
        </div>
      )}
      {/* {showNotif && (
        <div
          className="absolute top-20 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shadow-card">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-ink-800 leading-tight">
                75+ miles added
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={isActive} />
      </div>

      {/* Cable stays connected */}
      <div
        className="absolute bottom-8 left-6 z-10"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={isActive}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-brand rounded-full blur-md opacity-30" />
        )}
      </div>

      {/* Attendant with food */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive && progress > 0.3 ? 1 : 0,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="food" />
      </div>
    </div>
  );
}

function Scene5({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const carPosition = isMobile
    ? "absolute left-[46%] -translate-x-1/2 bottom-3"
    : "absolute left-[68%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* The finish.

          This panel used to fade its charger to 50% and draw no cable, which
          is why it read as an empty frame rather than an ending. It now shows
          a completed session: the pedestal lit and at rest, the cable coiled
          back into the holster, and the car pulling away. */}

      {/* Charger — done, not dimmed */}
      <div className="absolute left-2 bottom-6">
        <ChargerSVG className="w-9 h-[4.15rem]" done={isActive} />
      </div>

      {/* Cable back on the hook */}
      <div
        className="absolute left-[1.35rem] bottom-[1.6rem] w-4 transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0.4 }}
      >
        <svg viewBox="0 0 16 22" fill="none" aria-hidden>
          <path
            d="M8,2 C13,5 13,10 8,12 C3,14 3,18 8,20"
            stroke={ILLO.body}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M8,2 C13,5 13,10 8,12 C3,14 3,18 8,20"
            stroke={ILLO.seam}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Session complete — the one orange mark, so "done" is legible */}
      {isActive && (
        <div
          className="absolute left-1 bottom-[3.9rem] transition-opacity duration-500"
          style={{ opacity: Math.min(1, progress * 2) }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" aria-hidden>
            <circle cx="10" cy="10" r="9" fill={ILLO.live} />
            <path
              d="M6 10.4 L8.8 13 L14 7.6"
              fill="none"
              stroke={ILLO.stage}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Motion lines — the car is leaving */}
      {isActive && progress > 0.3 && (
        <div
          className="absolute left-[30%] bottom-10"
          style={{ opacity: progress * 0.6 }}
        >
          <MotionSVG className="w-6 text-white/55" />
        </div>
      )}

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}


const MemoScene1 = memo(Scene1);
const MemoScene2 = memo(Scene2);
const MemoScene3 = memo(Scene3);
const MemoScene4 = memo(Scene4);
const MemoScene5 = memo(Scene5);

// ============================================
// STEP ICON — numbered pill
// ============================================

// ============================================
// MAIN COMPONENT — logic untouched
// ============================================

export function JourneyBattery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveCard, setMobileActiveCard] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const scrollProgressRef = useRef(0);
  const lastStepRef = useRef(0);
  const allDoneRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile carousel scroll to update active dot
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const first = carousel.firstElementChild as HTMLElement | null;
      const cardWidth = first
        ? first.offsetWidth + 16
        : carousel.offsetWidth * 0.85 + 16;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      setMobileActiveCard(Math.min(activeIndex, 4));
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

      if (panel) {
        // No fill-as-state: tinting panels cream is what made this read as
        // clip-art. Active/inactive is expressed as scene opacity instead.
        panel.style.backgroundColor = "transparent";
        panel.style.opacity = isActive ? "1" : "0.34";
        const overlay = panel.querySelector("[data-overlay]") as HTMLElement;
        if (overlay) overlay.style.opacity = isActive ? "0" : "0.3";
        const dot = panel.querySelector("[data-dot]") as HTMLElement;
        if (dot) dot.style.display = isCurrent ? "block" : "none";
      }

      if (bar) {
        bar.style.width = isCurrent
          ? `${stepProgress * 100}%`
          : isActive
            ? "100%"
            : "0%";
      }

      if (label) {
        label.style.opacity = isActive ? "1" : "0.4";

        // Pill - consistent size, just color changes
        const pill = label.querySelector("[data-pill]") as HTMLElement;
        if (pill) {
          pill.style.color = isCurrent
            ? "#FFFFFF"
            : isActive
              ? "rgba(255,255,255,0.72)"
              : "rgba(255,255,255,0.55)";
          pill.style.background = "transparent";
          pill.style.boxShadow = "none";
        }

        // Title - consistent size, just color changes
        const title = label.querySelector("[data-title]") as HTMLElement;
        if (title) {
          title.style.color = isCurrent
            ? "#FFFFFF"
            : "rgba(255,255,255,0.55)";
        }

        // Subtitle - just opacity change
        const subtitle = label.querySelector("[data-subtitle]") as HTMLElement;
        if (subtitle) {
          subtitle.style.opacity = isActive ? "0.8" : "0";
        }
      }
    }
  }, []);

  // Handle clicking on a step card
  const handleStepClick = useCallback((stepIndex: number) => {
    if (!scrollTriggerRef.current) return;

    const st = scrollTriggerRef.current;
    const targetProgress = (stepIndex + 0.5) / 5; // Center of the step

    // Calculate the scroll position for this progress
    const scrollStart = st.start;
    const scrollEnd = st.end;
    const targetScroll =
      scrollStart + (scrollEnd - scrollStart) * targetProgress;

    // Smooth scroll to that position
    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Reduced motion: no pinning, no scrub, no header reveal. The section
    // scrolls normally and every step renders in its completed state, so the
    // content is fully available without any scroll-driven movement.
    if (reduced) {
      scrollProgressRef.current = 1;
      lastStepRef.current = 4;
      // Settling the scene into its finished state is the whole point of this
      // branch — there is no scroll driver to do it for us.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveStep(4);
      updatePanels(1);
      return;
    }

    // Guarded: below lg the trigger element is display:none, and pinning a
    // zero-height node with end "+=200%" injects ~2 viewport-heights of blank
    // scroll on mobile.
    /* Lenis moves the page without the browser firing a scroll event that
       ScrollTrigger would otherwise catch in time, so the pin reads a stale
       position and the scene lags the page by a frame or two under a fast
       wheel. SmoothScroll used to wire this up itself, which meant importing
       GSAP there — and that one import put 113 KB of animation engine into
       the shared chunk of all 60 routes to serve this one scene on this one
       page. Now the scene that needs it asks for it, and returns an
       unsubscribe like any other listener. If the driver never loads (touch,
       reduced motion) this simply never fires and native scroll events do the
       job, which is what happens on a phone today. */
    const offSmooth = onSmoothScroll(ScrollTrigger.update);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: batteryRef.current,
        start: "top 15%",
        end: "+=200%",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          const newStep = Math.min(Math.floor(self.progress * 5), 4);
          if (newStep !== lastStepRef.current) {
            lastStepRef.current = newStep;
            setActiveStep(newStep);
          }
          updatePanels(self.progress);
        },
      });

      // Store the ScrollTrigger instance
      scrollTriggerRef.current = st;

      // NB: a `.journey-header` reveal used to live here. It was registered
      // inside the min-width:1024px matchMedia, but the only element carrying
      // that class is inside a lg:hidden block — so it animated a node that is
      // never visible when the animation is active, and never ran when it was.
    }, sectionRef);

      return () => ctx.revert();
    });

    return () => {
      offSmooth();
      mm.revert();
    };
  }, [updatePanels, reduced]);

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
      className="relative bg-ink-900"
    >
      {/* ---- TOP SECTION ---- */}
      <div className="relative py-8 lg:py-12">
        <div className="section-container">
          {/* Header - Mobile only (desktop header is inside pinned container) */}
          <div className="journey-header mb-6 lg:hidden">
            <p className="text-overline text-white/55">The experience</p>
            {/* Not an <h2>: the pinned desktop header below owns that heading,
                and both are in the DOM simultaneously. */}
            <p className="text-h2 text-white mb-2">Your charging journey</p>
            <p className="text-body-sm text-on-dark/60">Swipe to explore each step</p>
          </div>

          {/* ---- MOBILE HORIZONTAL CAROUSEL ---- */}
          <div className="lg:hidden -mx-4 sm:-mx-6">
            {/* Swipeable cards container */}
            <div
              ref={mobileCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-6 gap-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {journeySteps.map((step, i) => {
                const Scene = scenes[i];
                return (
                  <div
                    key={step.id}
                    className="flex-shrink-0 w-[85vw] snap-center rounded-lg overflow-hidden border border-white/10 bg-ink-800"
                  >
                    {/* Scene visualization */}
                    <div className="relative h-[186px] overflow-hidden">
                      {/* Scene container with padding to shift content right */}
                      <div className="absolute inset-0 pl-8">
                        <Scene progress={1} isActive={true} isMobile={true} />
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="p-4 bg-ink-800 border-t border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <div className="text-index text-white/55 shrink-0">
                          {String(step.id).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-h4 text-white">{step.title}</p>
                          <p className="text-caption text-on-dark/55 mt-0.5">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Battery Indicator */}
            <div className="px-6 mt-5">
              <div className="flex items-center justify-center">
                {/* Battery container */}
                <div
                  className="relative flex items-center rounded-lg px-1.5 py-1.5"
                  style={{
                    background: `linear-gradient(145deg, ${ILLO.body}, ${ILLO.stage})`,
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Inner glow when charging */}
                  {mobileActiveCard >= 2 && mobileActiveCard < 4 && (
                    <div
                      className="absolute inset-0 rounded-lg opacity-30"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(34,197,94,0.4) 0%, transparent 70%)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Battery cells */}
                  <div className="flex items-center gap-1 relative z-10">
                    {journeySteps.map((_, i) => {
                      const isActive = mobileActiveCard === i;
                      const isCompleted = mobileActiveCard > i;
                      const isFilled = isActive || isCompleted;
                      const isCharging =
                        mobileActiveCard >= 2 && mobileActiveCard < 4;

                      return (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Go to step ${i + 1}: ${journeySteps[i].title}`}
                          aria-current={isActive ? "step" : undefined}
                          onClick={() => {
                            const carousel = mobileCarouselRef.current;
                            if (carousel) {
                              const first = carousel.firstElementChild as HTMLElement | null;
                              const cardWidth = first
                                ? first.offsetWidth + 16
                                : carousel.offsetWidth * 0.85 + 16;
                              carousel.scrollTo({
                                left: i * cardWidth,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="relative h-7 rounded-md transition-all duration-400 overflow-hidden"
                          style={{
                            width: isActive ? "20px" : "14px",
                            background: isFilled
                              ? isCharging ||
                                (mobileActiveCard >= 4 && isCompleted)
                                ? `linear-gradient(180deg, ${ILLO.liveGlow} 0%, ${ILLO.live} 100%)`
                                : `linear-gradient(180deg, ${ILLO.liveGlow} 0%, ${ILLO.live} 100%)`
                              : "rgba(71,85,105,0.4)",
                            boxShadow: isFilled
                              ? isCharging
                                ? "0 0 8px rgba(74,222,128,0.6), inset 0 1px 0 rgba(255,255,255,0.3)"
                                : "0 0 8px rgba(251,146,60,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
                              : "inset 0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {/* Cell shine */}
                          {isFilled && (
                            <div
                              className="absolute inset-x-0 top-0 h-1/3 rounded-t-md"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
                              }}
                            />
                          )}
                          {/* Charging pulse */}
                          {isActive && isCharging && (
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Battery terminal */}
                  <div
                    className="w-1.5 h-3 rounded-r-sm ml-1"
                    style={{
                      background:
                        `linear-gradient(180deg, ${ILLO.seam} 0%, ${ILLO.idle} 100%)`,
                    }}
                  />
                </div>

                {/* Status text */}
                <div className="ml-4 text-left">
                  <p
                    className={`text-caption font-semibold ${
                      mobileActiveCard >= 4
                        ? "text-brand"
                        : mobileActiveCard >= 2
                          ? "text-brand-on-dark"
                          : "text-muted-dark"
                    }`}
                  >
                    {mobileActiveCard >= 4
                      ? "Ready!"
                      : mobileActiveCard >= 2
                        ? "Charging…"
                        : `Step ${mobileActiveCard + 1}`}
                  </p>
                  {/* Real chrome beside the drawing, not type inside it — so
                      it takes the reading scale and the contrast floor rather
                      than the illustration's micro-type exemption. */}
                  <p className="text-footnote text-white/55">
                    {mobileActiveCard + 1} of 5
                  </p>
                </div>
              </div>

              {/* Tap hint */}
              <p className="text-center text-[10px] text-white/55 mt-3 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-ink-300" />
                Tap battery or swipe
                <span className="w-4 h-px bg-ink-300" />
              </p>
            </div>
          </div>

          {/* ---- DESKTOP BATTERY WIDGET ---- */}
          <div ref={batteryRef} className="hidden lg:block">
            {/* Header - Inside pinned container for desktop */}
            <div className="mb-20">
              <p className="text-overline text-white/55">The experience</p>
              <h2 className="text-h2 text-white mb-3 max-w-headline">
                Your charging journey
              </h2>
              <p className="text-body-lg text-on-dark/70 max-w-[36ch]">
                Charging made simple, fast, and effortless.
              </p>
            </div>
            <div className="relative">
              {/* Stage. A white card floating on navy read as a sticker; the
                  scene now sits directly on the section with one ground line. */}
              <div className="relative overflow-hidden border-y border-white/[0.07]">

                {/* Scene panels */}
                <div
                  ref={panelsRef}
                  className="grid grid-cols-5 h-[204px] lg:h-[224px]"
                >
                  {/* Deliberate render-time ref read: GSAP scrub drives
                      scrollProgressRef per frame; React re-renders only on
                      integer step changes. State here would re-render every
                      scroll frame. */}
                  {/* eslint-disable-next-line react-hooks/refs */}
                  {journeySteps.map((step, i) => {
                    const isActive = activeStep >= i;
                    const isCurrent = activeStep === i;
                    const Scene = scenes[i];

                    return (
                      <div
                        key={step.id}
                        className={`relative transition-colors duration-300 ${
                          i < 4 ? "border-r border-white/[0.07]" : ""
                        }`}
                      >
                        <Scene
                          progress={getStepProgress(i)}
                          isActive={isActive}
                          isMobile={isMobile}
                        />

                        {/* Inactive overlay */}
                        <div
                          data-overlay
                          className="absolute inset-0 bg-ink-900/40 pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isActive ? 0 : 0.3 }}
                        />

                        {/* Current step pulse dot */}
                        <div
                          data-dot
                          className="absolute top-2.5 left-1/2 -translate-x-1/2"
                          style={{ display: isCurrent ? "block" : "none" }}
                        >
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress track */}
                <div
                  ref={progressBarsRef}
                  className="h-[1.5px] flex"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {/* eslint-disable-next-line react-hooks/refs -- same deliberate render-time ref read as above */}
                  {journeySteps.map((_, i) => (
                    <div key={i} className="flex-1 overflow-hidden">
                      <div
                        className="h-full transition-none"
                        style={{
                          background:
                            ILLO.live,
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

              {/* Step labels */}
              <div ref={labelsRef} className="grid grid-cols-5 mt-6">
                {journeySteps.map((step, i) => {
                  const isActive = activeStep >= i;
                  const isCurrent = activeStep === i;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(i)}
                      className="flex flex-col items-start gap-2 transition-all duration-300 cursor-pointer group py-2 text-left"
                    >
                      {/* Pill */}
                      <div
                        data-pill
                        className="text-index transition-colors duration-300"
                        style={{
                          /* 0.55 is 6.01:1 on ink-900; 0.22 was 2.01:1 before
                             the button's own 0.4 opacity took it to ~1.3:1. */
                          color: isCurrent
                            ? "#FFFFFF"
                            : isActive
                              ? "rgba(255,255,255,0.72)"
                              : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {String(step.id).padStart(2, "0")}
                      </div>

                      <div className="px-1">
                        <p
                          data-title
                          className="font-bold tracking-tight transition-all duration-300 group-hover:text-brand text-body-sm lg:text-body"
                          style={{
                            color: isCurrent ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                            marginBottom: "2px",
                          }}
                        >
                          {step.title}
                        </p>
                        {/* <p
                          data-subtitle
                          className="text-white/55 leading-snug transition-all duration-300 text-caption lg:text-body-sm"
                          style={{
                            opacity: isActive ? 0.8 : 0,
                          }}
                        >
                          {step.subtitle}
                        </p> */}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ---- SUMMARY STATS ----
           A white card floating on the navy stage read as a sticker, and the
           dark-stage conversion left its heading white-on-white. It is now a
           hairline spec row on the section itself, matching the hero. */}
      <div className="section-container pb-16 lg:pb-20">
        <div className="border-t border-white/10 pt-8 grid gap-8 lg:grid-cols-[minmax(0,28ch)_1fr] lg:gap-16">
          <div>
            <h3 className="text-h3 text-white mb-1.5">Your car is your space</h3>
            <p className="text-body-sm text-on-dark/60">
              Like home and office. We bring everything to you.
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { v: "10 min", l: `Adds ${TEN_MINUTE_RANGE} miles, by car` },
              { v: "Attendant", l: "Plugs in and unplugs for you" },
              { v: "Lifestyle", l: "Delivered to your window" },
            ].map((stat, i) => (
              <div
                key={stat.v}
                className={`py-4 sm:py-0 ${i === 0 ? "sm:pr-6" : "sm:px-6"} ${i === 2 ? "sm:pr-0" : ""}`}
              >
                <dt className="text-h3 text-white">{stat.v}</dt>
                <dd className="text-caption text-on-dark/55 mt-1">{stat.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

    </section>
  );
}
