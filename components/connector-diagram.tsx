"use client";

import { useState } from "react";
import { evModels } from "@/lib/ev-models";
import { GuideFigure } from "@/components/guide-figure";
import { ILLO } from "@/lib/illustration";

/**
 * NACS and CCS, drawn to relative scale.
 *
 * The guide previously described the difference in prose and linked two PNGs.
 * The thing that actually explains it is the size: CCS is physically large
 * because it bolts two DC pins onto a full AC connector, where NACS carries
 * both on the same two pins. Once you see them side by side at the same scale,
 * the whole industry shift makes sense without a paragraph.
 */
const PORTS = {
  nacs: {
    label: "NACS",
    full: "North American Charging Standard",
    also: "Tesla connector · SAE J3400",
    body: "Two pins do both AC and DC, so the connector stays small and the port on the car stays small with it. Tesla opened the design in 2022 and nearly every manufacturer has since committed to it.",
    width: 68,
  },
  ccs: {
    label: "CCS",
    full: "Combined Charging System",
    also: "CCS1 · SAE J1772 Combo",
    body: "An AC connector with two DC pins added underneath — which is exactly why it's so large. It has been the non-Tesla standard in North America for a decade, and every car using it still charges here.",
    width: 100,
  },
} as const;

type PortId = keyof typeof PORTS;

function NacsSvg({ lit }: { lit: boolean }) {
  const c = lit ? ILLO.live : ILLO.seam;
  return (
    <svg viewBox="0 0 120 150" className="w-full h-auto" aria-hidden>
      <rect x="18" y="14" width="84" height="122" rx="42" fill={ILLO.recess} />
      <rect x="22" y="18" width="76" height="114" rx="38" fill={ILLO.bodyDark} />
      {/* two large pins carry both AC and DC — the whole point */}
      <circle cx="44" cy="52" r="13" fill={ILLO.shadow} />
      <circle cx="44" cy="52" r="9.5" fill={c} />
      <circle cx="76" cy="52" r="13" fill={ILLO.shadow} />
      <circle cx="76" cy="52" r="9.5" fill={c} />
      {/* signal pins */}
      <circle cx="44" cy="95" r="7" fill={ILLO.shadow} />
      <circle cx="44" cy="95" r="4.6" fill={ILLO.seam} />
      <circle cx="60" cy="108" r="6" fill={ILLO.shadow} />
      <circle cx="60" cy="108" r="3.8" fill={ILLO.seam} />
      <circle cx="76" cy="95" r="7" fill={ILLO.shadow} />
      <circle cx="76" cy="95" r="4.6" fill={ILLO.seam} />
    </svg>
  );
}

function CcsSvg({ lit }: { lit: boolean }) {
  const c = lit ? ILLO.live : ILLO.seam;
  return (
    <svg viewBox="0 0 176 220" className="w-full h-auto" aria-hidden>
      {/* upper AC section — a complete J1772 on its own */}
      <circle cx="88" cy="72" r="66" fill={ILLO.recess} />
      <circle cx="88" cy="72" r="60" fill={ILLO.bodyDark} />
      <circle cx="60" cy="46" r="13" fill={ILLO.shadow} />
      <circle cx="60" cy="46" r="9.5" fill={ILLO.seam} />
      <circle cx="116" cy="46" r="13" fill={ILLO.shadow} />
      <circle cx="116" cy="46" r="9.5" fill={ILLO.seam} />
      <circle cx="52" cy="90" r="9" fill={ILLO.shadow} />
      <circle cx="52" cy="90" r="6" fill={ILLO.seam} />
      <circle cx="88" cy="98" r="9" fill={ILLO.shadow} />
      <circle cx="88" cy="98" r="6" fill={ILLO.seam} />
      <circle cx="124" cy="90" r="9" fill={ILLO.shadow} />
      <circle cx="124" cy="90" r="6" fill={ILLO.seam} />
      {/* lower DC section — the two pins bolted on that make it "combined" */}
      <path d="M28,120 H148 A28,28 0 0 1 148,206 H28 A28,28 0 0 1 28,120 Z" fill={ILLO.recess} />
      <path d="M33,125 H143 A24,24 0 0 1 143,201 H33 A24,24 0 0 1 33,125 Z" fill={ILLO.bodyDark} />
      <circle cx="58" cy="163" r="24" fill={ILLO.shadow} />
      <circle cx="58" cy="163" r="19" fill={c} />
      <circle cx="118" cy="163" r="24" fill={ILLO.shadow} />
      <circle cx="118" cy="163" r="19" fill={c} />
    </svg>
  );
}

export function ConnectorDiagram() {
  const [active, setActive] = useState<PortId>("nacs");

  const counts = {
    nacs: evModels.filter((m) => m.port === "nacs").length,
    ccs: evModels.filter((m) => m.port === "ccs").length,
  };

  return (
    <GuideFigure
      eyebrow="Side by side"
      title="Why one is so much bigger than the other"
      footnote={
        <>
          Drawn to relative scale. Orange marks the pins that carry DC fast
          charging — the same job, done with two pins on NACS and four
          connectors&rsquo; worth of housing on CCS. Every HubCharge station
          carries both cables, so this is a matter of which one you pick up.
        </>
      }
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {(Object.keys(PORTS) as PortId[]).map((id) => {
          const p = PORTS[id];
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              aria-pressed={on}
              className={`text-left rounded-lg p-4 -m-4 transition-colors ${
                on ? "bg-paper-100" : "hover:bg-paper-100/60"
              } group`}
            >
              {/* the shared baseline is what makes the scale legible */}
              <div className="flex items-end justify-center h-56 mb-5">
                <div style={{ width: `${p.width}%`, maxWidth: p.width === 68 ? 120 : 176 }}>
                  {id === "nacs" ? <NacsSvg lit /> : <CcsSvg lit />}
                </div>
              </div>
              <p className="text-h3 text-ink-900">{p.label}</p>
              <p className="text-caption text-ink-400 mt-1">{p.full}</p>
              <p className="text-caption text-ink-400">{p.also}</p>
              <p className="text-body-sm text-ink-500 mt-3">{p.body}</p>
              <p className="text-caption text-brand-ink mt-3">
                {counts[id]} of the {evModels.length} cars we list use this
              </p>
            </button>
          );
        })}
      </div>
    </GuideFigure>
  );
}
