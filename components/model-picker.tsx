"use client";

import { ChevronDown } from "lucide-react";
import { evModels, type EvModel } from "@/lib/ev-models";

const MAKE_ORDER = new Map<string, EvModel[]>();
evModels.forEach((m) =>
  MAKE_ORDER.set(m.makeId, [...(MAKE_ORDER.get(m.makeId) ?? []), m])
);
const GROUPED = [...MAKE_ORDER.entries()];

/** One picker, used by every interactive block, so the label reads the same everywhere. */
export function ModelPicker({
  id,
  value,
  onChange,
  label = "Your car",
  tone = "light",
}: {
  id: string;
  value: string;
  onChange: (id: string) => void;
  label?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-caption mb-1.5 ${dark ? "text-on-dark/60" : "text-ink-500"}`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none pl-3 pr-9 py-2.5 text-body-sm ${
            dark ? "field-dark" : "field"
          }`}
        >
          {GROUPED.map(([makeId, models]) => (
            <optgroup key={makeId} label={models[0].name.split(" ")[0]}>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? "text-white/55" : "text-ink-400"}`}
        />
      </div>
    </div>
  );
}
