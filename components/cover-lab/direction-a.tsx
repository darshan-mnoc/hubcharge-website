"use client";

import { useState } from "react";

/**
 * DIRECTION A — Bold / graphic.
 *
 * The reference language is a two-ink screen print: a transit poster, or a
 * risograph gig poster. Its rules are the opposite of the current covers'.
 *
 *   ground        bone paper, not a navy plate
 *   inks          exactly two, and their overprint is a third colour
 *   depth         a hard offset shadow, no blur anywhere
 *   scale         one object cropped by the frame
 *   type          heavy grotesk in sentence case, not tracked-out caps
 *
 * The overprint is the thing that makes it read as printed rather than as
 * vector: where the vermillion crosses the ultramarine, multiply blending
 * produces a plum neither ink contains, exactly as wet ink does on paper.
 *
 * 3/4 here is carried by SHAPE, not by shading — the box is drawn as three
 * flat planes and you read the volume from their silhouette alone. That is
 * why it survives being 31px wide: there is no gradient to lose.
 *
 * Motion is entirely on interaction. A poster does not move on its own; it
 * moves when you touch it.
 */

const BONE = "#F2EDE3";
const BLUE = "#2B3A9C";
const RED = "#FF4B1F";

export function DirectionA({ id = "a" }: { id?: string }) {
  const [plugged, setPlugged] = useState(false);

  return (
    <svg
      viewBox="0 0 300 200"
      className="h-full w-full"
      role="img"
      aria-label="A home wallbox beside a public fast charger, printed as a two-colour poster."
      onPointerEnter={() => setPlugged(true)}
      onPointerLeave={() => setPlugged(false)}
      onPointerDown={() => setPlugged((v) => !v)}
      style={{ cursor: "pointer", touchAction: "manipulation" }}
    >
      <defs>
        {/* Paper. Not flat white — a screen print sits on stock that has a
            colour of its own, and that warmth is most of why this does not
            read as a UI. */}
        <linearGradient id={`${id}-paper`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F6F2EA" />
          <stop offset="100%" stopColor="#EDE6D9" />
        </linearGradient>
        {/* Registration is never perfect on a two-colour press, and the tiny
            misfit is the tell. This shifts the red plate half a unit. */}
        <filter id={`${id}-grain`} x="0" y="0" width="60" height="60" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={11} stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
        </filter>
        <pattern id={`${id}-tooth`} x="0" y="0" width={60} height={60} patternUnits="userSpaceOnUse">
          <rect width={60} height={60} filter={`url(#${id}-grain)`} />
        </pattern>
      </defs>

      <rect width={300} height={200} fill={`url(#${id}-paper)`} />

      {/* ── BLUE PLATE ──────────────────────────────────────────────
          The public unit, cropped hard by the top edge. Nothing else on
          this cover is allowed to be this big; that is the whole idea. */}
      <g fill={BLUE}>
        {/* hard offset shadow — a print has no soft light */}
        <g opacity={0.16} transform="translate(5 6)">
          <path d="M176 -20 L246 -20 L246 158 L176 158 Z" />
          <path d="M246 -20 L272 -34 L272 140 L246 158 Z" />
        </g>

        {/* front plane */}
        <path d="M176 -20 L246 -20 L246 158 L176 158 Z" />
        {/* right plane, receding — the 3/4 read, with no shading at all */}
        <path d="M246 -20 L272 -34 L272 140 L246 158 Z" opacity={0.72} />
      </g>

      {/* screen well, knocked out of the blue */}
      <rect x={188} y={16} width={46} height={40} fill={BONE} />
      {/* status bar: fills on interaction. A charger's screen is the one
          part of it that is ever a different colour. */}
      <rect x={194} y={44} width={34} height={5} fill={BLUE} opacity={0.22} />
      <rect
        x={194}
        y={44}
        width={plugged ? 34 : 8}
        height={5}
        fill={RED}
        style={{ transition: "width 620ms cubic-bezier(0.16,1,0.3,1)" }}
      />
      {/* The coupler, drawn as the real CCS1 face — two large DC pins beneath
          the J1772 ring — and it actually leaves its holster.

          The lead is drawn as one path whose length is fixed, so the cable
          pays out of the unit rather than stretching: the same cable, moved,
          which is what a heavy DC lead does. Both ends are on hardware at
          both extremes, never in mid-air. */}
      <path
        d={plugged ? "M198 100 C182 122 168 132 152 136" : "M198 100 C196 116 200 124 206 130"}
        fill="none"
        stroke={BLUE}
        strokeWidth={5}
        strokeLinecap="round"
        style={{ transition: "d 620ms cubic-bezier(0.34,1.4,0.5,1)" }}
      />
      <g
        style={{
          transform: plugged ? "translate(-59px, 50px)" : "translate(0px, 0px)",
          transition: "transform 620ms cubic-bezier(0.34,1.4,0.5,1)",
        }}
      >
        <circle cx={211} cy={86} r={17} fill={BONE} />
        <g fill={BLUE}>
          <circle cx={204} cy={80} r={3.4} />
          <circle cx={218} cy={80} r={3.4} />
          <circle cx={205} cy={93} r={5.4} />
          <circle cx={217} cy={93} r={5.4} />
        </g>
      </g>

      {/* ── RED PLATE ───────────────────────────────────────────────
          Overprinted, so every crossing with the blue makes a third colour
          the palette never declared. */}
      <g style={{ mixBlendMode: "multiply" }} fill={RED}>
        {/* the house, as a solid mass — not an outline. The current cover
            draws a wireframe pentagon; a poster has no wireframes. */}
        <path d="M18 96 L60 70 L102 96 L102 158 L18 158 Z" />
        {/* the wallbox on its wall, and its thin domestic lead */}
      </g>
      <rect x={92} y={106} width={16} height={22} fill={BLUE} />
      <rect x={96} y={111} width={8} height={7} fill={BONE} />
      <path
        d="M100 128 C100 140 112 142 118 150"
        fill="none"
        stroke={BLUE}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* the domestic plug on the end of it, blunt and small */}
      <rect x={115} y={147} width={9} height={7} rx={1} fill={BLUE} />

      {/* The car, flat, three-quarter from the front. A poster car is a
          SILHOUETTE — the shape does all the work, so the angles have to be
          decisive: a real front fascia plane, a hard shoulder, and a fast
          screen. The rounded blob it replaced read as a toy. */}
      <g style={{ mixBlendMode: "multiply" }} fill={RED}>
        <path
          d="M106 158
             L106 136 L110 124
             L124 121
             L136 106 C138 103 141 101 145 101
             L169 101 C174 101 177 103 179 107
             L187 124
             L194 128 C197 130 198 134 198 138
             L198 158 Z"
        />
      </g>
      {/* the front fascia — the plane that makes it three-quarter and not a
          side elevation */}
      <path d="M106 136 L110 124 L118 122 L114 135 L114 158 L106 158 Z" fill={BLUE} opacity={0.34} />
      {/* glass, knocked back out of the ink */}
      <path d="M129 119 L139 106 C140 104 142 103 145 103 L167 103 C171 103 173 105 174 108 L180 119 Z" fill={BONE} opacity={0.94} />
      {/* one hard crease along the shoulder */}
      <path d="M116 124 L192 127" stroke={BONE} strokeWidth={1.6} strokeOpacity={0.5} />
      {/* wheels, as hard circles */}
      <circle cx={131} cy={158} r={12} fill={BLUE} />
      <circle cx={186} cy={158} r={12} fill={BLUE} />
      <circle cx={131} cy={158} r={4.6} fill={BONE} />
      <circle cx={186} cy={158} r={4.6} fill={BONE} />

      {/* the horizon, as a printed rule rather than a rendered floor */}
      <rect x={0} y={158} width={300} height={3} fill={BLUE} />

      {/* Type: one heavy line in sentence case. The current covers set
          everything in tracked-out capitals; this deliberately does not. */}
      <text
        x={18}
        y={185}
        fill={BLUE}
        fontSize={17}
        fontWeight={800}
        letterSpacing="-0.5"
        fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
      >
        Charge at home.
      </text>
      <text
        x={161}
        y={185}
        fill={RED}
        fontSize={17}
        fontWeight={800}
        letterSpacing="-0.5"
        fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
      >
        Top up here.
      </text>

      {/* the tooth of the paper, over everything, very faint */}
      <rect width={300} height={200} fill={`url(#${id}-tooth)`} opacity={0.06} style={{ pointerEvents: "none" }} />
    </svg>
  );
}
