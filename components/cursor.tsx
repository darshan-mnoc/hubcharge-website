"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

/**
 * Branded custom cursor (§7d): a brand dot that tracks 1:1 with a trailing ring.
 * Desktop / fine-pointer only; native cursor returns on touch + reduced-motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // ring trails with a light spring; the dot binds to x/y directly (instant)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => setHovering(!!(e.target as HTMLElement).closest?.(INTERACTIVE));
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", d);
    window.addEventListener("mouseup", u);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", d);
      window.removeEventListener("mouseup", u);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      {/* trailing ring — brand outline reads on light + dark */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        aria-hidden
        style={{
          x: ringX,
          y: ringY,
          width: 26,
          height: 26,
          marginLeft: -13,
          marginTop: -13,
          border: "1.25px solid rgba(255,122,0,0.5)",
        }}
        animate={{ scale: down ? 0.8 : hovering ? 1.25 : 1, opacity: hovering ? 0.7 : 0.45 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.6 }}
      />
      {/* brand dot — bind to x/y directly so it never lags */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        aria-hidden
        style={{
          x,
          y,
          width: 7,
          height: 7,
          marginLeft: -3.5,
          marginTop: -3.5,
          background: "#FF7A00",
          boxShadow: "0 0 8px 1px rgba(255,122,0,0.7)",
        }}
        animate={{ scale: down ? 0.7 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  );
}
