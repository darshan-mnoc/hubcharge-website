"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type Term = { term: string; def: string };
export type Group = { id: string; label: string; terms: string[] };

/**
 * A glossary you can actually use.
 *
 * A reference page's job is to answer one question fast — someone arrives
 * having just seen "SOC" on a charger screen. Grouped headings help you browse
 * and do nothing for that. Typing three letters does.
 *
 * Grouping is kept as a filter rather than deleted, because browsing is the
 * other half of what a glossary is for.
 */
export function GlossaryIndex({ terms, groups }: { terms: Term[]; groups: Group[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inGroup =
      group === "all"
        ? terms
        : terms.filter((t) => groups.find((g) => g.id === group)?.terms.includes(t.term));
    if (!q) return inGroup;
    return inGroup.filter(
      (t) => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q)
    );
  }, [query, group, terms, groups]);

  return (
    <div className="max-w-4xl">
      <div className="field-wrap relative mb-4">
        <Search
          aria-hidden
          className="field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 transition-colors"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a term — kWh, taper, preconditioning…"
          aria-label="Search glossary terms"
          className="field pl-11 pr-4 py-3.5 text-body"
        />
      </div>

      <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2 mb-7">
        {[{ id: "all", label: "Everything" }, ...groups].map((g) => {
          const on = group === g.id;
          return (
            <button
              key={g.id}
              aria-pressed={on}
              onClick={() => setGroup(g.id)}
              className={`rounded-full border px-3.5 py-1.5 text-caption transition-colors ${
                on
                  ? "border-brand bg-brand text-ink-900"
                  : "border-paper-300 text-ink-600 hover:border-ink-300"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="text-caption text-ink-400 mb-3">
        {results.length} of {terms.length} terms
      </p>

      {results.length === 0 ? (
        <p className="text-body text-ink-500 border-t border-paper-300 pt-6">
          Nothing matches &ldquo;{query}&rdquo;. If it&rsquo;s a term you met on
          a charger screen and it isn&rsquo;t here, tell us — that&rsquo;s a gap
          worth closing.
        </p>
      ) : (
        <dl>
          {results.map((t) => (
            <div
              key={t.term}
              className="grid sm:grid-cols-[minmax(0,17ch)_minmax(0,1fr)] gap-x-8 gap-y-1 py-5 border-t border-paper-300 last:border-b"
            >
              <dt className="text-h4 text-ink-900">{t.term}</dt>
              <dd className="text-body-sm text-ink-500">{t.def}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
