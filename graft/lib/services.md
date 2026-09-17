# lib/services.ts

- Availability · type · L24-L24 — type Availability = "today" | "limited" | "soon";
- Service · type · L26-L34 — type Service = { id: string; label: string; /** One line, in a driver's words, of what they actually get. */ desc: string; availability: Availability; /** The hedge, written once. Required for anything not `today`. */ caveat?: string; };
- getService · function · L92-L94 — function getService(id: string): Service | undefined
- servicesBy · function · L96-L98 — function servicesBy(availability: Availability): Service[]
- availableNow · function · L101-L103 — function availableNow(): Service[]
- availabilityLabel · function · L106-L108 — function availabilityLabel(a: Availability): string | null
- caveatsFor · function · L116-L118 — function caveatsFor(list: Service[]): string[]
