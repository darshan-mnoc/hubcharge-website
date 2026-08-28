"use client";

import { GuideFigure } from "@/components/guide-figure";
import { haversineMiles } from "@/lib/geo";
import { stations } from "@/lib/stations";

/**
 * The I-10 run east out of Los Angeles, drawn to real distance.
 *
 * The guide describes this corridor in four paragraphs and had no picture,
 * which is a shame because the whole argument is spatial: Alhambra is close
 * enough to town that you leave full, Fontana sits where the open stretch
 * begins, and past Fontana the chargers thin out while the heat climbs.
 *
 * Positions are computed from the stations' own coordinates against two fixed
 * endpoints, so the gaps on screen are the gaps on the road. A hand-placed
 * schematic would drift the moment a station moved, and the point being made
 * here is precisely about distance.
 */
const LA = { name: "Downtown LA", lat: 34.05, lng: -118.24 };
const PALM_SPRINGS = { name: "Palm Springs", lat: 33.83, lng: -116.55 };

type Stop = { name: string; sub?: string; miles: number; ours: boolean };

function buildStops(): { stops: Stop[]; total: number } {
  const from = (p: { lat: number; lng: number }) =>
    haversineMiles(LA.lat, LA.lng, p.lat, p.lng);

  const total = from(PALM_SPRINGS);
  const ours: Stop[] = stations.map((s) => ({
    name: s.city,
    sub: "HubCharge",
    miles: from(s.coords),
    ours: true,
  }));

  return {
    stops: [
      { name: LA.name, miles: 0, ours: false },
      ...ours,
      { name: PALM_SPRINGS.name, miles: total, ours: false },
    ].sort((a, b) => a.miles - b.miles),
    total,
  };
}

export function SoCalCorridor() {
  const { stops, total } = buildStops();
  const last = stops.filter((s) => s.ours).at(-1);
  const gapAfter = last ? Math.round(total - last.miles) : 0;

  return (
    <GuideFigure
      eyebrow="The I-10, east"
      title="Where the stops fall on the way out of town"
      footnote={
        <>
          Distances are straight-line between the real coordinates, so the road
          is a little longer than the numbers here. The I-210 runs roughly
          parallel along the foothills and rejoins near San Bernardino; the
          spacing argument is the same on either.
        </>
      }
    >
      {/* The road. Heat is drawn as the ground getting warmer eastward, which
          is the guide's own point about the stretch past the Inland Empire.

          Labels stagger above and below the line rather than sitting in a
          row. Alhambra is only seven miles out of ninety-eight from downtown,
          so at true scale the two labels sat on top of each other — and
          faking the spacing would have thrown away the one thing this drawing
          is for. Splitting the rows keeps every position honest, and it
          usefully separates our stations from the landmarks either side. */}
      <div className="relative mx-6 sm:mx-10">
        <div className="relative h-[168px]">
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
            style={{
              background:
                "linear-gradient(to right, rgb(226 232 240), rgb(226 232 240) 45%, rgba(255,122,0,0.35) 100%)",
            }}
          />

          <ol>
            {stops.map((s) => {
              const pct = (s.miles / total) * 100;
              return (
                <li
                  key={s.name}
                  className="absolute top-1/2 flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center sm:w-28"
                  style={{ left: `${pct}%` }}
                >
                  {/* landmarks read above the road, our stations below it */}
                  {!s.ours && (
                    <span className="absolute bottom-[calc(50%+14px)] w-20 text-center sm:w-28">
                      <span className="block text-caption font-semibold text-ink-500">
                        {s.name}
                      </span>
                      <span className="block text-caption tabular-nums text-ink-400">
                        {Math.round(s.miles)} mi
                      </span>
                    </span>
                  )}

                  <span
                    aria-hidden
                    className={`h-3.5 w-3.5 rounded-full ring-4 ring-paper ${
                      s.ours ? "bg-brand" : "bg-ink-300"
                    }`}
                  />

                  {s.ours && (
                    <span className="absolute top-[calc(50%+14px)] w-20 text-center sm:w-28">
                      <span className="block text-caption font-semibold text-ink-900">
                        {s.name}
                      </span>
                      <span className="block text-caption tabular-nums text-ink-400">
                        {Math.round(s.miles)} mi
                      </span>
                      <span className="block text-caption text-brand-ink">{s.sub}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-2 grid gap-3 border-t border-paper-300 pt-5 sm:grid-cols-3">
        {[
          {
            k: "Leave with a full buffer",
            v: "Alhambra is close enough to town that you top up before traffic eats into your range, not after.",
          },
          {
            k: "The last easy stop",
            v: `Fontana sits about ${gapAfter} miles short of Palm Springs — the point where topping up stops being optional.`,
          },
          {
            k: "Then it opens up",
            v: "Past the Inland Empire the chargers thin out and the heat climbs, which slows charging and drains range at once.",
          },
        ].map((c) => (
          <div key={c.k}>
            <p className="text-body-sm font-semibold text-ink-900">{c.k}</p>
            <p className="mt-1 text-caption leading-relaxed text-ink-500">{c.v}</p>
          </div>
        ))}
      </div>
    </GuideFigure>
  );
}
