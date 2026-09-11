"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pointer parallax for the guide covers.
 *
 * WHY THIS EXISTS
 * The covers spent eight rounds getting more accurate and none getting more
 * alive. Everything they do happens in the first second and then stops, which
 * is the one thing a masthead cannot afford: it is the first object on the
 * page and the reader is looking straight at it.
 *
 * Looping animation is the obvious answer and the wrong one at full strength —
 * a plate that keeps moving competes with the guide text somebody came here to
 * read. The answer underneath is that the best ambient motion is the reader's
 * own hand. It starts when they move, stops when they stop, and so it can
 * never pull at somebody who is reading rather than looking.
 *
 * HOW IT KEEPS THE COVER ON THE SERVER
 * The cover comes in as `children`. That is load-bearing, not stylistic: the
 * 300x200 SVG is serialised into the RSC payload and never enters the client
 * bundle, so this file is the only JavaScript the whole system ships. The
 * covers stay exactly as server-rendered as they were.
 *
 * The depths live in globals.css (.hc-atmo / .hc-cover > svg / .hc-sheen).
 * All this does is publish two numbers.
 */
export function CoverFrame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Touch has no cursor to follow, and device orientation would need a
       permission prompt to do it badly. A static cover is the right answer. */
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rect = el.getBoundingClientRect();
    let raf = 0;
    let px = 0;
    let py = 0;

    /* Measured on mount and on resize, never during a move. Reading layout
       inside pointermove is what turns a parallax into a jank generator. */
    const measure = () => {
      rect = el.getBoundingClientRect();
    };
    const write = () => {
      raf = 0;
      el.style.setProperty("--hc-px", px.toFixed(3));
      el.style.setProperty("--hc-py", py.toFixed(3));
    };
    const clamp = (n: number) => (n < -1 ? -1 : n > 1 ? 1 : n);
    const move = (e: PointerEvent) => {
      px = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1);
      py = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => {
      px = 0;
      py = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };

    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hc-cover">
      {/* The big, slow atmosphere: furthest back, travels most. It lives out
          here rather than in the artwork because a div gets a real compositor
          layer, while an animated <g> repaints the whole drawing every frame. */}
      <div className="hc-plane hc-atmo" aria-hidden />
      {children}
      <div className="hc-plane hc-sheen" aria-hidden />
    </div>
  );
}
