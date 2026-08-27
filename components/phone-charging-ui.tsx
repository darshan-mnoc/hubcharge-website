import Image from "next/image";
import { Lock, Wifi, Signal, BatteryFull } from "lucide-react";

/**
 * The real product screen, in a device frame.
 *
 * I got this wrong once and it's worth recording why. I replaced this
 * screenshot with a hand-rendered mock on the belief that the frame held a
 * photograph of a charger — which I inferred from the filename and a stale
 * note about the alt text, without ever opening the file. It is in fact a
 * capture of the actual HubCharge web app: charger ID, connector, the rate,
 * card entry, swipe to start. The original alt text was accurate; my
 * description of it was not.
 *
 * So the screenshot is back, unaltered, and the work is what it should always
 * have been: the frame around it.
 *
 * The frame is genuine device hardware now — side buttons, a dynamic island,
 * an inset glass edge and a home indicator — with concentric radii, each inset
 * subtracted from the one outside it: 44px shell, 41px rim, 31px screen. Above
 * the screenshot sit a status bar and a browser address bar showing
 * hubcharge.com, because that lock icon and that domain are the entire
 * argument of the section beside this: no app, no store, no account.
 *
 * Geometry: the capture is 800x1340, i.e. 1.675W tall at full width. The
 * screen is 9:17.2 and the chrome above it takes about 0.23W, which leaves
 * 1.68W — so the image sits at its natural aspect with nothing cropped and
 * almost nothing left over. The home indicator rests on the last few pixels
 * of the capture's own black.
 */
export function PhoneChargingUI() {
  return (
    <div className="relative w-[260px] sm:w-[290px] lg:w-[310px]">
      {/* side hardware — the thing that separates a device from a card */}
      <span
        aria-hidden
        className="absolute -left-[3px] top-[104px] h-9 w-[3px] rounded-l-sm bg-ink-700"
      />
      <span
        aria-hidden
        className="absolute -left-[3px] top-[150px] h-9 w-[3px] rounded-l-sm bg-ink-700"
      />
      <span
        aria-hidden
        className="absolute -right-[3px] top-[130px] h-14 w-[3px] rounded-r-sm bg-ink-700"
      />

      {/* body */}
      <div className="relative rounded-[2.75rem] bg-gradient-to-b from-ink-700 via-ink-900 to-ink-800 p-[3px] shadow-[0_34px_70px_-22px_rgba(10,25,47,0.55)]">
        <div className="rounded-[2.5625rem] bg-ink-900 p-2.5">
          <div className="relative flex flex-col rounded-[1.9375rem] overflow-hidden bg-black aspect-[9/17.2]">
            {/* screen glass */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 rounded-[1.9375rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),inset_0_1px_14px_rgba(0,0,0,0.5)]"
            />

            {/* status bar — dark, because the app it sits above is dark */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-semibold text-white/90">
              <span>9:41</span>
              <span
                aria-hidden
                className="absolute left-1/2 top-1.5 -translate-x-1/2 h-[18px] w-[62px] rounded-full bg-black"
              />
              <span className="flex items-center gap-1">
                <Signal className="h-2.5 w-2.5" />
                <Wifi className="h-2.5 w-2.5" />
                <BatteryFull className="h-3 w-3" />
              </span>
            </div>

            {/* browser chrome — the argument, in one line */}
            <div className="px-3 pt-2 pb-2.5">
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <Lock aria-hidden className="h-2.5 w-2.5 text-white/50" />
                <span className="text-[10px] text-white/80">hubcharge.com</span>
              </div>
            </div>

            {/* the actual product, unretouched */}
            <div className="relative w-full">
              <Image
                src="/images/charging-service.webp"
                alt="The HubCharge web app open in a phone browser at hubcharge.com: charger ID MBS_1 on a NACS connector, the session rate of $12.50 for the first ten minutes then $3 per additional five, a card entry field, and a swipe-to-start control. A card authorisation of $30.00 is noted when charging begins."
                width={800}
                height={1340}
                className="w-full h-auto"
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 290px, 310px"
              />
            </div>

            {/* home indicator */}
            <span
              aria-hidden
              className="absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/35"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
