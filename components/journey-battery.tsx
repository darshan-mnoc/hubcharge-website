"use client";

import { useEffect, useId, useRef, useState, useCallback, memo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ILLO, CABLE_CASING } from "@/lib/illustration";

/**
 * HUBCHARGE JOURNEY - Premium UX Redesign
 */

const journeySteps = [
  { id: 1, title: "Arrive", subtitle: "Pick a charger spot" },
  { id: 2, title: "Easy payment", subtitle: "Stay in your car" },
  { id: 3, title: "Charge", subtitle: "We plug you in" },
  { id: 4, title: "Add time or services", subtitle: "Extend or order food" },
  { id: 5, title: "Finish", subtitle: "We unplug • You're done" },
];

// ============================================
// SVG COMPONENTS — visually refined
// ============================================

function CarSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  // Unique, SSR-stable ID for gradients (multiple SVG instances on the page)
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");

  return (
    <svg viewBox="0 0 200 70" className={className} style={style}>
      <defs>
        {/* Body: three stops so the flank reads rounded rather than flat. */}
        <linearGradient id={`carBody-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.carTop} />
          <stop offset="45%" stopColor={ILLO.carMid} />
          <stop offset="100%" stopColor={ILLO.carLow} />
        </linearGradient>

        {/* Greenhouse: darker at the base, as glass reads against a body. */}
        <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.glassTop} stopOpacity="0.45" />
          <stop offset="60%" stopColor={ILLO.glassMid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ILLO.glassLow} stopOpacity="0.7" />
        </linearGradient>

        {/* Ground reflection under the car. */}
        <linearGradient id={`reflect-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.carTop} stopOpacity="0.30" />
          <stop offset="100%" stopColor={ILLO.carTop} stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`contact-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.shadow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={ILLO.shadow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Contact shadow, offset right — one light source, upper-left. */}
      <ellipse cx="104" cy="63.5" rx="78" ry="5" fill={`url(#contact-${id})`} />

      {/* Reflection: a squashed mirror of the body, fading down. */}
      <g transform="translate(0,127) scale(1,-0.34)" opacity="0.5">
        <path
          d="M18 47 C24 35 41 29 57 29 L133 29 C151 29 168 35 178 47
             L182 51 C184 55 181 57 171 57 L29 57 C19 57 16 54 18 51Z"
          fill={`url(#reflect-${id})`}
        />
      </g>

      {/* Lower body / rocker — darkest plane, grounds the car. */}
      <path
        d="M22 52 L178 52 L180 55 C181 57 178 58 169 58 L31 58 C21 58 19 56 20 54Z"
        fill={ILLO.carRocker}
      />

      {/* Main body. Longer dash-to-axle, faster rear taper — a modern
          crossover profile rather than the symmetric bubble this had. */}
      <path
        d="M18 47
           C24 35 41 29 57 29
           L133 29
           C151 29 168 35 178 47
           L182 51
           C184 55 181 57 171 57
           L29 57
           C19 57 16 54 18 51Z"
        fill={`url(#carBody-${id})`}
      />

      {/* Beltline highlight — the single strongest depth cue at this size. */}
      <path
        d="M20 46 C26 35 42 30 57 30 L133 30 C151 30 167 35 177 46"
        stroke="rgba(255,255,255,0.34)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* Roof: raked screen, long roofline, fastback rear. */}
      <path
        d="M58 29 C69 15 92 12 108 12 C124 12 132 19 136 29 Z"
        fill={`url(#carBody-${id})`}
      />
      <path
        d="M58 29 C69 15 92 12 108 12 C124 12 132 19 136 29"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* Glass, inset from the roof so a pillar reads on each side. */}
      <path
        d="M64 28.5 C73 17 92 14.5 107 14.5 C121 14.5 128 20.5 131.5 28.5 Z"
        fill={`url(#glass-${id})`}
      />
      {/* B-pillar */}
      <path d="M99 14.6 L102 14.7 L102 28.5 L99 28.5 Z" fill={ILLO.glassLow} opacity="0.85" />

      {/* Wheel arches, drawn as arches rather than full rings. */}
      {[60, 141].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - 13} 55 A13 13 0 0 1 ${cx + 13} 55`}
            fill="none"
            stroke={ILLO.carRocker}
            strokeWidth="3.2"
          />
          <circle cx={cx} cy={53.5} r="9.6" fill={ILLO.tyre} />
          <circle
            cx={cx}
            cy={53.5}
            r="9.6"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.9"
          />
          {/* Rim face */}
          <circle cx={cx} cy={53.5} r="6" fill={ILLO.rim} />
          <g stroke="rgba(203,213,225,0.55)" strokeWidth="0.85" strokeLinecap="round">
            <line x1={cx} y1={48} x2={cx} y2={59} />
            <line x1={cx - 5.5} y1={53.5} x2={cx + 5.5} y2={53.5} />
            <line x1={cx - 3.9} y1={49.6} x2={cx + 3.9} y2={57.4} />
            <line x1={cx - 3.9} y1={57.4} x2={cx + 3.9} y2={49.6} />
          </g>
          <circle cx={cx} cy={53.5} r="1.5" fill={ILLO.hub} />
        </g>
      ))}

      {/* Lights: presence, not glow. */}
      <path d="M16 44 L23 43.4 L23 46.6 L16 46.4 Z" fill="rgba(255,255,255,0.72)" />
      <path d="M177 43.6 L183 44.4 L183 46.8 L177 46.6 Z" fill="rgba(255,255,255,0.5)" />

      {/* Charge port — a point of light */}
      <circle cx="158" cy="37" r="2" fill={ILLO.live} opacity="0.95" />
    </svg>
  );
}

/**
 * The attendant.
 *
 * The first version drew a featureless grey disc for a head, with a comment
 * defending it as "a pictogram". At the size this renders it just looked like
 * a person with no face, which is unsettling rather than neutral — and the
 * whole proposition here is that a human being handles your cable. Hiding
 * their face undercut the one thing the illustration exists to say.
 *
 * So: brow, eyes, nose and mouth, drawn at weights that survive being scaled
 * to ~40px wide. The viewBox is taller than before so the head has room.
 *
 * Sleeves are uniform-coloured in every variant. Previously they flipped to
 * orange in two of the three, which broke the scene's one colour rule — that
 * orange means energy — by putting it on a person's arms.
 */
function ValetSVG({
  className = "",
  style = {},
  holding = "terminal",
}: {
  className?: string;
  style?: React.CSSProperties;
  holding?: "terminal" | "food" | "cable";
}) {
  return (
    <svg viewBox="0 0 60 104" className={className} style={style}>
      <ellipse cx="30" cy="100" rx="11" ry="2.2" fill={ILLO.shadow} opacity="0.28" />

      {/* Legs */}
      <rect x="22" y="64" width="7" height="34" rx="3.5" fill={ILLO.garment} />
      <rect x="31" y="64" width="7" height="34" rx="3.5" fill={ILLO.garment} />
      <rect x="21.5" y="95" width="8" height="4" rx="1.6" fill={ILLO.shadow} />
      <rect x="30.5" y="95" width="8" height="4" rx="1.6" fill={ILLO.shadow} />

      {/* Torso. One orange element on the whole figure — the chest stripe —
          so the accent stays legible as "this is HubCharge staff". */}
      <path d="M17,36 Q17,29 30,29 Q43,29 43,36 L45,64 L15,64 Z" fill={ILLO.uniform} />
      <path d="M30,29 L30,64 L45,64 L43,36 Q43,29 30,29 Z" fill={ILLO.uniformShade} opacity="0.45" />
      <rect x="26.5" y="32" width="7" height="2" rx="1" fill={ILLO.live} />
      <rect x="24" y="38" width="7" height="8" rx="1.5" fill={ILLO.stage} opacity="0.1" />

      {/* Shoulder seams — the value break needs an edge to sit against */}
      <path d="M17.5,38 Q22,35.5 24,40" fill="none" stroke={ILLO.uniformShade} strokeWidth="0.8" opacity="0.8" />
      <path d="M42.5,38 Q38,35.5 36,40" fill="none" stroke={ILLO.uniformShade} strokeWidth="0.8" opacity="0.8" />

      {/* Collar */}
      <path d="M25.5,29.5 L30,35 L34.5,29.5" fill="none" stroke={ILLO.uniformShade} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />

      {/* Arms and held item */}
      {holding === "terminal" ? (
        <>
          <path d="M17.5,38 Q13,44 16,53 L21,56 L24,52 Q20,45 22,40 Z" fill={ILLO.uniformShade} />
          <path d="M42.5,38 Q47,44 44,53 L39,56 L36,52 Q40,45 38,40 Z" fill={ILLO.uniformShade} />
          <circle cx="21" cy="57" r="2.9" fill={ILLO.skin} />
          <circle cx="39" cy="57" r="2.9" fill={ILLO.skin} />
          {/* Payment terminal */}
          <rect x="20" y="52" width="17" height="12" rx="2.4" fill={ILLO.bodyLight} />
          <rect x="21.5" y="53.5" width="14" height="9" rx="1.6" fill={ILLO.recess} />
          <rect x="23" y="55.5" width="8" height="1.4" rx="0.7" fill={ILLO.live} opacity="0.9" />
          <rect x="23" y="58.5" width="5.5" height="1.2" rx="0.6" fill={ILLO.seam} opacity="0.7" />
        </>
      ) : holding === "cable" ? (
        <>
          {/* Left arm tucked, right arm extended with the connector */}
          <path d="M17.5,38 Q13,45 15,54 L19,56 L22,52 Q19,46 22,40 Z" fill={ILLO.uniformShade} />
          <path d="M42.5,38 Q48,42 51,50 L48,54 L44,51 Q42,45 38,41 Z" fill={ILLO.uniformShade} />
          <circle cx="19.5" cy="57" r="2.9" fill={ILLO.skin} />
          <circle cx="47.5" cy="54.5" r="2.9" fill={ILLO.skin} />
          {/* Connector in hand — live, because it is about to deliver power */}
          <rect x="44" y="50" width="12" height="8.5" rx="2.6" fill={ILLO.bodyDark} />
          <rect x="45.8" y="52" width="8.4" height="5" rx="1.8" fill={ILLO.live} />
          <circle cx="50" cy="54.5" r="1.5" fill={ILLO.liveGlow} />
        </>
      ) : (
        <>
          <path d="M17.5,38 Q13,45 16,54 L20,57 L23,53 Q20,46 22,40 Z" fill={ILLO.uniformShade} />
          <path d="M42.5,38 Q47,45 44,54 L40,57 L37,53 Q40,46 38,40 Z" fill={ILLO.uniformShade} />
          <circle cx="21.5" cy="58" r="2.9" fill={ILLO.skin} />
          <circle cx="38.5" cy="58" r="2.9" fill={ILLO.skin} />
          {/* Delivery bag, carried in front of both hands */}
          <path d="M25,55 L25,51.5 Q30,48.5 35,51.5 L35,55" fill="none" stroke={ILLO.uniformShade} strokeWidth="1.8" strokeLinecap="round" />
          <rect x="22" y="55" width="16" height="13" rx="1.8" fill={ILLO.uniform} />
          <rect x="22" y="55" width="16" height="13" rx="1.8" fill="none" stroke={ILLO.uniformShade} strokeWidth="0.7" />
          <circle cx="30" cy="61.5" r="4" fill={ILLO.live} opacity="0.16" />
          <text x="30" y="64" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={ILLO.liveDim}>H</text>
        </>
      )}

      {/* Neck */}
      <rect x="26.5" y="22" width="7" height="9" rx="2.6" fill={ILLO.skinShade} />

      {/* Head. Features are the point of this rewrite — a jaw that tapers,
          a brow that sits above the eyes, and enough contrast in `feature`
          to survive downscaling. */}
      <path
        d="M19,15 Q19,4 30,4 Q41,4 41,15 Q41,22.5 36.5,26 Q33.5,28.5 30,28.5 Q26.5,28.5 23.5,26 Q19,22.5 19,15 Z"
        fill={ILLO.skin}
      />
      <path
        d="M30,4 Q41,4 41,15 Q41,22.5 36.5,26 Q33.5,28.5 30,28.5 Z"
        fill={ILLO.skinShade}
        opacity="0.32"
      />
      {/* Ears */}
      <circle cx="18.9" cy="17" r="2.1" fill={ILLO.skinShade} />
      <circle cx="41.1" cy="17" r="2.1" fill={ILLO.skinShade} />
      {/* Brows — heavy, because at this scale they carry the expression */}
      <path d="M23.2,14 Q25.8,12.5 28.4,13.8" stroke={ILLO.feature} strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M31.6,13.8 Q34.2,12.5 36.8,14" stroke={ILLO.feature} strokeWidth="1.9" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="25.6" cy="17.8" rx="2" ry="2.2" fill={ILLO.feature} />
      <ellipse cx="34.4" cy="17.8" rx="2" ry="2.2" fill={ILLO.feature} />
      <circle cx="26.3" cy="17.1" r="0.75" fill="#fff" opacity="0.9" />
      <circle cx="35.1" cy="17.1" r="0.75" fill="#fff" opacity="0.9" />
      {/* Nose + a plain, friendly mouth */}
      <path d="M30,19.4 L30,22" stroke={ILLO.skinShade} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M26.8,24.2 Q30,26.6 33.2,24.2" stroke={ILLO.feature} strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Cap */}
      <path d="M19,14 Q19,2.5 30,2.5 Q41,2.5 41,14 Z" fill={ILLO.garment} />
      <rect x="18.2" y="12.4" width="23.6" height="2.9" rx="1.45" fill={ILLO.shadow} />
      <rect x="26.8" y="5.5" width="6.4" height="2.1" rx="1" fill={ILLO.live} opacity="0.95" />
    </svg>
  );
}


/**
 * The charging pedestal.
 *
 * Two rewrites got this wrong before landing here.
 *
 * The first was colour semantics: the status light was `active ? green :
 * orange`, and because every scene passed `active` differently it read
 * orange, orange, green, green, orange across five steps — a code a reader
 * can only conclude means nothing. One rule now: dim at rest, brand orange
 * when power moves.
 *
 * The second was that the unit had no presence. Its body was #16233D on a
 * #0A192F stage — 1.12:1, barely distinguishable — so a carefully drawn
 * screen, LED strip and holster all dissolved into the background and the
 * whole thing read as a dark stick with a stripe. The body now sits in the
 * car's value range (1.6-2.3:1), which is the object it has to stand beside.
 *
 * The form follows current DC hardware rather than a 2015 pedestal: a broad
 * monolith with a soft crown, a screen that dominates the upper face, a light
 * blade under it, and a cable holster recessed into the body. At 36px wide
 * only four things survive — silhouette, screen, blade, holster — so those
 * are the only things drawn with any weight.
 *
 * The screen is stateful, which is the "smart" part: a battery at rest, a
 * filling arc while charging, a check when the session completes.
 */
function ChargerSVG({
  className = "",
  style = {},
  active = false,
  done = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  done?: boolean;
}) {
  const id = useId();
  const lit = active || done;
  return (
    <svg viewBox="0 0 48 88" className={className} style={style}>
      <defs>
        <linearGradient id={`unit-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ILLO.unitTop} />
          <stop offset="42%" stopColor={ILLO.unitMid} />
          <stop offset="100%" stopColor={ILLO.unitLow} />
        </linearGradient>
        <linearGradient id={`screen-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16233B" />
          <stop offset="100%" stopColor={ILLO.glass} />
        </linearGradient>
        <radialGradient id={`bloom-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.live} stopOpacity="0.5" />
          <stop offset="100%" stopColor={ILLO.live} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground contact */}
      <ellipse cx="24" cy="85.5" rx="16" ry="2.6" fill={ILLO.shadow} opacity="0.38" />

      {/* plinth — wider than the body, so the unit sits rather than floats */}
      <path d="M7,74 H41 A3,3 0 0 1 41,84 H7 A3,3 0 0 1 7,74 Z" fill={ILLO.unitLow} />
      <rect x="7" y="74" width="34" height="2.4" rx="1.2" fill={ILLO.edge} opacity="0.35" />

      {/* body — a broad monolith with a soft crown */}
      <path
        d="M11,13 Q11,4 24,4 Q37,4 37,13 L37,75 H11 Z"
        fill={`url(#unit-${id})`}
      />
      {/* A brushed edge, traced on the silhouette itself. Drawn as a separate
          arc it floated clear of the crown and read as a hook hanging off the
          unit. */}
      <path
        d="M11,13 Q11,4 24,4 Q37,4 37,13 L37,75 H11 Z"
        fill="none"
        stroke={ILLO.edge}
        strokeWidth="0.9"
        strokeOpacity="0.4"
        strokeLinejoin="round"
      />
      <rect x="12.4" y="14" width="1.4" height="60" rx="0.7" fill={ILLO.edge} opacity="0.28" />
      <rect x="34.4" y="14" width="1.6" height="60" rx="0.8" fill={ILLO.shadow} opacity="0.45" />

      {/* screen — the dominant face, inset behind glass */}
      <rect x="14" y="11" width="20" height="26" rx="3.4" fill={ILLO.shadow} />
      <rect x="14.9" y="11.9" width="18.2" height="24.2" rx="2.9" fill={`url(#screen-${id})`} />

      {lit && (
        <ellipse cx="24" cy="24" rx="13" ry="15" fill={`url(#bloom-${id})`} opacity={done ? 0.5 : 0.75} />
      )}

      {done ? (
        /* session complete */
        <path
          d="M19.5,24.2 L22.7,27.6 L28.6,20.6"
          fill="none"
          stroke={ILLO.live}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : active ? (
        /* filling arc — reads as progress even at 36px */
        <>
          <circle cx="24" cy="24" r="7.6" fill="none" stroke={ILLO.idle} strokeWidth="2.2" opacity="0.55" />
          <circle
            cx="24" cy="24" r="7.6" fill="none"
            stroke={ILLO.live} strokeWidth="2.2" strokeLinecap="round"
            strokeDasharray="47.8" strokeDashoffset="34"
            transform="rotate(-90 24 24)"
          >
            <animate attributeName="stroke-dashoffset" values="40;6;40" dur="3s" repeatCount="indefinite" />
          </circle>
          <path d="M24,19.6 L21.4,24.4 L24,24.4 L23.2,28.4 L26.4,23.4 L23.9,23.4 Z" fill={ILLO.liveGlow} />
        </>
      ) : (
        /* at rest — a battery, waiting */
        <>
          <rect x="18.4" y="20.6" width="10.4" height="6.4" rx="1.5" fill="none" stroke={ILLO.idle} strokeWidth="1.5" />
          <rect x="29.4" y="22.4" width="1.5" height="2.8" rx="0.7" fill={ILLO.idle} />
          <rect x="20" y="22.2" width="3.2" height="3.2" rx="0.6" fill={ILLO.idle} opacity="0.8" />
        </>
      )}

      {/* light blade — the single strongest "is it alive" cue */}
      <rect x="15" y="41" width="18" height="3" rx="1.5" fill={ILLO.shadow} />
      <rect
        x="15.7" y="41.6" width="16.6" height="1.8" rx="0.9"
        fill={lit ? ILLO.live : ILLO.idle}
        opacity={lit ? 1 : 0.5}
      >
        {active && !done && (
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
        )}
      </rect>

      {/* wordmark */}
      <rect x="16.5" y="48" width="15" height="2" rx="1" fill={ILLO.edge} opacity="0.5" />
      <rect x="16.5" y="51.4" width="9" height="1.4" rx="0.7" fill={ILLO.edge} opacity="0.25" />

      {/* cable holster, recessed into the body */}
      <circle cx="24" cy="63" r="7.4" fill={ILLO.shadow} />
      <circle cx="24" cy="63" r="5.6" fill={ILLO.glass} />
      <circle cx="24" cy="63" r="3.4" fill={lit ? ILLO.liveDim : ILLO.idle}>
        {active && !done && (
          <animate
            attributeName="fill"
            values={`${ILLO.liveDim};${ILLO.live};${ILLO.liveDim}`}
            dur="1.8s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="24" cy="63" r="1.4" fill={lit ? ILLO.liveGlow : ILLO.seam} />
    </svg>
  );
}


/**
 * The cable.
 *
 * Casing is ink, energy is orange, and both scenes that draw one get the
 * identical treatment — previously the energy layer mixed orange with amber
 * `#fbbf24` and a cream `#ffe2bd`, which put three warm colours on a part
 * that should read as one material carrying one thing.
 */
function CableSVG({
  className = "",
  active = false,
  isMobile = false,
}: {
  className?: string;
  active?: boolean;
  isMobile?: boolean;
}) {
  const path = isMobile
    ? "M2,5 C10,20 30,26 50,20 C60,18 65,18 70,30"
    : "M2,5 C10,20 30,26 45,20 C50,18 52,18 55,23";
  const endX = isMobile ? 70 : 55;
  const endY = isMobile ? 30 : 23;
  const particles = [0, 0.3, 0.6, 0.9, 1.2];

  return (
    <svg
      viewBox={isMobile ? "0 0 75 35" : "0 0 60 30"}
      className={className}
      fill="none"
    >
      {CABLE_CASING.map((c, i) => (
        <path
          key={i}
          d={path}
          stroke={c.stroke}
          strokeWidth={c.width}
          strokeLinecap="round"
          opacity={"opacity" in c ? c.opacity : 1}
        />
      ))}

      {active && (
        <>
          <path
            d={path}
            stroke={ILLO.live}
            strokeWidth="1.6"
            strokeDasharray="6 9"
            strokeLinecap="round"
            opacity="0.85"
          >
            <animate attributeName="stroke-dashoffset" values="0;-30" dur="0.6s" repeatCount="indefinite" />
          </path>
          {particles.map((d, i) => (
            <g key={i}>
              <circle r="2.6" fill={ILLO.live} opacity="0.22">
                <animateMotion dur="1.5s" begin={`${d}s`} repeatCount="indefinite" path={path} />
              </circle>
              <circle r="1.2" fill={ILLO.liveGlow}>
                <animateMotion dur="1.5s" begin={`${d}s`} repeatCount="indefinite" path={path} />
              </circle>
            </g>
          ))}
          <circle cx={endX} cy={endY} r="3.2" fill={ILLO.live} opacity="0.3">
            <animate attributeName="r" values="2.4;4;2.4" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Plug head */}
      <rect x={endX - 4} y={endY - 3} width="8" height="6" rx="2" fill={ILLO.shadow} />
      <rect
        x={endX - 2.5} y={endY - 1.6} width="5" height="3.2" rx="1.2"
        fill={active ? ILLO.live : ILLO.idle}
      />
    </svg>
  );
}


function MotionSVG({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={style}>
      <line
        x1="0"
        y1="8"
        x2="18"
        y2="8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.18"
      />
      <line
        x1="3"
        y1="15"
        x2="25"
        y2="15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.32"
      />
      <line
        x1="0"
        y1="22"
        x2="14"
        y2="22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.12"
      />
    </svg>
  );
}

// ============================================
// FLOATING CARD — elevated glass style
// ============================================

// ============================================
// SCENE PANELS — unchanged logic, polished markup
// ============================================

function Scene1({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.3;
  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const chargerPosition = isMobile
    ? "absolute left-1 bottom-4"
    : "absolute left-2 bottom-6";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Pick your spot
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            NACS or CCS
          </p>
        </div>
      )}

      {/* Charger */}
      <div className={chargerPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <ChargerSVG className="w-9 h-[4.15rem]" active={progress > 0.7} />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>

      {/* Motion lines */}
      {isActive && progress < 0.6 && (
        <div
          className="absolute left-12 bottom-10"
          style={{ opacity: 0.5 - progress * 0.8 }}
        >
          <MotionSVG className="w-5 text-white/55" />
        </div>
      )}
    </div>
  );
}

function Scene2({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.2;
  const valetPosition = isMobile
    ? "absolute left-[25%] bottom-3 transition-all duration-700 z-10"
    : "absolute left-[45%] bottom-4 transition-all duration-700 z-10";

  const carPosition = isMobile
    ? "absolute left-[45%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";
  return (
    <div className="relative w-full h-full">
      {/* Floating card - Stay in your car */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Stay in your car<span className="text-brass">*</span>
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            We come to you
          </p>
        </div>
      )}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={false} />
      </div>

      {/* Attendant with terminal */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive ? 1 : 0,
          transform: `translateX(${isActive ? Math.min(progress * 15, 10) : -10}px)`,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="terminal" />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}

function Scene3({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showBadge = isActive && progress > 0.5;
  const showCable = isActive && progress > 0.4;

  const valetStart = isMobile ? 25 : 30;
  const valetMove = isMobile ? 18 : 25;

  const valetPosition = isActive
    ? Math.min(progress * valetMove, valetMove)
    : 0;

  // const valetPosition = isActive ? Math.min(progress * 25, 18) : 0;

  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* Floating card - Pick your spot */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Charge 10 minutes
          </p>
        </div>
      )}
      {/* Floating badge */}
      {/* {showBadge && (
        <div
          className="absolute top-8 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 text-brand"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-[10px] font-semibold text-brand-ink tracking-tight">
              Ultra-fast
            </span>
          </div>
        </div>
      )} */}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={progress > 0.15} />
      </div>

      {/* Attendant walking with cable */}
      <div
        className="absolute bottom-4 z-20 transition-all duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          left: `calc(17% + ${valetPosition}px)`,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="cable" />
      </div>

      {/* Cable connecting charger to car */}
      <div
        className="absolute bottom-8 left-6 z-10 transition-all duration-300"
        style={{ opacity: showCable ? 1 : 0 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={showCable}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {showCable && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-brand rounded-full blur-md opacity-35" />
        )}
      </div>
    </div>
  );
}

function Scene4({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const showNotif = isActive && progress > 0.2;
  const showBadge = isActive && progress > 0.5;
  const carPosition = isMobile
    ? "absolute left-[40%] -translate-x-1/2 bottom-3"
    : "absolute left-[65%] -translate-x-1/2 bottom-4";

  const valetPosition = isMobile
    ? "absolute right-40 bottom-3 transition-all duration-700 z-20"
    : "absolute right-2 bottom-4 transition-all duration-700 z-20";

  return (
    <div className="relative w-full h-full">
      {/* Notification card */}
      {showBadge && (
        <div
          className="absolute top-6 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showBadge ? 1 : 0,
            transform: `translateY(${showBadge ? 0 : -10}px)`,
          }}
        >
          <p className="text-overline text-white/55 text-[10px] tracking-[0.14em]">
            Select your services
          </p>
          <p className="text-[10px] text-white/55 mt-0.5">
            or add more charging time
          </p>
        </div>
      )}
      {/* {showNotif && (
        <div
          className="absolute top-20 right-2 transition-all duration-500 z-30"
          style={{
            opacity: showNotif ? 1 : 0,
            transform: `translateY(${showNotif ? 0 : -10}px)`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shadow-card">
              <span className="text-[9px] text-white font-bold">H</span>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-ink-800 leading-tight">
                75+ miles added
              </p>
            </div>
          </div>
        </div>
      )} */}

      {/* Charger */}
      <div
        className="absolute left-2 bottom-6"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <ChargerSVG className="w-9 h-[4.15rem]" active={isActive} />
      </div>

      {/* Cable stays connected */}
      <div
        className="absolute bottom-8 left-6 z-10"
        style={{ opacity: isActive ? 1 : 0.3 }}
      >
        <CableSVG
          className="w-20 lg:w-24"
          active={isActive}
          isMobile={isMobile}
        />
      </div>

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-brand rounded-full blur-md opacity-30" />
        )}
      </div>

      {/* Attendant with food */}
      <div
        className={valetPosition}
        style={{
          opacity: isActive && progress > 0.3 ? 1 : 0,
        }}
      >
        <ValetSVG className="w-11 h-[4.1rem]" holding="food" />
      </div>
    </div>
  );
}

function Scene5({
  progress,
  isActive,
  isMobile,
}: {
  progress: number;
  isActive: boolean;
  isMobile: boolean;
}) {
  const carPosition = isMobile
    ? "absolute left-[46%] -translate-x-1/2 bottom-3"
    : "absolute left-[68%] -translate-x-1/2 bottom-4";

  return (
    <div className="relative w-full h-full">
      {/* The finish.

          This panel used to fade its charger to 50% and draw no cable, which
          is why it read as an empty frame rather than an ending. It now shows
          a completed session: the pedestal lit and at rest, the cable coiled
          back into the holster, and the car pulling away. */}

      {/* Charger — done, not dimmed */}
      <div className="absolute left-2 bottom-6">
        <ChargerSVG className="w-9 h-[4.15rem]" done={isActive} />
      </div>

      {/* Cable back on the hook */}
      <div
        className="absolute left-[1.35rem] bottom-[1.6rem] w-4 transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0.4 }}
      >
        <svg viewBox="0 0 16 22" fill="none" aria-hidden>
          <path
            d="M8,2 C13,5 13,10 8,12 C3,14 3,18 8,20"
            stroke={ILLO.body}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M8,2 C13,5 13,10 8,12 C3,14 3,18 8,20"
            stroke={ILLO.seam}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Session complete — the one orange mark, so "done" is legible */}
      {isActive && (
        <div
          className="absolute left-1 bottom-[3.9rem] transition-opacity duration-500"
          style={{ opacity: Math.min(1, progress * 2) }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" aria-hidden>
            <circle cx="10" cy="10" r="9" fill={ILLO.live} />
            <path
              d="M6 10.4 L8.8 13 L14 7.6"
              fill="none"
              stroke={ILLO.stage}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Motion lines — the car is leaving */}
      {isActive && progress > 0.3 && (
        <div
          className="absolute left-[30%] bottom-10"
          style={{ opacity: progress * 0.6 }}
        >
          <MotionSVG className="w-6 text-white/55" />
        </div>
      )}

      {/* Car */}
      <div className={carPosition} style={{ opacity: isActive ? 1 : 0.3 }}>
        <CarSVG className="w-28 lg:w-32" />
      </div>
    </div>
  );
}


const MemoScene1 = memo(Scene1);
const MemoScene2 = memo(Scene2);
const MemoScene3 = memo(Scene3);
const MemoScene4 = memo(Scene4);
const MemoScene5 = memo(Scene5);

// ============================================
// STEP ICON — numbered pill
// ============================================

// ============================================
// MAIN COMPONENT — logic untouched
// ============================================

export function JourneyBattery() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const batteryRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const progressBarsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [mobileActiveCard, setMobileActiveCard] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const scrollProgressRef = useRef(0);
  const lastStepRef = useRef(0);
  const allDoneRef = useRef(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  // Handle mobile carousel scroll to update active dot
  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const first = carousel.firstElementChild as HTMLElement | null;
      const cardWidth = first
        ? first.offsetWidth + 16
        : carousel.offsetWidth * 0.85 + 16;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      setMobileActiveCard(Math.min(activeIndex, 4));
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const updatePanels = useCallback((progress: number) => {
    if (!panelsRef.current || !progressBarsRef.current || !labelsRef.current)
      return;

    const panels = panelsRef.current.children;
    const bars = progressBarsRef.current.children;
    const labels = labelsRef.current.children;
    const currentStep = Math.min(Math.floor(progress * 5), 4);

    for (let i = 0; i < 5; i++) {
      const stepStart = i / 5;
      const stepEnd = (i + 1) / 5;
      let stepProgress = 0;
      if (progress >= stepEnd) stepProgress = 1;
      else if (progress > stepStart)
        stepProgress = (progress - stepStart) / (stepEnd - stepStart);

      const panel = panels[i] as HTMLElement;
      const bar = bars[i]?.firstChild as HTMLElement;
      const label = labels[i] as HTMLElement;
      const isActive = currentStep >= i;
      const isCurrent = currentStep === i;

      if (panel) {
        // No fill-as-state: tinting panels cream is what made this read as
        // clip-art. Active/inactive is expressed as scene opacity instead.
        panel.style.backgroundColor = "transparent";
        panel.style.opacity = isActive ? "1" : "0.34";
        const overlay = panel.querySelector("[data-overlay]") as HTMLElement;
        if (overlay) overlay.style.opacity = isActive ? "0" : "0.3";
        const dot = panel.querySelector("[data-dot]") as HTMLElement;
        if (dot) dot.style.display = isCurrent ? "block" : "none";
      }

      if (bar) {
        bar.style.width = isCurrent
          ? `${stepProgress * 100}%`
          : isActive
            ? "100%"
            : "0%";
      }

      if (label) {
        label.style.opacity = isActive ? "1" : "0.4";

        // Pill - consistent size, just color changes
        const pill = label.querySelector("[data-pill]") as HTMLElement;
        if (pill) {
          pill.style.color = isCurrent
            ? "#FFFFFF"
            : isActive
              ? "rgba(255,255,255,0.5)"
              : "rgba(255,255,255,0.22)";
          pill.style.background = "transparent";
          pill.style.boxShadow = "none";
        }

        // Title - consistent size, just color changes
        const title = label.querySelector("[data-title]") as HTMLElement;
        if (title) {
          title.style.color = isCurrent
            ? "#FFFFFF"
            : "rgba(255,255,255,0.55)";
        }

        // Subtitle - just opacity change
        const subtitle = label.querySelector("[data-subtitle]") as HTMLElement;
        if (subtitle) {
          subtitle.style.opacity = isActive ? "0.8" : "0";
        }
      }
    }
  }, []);

  // Handle clicking on a step card
  const handleStepClick = useCallback((stepIndex: number) => {
    if (!scrollTriggerRef.current) return;

    const st = scrollTriggerRef.current;
    const targetProgress = (stepIndex + 0.5) / 5; // Center of the step

    // Calculate the scroll position for this progress
    const scrollStart = st.start;
    const scrollEnd = st.end;
    const targetScroll =
      scrollStart + (scrollEnd - scrollStart) * targetProgress;

    // Smooth scroll to that position
    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Reduced motion: no pinning, no scrub, no header reveal. The section
    // scrolls normally and every step renders in its completed state, so the
    // content is fully available without any scroll-driven movement.
    if (reduced) {
      scrollProgressRef.current = 1;
      lastStepRef.current = 4;
      // Settling the scene into its finished state is the whole point of this
      // branch — there is no scroll driver to do it for us.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveStep(4);
      updatePanels(1);
      return;
    }

    // Guarded: below lg the trigger element is display:none, and pinning a
    // zero-height node with end "+=200%" injects ~2 viewport-heights of blank
    // scroll on mobile.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: batteryRef.current,
        start: "top 15%",
        end: "+=200%",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          const newStep = Math.min(Math.floor(self.progress * 5), 4);
          if (newStep !== lastStepRef.current) {
            lastStepRef.current = newStep;
            setActiveStep(newStep);
          }
          updatePanels(self.progress);
        },
      });

      // Store the ScrollTrigger instance
      scrollTriggerRef.current = st;

      // NB: a `.journey-header` reveal used to live here. It was registered
      // inside the min-width:1024px matchMedia, but the only element carrying
      // that class is inside a lg:hidden block — so it animated a node that is
      // never visible when the animation is active, and never ran when it was.
    }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [updatePanels, reduced]);

  const getStepProgress = useCallback((i: number) => {
    const progress = scrollProgressRef.current;
    const start = i / 5,
      end = (i + 1) / 5;
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  }, []);

  const scenes = [MemoScene1, MemoScene2, MemoScene3, MemoScene4, MemoScene5];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-ink-900"
    >
      {/* ---- TOP SECTION ---- */}
      <div className="relative py-8 lg:py-12">
        <div className="section-container">
          {/* Header - Mobile only (desktop header is inside pinned container) */}
          <div className="journey-header mb-6 lg:hidden">
            <p className="text-overline text-white/55">The experience</p>
            {/* Not an <h2>: the pinned desktop header below owns that heading,
                and both are in the DOM simultaneously. */}
            <p className="text-h2 text-white mb-2">Your charging journey</p>
            <p className="text-body-sm text-on-dark/60">Swipe to explore each step</p>
          </div>

          {/* ---- MOBILE HORIZONTAL CAROUSEL ---- */}
          <div className="lg:hidden -mx-4 sm:-mx-6">
            {/* Swipeable cards container */}
            <div
              ref={mobileCarouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-6 gap-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {journeySteps.map((step, i) => {
                const Scene = scenes[i];
                return (
                  <div
                    key={step.id}
                    className="flex-shrink-0 w-[85vw] snap-center rounded-lg overflow-hidden border border-white/10 bg-ink-800"
                  >
                    {/* Scene visualization */}
                    <div className="relative h-[186px] overflow-hidden">
                      {/* Scene container with padding to shift content right */}
                      <div className="absolute inset-0 pl-8">
                        <Scene progress={1} isActive={true} isMobile={true} />
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="p-4 bg-ink-800 border-t border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <div className="text-index text-white/55 shrink-0">
                          {String(step.id).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-h4 text-white">{step.title}</p>
                          <p className="text-caption text-on-dark/55 mt-0.5">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Battery Indicator */}
            <div className="px-6 mt-5">
              <div className="flex items-center justify-center">
                {/* Battery container */}
                <div
                  className="relative flex items-center rounded-lg px-1.5 py-1.5"
                  style={{
                    background: `linear-gradient(145deg, ${ILLO.body}, ${ILLO.stage})`,
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Inner glow when charging */}
                  {mobileActiveCard >= 2 && mobileActiveCard < 4 && (
                    <div
                      className="absolute inset-0 rounded-lg opacity-30"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(34,197,94,0.4) 0%, transparent 70%)",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}

                  {/* Battery cells */}
                  <div className="flex items-center gap-1 relative z-10">
                    {journeySteps.map((_, i) => {
                      const isActive = mobileActiveCard === i;
                      const isCompleted = mobileActiveCard > i;
                      const isFilled = isActive || isCompleted;
                      const isCharging =
                        mobileActiveCard >= 2 && mobileActiveCard < 4;

                      return (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Go to step ${i + 1}: ${journeySteps[i].title}`}
                          aria-current={isActive ? "step" : undefined}
                          onClick={() => {
                            const carousel = mobileCarouselRef.current;
                            if (carousel) {
                              const first = carousel.firstElementChild as HTMLElement | null;
                              const cardWidth = first
                                ? first.offsetWidth + 16
                                : carousel.offsetWidth * 0.85 + 16;
                              carousel.scrollTo({
                                left: i * cardWidth,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className="relative h-7 rounded-md transition-all duration-400 overflow-hidden"
                          style={{
                            width: isActive ? "20px" : "14px",
                            background: isFilled
                              ? isCharging ||
                                (mobileActiveCard >= 4 && isCompleted)
                                ? `linear-gradient(180deg, ${ILLO.liveGlow} 0%, ${ILLO.live} 100%)`
                                : `linear-gradient(180deg, ${ILLO.liveGlow} 0%, ${ILLO.live} 100%)`
                              : "rgba(71,85,105,0.4)",
                            boxShadow: isFilled
                              ? isCharging
                                ? "0 0 8px rgba(74,222,128,0.6), inset 0 1px 0 rgba(255,255,255,0.3)"
                                : "0 0 8px rgba(251,146,60,0.5), inset 0 1px 0 rgba(255,255,255,0.3)"
                              : "inset 0 2px 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          {/* Cell shine */}
                          {isFilled && (
                            <div
                              className="absolute inset-x-0 top-0 h-1/3 rounded-t-md"
                              style={{
                                background:
                                  "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
                              }}
                            />
                          )}
                          {/* Charging pulse */}
                          {isActive && isCharging && (
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                                animation: "pulse 1.5s ease-in-out infinite",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Battery terminal */}
                  <div
                    className="w-1.5 h-3 rounded-r-sm ml-1"
                    style={{
                      background:
                        `linear-gradient(180deg, ${ILLO.seam} 0%, ${ILLO.idle} 100%)`,
                    }}
                  />
                </div>

                {/* Status text */}
                <div className="ml-4 text-left">
                  <p
                    className="text-caption font-semibold"
                    style={{
                      color:
                        mobileActiveCard >= 4
                          ? ILLO.live
                          : mobileActiveCard >= 2
                            ? ILLO.liveGlow
                            : ILLO.seam,
                    }}
                  >
                    {mobileActiveCard >= 4
                      ? "Ready!"
                      : mobileActiveCard >= 2
                        ? "Charging..."
                        : `Step ${mobileActiveCard + 1}`}
                  </p>
                  <p className="text-[10px] text-white/50">
                    {mobileActiveCard + 1} of 5
                  </p>
                </div>
              </div>

              {/* Tap hint */}
              <p className="text-center text-[10px] text-white/55 mt-3 flex items-center justify-center gap-2">
                <span className="w-4 h-px bg-ink-300" />
                Tap battery or swipe
                <span className="w-4 h-px bg-ink-300" />
              </p>
            </div>
          </div>

          {/* ---- DESKTOP BATTERY WIDGET ---- */}
          <div ref={batteryRef} className="hidden lg:block">
            {/* Header - Inside pinned container for desktop */}
            <div className="mb-20">
              <p className="text-overline text-white/55">The experience</p>
              <h2 className="text-h2 text-white mb-3 max-w-headline">
                Your charging journey
              </h2>
              <p className="text-body-lg text-on-dark/70 max-w-[36ch]">
                Charging made simple, fast, and effortless.
              </p>
            </div>
            <div className="relative">
              {/* Stage. A white card floating on navy read as a sticker; the
                  scene now sits directly on the section with one ground line. */}
              <div className="relative overflow-hidden border-y border-white/[0.07]">

                {/* Scene panels */}
                <div
                  ref={panelsRef}
                  className="grid grid-cols-5 h-[204px] lg:h-[224px]"
                >
                  {/* Deliberate render-time ref read: GSAP scrub drives
                      scrollProgressRef per frame; React re-renders only on
                      integer step changes. State here would re-render every
                      scroll frame. */}
                  {/* eslint-disable-next-line react-hooks/refs */}
                  {journeySteps.map((step, i) => {
                    const isActive = activeStep >= i;
                    const isCurrent = activeStep === i;
                    const Scene = scenes[i];

                    return (
                      <div
                        key={step.id}
                        className={`relative transition-colors duration-300 ${
                          i < 4 ? "border-r border-white/[0.07]" : ""
                        }`}
                      >
                        <Scene
                          progress={getStepProgress(i)}
                          isActive={isActive}
                          isMobile={isMobile}
                        />

                        {/* Inactive overlay */}
                        <div
                          data-overlay
                          className="absolute inset-0 bg-ink-900/40 pointer-events-none transition-opacity duration-300"
                          style={{ opacity: isActive ? 0 : 0.3 }}
                        />

                        {/* Current step pulse dot */}
                        <div
                          data-dot
                          className="absolute top-2.5 left-1/2 -translate-x-1/2"
                          style={{ display: isCurrent ? "block" : "none" }}
                        >
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress track */}
                <div
                  ref={progressBarsRef}
                  className="h-[1.5px] flex"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  {/* eslint-disable-next-line react-hooks/refs -- same deliberate render-time ref read as above */}
                  {journeySteps.map((_, i) => (
                    <div key={i} className="flex-1 overflow-hidden">
                      <div
                        className="h-full transition-none"
                        style={{
                          background:
                            ILLO.live,
                          width:
                            activeStep === i
                              ? `${getStepProgress(i) * 100}%`
                              : activeStep > i
                                ? "100%"
                                : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Step labels */}
              <div ref={labelsRef} className="grid grid-cols-5 mt-6">
                {journeySteps.map((step, i) => {
                  const isActive = activeStep >= i;
                  const isCurrent = activeStep === i;

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(i)}
                      className="flex flex-col items-start gap-2 transition-all duration-300 cursor-pointer group py-2 text-left"
                      style={{ opacity: isActive ? 1 : 0.4 }}
                    >
                      {/* Pill */}
                      <div
                        data-pill
                        className="text-index transition-colors duration-300"
                        style={{
                          color: isCurrent
                            ? "#FFFFFF"
                            : isActive
                              ? "rgba(255,255,255,0.5)"
                              : "rgba(255,255,255,0.22)",
                        }}
                      >
                        {String(step.id).padStart(2, "0")}
                      </div>

                      <div className="px-1">
                        <p
                          data-title
                          className="font-bold tracking-tight transition-all duration-300 group-hover:text-brand text-body-sm lg:text-base"
                          style={{
                            color: isCurrent ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                            marginBottom: "2px",
                          }}
                        >
                          {step.title}
                        </p>
                        {/* <p
                          data-subtitle
                          className="text-white/50 leading-snug transition-all duration-300 text-caption lg:text-body-sm"
                          style={{
                            opacity: isActive ? 0.8 : 0,
                          }}
                        >
                          {step.subtitle}
                        </p> */}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ---- SUMMARY STATS ----
           A white card floating on the navy stage read as a sticker, and the
           dark-stage conversion left its heading white-on-white. It is now a
           hairline spec row on the section itself, matching the hero. */}
      <div className="section-container pb-16 lg:pb-20">
        <div className="border-t border-white/10 pt-8 grid gap-8 lg:grid-cols-[minmax(0,28ch)_1fr] lg:gap-16">
          <div>
            <h3 className="text-h3 text-white mb-1.5">Your car is your space</h3>
            <p className="text-body-sm text-on-dark/60">
              Like home and office. We bring everything to you.
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { v: "10 min", l: "Adds 50–135 miles, by car" },
              { v: "Attendant", l: "Plugs in and unplugs for you" },
              { v: "Lifestyle", l: "Delivered to your window" },
            ].map((stat, i) => (
              <div
                key={stat.v}
                className={`py-4 sm:py-0 ${i === 0 ? "sm:pr-6" : "sm:px-6"} ${i === 2 ? "sm:pr-0" : ""}`}
              >
                <dt className="text-h3 text-white">{stat.v}</dt>
                <dd className="text-caption text-on-dark/55 mt-1">{stat.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

    </section>
  );
}
