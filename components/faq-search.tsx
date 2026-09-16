"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";

export type FaqGroup = {
  title: string;
  items: { q: string; a: ReactNode }[];
};

/**
 * Filterable FAQ. The answers arrive as already-rendered nodes from the
 * server component, so only the question text is searched — which is what
 * people actually scan for anyway.
 */
export function FaqSearch({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.q.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const total = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="max-w-measure">
      <div className="field-wrap relative mb-3">
        <Search
          aria-hidden
          className="field-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 transition-colors"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions — adapter, price, attendant…"
          aria-label="Search frequently asked questions"
          className="field pl-11 pr-4 py-3.5 text-body"
        />
      </div>

      <p aria-live="polite" className="text-caption text-ink-400 mb-10">
        {query.trim() ? `${total} matching question${total === 1 ? "" : "s"}` : " "}
      </p>

      {total === 0 ? (
        <p className="text-body text-ink-500 border-t border-paper-300 pt-6">
          Nothing matches &ldquo;{query}&rdquo;. Call{" "}
          <a href="tel:+19493928755" className="text-brand-ink underline">
            (949) 392-8755
          </a>{" "}
          or email{" "}
          <a href="mailto:info@micronocinc.com" className="text-brand-ink underline">
            info@micronocinc.com
          </a>{" "}
          and we&rsquo;ll answer it directly.
        </p>
      ) : (
        <div className="space-y-14">
          {filtered.map((group) => (
            <section key={group.title}>
              <h2 className="text-overline text-ink-500">{group.title}</h2>
              <span aria-hidden className="mt-3 mb-1 block h-px w-8 bg-brass" />
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group border-t border-paper-300 last:border-b"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-h4 text-ink-900 hover:text-brand-ink transition-colors">
                    {item.q}
                    <span
                      aria-hidden
                      className="shrink-0 text-brand-ink text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="text-body-sm text-ink-500 pb-6 max-w-[62ch]">
                    {item.a}
                  </div>
                </details>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
