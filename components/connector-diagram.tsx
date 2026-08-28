"use client";

import { useState } from "react";
import { evModels } from "@/lib/ev-models";
import { GuideFigure } from "@/components/guide-figure";
import { ILLO } from "@/lib/illustration";

/**
 * NACS and CCS1, drawn to relative scale with the real pin layouts.
 *
 * The first version of this got the pins wrong in three ways, which is worth
 * recording so nobody "tidies" it back:
 *
 *  1. NACS was upside down. The published layout is 3-over-2 — three small
 *     signal pins across the top, the two large power pins beneath them.
 *     It had been drawn with the power pins on top.
 *
 *  2. The J1772 section had the wrong rows and the wrong sizes. Per the
 *     standard, the face is 43–44mm round and carries, relative to its
 *     centreline: L1 and N/L2 large, 6.8mm ABOVE, 15.7mm apart; PP and CP
 *     small, 5.6mm BELOW and 21.3mm apart — i.e. the signal pins sit *wider*
 *     than the power pins; and PE (ground) large, 10.6mm below, centred.
 *     The geometry below is those figures scaled, not eyeballed.
 *
 *  3. A DC CCS1 plug does not populate the two AC pins. Our chargers are DC,
 *     so drawing L1/N as live contacts misrepresents the cable actually
 *     hanging on the unit. They are drawn as empty wells.
 *
 * This is a schematic: pin count, relative size, relative position and the
 * scale ratio between the two connectors are right. It is not a dimensioned
 * engineering drawing and the caption says so.
 *
 * Sources: SAE J1772 (en.wikipedia.org/wiki/SAE_J1772) for the J1772/CCS1
 * geometry; SAE J3400 references for the NACS 3-over-2 arrangement.
 */

/* ── Shared geometry ───────────────────────────────────────────────
   One millimetre = one user unit, so the two SVGs are directly
   comparable and the scale claim in the caption is literally true. */
const MM = 1;
const J1772_R = 43.5 / 2; // 43–44mm face

function Pin({
  cx,
  cy,
  r,
  fill,
  empty = false,
  label,
  labelY,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  empty?: boolean;
  label?: string;
  /** Absolute y for labels that belong outside the connector outline. */
  labelY?: number;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={ILLO.shadow} />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.74}
        fill={empty ? ILLO.recess : fill}
        stroke={empty ? ILLO.seam : "none"}
        strokeWidth={empty ? 0.5 : 0}
      />
      {label && (
        <text
          x={cx}
          y={labelY ?? cy + r + 4.6}
          textAnchor="middle"
          fontSize={labelY ? 4.2 : 3.4}
          fill={labelY ? ILLO.body : ILLO.edge}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/**
 * NACS / J3400 — 3 small signal pins over 2 large power pins.
 * The two power pins carry AC *and* DC, which is the whole reason the
 * connector can be this small.
 */
function NacsSvg() {
  const w = 34 * MM; // the face is roughly half the width of a J1772
  const h = 44 * MM;
  const cx = w / 2;
  return (
    <svg viewBox={`-6 -6 ${w + 12} ${h + 20}`} className="h-full w-auto" role="img"
      aria-label="NACS connector face: three small signal pins in a row across the top, and two large power pins below them that carry both AC and DC.">
      {/* the compact rounded outline — not the tall oval this used to be */}
      <path
        d={`M2,13 Q2,2 ${cx},2 Q${w - 2},2 ${w - 2},13 L${w - 2},${h - 11}
            Q${w - 2},${h - 2} ${cx},${h - 2} Q2,${h - 2} 2,${h - 11} Z`}
        fill={ILLO.recess}
        stroke={ILLO.bodyDark}
        strokeWidth="1"
      />

      {/* top row — three small: ground centre, CP and PP either side */}
      <Pin cx={cx - 9} cy={14} r={2.6} fill={ILLO.seam} label="PP" />
      <Pin cx={cx} cy={13} r={3.2} fill={ILLO.seam} label="G" />
      <Pin cx={cx + 9} cy={14} r={2.6} fill={ILLO.seam} label="CP" />

      {/* bottom row — two large, doing both AC and DC */}
      <Pin cx={cx - 7.4} cy={30} r={6.2} fill={ILLO.live} label="DC+" labelY={51} />
      <Pin cx={cx + 7.4} cy={30} r={6.2} fill={ILLO.live} label="DC−" labelY={51} />
    </svg>
  );
}

/**
 * CCS1 — a complete J1772 face with two DC pins bolted underneath.
 * On a DC cable the AC pins are not populated, which is drawn.
 */
function Ccs1Svg() {
  const cx = 34;
  const cyTop = 26; // centre of the round J1772 section
  const w = 68 * MM;
  const h = 74 * MM;
  return (
    <svg viewBox={`-6 -6 ${w + 12} ${h + 20}`} className="h-full w-auto" role="img"
      aria-label="CCS1 connector face: a round J1772 section on top carrying five pins, with two large DC fast-charging pins in a housing beneath it. On a DC cable the two AC pins are not populated.">
      {/* lower DC housing, drawn first so the round section overlaps it */}
      <path
        d={`M10,${cyTop + 10} H${w - 10} A14,14 0 0 1 ${w - 10},${h - 2}
            H10 A14,14 0 0 1 10,${cyTop + 10} Z`}
        fill={ILLO.recess}
        stroke={ILLO.bodyDark}
        strokeWidth="1"
      />
      {/* the J1772 face — 43.5mm across */}
      <circle cx={cx} cy={cyTop} r={J1772_R} fill={ILLO.recess} stroke={ILLO.bodyDark} strokeWidth="1" />

      {/* J1772 pins, positioned from the standard's own offsets.
          L1 / N-L2: large, 6.8mm above centreline, 15.7mm apart.
          Unpopulated here because this is the DC cable. */}
      <Pin cx={cx - 15.7 / 2} cy={cyTop - 6.8} r={4.2} fill={ILLO.seam} empty label="L1" />
      <Pin cx={cx + 15.7 / 2} cy={cyTop - 6.8} r={4.2} fill={ILLO.seam} empty label="N/L2" />
      {/* PP / CP: small, 5.6mm below centreline, 21.3mm apart — wider than
          the power pins, which is the detail everyone draws wrong. */}
      <Pin cx={cx - 21.3 / 2} cy={cyTop + 5.6} r={2.3} fill={ILLO.seam} />
      <Pin cx={cx + 21.3 / 2} cy={cyTop + 5.6} r={2.3} fill={ILLO.seam} />
      {/* PE: large, 10.6mm below centreline, centred */}
      <Pin cx={cx} cy={cyTop + 10.6} r={4.2} fill={ILLO.seam} />

      {/* the two DC pins — the reason the whole thing is this big */}
      <Pin cx={cx - 13} cy={h - 20} r={8.4} fill={ILLO.live} label="DC+" labelY={81} />
      <Pin cx={cx + 13} cy={h - 20} r={8.4} fill={ILLO.live} label="DC−" labelY={81} />
    </svg>
  );
}

const PORTS = {
  nacs: {
    label: "NACS",
    full: "North American Charging Standard",
    also: "Tesla connector · SAE J3400",
    body: "Five pins: three small ones for ground and signalling across the top, and two large ones below that carry AC at home and DC here. Re-using the same two pins for both jobs is what keeps the connector — and the port on your car — this small.",
    Svg: NacsSvg,
    // viewBox height 58 units against CCS1's 88 — so at a shared baseline the
    // on-screen ratio is the real one.
    height: (64 / 94) * 220,
  },
  ccs: {
    label: "CCS1",
    full: "Combined Charging System",
    also: "SAE J1772 Combo",
    body: "A complete J1772 AC connector — five pins, 43mm across — with two more added underneath for DC. That is what the word Combined means, and why it is so much bigger. It has been the non-Tesla standard here for a decade.",
    Svg: Ccs1Svg,
    height: 220,
  },
} as const;

type PortId = keyof typeof PORTS;

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
          A schematic drawn to relative scale: pin count, size and position
          follow the published standards, with the J1772 face at 43mm and its
          pins placed from the specification&rsquo;s own offsets. It is not a
          dimensioned engineering drawing. Orange marks the pins carrying DC
          here — two on NACS, two more bolted below a whole AC connector on
          CCS1. The hollow L1 and N/L2 wells are drawn empty because a DC cable
          does not populate them, and every HubCharge station carries both
          cables, so this is only ever a question of which one you pick up.
        </>
      }
    >
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {(Object.keys(PORTS) as PortId[]).map((id) => {
          const p = PORTS[id];
          const on = active === id;
          const Svg = p.Svg;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              aria-pressed={on}
              className={`text-left rounded-lg p-4 -m-4 transition-colors ${
                on ? "bg-paper-100" : "hover:bg-paper-100/60"
              } group`}
            >
              {/* shared baseline — the scale comparison is the whole point */}
              <div className="flex items-end justify-center h-56 mb-5">
                <div style={{ height: p.height }} className="[&>svg]:h-full [&>svg]:w-auto">
                  <Svg />
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
