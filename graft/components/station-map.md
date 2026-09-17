# components/station-map.tsx

- StationMap · function · L26-L56 — function StationMap({ stations, selectedId, onSelect, userLocation, className = "", interactive, soloZoom, }: { stations: Station[]; selectedId: number; onSelect?: (id: number) => void; userLocation?: { lat: number; lng: number } | null; className?: string; /** Forwarded. HubMap has had this since it was written and this wrapper * swallowed it, so nothing could ask for a map that does not pan. */ interactive?: boolean; soloZoom?: number; })
