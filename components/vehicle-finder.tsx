"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { evModels, getMake, EV_DATA_UPDATED, type EvModel } from "@/lib/ev-models";
import {
  tenMinuteBand,
  tenToEighty,
  STATION_KW,
  ESTIMATE_BASIS,
} from "@/lib/charging-math";
import { CurveSpark } from "@/components/curve-spark";

const FILTERS = [
  { id: "all", label: "All cars" },
  { id: "nacs", label: "NACS port" },
  { id: "ccs", label: "CCS port" },
  { id: "800", label: "800-volt" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function matchesFilter(m: EvModel, f: FilterId) {
  if (f === "all") return true;
  if (f === "800") return m.archV === 800;
  return m.port === f;
}

/**
 * Model-level compatibility.
 *
 * This used to answer at make level, which was too coarse to be useful: "Ford
 * — CCS, roughly 60–110 miles" covers a Standard Range Mach-E and a Lightning
 * that behave nothing alike. Every row here is one trim, with the figures that
 * trim actually produces at our chargers.
 */
export function VehicleFinder() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return evModels.filter((m) => {
      if (!matchesFilter(m, filter)) return false;
      if (!q) return true;
      const make = getMake(m.makeId);
      return (
        m.name.toLowerCase().includes(q) ||
        m.short.toLowerCase().includes(q) ||
        (make?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, filter]);

  return (
    <div className="max-w-4xl">
      <div className="relative mb-4">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your car — Ioniq 5, Model Y, Lightning…"
          aria-label="Search electric vehicles"
          className="w-full rounded-lg border border-paper-300 bg-white pl-11 pr-4 py-3.5 text-body text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div role="radiogroup" aria-label="Filter" className="flex flex-wrap gap-2 mb-7">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                active
                  ? "border-brand bg-brand text-ink-900"
                  : "border-paper-300 text-ink-500 hover:border-ink-400"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="text-caption text-ink-400 mb-3">
        {results.length} of {evModels.length} cars
      </p>

      {results.length === 0 ? (
        <p className="text-body text-ink-500 border-t border-paper-300 pt-6">
          No match for &ldquo;{query}&rdquo;. We list the highest-volume trims
          rather than every variant — if your EV fast-charges with a NACS or CCS
          port, it works here, which covers nearly every EV sold in the US.
        </p>
      ) : (
        <ul>
          {results.map((m) => {
            const [lo, hi] = tenMinuteBand(m);
            const full = tenToEighty(m);
            const chademo = m.port === "chademo";
            const make = getMake(m.makeId);
            return (
              <li
                key={m.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,23ch)_5rem_minmax(0,1fr)_auto] gap-x-6 gap-y-2 items-center py-5 border-t border-paper-300 last:border-b"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-h4 text-ink-900">
                    {chademo ? (
                      <XCircle aria-hidden className="h-3.5 w-3.5 shrink-0 text-error" />
                    ) : (
                      <CheckCircle2 aria-hidden className="h-3.5 w-3.5 shrink-0 text-green-700" />
                    )}
                    <span className="truncate">{m.name}</span>
                  </span>
                  <span className="block text-caption text-ink-400 mt-1 pl-[1.375rem]">
                    {m.port === "nacs" ? "NACS" : m.port === "ccs" ? "CCS" : "CHAdeMO"} ·{" "}
                    {m.archV}V
                  </span>
                </span>

                <CurveSpark model={m} className="hidden sm:block w-20 h-8" />

                <span className="col-span-2 sm:col-span-1 text-body-sm text-ink-500">
                  {chademo ? (
                    <>Cannot DC fast-charge here — see the note below.</>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">~{lo}–{hi} mi in 10 min</span>
                      {" · "}
                      <span className="whitespace-nowrap">10–80% in {full} min</span>
                      {" · "}
                      <span className="whitespace-nowrap">
                        {Math.min(m.peakKw, STATION_KW)} kW here
                      </span>
                    </>
                  )}
                </span>

                {make && (
                  <Link
                    href={`/charging-101/vehicles/${make.id}`}
                    className="hidden sm:block text-caption text-brand-ink hover:underline whitespace-nowrap"
                  >
                    {make.name} →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-caption text-ink-400 mt-6">
        Vehicle data last updated {EV_DATA_UPDATED}.
      </p>
      <p className="text-[11px] text-ink-400 mt-2 max-w-[75ch]">{ESTIMATE_BASIS}</p>
    </div>
  );
}
