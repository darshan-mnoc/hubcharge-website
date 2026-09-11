import {
  AlertCircle,
  Building2,
  CircleParking,
  Layers,
  Navigation,
  Phone,
  PlugZap,
  SquareParking,
  UserRound,
} from "lucide-react";
import type { StationAccess } from "@/lib/station-access";
import type { Station } from "@/lib/stations";

/**
 * An advisory: the things that govern the space, rather than describe it.
 *
 * On the `note` palette, which tailwind.config.ts defines for exactly this —
 * "Caution / 'read this before you drive over'". Everything in this block used
 * to sit on paper-100/paper-300, so three consecutive groups of boxes looked
 * identical and read as one undifferentiated stack. Rules and warnings are
 * warm; reference material stays neutral.
 */
function Advisory({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 rounded-lg border border-note-line bg-note-surface p-4">
      <AlertCircle
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-brass-ink"
      />
      <span className="text-body-sm leading-relaxed text-note-ink">{children}</span>
    </li>
  );
}

/** One step of getting from the street to the cable. */
function Waypoint({
  n,
  Icon,
  label,
  children,
}: {
  n: number;
  Icon: typeof Layers;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="border-t border-paper-300 pt-5">
      <span className="flex items-center gap-2.5 text-index text-ink-400">
        {String(n).padStart(2, "0")}
        <Icon aria-hidden className="h-4 w-4 text-brand-ink" />
      </span>
      <h4 className="text-h4 text-ink-900 mt-3 mb-1.5">{label}</h4>
      <p className="text-body-sm text-ink-500">{children}</p>
    </li>
  );
}

/**
 * How to actually find the charger.
 *
 * WHY THIS EXISTS
 * The station page had an address, a map embed and then ten restaurant
 * listings. For a forecourt you can see from the road that is enough. For
 * Alhambra, which is inside a parking structure, it left the driver to work
 * out the entrance, the level and the stall on their own, standing at a
 * barrier — and then told them about coffee.
 *
 * EVERY BLOCK IS CONDITIONAL
 * Nothing here is invented, so nothing here is guaranteed to exist. A field
 * that is unknown is absent from `lib/station-access.ts` and renders nothing
 * at all: no placeholder, no "details to follow". The component returns null
 * when it has nothing to say, the same way NearbyPlaces does, so a station
 * with no record is indistinguishable from one that never had the section.
 */
export function StationAccess({
  station,
  access,
}: {
  station: Station;
  access: StationAccess;
}) {
  const waypoints = [
    access.entrance && {
      Icon: Navigation,
      label: "Entrance",
      body: access.entrance,
    },
    access.level && { Icon: Layers, label: "Level", body: access.level },
    access.stalls && {
      Icon: SquareParking,
      label: "Stall",
      body: access.stalls,
    },
  ].filter(Boolean) as { Icon: typeof Layers; label: string; body: string }[];

  const advisories = [
    ...(access.accessNotes ?? []),
    access.clearanceFt !== undefined &&
      `Overhead clearance is ${access.clearanceFt} ft — worth checking if you drive something tall with a roof box or a rack.`,
    access.parking &&
      (access.parking.validation
        ? `Parking: ${access.parking.cost} ${access.parking.validation}`
        : `Parking: ${access.parking.cost}`),
  ].filter(Boolean) as string[];

  const hasBody =
    waypoints.length > 0 ||
    advisories.length > 0 ||
    Boolean(access.setting) ||
    Boolean(access.attendantHours) ||
    (access.units?.length ?? 0) > 0 ||
    (access.ifOccupied?.length ?? 0) > 0;

  if (!hasBody) return null;

  return (
    <section aria-labelledby="finding-the-charger" className="mb-10">
      {/* Overline without a brass rule under it. tailwind.config.ts budgets
          brass at "<=2 ornamental moments per page" and this page already
          spends both — the masthead eyebrow and the calculator. The overline
          and the H3 below carry the hierarchy on their own. */}
      <p className="text-overline text-ink-500 mb-3">Finding the charger</p>
      <h3 id="finding-the-charger" className="text-h3 text-ink-900 mb-4">
        Getting from the address to the cable
      </h3>

      {access.setting && (
        <p className="flex items-start gap-2.5 text-body-sm text-ink-600 max-w-[70ch] mb-6">
          <Building2
            aria-hidden
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-700"
          />
          {access.setting}
        </p>
      )}

      {waypoints.length > 0 && (
        <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-3 mb-10">
          {waypoints.map((w, i) => (
            <Waypoint key={w.label} n={i + 1} Icon={w.Icon} label={w.label}>
              {w.body}
            </Waypoint>
          ))}
        </ol>
      )}

      {advisories.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 mb-10">
          {advisories.map((a) => (
            <Advisory key={a}>{a}</Advisory>
          ))}
        </ul>
      )}

      {access.units && access.units.length > 0 && (
        <div className="mb-10">
          <p className="text-overline text-ink-500 mb-4">
            {access.units.length === station.chargers
              ? `The ${station.chargers === 2 ? "two" : station.chargers} chargers here`
              : "The chargers here"}
          </p>
          {/* Titled by cabinet, not by connector. Both units carry CCS1 and
              NACS, so "CCS1 + NACS" was the one fact that could not tell them
              apart — and it was the heading on both cards, with the thing that
              actually identifies them buried in the body text. */}
          <ul className="grid gap-4 sm:grid-cols-2">
            {access.units.map((u, i) => (
              <li
                key={u.id ?? u.label ?? i}
                className="flex h-full gap-3.5 rounded-lg border border-paper-300 bg-paper p-5"
              >
                <span
                  aria-hidden
                  className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper-200 text-ink-600"
                >
                  <PlugZap className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-h4 text-ink-900">
                    {u.label ?? `Charger ${i + 1}`}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-ink-400">
                    {u.id && (
                      <span className="rounded bg-paper-200 px-1.5 py-0.5 font-medium text-ink-600">
                        {u.id}
                      </span>
                    )}
                    <span>{u.connectors.join(" · ")}</span>
                  </span>
                  {u.note && (
                    <span className="mt-2 block text-caption leading-relaxed text-ink-500">
                      {u.note}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {access.attendantHours && (
        <p className="flex items-start gap-2.5 text-body-sm text-ink-600 mb-6">
          <UserRound
            aria-hidden
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-700"
          />
          <span>
            An attendant is on site {access.attendantHours}. Outside those
            hours the chargers are self-serve, which works exactly the same way.
          </span>
        </p>
      )}

      {access.ifOccupied && access.ifOccupied.length > 0 && (
        <div className="rounded-lg border border-note-line bg-note-surface p-5 sm:p-6">
          <p className="flex items-center gap-2 text-h4 text-ink-900 mb-3">
            <CircleParking aria-hidden className="h-4 w-4 text-brass-ink" />
            If the charger is occupied or won&rsquo;t start
          </p>
          <ul className="space-y-2">
            {access.ifOccupied.map((line) => (
              <li key={line} className="text-body-sm text-note-ink">
                {line}
              </li>
            ))}
          </ul>
          <a
            href={`tel:${station.phoneE164}`}
            className="mt-4 inline-flex items-center gap-2 text-body-sm font-semibold text-brand-ink hover:underline"
          >
            <Phone aria-hidden className="h-4 w-4" />
            {station.phone}
          </a>
        </div>
      )}
    </section>
  );
}
