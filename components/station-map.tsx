"use client";

import dynamic from "next/dynamic";
import type { Station } from "@/lib/stations";

/**
 * The station map.
 *
 * This used to be a Google Maps component that had never once rendered: it
 * needed a browser key AND a provisioned vector Map ID, neither existed, so
 * every visitor got its keyless fallback iframe. Google also wants a billing
 * account before it serves a tile.
 *
 * It is now a thin adapter over components/hub-map.tsx, which draws real
 * OpenFreeMap tiles with no key at all. The name and the prop contract are
 * unchanged so nothing that renders this had to be touched.
 *
 * Loaded dynamically with ssr:false because maplibre-gl touches `window` at
 * module scope, and kept out of the server bundle entirely.
 */
const HubMap = dynamic(() => import("@/components/hub-map").then((m) => m.HubMap), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-ink-900" aria-hidden />,
});

export function StationMap({
  stations,
  selectedId,
  onSelect,
  userLocation,
  className = "",
  interactive,
  soloZoom,
}: {
  stations: Station[];
  selectedId: number;
  onSelect?: (id: number) => void;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
  /** Forwarded. HubMap has had this since it was written and this wrapper
   *  swallowed it, so nothing could ask for a map that does not pan. */
  interactive?: boolean;
  soloZoom?: number;
}) {
  return (
    <HubMap
      stations={stations}
      selectedId={selectedId}
      onSelect={onSelect}
      userLocation={userLocation}
      className={className}
      interactive={interactive}
      soloZoom={soloZoom}
    />
  );
}
