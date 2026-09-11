"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DUR, EASE_OUT, NO_MOTION, SPRING_LAYOUT, SPRING_READOUT, SPRING_TRACK } from "@/lib/motion";

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
  resizes = false,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  footnote?: ReactNode;
  wide?: boolean;
  /** This figure changes height as the reader uses it — animate the card
   *  rather than letting it jump to the new size. Opt-in, because layout
   *  projection is not free and only one figure in the set actually swaps
   *  panels of different heights. */
  resizes?: boolean;
}) {
  const reduced = useReducedMotion();
  /* The card already waits to be scrolled to. Its drawings have to wait with
     it: a curve that traces itself at mount has finished long before anyone
     scrolls down to the figure, so the reader arrives at a static picture and
     the motion was spent on nobody. `.is-in` is the moment of arrival, and
     every [data-draw]/[data-fill]/[data-pop] child holds its first frame
     until this flips. See globals.css.

     One observer for the whole figure — the one the reveal already uses. No
     figure needs its own, and none of them import an animation library just
     to fade a bar in. */
  const [arrived, setArrived] = useState(false);
  return (
    <motion.figure
      layout={resizes && !reduced}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      onViewportEnter={() => setArrived(true)}
      viewport={{ once: true, amount: 0.25 }}
      /* Two jobs, one prop: the reveal is an arrival, so it takes EASE_OUT —
         imported rather than retyped, which this file used to do, leaving the
         one shared shell not referencing the one shared curve. A resizing
         card is a different motion and takes the layout spring. */
      transition={
        resizes && !reduced
          ? { layout: SPRING_LAYOUT, duration: DUR.base, ease: EASE_OUT }
          : { duration: DUR.base, ease: EASE_OUT }
      }
      /* No `hc-fig` under reduced motion, so the held first frames in
         globals.css never apply and there is nothing to be stuck inside. */
      className={`${wide ? "breakout " : ""}not-prose my-8 rounded-lg border border-paper-300 bg-paper p-5 sm:p-6${
        reduced ? "" : ` hc-fig${arrived ? " is-in" : ""}`
      }`}
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

/**
 * A number that travels to its new value instead of teleporting to it.
 *
 * WHY THIS EXISTS
 * Every calculator in the guide system reports through Readout, and until now
 * Readout rendered `{value}` straight into the DOM. Two things followed from
 * that, and both are visible while you drag a slider: the number jumped in
 * hard steps rather than moving, and — because the <dd> never set
 * `tabular-nums` while GuideSlider's own label twelve lines below it DID —
 * the digits changed width as they changed, so the whole readout twitched
 * left and right as you dragged. One file, two different answers.
 *
 * The value rides a spring and is written to the DOM node directly. React does
 * not re-render on any of those frames: at sixty frames a second under a
 * moving thumb, re-rendering a figure to change a number is how a calculator
 * starts dropping frames.
 */
function AnimatedNumber({
  value,
  decimals,
  reduced,
  step,
  unit,
}: {
  value: number;
  decimals: number;
  reduced: boolean;
  /** The unit this value is in. Not rendered here — see the effect below. */
  unit?: string;
  /**
   * The smallest change the model can actually produce.
   *
   * A spring is right for a continuous quantity and wrong for a quantised
   * one. shift-planner's "off the road" is always a whole number of charging
   * sessions times the minutes each one takes — it can emit 26 or 52 and
   * nothing between — but a spring sweeping 26 to 52 renders 31, 38, 44 on
   * the way. Those are not roundings of the answer; they are answers the
   * model cannot give.
   *
   * With a step, the displayed value snaps to the nearest multiple as the
   * spring travels, so the number still moves but only ever lands on states
   * the model can actually be in.
   */
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(value);
  /* SPRING_READOUT, not SPRING_SETTLE: the latter has a damping ratio of
     0.850 and so overshoots by 0.63%, which on a readout means displaying a
     number the model never produced. */
  const spring = useSpring(mv, {
    ...SPRING_READOUT,
    /* Stop as soon as the rendered text can no longer change. The default
       rest thresholds keep a spring alive for several frames after the last
       visible digit has settled, and a figure can hold three of these. */
    restDelta: 0.5 * 10 ** -decimals,
    restSpeed: 10 ** -decimals,
  });
  const shown = useTransform(spring, (v) =>
    (step && step > 0 ? Math.round(v / step) * step : v).toFixed(decimals)
  );

  /* A CHANGE OF UNIT IS A JUMP, NEVER A JOURNEY.
     routine-planner crosses sixty minutes by sending 59 with "min/wk" and
     then 1.0 with "hr/wk". Springing between those renders "50.3 hr/wk",
     "41.6 hr/wk", "30.0 hr/wk" — numbers the model never produced, in a unit
     it never produced them in.

     The first attempt at this re-keyed the component so React would mount a
     fresh one. React never removed the old span: they accumulated, one per
     crossing, until the readout said "21 1.0 59 1.0 hr/wk". Verified in the
     DOM. Handling it inside the component needs no remount, so there is
     nothing to leak — and it states the rule where the rule belongs. */
  const lastUnit = useRef(unit);
  useEffect(() => {
    const unitChanged = lastUnit.current !== unit;
    lastUnit.current = unit;
    if (reduced || unitChanged) {
      mv.jump(value);
      if (ref.current) ref.current.textContent = value.toFixed(decimals);
      return;
    }
    mv.set(value);
  }, [value, reduced, mv, decimals, unit]);

  useMotionValueEvent(shown, "change", (v) => {
    if (ref.current) ref.current.textContent = v;
  });

  /* REACT MUST NOT OWN THE TEXT INSIDE THIS SPAN.
     Two separate hazards, and the second one bit hard.

     First: written as `{value.toFixed(decimals)}`, React writes the TARGET
     value on every parent re-render and the subscription above writes the
     spring's CURRENT value back a frame later — a visibly vibrating number
     under a dragged slider, worse than the hard jump it replaced. Freezing
     the rendered string fixes that.

     Second, and worse: setting `textContent` REPLACES the text node React
     created and still tracks. Its fiber then points at a node that is no
     longer in the document, so when the parent re-keys this component on a
     unit change React fails to remove the old span — leaving "59" sitting
     beside the new "1.0" and rendering `591.0 hr/wk`. Verified in the DOM.

     dangerouslySetInnerHTML is the honest fix: it tells React it does not
     manage this element's children, so mutating them afterwards is legitimate
     and removal works. The content is a number we produced with toFixed, so
     there is nothing to escape. */
  const [initial] = useState(() => value.toFixed(decimals));
  return <span ref={ref} dangerouslySetInnerHTML={{ __html: initial }} />;
}

/** A labelled numeric readout. Used by every calculator so they agree. */
export function Readout({
  label,
  value,
  unit,
  sub,
  decimals,
  step,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  /** Digits after the point. Give this whenever the value is not a whole
   *  number: inferring it from the value would render 4.833333333333333 with
   *  fifteen decimals, and a caller that pre-formats to a string to avoid
   *  that drops out of the animated path entirely — which is exactly what
   *  routine-planner did for most of its slider's range. */
  decimals?: number;
  /** The smallest step the model can produce. See AnimatedNumber. */
  step?: number;
}) {
  const reduced = useReducedMotion();
  const numeric = typeof value === "number" && Number.isFinite(value);
  const dp = decimals ?? (numeric && !Number.isInteger(value) ? 1 : 0);
  return (
    <div>
      <dt className="text-caption text-ink-500">{label}</dt>
      {/* tabular-nums: without it the digits are proportionally spaced, so a
          readout going 9 -> 10 -> 11 shifts sideways on every step. */}
      <dd className="text-h2 text-ink-900 mt-1 whitespace-nowrap tabular-nums">
        {numeric ? (
          /* The unit is passed in so a change of unit becomes a jump rather
             than a spring — see AnimatedNumber. The bug it prevents:
             routine-planner crosses sixty minutes by changing `value` from 59
             to 1.0 and `unit` from min/wk to hr/wk in the same render. The
             unit swapped instantly while the number sprang, and because it
             was the same component instance the spring interpolated the whole
             way — so for a fifth of a second the figure read "50.3 hr/wk",
             "41.6 hr/wk", "30.0 hr/wk". Every one of those is a number the
             model never produced, in a unit it never produced it in.

             Keying on the unit destroys the instance and mounts a fresh one
             already at the new value, so a spring cannot travel across a unit
             boundary. It is not a fix for routine-planner; it is a fix for
             every figure that will ever change units. */
          <AnimatedNumber
            value={value}
            decimals={dp}
            reduced={reduced}
            step={step}
            unit={unit}
          />
        ) : (
          value
        )}
        {/* The unit crossfades with the number rather than snapping, so the
            two never disagree about which quantity is on screen. */}
        {unit && (
          <motion.span
            key={unit}
            className="text-h4 text-ink-500 ml-1.5"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? NO_MOTION : { duration: DUR.micro, ease: EASE_OUT }}
          >
            {unit}
          </motion.span>
        )}
      </dd>
      {sub && <dd className="text-caption text-ink-400 mt-1">{sub}</dd>}
    </div>
  );
}

/**
 * A bar in a normalised set — three fuel costs, three charging times.
 *
 * It animates the QUANTITY and derives the width from it on every frame,
 * which is the whole point. Animating the already-normalised percentage means
 * that when the normaliser changes owner — a different model becomes the
 * slowest, a different fuel becomes the dearest — every bar tweens its own old
 * percentage to its own new one independently, and each intermediate frame is
 * a blend of two different normalisations. The ratio between the bars during
 * that half second corresponds to no real set of numbers.
 *
 * Doing the division after the spring means every frame is a real quantity,
 * so every frame is a real ratio.
 */
export function RatioBar({
  value,
  worst,
  className = "bg-ink-700",
  floor = 2,
}: {
  value: number;
  /** What the set is normalised against. May change owner at any time. */
  worst: number;
  className?: string;
  /** Minimum visible width, so a near-zero bar is still a bar. */
  floor?: number;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, SPRING_TRACK);
  const width = useTransform(spring, (v) => `${Math.max(floor, (v / worst) * 100)}%`);
  useEffect(() => {
    if (reduced) mv.jump(value);
    else mv.set(value);
  }, [value, reduced, mv]);
  return <motion.div className={`h-full rounded-full ${className}`} style={{ width }} />;
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
  /* Held state, so the value you are currently setting reads as the live one.
     Pointer events rather than mouse, so this is true under a thumb as well as
     under a cursor — the same omission that left the curve chart inert on
     phones entirely. */
  const [held, setHeld] = useState(false);
  /* This tween had no gate at all. The blanket CSS rule in globals.css cannot
     reach a framer animation — the hook's own docstring says so — which meant
     a reader who asked for less motion got this one anyway. */
  const reduced = useReducedMotion();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-caption text-ink-500">{label}</label>
        <motion.span
          className="text-body-sm font-semibold text-ink-900 tabular-nums"
          animate={{ color: held ? "#B34D00" : "#0A192F" }}
          transition={reduced ? NO_MOTION : { duration: DUR.micro, ease: EASE_OUT }}
        >
          {format(value)}
        </motion.span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerCancel={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        className="range-brand mt-2 w-full"
      />
      {hint && <p className="text-caption text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}
