"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { GLOSSARY_HREF, glossaryBrief, glossaryTerm } from "@/lib/glossary";

const POP_W = 300;
const POP_MARGIN = 12;

/** Clamped inside the viewport; above the word unless it sits too near the top. */
function place(r: DOMRect) {
  const left = Math.min(
    Math.max(POP_MARGIN + POP_W / 2, r.left + r.width / 2),
    window.innerWidth - POP_MARGIN - POP_W / 2
  );
  const below = r.top < 180;
  return { left, top: below ? r.bottom + 8 : r.top - 8, below };
}


/**
 * A jargon word that explains itself.
 *
 * The guides used `kW` 42 times, `DC` 45 times, `taper` 11 times and
 * `preconditioning` 10 times, and a reader who didn't already know those
 * words had nowhere to go — the glossary existed but nothing linked to it.
 * This puts the definition where the word is.
 *
 * Two decisions worth recording:
 *
 * The popover is `position: fixed`, measured from the trigger. An
 * absolutely-positioned one inherits every ancestor's `overflow: hidden`, and
 * these sit inside cards and figures that all clip. Fixed positioning is
 * immune to that, at the cost of having to re-measure while the page moves —
 * see the scroll tracking below for why it follows rather than closes.
 *
 * It is a `<button>`, not a `<span title>`. A title attribute never appears
 * on touch, can't be styled, and takes a second to show. This opens on hover,
 * focus and tap, closes on Escape, and is reachable by keyboard.
 */
export function Term({
  id,
  children,
}: {
  /** A term id from lib/glossary.ts — "kw", "nacs", "charging-curve"… */
  id: string;
  /** The wording as it reads in the sentence. Defaults to the term's name. */
  children?: ReactNode;
}) {
  const entry = glossaryTerm(id);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; below: boolean } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.focus();
      }
    };
    // Scroll invalidates a fixed position, so the popover has to follow.
    //
    // The first version simply closed on scroll, which looked fine until you
    // reached a term with the keyboard: focusing an element near the viewport
    // edge makes the browser scroll it into view, that scroll fired the
    // handler, and the popover shut in the same frame it opened. Keyboard
    // users could not read a single definition. It tracks now, and only gives
    // up once the word itself has left the screen.
    let frame = 0;
    const track = () => {
      frame = 0;
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      if (r.bottom < 0 || r.top > window.innerHeight) {
        setOpen(false);
        return;
      }
      setPos(place(r));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(track);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  // A term we don't define should never silently render as a dead control.
  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[Term] no glossary entry for "${id}"`);
    }
    return <>{children ?? id}</>;
  }

  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(place(r));
    setOpen(true);
  };

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        aria-describedby={open ? popId : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        className="inline cursor-help border-b border-dotted border-ink-300 bg-transparent p-0 text-left
          font-[inherit] text-[length:inherit] leading-[inherit] text-[color:inherit]
          hover:border-brand-ink hover:text-brand-ink"
      >
        {children ?? entry.term}
      </button>

      {open && pos && (
        <span
          id={popId}
          role="tooltip"
          style={{
            left: pos.left,
            top: pos.top,
            width: POP_W,
            transform: pos.below ? "translateX(-50%)" : "translate(-50%, -100%)",
          }}
          className="fixed z-50 block rounded-lg bg-ink-900 px-4 py-3 text-left shadow-card-hover"
        >
          <span className="block text-caption font-semibold text-white">{entry.term}</span>
          <span className="mt-1 block text-caption leading-relaxed text-on-dark/80">
            {glossaryBrief(entry)}
          </span>
          <a
            href={`${GLOSSARY_HREF}#${entry.id}`}
            className="mt-2 inline-block text-caption text-brand hover:underline"
          >
            Full glossary
          </a>
        </span>
      )}
    </>
  );
}
