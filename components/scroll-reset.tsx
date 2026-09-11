"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Top of the page on a route change.
 *
 * Its own component, with no dependencies, because it used to live inside
 * SmoothScroll — where it was the one piece of genuinely load-bearing
 * behaviour in a file whose other job was importing 113 KB of animation
 * engine. Anything that happens to the smooth-scroll driver (deferred,
 * skipped on touch, skipped under reduced motion, removed) must not be able
 * to leave a reader halfway down the previous page.
 *
 * `instant` rather than the CSS `scroll-behavior: smooth` on <html>: a route
 * change is a new document as far as the reader is concerned, and smoothly
 * scrolling up through a page they have already left is motion with no
 * meaning attached to it.
 */
export function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
