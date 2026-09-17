# lib/ev-models.ts

- Port · type · L30-L30 — type Port = "nacs" | "ccs" | "chademo";
- CurvePoint · type · L32-L32 — type CurvePoint = { soc: number; kw: number };
- EvModel · type · L34-L54 — type EvModel = { id: string; makeId: string; /** Display name, e.g. "Ioniq 5 Long Range AWD" */ name: string; /** Short label for compact UI */ short: string; port: Port; /** Usable pack capacity in kWh (not gross) */ usableKwh: number; /** EPA combined range, miles */ epaMiles: number; /** Vehicle's own sustained DC ceiling in kW */ peakKw: number; archV: 400 | 800; /** Onboard AC charger ceiling, kW — the limit for Level 1 and Level 2. */ acKw: number; /** Power vs state of charge. Monotonic in soc. */ curve: CurvePoint[]; note?: string; };
- modelsForMake · function · L247-L249 — function modelsForMake(makeId: string): EvModel[]
- getModel · function · L251-L253 — function getModel(id: string): EvModel | undefined
- efficiencyMiPerKwh · function · L256-L258 — function efficiencyMiPerKwh(m: EvModel): number
- PortStatus · type · L268-L268 — type PortStatus = "nacs" | "ccs" | "transitioning";
- EvMake · type · L270-L276 — type EvMake = { id: string; name: string; port: PortStatus; portNote: string; note?: string; };
- derivePort · function · L355-L359 — function derivePort(models: EvModel[]): PortStatus
- getMake · function · L367-L369 — function getMake(id: string): EvMake | undefined
- makeRangeBand · function · L375-L386 — function makeRangeBand( makeId: string, simulate: (m: EvModel) => { milesLow: number; milesHigh: number } ): [number, number] | null
