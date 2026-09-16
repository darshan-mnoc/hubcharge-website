"use client";

import { useState } from "react";
import { ILLO } from "@/lib/illustration";

/**
 * DIRECTION C — Refined, inside the current palette.
 *
 * The honest control. Navy plate, orange for power, green for available —
 * every existing colour rule kept. The only things that change are the ones
 * the brief asked for: the angle, the depth, and where the life is.
 *
 * The bold move is COMPOSITION rather than colour: one very long raking
 * shadow thrown across the whole frame by a low sun. It costs no new hue and
 * it is the single strongest depth cue available at this size — a long shadow
 * says "there is a floor, and there is a light, and this object is standing
 * between them" in a way no gradient does.
 *
 * The second change is that the drawing is now lit from a low angle rather
 * than a flat one, so the near arris of every object carries a rim. That is
 * what the existing covers are missing: they have a light DIRECTION but no
 * light ANGLE, so nothing has a bright edge.
 *
 * Kept: everything in lib/illustration.ts, contrast ratios included.
 */

export function DirectionC({ id = "c" }: { id?: string }) {
  const [live, setLive] = useState(false);

  return (
    <svg
      viewBox="0 0 300 200"
      className="h-full w-full"
      role="img"
      aria-label="A home wallbox and a public fast charger seen at three-quarters, throwing long shadows across a bay."
      onPointerEnter={() => setLive(true)}
      onPointerLeave={() => setLive(false)}
      onPointerDown={() => setLive((v) => !v)}
      style={{ cursor: "pointer", touchAction: "manipulation" }}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="10%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#16283F" />
          <stop offset="55%" stopColor={ILLO.stage} />
          <stop offset="100%" stopColor="#061020" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2F34" />
          <stop offset="100%" stopColor="#0A0E13" />
        </linearGradient>
        {/* The raking light itself — low and from the left, which is what
            makes the shadows long. */}
        <linearGradient id={`${id}-rake`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity={0.62} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`${id}-cab`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ILLO.cabTop} />
          <stop offset="58%" stopColor={ILLO.cabMid} />
          <stop offset="100%" stopColor={ILLO.cabLow} />
        </linearGradient>
        <linearGradient id={`${id}-cabside`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ILLO.cabShade} />
          <stop offset="100%" stopColor="#33302A" />
        </linearGradient>
        <linearGradient id={`${id}-car`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.carTop} />
          <stop offset="52%" stopColor={ILLO.carMid} />
          <stop offset="100%" stopColor={ILLO.carLow} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.live} stopOpacity={0.4} />
          <stop offset="100%" stopColor={ILLO.live} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${id}-free`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.ok} stopOpacity={0.32} />
          <stop offset="100%" stopColor={ILLO.ok} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={300} height={200} fill={`url(#${id}-sky)`} />
      <rect y={132} width={300} height={68} fill={`url(#${id}-floor)`} />
      <path d="M0 132 H300" stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.3} />

      {/* THE BOLD MOVE — long raking shadows, thrown right across the frame
          by a sun low on the left. Nothing else here is dramatic. */}
      <g fill={`url(#${id}-rake)`}>
        {/* the wallbox's */}
        <path d="M64 128 L150 152 L142 156 L58 132 Z" opacity={0.7} />
        {/* the unit's — the long one */}
        <path d="M146 146 L300 190 L300 200 L138 154 Z" opacity={0.85} />
        {/* the car's */}
        <path d="M206 158 L300 178 L300 192 L200 166 Z" opacity={0.55} />
      </g>

      {/* ── the home wallbox, 3/4, small and matter-of-fact ───────── */}
      <g>
        <path d="M40 84 L52 77 L76 77 L64 84 Z" fill={ILLO.bodyLight} opacity={0.65} />
        <path d="M40 84 L64 84 L64 128 L40 128 Z" fill={`url(#${id}-cab)`} opacity={0.55} />
        <path d="M64 84 L76 77 L76 121 L64 128 Z" fill={`url(#${id}-cabside)`} opacity={0.55} />
        <rect x={46} y={92} width={12} height={10} rx={2} fill={ILLO.glass} />
        {/* a domestic lead: thin, and coiled on its hook, because that is
            what a wallbox cable actually does */}
        <path d="M56 110 C56 122 68 124 74 132" fill="none" stroke={ILLO.shadow} strokeWidth={3.4} strokeLinecap="round" />
        <path d="M56 110 C56 122 68 124 74 132" fill="none" stroke={ILLO.body} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={76} cy={133} rx={7} ry={2.2} fill="none" stroke={ILLO.seam} strokeWidth={1.4} strokeOpacity={0.7} />
      </g>
      <text x={52} y={148} fill={ILLO.hub} fontSize={8} fontWeight={600} textAnchor="middle"
            letterSpacing="0.6"
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif">
        Home
      </text>

      {/* ── the public unit, 3/4, the hero ───────────────────────── */}
      <path d="M116 60 L132 50 L166 50 L150 60 Z" fill={ILLO.cabTop} opacity={0.9} />
      <path d="M116 60 L150 60 L150 146 L116 146 Z" fill={`url(#${id}-cab)`} />
      <path d="M150 60 L166 50 L166 136 L150 146 Z" fill={`url(#${id}-cabside)`} />
      {/* the rim the low sun puts on every near edge — the thing the flat
          covers never had */}
      <path d="M116 60 L132 50 L166 50" fill="none" stroke={ILLO.cabTop} strokeWidth={1.2} strokeOpacity={0.9} />
      <path d="M116 60 L116 146" stroke="#D8CDB4" strokeWidth={1} strokeOpacity={0.5} />

      <rect x={122} y={70} width={22} height={30} rx={2} fill={ILLO.glass} stroke={ILLO.edge} strokeWidth={0.8} strokeOpacity={0.6} />
      {/* the status blade: green when free, orange the moment power moves.
          The palette rule, honoured exactly. */}
      <rect
        x={122}
        y={106}
        width={22}
        height={4}
        rx={2}
        fill={live ? ILLO.live : ILLO.ok}
        style={{ transition: "fill 420ms cubic-bezier(0.16,1,0.3,1)" }}
      />
      <ellipse cx={133} cy={108} rx={26} ry={18}
               fill={live ? `url(#${id}-glow)` : `url(#${id}-free)`}
               style={{ pointerEvents: "none" }} />
      {/* holster and the heavy DC lead, sagging under its own weight */}
      <circle cx={133} cy={120} r={8} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1} />
      <path d="M141 124 C164 140 186 138 200 132" fill="none" stroke={ILLO.shadow} strokeWidth={6} strokeLinecap="round" />
      <path d="M141 124 C164 140 186 138 200 132" fill="none" stroke={ILLO.body} strokeWidth={3.6} strokeLinecap="round" />
      <path
        d="M141 124 C164 140 186 138 200 132"
        fill="none"
        stroke={ILLO.live}
        strokeWidth={1.4}
        strokeOpacity={live ? 0.9 : 0}
        strokeLinecap="round"
        style={{ transition: "stroke-opacity 420ms ease" }}
      />
      <text x={141} y={162} fill={live ? ILLO.live : ILLO.ok} fontSize={8} fontWeight={600} textAnchor="middle"
            letterSpacing="0.6"
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
            style={{ transition: "fill 420ms ease" }}>
        {live ? "Charging" : "Public"}
      </text>

      {/* The car, three-quarter, taking the rake along its near side.
          Pulled fully inside the frame — it used to run off the right edge,
          which read as a crop rather than as a composition — and given a
          real fascia plane so it is three-quarter rather than a side
          elevation with rounded corners. */}
      <ellipse cx={244} cy={158} rx={56} ry={9} fill="#000" opacity={0.4} />
      <path
        d="M198 156
           L198 134 L203 122
           L217 118
           L230 103 C233 99 237 97 242 97
           L268 97 C274 97 277 99 279 104
           L287 122
           L294 127 C297 129 299 133 299 138
           L299 156 Z"
        fill={`url(#${id}-car)`}
      />
      <path d="M198 134 L203 122 L212 120 L207 133 L207 156 L198 156 Z" fill={ILLO.carRocker} />
      <path d="M224 119 L233 104 C234 102 236 101 239 101 L266 101 C270 101 272 103 273 106 L280 119 Z" fill={ILLO.glassMid} opacity={0.9} />
      {/* the shoulder, with the low sun on it */}
      <path d="M206 124 C230 120 272 119 296 126" fill="none" stroke="#D6DEE9" strokeWidth={1} strokeOpacity={0.4} />
      <circle cx={222} cy={156} r={12.5} fill={ILLO.tyre} />
      <circle cx={286} cy={156} r={12.5} fill={ILLO.tyre} />
      <circle cx={222} cy={156} r={5.8} fill={ILLO.rim} />
      <circle cx={286} cy={156} r={5.8} fill={ILLO.rim} />
      {/* the charge port, lit only while power is moving */}
      <circle cx={210} cy={130} r={2.6} fill={ILLO.live} opacity={live ? 1 : 0.3}
              style={{ transition: "opacity 420ms ease" }} />

      <text x={18} y={186} fill={ILLO.hub} fontSize={9} fontWeight={600}
            fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif">
        If you can charge at home, do.
      </text>
    </svg>
  );
}
