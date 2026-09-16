"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the user's OS "reduce motion" setting, and keeps tracking it if they
 * change it mid-session.
 *
 * The CSS blanket rule in globals.css only zeroes animation-duration and
 * transition-duration — it cannot reach JS-driven animation, so framer-motion
 * and GSAP have to opt out explicitly. Our /accessibility page promises
 * motion is disabled when this is set, so anything animated needs this hook.
 *
 * Starts false so server and first client render agree; the effect corrects it
 * immediately on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Syncing from an external store (matchMedia) is exactly what this effect
    // is for; the initial read has to happen post-mount to stay SSR-safe.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
