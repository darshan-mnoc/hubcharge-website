import { ILLO } from "@/lib/illustration";

/**
 * Drawn covers for the guide mastheads.
 *
 * WHY THESE EXIST
 * Six rounds of photography failed the same way, and none of it was a cropping
 * mistake — it is what happens when twenty unrelated pictures are asked to
 * behave as one system. A 3:2 frame cut a third off every square infographic;
 * `etiquette` lost two of its five rules. The pictures carried text nobody
 * could edit: HUB(NARGE on the homepage, "FTZT CKARGING & MITE SAIAVETIVE" on
 * six guides, "$0.28 / kWh" on a page that prices by time, and "Level 1 —
 * Best for Homes" sitting directly above copy saying the opposite.
 *
 * A drawing fixes all of that by construction. It is authored at the frame's
 * own ratio, so it cannot be cropped wrong. And every cover is built from the
 * same parts, so eighteen guides finally look like one publication.
 *
 * ON TEXT: the original no-text rule was about *generated* text, which kept
 * arriving misspelled. Authored SVG text has no such failure mode — we type
 * it, it renders exactly. So every plate now carries the wordmark, set as
 * real <text> in the site's own sans, split HUB/CHARGE like the logo. It is
 * the only text allowed here; motifs still make no written claims.
 *
 * THE RULES
 * The palette is already written in lib/illustration.ts and journey-battery
 * already draws to it: hardware is the ink ramp, energy is brand orange,
 * nothing else. A viewer learns the colour code once — orange means power is
 * moving — and it holds across every cover.
 *
 * Everything sits on FLOOR. A shared bay line and one soft bloom behind the
 * motif are what make the family read; the motif is what makes each guide
 * itself.
 *
 * This is a server component on purpose: no hooks, no client bundle, and the
 * gradient ids are namespaced by motif key rather than useId, because exactly
 * one cover renders per page.
 */

const W = 300;
const H = 200;
/** Everything stands on this line, so no cover floats. */
const FLOOR = 152;

/** A charging curve: quick climb from a low battery, a plateau, then a long
 *  taper. Drawn asymmetric on purpose — a symmetrical hump would say charging
 *  slows as much at the start as at the end, which is the opposite of the
 *  thing the speed guide exists to explain. */
const CURVE = "M56,116 C74,116 86,62 104,60 C128,58 140,64 158,80 C186,104 206,120 244,126";

/* ── Primitives ──────────────────────────────────────────────────── */

/** The charger. Same silhouette language as ChargerSVG: soft crown, inset
 *  screen, plinth wider than the body so it sits rather than hovers. */
function Unit({
  id,
  x,
  w = 30,
  h = 74,
  lit = false,
}: {
  id: string;
  x: number;
  w?: number;
  h?: number;
  lit?: boolean;
}) {
  const l = x - w / 2;
  const r = x + w / 2;
  const top = FLOOR - h;
  const crown = w * 0.32;
  const body = `M${l},${top + crown} Q${l},${top} ${x},${top} Q${r},${top} ${r},${top + crown} L${r},${FLOOR - 7} H${l} Z`;
  const sw = w * 0.6;
  return (
    <g>
      <ellipse cx={x} cy={FLOOR + 1.5} rx={w * 0.66} ry={2.4} fill={ILLO.shadow} opacity={0.42} />
      <path
        d={`M${l - 2.5},${FLOOR - 7} H${r + 2.5} a2.4,2.4 0 0 1 0,7.4 H${l - 2.5} a2.4,2.4 0 0 1 0,-7.4 Z`}
        fill={ILLO.unitLow}
      />
      <path d={body} fill={`url(#${id}-unit)`} />
      <path d={body} fill="none" stroke={ILLO.hub} strokeWidth={1.6} strokeOpacity={0.95} strokeLinejoin="round" />
      {/* screen, inset behind glass */}
      <rect x={x - sw / 2} y={top + crown * 0.7} width={sw} height={h * 0.34} rx={2.4} fill={ILLO.shadow} />
      <rect
        x={x - sw / 2 + 0.7}
        y={top + crown * 0.7 + 0.7}
        width={sw - 1.4}
        height={h * 0.34 - 1.4}
        rx={2}
        fill={`url(#${id}-screen)`}
      />
      {/* status pips — the only place a unit shows life */}
      {[-1, 1].map((s) => (
        <rect
          key={s}
          x={x + s * 2 - (s < 0 ? 6.5 : -2.5)}
          y={top + crown * 0.7 + h * 0.34 + 3.5}
          width={4}
          height={1.8}
          rx={0.9}
          fill={lit ? ILLO.live : ILLO.idle}
        />
      ))}
    </g>
  );
}

/** A car in profile. Kept to a clean silhouette — at this size any more
 *  detail turns to mud. */
function CarSide({
  x,
  y = FLOOR,
  s = 1,
  flip = false,
  port,
}: {
  x: number;
  y?: number;
  s?: number;
  flip?: boolean;
  /** Draw a charge socket on the named wing. Cables must land on one of
   *  these — a cable ending in mid-air is the drawn equivalent of the
   *  floating-cable renders these covers replaced. */
  port?: "front" | "rear";
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={1.5} rx={34} ry={2.2} fill={ILLO.shadow} opacity={0.4} />
      <path
        d="M-31,0 L-31,-9 Q-31,-13 -25,-14 L-14,-16 L-6,-24 Q-3,-26.5 3,-26.5 L12,-26.5 Q18,-26.5 21,-23.5 L27,-16.5 Q31,-15.5 31,-11 L31,0 Z"
        fill={ILLO.carMid}
      />
      <path
        d="M-31,0 L-31,-9 Q-31,-13 -25,-14 L-14,-16 L-6,-24 Q-3,-26.5 3,-26.5 L12,-26.5 Q18,-26.5 21,-23.5 L27,-16.5 Q31,-15.5 31,-11 L31,0 Z"
        fill="none"
        stroke={ILLO.hub}
        strokeWidth={1.5}
        strokeOpacity={0.9}
        strokeLinejoin="round"
      />
      {/* glasshouse */}
      <path d="M-11,-16.5 L-4.5,-23 Q-2.5,-24.6 2,-24.6 L11,-24.6 Q16,-24.6 18.5,-22 L23,-17 Z" fill={ILLO.glassMid} />
      <path d="M-11,-16.5 L-4.5,-23 Q-2.5,-24.6 2,-24.6 L4,-24.6 L2,-16.5 Z" fill={ILLO.glassTop} opacity={0.5} />
      {/* rocker shadow */}
      <rect x={-31} y={-2.4} width={62} height={2.4} fill={ILLO.carRocker} />
      {[-18, 18].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={0} r={6.6} fill={ILLO.tyre} />
          <circle cx={wx} cy={0} r={3} fill={ILLO.rim} />
        </g>
      ))}
      {port && (
        <g transform={`translate(${port === "front" ? -26.5 : 26.5} -12)`}>
          <rect x={-3.2} y={-4} width={6.4} height={8} rx={1.6} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={0.9} strokeOpacity={0.9} />
          {/* orange only because power is moving through it */}
          <circle cx={0} cy={0} r={1.4} fill={ILLO.live} />
        </g>
      )}
    </g>
  );
}

/** Cable, drawn with the three-stroke casing every scene uses, scaled to
 *  this viewBox. Orange only when power is actually moving. */
function Cable({ d, live = false }: { d: string; live?: boolean }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={ILLO.shadow} strokeWidth={3.4} />
      <path d={d} stroke={live ? ILLO.liveDim : ILLO.body} strokeWidth={2.2} />
      <path d={d} stroke={live ? ILLO.live : ILLO.seam} strokeWidth={0.8} strokeOpacity={live ? 0.9 : 0.55} />
    </g>
  );
}

/** A connector face. `big` is CCS1's proportions against NACS's. */
function Plug({ x, y, r, big = false, lit = false }: { x: number; y: number; r: number; big?: boolean; lit?: boolean }) {
  const pin = lit ? ILLO.live : ILLO.seam;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.3} strokeOpacity={0.9} />
      {/* three small signal pins over two large power pins — the real layout */}
      {[-1, 0, 1].map((i) => (
        <circle key={i} cx={x + i * r * 0.42} cy={y - r * 0.38} r={r * 0.11} fill={ILLO.seam} />
      ))}
      {[-1, 1].map((i) => (
        <circle key={i} cx={x + i * r * 0.3} cy={y + r * 0.22} r={r * 0.22} fill={pin} />
      ))}
      {big && (
        /* CCS1's DC pair, bolted under the AC face */
        <g>
          <path
            d={`M${x - r * 0.62},${y + r * 0.5} h${r * 1.24} a${r * 0.55},${r * 0.55} 0 0 1 0,${r * 0.95} h${-r * 1.24} a${r * 0.55},${r * 0.55} 0 0 1 0,${-r * 0.95} Z`}
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={0.7}
            strokeOpacity={0.45}
          />
          {[-1, 1].map((i) => (
            <circle key={i} cx={x + i * r * 0.33} cy={y + r * 0.98} r={r * 0.26} fill={pin} />
          ))}
        </g>
      )}
    </g>
  );
}

/** A battery cell. `from`/`to` light a band of it, 0–1 left to right. */
function Cell({
  x,
  y,
  w = 76,
  h = 34,
  from = 0,
  to = 0,
  tone = ILLO.live,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  from?: number;
  to?: number;
  tone?: string;
}) {
  const l = x - w / 2;
  const t = y - h / 2;
  const inset = 4;
  const iw = w - inset * 2;
  return (
    <g>
      <rect x={l} y={t} width={w} height={h} rx={5} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.2} strokeOpacity={0.85} />
      <rect x={l + w} y={y - h * 0.16} width={3.6} height={h * 0.32} rx={1.4} fill={ILLO.edge} opacity={0.6} />
      {to > from && (
        <rect
          x={l + inset + iw * from}
          y={t + inset}
          width={iw * (to - from)}
          height={h - inset * 2}
          rx={2.4}
          fill={tone}
          opacity={0.9}
        />
      )}
      {/* the cells you can see through */}
      {[0.25, 0.5, 0.75].map((p) => (
        <rect key={p} x={l + inset + iw * p - 0.4} y={t + inset} width={0.8} height={h - inset * 2} fill={ILLO.stage} opacity={0.55} />
      ))}
    </g>
  );
}

/** A roofline — house or block, depending on width and pitch. */
function Roof({ x, w = 54, h = 40, pitch = 12 }: { x: number; w?: number; h?: number; pitch?: number }) {
  const l = x - w / 2;
  const r = x + w / 2;
  const t = FLOOR - h;
  return (
    <g>
      <path d={`M${l},${FLOOR} L${l},${t} L${x},${t - pitch} L${r},${t} L${r},${FLOOR} Z`} fill={ILLO.bodyDark} />
      <path
        d={`M${l},${FLOOR} L${l},${t} L${x},${t - pitch} L${r},${t} L${r},${FLOOR} Z`}
        fill="none"
        stroke={ILLO.hub}
        strokeWidth={1.4}
        strokeOpacity={0.8}
        strokeLinejoin="round"
      />
      {/* windows, so it reads as a building and not a shape */}
      {[-1, 1].map((i) => (
        <rect key={i} x={x + i * w * 0.2 - 4} y={t + 8} width={8} height={7} rx={1.2} fill={ILLO.glassMid} opacity={0.8} />
      ))}
    </g>
  );
}

/** A stop along a road. Lit ones are where power is. */
function Pip({ x, y, r = 3.4, lit = false }: { x: number; y: number; r?: number; lit?: boolean }) {
  return (
    <g>
      {lit && <circle cx={x} cy={y} r={r * 2.6} fill={ILLO.live} opacity={0.14} />}
      <circle cx={x} cy={y} r={r} fill={lit ? ILLO.live : ILLO.idle} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={ILLO.stage} strokeWidth={0.8} />
    </g>
  );
}

/** The wordmark, on every plate. Two-tone like the real logo: HUB in the
 *  brightest structural grey, CHARGE in the energy orange. Inline SVG text
 *  inherits the page's sans stack, so this sets in the same face as the
 *  chrome around it. At the smallest masthead (~348px wide) 10.5 viewBox
 *  units render at ~12px — legible, and impossible to misspell. */
function Wordmark() {
  return (
    <text
      x={16}
      y={27}
      fontSize={10.5}
      fontWeight={800}
      letterSpacing="0.4"
    >
      <tspan fill={ILLO.hub}>HUB</tspan>
      <tspan fill={ILLO.live}>CHARGE</tspan>
    </text>
  );
}

/* ── The plate ───────────────────────────────────────────────────── */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-plate`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.stage} />
        <stop offset="100%" stopColor="#101E36" />
      </linearGradient>
      <linearGradient id={`${id}-unit`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={ILLO.bodyLight} />
        <stop offset="45%" stopColor={ILLO.unitTop} />
        <stop offset="100%" stopColor={ILLO.unitMid} />
      </linearGradient>
      <linearGradient id={`${id}-screen`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#16233B" />
        <stop offset="100%" stopColor={ILLO.glass} />
      </linearGradient>
      <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.live} stopOpacity={0.17} />
        <stop offset="100%" stopColor={ILLO.live} stopOpacity={0} />
      </radialGradient>
    </defs>
  );
}

/* ── Motifs ──────────────────────────────────────────────────────── */

type Motif = { label: string; draw: (id: string) => React.ReactNode };

export const COVERS: Record<string, Motif> = {
  /* the product, whole */
  station: {
    label: "A HubCharge unit with a car connected to it.",
    draw: (id) => (
      <>
        <Unit id={id} x={72} lit />
        <CarSide x={190} s={1.15} port="front" />
        <Cable d="M87,104 C112,104 132,132 157,137" live />
      </>
    ),
  },

  /* what a visit is, as three beats */
  arrival: {
    label: "A car arriving at a unit, with the three steps of a stop marked out.",
    draw: (id) => (
      <>
        <Unit id={id} x={222} lit />
        <CarSide x={112} s={1.05} port="rear" />
        <Cable d="M208,106 C186,106 166,132 142,138" live />
        {[54, 84, 114].map((x, i) => (
          <Pip key={x} x={x} y={176} lit={i === 2} />
        ))}
        <path d="M54,176 H114" stroke={ILLO.idle} strokeWidth={1.2} opacity={0.6} />
      </>
    ),
  },

  /* two plugs, true relative scale */
  connectors: {
    label: "Two charging connectors side by side, one visibly larger than the other.",
    draw: () => (
      <>
        <Cable d="M96,138 C96,152 104,158 116,160" />
        <Cable d="M206,150 C206,162 214,166 226,168" />
        <Plug x={96} y={94} r={22} lit />
        <Plug x={206} y={88} r={30} big lit />
      </>
    ),
  },

  /* plug meeting socket */
  fits: {
    label: "A charging connector aligned with a car's charging port.",
    draw: () => (
      <>
        <Plug x={104} y={100} r={24} lit />
        <g>
          <rect x={168} y={76} width={54} height={48} rx={7} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.2} strokeOpacity={0.85} />
          <circle cx={195} cy={100} r={15} fill={ILLO.stage} />
          <circle cx={195} cy={100} r={15} fill="none" stroke={ILLO.live} strokeWidth={1.6} opacity={0.85} />
        </g>
        <path d="M132,100 H160" stroke={ILLO.live} strokeWidth={1.6} strokeDasharray="4 4" opacity={0.7} />
      </>
    ),
  },

  /* three speeds */
  levels: {
    label:
      "A wall socket, a home wallbox and a DC fast charger side by side, rising in size; the fast charger is lit.",
    draw: (id) => (
      <>
        {/* This used to be three sizes of the same cabinet, which says
            "small, medium, large charger". Level 1 is an ordinary wall
            socket and Level 2 a wallbox — the guide's own copy says exactly
            that, so the drawing now does too. */}
        {/* Level 1 — a wall socket on its wall stub */}
        <g>
          <ellipse cx={79} cy={FLOOR + 1.5} rx={20} ry={2.2} fill={ILLO.shadow} opacity={0.35} />
          <rect x={62} y={110} width={34} height={42} rx={2} fill={ILLO.bodyDark} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.7} />
          <rect x={72} y={118} width={14} height={18} rx={2.6} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={0.8} />
          <circle cx={76.5} cy={124} r={1.2} fill={ILLO.seam} />
          <circle cx={81.5} cy={124} r={1.2} fill={ILLO.seam} />
          <rect x={77.6} y={128.6} width={2.8} height={3.4} rx={1} fill={ILLO.seam} />
        </g>
        {/* Level 2 — a wallbox with its own cable */}
        <g>
          <ellipse cx={151} cy={FLOOR + 1.5} rx={22} ry={2.2} fill={ILLO.shadow} opacity={0.35} />
          <rect x={132} y={92} width={38} height={60} rx={2} fill={ILLO.bodyDark} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.7} />
          <rect x={141} y={100} width={20} height={26} rx={4} fill={`url(#${id}-unit)`} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.9} />
          <circle cx={151} cy={108} r={3} fill={ILLO.glass} stroke={ILLO.edge} strokeWidth={0.6} />
          <Cable d="M151,126 C151,135 159,137 158,144" />
        </g>
        {/* Level 3 — the kind we run */}
        <Unit id={id} x={224} w={32} h={80} lit />
      </>
    ),
  },

  /* the curve */
  curve: {
    label: "A charging curve that rises quickly then tapers, over a battery.",
    draw: () => (
      <>
        <path d={CURVE} fill="none" stroke={ILLO.live} strokeWidth={2.6} strokeLinecap="round" />
        <path d={`${CURVE} L244,140 L56,140 Z`} fill={ILLO.live} opacity={0.09} />
        {[[56, 116], [104, 60], [244, 126]].map(([x, y], i) => (
          <Pip key={x} x={x} y={y} r={3} lit={i === 1} />
        ))}
        <path d="M46,44 V142 H254" fill="none" stroke={ILLO.seam} strokeWidth={0.9} opacity={0.45} />
      </>
    ),
  },

  /* time, priced */
  clock: {
    label: "A clock face with one segment lit, beside a charger.",
    draw: (id) => (
      <>
        <Unit id={id} x={224} lit />
        <circle cx={112} cy={98} r={38} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={1.4} strokeOpacity={0.85} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={112}
            y1={64}
            x2={112}
            y2={68.5}
            stroke={ILLO.hub}
            strokeWidth={1.1}
            strokeOpacity={i % 3 === 0 ? 0.85 : 0.45}
            transform={`rotate(${i * 30} 112 98)`}
          />
        ))}
        <circle
          cx={112}
          cy={98}
          r={30}
          fill="none"
          stroke={ILLO.live}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 30 * 0.28} ${2 * Math.PI * 30}`}
          transform="rotate(-90 112 98)"
        />
        <circle cx={112} cy={98} r={3} fill={ILLO.edge} />
      </>
    ),
  },

  /* one flat block, not a meter */
  flat: {
    label: "A charger screen showing a single solid block rather than a running meter.",
    draw: (id) => (
      <>
        <Unit id={id} x={96} lit />
        <g>
          <rect x={156} y={64} width={104} height={70} rx={7} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.2} strokeOpacity={0.85} />
          <rect x={168} y={78} width={80} height={16} rx={4} fill={ILLO.live} opacity={0.9} />
          {[104, 118].map((y) => (
            <rect key={y} x={168} y={y} width={54} height={6} rx={3} fill={ILLO.idle} opacity={0.7} />
          ))}
        </g>
      </>
    ),
  },

  /* a range of cars */
  fleet: {
    label: "Three different cars side by side.",
    draw: () => (
      <>
        <CarSide x={72} y={FLOOR - 22} s={0.66} />
        <CarSide x={228} y={FLOOR - 22} s={0.66} flip />
        <CarSide x={150} s={1.08} />
      </>
    ),
  },

  /* one bay busy, one free */
  bays: {
    label: "Two charging bays, one occupied and one free with its cable holstered.",
    draw: (id) => (
      <>
        <Unit id={id} x={66} lit />
        <CarSide x={140} s={0.86} port="front" />
        <Cable d="M79,104 C98,104 106,130 117,140" live />
        <Unit id={id} x={244} />
        <Cable d="M254,102 C262,110 262,122 256,132" />
        <rect x={186} y={148} width={92} height={2} rx={1} fill={ILLO.idle} opacity={0.5} />
      </>
    ),
  },

  /* cold on one side, heat on the other */
  climate: {
    label: "A battery shown half in cold conditions and half in heat.",
    draw: () => (
      <>
        <Cell x={150} y={104} w={124} h={52} from={0.08} to={0.42} tone={ILLO.live} />
        {/* cold */}
        <g stroke={ILLO.glassTop} strokeWidth={1.6} strokeLinecap="round" opacity={0.85}>
          {[0, 60, 120].map((a) => (
            <line key={a} x1={64} y1={60} x2={64} y2={42} transform={`rotate(${a} 64 51)`} />
          ))}
          {/* branch ticks on the vertical arm, so it reads flake not asterisk */}
          <path d="M61.4,45.6 L64,48.2 L66.6,45.6" fill="none" />
          <path d="M61.4,56.4 L64,53.8 L66.6,56.4" fill="none" />
        </g>
        <circle cx={64} cy={51} r={1.3} fill={ILLO.glassTop} />
        {/* heat */}
        <circle cx={236} cy={43} r={8} fill={ILLO.live} opacity={0.9} />
        {[0, 45, 90, 135].map((a) => (
          <line
            key={a}
            x1={236}
            y1={29}
            x2={236}
            y2={24}
            stroke={ILLO.live}
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.75}
            transform={`rotate(${a} 236 43)`}
          />
        ))}
      </>
    ),
  },

  /* the band that matters */
  band: {
    label: "A battery with the middle band highlighted rather than the ends.",
    draw: () => (
      <>
        <Cell x={150} y={100} w={150} h={60} from={0.2} to={0.8} />
        <path d="M75,146 H105" stroke={ILLO.idle} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M195,146 H225" stroke={ILLO.idle} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M108,146 H192" stroke={ILLO.live} strokeWidth={2} strokeLinecap="round" />
      </>
    ),
  },

  /* home and away */
  homeAway: {
    label: "A house with a wall charger beside a public charging unit.",
    draw: (id) => (
      <>
        <Roof x={78} w={80} h={54} pitch={16} />
        <rect x={122} y={112} width={9} height={14} rx={2} fill={ILLO.unitMid} stroke={ILLO.edge} strokeWidth={0.7} strokeOpacity={0.5} />
        <Cable d="M127,126 C127,136 134,140 142,142" />
        <path d="M150,58 V150" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.45} />
        <Unit id={id} x={214} lit />
        <CarSide x={252} s={0.6} />
      </>
    ),
  },

  /* no driveway */
  street: {
    label: "A row of apartment buildings with cars parked along the kerb.",
    draw: () => (
      <>
        <Roof x={62} w={62} h={78} pitch={0} />
        <Roof x={132} w={58} h={94} pitch={0} />
        <Roof x={202} w={54} h={66} pitch={0} />
        <CarSide x={92} y={FLOOR + 14} s={0.62} />
        <CarSide x={186} y={FLOOR + 14} s={0.62} flip />
        <path d="M0,168 H300" stroke={ILLO.seam} strokeWidth={1} opacity={0.4} />
        <path d="M20,178 h24 M64,178 h24 M108,178 h24 M152,178 h24 M196,178 h24 M240,178 h24" stroke={ILLO.idle} strokeWidth={1.6} opacity={0.5} />
      </>
    ),
  },

  /* something went wrong */
  fault: {
    label: "A charging cable with a break in it and a warning light.",
    draw: () => (
      <>
        <Plug x={86} y={104} r={22} />
        <Cable d="M108,104 C124,104 130,110 140,112" />
        <Cable d="M182,116 C194,118 202,124 214,126" />
        <g stroke={ILLO.live} strokeWidth={2.4} strokeLinecap="round">
          <line x1={150} y1={100} x2={172} y2={128} />
          <line x1={172} y1={100} x2={150} y2={128} />
        </g>
        <circle cx={161} cy={114} r={26} fill={ILLO.live} opacity={0.1} />
        <Pip x={238} y={104} r={4} lit />
      </>
    ),
  },

  /* asking */
  ask: {
    label: "A charger with a question mark curve beside it.",
    draw: (id) => (
      <>
        <Unit id={id} x={106} />
        <path
          d="M186,74 C186,60 214,58 214,74 C214,86 200,86 200,100"
          fill="none"
          stroke={ILLO.live}
          strokeWidth={4.4}
          strokeLinecap="round"
        />
        <circle cx={200} cy={116} r={3.6} fill={ILLO.live} />
      </>
    ),
  },

  /* a working day */
  shift: {
    label: "A car on a looping route with two charging stops marked.",
    draw: () => (
      <>
        <ellipse cx={150} cy={112} rx={92} ry={46} fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.55} />
        <Pip x={58} y={112} lit />
        <Pip x={242} y={112} lit />
        <CarSide x={150} y={82} s={0.62} />
      </>
    ),
  },

  /* the long way */
  highway: {
    label: "A road running to the horizon with charging stops along it.",
    draw: () => (
      <>
        <path d="M108,150 L138,58 H162 L192,150 Z" fill={ILLO.bodyDark} />
        <path d="M108,150 L138,58 H162 L192,150 Z" fill="none" stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.45} />
        {[[150, 74, 1.6], [150, 96, 2.4], [150, 124, 3.4]].map(([x, y, r]) => (
          <rect key={y} x={x - r / 2} y={y} width={r} height={r * 3} rx={r / 2} fill={ILLO.idle} opacity={0.7} />
        ))}
        {/* The traveller, seen from behind, in the lane.
            First attempt floated between two lane dashes, which framed it
            into a bell-on-a-post; it sits ON the lower dash now, with tyres
            poking below the body, and that is what makes it read as a car. */}
        <g>
          <ellipse cx={150} cy={132.5} rx={12} ry={1.8} fill={ILLO.shadow} opacity={0.55} />
          {[141.2, 155.4].map((tx) => (
            <rect key={tx} x={tx} y={128.6} width={3.4} height={4.2} rx={1.2} fill={ILLO.tyre} />
          ))}
          <path
            d="M140,131 L140,120.5 Q140,116.6 145,116 L155,116 Q160,116.6 160,120.5 L160,131 Z"
            fill={ILLO.carMid}
            stroke={ILLO.hub}
            strokeWidth={1}
            strokeOpacity={0.85}
            strokeLinejoin="round"
          />
          <path d="M143.6,116.2 Q144.4,111.4 148,111 L152,111 Q155.6,111.4 156.4,116.2 Z" fill={ILLO.carMid} stroke={ILLO.hub} strokeWidth={0.9} strokeOpacity={0.75} />
          <rect x={145.2} y={112.4} width={9.6} height={3.2} rx={1.4} fill={ILLO.glassTop} opacity={0.5} />
        </g>
        {/* stops sit on the verge and shrink with the road, so they read as
            points along the route rather than dots dropped on top of it */}
        <Pip x={100} y={140} r={4} lit />
        <Pip x={196} y={104} r={3} />
        <Pip x={168} y={74} r={2.2} />
      </>
    ),
  },

  /* two corridors */
  corridors: {
    label: "Two parallel routes with charging stations marked on each.",
    draw: () => (
      <>
        {[86, 124].map((y, row) => (
          <g key={y}>
            <path d={`M24,${y} H276`} stroke={ILLO.seam} strokeWidth={2} opacity={0.5} strokeLinecap="round" />
            {[70, 150, 230].map((x, i) => (
              <Pip key={x} x={x} y={y} lit={row === 0 ? i === 1 : i === 2} />
            ))}
          </g>
        ))}
        <path d="M24,150 H276" stroke={ILLO.idle} strokeWidth={1} opacity={0.35} strokeDasharray="6 8" />
      </>
    ),
  },

  /* first month */
  milestones: {
    label: "Three milestones along a path, the last one reached.",
    draw: () => (
      <>
        <path d="M40,132 C90,132 92,96 140,96 C190,96 194,64 260,64" fill="none" stroke={ILLO.seam} strokeWidth={1.8} opacity={0.55} strokeLinecap="round" />
        <Pip x={40} y={132} r={3} />
        <Pip x={140} y={96} r={3.6} />
        <Pip x={260} y={64} r={4.4} lit />
      </>
    ),
  },

  /* paperwork */
  paperwork: {
    label: "A form with one item approved and others closed.",
    draw: () => (
      <>
        <rect x={92} y={44} width={116} height={112} rx={7} fill={ILLO.bodyDark} stroke={ILLO.edge} strokeWidth={0.9} strokeOpacity={0.45} />
        {[64, 84, 104, 124].map((y, i) => (
          <g key={y}>
            <rect x={106} y={y} width={i === 1 ? 74 : 60} height={5} rx={2.5} fill={i === 1 ? ILLO.live : ILLO.idle} opacity={i === 1 ? 0.95 : 0.55} />
            {i !== 1 && <line x1={104} y1={y + 2.5} x2={170} y2={y + 2.5} stroke={ILLO.seam} strokeWidth={1} opacity={0.7} />}
          </g>
        ))}
        <circle cx={196} cy={132} r={17} fill="none" stroke={ILLO.live} strokeWidth={2.2} opacity={0.85} />
        <path d="M189,132 L194,138 L204,126" fill="none" stroke={ILLO.live} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
};

export type CoverMotif = keyof typeof COVERS;

/* ── The component ───────────────────────────────────────────────── */

export function GuideCover({ motif }: { motif: CoverMotif }) {
  const m = COVERS[motif];
  if (!m) return null;
  const id = `c-${motif}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label={m.label}
      preserveAspectRatio="xMidYMid slice"
    >
      <Defs id={id} />
      <rect width={W} height={H} fill={`url(#${id}-plate)`} />
      {/* the two things every cover shares, so eighteen guides read as one set */}
      <ellipse cx={150} cy={108} rx={124} ry={74} fill={`url(#${id}-bloom)`} />
      <path d={`M0,${FLOOR} H${W}`} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.32} />
      {m.draw(id)}
      <Wordmark />
    </svg>
  );
}
