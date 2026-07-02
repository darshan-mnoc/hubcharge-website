"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;

/**
 * Single smooth-scroll driver (§7b + §12.4).
 * Lenis is driven by GSAP's ticker so framer-motion, GSAP ScrollTrigger, and
 * Lenis all stay in sync. Disabled under prefers-reduced-motion. Renders nothing.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // lerp-based follow feels snappier/more responsive than a long duration
      lerp: 0.12,
      wheelMultiplier: 1.05,
      smoothWheel: true,
      // Use NATIVE touch scrolling on mobile — JS-driven touch smoothing is what
      // made first load feel like it hung. Native momentum is smooth & lightweight.
      syncTouch: false,
    });
    lenisInstance = lenis;

    // keep ScrollTriggers in sync with Lenis
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // smooth in-page hash links
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // reset scroll on route change
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}
