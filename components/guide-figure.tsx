"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Shared shell for every interactive block inside a guide.
 *
 * Before this, each block reinvented its own card, caption and footnote, which
 * is how four of them ended up with four different footnote colours. It also
 * carries the scroll-in reveal in one place, gated once, rather than nine
 * components each remembering to check prefers-reduced-motion.
 */
export function GuideFigure({
  eyebrow,
  title,
  children,
  footnote,
  wide = true,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  footnote?: ReactNode;
  wide?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`${wide ? "breakout " : ""}not-prose my-8 rounded-lg border border-paper-300 bg-paper p-5 sm:p-6`}
    >
      {(eyebrow || title) && (
        <div className="mb-5">
          {eyebrow && <p className="text-overline text-ink-500">{eyebrow}</p>}
          {eyebrow && <span aria-hidden className="mt-3 mb-4 block h-px w-8 bg-brass" />}
          {title && <p className="text-h4 text-ink-900">{title}</p>}
        </div>
      )}
      {children}
      {footnote && (
        <figcaption className="mt-5 text-caption text-ink-400">{footnote}</figcaption>
      )}
    </motion.figure>
  );
}

/** A labelled numeric readout. Used by every calculator so they agree. */
export function Readout({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
}) {
  return (
    <div>
      <dt className="text-caption text-ink-500">{label}</dt>
      <dd className="text-h2 text-ink-900 mt-1 whitespace-nowrap">
        {value}
        {unit && <span className="text-h4 text-ink-500 ml-1.5">{unit}</span>}
      </dd>
      {sub && <dd className="text-caption text-ink-400 mt-1">{sub}</dd>}
    </div>
  );
}

/** Range control matching the .range-brand treatment used site-wide. */
export function GuideSlider({
  id, label, value, onChange, min, max, step, format, hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  format: (n: number) => string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-caption text-ink-500">{label}</label>
        <span className="text-body-sm font-semibold text-ink-900 tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-brand mt-2 w-full"
      />
      {hint && <p className="text-caption text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}
