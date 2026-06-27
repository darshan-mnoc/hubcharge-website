"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/use-magnetic";

type Size = "sm" | "md" | "lg";
const SIZE: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-base",
};
const BASE =
  "group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg bg-brand text-white font-semibold cursor-pointer transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-hover hover:shadow-[0_10px_30px_-8px_rgba(255,122,0,0.55)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:shadow-[0_0_0_4px_rgba(255,122,0,0.25)]";

interface CtaButtonProps {
  children: ReactNode;
  to?: string; // internal route → next/link
  href?: string; // external / hash → anchor
  onClick?: () => void;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

/**
 * Single source of truth for primary CTAs (§6c). Consistent shape, hover
 * sheen-sweep + glow, active press, focus ring, and a subtle magnetic pull
 * (desktop / fine-pointer only). Renders as next/link, anchor, or button.
 */
export function CtaButton({
  children,
  to,
  href,
  onClick,
  size = "md",
  fullWidth = false,
  className = "",
  target,
  rel,
  type = "button",
  "aria-label": ariaLabel,
}: CtaButtonProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.22);
  const cls = `${BASE} ${SIZE[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {/* sheen sweep — the universal hover effect */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
        }}
      />
    </>
  );

  // Magnetic wrapper: measures bounds + translates content slightly toward cursor.
  const wrapperProps = {
    ref: ref as React.Ref<HTMLDivElement>,
    onMouseMove,
    onMouseLeave,
    style: { x, y, display: "inline-flex" as const, width: fullWidth ? "100%" : undefined },
  };

  let el: ReactNode;
  if (to) {
    el = (
      <Link href={to} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  } else if (href) {
    el = (
      <a href={href} className={cls} onClick={onClick} target={target} rel={rel} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  } else {
    el = (
      <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </button>
    );
  }

  return <motion.div {...wrapperProps}>{el}</motion.div>;
}
