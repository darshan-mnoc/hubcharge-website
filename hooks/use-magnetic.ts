"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

/**
 * Magnetic hover (§7e). Pointer-fine only — no-op on coarse pointers.
 * Spread `ref`, `onMouseMove`, `onMouseLeave` on the target; bind a
 * motion.* element's style x/y to the returned `x`/`y`.
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.6 }) as MotionValue<number>;
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.6 }) as MotionValue<number>;

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return { ref, x, y, onMouseMove, onMouseLeave };
}
