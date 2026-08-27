"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { evMakes, RANGE_FOOTNOTE, EV_DATA_UPDATED } from "@/lib/ev-models";
import { makeTenMinuteBand } from "@/lib/charging-math";

const FILTERS = [
  { id: "all", label: "All makes" },
  { id: "nacs", label: "NACS port" },
  { id: "ccs", label: "CCS port" },
  { id: "transitioning", label: "Either, by model year" },
] as const;

/**
 * Searchable compatibility checker. Fifteen equal-weight cards with no way to
 * find your own make was a lot to scan; typing three letters is not.
 */
export function VehicleFinder() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return evMakes.filter((m) => {
      const matchesFilter = filter === "all" || m.port === filter;
      const matchesQuery =
        q.length === 0 ||
        m.name.toLowerCase().includes(q) ||
        m.portNote.toLowerCase().includes(q) ||
        (m.note?.toLowerCase().includes(q) ?? false);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="max-w-measure">
      <div className="relative mb-4">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your make — Tesla, Ford, Rivian…"
          aria-label="Search vehicle makes"
          className="w-full rounded-lg border border-paper-300 bg-white pl-11 pr-4 py-3.5 text-body text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div role="radiogroup" aria-label="Filter by port" className="flex flex-wrap gap-2 mb-8">
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
                  ? "border-brand bg-brand text-white"
                  : "border-paper-300 text-ink-500 hover:border-ink-400"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="text-caption text-ink-400 mb-4">
        {results.length} of {evMakes.length} makes
      </p>

      {results.length === 0 ? (
        <p className="text-body text-ink-500 border-t border-paper-300 pt-6">
          No match for &ldquo;{query}&rdquo;. If your EV fast-charges with a
          NACS or CCS port, it works here — that covers nearly every EV sold in
          the US.
        </p>
      ) : (
        <ul>
          {results.map((m) => {
            const band = makeTenMinuteBand(m.id);
            return (
            <li
              key={m.id}
              className="grid md:grid-cols-[minmax(0,20ch)_1fr_auto] gap-x-8 gap-y-1 py-5 border-t border-paper-300 last:border-b"
            >
              <span className="text-h4 text-ink-900 flex items-center gap-2">
                <CheckCircle2 aria-hidden className="h-3.5 w-3.5 text-green-700 shrink-0" />
                {m.name}
              </span>
              <span className="text-body-sm text-ink-500">
                {m.portNote}
                {m.note && (
                  <span className="mt-1.5 flex items-start gap-1.5 text-caption text-ink-400">
                    <AlertTriangle aria-hidden className="h-3 w-3 mt-0.5 shrink-0 text-brass" />
                    {m.note}
                  </span>
                )}
              </span>
              {band && (
                <span className="text-brand-ink font-semibold text-body-sm md:text-right whitespace-nowrap">
                  ~{band[0]}–{band[1]} mi
                </span>
              )}
            </li>
            );
          })}
        </ul>
      )}

      <p className="text-caption text-ink-400 mt-6">
        Approximate range added in ~10 minutes. Last updated {EV_DATA_UPDATED}.
      </p>
      <p className="text-[11px] text-ink-400 mt-2 max-w-[70ch]">{RANGE_FOOTNOTE}</p>
    </div>
  );
}
