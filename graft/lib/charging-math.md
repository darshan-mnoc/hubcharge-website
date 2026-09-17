# lib/charging-math.ts

- TemperatureId · type · L37-L37 — type TemperatureId = keyof typeof TEMPERATURE_FACTORS;
- Temperature · type · L56-L56 — type Temperature = TemperatureId | number;
- temperatureFactor · function · L59-L61 — function temperatureFactor(t: Temperature): number
- powerAtSoc · function · L64-L76 — function powerAtSoc(model: EvModel, soc: number): number
- SessionResult · type · L78-L107 — type SessionResult = { /** Conservative and optimistic ends of the range band, in miles */ milesLow: number; milesHigh: number; /** State of charge reached */ endSoc: number; /** * Mean delivered power across the time actually spent charging, kW. * * A session average including the taper, NOT a peak — a car that opens at * 235kW and ends at 85kW averages neither figure, and labelling this as * anything but an average invites a reader to expect the plateau for the * whole stop. */ avgKw: number; /** Energy metered at the plug, kWh — what a per-kWh network would bill. */ kwhMetered: number; /** * Energy that reaches the battery, kWh. * * This is the one a driver means by "how much did I get": it is what moved * the state of charge, and it is the figure the range band is derived from. * Lower than `kwhMetered` by the conversion and thermal losses. */ kwhToBattery: number; /** True when the station is the limit, not the car */ stationLimited: boolean; /** True when the car's own ceiling is below the station's */ vehicleLimited: boolean; };
- simulateSession · function · L115-L173 — function simulateSession( model: EvModel, stationKw: number, startSoc: number, minutes: number, temperature: Temperature = "mild" ): SessionResult
- round5 · function · L158-L158 — round5 = (n: number)
- minutesBetweenSoc · function · L190-L208 — function minutesBetweenSoc( model: EvModel, stationKw: number, fromSoc: number, toSoc: number, temperature: Temperature = "mild" ): number
- computeMinutesBetweenSoc · function · L210-L231 — function computeMinutesBetweenSoc( model: EvModel, stationKw: number, fromSoc: number, toSoc: number, temperature: Temperature ): number
- tenMinuteBand · function · L255-L258 — function tenMinuteBand(model: EvModel): [number, number]
- makeTenMinuteBand · function · L264-L272 — function makeTenMinuteBand(makeId: string): [number, number] | null
- fleetBand · function · L286-L299 — function fleetBand(minutes: number): { low: number; high: number; count: number; }
- tenToEighty · function · L318-L320 — function tenToEighty(model: EvModel): number
- configuratorModels · function · L328-L345 — function configuratorModels()
- interpolate · function · L369-L379 — function interpolate(curve: [number, number][], x: number): number
- chargeTempFactor · function · L382-L384 — function chargeTempFactor(degF: number): number
- rangeTempFactor · function · L387-L389 — function rangeTempFactor(degF: number): number
- acHours · function · L407-L416 — function acHours( model: EvModel, supplyKw: number, fromSoc: number, toSoc: number ): number
