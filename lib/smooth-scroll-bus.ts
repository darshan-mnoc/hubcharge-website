/**
 * A three-line meeting point for the smooth-scroll driver and anything that
 * needs to know it is running.
 *
 * SmoothScroll loads Lenis lazily; JourneyScroll loads GSAP lazily; and
 * ScrollTrigger has to be told when Lenis moves the page, or its pinned
 * scene reads a scroll position that Lenis has already left behind. Before,
 * SmoothScroll did that by importing GSAP itself — which is exactly why 113 KB
 * of animation engine sat in the every-route baseline to serve one scene on
 * one page.
 *
 * So neither side imports the other. This module has no dependencies at all,
 * so whichever arrives first simply leaves a note.
 */
type ScrollFn = () => void;

let instance: { on(e: "scroll", cb: ScrollFn): void; off(e: "scroll", cb: ScrollFn): void } | null = null;
const waiting = new Set<ScrollFn>();

/** Called by SmoothScroll once Lenis is actually running. */
export function setSmoothScroller(l: typeof instance) {
  instance = l;
  if (l) waiting.forEach((cb) => l.on("scroll", cb));
}

/** Subscribe to smooth-scroll frames. Safe to call before, during or after
 *  the driver loads, and safe to call when it never loads at all — on touch,
 *  or under reduced motion, where the page scrolls natively and the caller
 *  simply never hears from us. Returns its own unsubscribe. */
export function onSmoothScroll(cb: ScrollFn): () => void {
  waiting.add(cb);
  instance?.on("scroll", cb);
  return () => {
    waiting.delete(cb);
    instance?.off("scroll", cb);
  };
}
