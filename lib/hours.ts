import type { Station } from "@/lib/stations";

/**
 * Hours-aware open/closed status derived from `hoursSchema`.
 *
 * Stations keep the same hours every day, so this is a simple window check
 * rather than a weekly schedule. Computed in the station's own timezone
 * (America/Los_Angeles) — using the visitor's clock would tell someone in
 * New York a California station is shut.
 */

/* Was the only timezone the site knew. Kept as the fallback for anything
   that has not declared one; every station in lib/stations.ts now does. */
const DEFAULT_TZ = "America/Los_Angeles";

function minutesOfDayInTz(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

function label(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${period}` : `${hour} ${period}`;
}

export type StationStatus = {
  open: boolean;
  /** True when the site has not opened yet, whatever the clock says. */
  soon: boolean;
  /** "Open now · closes 10 PM" / "Closed · opens 6 AM" / "Opening soon" */
  text: string;
  short: string;
};

export function stationStatus(station: Station, now: Date = new Date()): StationStatus {
  /* A site that has not been built cannot be open, and this function used to
     answer only the clock question — so Round Rock, which carries the same
     6 AM-10 PM hours as everywhere else, reported "Open now" on the contact
     page between those hours, with an address and a Directions link beside
     it. The guard lives here rather than at each call site because there are
     three call sites and only one of them remembered. */
  if (station.status === "coming-soon") {
    return { open: false, soon: true, text: "Opening soon", short: "Opening soon" };
  }

  const { opens, closes } = station.hoursSchema;
  const cur = minutesOfDayInTz(now, station.tz ?? DEFAULT_TZ);
  const start = toMinutes(opens);
  const end = toMinutes(closes);
  const open = cur >= start && cur < end;

  return {
    open,
    soon: false,
    text: open
      ? `Open now · closes ${label(closes)}`
      : `Closed · opens ${label(opens)}`,
    short: open ? "Open now" : "Closed",
  };
}
