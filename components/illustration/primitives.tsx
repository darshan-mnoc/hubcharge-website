/**
 * Shared illustration primitives.
 *
 * These were written for the homepage charging-journey strip and are the best
 * drawings in this codebase: one light source upper-left, a contact shadow, a
 * ground reflection, the rocker as the darkest plane, a beltline highlight,
 * and roof and glass drawn separately so the pillars read. Meanwhile
 * components/guide-cover.tsx hand-rolled fourteen of its own primitives and a
 * far worse car, over eight rounds, while these sat in the same repository.
 *
 * Moved here unchanged apart from one thing: each took its gradient namespace
 * from useId(), which forces a client component. They take an `id` prop now,
 * so the guide covers can server-render them with no JavaScript.
 * components/journey-battery.tsx keeps thin wrappers that supply useId().
 */
import { ILLO, CABLE_CASING } from "@/lib/illustration";

export function CarSVG({
  id,
  className = "",
  style = {},
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
  className?: string;
  style?: React.CSSProperties;
}) {

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
export function ValetSVG({
  id,
  className = "",
  style = {},
  holding = "terminal",
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
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
export function ChargerSVG({
  id,
  still = false,
  free = false,
  className = "",
  style = {},
  active = false,
  done = false,
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
  /** Hold every animation still — for prefers-reduced-motion. */
  still?: boolean;
  /** Bay is available. The real cabinet's light blade is GREEN when free —
   *  drawing it orange made a free bay and a charging bay look identical. */
  free?: boolean;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  done?: boolean;
}) {
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
            {!still && <animate attributeName="stroke-dashoffset" values="40;6;40" dur="3s" repeatCount="indefinite" />}
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
        fill={free ? ILLO.ok : lit ? ILLO.live : ILLO.idle}
        opacity={free || lit ? 1 : 0.5}
      >
        {active && !done && !still && (
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
        {active && !done && !still && (
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
export function CableSVG({
  id,
  still = false,
  className = "",
  active = false,
  isMobile = false,
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
  /** Hold every animation still — for prefers-reduced-motion. */
  still?: boolean;
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
            {!still && <animate attributeName="stroke-dashoffset" values="0;-30" dur="0.6s" repeatCount="indefinite" />}
          </path>
          {particles.map((d, i) => (
            <g key={i}>
              <circle r="2.6" fill={ILLO.live} opacity="0.22">
                {!still && <animateMotion dur="1.5s" begin={`${d}s`} repeatCount="indefinite" path={path} />}
              </circle>
              <circle r="1.2" fill={ILLO.liveGlow}>
                {!still && <animateMotion dur="1.5s" begin={`${d}s`} repeatCount="indefinite" path={path} />}
              </circle>
            </g>
          ))}
          <circle cx={endX} cy={endY} r="3.2" fill={ILLO.live} opacity="0.3">
            {!still && <animate attributeName="r" values="2.4;4;2.4" dur="1.2s" repeatCount="indefinite" />}
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


export function MotionSVG({
  id,
  className = "",
  style = {},
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
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
