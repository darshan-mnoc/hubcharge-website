import type { Variants, Transition } from "framer-motion";

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SOFT: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const SPRING: Transition = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 };
export const SPRING_SNAP: Transition = { type: "spring", stiffness: 320, damping: 26, mass: 0.7 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 60, damping: 16, mass: 1 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};
export const fadeUpStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
export const revealUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: SPRING } };
export const revealLeft: Variants = { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0, transition: SPRING } };
export const revealRight: Variants = { hidden: { opacity: 0, x: 36 }, visible: { opacity: 1, x: 0, transition: SPRING } };
export const revealScale: Variants = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: SPRING } };

/* clip-path image reveal */
export const mediaWipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
  visible: { clipPath: "inset(0 0 0% 0)", scale: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};
/* line/word mask — child of an overflow-hidden wrapper */
export const lineMask: Variants = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
};
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
/* default whileInView config */
export const inView = { once: true, amount: 0.3, margin: "0px 0px -10% 0px" } as const;
