# lib/openchargemap.ts

- PublicCharger · type · L28-L34 — type PublicCharger = { id: number; title: string; operator: string | null; coords: { lat: number; lng: number }; maxKw: number | null; };
- ChargerResult · type · L36-L36 — type ChargerResult = { configured: boolean; chargers: PublicCharger[] };
- snap · function · L46-L46 — snap = (n: number)
- OcmPoi · type · L48-L53 — type OcmPoi = { ID: number; AddressInfo?: { Title?: string; Latitude?: number; Longitude?: number }; OperatorInfo?: { Title?: string }; Connections?: { PowerKW?: number }[]; };
- nearbyChargers · function · L55-L110 — async function nearbyChargers({ lat, lng, radius = 15, limit = 40, }: { lat: number; lng: number; radius?: number; limit?: number; }): Promise<ChargerResult>
