"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll-reveal (§7c). Any element with `data-reveal` fades + rises the
 * first time it enters view. CSS-driven (see globals.css); content stays visible
 * if JS fails or under prefers-reduced-motion. Renders nothing.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const raf = requestAnimationFrame(() =>
      document.querySelectorAll("[data-reveal]:not(.reveal-in)").forEach((el) => io.observe(el))
    );

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
