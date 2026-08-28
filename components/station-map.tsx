"use client";

import { useMemo } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { MapPin, Navigation } from "lucide-react";
import type { Station } from "@/lib/stations";
import { mapEmbedUrl } from "@/lib/stations";

/**
 * Branded station map.
 *
 * Replaces a keyless `output=embed` iframe that had a decorative orange
 * "pin" absolutely positioned over its centre — it did not track the map, so
 * panning left it pointing at nothing — and a legend describing green
 * markers that were never drawn.
 *
 * With no browser key configured this falls back to the plain embed, so the
 * page still shows a usable map rather than an empty box.
 */

const MAP_ID = "hubcharge-station-map";

function StationMarker({
  station,
  selected,
  onSelect,
}: {
  station: Station;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  const [markerRef] = useAdvancedMarkerRef();
  return (
    <AdvancedMarker
      ref={markerRef}
      position={station.coords}
      title={station.name}
      onClick={() => onSelect(station.id)}
      zIndex={selected ? 2 : 1}
    >
      <button
        type="button"
        aria-label={`${station.name}${selected ? " (selected)" : ""}`}
        className={`flex items-center gap-1.5 rounded-full border pl-1.5 pr-3 py-1.5 shadow-card-hover transition-all ${
          selected
            ? "bg-brand border-brand text-ink-900 scale-105"
            : "bg-ink-900 border-white/25 text-white hover:border-brand"
        }`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            selected ? "bg-white/20" : "bg-brand"
          }`}
        >
          <MapPin aria-hidden className="h-3 w-3" />
        </span>
        <span className="text-footnote font-semibold whitespace-nowrap">
          {station.city}
        </span>
      </button>
    </AdvancedMarker>
  );
}

export function StationMap({
  stations,
  selectedId,
  onSelect,
  userLocation,
  className = "",
}: {
  stations: Station[];
  selectedId: number;
  onSelect?: (id: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const selected = stations.find((s) => s.id === selectedId) ?? stations[0];

  const center = useMemo(() => selected.coords, [selected]);

  if (!apiKey) {
    // No browser key configured — plain embed rather than an empty frame.
    return (
      <iframe
        title={`Map of ${selected.name}`}
        src={mapEmbedUrl(selected)}
        className={`w-full border-0 ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={MAP_ID}
          defaultCenter={center}
          center={center}
          defaultZoom={14}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
          className="h-full w-full"
          colorScheme="DARK"
        >
          {stations.map((s) => (
            <StationMarker
              key={s.id}
              station={s}
              selected={s.id === selectedId}
              onSelect={(id) => onSelect?.(id)}
            />
          ))}

          {userLocation && (
            <AdvancedMarker position={userLocation} title="Your location">
              <span className="block h-3.5 w-3.5 rounded-full bg-white ring-4 ring-white/30 shadow" />
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>

      <a
        href={`https://www.google.com/maps/search/?api=1&query=${selected.coords.lat},${selected.coords.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded bg-ink-900/90 backdrop-blur px-3 py-2 text-caption text-white border border-white/15 hover:border-brand transition-colors"
      >
        <Navigation aria-hidden className="h-3.5 w-3.5" />
        Open in Maps
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
