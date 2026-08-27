"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary" | "secondaryOnDark";

const SIZE: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-8 py-4 text-base",
};

/** Shape, motion and focus language shared by both variants. */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

// Focus ring colour is per-variant so the indicator keeps >=3:1 against the
// surface it actually sits on (WCAG 1.4.11). brand-ink on white is 5.3:1;
// brand on navy is 6.7:1.
//
// The primary label is ink-900, not white. White on #FF7A00 is 2.6:1 and
// fails AA outright, which on the most-clicked control on the site is the
// kind of thing the Unruh Act attaches to. Darkening the fill would have
// fixed it too, but that would have cost the brand orange; navy on the
// untouched orange scores 6.7:1, better than either alternative.
const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand text-ink-900 hover:bg-brand-hover focus-visible:ring-brand-ink focus-visible:ring-offset-white",
  // Ghost button for light sections. The border is the only thing marking the
  // control, so it needs 3:1 against white (WCAG 1.4.11) — ink-400 is 3.35:1,
  // where the paper hairlines used elsewhere would be 1.8:1.
  secondary:
    "bg-transparent border border-ink-400 text-ink-700 hover:border-brand-ink hover:text-brand-ink focus-visible:ring-brand-ink focus-visible:ring-offset-white",
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
  /** extra classes merged onto the element (e.g. responsive width "sm:w-auto") */
  wrapperClassName?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

/**
 * Single source of truth for CTAs. All variants share one shape, press and
 * focus language; the difference is fill vs outline, nothing more. The
 * magnetic pull, sheen sweep and coloured glow were removed deliberately —
 * they read as agency-portfolio effects, not as a service brand.
 * Renders as next/link, anchor, or button.
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
  const cls = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${fullWidth ? "w-full" : ""} ${className} ${wrapperClassName}`.trim();

  const inner = (
    <span className="inline-flex items-center gap-2">{children}</span>
  );

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

  return el;
}
