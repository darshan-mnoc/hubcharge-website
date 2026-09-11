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

/**
 * The car's silhouette, written once.
 *
 * It is used three times — the body, its ground reflection, and the haze that
 * lies over it at distance — and it used to be three copies of the same
 * literal, which is how a reflection ends up drawing last round's car.
 *
 * The shape follows a reference the client supplied: a long low bonnet with
 * the cab set well back, a domed roof peaking behind the middle and falling
 * into a fastback, a full haunch over the rear wheel, and — the thing that
 * most changes the character — WHEELS HALF THE HEIGHT OF THE CAR.
 */
const BODY_D =
  "M10,50 C10,43 12,39 18,37 C30,33.4 42,31.6 56,31 C64,30.6 70,26.4 79,20.8 C88,15.6 96,12.8 106,12.8 C118,13 129,16 140,21 C154,27.4 168,32.8 177,36.6 C180.6,38 181.6,40.4 181.2,44 C180.6,48.4 178,51.4 172,52.8 L155,54 C153.6,44.6 148,37.2 140,37.2 C132,37.2 126.4,44.6 125,54 L68,55 C66.6,45.4 61,37.6 53,37.6 C45,37.6 39.4,45 38,54 L20,53 C14,52.4 10,52 10,50 Z";

/** The greenhouse: shallow, and set well back on that long bonnet. */
const GLASS_D =
  "M70,29.6 C77,23.6 84,18.6 92,16 C100,13.8 108,13.2 116,13.8 C126,14.8 134,17.6 142,21.6 C145.6,23.4 147,26.6 148,29.6 Z";

/**
 * Where the wheels sit, and how big they are.
 *
 * The radius went from 9.6 to 12.5 — half again as large — because that is
 * the single biggest difference between the reference and what this drew
 * before. A car with small wheels reads as a cartoon; a car with big wheels
 * reads as a car.
 *
 * The one number that cannot move is the SUM: scripts/check-cover-accuracy.py
 * asserts that cy + r equals the foot fraction declared in guide-cover.tsx, so
 * the tyre still touches the floor exactly where every cover expects it to.
 * 50.6 + 12.5 = 63.1, unchanged.
 *
 * The axles also moved forward, from 55/147 to 53/140. At 147 the bigger rear
 * tyre reached x=159.5 and swallowed the charge port — which is pinned at 158
 * because guide-cover.tsx's portAt() and six cable anchors are derived from
 * it. The port now sits clear on the rear quarter, where a port belongs.
 */
const AXLE = [53, 140] as const;

export function CarSVG({
  id,
  className = "",
  style = {},
  haze = 0,
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Distance, 0 to 1.
   *
   * Callers used to fake this by lowering the whole car's opacity, which
   * against a near-black plate makes a far car DARKER than a near one — the
   * exact opposite of what distance does. Air between you and an object takes
   * contrast away and lifts it toward the colour of the sky. So this lays the
   * sky's own haze over the car's silhouette instead: shape intact, contrast
   * gone. The near car stays the darkest thing in the frame, as it should.
   */
  haze?: number;
}) {
  return (
    <svg viewBox="0 0 200 70" className={className} style={style}>
      <defs>
        {/* Body. The reference is a light car shaded from a bright shoulder
            down to a dark sill; this is the same ramp in the site's steel. */}
        <linearGradient id={`carBody-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.carSheen} />
          <stop offset="38%" stopColor={ILLO.carTop} />
          <stop offset="76%" stopColor={ILLO.carMid} />
          <stop offset="100%" stopColor={ILLO.carLow} />
        </linearGradient>

        {/* Greenhouse: darker at the base, as glass reads against a body. */}
        <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.glassTop} stopOpacity="0.42" />
          <stop offset="55%" stopColor={ILLO.glassMid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={ILLO.glassLow} stopOpacity="0.78" />
        </linearGradient>

        <linearGradient id={`reflect-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.carTop} stopOpacity="0.28" />
          <stop offset="100%" stopColor={ILLO.carTop} stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`contact-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.shadow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ILLO.shadow} stopOpacity="0" />
        </radialGradient>

        {/* The alloy face. The reference's wheels are the brightest thing on
            the car after the glass, so the rim gets its own ramp rather than
            a flat fill. */}
        <linearGradient id={`rim-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#5B6E88" />
          <stop offset="100%" stopColor={ILLO.rim} />
        </linearGradient>
      </defs>

      {/* Contact shadow, offset right — one light source, upper-left. Wide and
          soft, the way the reference's is. */}
      <ellipse cx="100" cy="64" rx="88" ry="5.2" fill={`url(#contact-${id})`} />

      {/* Reflection, mirrored about the line the tyres touch: c(1+s) where
          c = 63.1 and s = 0.34. It used to say 127 — which mirrors about 94.8
          and sent the sill to y=107.6, outside a box 70 tall, so it had never
          drawn a single pixel. */}
      <g transform="translate(0,84.554) scale(1,-0.34)" opacity="0.45">
        <path d={BODY_D} fill={`url(#reflect-${id})`} />
      </g>

      <path d={BODY_D} fill={`url(#carBody-${id})`} />

      {/* The rocker — the darkest plane, and what grounds the car. */}
      <path
        d="M40,53.4 C58,55.4 110,55.6 152,53.8 L154,55.6 C112,57.4 60,57.2 39,55.4 Z"
        fill={ILLO.carRocker}
      />

      {/* The shoulder. One highlight along the top of the flank is the
          strongest depth cue at this size, and the reference has exactly one. */}
      <path
        d="M14,41 C32,35 56,32 84,30.8 C116,29.6 152,31.6 178,37"
        stroke="rgba(255,255,255,0.30)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* and the crease along the flank, low and long */}
      <path
        d="M26,45.6 C66,43.4 124,43 174,44.4"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />

      <path d={GLASS_D} fill={`url(#glass-${id})`} />
      {/* the bright top edge of the window frame */}
      <path
        d="M72,28.6 C80,21.6 90,16.4 102,14.8 C120,13.4 136,17.6 146,28.6"
        stroke="rgba(255,255,255,0.34)"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      {/* B-pillar */}
      <path d="M106,13.6 L109,13.7 L109,29.4 L106,29.4 Z" fill={ILLO.glassLow} opacity="0.9" />
      {/* door shut line and handle — small, and what stops a car reading as
          a solid lozenge */}
      <path d="M100,30 L100,53.4" stroke={ILLO.carLow} strokeWidth="0.8" strokeOpacity="0.7" />
      <rect x="114" y="34" width="8" height="2" rx="1" fill={ILLO.carTop} opacity="0.8" />

      {/* Lights: presence, not glow. */}
      <path d="M10.4,40.6 C13.6,39.4 17,38.8 20.4,38.6 L20.4,41.6 C17,41.8 13.6,42.4 10.6,43.4 Z" fill="rgba(255,255,255,0.7)" />
      <path d="M181.4,40.4 C179,40 176.6,39.8 174.4,39.8 L174.4,42.8 C176.8,42.8 179.2,43 181.2,43.4 Z" fill={ILLO.fault} opacity="0.72" />

      {/* Wheels. Half the height of the car, with an open five-spoke face —
          the two things that most separate the reference from a generic
          side-on car drawing. */}
      {AXLE.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={50.6} r="12.5" fill={ILLO.tyre} />
          <circle cx={cx} cy={50.6} r="12.5" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.9" />
          <circle cx={cx} cy="50.6" r="8.8" fill={`url(#rim-${id})`} />
          <g transform={`translate(${cx} 50.6)`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <path
                key={a}
                d="M-1.5,-2.4 L-2.5,-7.9 A 7.9 7.9 0 0 1 2.5,-7.9 L1.5,-2.4 Z"
                transform={`rotate(${a})`}
                fill={ILLO.hub}
                opacity="0.5"
              />
            ))}
          </g>
          <circle cx={cx} cy="50.6" r="2.4" fill={ILLO.hub} opacity="0.9" />
        </g>
      ))}

      {/* Charge port — a point of light. Held at (158, 37) because
          guide-cover.tsx's portAt() and six cable anchors are derived from
          exactly these two numbers. */}
      <circle cx="158" cy="37" r="2" fill={ILLO.live} opacity="0.95" />

      {/* Atmosphere, over the silhouette only. Drawn as the same shapes rather
          than as a rectangle, because a rectangle of haze would sit visibly
          across the horizon glow behind it. */}
      {haze > 0 && (
        <g fill={ILLO.skyHaze} opacity={haze} aria-hidden>
          <path d={BODY_D} />
          {AXLE.map((cx) => (
            <circle key={cx} cx={cx} cy="50.6" r="12.5" />
          ))}
        </g>
      )}
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
