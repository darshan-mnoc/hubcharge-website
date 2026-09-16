"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { GuideFigure } from "@/components/guide-figure";
import { StationMap } from "@/components/station-map";
import { stations, STATE_NAMES } from "@/lib/stations";

/**
 * Where our chargers sit, on the actual map.
 *
 * WHAT THIS REPLACES, TWICE OVER
 * First it was a one-dimensional distance strip: a rail with dots placed by
 * percentage of the way from Downtown LA to Palm Springs. It could not show
 * which road, or which way, and it mapped over EVERY station with those two
 * endpoints hard-coded — so the day Round Rock got an address it placed a
 * Texas site at about 1250% of an LA-to-Palm-Springs axis.
 *
 * Then it was an SVG drawn from real OpenStreetMap road geometry. Accurate,
 * cheap, and still a drawing of a map rather than a map. You cannot pan it,
 * there is nothing around the roads, and "is there anything near this
 * charger" — which is the question someone planning a stop actually has — has
 * no answer on it.
 *
 * So it is the real thing now: OpenFreeMap vector tiles through MapLibre, the
 * same map components/hub-map.tsx draws on /locations and the homepage, with
 * the same ILLO palette painted over its layers.
 *
 * THE COST, AND WHAT IS DONE ABOUT IT
 * MapLibre is about 1,014 KB of JavaScript. That is a real price for a figure
 * inside an article, so it is not in this route's bundle: StationMap is a
 * next/dynamic boundary with ssr:false, and it is only MOUNTED once the
 * reader has scrolled the figure into view. Someone who never reaches this
 * section never downloads it. Someone who does gets a map they can pan.
 */

/** Only the states we have a site in, live sites first — the same ordering
 *  rule statesWithCoverage() uses, derived so a third state needs no edit. */
const PANELS = [
  {
    code: "CA",
    note: "Most driving around Los Angeles funnels onto the I-10 heading east toward Palm Springs, or the I-210 along the foothills. We sit on both — Alhambra just off the I-10 near downtown, Fontana further east where the Inland Empire begins.",
  },
  {
    code: "TX",
    note: "I-35 is the spine from San Antonio through Austin to Dallas. Round Rock sits on it about twenty miles north of downtown Austin — the point where a commute turns into a drive.",
  },
];

export function CorridorMap() {
  const [code, setCode] = useState(PANELS[0].code);
  const panel = PANELS.find((p) => p.code === code) ?? PANELS[0];
  const sites = stations.filter((s) => s.state === code);

  /* A megabyte of mapping engine is worth it for a map you can pan, and not
     worth it for a section nobody scrolled to. One observer, once, and it
     never goes back to false — a map that unmounted itself on scroll-out
     would re-download nothing but would re-initialise everything. */
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      /* Start fetching a little before it is on screen, so the tiles are
         usually there by the time the reader arrives. */
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <GuideFigure
      eyebrow="Where we are"
      title="The roads our chargers sit on"
      footnote="Map data © OpenStreetMap contributors, rendered from OpenFreeMap. Every site is pinned at its own coordinates; a pin with a grey dot is announced and not open yet."
    >
      <div role="tablist" aria-label="State" className="mb-5 flex gap-2">
        {PANELS.map((p) => {
          const on = p.code === code;
          const n = stations.filter((s) => s.state === p.code).length;
          return (
            <button
              key={p.code}
              role="tab"
              aria-selected={on}
              onClick={() => setCode(p.code)}
              className={`hc-tint rounded-full border px-4 py-1.5 text-caption font-semibold ${
                on
                  ? "border-brand bg-brand text-ink-900"
                  : "border-paper-300 text-ink-600 hover:border-ink-300"
              }`}
            >
              {STATE_NAMES[p.code] ?? p.code}
              <span className={`ml-1.5 font-normal ${on ? "text-ink-700" : "text-ink-400"}`}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={ref}
        className="relative h-[420px] overflow-hidden rounded-lg border border-paper-300 bg-ink-900 sm:h-[460px]"
      >
        {near ? (
          /* Keyed on the state so switching tabs builds a map around the new
             stations rather than flying an existing one 1,200 miles. */
          <StationMap
            key={code}
            stations={sites}
            /* Only ever preselect a site you can actually charge at. A
               selected marker is painted in the live orange, which would have
               made Round Rock — the one Texas pin, and not open — the
               brightest thing on the Texas map. 0 matches nothing. */
            selectedId={sites.find((s2) => s2.status === "open")?.id ?? 0}
            className="h-full"
            /* A state with one site has no bounds to fit, and the default 14
               frames the forecourt. This guide is about the road, so pull back
               far enough that the road is in the picture. */
            soloZoom={10.5}
          />
        ) : (
          <p className="absolute inset-0 grid place-items-center text-caption text-white/55">
            Map loads as you reach it
          </p>
        )}
      </div>

      <p className="mt-4 max-w-measure text-body-sm text-ink-600">{panel.note}</p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        {sites.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5 text-caption text-ink-500">
            <MapPin aria-hidden className="h-3.5 w-3.5 text-brand-ink" />
            {s.name.replace("™", "")}
            {s.status === "coming-soon" && " — opening soon"}
          </li>
        ))}
      </ul>
    </GuideFigure>
  );
}
