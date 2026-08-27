"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Reading progress + scroll-spy contents for long guides.
 *
 * The bar answers "how much is left", which is the question that makes people
 * bounce off a long page. The rail answers "where am I", and both read from
 * the same scroll listener so they can never disagree.
 */
export function ReadingProgress({
  sections,
}: {
  /** [id, label] in document order. */
  sections?: [string, string][];
}) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [active, setActive] = useState<string | null>(sections?.[0]?.[0] ?? null);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);

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
          className="hidden xl:block fixed top-1/2 -translate-y-1/2 right-[max(1.5rem,calc((100vw-1280px)/2-9rem))] w-40 z-30"
        >
          <p className="text-overline text-ink-400 mb-3">Contents</p>
          <ul className="border-l border-paper-300">
            {sections.map(([id, label]) => {
              const on = id === active;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={on ? "true" : undefined}
                    className={`line-clamp-2 block -ml-px border-l py-1.5 pl-3 text-[12px] leading-snug transition-colors ${
                      on
                        ? "border-brand text-ink-900"
                        : "border-transparent text-ink-400 hover:text-ink-700"
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
