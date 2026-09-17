# components/hub-map.tsx

- tint · function · L54-L113 — function tint(map: MapLibreMap)
- markerEl · function · L116-L144 — function markerEl(label: string, selected: boolean, live: boolean)
- listCities · function · L152-L156 — function listCities(list: { city: string }[]): string
- MapPoint · type · L160-L165 — type MapPoint = { id: number; label: string; coords: { lat: number; lng: number }; live: boolean; };
- HubMap · function · L167-L440 — function HubMap({ stations, selectedId, onSelect, userLocation, className = "", extraPoints = NO_EXTRA, interactive = true, soloZoom = 14, }: { stations: Station[]; selectedId?: number; onSelect?: (id: number) => void; userLocation?: { lat: number; lng: number } | null; className?: string; /** Zoom used when there is exactly one point to show — nothing to fit a * bounds to. Lower it to keep the surrounding roads in frame. */ soloZoom?: number; /** Announced-but-unopened sites, and anything the OpenChargeMap proxy adds. */ extraPoints?: MapPoint[]; interactive?: boolean; })
