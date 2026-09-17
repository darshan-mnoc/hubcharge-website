# lib/hours.ts

- minutesOfDayInTz · function · L16-L26 — function minutesOfDayInTz(date: Date, timeZone: string): number
- toMinutes · function · L28-L31 — function toMinutes(hhmm: string): number
- label · function · L33-L38 — function label(hhmm: string): string
- StationStatus · type · L40-L47 — type StationStatus = { open: boolean; /** True when the site has not opened yet, whatever the clock says. */ soon: boolean; /** "Open now · closes 10 PM" / "Closed · opens 6 AM" / "Opening soon" */ text: string; short: string; };
- stationStatus · function · L49-L74 — function stationStatus(station: Station, now: Date = new Date()): StationStatus
