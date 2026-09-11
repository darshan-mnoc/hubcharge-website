"use client";

import { useEffect } from "react";
import { setSmoothScroller } from "@/lib/smooth-scroll-bus";

/**
 * The smooth-scroll driver (§7b + §12.4). Renders nothing.
 *
 * WHAT CHANGED, AND WHY
 * This file used to import Lenis, GSAP and ScrollTrigger at module scope —
 * 113 KB, in the shared chunk, on all 60 routes including /terms, /privacy
 * and every guide. The prefers-reduced-motion check below is a RUNTIME check,
 * so a reader who had asked for no motion had already downloaded and parsed
 * every byte of it before we looked.
 *
 * Three changes, none of which a reader can feel:
 *
 *   1. Lenis is imported inside the effect, so it is a chunk fetched after
 *      the page is interactive rather than a chunk blocking it.
 *   2. GSAP is gone from here entirely. It was used for two things: as a rAF
 *      loop, which is four lines of rAF; and to keep ScrollTrigger in step,
 *      which is now ScrollTrigger's own business — JourneyBattery, the only
 *      scene that uses it, subscribes through the bus when IT loads. GSAP now
 *      ships only to the one page with a scene on it.
 *   3. It waits for an idle moment. Starting a wheel-smoothing loop during
 *      hydration competes with the work that makes the page usable, and
 *      nobody has scrolled yet.
 *
 * Coarse pointers are skipped outright: syncTouch is false, so on a phone
 * Lenis was being downloaded to do nothing at all.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* No wheel to smooth. Lenis with syncTouch:false hands touch straight
       back to the browser, so this was a megabyte-adjacent no-op on mobile. */
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let lenis: { raf(t: number): void; destroy(): void; scrollTo(...a: never[]): void } | null = null;
    let frame = 0;
    let cancelled = false;
    let onClick: ((e: MouseEvent) => void) | null = null;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const l = new Lenis({
        // lerp-based follow feels snappier than a long duration
        lerp: 0.12,
        wheelMultiplier: 1.05,
        smoothWheel: true,
        // Native momentum on touch — JS-driven touch smoothing is what made
        // first load feel like it hung.
        syncTouch: false,
      });
      lenis = l as unknown as typeof lenis;
      setSmoothScroller(l);

      /* Was gsap.ticker. The ticker gave us lagSmoothing, which matters for a
         timeline that must not jump after a stall; a scroll follower has no
         timeline and simply wants the next frame. */
      const tick = (time: number) => {
        l.raf(time);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);

      /* Only installed once Lenis is actually driving. While it is,
         globals.css sets `scroll-behavior: auto !important` on .lenis-smooth,
         so the native smooth scroll this replaces is switched off and
         something has to handle the jump. When Lenis never loads — touch,
         reduced motion, a failed chunk — that CSS rule never applies either,
         and `scroll-behavior: smooth` with `scroll-padding-top: 80px` on
         <html> does the same job for free. */
      onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const hash = a.getAttribute("href");
        if (!hash || hash.length < 2) return;
        const el = document.querySelector(hash);
        if (el) {
          e.preventDefault();
          l.scrollTo(el as HTMLElement, { offset: -80 });
        }
      };
      document.addEventListener("click", onClick);
    };

    /* After the page is usable, not during. requestIdleCallback is still
       absent in Safari at the time of writing, hence the timeout. */
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
      : window.setTimeout(() => void start(), 600);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle as number);
      if (onClick) document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      setSmoothScroller(null);
      lenis?.destroy();
    };
  }, []);

  return null;
}
