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
