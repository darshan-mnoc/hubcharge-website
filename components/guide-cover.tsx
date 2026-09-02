import { ILLO } from "@/lib/illustration";
import { CarSVG, ChargerSVG } from "@/components/illustration/primitives";
import { evModels } from "@/lib/ev-models";
import { STATION_KW, TEMPERATURE_FACTORS, powerAtSoc } from "@/lib/charging-math";

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

/**
 * The charging curve, plotted from the site's own data rather than drawn.
 *
 * The hand-drawn version rose to a peak around 25% state of charge, which
 * says charging is slow when the battery is nearly empty. Averaging the 31
 * curves in lib/ev-models.ts and capping each point at the station's output
 * says the opposite: power is already at its highest when the battery is
 * nearly empty, holds a broad plateau to about a fifth full, and then falls
 * away — 164 kW at 20%, 59 at 80%. That is what the guide underneath says.
 *
 * Derived at module load, so if a model's curve changes the drawing follows.
 */
const CURVE_PLOT = (() => {
  const X0 = 56, X1 = 244, Y0 = 56, Y1 = 126;
  const series: [number, number][] = [];
  for (let soc = 0; soc <= 100; soc += 2) {
    const kw =
      evModels.reduce((a, m) => a + Math.min(powerAtSoc(m, soc), STATION_KW), 0) /
      evModels.length;
    series.push([soc, kw]);
  }
  /* scaled against the peak of the series being drawn, so the plot uses the
     full height rather than leaving headroom under a ceiling no average
     model reaches */
  const peak = Math.max(...series.map(([, kw]) => kw));
  const pts: [number, number][] = series.map(([soc, kw]) => [
    X0 + (soc / 100) * (X1 - X0),
    Y1 - (kw / peak) * (Y1 - Y0),
  ]);
  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  return { d, X0, X1, Y1, pts };
})();
const CURVE = CURVE_PLOT.d;

/**
 * Where a cable is allowed to begin and end.
 *
 * Both anchors live in the primitives already — ChargerSVG holsters its cable
 * at (24, 63) of a 48x88 box, CarSVG puts a charge port at (158, 37) of a
 * 200x70 box — and last round I typed cable coordinates by hand instead of
 * reading them. Every live cable ended up leaving the cabinet 40-47 units
 * above its holster and stopping 43-58 short of the port: out of thin air,
 * into thin air. Derived here so that cannot recur, and asserted in
 * scripts/check-cover-accuracy.py so it cannot recur silently.
 */
function holsterAt(x: number, h: number): [number, number] {
  return [x, FLOOR - (h * (UNIT_VB.foot * 88 - 63)) / 88];
}
function portAt(x: number, w: number, flip = false): [number, number] {
  const h = (w * CAR_VB.h) / CAR_VB.w;
  const dx = ((158 - CAR_VB.w / 2) / CAR_VB.w) * w;
  return [x + (flip ? -dx : dx), FLOOR - (h * (CAR_VB.foot * 70 - 37)) / 70];
}

/**
 * A cable hanging between two points.
 *
 * A heavy DC cable sags under its own weight into a shallow catenary; it does
 * not run straight from the holster to the port, and it certainly does not
 * bulge upward like a suspension span. The control points are placed below
 * the chord by `sag`, so the lowest point of the curve sits below both ends —
 * which is the only shape gravity actually produces.
 */
function sagPath(
  [x0, y0]: [number, number],
  [x1, y1]: [number, number],
  sag = 26
) {
  const c1x = x0 + (x1 - x0) * 0.3;
  const c2x = x0 + (x1 - x0) * 0.7;
  return `M${x0},${y0} C${c1x},${y0 + sag} ${c2x},${y1 + sag * 0.55} ${x1},${y1}`;
}

/** Cable, drawn with the three-stroke casing every scene uses, scaled to
 *  this viewBox. Orange only when power is actually moving. */
function Cable({
  d,
  live = false,
  animated = false,
}: {
  d: string;
  live?: boolean;
  /** Runs charge along the cable. Only ever true where power really flows. */
  animated?: boolean;
}) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={ILLO.shadow} strokeWidth={3.4} />
      <path d={d} stroke={live ? ILLO.liveDim : ILLO.body} strokeWidth={2.2} />
      <path d={d} stroke={live ? ILLO.live : ILLO.seam} strokeWidth={0.8} strokeOpacity={live ? 0.9 : 0.55} />
      {animated && live && (
        <path d={d} stroke={ILLO.liveGlow} strokeWidth={1.6} strokeOpacity={0.9} className="hc-flow" />
      )}
    </g>
  );
}

/**
 * A charging coupler, seen head-on.
 *
 * The two are genuinely different objects and the drawing has to say which is
 * which, because that is the whole question the connectors guide answers:
 *
 * - CCS1 is a J1772 face — two large AC pins at the top, one large protective
 *   earth at bottom centre, two small signal pins — with two large DC pins
 *   bolted underneath. It is much the bigger coupler.
 * - NACS is one compact round face: two large power pins that carry both AC
 *   and DC, with three small pins arched above.
 *
 * These were previously one generic "three small over two large" face with an
 * optional lobe, and the labels naming them were swapped.
 */
function Plug({
  x,
  y,
  r,
  kind = "nacs",
  lit = false,
}: {
  x: number;
  y: number;
  r: number;
  kind?: "ccs1" | "nacs";
  lit?: boolean;
}) {
  const pin = lit ? ILLO.live : ILLO.seam;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.3} strokeOpacity={0.9} />
      {kind === "ccs1" ? (
        <>
          {/* J1772: two large AC pins up top … */}
          {[-1, 1].map((i) => (
            <circle key={i} cx={x + i * r * 0.4} cy={y - r * 0.32} r={r * 0.19} fill={pin} />
          ))}
          {/* … protective earth, large, at bottom centre … */}
          <circle cx={x} cy={y + r * 0.36} r={r * 0.19} fill={ILLO.seam} />
          {/* … and the two small signal pins flanking it */}
          {[-1, 1].map((i) => (
            <circle key={i} cx={x + i * r * 0.45} cy={y + r * 0.2} r={r * 0.085} fill={ILLO.seam} />
          ))}
          {/* the DC pair, in their own housing below the AC face */}
          <path
            d={`M${x - r * 0.62},${y + r * 0.52} h${r * 1.24} a${r * 0.55},${r * 0.55} 0 0 1 0,${r * 0.95} h${-r * 1.24} a${r * 0.55},${r * 0.55} 0 0 1 0,${-r * 0.95} Z`}
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={0.9}
            strokeOpacity={0.7}
          />
          {[-1, 1].map((i) => (
            <circle key={i} cx={x + i * r * 0.33} cy={y + r * 1} r={r * 0.26} fill={pin} />
          ))}
        </>
      ) : (
        <>
          {/* NACS: three small pins arched over two large ones */}
          {[
            [-0.38, -0.28],
            [0, -0.42],
            [0.38, -0.28],
          ].map(([dx, dy]) => (
            <circle key={dx} cx={x + dx * r} cy={y + dy * r} r={r * 0.1} fill={ILLO.seam} />
          ))}
          {[-1, 1].map((i) => (
            <circle key={i} cx={x + i * r * 0.32} cy={y + r * 0.2} r={r * 0.25} fill={pin} />
          ))}
        </>
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

/** A word set into the drawing. The no-text rule was always about
 *  *generated* text, which arrived misspelled; authored text renders exactly.
 *  Naming a thing is the fastest way to make a drawing legible — the real
 *  cabinet prints CCS1 and NACS beside its holsters for the same reason.
 *  8.5 units sets at roughly 10px on the narrowest masthead. */
function Label({
  x,
  y,
  text,
  tone = ILLO.hub,
  size = 8.5,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  tone?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={700} letterSpacing="0.5" fill={tone} textAnchor={anchor}>
      {text}
    </text>
  );
}

/** The band below the horizon — a quarter of every plate, previously empty,
 *  which is most of why the set read as sparse. FLOOR does not move; every
 *  motif is tuned to it. This is the floor those scenes stand on. */
function Ground({ id, kind = "plain", pools = [] }: { id: string; kind?: "bay" | "road" | "plain"; pools?: number[] }) {
  return (
    <g>
      <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${id}-floor)`} />
      {/* the pool a lit charger throws on the floor — the one thing that
          makes these read as lit places rather than flat diagrams */}
      {pools.map((px) => (
        <ellipse key={px} cx={px} cy={FLOOR + 8} rx={62} ry={20} fill={`url(#${id}-pool)`} />
      ))}
      {kind === "bay" &&
        [30, 105, 195, 270].map((x) => (
          <path key={x} d={`M${x},${FLOOR + 6} L${x - 7},${H - 6}`} stroke={ILLO.seam} strokeWidth={1.6} strokeOpacity={0.3} strokeLinecap="round" />
        ))}
      {kind === "road" && (
        <>
          <path d={`M0,${FLOOR + 14} H${W}`} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.22} />
          {[24, 96, 168, 240].map((x) => (
            <path key={x} d={`M${x},${FLOOR + 28} h26`} stroke={ILLO.seam} strokeWidth={2.4} strokeOpacity={0.32} strokeLinecap="round" />
          ))}
        </>
      )}
    </g>
  );
}

/** ✓ and ✕ as paths, not font glyphs — a glyph can fall back to a different
 *  shape on a machine without the face, a path cannot. */
function Tick({ x, y, r = 9, tone = ILLO.ok }: { x: number; y: number; r?: number; tone?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={tone} fillOpacity={0.14} stroke={tone} strokeWidth={1.4} />
      <path
        d={`M${x - r * 0.42},${y} L${x - r * 0.1},${y + r * 0.34} L${x + r * 0.44},${y - r * 0.34}`}
        fill="none"
        stroke={tone}
        strokeWidth={r * 0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Cross({ x, y, r = 9, tone = ILLO.fault }: { x: number; y: number; r?: number; tone?: string }) {
  return (
    <g stroke={tone} strokeWidth={r * 0.22} strokeLinecap="round">
      <circle cx={x} cy={y} r={r} fill="none" strokeOpacity={0.7} />
      <line x1={x - r * 0.38} y1={y - r * 0.38} x2={x + r * 0.38} y2={y + r * 0.38} />
      <line x1={x + r * 0.38} y1={y - r * 0.38} x2={x - r * 0.38} y2={y + r * 0.38} />
    </g>
  );
}

/** A map pin, for the covers that are about places rather than equipment. */
function Pin({ x, y, r = 8, lit = false }: { x: number; y: number; r?: number; lit?: boolean }) {
  const tone = lit ? ILLO.live : ILLO.seam;
  return (
    <g>
      <path
        d={`M${x},${y + r * 1.9} C${x - r * 0.9},${y + r * 0.75} ${x - r},${y + r * 0.3} ${x - r},${y} a${r},${r} 0 1 1 ${r * 2},0 c0,${r * 0.3} ${-r * 0.1},${r * 0.75} ${-r},${r * 1.9} Z`}
        fill={lit ? ILLO.live : ILLO.bodyLight}
        fillOpacity={lit ? 0.22 : 0.5}
        stroke={tone}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <circle cx={x} cy={y} r={r * 0.36} fill={tone} />
    </g>
  );
}

/* ── Placing the shared primitives ──────────────────────────────────
 *
 * CarSVG and ChargerSVG keep their own viewBoxes, so they go in as nested
 * <svg> and their proportions come across exactly — nothing is re-derived by
 * hand, which is how the covers ended up with a second, worse car in the
 * first place.
 *
 * Each knows where its own feet are, so both land on FLOOR by construction
 * rather than by eye. That is the fix for "the chargers are not in proper
 * alignment": they were positioned individually.
 */
const CAR_VB = { w: 200, h: 70, foot: 63.1 / 70 };
const UNIT_VB = { w: 48, h: 88, foot: 85.5 / 88 };

function Car({
  id,
  x,
  w,
  flip = false,
  dim,
}: {
  id: string;
  /** centre of the car on the cover's x axis */
  x: number;
  /** drawn width in cover units */
  w: number;
  flip?: boolean;
  /** haze a distant car back toward the sky rather than darkening it */
  dim?: number;
}) {
  const h = (w * CAR_VB.h) / CAR_VB.w;
  /* Mirrored about the car's own centre with an explicit SVG transform. A CSS
     `transform: scaleX(-1)` with `transform-origin: center` does not resolve
     against a nested <svg>'s own box, so the car flipped about the wrong axis
     and the cable ran to where the port wasn't. */
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <svg
        x={x - w / 2}
        y={FLOOR - h * CAR_VB.foot}
        width={w}
        height={h}
        viewBox={`0 0 ${CAR_VB.w} ${CAR_VB.h}`}
        opacity={dim}
      >
        <CarSVG id={`${id}-car${Math.round(x)}`} />
      </svg>
    </g>
  );
}

function Charger({
  id,
  x,
  h = 74,
  active = false,
  done = false,
  free = false,
  dim,
}: {
  id: string;
  x: number;
  /** drawn height in cover units; width follows the real proportion */
  h?: number;
  active?: boolean;
  done?: boolean;
  /** Bay is available — the light blade goes green, as the real one does. */
  free?: boolean;
  dim?: number;
}) {
  const w = (h * UNIT_VB.w) / UNIT_VB.h;
  return (
    <svg
      x={x - w / 2}
      y={FLOOR - h * UNIT_VB.foot}
      width={w}
      height={h}
      viewBox={`0 0 ${UNIT_VB.w} ${UNIT_VB.h}`}
      opacity={dim}
    >
      {/* still: the charger's own standby pulse is SMIL, which the CSS
          reduced-motion rule cannot reach. Covers get their one motion from
          the .hc-* CSS classes instead, so it is both controllable and
          switch-offable. */}
      <ChargerSVG id={`${id}-u${Math.round(x)}`} active={active} done={done} free={free} still />
    </svg>
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
      {/* The cabinet is warm greige at Alhambra, not navy. Lit face to the
          left, falling to the shaded right edge. 7.62 / 4.94 / 3.03. */}
      <linearGradient id={`${id}-unit`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={ILLO.cabTop} />
        <stop offset="52%" stopColor={ILLO.cabMid} />
        <stop offset="100%" stopColor={ILLO.cabLow} />
      </linearGradient>
      {/* tarmac, deliberately darker than the sky above it */}
      <linearGradient id={`${id}-floor`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.asphalt} stopOpacity={0.85} />
        <stop offset="100%" stopColor={ILLO.shadow} stopOpacity={0.92} />
      </linearGradient>
      {/* Body colours. Every ramp's DARKEST stop is the one that matters — an
          earlier one bottomed out at 1.17:1 and the car vanished. These hold
          2.02, 3.83 and 2.33. */}
      {(
        [
          ["paint", ILLO.paintTop, ILLO.paintMid, ILLO.paintLow],
          ["silver", ILLO.silverTop, ILLO.silverMid, ILLO.silverLow],
          ["graphite", ILLO.graphiteTop, ILLO.graphiteMid, ILLO.graphiteLow],
        ] as const
      ).map(([n, a, b, c]) => (
        <linearGradient key={n} id={`${id}-${n}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={a} />
          <stop offset="54%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      ))}
      <linearGradient id={`${id}-cargla`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.glassMid} />
        <stop offset="100%" stopColor={ILLO.glassLow} />
      </linearGradient>
      {/* a soft contact shadow, so the car sits on the ground rather than
          hovering over a hard grey oval */}
      <radialGradient id={`${id}-contact`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.shadow} stopOpacity={0.62} />
        <stop offset="60%" stopColor={ILLO.shadow} stopOpacity={0.28} />
        <stop offset="100%" stopColor={ILLO.shadow} stopOpacity={0} />
      </radialGradient>
      {/* the pool of light a lit charger throws on the floor */}
      <radialGradient id={`${id}-pool`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.live} stopOpacity={0.20} />
        <stop offset="55%" stopColor={ILLO.live} stopOpacity={0.07} />
        <stop offset="100%" stopColor={ILLO.live} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-vig`} cx="50%" cy="48%" r="70%">
        <stop offset="74%" stopColor={ILLO.shadow} stopOpacity={0} />
        <stop offset="100%" stopColor={ILLO.shadow} stopOpacity={0.22} />
      </radialGradient>
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

type Motif = {
  label: string;
  /** The heading in this cover's own guide that it illustrates. A check
   *  asserts the guide's text really contains it, so a cover cannot drift
   *  away from its page the way `milestones` and `paperwork` had. */
  teaches?: string;
  draw: (id: string) => React.ReactNode;
  /** Floor treatment for the band below the horizon. Omit for "plain". */
  ground?: "bay" | "road" | "plain";
  /** x positions of lit chargers, which pool light on the floor beneath them. */
  pools?: number[];
};

export const COVERS: Record<string, Motif> = {
  /* the product, whole */
  station: {
    label: "A HubCharge unit charging a car, with energy running along the cable.",
    ground: "bay",
    pools: [78],
    draw: (id) => (
      <>
        {/* Both from components/illustration/primitives — the same drawings as
            the homepage journey strip. Each lands on FLOOR from its own foot
            fraction, which is what fixes the uneven alignment. */}
        <Charger id={id} x={78} h={84} active />
        <Car id={id} x={198} w={112} flip />
        {/* Parked port-side-to, so the lead reaches the inlet instead of
            crossing the whole car. Both ends come from the primitives'
            own anchors, and the curve sags under its own weight. */}
        <Cable d={sagPath(holsterAt(78, 84), portAt(198, 112, true), 34)} live animated />
      </>
    ),
  },

  /* what a visit is, as three beats */
  arrival: {
    label: "A car connected to a unit, above the three named steps of a stop.",
    pools: [222],
    draw: (id) => (
      <>
        <Charger id={id} x={230} h={82} active />
        <Car id={id} x={104} w={104} />
        <Cable d={sagPath(holsterAt(230, 82), portAt(104, 104), 34)} live animated />
        {/* was three unlabelled dots, which told a first-time visitor
            nothing. Named, it is the whole page in one line. */}
        <g>
          <path d="M46,172 H254" stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.35} />
          {[
            { x: 46, t: "PULL IN", lit: true },
            { x: 150, t: "WE PLUG IN", lit: true },
            { x: 254, t: "RELAX", lit: false },
          ].map(({ x, t, lit }) => (
            <g key={t}>
              <circle cx={x} cy={172} r={4.2} fill={lit ? ILLO.live : ILLO.idle} />
              <Label
                x={x}
                y={188}
                text={t}
                size={8}
                tone={lit ? ILLO.hub : ILLO.seam}
                anchor={x === 46 ? "start" : x === 254 ? "end" : "middle"}
              />
            </g>
          ))}
        </g>
      </>
    ),
  },

  /* two plugs, true relative scale */
  connectors: {
    label:
      "The two connectors this network fits: the larger CCS1 on the left and the compact NACS on the right.",
    draw: () => (
      <>
        {/* CCS1 left, NACS right, matching alhambra-holsters.webp — and CCS1
            drawn larger because it is the larger coupler. The labels used to
            be on the wrong plugs entirely. */}
        {/* cables leave from the side of each coupler, so the name can sit
            directly under its own body instead of being stranded between the
            body and its own cable */}
        {/* Each lead used to trail off and stop. They now end on a moulded
            strain relief, which is what a real coupler's cable does. */}
        <Cable d="M114,118 C130,128 138,138 144,146" />
        <rect x={140} y={144} width={10} height={5.5} rx={2.6} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        <Cable d="M223,96 C236,106 242,116 246,126" />
        <rect x={242} y={124} width={9} height={5} rx={2.4} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        <Plug x={96} y={84} r={30} kind="ccs1" lit />
        <Plug x={208} y={84} r={21} kind="nacs" lit />
        <Label x={96} y={146} text="CCS1" />
        <Label x={208} y={122} text="NACS" />
        <g className="hc-rise" style={{ animationDelay: "0.3s" }}>
          <Label x={150} y={176} text="BOTH FITTED" size={8.5} tone={ILLO.ok} />
        </g>
      </>
    ),
  },

  /* plug meeting socket */
  fits: {
    label: "A charging connector, an arrow, and a car whose charge port it fits, confirmed with a tick.",
    ground: "bay",
    draw: (id) => (
      <>
        <Plug x={54} y={92} r={26} kind="ccs1" lit />
        <path d="M84,96 H118" fill="none" stroke={ILLO.live} strokeWidth={2} strokeOpacity={0.85} strokeLinecap="round" />
        <path d="M112,89 L121,96 L112,103" fill="none" stroke={ILLO.live} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* the far half is the reader's own car, drawn as one — an abstract
            flank panel read as a television */}
        <Car id={id} x={206} w={104} />
        {/* ring the port, because it is the thing the arrow points at */}
        <circle cx={portAt(206, 104)[0]} cy={portAt(206, 104)[1]} r={14} fill="none" stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.75} strokeDasharray="3 3" />
        <g className="hc-rise" style={{ animationDelay: "0.35s" }}>
          <Tick x={150} y={170} r={12} />
        </g>
        <Label x={182} y={174} text="NO ADAPTER" size={8.5} tone={ILLO.ok} anchor="start" />
      </>
    ),
  },

  /* three speeds */
  levels: {
    label:
      "Three ways to charge, named: a Level 1 wall socket, a Level 2 wallbox and a DC fast charger.",
    ground: "bay",
    pools: [224],
    draw: (id) => (
      <>
        {/* This used to be three sizes of the same cabinet, which says
            "small, medium, large charger". Level 1 is an ordinary wall
            socket and Level 2 a wallbox — the guide's own copy says exactly
            that, so the drawing now does too, and each is named. */}
        <g>
          <rect x={54} y={112} width={34} height={40} rx={2} fill={ILLO.bodyDark} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.7} />
          {/* NEMA 5-15, the ordinary US household outlet: two vertical
              slots over a D-shaped earth. Round holes would be a Schuko,
              which is the wrong continent. */}
          <rect x={64} y={118} width={14} height={20} rx={2.6} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={0.8} />
          <rect x={67.8} y={122.6} width={1.5} height={5} rx={0.5} fill={ILLO.seam} />
          <rect x={72.7} y={122.6} width={1.5} height={5} rx={0.5} fill={ILLO.seam} />
          <path d="M69.3,131.4 a1.7,1.7 0 0 1 3.4,0 v1.4 h-3.4 Z" fill={ILLO.seam} />
        </g>
        <g>
          <rect x={124} y={92} width={38} height={60} rx={2} fill={ILLO.bodyDark} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.7} />
          <rect x={133} y={100} width={20} height={26} rx={4} fill={`url(#${id}-unit)`} stroke={ILLO.hub} strokeWidth={1.2} strokeOpacity={0.9} />
          <circle cx={143} cy={108} r={3} fill={ILLO.glass} stroke={ILLO.edge} strokeWidth={0.6} />
          {/* the wallbox lead ends in its own holster, not mid-air */}
          <Cable d="M143,126 C143,134 149,138 152,142" />
          <circle cx={153} cy={143} r={3.4} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={0.9} />
        </g>
        <Charger id={id} x={224} h={80} active />
        <Label x={71} y={168} text="L1" />
        <Label x={143} y={168} text="L2" />
        <g className="hc-rise" style={{ animationDelay: "0.25s" }}>
          <Label x={224} y={168} text="DC" tone={ILLO.live} />
        </g>
      </>
    ),
  },

  /* the curve */
  curve: {
    label:
      "The delivered charging curve with the twenty to sixty percent sweet spot marked, where a ten-minute stop buys the most range.",
    teaches: "the 20\u201360% sweet spot",
    draw: () => (
      <>
        <path d="M40,36 V132 H272" fill="none" stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.5} strokeLinecap="round" />
        {[58, 82, 106].map((y) => (
          <path key={y} d={`M40,${y} H272`} stroke={ILLO.seam} strokeWidth={0.7} strokeOpacity={0.14} strokeDasharray="3 5" />
        ))}
        {/* The sweet spot the guide is actually about. x maps state of charge
            across the plot, so 20% and 60% land where the data puts them. */}
        <rect
          x={CURVE_PLOT.X0 + 0.2 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)}
          y={36}
          width={0.4 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)}
          height={96}
          fill={ILLO.ok}
          opacity={0.1}
        />
        {[0.2, 0.6].map((f) => (
          <path
            key={f}
            d={`M${CURVE_PLOT.X0 + f * (CURVE_PLOT.X1 - CURVE_PLOT.X0)},36 V132`}
            stroke={ILLO.ok}
            strokeWidth={1.2}
            strokeOpacity={0.55}
            strokeDasharray="3 3"
          />
        ))}
        <path d={`${CURVE} L${CURVE_PLOT.X1},132 L${CURVE_PLOT.X0},132 Z`} fill={ILLO.live} opacity={0.09} />
        <path
          d={CURVE}
          fill="none"
          stroke={ILLO.live}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hc-draw"
          style={{ ["--len" as string]: "420" }}
        />
        <Label x={CURVE_PLOT.X0 + 0.4 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)} y={30} text="SWEET SPOT" tone={ILLO.ok} size={9} />
        <Label x={72} y={148} text="20%" size={8} tone={ILLO.seam} />
        <Label x={188} y={148} text="60%" size={8} tone={ILLO.seam} />
        <Label x={252} y={148} text="FULL" size={8} tone={ILLO.seam} />
        <Label x={218} y={70} text="TAPERS" tone={ILLO.seam} size={8.5} />
      </>
    ),
  },

  /* time, priced */
  clock: {
    label:
      "Four ways public charging is usually priced, against the single flat charge used here.",
    teaches: "how public charging pricing works, and how we simplified it",
    ground: "bay",
    pools: [236],
    draw: (id) => (
      <>
        {/* The guide compares per-kWh, per-minute, idle fees and memberships
            against one flat charge. A clock alone said "time", not "price".
            No figure is printed \u2014 the rate lives only in the product shot. */}
        <g>
          {["PER kWh", "PER MINUTE", "IDLE FEE", "MEMBERSHIP"].map((t, i) => (
            <g key={t} transform={`translate(20 ${52 + i * 22})`} className="hc-rise" style={{ animationDelay: `${i * 0.08}s` }}>
              <Cross x={6} y={0} r={7} />
              <Label x={20} y={3} text={t} size={7.5} anchor="start" tone={ILLO.seam} />
            </g>
          ))}
        </g>
        <path d="M146,96 h20" fill="none" stroke={ILLO.hub} strokeWidth={1.5} strokeOpacity={0.6} strokeLinecap="round" />
        <path d="M160,90 L167,96 L160,102" fill="none" stroke={ILLO.hub} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(200 96)">
          <rect x={-24} y={-22} width={48} height={44} rx={6} fill={ILLO.recess} stroke={ILLO.ok} strokeWidth={1.5} strokeOpacity={0.8} />
          <Label x={0} y={-2} text="ONE" size={11} tone={ILLO.ok} />
          <Label x={0} y={12} text="FLAT" size={11} tone={ILLO.ok} />
        </g>
        <Charger id={id} x={266} h={62} active />
      </>
    ),
  },

  /* one flat block, not a meter */
  flat: {
    label: "A rising metered price ruled out beside one flat price that does not change.",
    ground: "bay",
    draw: () => (
      <>
        <g opacity={0.6}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={44 + i * 18} y={102 - i * 14} width={14} height={28 + i * 14} rx={2} fill={ILLO.idle} />
          ))}
          <Label x={71} y={150} text="METERED" tone={ILLO.fault} size={8} />
        </g>
        <Cross x={71} y={78} r={17} />
        <path d="M138,104 H166" stroke={ILLO.seam} strokeWidth={1.6} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M160,98 L167,104 L160,110" fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={186 + i * 18} y={102} width={14} height={28} rx={2} fill={ILLO.live} opacity={0.92} className="hc-rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }} />
          ))}
          <Label x={213} y={150} text="FLAT" tone={ILLO.live} size={8} />
        </g>
        <Tick x={213} y={78} r={13} />
      </>
    ),
  },

  /* a range of cars */
  fleet: {
    label: "Three cars of different sizes side by side, each labelled with the connector it takes.",
    teaches: "what your car plugs into",
    ground: "bay",
    draw: (id) => (
      <>
        {/* Four cars at these widths overlapped each other and their labels.
            Three, spaced on thirds, with the label under its own car. */}
        <Car id={id} x={50} w={80} dim={0.7} />
        <Label x={50} y={166} text="NACS" size={8} tone={ILLO.seam} />
        <Car id={id} x={250} w={80} dim={0.7} flip />
        <Label x={250} y={166} text="CCS1" size={8} tone={ILLO.seam} />
        <Car id={id} x={150} w={108} />
        <g className="hc-rise" style={{ animationDelay: "0.25s" }}>
          <Label x={150} y={180} text="BOTH FIT HERE" size={9} tone={ILLO.live} />
        </g>
      </>
    ),
  },

  /* one bay busy, one free */
  bays: {
    label: "Two charging bays: one in use, one free with its light on.",
    teaches: "Move when you're done",
    ground: "bay",
    pools: [66, 238],
    draw: (id) => (
      <>
        <Charger id={id} x={66} h={78} active />
        <Car id={id} x={150} w={86} flip />
        <Cable d={sagPath(holsterAt(66, 78), portAt(150, 86, true), 26)} live animated />
        <Charger id={id} x={238} h={78} free />
        <Label x={238} y={178} text="FREE" tone={ILLO.ok} size={8} />
        <Label x={110} y={178} text="MOVE WHEN DONE" tone={ILLO.hub} size={8} />
      </>
    ),
  },

  /* cold on one side, heat on the other */
  climate: {
    label:
      "Two batteries, one cold and one hot, filled to the share of normal charging speed each temperature actually allows.",
    teaches: "Preconditioning is the fix, and you control it",
    draw: () => (
      <>
        {/* One battery with an invented fill said nothing. These two are
            filled from TEMPERATURE_FACTORS in lib/charging-math.ts — the same
            numbers the calculators use — so the picture cannot drift from
            the arithmetic. */}
        <g className="hc-fill">
          <Cell x={84} y={104} w={92} h={46} from={0} to={TEMPERATURE_FACTORS.cold.factor} tone={ILLO.cold} />
        </g>
        <g className="hc-fill" style={{ animationDelay: "0.15s" }}>
          <Cell x={216} y={104} w={92} h={46} from={0} to={TEMPERATURE_FACTORS.hot.factor} tone={ILLO.heat} />
        </g>
        <g stroke={ILLO.cold} strokeWidth={1.6} strokeLinecap="round" opacity={0.95}>
          {[0, 60, 120].map((a) => (
            <line key={a} x1={84} y1={62} x2={84} y2={46} transform={`rotate(${a} 84 54)`} />
          ))}
          <path d="M81.6,48.4 L84,50.8 L86.4,48.4" fill="none" />
          <path d="M81.6,59.6 L84,57.2 L86.4,59.6" fill="none" />
        </g>
        <circle cx={84} cy={54} r={1.3} fill={ILLO.cold} />
        <circle cx={216} cy={54} r={7} fill={ILLO.heat} opacity={0.95} />
        <g stroke={ILLO.heat} strokeWidth={1.6} strokeLinecap="round" opacity={0.8}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1={216} y1={41} x2={216} y2={45.5} transform={`rotate(${a} 216 54)`} />
          ))}
        </g>
        {/* clear of the horizon at 152; these used to straddle it */}
        <Label x={84} y={142} text="COLD" tone={ILLO.cold} />
        <Label x={216} y={142} text="HOT" tone={ILLO.heat} />
        {/* the guide's own answer: "preconditioning is the fix, and you
            control it" — the cover had the problem but not the fix */}
        {/* The fix the guide names, tied to the two batteries above it rather
            than floating as a detached pill in the ground band. */}
        <path d="M84,130 C84,142 150,142 150,150" fill="none" stroke={ILLO.ok} strokeWidth={1} strokeOpacity={0.35} />
        <path d="M216,130 C216,142 150,142 150,150" fill="none" stroke={ILLO.ok} strokeWidth={1} strokeOpacity={0.35} />
        <g transform="translate(150 164)">
          <rect x={-62} y={-13} width={124} height={26} rx={13} fill={ILLO.recess} stroke={ILLO.ok} strokeWidth={1.2} strokeOpacity={0.55} />
          <path d="M-46,-4 L-41,1 L-33,-9" fill="none" stroke={ILLO.ok} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <Label x={10} y={4} text="PRECONDITION" size={8.5} tone={ILLO.ok} />
        </g>
      </>
    ),
  },

  /* the band that matters */
  band: {
    label: "A battery with the middle band lit and the twenty and eighty percent marks named.",
    teaches: "The band that matters",
    draw: () => (
      <>
        <g className="hc-fill">
          <Cell x={150} y={100} w={150} h={60} from={0.2} to={0.8} />
        </g>
        {/* the window the guide recommends, marked at both ends rather than
            left for the reader to infer from a highlighted rectangle */}
        {/* x=105 and x=195 are where the 0.2 and 0.8 fill edges actually fall for
            a 150-wide cell centred on 150 — derived, not eyeballed */}
        {[{ x: 105, t: "20" }, { x: 195, t: "80" }].map(({ x, t }) => (
          <g key={t}>
            <path d={`M${x},132 V138`} stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.8} />
            <Label x={x} y={146} text={t} tone={ILLO.live} size={9} />
          </g>
        ))}
        <path d="M105,138 H195" stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.5} />
      </>
    ),
  },

  /* home and away */
  homeAway: {
    label: "A house with a wall charger on one side and a HubCharge unit on the other, both named.",
    teaches: "If you can charge at home, do",
    ground: "bay",
    pools: [214],
    draw: (id) => (
      <>
        <Roof x={78} w={80} h={54} pitch={16} />
        <rect x={122} y={112} width={9} height={14} rx={2} fill={ILLO.unitMid} stroke={ILLO.edge} strokeWidth={0.7} strokeOpacity={0.5} />
        {/* the home unit's lead ends on its own connector, not in the air */}
        <Cable d="M127,126 C127,134 133,139 138,142" />
        <rect x={135} y={140} width={7} height={5} rx={2.2} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        <path d="M150,52 V150" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.45} />
        <Charger id={id} x={214} h={72} free />
        <Car id={id} x={266} w={62} dim={0.6} />
        <Label x={78} y={178} text="HOME" />
        <g className="hc-rise" style={{ animationDelay: "0.25s" }}>
          <Label x={222} y={178} text="PUBLIC" tone={ILLO.live} />
        </g>
      </>
    ),
  },

  /* no driveway */
  street: {
    label:
      "Apartment blocks with cars at the kerb and two kerbside chargers, for drivers with nowhere to plug in at home.",
    teaches: "What it actually takes each week",
    ground: "road",
    draw: (id) => (
      <>
        {[
          { x: 20, w: 72, h: 100, cols: 3, rows: 4 },
          { x: 104, w: 80, h: 124, cols: 3, rows: 5 },
          { x: 196, w: 68, h: 86, cols: 3, rows: 3 },
        ].map(({ x, w, h, cols, rows }) => (
          <g key={x}>
            <rect x={x} y={FLOOR - h} width={w} height={h} rx={1.5} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.5} />
            <rect x={x - 2} y={FLOOR - h - 3} width={w + 4} height={3.4} rx={1} fill={ILLO.body} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.45} />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const ww = (w - 14) / cols - 5;
                const wx = x + 7 + c * ((w - 14) / cols) + 2.5;
                const wy = FLOOR - h + 10 + r * ((h - 20) / rows);
                const on = (r * cols + c + x) % 5 === 0;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={wx}
                    y={wy}
                    width={ww}
                    height={8}
                    rx={0.8}
                    fill={on ? ILLO.heat : ILLO.recess}
                    opacity={on ? 0.55 : 1}
                    className={on ? "hc-rise" : undefined}
                    style={on ? { animationDelay: `${0.1 + ((r * cols + c) % 5) * 0.12}s` } : undefined}
                  />
                );
              })
            )}
          </g>
        ))}
        {/* the point of the guide: the chargers are on the street, not at home */}
        <Charger id={id} x={272} h={52} free dim={0.9} />
        <path d={`M0,${FLOOR + 4} H300`} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.5} />
        <Car id={id} x={52} w={66} dim={0.6} />
        <Car id={id} x={140} w={66} dim={0.6} />
        <Car id={id} x={228} w={66} dim={0.6} />
      </>
    ),
  },

  /* something went wrong */
  fault: {
    label:
      "A five-item checklist of what usually goes wrong, with the commonest \u2014 a connector not pushed fully home \u2014 shown solved.",
    teaches: "Most charging problems are one of five things",
    draw: () => (
      <>
        {/* The guide's claim is that it is almost always one of five things,
            so the cover shows five, not one, with the commonest worked. */}
        <g>
          <rect x={26} y={40} width={122} height={112} rx={6} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1.1} strokeOpacity={0.55} />
          {[
            { t: "NOT SEATED", lit: true },
            { t: "CARD DECLINED", lit: false },
            { t: "CAR ASLEEP", lit: false },
            { t: "CABLE LOCKED", lit: false },
            { t: "APP OUT OF DATE", lit: false },
          ].map(({ t, lit }, i) => (
            <g key={t} transform={`translate(40 ${58 + i * 20})`} className="hc-rise" style={{ animationDelay: `${i * 0.07}s` }}>
              <circle cx={0} cy={0} r={5.4} fill={lit ? ILLO.ok : "none"} fillOpacity={lit ? 0.2 : 1} stroke={lit ? ILLO.ok : ILLO.seam} strokeWidth={1.2} />
              {lit && <path d="M-2.4,0 L-0.6,1.9 L2.6,-2" fill="none" stroke={ILLO.ok} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />}
              <Label x={12} y={3} text={t} size={7.5} anchor="start" tone={lit ? ILLO.ok : ILLO.seam} />
            </g>
          ))}
        </g>
        {/* the commonest one, worked */}
        <g transform="translate(224 88)">
          <rect x={-20} y={-46} width={40} height={30} rx={4} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={1.4} strokeOpacity={0.8} />
          <circle cx={-8} cy={-31} r={4.4} fill={ILLO.live} />
          <circle cx={8} cy={-31} r={4.4} fill={ILLO.live} />
          <rect x={-15} y={-14} width={30} height={26} rx={4} fill={ILLO.unitMid} stroke={ILLO.hub} strokeWidth={1.4} strokeOpacity={0.85} />
          <rect x={-7} y={12} width={14} height={18} rx={5} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={1} />
          {/* the lead hangs to the floor and coils there, rather than
              running off the edge of the frame */}
          <Cable d="M0,30 C0,44 14,52 26,60" live />
          <ellipse cx={28} cy={62} rx={9} ry={2.6} fill="none" stroke={ILLO.liveDim} strokeWidth={2} strokeOpacity={0.8} />
          <Label x={0} y={-58} text="PUSH IT HOME" size={8} tone={ILLO.ok} />
        </g>
      </>
    ),
  },

  /* asking */
  ask: {
    label: "Two question bubbles beside a HubCharge unit.",
    ground: "bay",
    pools: [78],
    draw: (id) => (
      <>
        <Charger id={id} x={72} h={72} free />
        {/* a bare glyph floating in space read as decoration; in a bubble it
            reads as somebody asking */}
        <g>
          <path
            d="M148,52 H262 a10,10 0 0 1 10,10 V110 a10,10 0 0 1 -10,10 H176 l-14,14 v-14 H148 a10,10 0 0 1 -10,-10 V62 a10,10 0 0 1 10,-10 Z"
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={1.3}
            strokeOpacity={0.8}
            strokeLinejoin="round"
          />
          <Label x={205} y={98} text="?" tone={ILLO.live} size={46} />
        </g>
        <g opacity={0.5} className="hc-rise" style={{ animationDelay: "0.4s" }}>
          <path
            d="M158,112 H214 a8,8 0 0 1 8,8 V138 a8,8 0 0 1 -8,8 H176 l-10,10 v-10 H158 a8,8 0 0 1 -8,-8 V120 a8,8 0 0 1 8,-8 Z"
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={1.1}
            strokeOpacity={0.7}
            strokeLinejoin="round"
          />
          <Label x={186} y={137} text="?" tone={ILLO.hub} size={22} />
        </g>
      </>
    ),
  },

  /* a working day */
  shift: {
    label:
      "A driving shift drawn as a bar, with the small unpaid slice spent charging marked at one end.",
    teaches: "Charging time is unpaid time",
    ground: "road",
    draw: (id) => (
      <>
        {/* The guide's worked example is an eight-hour shift with one
            ~26-minute stop — about 5% off the road — so the bar IS the shift
            and the orange slice is drawn to that share. */}
        <Label x={40} y={50} text="ONE SHIFT" size={8.5} tone={ILLO.seam} anchor="start" />
        <rect x={40} y={60} width={220} height={24} rx={5} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.5} />
        <rect x={42} y={62} width={205} height={20} rx={3.5} fill={ILLO.ok} opacity={0.3} className="hc-fill" />
        <rect x={247} y={62} width={11} height={20} rx={3.5} fill={ILLO.live} />
        <path d="M252,54 V58" stroke={ILLO.live} strokeWidth={1.3} strokeOpacity={0.8} />
        <Label x={258} y={50} text="UNPAID" size={8} tone={ILLO.live} anchor="end" />
        <Label x={142} y={76} text="DRIVING, PAID" size={8} tone={ILLO.ok} />
        <Car id={id} x={96} w={100} />
        <Charger id={id} x={228} h={62} active />
        <Cable d={sagPath(holsterAt(228, 62), portAt(96, 100), 22)} live animated />
      </>
    ),
  },

  /* the long way */
  highway: {
    label: "A road running to the horizon with three named charging stops pinned along it.",
    teaches: "Arrive low, leave early",
    draw: () => (
      <>
        <path d="M76,200 L138,58 H162 L224,200 Z" fill={ILLO.bodyDark} />
        <path d="M76,200 L138,58 H162 L224,200 Z" fill="none" stroke={ILLO.seam} strokeWidth={0.9} strokeOpacity={0.45} strokeLinejoin="round" />
        {[
          [72, 1.4, 5],
          [92, 1.8, 7],
          [120, 2.4, 10],
          [156, 3.2, 14],
        ].map(([y, w, h]) => (
          <rect key={y} x={150 - w / 2} y={y} width={w} height={h} rx={w / 2} fill={ILLO.idle} opacity={0.75} />
        ))}
        {/* named, because three unlabelled pins on a road could be anything */}
        <Pin x={118} y={70} r={5} />
        <Label x={118} y={88} text="BUFFER" size={7.5} tone={ILLO.seam} />
        <Pin x={202} y={102} r={7} />
        <Label x={202} y={124} text="LEAVE EARLY" size={8} tone={ILLO.seam} />
        <Pin x={62} y={146} r={10} lit />
        <g className="hc-rise" style={{ animationDelay: "0.25s" }}>
          <Label x={62} y={176} text="ARRIVE LOW" size={8.5} tone={ILLO.live} />
        </g>
      </>
    ),
  },

  /* two corridors */
  corridors: {
    label:
      "The two freeway corridors that matter, I-10 and I-210, with the HubCharge sites on them named.",
    teaches: "The two corridors that matter",
    draw: () => (
      <>
        {/* the guide's first heading is literally "the two corridors that
            matter", and it names them; so does this */}
        <path d="M16,72 C70,68 140,64 288,58" fill="none" stroke={ILLO.seam} strokeWidth={2.4} strokeOpacity={0.4} strokeLinecap="round" strokeDasharray="7 6" />
        <Label x={40} y={62} text="I-210" size={8.5} tone={ILLO.seam} anchor="start" />
        <path d="M16,124 C70,122 150,118 288,112" fill="none" stroke={ILLO.live} strokeWidth={2.8} strokeOpacity={0.85} strokeLinecap="round" className="hc-draw" style={{ ["--len" as string]: "280" }} />
        <Label x={40} y={140} text="I-10" size={9} tone={ILLO.live} anchor="start" />
        <Pin x={122} y={108} r={10} lit />
        <Label x={122} y={92} text="ALHAMBRA" tone={ILLO.live} size={8} />
        <Pin x={232} y={104} r={10} lit />
        <Label x={232} y={88} text="FONTANA" tone={ILLO.live} size={8} />
      </>
    ),
  },

  /* first month */
  milestones: {
    label:
      "The first month as three named phases: find your plug in week one, learn the charging curve in week two, stop thinking about it by month one.",
    teaches: "Week one: find out what plug you have",
    draw: () => (
      <>
        {/* Three bare numerals told a new owner nothing. The guide's own
            sections are week one / week two / month one, so the cover shows
            those, with the thing you actually do in each. */}
        <path
          d="M46,110 C86,110 92,82 146,82 C200,82 206,54 254,54"
          fill="none"
          stroke={ILLO.seam}
          strokeWidth={2}
          strokeOpacity={0.45}
          strokeLinecap="round"
          className="hc-draw"
          style={{ ["--len" as string]: "240" }}
        />
        {[
          { x: 46, y: 110, when: "WEEK 1", what: "YOUR PLUG", lit: false },
          { x: 146, y: 82, when: "WEEK 2", what: "THE CURVE", lit: false },
          { x: 254, y: 54, when: "MONTH 1", what: "FORGET IT", lit: true },
        ].map(({ x, y, when, what, lit }, i) => (
          <g key={when}>
            <circle cx={x} cy={y} r={16} fill={lit ? ILLO.live : ILLO.recess} fillOpacity={lit ? 0.18 : 1} stroke={lit ? ILLO.live : ILLO.seam} strokeWidth={1.6} />
            {/* what you actually do in that phase, drawn */}
            {i === 0 && (
              <g>
                <circle cx={x} cy={y} r={7.5} fill="none" stroke={ILLO.hub} strokeWidth={1.3} />
                <circle cx={x - 2.6} cy={y + 1.6} r={2} fill={ILLO.hub} />
                <circle cx={x + 2.6} cy={y + 1.6} r={2} fill={ILLO.hub} />
                <circle cx={x} cy={y - 3.2} r={1.2} fill={ILLO.hub} />
              </g>
            )}
            {i === 1 && (
              <path d={`M${x - 8},${y + 5} C${x - 4},${y + 5} ${x - 3},${y - 5} ${x + 1},${y - 5} C${x + 5},${y - 5} ${x + 6},${y + 3} ${x + 8},${y + 5}`} fill="none" stroke={ILLO.hub} strokeWidth={1.6} strokeLinecap="round" />
            )}
            {i === 2 && (
              <path
                d={`M${x - 6},${y} L${x - 1.6},${y + 4.4} L${x + 6.4},${y - 4}`}
                fill="none"
                stroke={ILLO.ok}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <Label x={x} y={y - 24} text={when} size={8} tone={lit ? ILLO.live : ILLO.seam} />
            <Label x={x} y={y + 32} text={what} size={8.5} tone={lit ? ILLO.ok : ILLO.hub} />
          </g>
        ))}
      </>
    ),
  },

  /* paperwork */
  paperwork: {
    label:
      "Three incentive programmes listed, each pointing out to the body that administers it, with no amounts shown.",
    teaches: "Why this page has no dollar amounts on it",
    draw: () => (
      <>
        {/* This cover used to lead with a giant currency mark on a page whose
            first heading is "Why this page has no dollar amounts on it". The
            page routes rather than quotes, so the cover routes too. */}
        <rect x={38} y={44} width={168} height={112} rx={7} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.6} />
        {[62, 90, 118].map((y, i) => (
          <g key={y}>
            <rect x={54} y={y} width={i === 0 ? 86 : i === 1 ? 70 : 78} height={7} rx={3.5} fill={i === 0 ? ILLO.hub : ILLO.idle} opacity={i === 0 ? 0.8 : 0.65} />
            {/* each one points OUT, to whoever administers it */}
            <path d={`M156,${y + 3.5} h22`} stroke={ILLO.live} strokeWidth={1.6} strokeOpacity={0.85} strokeLinecap="round" className="hc-draw" style={{ ["--len" as string]: "22", animationDelay: `${0.15 + i * 0.1}s` }} />
            <path d={`M172,${y - 1.5} l5,5 l-5,5`} fill="none" stroke={ILLO.live} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        <Label x={122} y={144} text="CHECK THE SOURCE" size={8} tone={ILLO.seam} />
        {/* where they point */}
        <g transform="translate(248 92)">
          <rect x={-30} y={-34} width={60} height={68} rx={6} fill={ILLO.pane} stroke={ILLO.ok} strokeWidth={1.4} strokeOpacity={0.8} />
          {[-16, -4, 8].map((y) => (
            <rect key={y} x={-18} y={y} width={36} height={5} rx={2.5} fill={ILLO.ok} opacity={0.5} />
          ))}
          <Tick x={0} y={24} r={8} />
        </g>
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
      preserveAspectRatio="xMidYMid meet"
    >
      <Defs id={id} />
      <rect width={W} height={H} fill={`url(#${id}-plate)`} />
      {/* the two things every cover shares, so eighteen guides read as one set */}
      <ellipse cx={150} cy={108} rx={124} ry={74} fill={`url(#${id}-bloom)`} />
      <Ground id={id} kind={m.ground} pools={m.pools} />
      <path d={`M0,${FLOOR} H${W}`} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.32} />
      {m.draw(id)}
      {/* holds the eye centre-frame; drawn over the scene, under the mark */}
      <rect width={W} height={H} fill={`url(#${id}-vig)`} pointerEvents="none" />
      <Wordmark />
    </svg>
  );
}
