/**
 * Shared illustration primitives.
 *
 * These are the drawings every scene is assembled from: the homepage
 * charging-journey strip and all twenty-one guide covers place these four
 * components and nothing else, so the hardware can never disagree with itself
 * from one page to the next.
 *
 * REDRAWN against the product photography (public/images/alhambra-unit.webp,
 * charging-service-v2.webp, valet-greet-v2.webp). What changed and why:
 *
 *   - The charger was a generic pedestal: a slim monolith with one screen,
 *     one blade and one round holster. The real cabinet is a broad off-white
 *     column with the wordmark across the top, two status dashes beneath it,
 *     a portrait touchscreen, a card reader, TWO holsters — CCS1 on the left,
 *     NACS on the right, both labelled — and cable arms on the crown with the
 *     leads looping down to the couplers. A reader who has stood at one of
 *     our bays now recognises the drawing.
 *   - The car had a long bonnet and a cab set well back, which reads as a
 *     combustion saloon. It is an EV now: short bonnet, cab forward, a tall
 *     glasshouse and a fastback, with the charge port on the rear quarter.
 *   - The attendant wore a cap and a boiler suit. Our people wear a white
 *     shirt and a dark waistcoat, which is what the photography shows.
 *
 * THREE NUMBERS CANNOT MOVE, because guide-cover.tsx derives every placement
 * and every cable anchor from them:
 *
 *   - the car's tyres touch at y = 63.1 of a 200x70 box, and its charge port
 *     is at (158, 37). scripts/check-cover-accuracy.py asserts both.
 *   - the unit stands on y = 85.5 of a 48x88 box.
 *   - the attendant stands on y = 100 of a 60x104 box.
 *
 * The unit's holster DID move — the real cabinet holsters at chest height,
 * not at the knee — so holsterAt() in guide-cover.tsx reads 51.3 now. That
 * pair has to stay in step; it is the one number shared across two files.
 *
 * Each drawing is authored in its own comfortable coordinate space and then
 * placed into the published viewBox by a single transform, so the art can be
 * edited without re-deriving the contract above.
 *
 * Colour comes from ILLO only. Every value there is measured off the
 * photographs at night levels, which is why the cabinet is a warm greige
 * rather than the white it is in daylight.
 */
import { ILLO, CABLE_CASING } from "@/lib/illustration";

/**
 * Where the drawings' anchors land, in their own published viewBoxes.
 *
 * guide-cover.tsx places every element and hangs every cable off these, and
 * scripts/check-cover-accuracy.py re-derives them from the artwork below and
 * fails if the drawing has moved away from what is declared here. One set of
 * numbers, read by both, so a redraw cannot quietly detach a cable again.
 */
export const ANCHOR = {
  /** Car, in a 200x70 box: where the tyres touch, and the charge port. */
  carFoot: 63.1,
  port: { x: 158, y: 37 },
  /** Unit, in a 48x88 box: the contact shadow, and the couplers — which sit
   *  at chest height, 8.8 either side of centre (CCS1 left, NACS right). */
  unitFoot: 85.5,
  holster: { y: 51.3, dx: 8.8 },
  /** Attendant, in a 60x104 box. */
  valetFoot: 100,
} as const;

/* ── The car ──────────────────────────────────────────────────────────
 *
 * Drawn nose-right in a 384-long space with the ground at y=128, then placed
 * MIRRORED so the car faces left and its port lands on (158, 37) — the site's
 * convention, and what the covers' cable maths expects.
 */
const CAR_PLACE = "translate(185.9 6.55) scale(-0.4453 0.4453)";

/** Bonnet short, cab forward, roof peaking ahead of centre, long fastback
 *  tail, and wheels half the height of the car. */
const BODY_D =
  "M22,112C14,110 11,100 12,90C13,78 18,66 34,60C56,54 80,50 100,44C130,28 170,16 212,16" +
  "C246,16 270,26 300,48C320,55 346,60 368,64C384,67 393,73 394,84C395,94 392,104 386,110" +
  "L384,112H345A34,34 0 1 0 279,112H121A34,34 0 1 0 55,112Z";

/** The glasshouse: tall, and set forward on a short bonnet. */
const GLASS_D =
  "M104,57C128,42 170,23 212,23C242,23 266,33 292,52C230,54 160,56 104,57Z";

const TAIL_D = "M12.6,86C13.2,75 18.5,66.5 34,60.4L35.6,64.6C23.4,69.6 18.6,77 17.8,87Z";
const HEAD_D = "M377,68.6C386,71 391.6,75 393.6,81L386.6,82.4C384.2,78 380.8,75.2 375,73.2Z";

const AXLE = [88, 312] as const;
/** Local coordinates of the charge port. Maps to (158, 37) once placed, which
 *  is where portAt() in guide-cover.tsx looks for it. */
const PORT = { x: 62.6, y: 68.38 } as const;

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
   * Distance, 0 to 1. Air between you and an object takes contrast away and
   * lifts it toward the colour of the sky, so this lays the sky's own haze
   * over the silhouette rather than lowering opacity — which, against a
   * near-black plate, would make a far car DARKER than a near one.
   */
  haze?: number;
}) {
  return (
    <svg viewBox="0 0 200 70" className={className} style={style}>
      <defs>
        <linearGradient id={`carBody-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="12%" stopColor={ILLO.carSheen} />
          <stop offset="38%" stopColor={ILLO.carTop} />
          <stop offset="68%" stopColor={ILLO.carMid} />
          <stop offset="100%" stopColor={ILLO.carLow} />
        </linearGradient>
        <linearGradient id={`glass-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.glassTop} stopOpacity="0.5" />
          <stop offset="55%" stopColor={ILLO.glassMid} stopOpacity="0.68" />
          <stop offset="100%" stopColor={ILLO.glassLow} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`reflect-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="45%" stopColor={ILLO.carTop} stopOpacity="0" />
          <stop offset="100%" stopColor={ILLO.carTop} stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id={`contact-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.shadow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ILLO.shadow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`rim-${id}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#5B6E88" />
          <stop offset="100%" stopColor={ILLO.rim} />
        </linearGradient>
        <radialGradient id={`port-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.live} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ILLO.live} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Contact shadow, offset right — one light source, upper-left. */}
      <ellipse cx="100" cy="64" rx="88" ry="4.4" fill={`url(#contact-${id})`} />

      <g transform={CAR_PLACE}>
        {/* Reflection, squashed and fading down, then the wheel wells behind
            the body so the arches read as openings rather than as paint. */}
        <g transform="translate(0 128) scale(1 -0.28) translate(0 -128)">
          <path d={BODY_D} fill={`url(#reflect-${id})`} />
        </g>
        {AXLE.map((cx) => (
          <circle key={`well-${cx}`} cx={cx} cy="101" r="31" fill={ILLO.shadow} />
        ))}

        <path d={BODY_D} fill={`url(#carBody-${id})`} />

        {/* The rocker — the darkest plane, and what grounds the car. */}
        <path d="M121,105.5H279V112H121Z" fill={ILLO.carRocker} opacity="0.85" />
        <path d="M20,104H55L55.5,112H22C19,111 17,108 16,104Z" fill={ILLO.carRocker} opacity="0.55" />
        <path d="M358,105L388,104L386,110L360,111Z" fill={ILLO.carRocker} />

        {/* The shoulder, then the crease along the flank, low and long. */}
        <path
          d="M26,70C110,60 250,58 391,80"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M64,94C150,91 260,91 366,95"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Glasshouse: the well, a driver behind it, the glass, a reflection
            streak, the B-pillar, and the bright trim that separates the DLO
            from the body. */}
        <path d={GLASS_D} fill={ILLO.glassLow} />
        <g opacity="0.85">
          <circle cx="238" cy="37.6" r="6.6" fill={ILLO.bodyLight} />
          <path d="M224,54Q226,44.6 238,44.6Q250,44.6 252,54Z" fill={ILLO.bodyLight} />
        </g>
        <path d={GLASS_D} fill={`url(#glass-${id})`} />
        <path d="M154,28L176,24L146,56H122Z" fill="rgba(255,255,255,0.07)" />
        <path d="M192,24.4L200,24V54.4L192,54.8Z" fill={ILLO.carRocker} />
        <path
          d={GLASS_D}
          fill="none"
          stroke={ILLO.hub}
          strokeWidth="1.3"
          strokeOpacity="0.85"
          strokeLinejoin="round"
        />

        {/* Shut lines, handles, mirror — small, and what stops a car reading
            as a solid lozenge. */}
        <path d="M200,57L202,105" stroke={ILLO.carRocker} strokeOpacity="0.45" strokeWidth="0.9" />
        <path
          d="M130,58C128,80 128,92 132,103"
          fill="none"
          stroke={ILLO.carRocker}
          strokeOpacity="0.3"
          strokeWidth="0.9"
        />
        <rect x="154" y="63" width="15" height="2.6" rx="1.3" fill={ILLO.hub} opacity="0.7" />
        <rect x="244" y="62" width="15" height="2.6" rx="1.3" fill={ILLO.hub} opacity="0.7" />
        <path d="M282,53C285,47.5 296,47 301,51L299.5,57H285Z" fill={ILLO.carMid} />
        <path
          d="M284,51.5C288,48.4 295,48.2 300,50.6"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
        />

        {/* Lights: presence, not glow. */}
        <path d={HEAD_D} fill="rgba(255,255,255,0.75)" />
        <path d={TAIL_D} fill={ILLO.fault} opacity="0.75" />

        {/* Charge port, on the rear quarter where a port belongs. The glow and
            the dot together are what read at cover scale. */}
        <rect
          x={PORT.x - 7}
          y={PORT.y - 5.5}
          width="14"
          height="11"
          rx="3.2"
          fill={ILLO.carMid}
          stroke={ILLO.carRocker}
          strokeOpacity="0.5"
          strokeWidth="0.7"
        />
        <circle cx={PORT.x} cy={PORT.y} r="11" fill={`url(#port-${id})`} />
        <circle cx={PORT.x} cy={PORT.y} r="4.4" fill={ILLO.live} opacity="0.95" />

        {/* Wheels. Half the height of the car, with an open five-spoke face. */}
        {AXLE.map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="100" r="27" fill={ILLO.tyre} />
            <circle cx={cx} cy="100" r="24.6" fill="none" stroke={ILLO.rim} strokeWidth="2.4" />
            <circle cx={cx} cy="100" r="19.5" fill={`url(#rim-${id})`} />
            <g transform={`translate(${cx} 100)`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <path
                  key={a}
                  d="M-1.6,-4.2L-4.4,-18.3Q0,-19.7 4.4,-18.3L1.6,-4.2Z"
                  transform={`rotate(${a})`}
                  fill={ILLO.hub}
                  opacity="0.65"
                />
              ))}
              <circle r="18.6" fill="none" stroke={ILLO.hub} strokeWidth="0.8" opacity="0.5" />
              <circle r="4" fill={ILLO.hub} opacity="0.9" />
            </g>
          </g>
        ))}

        {/* Atmosphere, over the silhouette only. */}
        {haze > 0 && (
          <g fill={ILLO.skyHaze} opacity={haze} aria-hidden>
            <path d={BODY_D} />
            {AXLE.map((cx) => (
              <circle key={cx} cx={cx} cy="100" r="27" />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}

/* ── The attendant ────────────────────────────────────────────────────
 *
 * Drawn 160 tall with the feet on y=160, then placed so they stand on y=100
 * of the published 60x104 box.
 *
 * The uniform is the one in valet-greet-v2.webp: white shirt, dark waistcoat,
 * dark trousers, and a single orange name badge. The cap went because our
 * people do not wear one, and because a cap plus a boiler suit read as a
 * forecourt attendant from 1970 rather than as the service this sells.
 */
const VALET_PLACE = "translate(1.88 -12.5) scale(0.703)";

const sleeveOf = (d: string) => (
  <>
    <path d={d} fill="none" stroke={ILLO.uniform} strokeWidth="5.8" strokeLinecap="round" />
    <path
      d={d}
      fill="none"
      stroke={ILLO.uniformShade}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.55"
      transform="translate(1.2 0)"
    />
  </>
);
const handAt = (x: number, y: number) => <circle cx={x} cy={y} r="3.1" fill={ILLO.skin} />;

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
      <ellipse cx="30" cy="100" rx="11" ry="2.2" fill={ILLO.shadow} opacity="0.32" />
      <g transform={VALET_PLACE}>
        {/* Legs and shoes */}
        <rect x="31.6" y="96" width="8" height="59" rx="3.6" fill={ILLO.garment} />
        <rect x="40.4" y="96" width="8" height="59" rx="3.6" fill={ILLO.garment} />
        <rect x="44.6" y="98" width="3.4" height="54" rx="1.7" fill={ILLO.shadow} opacity="0.35" />
        <path
          d="M29.4,153.6H39.6A2,2 0 0 1 41.6,155.6V158.4A1.4,1.4 0 0 1 40.2,159.8H28.2A1.4,1.4 0 0 1 26.8,158.4V157.4A3.6,3.6 0 0 1 29.4,153.6Z"
          fill={ILLO.shadow}
        />
        <path
          d="M50.6,153.6H40.4A2,2 0 0 0 38.4,155.6V158.4A1.4,1.4 0 0 0 39.8,159.8H51.8A1.4,1.4 0 0 0 53.2,158.4V157.4A3.6,3.6 0 0 0 50.6,153.6Z"
          fill={ILLO.shadow}
        />
        <rect x="30" y="94.6" width="20" height="4.4" rx="1" fill={ILLO.shadow} />

        {/* Neck, shirt, waistcoat, tie, collar, badge */}
        <rect x="36.6" y="44" width="6.8" height="11" rx="2" fill={ILLO.skinShade} />
        <path d="M25,60Q26,53 33,52H47Q54,53 55,60L52.5,97H27.5Z" fill={ILLO.uniform} />
        <path
          d="M27.4,62Q27.4,56 33,55H36.2L40,71L43.8,55H47Q52.6,56 52.6,62L51.2,98L40,101.4L28.8,98Z"
          fill={ILLO.body}
        />
        <path
          d="M40,71L43.8,55H47Q52.6,56 52.6,62L51.2,98L40,101.4Z"
          fill={ILLO.bodyDark}
          opacity="0.75"
        />
        <path d="M38.6,55.5H41.4L40.9,58L42,68L40,71L38,68L39.1,58Z" fill={ILLO.shadow} />
        <path d="M35.4,52.6L40,57.2L44.6,52.6L43,51.6L40,54.8L37,51.6Z" fill={ILLO.uniform} />
        <circle cx="40" cy="79" r="0.9" fill={ILLO.seam} />
        <circle cx="40" cy="87" r="0.9" fill={ILLO.seam} />
        <rect x="44.6" y="63.6" width="5.6" height="2" rx="0.5" fill={ILLO.live} />

        {/* Arms and what they are holding */}
        {holding === "terminal" ? (
          <>
            {sleeveOf("M27,58C23,68 23,79 31,84")}
            {sleeveOf("M53,58C57,68 57,79 49,84")}
            <rect x="31.5" y="76" width="17" height="13" rx="2" fill={ILLO.bodyLight} />
            <rect x="33.3" y="77.8" width="13.4" height="6.6" rx="1" fill={ILLO.recess} />
            <rect x="35" y="79.8" width="10" height="1.3" rx="0.6" fill={ILLO.live} />
            <rect x="35" y="82" width="6" height="1" rx="0.5" fill={ILLO.seam} />
            <rect x="35" y="85.6" width="10" height="1.6" rx="0.8" fill={ILLO.recess} />
            {handAt(31.6, 85)}
            {handAt(48.4, 85)}
          </>
        ) : holding === "cable" ? (
          <>
            {sleeveOf("M27,58C24,70 23.5,80 23.8,91")}
            {handAt(23.8, 93.5)}
            {sleeveOf("M53,58C60,64 66,72 72,80")}
            {/* The coupler in hand, held the way it is carried to the car */}
            <g transform="translate(75 84) rotate(28)">
              <rect x="-4.6" y="-8" width="9.2" height="7.5" rx="2.4" fill={ILLO.silverMid} />
              <path d="M-4,-1.5H4L3.3,11Q3,14.6 0,15Q-3,14.6 -3.3,11Z" fill={ILLO.silverTop} />
              <circle cx="0" cy="2.4" r="1.2" fill={ILLO.silverLow} />
              <rect x="-1.9" y="14" width="3.8" height="4.4" rx="1" fill={ILLO.shadow} />
            </g>
            {handAt(73.5, 82)}
          </>
        ) : (
          <>
            {sleeveOf("M27,58C24,70 23.5,80 23.8,91")}
            {handAt(23.8, 93.5)}
            {sleeveOf("M53,58C58,68 61,74 59,79")}
            {/* A tray: one cup, one bag. The service, carried to the window. */}
            <path d="M50,79.2H76" stroke={ILLO.uniformShade} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M55,69.6H62.4L61.4,78H56Z" fill={ILLO.uniform} />
            <rect x="54.4" y="67.8" width="8.6" height="2.2" rx="0.8" fill={ILLO.recess} />
            <rect x="55.5" y="72.2" width="6.4" height="2.8" fill={ILLO.live} />
            <rect x="64.2" y="67.4" width="9.6" height="10.6" rx="1" fill={ILLO.heat} />
            <path d="M64.2,70.2H73.8" stroke={ILLO.recess} strokeWidth="0.8" opacity="0.5" />
            <circle cx="69" cy="74" r="1.6" fill={ILLO.live} />
            {handAt(59.5, 79.6)}
          </>
        )}

        {/* Head. Features are the point: a jaw that tapers, a brow above the
            eyes, and enough contrast in `feature` to survive downscaling. */}
        <ellipse cx="30.6" cy="35.6" rx="1.7" ry="2.7" fill={ILLO.skinShade} />
        <ellipse cx="49.4" cy="35.6" rx="1.7" ry="2.7" fill={ILLO.skinShade} />
        <ellipse cx="40" cy="34.6" rx="9.6" ry="11" fill={ILLO.skin} />
        <path d="M40,23.6A9.6,11 0 0 1 40,45.6Z" fill={ILLO.skinShade} opacity="0.22" />
        <path
          d="M30.3,33.5Q29.5,21.5 40,21.3Q50.5,21.5 49.7,33.5Q48.6,27.4 43,26.6Q36,27 33.4,28.6Q31.2,30.4 30.3,33.5Z"
          fill={ILLO.feature}
        />
        <path
          d="M34.6,33.2Q36.3,32.3 38,32.9M42,32.9Q43.7,32.3 45.4,33.2"
          fill="none"
          stroke={ILLO.feature}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <ellipse cx="36.3" cy="36" rx="1.1" ry="1.3" fill={ILLO.feature} />
        <ellipse cx="43.7" cy="36" rx="1.1" ry="1.3" fill={ILLO.feature} />
        <path d="M40,37.6V40" stroke={ILLO.skinShade} strokeWidth="1.1" strokeLinecap="round" />
        <path
          d="M37.2,41.4Q40,43.6 42.8,41.4"
          fill="none"
          stroke={ILLO.feature}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ── The charging cabinet ─────────────────────────────────────────────
 *
 * Drawn with the front face 100 wide and 235 tall, the plinth ending at
 * y=247 and the cable arms reaching up to y=-19, then placed so the plinth
 * lands on y=85 of the published 48x88 box.
 *
 * At 40px wide only a handful of things survive: the silhouette with its
 * arms, the wordmark band, the status dashes, the screen, and the two
 * couplers. Those are drawn with weight; everything else is there for the
 * covers that render the unit large.
 *
 * Colour semantics, unchanged: dim at rest, GREEN when the bay is free,
 * brand orange when power is moving.
 */
const UNIT_PLACE = "translate(8.25 7.2) scale(0.315)";
/** Local x of each holster. The NACS one is where a live cable leaves from,
 *  which is what holsterAt() in guide-cover.tsx is derived from. */
const HOLSTER = { ccs: 22, nacs: 78, y: 140 } as const;

const dockedCable = (d: string) => (
  <>
    {CABLE_CASING.map((c, i) => (
      <path
        key={i}
        d={d}
        fill="none"
        stroke={c.stroke}
        strokeWidth={c.width}
        strokeLinecap="round"
        opacity={"opacity" in c ? c.opacity : 1}
      />
    ))}
  </>
);

export function ChargerSVG({
  id,
  still = false,
  free = false,
  className = "",
  style = {},
  active = false,
  done = false,
  out = "nacs",
}: {
  /** Namespaces this instance's gradient ids. */
  id: string;
  /** Hold every animation still — for prefers-reduced-motion. */
  still?: boolean;
  /** Bay is available. The real cabinet's status dashes are GREEN when free. */
  free?: boolean;
  className?: string;
  style?: React.CSSProperties;
  active?: boolean;
  done?: boolean;
  /** Which coupler is in use while `active`. It is drawn out of its holster,
   *  so a scene's own cable has somewhere honest to come from. */
  out?: "nacs" | "ccs";
}) {
  const lit = active || done;
  const status = free ? ILLO.ok : lit ? ILLO.live : ILLO.idle;
  return (
    <svg viewBox="0 0 48 88" className={className} style={style}>
      <defs>
        <linearGradient id={`unit-${id}`} x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor={ILLO.cabTop} />
          <stop offset="60%" stopColor={ILLO.cabMid} />
          <stop offset="100%" stopColor={ILLO.cabLow} />
        </linearGradient>
        <linearGradient id={`crown-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`plinth-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={ILLO.graphiteMid} />
          <stop offset="100%" stopColor={ILLO.graphiteLow} />
        </linearGradient>
        <linearGradient id={`screen-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16233B" />
          <stop offset="100%" stopColor={ILLO.glass} />
        </linearGradient>
        <radialGradient id={`bloom-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ILLO.live} stopOpacity="0.5" />
          <stop offset="100%" stopColor={ILLO.live} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`blade-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={status} stopOpacity="0.7" />
          <stop offset="100%" stopColor={status} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground contact */}
      <ellipse cx="24" cy="85.5" rx="16" ry="2.6" fill={ILLO.shadow} opacity="0.38" />

      <g transform={UNIT_PLACE}>
        {/* Cable arms on the crown, which is how the leads stay off the floor */}
        {[
          { post: 19, bar: -19, hook: -19 },
          { post: 76, bar: 76, hook: 115 },
        ].map((a) => (
          <g key={a.post}>
            <rect x={a.post} y="-16" width="5" height="13" fill={ILLO.silverLow} />
            <rect x={a.bar} y="-19.5" width="43" height="4.8" rx="1.4" fill={ILLO.silverMid} />
            <rect x={a.hook} y="-19.5" width="4" height="10.5" rx="1.3" fill={ILLO.silverMid} />
            <rect x={a.bar} y="-19.5" width="43" height="1.2" rx="0.6" fill={ILLO.silverTop} opacity="0.7" />
          </g>
        ))}

        {/* Cabinet: the flank in shadow, the crown cap, then the front face */}
        <path d="M-7,3.6L0,1V235H-7Z" fill={ILLO.cabShade} />
        <rect x="-8" y="-3.8" width="109" height="5.4" rx="1.3" fill={ILLO.cabTop} />
        <rect x="0" y="1.6" width="100" height="233.4" fill={`url(#unit-${id})`} />
        <rect x="0" y="1.6" width="100" height="70" fill={`url(#crown-${id})`} />
        <rect x="94" y="1.6" width="6" height="233.4" fill={ILLO.shadow} opacity="0.18" />
        <rect
          x="4"
          y="5"
          width="92"
          height="226"
          rx="2"
          fill="none"
          stroke={ILLO.cabTop}
          strokeWidth="0.6"
          opacity="0.45"
        />

        {/* Wordmark across the top, as on the cabinet */}
        <text
          x="50"
          y="19.6"
          textAnchor="middle"
          fontSize="11.2"
          fontWeight="800"
          letterSpacing="0.2"
        >
          <tspan fill={ILLO.hub}>HUB</tspan>
          <tspan fill={ILLO.live}>CHARGE</tspan>
        </text>
        <rect x="26" y="23" width="48" height="1.6" rx="0.8" fill={ILLO.hub} opacity="0.45" />

        {/* Status dashes. Two of them, under the wordmark, exactly as the unit
            wears them — and the single strongest "is this bay free" cue. */}
        {lit || free ? (
          <ellipse cx="50" cy="34.3" rx="24" ry="6.5" fill={`url(#blade-${id})`} />
        ) : null}
        {[33, 53].map((x) => (
          <rect key={x} x={x} y="33" width="14" height="2.6" rx="1.3" fill={status} opacity={free || lit ? 1 : 0.5}>
            {active && !done && !still && (
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
            )}
          </rect>
        ))}

        {/* Touchscreen — the dominant face, inset behind glass */}
        <rect x="31" y="44" width="38" height="66" rx="3.6" fill={ILLO.shadow} />
        <rect x="33.5" y="47" width="33" height="60" rx="2" fill={`url(#screen-${id})`} />
        <rect x="36" y="50" width="28" height="1.2" rx="0.6" fill={ILLO.edge} opacity="0.4" />

        {lit && (
          <ellipse cx="50" cy="70" rx="26" ry="30" fill={`url(#bloom-${id})`} opacity={done ? 0.5 : 0.75} />
        )}

        {done ? (
          /* session complete */
          <>
            <circle cx="50" cy="70" r="10.5" fill={ILLO.ok} fillOpacity="0.14" stroke={ILLO.ok} strokeWidth="1.8" />
            <path
              d="M45.2,70.6L48.7,74.1L55,66.8"
              fill="none"
              stroke={ILLO.ok}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : active ? (
          /* filling arc — reads as progress even at 36px */
          <>
            <circle cx="50" cy="70" r="10.5" fill="none" stroke={ILLO.idle} strokeWidth="2.4" opacity="0.55" />
            <circle
              cx="50"
              cy="70"
              r="10.5"
              fill="none"
              stroke={ILLO.live}
              strokeWidth="2.4"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="38"
              transform="rotate(-90 50 70)"
            >
              {!still && (
                <animate attributeName="stroke-dashoffset" values="62;14;62" dur="3s" repeatCount="indefinite" />
              )}
            </circle>
            <path d="M51.2,63.4L45.6,71.2H49.6L48.5,76.8L54.4,68.6H50.4Z" fill={ILLO.liveGlow} />
          </>
        ) : (
          /* at rest — a battery, waiting */
          <>
            <rect x="41" y="64" width="14" height="9" rx="2" fill="none" stroke={ILLO.idle} strokeWidth="1.6" />
            <rect x="55.6" y="66.4" width="2" height="4" rx="0.8" fill={ILLO.idle} />
            <rect x="43" y="66" width="5" height="5" rx="0.6" fill={ILLO.idle} opacity="0.8" />
          </>
        )}

        {/* Card reader under the screen */}
        <rect x="43.5" y="116" width="13" height="24" rx="2.6" fill={ILLO.recess} />
        <circle cx="50" cy="119.4" r="0.95" fill={ILLO.cold} />
        <path
          d="M48.2,125.5q1.8,3.2 0,6.4M50.6,124.2q2.8,4.5 0,9"
          fill="none"
          stroke={ILLO.seam}
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* CCS1 and NACS, labelled on the face the way the cabinet labels them */}
        <rect x="16" y="127" width="12" height="1.8" rx="0.9" fill={ILLO.hub} opacity="0.5" />
        <rect x="72" y="127" width="12" height="1.8" rx="0.9" fill={ILLO.hub} opacity="0.5" />
        {[HOLSTER.ccs, HOLSTER.nacs].map((x) => (
          <g key={x}>
            <rect x={x - 7} y="134" width="14" height="12" rx="3.5" fill={ILLO.bodyDark} />
            <rect x={x - 5} y="136" width="10" height="8" rx="2.5" fill={ILLO.shadow} />
          </g>
        ))}

        {/* Vents and the graphite plinth it stands on */}
        {[212, 216, 220].map((y) => (
          <rect key={y} x="34" y={y} width="32" height="0.8" rx="0.4" fill={ILLO.cabTop} opacity="0.4" />
        ))}
        <rect x="-7" y="235" width="108" height="12" rx="1.4" fill={`url(#plinth-${id})`} />
        <rect x="-7" y="235" width="108" height="1.2" fill={ILLO.edge} opacity="0.55" />

        {/* The CCS1 lead */}
        {!(active && out === "ccs") && (
        <g>
          {dockedCable("M-17,-9C-34,50 -36,208 -18,232C-6,248 -2,199 13,162.3")}
          <g transform="translate(22 140) rotate(22)">
            <rect x="-6" y="-2" width="12" height="8" rx="2.6" fill={ILLO.bodyDark} />
            <rect x="-1.5" y="-3.4" width="3" height="3" rx="0.8" fill={ILLO.seam} />
            <path d="M-5,5H5L4,17Q3.6,21 0,21.5Q-3.6,21 -4,17Z" fill={ILLO.bodyDark} />
            <path d="M-3.4,6.6L-2.7,16.6" stroke={ILLO.seam} strokeWidth="0.9" strokeLinecap="round" />
            <rect x="-2.2" y="20" width="4.4" height="4.4" rx="1" fill={ILLO.shadow} />
          </g>
        </g>
        )}

        {/* The NACS lead. Whichever coupler `out` names leaves its holster
            while power is moving, because that is where the cable the scene
            draws around this unit is coming from. */}
        {!(active && out === "nacs") && (
          <g>
            {dockedCable("M117,-9C134,50 136,208 118,232C106,248 102,199 87,162.3")}
            <g transform="translate(78 140) rotate(-22)">
              <rect x="-4.6" y="-2" width="9.2" height="7.5" rx="2.4" fill={ILLO.silverMid} />
              <path d="M-4,4.5H4L3.3,17Q3,20.6 0,21Q-3,20.6 -3.3,17Z" fill={ILLO.silverTop} />
              <circle cx="0" cy="8.4" r="1.2" fill={ILLO.silverLow} />
              <rect x="-1.9" y="20" width="3.8" height="4.4" rx="1" fill={ILLO.shadow} />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}

/**
 * The cable.
 *
 * Casing is ink, energy is orange, and both scenes that draw one get the
 * identical treatment. The head is the NACS coupler the cabinet carries,
 * rather than a generic block.
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
    <svg viewBox={isMobile ? "0 0 75 35" : "0 0 60 30"} className={className} fill="none">
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

      {/* The NACS coupler, pointing into the port */}
      <g transform={`translate(${endX} ${endY}) rotate(-118)`}>
        <rect x="-2.6" y="-1.2" width="5.2" height="4.2" rx="1.4" fill={ILLO.silverMid} />
        <path d="M-2.3,2.6H2.3L1.9,9.6Q1.7,11.6 0,11.8Q-1.7,11.6 -1.9,9.6Z" fill={ILLO.silverTop} />
        <circle cx="0" cy="4.8" r="0.7" fill={active ? ILLO.live : ILLO.silverLow} />
        <rect x="-1.1" y="11.2" width="2.2" height="2.6" rx="0.6" fill={ILLO.shadow} />
      </g>
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
