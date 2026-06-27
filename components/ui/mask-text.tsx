"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { lineMask, inView } from "@/lib/motion";

/**
 * Headline mask-reveal (§7f). Each line slides up out of its own clip.
 * Pass lines verbatim — markup only, no copy changes.
 */
export function MaskText({
  lines,
  className,
  stagger = 0.1,
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
}) {
  const anim = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { ...inView, once: true } };
  return (
    <motion.span
      className={className}
      initial="hidden"
      {...anim}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden" style={{ paddingBottom: "0.06em" }}>
          <motion.span className="block" variants={lineMask}>
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
