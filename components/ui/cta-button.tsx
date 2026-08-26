"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/use-magnetic";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary" | "secondaryOnDark";

const SIZE: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-base",
};

/** Shape, motion and focus language shared by both variants. */
const BASE =
  "group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

// Focus ring colour is per-variant so the indicator keeps >=3:1 against the
// surface it actually sits on (WCAG 1.4.11). brand-ink on white is 5.3:1;
// brand on navy is 6.7:1.
const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover hover:shadow-[0_10px_30px_-8px_rgba(255,122,0,0.55)] focus-visible:ring-brand-ink focus-visible:ring-offset-white",
  // Ghost button for light sections.
  secondary:
    "bg-transparent border border-gray-300 text-gray-700 hover:border-brand-ink hover:text-brand-ink focus-visible:ring-brand-ink focus-visible:ring-offset-white",
  // Same shape, tuned for the navy (bg-hero) bands.
  secondaryOnDark:
    "bg-transparent border border-white/25 text-on-dark hover:border-brand hover:text-brand focus-visible:ring-brand focus-visible:ring-offset-hero",
};

interface CtaButtonProps {
  children: ReactNode;
  to?: string; // internal route → next/link
  href?: string; // external / hash → anchor
  onClick?: () => void;
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  /** classes for the magnetic wrapper (e.g. responsive width like "sm:w-auto") */
  wrapperClassName?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

/**
 * Single source of truth for CTAs (§6c). Both variants share one shape,
 * press and focus language; primary adds the sheen sweep and glow. Carries a
 * subtle magnetic pull (fine-pointer only). Renders as next/link, anchor, or
 * button. Use variant="secondary" instead of the legacy .btn-outline class.
 */
export function CtaButton({
  children,
  to,
  href,
  onClick,
  size = "md",
  variant = "primary",
  fullWidth = false,
  className = "",
  wrapperClassName = "",
  target,
  rel,
  type = "button",
  "aria-label": ariaLabel,
}: CtaButtonProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.22);
  const cls = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {/* sheen sweep — primary only; on the ghost variant it reads as noise */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
          }}
        />
      )}
    </>
  );

  // Magnetic wrapper: measures bounds + translates content slightly toward cursor.
  const wrapperProps = {
    ref: ref as React.Ref<HTMLDivElement>,
    onMouseMove,
    onMouseLeave,
    className: `${fullWidth ? "flex w-full" : "inline-flex"} ${wrapperClassName}`.trim(),
    style: { x, y },
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
