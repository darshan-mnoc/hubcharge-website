import { ILLO } from "@/lib/illustration";
import { CoverFrame } from "@/components/cover-frame";
import { ANCHOR, CarSVG, ChargerSVG, ValetSVG } from "@/components/illustration/primitives";
import { evModels } from "@/lib/ev-models";
import { STATION_KW, TEMPERATURE_FACTORS, powerAtSoc } from "@/lib/charging-math";
import { stations } from "@/lib/stations";
import {
  CCS1_PINS,
  CCS1_DC_HOUSING,
  CCS1_EXTENT,
  J1772_FACE_R,
  NACS_FACE,
  NACS_PINS,
} from "@/lib/connector-geometry";

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
 * The palette is already written in lib/illustration.ts and the shared
 * primitives already draw to it: hardware is the ink ramp, energy is brand
 * orange,
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
/** Top edge of the connectors cover's holster board. Named because the board
 *  and two cable leads all have to agree on it, and while it was typed four
 *  times over one of them ended up fifteen units out. */
const BOARD_Y = 146;
/** Where the L2 wallbox's lead sits in its holster, on the levels cover. */
const L2_HOLSTER: [number, number] = [152, 142];
/** Where the home unit's lead meets its strain relief, on the homeAway cover. */
const HOME_RELIEF: [number, number] = [138, 142];

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
  /* The reveal below traces this path, and stroke-dashoffset only works if the
     dash length IS the path length. It was typed as 420 against a path 203.1
     units long, so the stroke stayed entirely invisible until the offset fell
     below 217 — the first 52% of a 1.4s animation showed nothing at all, then
     the curve snapped in. Summed here so it cannot be wrong again. */
  const len = pts.reduce(
    (a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0),
    0
  );
  return { d, X0, X1, Y1, pts, len };
})();
const CURVE = CURVE_PLOT.d;

/* The MAP projection and its station() helper lived here, feeding the
   corridors cover when that cover was a drawn map. It is a route sign now —
   the guide's own body carries real OpenStreetMap tiles, so the masthead has
   no business imitating one — and with the last consumer gone the projection,
   both generated centreline datasets and their two Overpass scripts went with
   it. They are in git if a drawn corridor is ever wanted again. */

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
function holsterAt(x: number, h: number, toward?: number): [number, number] {
  /* The redrawn cabinet holsters at chest height — 51.3 of its 88 — and it
     carries TWO couplers: CCS1 at x=15.2 and NACS at x=32.8 of the 48-wide
     box, 8.8 either side of centre. A lead leaves from whichever side the car
     is on, so it never crosses the cabinet's own face. Pass the port's x as
     `toward` and hand the same side to <Charger out=...>, or the coupler will
     still be sitting in the holster the cable claims to leave from. */
  const side = toward === undefined ? 0 : Math.sign(toward - x);
  return [
    x + (side * h * ANCHOR.holster.dx) / 88,
    FLOOR - (h * (UNIT_VB.foot * 88 - ANCHOR.holster.y)) / 88,
  ];
}
function portAt(x: number, w: number, flip = false): [number, number] {
  const h = (w * CAR_VB.h) / CAR_VB.w;
  const dx = ((ANCHOR.port.x - CAR_VB.w / 2) / CAR_VB.w) * w;
  return [x + (flip ? -dx : dx), FLOOR - (h * (CAR_VB.foot * 70 - ANCHOR.port.y)) / 70];
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

/**
 * A lead from a coupler down to where its cable enters the hardware.
 *
 * sagPath above is for a cable slung between two SUPPORTS — a holster and a
 * car's port, both up in the air — so it hangs below both ends. This is the
 * other case: the lower end is a TERMINATION, the lowest point of the run, and
 * a curve that dipped below it would pass through the thing it plugs into.
 *
 * What gravity gives you here is a lead that leaves the coupler falling
 * steeply and only then swings toward its entry point — heavy near the top,
 * never a ruled diagonal. Both control points sit below the chord's midpoint
 * in y, which is what produces that, and the curve is monotonic downward so
 * it can never bulge upward like a suspension span.
 *
 * The two leads on the connectors cover were typed by hand and neither used
 * either helper: the NACS one started 1.8 units INSIDE its own connector face
 * and ended 15 units above the board it was supposed to plug into, and 8 units
 * past the end of it. It hung in mid-air.
 */
function leadPath(
  [x0, y0]: [number, number],
  [x1, y1]: [number, number]
) {
  const dy = y1 - y0;
  /* Falls first, turns late. */
  const c1: [number, number] = [x0 + (x1 - x0) * 0.06, y0 + dy * 0.55];
  const c2: [number, number] = [x0 + (x1 - x0) * 0.55, y1];
  return `M${x0},${y0} C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${x1},${y1}`;
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
 * Every number comes from lib/connector-geometry.ts, in millimetres, which
 * components/connector-diagram.tsx also draws from. This used to be a second,
 * independent drawing typed as ratios of a radius, and it disagreed with the
 * standards-dimensioned one three ways: it filled CCS1's AC pins solid orange
 * when a DC cable leaves them empty, it arched NACS's three small pins when
 * they sit in a row, and it drew the two couplers at 1.43:1 when the real
 * ratio is 2:1 — understating the exact fact the connectors guide teaches.
 *
 * `r` is HALF THE COUPLER'S OVERALL WIDTH, so passing the true half-widths
 * (34mm and 17mm) draws them in true proportion to each other automatically.
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
  /** Half the coupler's overall width, in cover units. */
  r: number;
  kind?: "ccs1" | "nacs";
  lit?: boolean;
}) {
  const ccs1 = kind === "ccs1";
  /* One scale for both faces, derived from the real half-width, so the two
     cannot drift apart the way they did when each was tuned by eye. */
  const k = r / (ccs1 ? CCS1_EXTENT.halfWidth : NACS_FACE.w / 2);
  const pins = ccs1 ? CCS1_PINS : NACS_PINS;

  return (
    <g>
      {ccs1 ? (
        <>
          {/* The DC housing, drawn first so the round face overlaps it. */}
          <rect
            x={x - CCS1_DC_HOUSING.halfWidth * k}
            y={y + CCS1_DC_HOUSING.top * k}
            width={CCS1_DC_HOUSING.halfWidth * 2 * k}
            height={(CCS1_DC_HOUSING.bottom - CCS1_DC_HOUSING.top) * k}
            rx={CCS1_DC_HOUSING.radius * k}
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={0.9}
            strokeOpacity={0.7}
          />
          <circle
            cx={x} cy={y} r={J1772_FACE_R * k}
            fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.3} strokeOpacity={0.9}
          />
        </>
      ) : (
        /* A capsule, not a circle. NACS is 34 wide by 44 tall; drawing it
           round made both its shape and the size comparison wrong. */
        <rect
          x={x - (NACS_FACE.w / 2) * k}
          y={y - (NACS_FACE.h / 2) * k}
          width={NACS_FACE.w * k}
          height={NACS_FACE.h * k}
          rx={(NACS_FACE.w / 2) * k}
          fill={ILLO.recess}
          stroke={ILLO.edge}
          strokeWidth={1.3}
          strokeOpacity={0.9}
        />
      )}

      {pins.map((pin) => (
        <circle
          key={pin.id}
          cx={x + pin.dx * k}
          cy={y + pin.dy * k}
          r={pin.r * k}
          /* An empty well is a hole, so it takes the recess colour and a
             dashed edge. Only a pin that actually carries current may be
             orange — the palette rule is that orange means power is moving. */
          fill={pin.empty ? ILLO.recess : pin.power && lit ? ILLO.live : ILLO.seam}
          stroke={pin.empty ? ILLO.seam : undefined}
          strokeWidth={pin.empty ? 0.7 : undefined}
          strokeOpacity={pin.empty ? 0.8 : undefined}
          strokeDasharray={pin.empty ? "1.4 1.1" : undefined}
        />
      ))}
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
  modules = 3,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  from?: number;
  to?: number;
  /** A paint, not just a colour — `url(#…)` is welcome here. */
  tone?: string;
  /** How many module divisions show through the fill. */
  modules?: number;
}) {
  const l = x - w / 2;
  const t = y - h / 2;
  const inset = 4;
  const iw = w - inset * 2;
  /* The fraction maps across the FULL width, not the inset inner width.
     It used to be `l + inset + iw * from`, which for a 120-wide module put the
     drawn 20% edge at 116.4 while the tick beside it, and the check that
     verifies the tick, both said 114. The check never saw it because it
     compared the tick to the same formula the tick came from and never to the
     rectangle actually on screen. */
  const fx = (f: number) => l + w * f;
  return (
    <g>
      <rect x={l} y={t} width={w} height={h} rx={5} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.2} strokeOpacity={0.85} />
      <rect x={l + w} y={y - h * 0.16} width={3.6} height={h * 0.32} rx={1.4} fill={ILLO.edge} opacity={0.6} />
      {to > from && (
        <rect
          x={fx(from)}
          y={t + inset}
          width={fx(to) - fx(from)}
          height={h - inset * 2}
          rx={2.4}
          fill={tone}
          opacity={0.9}
        />
      )}
      {/* the modules you can see through */}
      {Array.from({ length: modules }, (_, i) => (i + 1) / (modules + 1)).map((p) => (
        <rect key={p} x={l + inset + iw * p - 0.5} y={t + inset} width={1} height={h - inset * 2} fill={ILLO.stage} opacity={0.55} />
      ))}
      {/* a top highlight, so the pack has a lit face like everything else */}
      <rect x={l + inset} y={t + inset} width={iw} height={2} rx={1} fill={ILLO.keyLight} opacity={0.14} />
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
      /* 700, not 800: app/layout.tsx loads 400/500/600/700 only, so 800 was
         being synthesised — faux-bold smeared over the real 700. */
      fontWeight={700}
      letterSpacing="0.4"
      /* Named rather than inherited. It reads from <body> inside the app, but
         the moment this SVG renders anywhere else — the contact sheet, an OG
         image, a standalone export — inheritance gives it a system serif. */
      fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
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
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={700}
      /* The site's own overline is 0.16em (.text-overline in globals.css).
         A flat "0.5" here is 0.5 USER UNITS — 0.059em at size 8.5 — so these
         set four times tighter than every other overline on the page and read
         as generic SVG caps rather than as HubCharge's. Scaled off the size so
         a 20-unit label and an 8-unit one track the same. */
      letterSpacing={size * 0.14}
      fill={tone}
      textAnchor={anchor}
      fontFamily="var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
    >
      {text}
    </text>
  );
}

/**
 * The one place the display face is allowed in.
 *
 * The site's rule is that the serif never sets below 20px and never above
 * weight 500. Working out what 20px is here: the masthead's right column is
 * 600px wide at desktop, but only 288px at a 320px viewport — so one viewBox
 * unit is 0.96px at the narrowest, and 20px is 20.8 units. Hence 21.
 *
 * That rules the face out of almost everything on these plates. The wordmark
 * sets at 10.5 units (12px on a phone), every Label at 8.5 (9.7px) — all of
 * them stay in the sans, as they should. What survives is a single glyph that
 * IS the subject of its cover, which is the only place a display face was ever
 * going to earn its keep at this scale.
 *
 * Weight 400, because the rule caps the serif at 500 and because a bold serif
 * at ninety pixels reads as a clearance sale. `opsz` is why Fraunces holds at
 * both 92px and 25px, and it is set for the same reason globals.css sets it.
 */
const SERIF_MIN_UNITS = 21;

function Display({
  x,
  y,
  text,
  size,
  tone = ILLO.live,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  size: number;
  tone?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={Math.max(size, SERIF_MIN_UNITS)}
      fontWeight={400}
      fill={tone}
      textAnchor={anchor}
      fontFamily="var(--font-fraunces), ui-serif, Georgia, serif"
      style={{ fontVariationSettings: '"opsz" 72' }}
    >
      {text}
    </text>
  );
}

/** The band below the horizon — a quarter of every plate, previously empty,
 *  which is most of why the set read as sparse. FLOOR does not move; every
 *  motif is tuned to it. This is the floor those scenes stand on. */
function Ground({
  id,
  kind = "plain",
  pools = [],
  freePools = [],
}: {
  id: string;
  kind?: "bay" | "road" | "plain";
  pools?: number[];
  freePools?: number[];
}) {
  return (
    <g>
      <rect x={0} y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${id}-floor)`} />
      {/* the pool a lit charger throws on the floor — the one thing that
          makes these read as lit places rather than flat diagrams */}
      {freePools.map((px) => (
        <ellipse key={px} cx={px} cy={FLOOR + 8} rx={54} ry={18} fill={`url(#${id}-poolfree)`} />
      ))}
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
const CAR_VB = { w: 200, h: 70, foot: ANCHOR.carFoot / 70 };
const UNIT_VB = { w: 48, h: 88, foot: ANCHOR.unitFoot / 88 };

function Car({
  id,
  x,
  w,
  flip = false,
  dim,
  groundY,
}: {
  id: string;
  /** centre of the car on the cover's x axis */
  x: number;
  /** drawn width in cover units */
  w: number;
  flip?: boolean;
  /**
   * How near this car is, 0 (far) to 1 (near). The comment here has claimed
   * "haze back toward the sky rather than darkening it" since it was written,
   * while the code did the literal opposite: opacity, against a near-black
   * plate. On the fleet cover that turned two of the three cars into smudges.
   * It now keeps most of its opacity and gets real atmosphere instead.
   */
  dim?: number;
  /** Where this car's tyres touch. Defaults to FLOOR — a car partway down a
   *  receding road contacts the ground nearer the viewer than the horizon. */
  groundY?: number;
}) {
  const h = (w * CAR_VB.h) / CAR_VB.w;
  const near = dim ?? 1;
  const base = groundY ?? FLOOR;
  /* Mirrored about the car's own centre with an explicit SVG transform. A CSS
     `transform: scaleX(-1)` with `transform-origin: center` does not resolve
     against a nested <svg>'s own box, so the car flipped about the wrong axis
     and the cable ran to where the port wasn't. */
  return (
    <g transform={flip ? `translate(${2 * x} 0) scale(-1 1)` : undefined}>
      <svg
        x={x - w / 2}
        y={base - h * CAR_VB.foot}
        width={w}
        height={h}
        viewBox={`0 0 ${CAR_VB.w} ${CAR_VB.h}`}
        opacity={0.55 + near * 0.45}
      >
        <CarSVG id={`${id}-car${Math.round(x)}`} haze={(1 - near) * 0.8} />
      </svg>
    </g>
  );
}

/** The attendant, landed on FLOOR from their own foot fraction like everything
 *  else. ValetSVG puts their shadow at cy=100 of a 60x104 box. */
const VALET_VB = { w: 60, h: 104, foot: ANCHOR.valetFoot / 104 };

function Valet({
  id,
  x,
  h = 92,
  holding = "terminal",
}: {
  id: string;
  x: number;
  h?: number;
  holding?: "terminal" | "food" | "cable";
}) {
  const w = (h * VALET_VB.w) / VALET_VB.h;
  return (
    <svg
      x={x - w / 2}
      y={FLOOR - h * VALET_VB.foot}
      width={w}
      height={h}
      viewBox={`0 0 ${VALET_VB.w} ${VALET_VB.h}`}
    >
      <ValetSVG id={`${id}-v${Math.round(x)}`} holding={holding} />
    </svg>
  );
}

function Charger({
  id,
  x,
  h = 74,
  active = false,
  done = false,
  free = false,
  out = "nacs",
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
  /** Which coupler is in use, for covers that draw a live cable. It leaves
   *  its holster empty, so set it to the side holsterAt() was pointed at. */
  out?: "nacs" | "ccs";
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
      <ChargerSVG id={`${id}-u${Math.round(x)}`} active={active} done={done} free={free} out={out} still />
    </svg>
  );
}

/* ── The plate ───────────────────────────────────────────────────── */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      {/* The sky, on a diagonal so the ramp runs WITH the light rather than
          across it. Four stops over a much wider range than the two it had:
          the eye reads a lit corner and a dark far corner instead of a flat
          navy field with a faint seam across the middle. */}
      <linearGradient id={`${id}-plate`} x1="6%" y1="0%" x2="78%" y2="100%">
        <stop offset="0%" stopColor={ILLO.skyHigh} />
        <stop offset="34%" stopColor={ILLO.skyMid} />
        <stop offset="72%" stopColor={ILLO.stage} />
        <stop offset="100%" stopColor={ILLO.skyLow} />
      </linearGradient>
      {/* The key light. Its position is not a preference: CarSVG offsets its
          contact shadow to the right and highlights the beltline along the
          top, and ChargerSVG puts its brushed edge on the left face. Every
          object here has been lit from the upper left since it was drawn.
          Only the plate disagreed. */}
      <radialGradient id={`${id}-key`} cx="34%" cy="26%" r="64%">
        <stop offset="0%" stopColor={ILLO.keyLight} stopOpacity={0.155} />
        <stop offset="46%" stopColor={ILLO.keyLight} stopOpacity={0.055} />
        <stop offset="100%" stopColor={ILLO.keyLight} stopOpacity={0} />
      </radialGradient>
      {/* Horizon glow. The single biggest change to the family: the floor and
          the sky used to butt together at a one-pixel line, which is what a
          chart does, not what a place does. */}
      <radialGradient id={`${id}-horizon`} cx="50%" cy="100%" r="74%">
        <stop offset="0%" stopColor={ILLO.horizon} stopOpacity={0.32} />
        <stop offset="42%" stopColor={ILLO.horizon} stopOpacity={0.115} />
        <stop offset="100%" stopColor={ILLO.horizon} stopOpacity={0} />
      </radialGradient>
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
      {/* The pool a lit charger throws on the floor. Orange, because power is
          moving through it. */}
      <radialGradient id={`${id}-pool`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.live} stopOpacity={0.2} />
        <stop offset="55%" stopColor={ILLO.live} stopOpacity={0.07} />
        <stop offset="100%" stopColor={ILLO.live} stopOpacity={0} />
      </radialGradient>
      {/* And the pool a FREE one throws, which is green, because its light
          blade is green — the real cabinet's status bars are green when the
          bay is available. Four covers used to stand a green charger in an
          orange pool, which says power is moving through an empty bay. */}
      <radialGradient id={`${id}-poolfree`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.ok} stopOpacity={0.14} />
        <stop offset="55%" stopColor={ILLO.ok} stopOpacity={0.05} />
        <stop offset="100%" stopColor={ILLO.ok} stopOpacity={0} />
      </radialGradient>
      {/* Vignette, moved onto the key light and started twenty-two points
          earlier. Beginning at 74% it did nothing until the last few pixels
          of the frame, which is the same as not having one. */}
      <radialGradient id={`${id}-vig`} cx="42%" cy="40%" r="78%">
        <stop offset="52%" stopColor={ILLO.shadow} stopOpacity={0} />
        <stop offset="82%" stopColor={ILLO.shadow} stopOpacity={0.16} />
        <stop offset="100%" stopColor={ILLO.shadow} stopOpacity={0.42} />
      </radialGradient>
      <linearGradient id={`${id}-screen`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.glassLow} />
        <stop offset="100%" stopColor={ILLO.glass} />
      </linearGradient>
      {/* The lit band of a battery, graded. Flat ILLO.live across ninety units
          was the largest area of pure saturation anywhere in the set. */}
      <linearGradient id={`${id}-band`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.liveGlow} stopOpacity={0.95} />
        <stop offset="45%" stopColor={ILLO.live} stopOpacity={0.9} />
        <stop offset="100%" stopColor={ILLO.liveDim} stopOpacity={0.95} />
      </linearGradient>
      <radialGradient id={`${id}-bloom`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={ILLO.live} stopOpacity={0.17} />
        <stop offset="100%" stopColor={ILLO.live} stopOpacity={0} />
      </radialGradient>
      {/* Grain, which is the only thing that actually removes the banding.
          Generated once into a 50-unit tile and repeated — 300 and 200 are
          both exact multiples of 50, so it tiles with no seam. Filtering the
          whole plate would be nearly a million pixels of Perlin noise at 2x;
          the tile is forty thousand, computed once and then blitted. Nothing
          animated may ever go inside it, or the filter re-runs every frame. */}
      <filter
        id={`${id}-grain`}
        x="0"
        y="0"
        width="50"
        height="50"
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" />
      </filter>
      <pattern id={`${id}-noise`} x="0" y="0" width={50} height={50} patternUnits="userSpaceOnUse">
        <rect width={50} height={50} filter={`url(#${id}-grain)`} />
      </pattern>
    </defs>
  );
}

/**
 * Something to stand on.
 *
 * Nine of the twenty-one covers touched nothing — connectors, curve, climate,
 * band, fault, highway, corridors, milestones and paperwork all floated in
 * mid-air while this file's own header claimed everything sat on FLOOR. That
 * is most of why those nine read as diagrams pasted onto a plate rather than
 * as objects in the same room as the other twelve.
 *
 * A chart has no wheels, but it can still stand on a dais. The near edge is
 * drawn lower AND wider than the top, because the ground recedes away from
 * the viewer; drawn parallel it reads as a floating slab.
 */
function Plinth({ id, x, w, h = 7 }: { id: string; x: number; w: number; h?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={FLOOR + 2} rx={w * 0.62} ry={9} fill={`url(#${id}-contact)`} />
      <path d={`M${x - w / 2},${FLOOR} h${w} l6,${h} h${-(w + 12)} Z`} fill={ILLO.bodyDark} />
      <rect x={x - w / 2} y={FLOOR - 2} width={w} height={2.4} rx={1.2} fill={ILLO.bodyLight} opacity={0.45} />
    </g>
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
  /** x positions of CHARGING units, which pool orange light on the floor. */
  pools?: number[];
  /** x positions of FREE units, which pool green. */
  freePools?: number[];
  /** Power is moving somewhere in this cover, so the plate may carry the
   *  orange bloom. Defaults to whether anything pools light on the floor.
   *  Ten covers used to glow orange with nothing live in them at all, which
   *  is exactly the rule lib/illustration.ts exists to prevent: orange means
   *  power is moving, and never anything else. */
  energy?: boolean;
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
        <Cable d={sagPath(holsterAt(78, 84, 198), portAt(198, 112, true), 34)} live animated />
      </>
    ),
  },

  /* what a visit is, as three beats */
  arrival: {
    label: "A car connected to a unit, above the three named steps of a stop.",
    pools: [230],
    draw: (id) => (
      <>
        <Charger id={id} x={230} h={82} active out="ccs" />
        <Car id={id} x={104} w={104} />
        <Cable d={sagPath(holsterAt(230, 82, 104), portAt(104, 104), 34)} live animated />
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
    energy: true,
    draw: (id) => (
      <>
        {/* CCS1 left, NACS right, matching alhambra-holsters.webp — and CCS1
            drawn larger because it is the larger coupler. The labels used to
            be on the wrong plugs entirely. */}
        {/* cables leave from the side of each coupler, so the name can sit
            directly under its own body instead of being stranded between the
            body and its own cable */}
        {/* BOTH LEADS LAND ON THE BOARD. The NACS one used to stop at
            (246,128) — fifteen units above the board's top edge at y=146 and
            eight units past its right end at x=238 — with its strain relief
            floating in open air, while the CCS1 one terminated correctly.
            That asymmetry is the first thing you see on this cover. Both now
            leave the edge of their own coupler and enter the board through a
            moulded relief, on leadPath, so each falls under its own weight
            rather than ruling a straight diagonal. */}
        <Cable d={leadPath([115, 127], [138, BOARD_Y])} />
        <rect x={133} y={BOARD_Y - 4} width={10} height={5.5} rx={2.6} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        <Cable d={leadPath([216, 100], [228, BOARD_Y])} />
        <rect x={223.5} y={BOARD_Y - 4} width={9} height={5} rx={2.4} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        {/* Both couplers hang off a holster board that stands on the floor,
            which is how they hang at Alhambra — and is what stops this cover
            floating in the middle of an empty plate. */}
        <Plinth id={id} x={150} w={168} />
        <rect x={62} y={BOARD_Y} width={176} height={6} rx={3} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.9} strokeOpacity={0.5} />
        {/* r is half each coupler's real body width — 24mm and 17mm — so both
            render at the same 1.25 units per millimetre and the difference on
            the plate is the measured one rather than one chosen by eye. The
            pins inside come from the same table connector-diagram.tsx draws
            from, which is what stopped the two disagreeing. */}
        <Plug x={96} y={70} r={30} kind="ccs1" lit />
        <Plug x={208} y={74} r={21.25} kind="nacs" lit />
        {/* the live pins of the pair the reader is most likely to have */}
        <g className="hc-standby">
          <circle cx={96} cy={78} r={34} fill={ILLO.live} opacity={0.07} />
        </g>
        <Label x={96} y={138} text="CCS1" />
        <Label x={208} y={114} text="NACS" />
        <g className="hc-rise" style={{ animationDelay: "0.3s" }}>
          <Label x={150} y={176} text="BOTH FITTED" size={8.5} tone={ILLO.ok} />
        </g>
      </>
    ),
  },

  /* plug meeting socket */
  fits: {
    label: "A charging connector, an arrow, and a car whose charge port it fits, confirmed with a tick.",
    energy: true,
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
        <g className="hc-standby">
          {/* r=9, not 14. The car's wheels grew by half when it was redrawn
              to the reference, and a 14-unit ring around a port that sits
              nine units from the rear axle stopped ringing the port and
              started ringing the wheel. */}
          <circle cx={portAt(206, 104)[0]} cy={portAt(206, 104)[1]} r={9} fill="none" stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.85} strokeDasharray="3 3" />
        </g>
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
          <g className="hc-standby">
            <circle cx={143} cy={108} r={1.4} fill={ILLO.ok} opacity={0.9} />
          </g>
          {/* The lead and the holster read the same point, so the cable
              cannot drift off the thing it plugs into — which is exactly how
              the connectors cover ended up with a lead hanging in open air. */}
          <Cable d={leadPath([143, 126], [L2_HOLSTER[0], L2_HOLSTER[1]])} />
          <circle cx={L2_HOLSTER[0]} cy={L2_HOLSTER[1]} r={3.4} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={0.9} />
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
    energy: true,
    draw: (id) => (
      <>
        {/* The plot used to end at y=132 with twenty units of empty floor
            below it. Its axis now runs down to the same line everything else
            in the set stands on. */}
        <Plinth id={id} x={156} w={236} />
        <path d={`M40,36 V${FLOOR}`} fill="none" stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M40,132 H272" fill="none" stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.5} strokeLinecap="round" />
        {[58, 82, 106].map((y) => (
          <path key={y} d={`M40,${y} H272`} stroke={ILLO.seam} strokeWidth={0.7} strokeOpacity={0.14} strokeDasharray="3 5" />
        ))}
        {/* The sweet spot the guide is actually about. x maps state of charge
            across the plot, so 20% and 60% land where the data puts them. */}
        {/* Wrapped, not classed directly: hc-breathe sets opacity absolutely,
            so on an element that is meant to sit at 0.1 it would animate to a
            solid slab. On a parent it multiplies instead. */}
        <g className="hc-breathe">
        <rect
          x={CURVE_PLOT.X0 + 0.2 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)}
          y={36}
          width={0.4 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)}
          height={96}
          fill={ILLO.ok}
          opacity={0.1}
        />
        </g>
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
          style={{ ["--len" as string]: CURVE_PLOT.len.toFixed(0) }}
        />
        <Label x={CURVE_PLOT.X0 + 0.4 * (CURVE_PLOT.X1 - CURVE_PLOT.X0)} y={48} text="SWEET SPOT" tone={ILLO.ok} size={9} />
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
    pools: [266],
    draw: (id) => (
      <>
        {/* The guide compares per-kWh, per-minute, idle fees and memberships
            against one flat charge. This was four crossed list items and a
            rounded box — a slide, not a drawing. It is a printed receipt now,
            which is the object the guide is actually complaining about.
            No figure is printed: the rate lives only in the product shot, and
            the check asserts no digit ever appears on this cover. */}
        <g transform="rotate(-3 84 96)">
          <rect x={30} y={38} width={108} height={116} rx={3} fill={ILLO.pane} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.5} />
          <rect x={30} y={38} width={108} height={10} rx={3} fill={ILLO.bodyLight} opacity={0.35} />
          {/* torn along the bottom, the way a till roll leaves it */}
          <path
            d={`M30,154 ${Array.from({ length: 12 }, (_, i) => `l4.5,${i % 2 ? 5 : -5}`).join(" ")} L138,154 Z`}
            fill={ILLO.pane}
          />
          {["PER kWh", "PER MINUTE", "IDLE FEE", "MEMBERSHIP"].map((t, i) => (
            <g key={t} className="hc-rise" style={{ animationDelay: `${0.08 + i * 0.07}s` }}>
              {/* ink on paper, not seam-on-pane: at #48607F on a #223040
                  receipt these lines were 1.6:1 and the strikethrough was the
                  only thing you could read. */}
              <Label x={40} y={70 + i * 21} text={t} size={7} anchor="start" tone={ILLO.hub} />
              <path
                d={`M38,${67 + i * 21} h${t.length * 5}`}
                stroke={ILLO.fault}
                strokeWidth={1.2}
                strokeOpacity={0.7}
                strokeLinecap="round"
              />
              <Cross x={128} y={67 + i * 21} r={5} />
            </g>
          ))}
        </g>

        <path d="M152,96 h18" fill="none" stroke={ILLO.hub} strokeWidth={1.5} strokeOpacity={0.6} strokeLinecap="round" />
        <path d="M164,90 L171,96 L164,102" fill="none" stroke={ILLO.hub} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* The one flat charge, as the terminal you actually tap. */}
        <g transform="translate(206 96)">
          <rect x={-26} y={-32} width={52} height={64} rx={7} fill={ILLO.bodyDark} stroke={ILLO.ok} strokeWidth={1.4} strokeOpacity={0.75} />
          <rect x={-19} y={-25} width={38} height={30} rx={3} fill={ILLO.glass} stroke={ILLO.edge} strokeWidth={0.7} strokeOpacity={0.6} />
          <Label x={0} y={-13} text="ONE" size={9} tone={ILLO.ok} />
          <Label x={0} y={-1} text="FLAT" size={9} tone={ILLO.ok} />
          {/* the contactless target, and the only thing on this cover that
              moves after it arrives */}
          <g className="hc-standby">
            <circle cx={0} cy={17} r={7} fill="none" stroke={ILLO.ok} strokeWidth={1.4} strokeOpacity={0.8} />
            <circle cx={0} cy={17} r={2.6} fill={ILLO.ok} opacity={0.8} />
          </g>
        </g>
        <Charger id={id} x={266} h={76} active />
      </>
    ),
  },

  /* one flat block, not a meter */
  flat: {
    label: "A rising metered price ruled out beside one flat price that does not change.",
    ground: "bay",
    energy: true,
    draw: (id) => (
      <>
        {/* Two bar charts floating over an empty floor said "chart", not
            "price". A meter is a physical object with a drum behind a window,
            and the drum never stops — which is the entire complaint the guide
            makes about metered charging. */}
        <Plinth id={id} x={74} w={72} />
        <rect x={40} y={92} width={68} height={60} rx={6} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.6} />
        <rect x={40} y={92} width={68} height={5} rx={2.5} fill={ILLO.bodyLight} opacity={0.5} />
        <clipPath id={`${id}-drum`}>
          <rect x={48} y={112} width={52} height={16} rx={2} />
        </clipPath>
        <rect x={48} y={112} width={52} height={16} rx={2} fill={ILLO.stage} stroke={ILLO.edge} strokeWidth={0.9} strokeOpacity={0.7} />
        <g clipPath={`url(#${id}-drum)`}>
          {/* Travels sixteen units through a sixteen-unit window and wraps, so
              the digits never stop climbing. Its animated area is 832 square
              units — under one and a half percent of the plate. */}
          <g className="hc-meter">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i} transform={`translate(0 ${i * 16})`}>
                {[0, 1, 2].map((c) => (
                  <rect key={c} x={54 + c * 14} y={116} width={9} height={8} rx={1.4} fill={ILLO.fault} opacity={0.75} />
                ))}
              </g>
            ))}
          </g>
        </g>
        <Label x={74} y={144} text="METERED" tone={ILLO.fault} size={7.5} />
        <g className="hc-pop" style={{ animationDelay: "0.15s" }}>
          <Cross x={74} y={74} r={13} />
        </g>

        <path d="M124,116 H150" stroke={ILLO.seam} strokeWidth={1.6} strokeOpacity={0.5} strokeLinecap="round" />
        <path d="M144,110 L151,116 L144,122" fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />

        {/* One card, one number's worth of space, and nothing that climbs. */}
        <Plinth id={id} x={214} w={80} />
        <rect x={172} y={86} width={84} height={66} rx={7} fill={ILLO.pane} stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.8} />
        <rect x={172} y={86} width={84} height={4.5} rx={2.2} fill={ILLO.live} opacity={0.5} />
        <g className="hc-rise" style={{ animationDelay: "0.2s" }}>
          <rect x={186} y={106} width={56} height={9} rx={4.5} fill={ILLO.live} opacity={0.9} />
          <rect x={198} y={122} width={32} height={5} rx={2.5} fill={ILLO.hub} opacity={0.45} />
        </g>
        <Label x={214} y={144} text="FLAT" tone={ILLO.live} size={7.5} />
        <g className="hc-pop" style={{ animationDelay: "0.3s" }}>
          <Tick x={214} y={74} r={13} />
        </g>
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
        <g className="hc-standby">
          <circle cx={portAt(150, 108)[0]} cy={portAt(150, 108)[1]} r={7} fill={ILLO.live} opacity={0.16} />
        </g>
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
    pools: [66],
    freePools: [238],
    draw: (id) => (
      <>
        <Charger id={id} x={66} h={78} active />
        <Car id={id} x={150} w={86} flip />
        <Cable d={sagPath(holsterAt(66, 78, 150), portAt(150, 86, true), 26)} live animated />
        <Charger id={id} x={238} h={78} free />
        <g className="hc-standby">
          <ellipse cx={238} cy={110} rx={14} ry={22} fill={ILLO.ok} opacity={0.1} />
        </g>
        <Label x={238} y={178} text="FREE" tone={ILLO.ok} size={8} />
        <Label x={110} y={178} text="MOVE WHEN DONE" tone={ILLO.hub} size={8} />
      </>
    ),
  },

  /* cold on one side, heat on the other */
  climate: {
    label:
      "Three columns showing the share of full charging speed a battery accepts at forty, seventy and ninety-five degrees, against a full-speed reference line.",
    teaches: "Preconditioning is the fix, and you control it",
    energy: true,
    draw: (id) => {
      /* WHAT CHANGED, AND WHY.
         These were drawn as BATTERIES filled to a percentage. The quantity is
         not a state of charge, it is a RATE — the share of full speed the pack
         will take at that temperature — and a battery drawn 62% full says the
         other thing to everyone who looks at it. Columns against a reference
         line say "how fast", which is what TEMPERATURE_FACTORS holds.

         The fill was also inset by 4 units at the top AND the bottom of a
         68-unit well, so a "100%" bar drew 60 of 68 and the three % labels,
         centred on the un-inset midpoint, sat at three different heights
         inside their own bars. Columns rise from one baseline now, so the
         number on the plate is the number in lib/charging-math.ts.

         And COLD/MILD/HOT sat at y=155, three units below FLOOR, which is why
         they collided with the ground band. Everything lives above it.

         No snowflakes or suns: the environment carries the temperature as a
         wash behind each column, which is what weather looks like on a plate
         this dark. */
      /* The columns stand ON the floor line, which is both the honest place
         for a bar chart's baseline and what stops this cover floating — the
         previous version's plinths were carrying that job and went with the
         batteries. */
      const FULL = 76;
      const cells = [
        { k: "COLD", f: TEMPERATURE_FACTORS.cold, tone: ILLO.cold, x: 76 },
        { k: "MILD", f: TEMPERATURE_FACTORS.mild, tone: ILLO.live, x: 150 },
        { k: "HOT", f: TEMPERATURE_FACTORS.hot, tone: ILLO.heat, x: 224 },
      ] as const;
      return (
        <>
          {/* The reference line starts clear of its own label rather than
              running underneath it. */}
          <path d={`M92,${FLOOR - FULL} H274`} stroke={ILLO.hub} strokeWidth={1} strokeOpacity={0.35} strokeDasharray="3 4" />
          <Label x={22} y={FLOOR - FULL + 3} text="FULL SPEED" size={6.5} tone={ILLO.seam} anchor="start" />
          {/* The chart's baseline IS the floor line — these columns stand on
              the ground rather than hovering over it, which is what the
              plinths under the old batteries were doing. Drawn explicitly
              because a bar chart needs an axis, and because a rect whose
              bottom edge lands on FLOOR by arithmetic is grounded in fact but
              invisible to the check that asserts nothing floats. */}
          <path d={`M26,${FLOOR} H274`} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.6} />
          {cells.map(({ k, f, tone, x }, i) => {
            const h = FULL * f.factor;
            return (
              <g key={k}>
                {/* The air this one is standing in. A full-height band rather
                    than a rounded box: a box with corners reads as a card, and
                    three cards is not what three temperatures look like. */}
                <rect x={x - 33} y={40} width={66} height={FLOOR - 40} fill={tone} opacity={0.055} />
                <rect x={x - 24} y={FLOOR - FULL} width={48} height={FULL} rx={3} fill={ILLO.recess} opacity={0.5} />
                <g className="hc-fill" style={{ animationDelay: `${i * 0.12}s`, transformBox: "fill-box", transformOrigin: "bottom center" }}>
                  <rect x={x - 24} y={FLOOR - h} width={48} height={h} rx={3} fill={k === "MILD" ? `url(#${id}-band)` : tone} opacity={0.9} />
                </g>
                {/* Both labels ride above their own bar, so all three sit at
                    one place relative to the thing they describe. They used to
                    sit below the baseline, three units under FLOOR, which is
                    why they collided with the ground band. The COLD/MILD/HOT
                    row that lived there has gone: "~40°F" already says cold,
                    and it says it in a unit rather than an adjective. */}
                <Label x={x} y={FLOOR - h - 7} text={`${Math.round(f.factor * 100)}%`} size={10} tone={tone} />
                <Label x={x} y={FLOOR - h - 20} text={f.label.replace(/^[^(]*\(~?/, "~").replace(")", "")} size={7.5} tone={ILLO.seam} />
              </g>
            );
          })}
          <g className="hc-rise" style={{ animationDelay: "0.5s" }}>
            <rect x={14} y={166} width={96} height={18} rx={9} fill={ILLO.recess} stroke={ILLO.ok} strokeWidth={1.1} strokeOpacity={0.6} />
            <path d="M26,175 L30,179 L37,170" fill="none" stroke={ILLO.ok} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Label x={76} y={178} text="PRECONDITION" size={7} tone={ILLO.ok} />
          </g>
        </>
      );
    },
  },

  band: {
    label: "A battery pack on a rack with the twenty to eighty percent band lit, and both ends dimensioned.",
    teaches: "The band that matters",
    energy: true,
    draw: (id) => (
      <>
        {/* A flat orange slab across crude parallelograms, on two thin sticks.
            Same object, built properly: the pack has a lit top face and a
            shaded end, the band is graded rather than one saturated fill, and
            the marks are a real dimension line with arrowheads and witness
            lines instead of two stubs.

            The cell is narrower than it was, because at 150 wide the lit band
            alone was ninety units of pure orange — the largest area of full
            saturation anywhere in the set.

            The <Cell> call below is parsed by scripts/check-cover-accuracy.py
            with a single-line regex that re-derives the 20 and 80 tick
            positions from its real geometry. Keep it on one line, in this
            prop order, or the check stops being able to see it. */}
        <path d="M90,74 l14,-10 h120 l-14,10 Z" fill={ILLO.bodyLight} opacity={0.5} />
        <path d="M104,64 h120" stroke={ILLO.keyLight} strokeWidth={0.9} strokeOpacity={0.24} />
        <path d="M210,74 l14,-10 v52 l-14,10 Z" fill={ILLO.bodyDark} />
        <path d="M224,64 v52" stroke={ILLO.seam} strokeWidth={0.9} strokeOpacity={0.45} />
        <path d="M210,126 l14,-10" stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.35} />
        <g className="hc-fill">
          <Cell x={150} y={100} w={120} h={52} from={0.2} to={0.8} tone={`url(#${id}-band)`} modules={5} />
        </g>
        {/* the rack, braced, down to the floor */}
        <g stroke={ILLO.bodyDark} strokeWidth={4.5} strokeLinecap="round">
          <path d={`M104,126 V${FLOOR}`} />
          <path d={`M196,126 V${FLOOR}`} />
        </g>
        <g stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.24}>
          <path d={`M104,${FLOOR - 6} H196`} />
        </g>
        <ellipse cx={104} cy={FLOOR + 1} rx={12} ry={3.6} fill={`url(#${id}-contact)`} />
        <ellipse cx={196} cy={FLOOR + 1} rx={12} ry={3.6} fill={`url(#${id}-contact)`} />
        {/* the window the guide recommends, dimensioned at both ends rather
            than left for the reader to infer from a highlighted rectangle */}
        {/* x=114 and x=186 are where the 0.2 and 0.8 fill edges actually fall for
            a 120-wide cell centred on 150 — derived, not eyeballed */}
        {[{ x: 114, t: "20" }, { x: 186, t: "80" }].map(({ x, t }) => (
          <g key={t}>
            <path d={`M${x},100 V136`} stroke={ILLO.live} strokeWidth={0.9} strokeOpacity={0.5} strokeDasharray="2 3" />
            <Label x={x + (t === "20" ? -14 : 14)} y={145} text={t} tone={ILLO.live} size={9} />
          </g>
        ))}
        {/* the dimension itself, above the floor line where it can be read */}
        <path d="M114,142 H186" stroke={ILLO.live} strokeWidth={1.2} strokeOpacity={0.8} />
        <path d="M114,142 l6,-3.2 v6.4 Z M186,142 l-6,-3.2 v6.4 Z" fill={ILLO.live} opacity={0.9} />
        <Label x={150} y={174} text="CHARGE HERE, NOT TO FULL" size={7.5} tone={ILLO.seam} />
        <g className="hc-breathe">
          <ellipse cx={150} cy={100} rx={44} ry={18} fill={ILLO.live} opacity={0.08} />
        </g>
      </>
    ),
  },

  /* home and away */
  homeAway: {
    label: "A house with a wall charger on one side and a HubCharge unit on the other, both named.",
    teaches: "If you can charge at home, do",
    ground: "bay",
    freePools: [214],
    draw: (id) => (
      <>
        <Roof x={78} w={80} h={54} pitch={16} />
        <rect x={122} y={112} width={9} height={14} rx={2} fill={ILLO.unitMid} stroke={ILLO.edge} strokeWidth={0.7} strokeOpacity={0.5} />
        {/* Same point for the lead and its strain relief. */}
        <Cable d={leadPath([127, 126], [HOME_RELIEF[0], HOME_RELIEF[1]])} />
        <rect x={HOME_RELIEF[0] - 3.5} y={HOME_RELIEF[1] - 2.5} width={7} height={5} rx={2.2} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.6} />
        <path d="M150,52 V150" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.45} />
        <Charger id={id} x={214} h={72} free />
        <g className="hc-standby">
          <ellipse cx={214} cy={112} rx={13} ry={20} fill={ILLO.ok} opacity={0.1} />
        </g>
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
    freePools: [272],
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
        <g className="hc-standby">
          <ellipse cx={272} cy={124} rx={10} ry={15} fill={ILLO.ok} opacity={0.1} />
        </g>
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
    energy: true,
    draw: (id) => (
      <>
        {/* The guide's claim is that it is almost always one of five things,
            so the cover shows five, not one, with the commonest worked. */}
        <Plinth id={id} x={86} w={116} />
        <g>
          <rect x={26} y={40} width={122} height={112} rx={6} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1.1} strokeOpacity={0.55} />
          {[
            { t: "NOT SEATED", lit: true },
            { t: "CARD DECLINED", lit: false },
            { t: "CAR ASLEEP", lit: false },
            { t: "CABLE LOCKED", lit: false },
            { t: "APP OUT OF DATE", lit: false },
          ].map(({ t, lit }, i) => (
            <g key={t}>
              {/* ruled, so five strings read as one panel */}
              {i > 0 && <path d={`M32,${48 + i * 20} H142`} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.14} />}
              <g transform={`translate(40 ${58 + i * 20})`} className="hc-rise" style={{ animationDelay: `${i * 0.07}s` }}>
                <circle cx={0} cy={0} r={5.4} fill={lit ? ILLO.ok : "none"} fillOpacity={lit ? 0.2 : 1} stroke={lit ? ILLO.ok : ILLO.seam} strokeWidth={1.2} />
                {lit && <path d="M-2.4,0 L-0.6,1.9 L2.6,-2" fill="none" stroke={ILLO.ok} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />}
                <Label x={12} y={3} text={t} size={7.5} anchor="start" tone={lit ? ILLO.ok : ILLO.seam} />
              </g>
            </g>
          ))}
        </g>
        {/* the commonest one, worked — drawn with this file's own coupler
            rather than a second, worse one built out of rectangles */}
        <Plug x={224} y={78} r={26} kind="ccs1" lit />
        <g className="hc-standby">
          <circle cx={224} cy={78} r={33} fill="none" stroke={ILLO.ok} strokeWidth={1.3} strokeOpacity={0.5} strokeDasharray="4 5" />
        </g>
        {/* the lead hangs to the floor and coils ON it, rather than stopping
            two units short the way it used to */}
        <Cable d={`M250,96 C264,110 268,132 258,${FLOOR}`} live />
        <ellipse cx={256} cy={FLOOR} rx={12} ry={3.4} fill="none" stroke={ILLO.liveDim} strokeWidth={2} strokeOpacity={0.8} />
        <ellipse cx={256} cy={FLOOR + 1} rx={17} ry={5} fill={`url(#${id}-contact)`} />
        <Label x={224} y={30} text="PUSH IT HOME" size={8} tone={ILLO.ok} />
      </>
    ),
  },

  /* asking */
  ask: {
    label: "Somebody asking a question at a HubCharge unit, and getting an answer back.",
    ground: "bay",
    freePools: [46],
    draw: (id) => (
      <>
        {/* Two near-identical question bubbles is a wireframe, and it missed
            the point of the page: the answer to a question here is a person,
            not a form. So the second bubble is a REPLY — tail on the other
            side, in the colour this system uses for "sorted". */}
        <Charger id={id} x={46} h={70} free />
        <g className="hc-standby">
          <ellipse cx={46} cy={116} rx={12} ry={19} fill={ILLO.ok} opacity={0.1} />
        </g>
        <Valet id={id} x={104} h={92} holding="terminal" />
        {/* asked */}
        <path
          d="M140,44 H272 a9,9 0 0 1 9,9 V92 a9,9 0 0 1 -9,9 H150 l-12,12 v-12 H140 a9,9 0 0 1 -9,-9 V53 a9,9 0 0 1 9,-9 Z"
          fill={ILLO.recess}
          stroke={ILLO.edge}
          strokeWidth={1.3}
          strokeOpacity={0.8}
          strokeLinejoin="round"
        />
        <Display x={206} y={88} text="?" size={40} tone={ILLO.live} />
        {/* answered */}
        <g className="hc-drift">
          <path
            d="M162,116 H272 a8,8 0 0 1 8,8 V148 a8,8 0 0 1 -8,8 H162 a8,8 0 0 1 -8,-8 V124 a8,8 0 0 1 8,-8 Z"
            fill={ILLO.recess}
            stroke={ILLO.ok}
            strokeWidth={1.2}
            strokeOpacity={0.7}
            strokeLinejoin="round"
          />
          <path d="M162,156 l-10,10 v-10 Z" fill={ILLO.recess} stroke={ILLO.ok} strokeWidth={1.2} strokeOpacity={0.7} strokeLinejoin="round" />
          <path d="M170,132 L176,138 L188,126" fill="none" stroke={ILLO.ok} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          <rect x={198} y={128} width={62} height={6} rx={3} fill={ILLO.ok} opacity={0.4} />
          <rect x={198} y={140} width={42} height={5} rx={2.5} fill={ILLO.ok} opacity={0.25} />
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
    pools: [228],
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
        <Charger id={id} x={228} h={62} active out="ccs" />
        <Cable d={sagPath(holsterAt(228, 62, 96), portAt(96, 100), 22)} live animated />
      </>
    ),
  },

  /* the long way */
  highway: {
    label:
      "A roadside charging stop seen from across the road: three bays, one car charging, one just arrived and one bay free.",
    teaches: "Arrive low, leave early",
    ground: "road",
    pools: [26],
    freePools: [262],
    draw: (id) => (
      <>
        {/* EVERYTHING FACES THE SAME WAY. THAT IS THE WHOLE FIX.
            This cover used to put three viewpoints in one frame: a road in
            one-point perspective receding to a vanishing point, a charger in
            flat front elevation, and a car in flat SIDE elevation standing on
            it. The car therefore read as driving ACROSS the road rather than
            along it, which is why the scene would not resolve however the
            pieces were arranged. Two map pins in plan view floated above all
            three, and the nearer of the two was drawn smaller than the far
            one, so even they disagreed with themselves.

            CarSVG and ChargerSVG are both strict elevations, so the road has
            to be an elevation too — and the ground band's `road` treatment
            already runs left to right, parallel to the picture plane. A car
            side-on above it is now driving ALONG it.

            You are looking from across the road at a stop on the far side:
            the carriageway in the foreground, three bays behind it. Three
            rather than one because a driver planning a stop wants to know
            whether there will be somewhere free, and one charger with one car
            cannot say anything about that. Small cars, because the subject is
            the place, not the vehicle. */}

        {/* Bay 1 — charging. The only live thing in the frame. */}
        <Charger id={id} x={26} h={56} active />
        <Car id={id} x={78} w={88} flip />
        <Cable d={sagPath(holsterAt(26, 56, 78), portAt(78, 88, true), 20)} live animated />

        {/* Bay 2 — a car just in, not plugged yet. Its unit is at rest, so it
            pools no light: orange means power is moving. */}
        <Charger id={id} x={140} h={56} />
        {/* No haze: this car is standing in the same row as the one being
            charged, at the same distance, so dimming it was atmosphere
            claiming a depth that is not there. */}
        <Car id={id} x={200} w={88} flip />

        {/* Bay 3 — free, and saying so in green. */}
        <Charger id={id} x={262} h={56} free />

        <g className="hc-rise" style={{ animationDelay: "0.25s" }}>
          <Label x={78} y={78} text="ARRIVE LOW" size={8.5} tone={ILLO.live} />
          <Label x={216} y={78} text="LEAVE EARLY" size={8.5} tone={ILLO.seam} />
        </g>
      </>
    ),
  },

  corridors: {
    label:
      "A roadside route sign carrying the two interstate shields this network sits on, the I-10 and the I-210, above a HubCharge unit.",
    teaches: "The corridors that matter",
    ground: "road",
    pools: [252],
    draw: (id) => {
      /* THIS USED TO BE A DRAWN MAP, AND THAT WAS THE PROBLEM.
         It projected the real OpenStreetMap centrelines of the I-10 and I-210
         into a 288-unit band and pinned Alhambra and Fontana at their true
         coordinates. Every number in it was right, and it was still two pale
         squiggles on a navy plate: no streets, no ground, nothing around the
         pins, and no way to tell it from a decorative flourish. A drawing of
         a map invites the reader to read it as a map and then answers none of
         the questions a map answers. The guide it fronts now carries the real
         thing — OpenStreetMap tiles you can pan — so the cover does not need
         to imitate one, and should not.
         What a cover CAN say is which roads. That is a sign. */

      /** A US interstate shield, which is the one object that means
       *  "interstate" without a word of explanation. */
      const shield = (cx: number, cy: number, w: number) => {
        const h = w * 1.1;
        const t = cy - h / 2;
        const r = 5;
        return `M${cx - w / 2},${t + r} Q${cx - w / 2},${t} ${cx - w / 2 + r},${t}
                L${cx + w / 2 - r},${t} Q${cx + w / 2},${t} ${cx + w / 2},${t + r}
                L${cx + w / 2},${cy + h * 0.08}
                Q${cx + w / 2},${cy + h * 0.33} ${cx},${cy + h / 2}
                Q${cx - w / 2},${cy + h * 0.33} ${cx - w / 2},${cy + h * 0.08} Z`;
      };

      const PANEL = { x: 30, y: 44, w: 176, h: 68 };
      const shields: [number, string][] = [
        [PANEL.x + 46, "10"],
        [PANEL.x + 130, "210"],
      ];

      return (
        <>
          {/* Two posts, run explicitly to the floor line — a sign this size
              standing on nothing is what the grounding rule exists to catch. */}
          {[PANEL.x + 40, PANEL.x + PANEL.w - 40].map((px) => (
            <path
              key={px}
              d={`M${px},${PANEL.y + PANEL.h} V${FLOOR}`}
              stroke={ILLO.unitMid}
              strokeWidth={5}
              strokeLinecap="butt"
            />
          ))}
          <rect
            x={PANEL.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={4}
            fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.7}
          />

          {shields.map(([cx, num]) => (
            <g key={num}>
              <path d={shield(cx, PANEL.y + 30, 50)} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.4} strokeOpacity={0.9} />
              <Label x={cx} y={PANEL.y + 19} text="INTERSTATE" size={4.6} tone={ILLO.hub} />
              <Label x={cx} y={PANEL.y + 40} text={num} size={16} tone={ILLO.hub} />
            </g>
          ))}
          <Label x={PANEL.x + PANEL.w / 2} y={PANEL.y + 60} text="BOTH CORRIDORS" size={7} tone={ILLO.seam} />

          {/* And us on them. */}
          <Charger id={id} x={252} h={62} active />
          <g className="hc-rise" style={{ animationDelay: "0.3s" }}>
            <Label x={252} y={176} text="ON BOTH" size={8} tone={ILLO.ok} />
          </g>
        </>
      );
    },
  },

  milestones: {
    label:
      "A car charging at a HubCharge unit in week one, then the same car twice more, smaller and further off, by month one.",
    teaches: "Week one: find out what plug you have",
    ground: "road",
    pools: [46],
    draw: (id) => {
      /* WHAT CHANGED, AND WHY.
         This was three cars on a road drawn in one-point perspective, and no
         charger anywhere — the only cover of the twenty-one with no charging
         hardware, no plug and no cable in it, on the guide a new owner reads
         first. It also carried energy: true, so the plate painted the orange
         "power is moving" bloom over a scene where nothing was live.

         The perspective was the deeper problem. CarSVG is a strict side
         elevation: both wheels the same size, zero yaw. Pasting three of them
         at three scales onto a ground plane receding to a vanishing point put
         two incompatible projections in one frame — a car actually driving
         down that road would be seen three-quarter-rear, and none of them
         turned. The fix is not to build a three-quarter car for one cover; it
         is to stop claiming a vanishing point. Distance is now carried the
         way every other cover in the set carries it, and the way this plate's
         own atmosphere is built for: smaller, hazier, higher up the band.

         So: week one is a car actually plugged in, because that is what week
         one IS. The two behind it are the same car, receding — further away
         already means later, which is why none of them needs a date on it. */
      const stops = [
        { x: 132, w: 104, ground: FLOOR, dim: 1, when: "WEEK 1", size: 8.5, tone: ILLO.seam },
        { x: 224, w: 62, ground: FLOOR - 9, dim: 0.42, when: "WEEK 2", size: 7, tone: ILLO.seam },
        { x: 272, w: 38, ground: FLOOR - 15, dim: 0.16, when: "MONTH 1", size: 6, tone: ILLO.ok },
      ];
      return (
        <>
          {/* Furthest first, so nearer cars overlap them rather than the
              other way round. */}
          {[...stops].reverse().map((c, i) => (
            <g key={c.when} className="hc-rise" style={{ animationDelay: `${0.34 - i * 0.11}s` }}>
              <Car id={id} x={c.x} w={c.w} groundY={c.ground} dim={c.dim} flip />
              <Label
                x={c.x}
                y={c.ground - c.w * 0.4 - 7}
                text={c.when}
                size={c.size}
                tone={c.tone}
              />
            </g>
          ))}
          <Charger id={id} x={46} h={78} active />
          {/* Both ends read off the primitives' own anchors, and the curve
              sags under its own weight — the same machinery every other lead
              on the site uses, and the reason none of them can end in the air.
              The car is flipped so its inlet faces the unit. */}
          <Cable d={sagPath(holsterAt(46, 78, 132), portAt(132, 104, true), 30)} live animated />
          <Label x={150} y={44} text="THE FIRST MONTH" size={8} tone={ILLO.hub} />
          <Label x={150} y={66} text="THEN YOU STOP" size={11} tone={ILLO.live} />
          <Label x={150} y={84} text="THINKING ABOUT IT" size={11} tone={ILLO.live} />
        </>
      );
    },
  },

  /* paperwork */
  paperwork: {
    label:
      "Three incentive programmes as forms, pointing out to the body that administers them, with no amounts shown.",
    teaches: "Why this page has no dollar amounts on it",
    energy: true,
    draw: (id) => (
      <>
        {/* This cover used to lead with a giant currency mark on a page whose
            first heading is "Why this page has no dollar amounts on it". The
            page routes rather than quotes, so the cover routes too — and the
            things being routed are forms, which is what these actually are.
            The check asserts no currency mark ever appears here. */}
        <Plinth id={id} x={92} w={112} />
        {[
          { x: 38, y: 84, r: 2 },
          { x: 42, y: 68, r: -2 },
          { x: 46, y: 52, r: 0 },
        ].map(({ x, y, r }, i) => (
          <g key={y} transform={`rotate(${r} ${x + 52} ${y + 34})`} className="hc-rise" style={{ animationDelay: `${i * 0.09}s` }}>
            <rect x={x} y={y} width={104} height={64} rx={4} fill={ILLO.pane} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.55} />
            {i === 2 && (
              <>
                <rect x={x + 12} y={y + 12} width={52} height={6} rx={3} fill={ILLO.hub} opacity={0.75} />
                {[28, 38, 48].map((dy) => (
                  <rect key={dy} x={x + 12} y={y + dy} width={dy === 48 ? 46 : 74} height={4} rx={2} fill={ILLO.idle} opacity={0.65} />
                ))}
              </>
            )}
          </g>
        ))}

        {/* one arc out to whoever administers them, rather than three stubs */}
        <path
          d="M154,72 C186,66 190,84 196,92"
          fill="none"
          stroke={ILLO.live}
          strokeWidth={1.8}
          strokeOpacity={0.85}
          strokeLinecap="round"
          className="hc-draw"
          style={{ ["--len" as string]: "52", animationDelay: "0.35s" }}
        />
        <path d="M190,86 l7,6 l-7,6" fill="none" stroke={ILLO.live} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />

        {/* where they point: the administering body's own page */}
        <Plinth id={id} x={236} w={72} />
        <g transform="translate(236 106)">
          <rect x={-34} y={-58} width={68} height={92} rx={6} fill={ILLO.pane} stroke={ILLO.ok} strokeWidth={1.4} strokeOpacity={0.8} />
          <rect x={-34} y={-58} width={68} height={13} rx={6} fill={ILLO.bodyDark} opacity={0.75} />
          {[-24, -17, -10].map((cx) => (
            <circle key={cx} cx={cx} cy={-51.5} r={2.2} fill={ILLO.seam} />
          ))}
          {[-34, -22, -10].map((y) => (
            <rect key={y} x={-22} y={y} width={y === -10 ? 28 : 44} height={5} rx={2.5} fill={ILLO.ok} opacity={0.45} />
          ))}
          <g className="hc-pop" style={{ animationDelay: "0.6s" }}>
            <Tick x={0} y={16} r={9} />
          </g>
        </g>
        <Label x={92} y={172} text="CHECK THE SOURCE" size={8} tone={ILLO.seam} />
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
  const energy = m.energy ?? Boolean(m.pools?.length);
  return (
    /* The frame is a client component and the drawing is not: the SVG goes in
       as children, so it is serialised into the payload rather than bundled.
       See components/cover-frame.tsx. */
    <CoverFrame>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label={m.label}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs id={id} />
        <rect width={W} height={H} fill={`url(#${id}-plate)`} />
        {/* The light, before anything stands in it. */}
        <rect width={W} height={H} fill={`url(#${id}-key)`} />
        <ellipse cx={150} cy={FLOOR} rx={196} ry={64} fill={`url(#${id}-horizon)`} />
        {/* Orange only where power is actually moving. */}
        {energy && <ellipse cx={140} cy={100} rx={124} ry={74} fill={`url(#${id}-bloom)`} />}
        <Ground id={id} kind={m.ground} pools={m.pools} freePools={m.freePools} />
        {/* The horizon, lit from the same side as everything standing on it. */}
        <path d={`M0,${FLOOR} H${W}`} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.32} />
        <path d={`M0,${FLOOR - 0.9} H196`} stroke={ILLO.keyLight} strokeWidth={0.9} strokeOpacity={0.18} />
        {m.draw(id)}
        {/* holds the eye centre-frame; drawn over the scene, under the mark */}
        <rect width={W} height={H} fill={`url(#${id}-vig)`} pointerEvents="none" />
        {/* Last, and inert. Dithers the quantisation that made a near-flat navy
            ramp band every 57px across the masthead. */}
        <rect width={W} height={H} fill={`url(#${id}-noise)`} opacity={0.045} pointerEvents="none" />
        <Wordmark />
      </svg>
    </CoverFrame>
  );
}
