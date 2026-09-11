"use client";

import { useState } from "react";

/**
 * DIRECTION B — Soft / dimensional.
 *
 * The reference language is a studio product photograph: one key light, a
 * long falloff, and a subject that is lit rather than coloured in. Every rule
 * here is about light.
 *
 *   ground        warm graphite falling to plum, never neutral black
 *   light         cool cyan-white, because a screen is the light source
 *   charge        warm amber, so the two lights are opposed in temperature
 *   depth         gradient + volumetric shaft + contact occlusion
 *   bold move     the light shaft itself, thrown across the floor
 *
 * The two-temperature light is the point. A single accent on near-black is
 * the cliché; a cool key against a warm secondary is what a photographer
 * would actually do, and it gives the frame a hot side and a cold side.
 *
 * At 31px the shaft and the falloff collapse, and what is left is the
 * charger's silhouette against a lighter floor — which still reads.
 */

const PLUM_HI = "#2E2233";
const PLUM_LO = "#150F1C";
const CYAN = "#CFEEFF";
const AMBER = "#FFC46B";
const METAL = "#4A4356";

export function DirectionB({ id = "b" }: { id?: string }) {
  const [charging, setCharging] = useState(false);
  const soc = charging ? 80 : 22;

  return (
    <svg
      viewBox="0 0 300 200"
      className="h-full w-full"
      role="img"
      aria-label="A public fast charger lit by its own screen, throwing light across the floor toward a car."
      onPointerEnter={() => setCharging(true)}
      onPointerLeave={() => setCharging(false)}
      onPointerDown={() => setCharging((v) => !v)}
      style={{ cursor: "pointer", touchAction: "manipulation" }}
    >
      <defs>
        <radialGradient id={`${id}-room`} cx="62%" cy="34%" r="82%">
          <stop offset="0%" stopColor={PLUM_HI} />
          <stop offset="100%" stopColor={PLUM_LO} />
        </radialGradient>
        {/* The shaft. Bright at the emitter, gone by the far wall — the
            falloff is what makes it read as light rather than as a shape. */}
        <linearGradient id={`${id}-shaft`} x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor={CYAN} stopOpacity={0.34} />
          <stop offset="55%" stopColor={CYAN} stopOpacity={0.09} />
          <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-front`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6A6178" />
          <stop offset="60%" stopColor={METAL} />
          <stop offset="100%" stopColor="#2C2736" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3A3446" />
          <stop offset="100%" stopColor="#221D2C" />
        </linearGradient>
        <linearGradient id={`${id}-top`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C7289" />
          <stop offset="100%" stopColor="#4A4356" />
        </linearGradient>
        <linearGradient id={`${id}-screen`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0E1A24" />
          <stop offset="100%" stopColor="#050A10" />
        </linearGradient>
        <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={CYAN} stopOpacity={0.5} />
          <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-warm`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={AMBER} stopOpacity={0.42} />
          <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
        </radialGradient>
        {/* Occlusion: the dark that gathers where an object meets a floor.
            Its absence is the single biggest tell of flat vector art. */}
        <radialGradient id={`${id}-occ`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity={0.62} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-floor`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#241C2C" />
          <stop offset="100%" stopColor="#0E0A14" />
        </linearGradient>
      </defs>

      <rect width={300} height={200} fill={`url(#${id}-room)`} />
      <rect y={132} width={300} height={68} fill={`url(#${id}-floor)`} />

      {/* THE BOLD MOVE: a shaft of the charger's own screen light thrown
          across the floor. Everything else in the frame is quiet. */}
      <path
        d="M92 74 L300 108 L300 176 L92 116 Z"
        fill={`url(#${id}-shaft)`}
        style={{
          opacity: charging ? 1 : 0.55,
          transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* the wallbox, far back and dim — home is the quiet option here */}
      <g opacity={0.4}>
        <rect x={28} y={86} width={20} height={28} rx={3} fill="#3A3446" />
        <rect x={33} y={92} width={10} height={9} rx={2} fill="#171320" />
        <path d="M38 114 C38 126 46 130 52 136" fill="none" stroke="#2E2838" strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={40} cy={139} rx={16} ry={4} fill={`url(#${id}-occ)`} />
      </g>

      {/* ── the public unit, 3/4, shaded ─────────────────────────── */}
      <ellipse cx={92} cy={146} rx={44} ry={11} fill={`url(#${id}-occ)`} />
      {/* top plane */}
      <path d="M62 62 L78 50 L118 50 L102 62 Z" fill={`url(#${id}-top)`} />
      {/* front plane */}
      <path d="M62 62 L102 62 L102 146 L62 146 Z" fill={`url(#${id}-front)`} />
      {/* receding side */}
      <path d="M102 62 L118 50 L118 134 L102 146 Z" fill={`url(#${id}-side)`} />
      {/* the arris catching the key light — one bright edge is worth more
          than any amount of fill detail */}
      <path d="M62 62 L102 62 L118 50" fill="none" stroke={CYAN} strokeWidth={1} strokeOpacity={0.34} />
      <path d="M102 62 L102 146" stroke={CYAN} strokeWidth={0.8} strokeOpacity={0.16} />

      {/* the screen — the light source in this scene */}
      <rect x={70} y={70} width={24} height={30} rx={2.5} fill={`url(#${id}-screen)`} />
      <ellipse cx={82} cy={85} rx={40} ry={34} fill={`url(#${id}-bloom)`} style={{ pointerEvents: "none" }} />
      {/* state of charge, climbing on interaction */}
      <rect x={74} y={92} width={16} height={3} rx={1.5} fill="#FFFFFF" opacity={0.14} />
      <rect
        x={74}
        y={92}
        width={(16 * soc) / 100}
        height={3}
        rx={1.5}
        fill={AMBER}
        style={{ transition: "width 900ms cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x={82} y={86} fill={CYAN} fontSize={9} fontWeight={600} textAnchor="middle"
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
            style={{ fontVariantNumeric: "tabular-nums" }}>
        {soc}%
      </text>

      {/* the holster and the heavy liquid-cooled lead — the thing that most
          separates a DC unit from a wallbox is the size of its cable */}
      <circle cx={82} cy={116} r={9} fill="#151019" />
      <circle cx={82} cy={116} r={5.4} fill={METAL} opacity={0.7} />
      <path
        d="M90 120 C118 134 146 134 166 126"
        fill="none"
        stroke="#161119"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d="M90 120 C118 134 146 134 166 126"
        fill="none"
        stroke="#332C3E"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M90 120 C118 134 146 134 166 126"
        fill="none"
        stroke={AMBER}
        strokeWidth={1.4}
        strokeOpacity={charging ? 0.85 : 0}
        strokeLinecap="round"
        style={{ transition: "stroke-opacity 500ms ease" }}
      />

      {/* The car, three-quarter, taking the key light along its near flank.
          Rebuilt: a defined fascia plane, a fast screen and a hard shoulder,
          because the rounded mass it replaced read as a toy under this much
          light — the softer the rendering, the more the silhouette has to
          carry. */}
      <ellipse cx={216} cy={152} rx={62} ry={11} fill={`url(#${id}-occ)`} />
      <path
        d="M164 150
           L164 128 L169 116
           L184 112
           L198 96 C201 92 205 90 210 90
           L240 90 C246 90 250 92 252 97
           L261 116
           L269 121 C273 124 275 129 275 134
           L275 150 Z"
        fill={`url(#${id}-front)`}
      />
      {/* the fascia plane — this is what makes it read as three-quarter */}
      <path d="M164 128 L169 116 L178 114 L173 127 L173 150 L164 150 Z" fill="#241E2E" />
      {/* glass, dark and slightly cooler than the body */}
      <path d="M191 113 L201 97 C202 95 205 94 208 94 L238 94 C243 94 245 96 246 99 L254 113 Z" fill="#141B27" />
      <path d="M191 113 L254 113" stroke={CYAN} strokeWidth={0.7} strokeOpacity={0.2} />
      {/* the shoulder, catching the key */}
      <path d="M172 118 C196 114 240 113 268 120" fill="none" stroke={CYAN} strokeWidth={1.1} strokeOpacity={0.34} />
      {/* the charge port, warm against all that cool light */}
      <ellipse cx={176} cy={124} rx={13} ry={11} fill={`url(#${id}-warm)`}
               style={{ opacity: charging ? 1 : 0.18, transition: "opacity 600ms ease" }} />
      <circle cx={190} cy={150} r={13} fill="#0E0A14" />
      <circle cx={262} cy={150} r={13} fill="#0E0A14" />
      <circle cx={190} cy={150} r={6.2} fill="#332C40" />
      <circle cx={262} cy={150} r={6.2} fill="#332C40" />
      <path d="M184 140 A 13 13 0 0 1 196 140" fill="none" stroke={CYAN} strokeWidth={0.9} strokeOpacity={0.22} />

      <text x={28} y={182} fill="#8E839C" fontSize={9.5} fontWeight={500}
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif">
        Home overnight.
      </text>
      <text x={112} y={182} fill={CYAN} fontSize={9.5} fontWeight={600}
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif">
        Here when you can&#39;t.
      </text>
    </svg>
  );
}
