"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { onSmoothScroll } from "@/lib/smooth-scroll-bus";

/**
 * The charging journey, advanced by the scroll wheel.
 *
 * WHAT THIS REPLACED
 * The old strip drew five scenes in React and moved every element itself: a
 * pinned section, a scrubbed ScrollTrigger, and about two thousand lines that
 * recomputed positions, opacities and dash offsets on every frame.
 *
 * WHAT IT DOES INSTEAD
 * The strip is now one animated SVG from the illustration kit, and its
 * twenty-second timeline already tells the whole story — four seconds a step,
 * finished steps staying lit, the progress line filling underneath. So the
 * scroll does not drive five scenes any more. It drives one clock.
 *
 * Every animation inside the file is a CSS animation, which means the Web
 * Animations API can hold it still and seek it: pause, then set currentTime
 * from the pin's progress. That is the entire mechanism.
 *
 * THREE DETAILS THAT MATTER
 *   - Holding the timeline is CSS's job, not pause()'s. A Web Animations
 *     pause() is thrown away the moment the cascade re-applies the
 *     `animation` shorthand, and ScrollTrigger's pin does precisely that when
 *     it re-parents the section into its spacer. The scene therefore paused
 *     correctly, pinned, and then ran on by itself between scrolls — each
 *     scroll yanking it back to where the scroll said it should be. The
 *     elements carry .hc-hold instead, which is animation-play-state with an
 *     !important the cascade cannot outrank. Seeking still works while held.
 *   - Only the 20s master animations are held. The short loops inside the
 *     scene — energy along the cable, the cabinet's light sweep, the standby
 *     breath — keep running on their own clock, because a cable whose energy
 *     only moves while the reader scrolls looks broken, not scrubbed.
 *   - Scrubbing stops at 96.5% of the timeline. The last 3.5% is the loop's
 *     reset, where the actors fade out to return to their start positions;
 *     scrolled into, it would read as the scene emptying at the finish.
 *
 * GSAP is imported inside the effect, not at the top of the file, so the
 * 113 KB of animation engine loads on the one page that pins something rather
 * than sitting in every route's baseline.
 */

const MASTER_MS = 20000;
/** Scrub to here, not to the end: past this the loop resets itself. */
const SCRUB_END = 0.965;

export function JourneyScroll({
  header,
  strip,
  mobile,
}: {
  header: ReactNode;
  strip: ReactNode;
  mobile: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    if (still) return;
    const root = section.current;
    const host = stage.current;
    if (!root || !host) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const svg = host.querySelector("svg");
      if (!svg) return;

      /* A CSS animation reports its duration in milliseconds. The kit's master
         timeline is the only 20s one in the file; everything else is a short
         ambient loop and is left alone. */
      const isMaster = (a: Animation) =>
        Math.round(Number(a.effect?.getComputedTiming().duration ?? 0)) === MASTER_MS;

      const held = new Set<Element>();
      const collect = () => {
        const found = svg.getAnimations({ subtree: true }).filter(isMaster);
        found.forEach((a) => {
          const target = (a.effect as KeyframeEffect | null)?.target;
          if (target && !held.has(target)) {
            target.classList.add("hc-hold");
            held.add(target);
          }
        });
        return found;
      };

      let master = collect();
      if (!master.length) return;

      /* Re-collected, at most four times a second, because the cascade can
         REPLACE an animation object rather than keep it: re-parenting the
         pinned section makes the browser rebuild some of them, and seeking
         the objects we captured at mount would then move nothing while the
         new ones sat frozen at zero. Cheap, and it self-heals within a
         quarter-second of the next scroll. */
      let lastCollect = 0;
      const seek = (p: number) => {
        const now = performance.now();
        if (now - lastCollect > 250) {
          lastCollect = now;
          master = collect();
        }
        const t = Math.max(0, Math.min(1, p)) * SCRUB_END * MASTER_MS;
        master.forEach((a) => {
          a.currentTime = t;
        });
      };
      const release = () => held.forEach((el) => el.classList.remove("hc-hold"));
      seek(0);

      const { gsap, ScrollTrigger } = await import("@/lib/gsap");
      /* A cancelled instance leaves the hold in place: in StrictMode's double
         mount the second instance is already driving these same animations,
         and releasing here would hand them back to the clock. On a real
         unmount the nodes go with it. */
      if (cancelled) return;

      /* Lenis moves the page without firing native scroll in a way
         ScrollTrigger reads, so it has to be told. Same wiring the old scene
         used; see lib/smooth-scroll-bus.ts. */
      const offBus = onSmoothScroll(ScrollTrigger.update);

      /* Pinned only where there is room to pin: below 1024px the strip is
         hidden anyway and the reader gets the swipeable steps instead. */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top 15%",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => seek(self.progress),
        });
        return () => st.kill();
      });

      cleanup = () => {
        offBus();
        mm.revert();
        release();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [still]);

  return (
    <section ref={section} id="how-it-works" className="relative bg-ink-900">
      <div className="relative py-12 lg:py-16">
        <div className="section-container">{header}</div>

        <div ref={stage} className="hidden lg:block section-container">
          <div className="overflow-x-auto border-y border-white/[0.07]">
            <div className="min-w-[1100px]">{strip}</div>
          </div>
          <p className="text-caption text-white/45 mt-4">Scroll to follow a charge, step by step.</p>
        </div>

        <div className="lg:hidden">{mobile}</div>
      </div>
    </section>
  );
}
