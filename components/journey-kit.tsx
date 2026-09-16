/**
 * The charging journey section.
 *
 * Server-rendered: the illustrations are inlined here so the SVG markup goes
 * into the payload and never into the client bundle. The only JavaScript is
 * components/journey-scroll.tsx, which pins the section and seeks the strip's
 * own timeline as the reader scrolls.
 *
 * Desktop gets the five-panel strip, scrubbed. Narrow screens get the five
 * steps as separate loops in a snap carousel, because a 1500-wide strip
 * scaled to a phone is five illegible thumbnails — the same swipe the
 * previous mobile layout had.
 */
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import { JourneyScroll } from "@/components/journey-scroll";
import { KitIllustration, type KitScene } from "@/components/kit-illustration";

const STEPS: { id: number; title: string; subtitle: string; scene: KitScene }[] = [
  { id: 1, title: "Arrive", subtitle: "Pick a charger spot", scene: "hubcharge-step-1-arrive" },
  { id: 2, title: "Easy payment", subtitle: "Stay in your car", scene: "hubcharge-step-2-easy-payment" },
  { id: 3, title: "Charge", subtitle: "We plug you in", scene: "hubcharge-step-3-charge" },
  { id: 4, title: "Add time or services", subtitle: "Extend or order food", scene: "hubcharge-step-4-add-time-or-services" },
  { id: 5, title: "Finish", subtitle: "We unplug • You’re done", scene: "hubcharge-step-5-finish" },
];

const SUMMARY = [
  { v: "10 min", l: `Adds ${TEN_MINUTE_RANGE} miles, by car` },
  { v: "Attendant", l: "Plugs in and unplugs for you" },
  { v: "Lifestyle", l: "Delivered to your window" },
];

export function JourneyKit() {
  return (
    <JourneyScroll
      header={
        <div className="mb-8 lg:mb-12">
          <p className="text-overline text-white/55">The experience</p>
          <h2 className="text-h2 text-white mb-3 max-w-headline">Your charging journey</h2>
          <p className="text-body-lg text-on-dark/70 max-w-[36ch]">
            Charging made simple, fast, and effortless.
          </p>
        </div>
      }
      strip={<KitIllustration name="hubcharge-how-it-works" />}
      mobile={
        <div>
          <div className="section-container mb-3">
            <p className="text-body-sm text-on-dark/60">Swipe to explore each step</p>
          </div>
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide [scrollbar-width:none]">
            {STEPS.map((step) => (
              <li key={step.id} className="w-[85%] shrink-0 snap-center">
                <div className="overflow-hidden rounded-lg border border-white/[0.07]">
                  <KitIllustration name={step.scene} />
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-index text-white/45">0{step.id}</span>
                  <span>
                    <span className="block text-h4 text-white">{step.title}</span>
                    <span className="block text-caption text-on-dark/60">{step.subtitle}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
      after={
        /* The summary row the scroll strip always ended on: a hairline spec
           row on the section itself, matching the hero. */
        <div className="section-container pb-16 lg:pb-20">
          <div className="border-t border-white/10 pt-8 grid gap-8 lg:grid-cols-[minmax(0,28ch)_1fr] lg:gap-16">
            <div>
              <h3 className="text-h3 text-white mb-1.5">Your car is your space</h3>
              <p className="text-body-sm text-on-dark/60">
                Like home and office. We bring everything to you.
              </p>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {SUMMARY.map((stat, i) => (
                <div
                  key={stat.v}
                  className={`py-4 sm:py-0 ${i === 0 ? "sm:pr-6" : "sm:px-6"} ${i === SUMMARY.length - 1 ? "sm:pr-0" : ""}`}
                >
                  <dt className="text-h3 text-white">{stat.v}</dt>
                  <dd className="text-caption text-on-dark/55 mt-1">{stat.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      }
    />
  );
}
