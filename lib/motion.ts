/**
 * Shared framer-motion variants (design-system §12).
 * Kept intentionally small — only what live components consume.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export const fadeUpStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/**
 * Springs, for the things a reader is actually holding.
 *
 * THE DIVISION, AND WHY IT MATTERS
 * EASE_OUT above is an ARRIVAL curve: fast out, long settle. It is right for
 * anything that moves on its own — a figure scrolling into view, a chart
 * tracing itself — and it is what every cover and the site's scroll reveal
 * already use.
 *
 * It is wrong for anything a finger is driving. A tween has a fixed duration,
 * so when you drag a slider the value is always arriving from wherever it was
 * when you last moved, and the further you drag the more it lags behind your
 * thumb. A spring has no duration: it has a target, and it chases it. That is
 * why a dragged bar on a spring feels attached to your hand and the same bar
 * on a 200ms tween feels like it is buffering.
 *
 * So: springs where the user is the driver, EASE_OUT where the interface is.
 * Three of them, each with a stated job, so nobody adds a fourth by feel.
 */

/** Following a thumb right now — a bar, a crosshair, a marker under a drag.
 *  Stiff and nearly critically damped: no overshoot, because an indicator that
 *  wobbles past the value it is reporting is lying for a few frames. */
export const SPRING_TRACK = {
  type: "spring" as const,
  stiffness: 520,
  damping: 40,
  mass: 0.6,
};

/** A value arriving with some weight — a settling panel, a card easing into
 *  place. Softer, and allowed the faintest overshoot, which is what reads as
 *  physical. Not for numbers: see SPRING_READOUT. */
export const SPRING_SETTLE = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/**
 * Readouts, and only readouts.
 *
 * This exists because SPRING_SETTLE overshoots. Its damping ratio is
 * 26 / (2*sqrt(260 * 0.9)) = 0.850, which produces 0.63% of overshoot — so a
 * readout travelling to 200 minutes would display 201 for a few frames before
 * settling. Every other spring here can afford that; a number cannot. The
 * whole contract of a readout is that it reports what the model produced, and
 * for those frames it would be reporting something the model never produced.
 *
 * So the damping is a correctness constraint rather than a taste one:
 * c >= 2*sqrt(k*m) makes zeta >= 1 and overshoot mathematically impossible.
 * 260/32/0.9 gives zeta = 1.046 and settles in about 225ms.
 */
export const SPRING_READOUT = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

/** Reflow: list items changing place, a card changing height. Slower and fully
 *  damped, because several things move at once here and overshoot on a crowd
 *  reads as chaos rather than as weight. */
export const SPRING_LAYOUT = {
  type: "spring" as const,
  stiffness: 320,
  damping: 34,
  mass: 1,
};

/** Durations for the tweened half of the vocabulary, so the numbers are named
 *  rather than typed by feel at each call site. */
export const DUR = {
  /** A colour, a chevron, a hover. Below this a change reads as a glitch. */
  micro: 0.18,
  /** The house arrival — what GuideFigure and [data-reveal] already use. */
  base: 0.45,
  /** Something being drawn rather than revealed: a path, a road, a rule. */
  draw: 0.9,
} as const;

/** What every spring above collapses to when the reader has asked for less
 *  motion: no motion. Not a fast spring — an instant one. */
export const NO_MOTION = { duration: 0 } as const;
