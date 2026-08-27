"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Reading progress + scroll-spy contents for long guides.
 *
 * The bar answers "how much is left", which is the question that makes people
 * bounce off a long page. The rail answers "where am I", and both read from
 * the same scroll listener so they can never disagree.
 *
 * Two things the first version got wrong, both geometric:
 *
 * The rail was parked at `(100vw-1280px)/2 - 9rem` — deliberately *outside*
 * the content box, in the page gutter. But PageShell bleeds the masthead
 * photograph through that exact gutter to the viewport edge, so above ~1616px
 * the rail landed on top of the photo every time. It is anchored to the
 * content box now, and clamped so it can never re-enter the bleed.
 *
 * And it painted at scroll position zero, offering a table of contents for a
 * page you hadn't started. It waits for the masthead to leave.
 */
export function ReadingProgress({
  sections,
}: {
  /** [id, label] in document order. */
  sections?: [string, string][];
}) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [past, setPast] = useState(false);
  const [active, setActive] = useState<string | null>(sections?.[0]?.[0] ?? null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);

      // Reveal once the first section has reached the top third — i.e. once
      // the masthead is behind you and a contents list is actually useful.
      const first = sections?.length ? document.getElementById(sections[0][0]) : null;
      setPast(
        first
          ? first.getBoundingClientRect().top < window.innerHeight * 0.5
          : window.scrollY > window.innerHeight * 0.7
      );

      if (sections?.length) {
        // The heading whose top has most recently passed a third of the
        // viewport — a marker that tracks where the eye actually is.
        const line = window.innerHeight / 3;
        let current = sections[0][0];
        for (const [id] of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
        setActive(current);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <>
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none"
      >
        <div
          className={`h-full bg-brand origin-left ${reduced ? "" : "transition-[width] duration-150 ease-out"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {sections && sections.length > 2 && (
        <nav
          aria-label="On this page"
          // The rail only appears where the gutter genuinely fits it. The
          // content box is 1280 wide, so the gutter is (100vw-1280)/2 — it
          // reaches 176px of rail plus 24px of air at 1680px and not before.
          // Below that there is nowhere to put this that isn't on top of the
          // full-width footer blocks, so it simply doesn't render.
          className={`hidden min-[1680px]:block fixed top-1/2 -translate-y-1/2 z-30 w-44 right-6
            rounded-lg bg-paper/90 backdrop-blur-sm px-3 py-3
            ${reduced ? "" : "transition-opacity duration-300"}
            ${past ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <p className="text-overline text-ink-500 mb-3">Contents</p>
          <ul className="border-l border-paper-300">
            {sections.map(([id, label]) => {
              const on = id === active;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={on ? "true" : undefined}
                    tabIndex={past ? 0 : -1}
                    className={`line-clamp-2 block -ml-px border-l py-1.5 pl-3 text-[12px] leading-snug transition-colors ${
                      on
                        ? "border-brand text-ink-900 font-medium"
                        : "border-transparent text-ink-500 hover:text-ink-900"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
