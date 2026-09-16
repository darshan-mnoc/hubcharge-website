"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
/* Named imports: maplibre-gl v6 is pure ESM and has no default export.
   `MapLibreMap` is its own alias for the Map class, which avoids shadowing
   the global Map in a file that also uses one. */
import {
  MapLibreMap,
  Marker,
  LngLatBounds,
  NavigationControl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Navigation } from "lucide-react";
import { ILLO } from "@/lib/illustration";
import type { Station } from "@/lib/stations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The real map.
 *
 * WHY THIS REPLACES THE GOOGLE ONE
 * The previous map needed a Google Maps browser key and a provisioned vector
 * Map ID, and neither existed — so every "map" on this site was actually the
 * keyless fallback iframe, and had been from the day it was written. Google
 * also needs a billing account before it will serve a single tile.
 *
 * OpenFreeMap serves the same OpenMapTiles schema with no key, no account and
 * no billing, so this works the moment it is deployed. The trade is that it is
 * a free community service with no SLA, which is why onError below degrades to
 * the plate colour with our own markers still drawn rather than to a blank
 * grey canvas.
 *
 * WHY THE STYLE IS RE-TINTED RATHER THAN USED AS SHIPPED
 * An embedded map that keeps its vendor's palette always looks embedded. The
 * style arrives as a plain JSON of ~55 layers, so every one of them is
 * repainted here into lib/illustration.ts — the same ramp the covers and the
 * journey illustration are drawn from. The map then belongs to the product
 * instead of sitting inside it.
 */

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Roads get brighter as they get more important, so a freeway reads as one. */
const ROAD_TONE: [RegExp, string, number][] = [
  [/motorway|trunk/i, ILLO.seam, 1],
  [/primary/i, ILLO.bodyLight, 0.9],
  [/secondary|tertiary/i, ILLO.body, 0.8],
  [/./, ILLO.bodyDark, 0.7],
];

/** Repaint a stock style into the site's own ink ramp. */
function tint(map: MapLibreMap) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;
    try {
      if (layer.type === "background") {
        map.setPaintProperty(id, "background-color", ILLO.stage);
        continue;
      }
      if (layer.type === "fill") {
        if (/water|ocean|sea|river|lake/i.test(id)) {
          map.setPaintProperty(id, "fill-color", ILLO.sea);
          map.setPaintProperty(id, "fill-opacity", 1);
        } else if (/building/i.test(id)) {
          map.setPaintProperty(id, "fill-color", ILLO.bodyDark);
          map.setPaintProperty(id, "fill-opacity", 0.55);
        } else if (/park|wood|forest|grass|landcover|vegetation/i.test(id)) {
          map.setPaintProperty(id, "fill-color", ILLO.basin);
          map.setPaintProperty(id, "fill-opacity", 0.5);
        } else {
          map.setPaintProperty(id, "fill-color", ILLO.basin);
          map.setPaintProperty(id, "fill-opacity", 0.35);
        }
        continue;
      }
      if (layer.type === "line") {
        if (/water|river|stream/i.test(id)) {
          map.setPaintProperty(id, "line-color", ILLO.sea);
          continue;
        }
        if (/boundary|admin/i.test(id)) {
          map.setPaintProperty(id, "line-color", ILLO.graticule);
          map.setPaintProperty(id, "line-opacity", 0.35);
          continue;
        }
        const [, colour, opacity] = ROAD_TONE.find(([re]) => re.test(id))!;
        map.setPaintProperty(id, "line-color", colour);
        map.setPaintProperty(id, "line-opacity", opacity);
        continue;
      }
      if (layer.type === "symbol") {
        /* Labels in the structural grey with a dark halo, so place names stay
           readable over both the water and the land without a second colour. */
        map.setPaintProperty(id, "text-color", ILLO.hub);
        map.setPaintProperty(id, "text-halo-color", ILLO.shadow);
        map.setPaintProperty(id, "text-halo-width", 1.4);
      }
      if (layer.type === "raster") {
        /* The shaded-relief raster is tuned for a light basemap and reads as
           grey fog over a dark one. */
        map.setPaintProperty(id, "raster-opacity", 0.12);
      }
    } catch {
      /* A style can rename or drop a layer at any time; a repaint that no
         longer applies must not take the map down with it. */
    }
  }
}

/** A HubCharge site, drawn as a marker in the product's own tones. */
function markerEl(label: string, selected: boolean, live: boolean) {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", `${label}${selected ? " (selected)" : ""}`);
  el.style.cssText = [
    "display:flex", "align-items:center", "gap:6px",
    "padding:5px 11px 5px 6px", "border-radius:999px", "cursor:pointer",
    "font:600 11px/1 var(--font-jakarta, system-ui)", "white-space:nowrap",
    "transition:transform 180ms cubic-bezier(0.16,1,0.3,1)",
    /* A SELECTED PIN IS NOT AUTOMATICALLY A LIVE ONE.
       Selecting painted the pill in ILLO.live, which is the colour reserved
       for power actually moving — so clicking Round Rock in the list made the
       one site you cannot charge at the brightest, most open-looking thing on
       the map. An announced site gets the brass highlight instead: clearly
       selected, clearly not open. */
    `border:1px solid ${selected ? (live ? ILLO.live : ILLO.heat) : "rgba(255,255,255,0.22)"}`,
    `background:${selected ? (live ? ILLO.live : ILLO.heat) : ILLO.stage}`,
    `color:${selected ? ILLO.stage : "#fff"}`,
    `box-shadow:0 2px 10px ${ILLO.shadow}`,
    selected ? "transform:scale(1.06)" : "",
  ].join(";");
  const dot = document.createElement("span");
  dot.style.cssText = [
    "width:8px", "height:8px", "border-radius:999px", "flex:none",
    `background:${selected ? ILLO.stage : live ? ILLO.live : ILLO.seam}`,
  ].join(";");
  el.append(dot, document.createTextNode(label));
  return el;
}

/* A module-level constant, NOT a default parameter.
   `extraPoints = []` in the signature allocates a NEW array on every render,
   which changed `points`, which changed the `fit` callback, which was in the
   create-effect's dependency list — so the map was torn down and rebuilt on
   every single render and never lived long enough to request a tile. */
/** "A", "A and B", "A, B and C". */
function listCities(list: { city: string }[]): string {
  const names = [...new Set(list.map((s) => s.city))];
  if (names.length <= 1) return names[0] ?? "Our stations";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const NO_EXTRA: MapPoint[] = [];

export type MapPoint = {
  id: number;
  label: string;
  coords: { lat: number; lng: number };
  live: boolean;
};

export function HubMap({
  stations,
  selectedId,
  onSelect,
  userLocation,
  className = "",
  extraPoints = NO_EXTRA,
  interactive = true,
  soloZoom = 14,
}: {
  stations: Station[];
  selectedId?: number;
  onSelect?: (id: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
  /** Zoom used when there is exactly one point to show — nothing to fit a
   *  bounds to. Lower it to keep the surrounding roads in frame. */
  soloZoom?: number;
  /** Announced-but-unopened sites, and anything the OpenChargeMap proxy adds. */
  extraPoints?: MapPoint[];
  interactive?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [failed, setFailed] = useState(false);
  const styleArrived = useRef(false);
  const reduced = useReducedMotion();

  const points = useMemo<MapPoint[]>(
    () => [
      ...stations.map((s) => ({
        id: s.id,
        label: s.city,
        coords: s.coords,
        live: s.status !== "coming-soon",
      })),
      ...extraPoints,
    ],
    [stations, extraPoints]
  );

  const fit = useCallback(
    (m: MapLibreMap, animate: boolean) => {
      if (points.length === 0) return;
      if (points.length === 1) {
        const c: [number, number] = [points[0].coords.lng, points[0].coords.lat];
        /* 14 shows the forecourt, which is what a station page wants. A guide
           about which motorway a site sits on wants the motorway, and at 14
           the road its own caption names is off the edge of the frame. */
        m.jumpTo({ center: c, zoom: soloZoom, pitch: reduced ? 0 : 40 });
        return;
      }
      const b = new LngLatBounds();
      points.forEach((p) => b.extend([p.coords.lng, p.coords.lat]));
      if (userLocation) b.extend([userLocation.lng, userLocation.lat]);

      /* A BOUNDS CAN BE TOO BIG TO BE A MAP.
         Fitting every point was right while the network was two sites eight
         miles apart. With California and Texas in one list it fits 20 degrees
         of longitude, and because this panel is taller than it is wide the
         limiting dimension is width — so the camera pulls back until it is
         showing Calgary, Winnipeg and Bismarck, and not one street. Three
         pins on a map of the continent tell you nothing you did not know.

         Past this span the honest move is to stop fitting and go to the site
         the reader has actually selected. The other pins stay on the map, so
         choosing one from the list flies the camera to it — which is how you
         find out the far one is there. */
      const sw = b.getSouthWest();
      const ne = b.getNorthEast();
      const tooWide = ne.lng - sw.lng > 4 || ne.lat - sw.lat > 4;
      const focus = points.find((p) => p.id === selectedId) ?? points[0];
      if (tooWide) {
        m.easeTo({
          center: [focus.coords.lng, focus.coords.lat],
          zoom: 9,
          pitch: 0,
          duration: animate && !reduced ? 900 : 0,
        });
        return;
      }
      m.fitBounds(b, { padding: 72, maxZoom: 13, duration: animate && !reduced ? 900 : 0 });
      /* Pitch buys depth up close and only distorts a wide view. */
      m.setPitch(0);
    },
    [points, userLocation, reduced, soloZoom, selectedId]
  );

  /* Create once, and mean it. `fit` is read through a ref so that recomputing
     it can never re-run this effect: creating a WebGL map is expensive and
     tearing one down mid-load cancels every tile request it had in flight. */
  const fitRef = useRef(fit);
  useEffect(() => {
    fitRef.current = fit;
  }, [fit]);

  /* Refit when the set of points changes. `fit` used to run exactly once, on
     styledata, so switching the state filter on the homepage rebuilt the pin
     list and left the camera exactly where it was — looking at California
     while the list said Texas. Guarded on the map existing and on the style
     having arrived, because fitting a map that has not loaded is a no-op that
     silently discards the camera you wanted. */
  const fitKey = points.map((p) => p.id).join(",");
  useEffect(() => {
    const m = map.current;
    if (!m || !styleArrived.current) return;
    fitRef.current(m, true);
  }, [fitKey, selectedId]);

  useEffect(() => {
    if (!holder.current || map.current) return;
    let m: MapLibreMap;
    try {
      m = new MapLibreMap({
        container: holder.current,
        style: STYLE_URL as unknown as StyleSpecification,
        center: [-118.127, 34.095],
        zoom: 9,
        attributionControl: { compact: true },
        interactive,
        minZoom: 3,
        /* The map this replaces set gestureHandling="cooperative" on purpose.
           A full-width 500px map that swallows one-finger drag traps the page
           scroll on a phone; dropping it was a straight regression. */
        cooperativeGestures: true,
        /* Keeps the drawn frame readable after compositing, which is what
           lets the map be screenshotted or exported at all — without it a
           WebGL canvas reads back blank. Costs a little memory; worth it to
           be able to verify the map actually rendered. */
        canvasContextAttributes: { preserveDrawingBuffer: true, antialias: true },
      });
    } catch {
      /* Construction threw — no WebGL, or no context available. Deferred out
         of the effect body because setting state synchronously during an
         effect makes React render twice before paint. */
      queueMicrotask(() => setFailed(true));
      return;
    }
    map.current = m;
    /* One glyph range or one tile is allowed to fail. The STYLE is not.
       This tested `!m.isStyleLoaded()`, which is false for the entire startup
       window — so a single 404 on any tile during load latched the failure
       panel over a map that then loaded perfectly underneath it, and nothing
       ever cleared it. Intermittent in production, near-impossible to
       reproduce on a fast connection. */
    m.on("style.load", () => {
      styleArrived.current = true;
      setFailed(false);
    });
    m.on("error", (e) => {
      if (!styleArrived.current) setFailed(true);
      else console.warn("[hub-map]", e?.error?.message ?? e);
    });
    /* styledata, not load. MapLibre paints the background layer the moment the
       style JSON parses — and positron's is rgb(242,243,240) — so tinting on
       `load`, which waits for the first tile batch, meant a flash of near-white
       in a 500px panel on a navy site, every time. */
    m.on("styledata", () => tint(m));
    m.on("load", () => {
      tint(m);
      fitRef.current(m, false);
    });
    if (interactive) m.addControl(new NavigationControl({ showCompass: false }), "top-right");

    /* The parent in find-your-hub is a motion.div that animates in on scroll,
       so the container has no stable size at construction time. */
    const ro = new ResizeObserver(() => m.resize());
    ro.observe(holder.current);

    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, [interactive]);

  /* Refit when the set of points really changes — separate from creation, so
     a data change moves the camera instead of rebuilding the map. */
  useEffect(() => {
    const m = map.current;
    if (m?.isStyleLoaded()) fit(m, true);
  }, [fit]);

  /* Markers follow the data. */
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach((mk) => mk.remove());
    markers.current = points.map((p) => {
      const el = markerEl(p.label, p.id === selectedId, p.live);
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        onSelect?.(p.id);
      });
      return new Marker({ element: el, anchor: "bottom" })
        .setLngLat([p.coords.lng, p.coords.lat])
        .addTo(m);
    });
    if (userLocation) {
      const dot = document.createElement("span");
      dot.style.cssText =
        "display:block;width:12px;height:12px;border-radius:999px;background:#fff;box-shadow:0 0 0 5px rgba(255,255,255,0.25)";
      markers.current.push(
        new Marker({ element: dot }).setLngLat([userLocation.lng, userLocation.lat]).addTo(m)
      );
    }
  }, [points, selectedId, onSelect, userLocation]);

  /* Move to the selection rather than cutting to it. */
  useEffect(() => {
    const m = map.current;
    if (!m || selectedId == null) return;
    const p = points.find((q) => q.id === selectedId);
    if (!p) return;
    const c: [number, number] = [p.coords.lng, p.coords.lat];
    if (reduced) m.jumpTo({ center: c });
    else m.easeTo({ center: c, duration: 700, easing: (t) => 1 - Math.pow(1 - t, 3) });
  }, [selectedId, points, reduced]);

  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];

  return (
    <div className={`relative ${className}`}>
      <div
        ref={holder}
        className="absolute inset-0 h-full w-full"
        style={{ background: ILLO.stage }}
        aria-label="Map of HubCharge stations"
        role="region"
      />
      {failed && (
        /* Tiles unreachable. The plate and our own markers are still worth
           showing — a blank grey canvas would say the site is broken. */
        <div className="absolute inset-0 grid place-items-center p-6 text-center" style={{ background: ILLO.stage }}>
          <p className="text-caption text-white/70 max-w-measure">
            {/* join(" and ") is only English for two. With one it reads
                "Alhambra are still open"; with three it runs them together
                without commas. */}
            The map could not load. {listCities(stations.filter((s) => s.status !== "coming-soon"))}{" "}
            {stations.filter((s) => s.status !== "coming-soon").length === 1 ? "is" : "are"} still
            open — use the list, or open them in your own maps app.
          </p>
        </div>
      )}
      {/* The map is never the only route to what it shows. */}
      <ul className="sr-only">
        {points.map((p) => (
          <li key={p.id}>
            {p.label}
            {p.live ? "" : " — announced, not open"}
          </li>
        ))}
      </ul>
      {selected && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${selected.coords.lat},${selected.coords.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          /* Bottom-LEFT. MapLibre puts its attribution control bottom-right,
             and this pill sat on top of it — so "© OpenStreetMap
             contributors" was clipped mid-sentence on every map on the site.
             That is the one piece of chrome on here we are not free to cover:
             the tiles are ODbL and the credit is a condition of using them. */
          className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded bg-ink-900/90 backdrop-blur px-3 py-2 text-caption text-white border border-white/15 hover:border-brand transition-colors"
        >
          <Navigation aria-hidden className="h-3.5 w-3.5" />
          Directions
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
