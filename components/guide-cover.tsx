import { ILLO } from "@/lib/illustration";
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

/* ── Primitives ──────────────────────────────────────────────────── */

/** The charger. Same silhouette language as ChargerSVG: soft crown, inset
 *  screen, plinth wider than the body so it sits rather than hovers. */
/** Default cabinet size. The real unit's face is about 1:2.1; this is 1:2.24. */
const UW = 34;
const UH = 76;

/**
 * One-point perspective, solved rather than eyeballed.
 *
 * The front face stays parallel to the picture plane, so it is a true
 * rectangle; only the side recedes, toward a single vanishing point on the
 * horizon. Given the near vertical edge (xe, yt..yb) and a far edge at xf,
 * this returns where that far edge actually lands. Every receding line,
 * extended, meets VP exactly — which is what makes this a construction and
 * not a drawing that merely looks three-dimensional.
 */
const HORIZON = 92;
const VP_RIGHT = 366;
const VP_LEFT = -66;
function recede(xe: number, yt: number, yb: number, vpx: number, xf: number) {
  const t = (xf - xe) / (vpx - xe);
  return { yt: yt + t * (HORIZON - yt), yb: yb + t * (HORIZON - yb) };
}

/** Where a cable leaves a unit — the top of a cable-management horn, which is
 *  where it leaves the real machine. Computed, so a cable can never drift off
 *  the hardware it is supposed to come out of. */
function unitCable(x: number, side: "left" | "right", w = UW, h = UH) {
  return { x: x + (side === "right" ? 1 : -1) * w * 0.29, y: FLOOR - h - 5.5 };
}

/** A connector seated nose-down in its holster, as CCS1 and NACS sit on the
 *  real cabinet's face. */
function Holster({ x, y, seated }: { x: number; y: number; seated: boolean }) {
  return (
    <g>
      {/* the shelf, which stays whether or not the connector is in it */}
      <path
        d={`M${x - 3.6},${y} h7.2 v1.5 h-1.5 v1.6 h-4.2 v-1.6 h-1.5 Z`}
        fill={ILLO.cabShade}
        stroke={ILLO.cabTop}
        strokeWidth={0.7}
        strokeOpacity={0.7}
        strokeLinejoin="round"
      />
      {seated && (
        <g>
          <rect x={x - 2.1} y={y + 2.4} width={4.2} height={5.4} rx={1.3} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={0.7} strokeOpacity={0.7} />
          <rect x={x - 0.8} y={y + 7.4} width={1.6} height={3.4} rx={0.8} fill={ILLO.shadow} />
        </g>
      )}
    </g>
  );
}

/**
 * A HubCharge cabinet.
 *
 * Drawn from public/images/alhambra-unit.webp and fontana-station.webp rather
 * than from the idea of a charger: flat cap, two cable horns the cables loop
 * over, brand band, twin status bars, a PORTRAIT screen, card reader, and two
 * connectors in holsters on the face. What was here before was a rounded-dome
 * pylon — the silhouette of a petrol pump, which is why it read as dated.
 *
 * Two deliberate departures from the photographs, both following the palette
 * rule in lib/illustration.ts: the real cabinet is warm grey and ours stays on
 * the blue ink ramp like every other cover, and the real status bars are green
 * where ours use live/idle — green would be a third colour meaning nothing
 * anywhere else in the set.
 *
 * No text on the cabinet. At 34 units of a 300-wide viewBox it would render
 * about 5px on a phone masthead, which is the mush that made the photographic
 * mastheads unusable. The band carries the brand here; the legible wordmark
 * lives on the plate.
 */
function Unit({
  id,
  x,
  w = UW,
  h = UH,
  lit = false,
  inUse = false,
  depth,
}: {
  id: string;
  x: number;
  w?: number;
  h?: number;
  lit?: boolean;
  /** Leaves the right holster empty — its connector is in a car. */
  inUse?: boolean;
  /** Show the cabinet's depth, receding to a vanishing point. "right" shows
   *  the right flank, so use it on units left of frame centre and vice
   *  versa — the side we see should face the middle of the picture. */
  depth?: "left" | "right";
}) {
  const l = x - w / 2;
  const r = x + w / 2;
  const top = FLOOR - h;
  const capH = 4;
  const bodyTop = top + capH;
  const base = FLOOR - 6;
  const horn = unitCable(x, "right", w, h);
  const hornL = unitCable(x, "left", w, h);
  const holsterY = base - 20;
  const hx = w * 0.27;

  return (
    <g>
      <ellipse cx={x} cy={FLOOR + 1.5} rx={w * 0.72} ry={2.4} fill={ILLO.shadow} opacity={0.42} />

      {/* cable horns, before the cap so they tuck behind it */}
      {[hornL, horn].map((p) => (
        <path
          key={p.x}
          d={`M${p.x - 1.6},${top} v-3.4 a1.6,1.6 0 0 1 3.2,0 v3.4 Z`}
          fill={ILLO.cabLow}
          stroke={ILLO.cabTop}
          strokeWidth={1}
          strokeOpacity={0.8}
          strokeLinejoin="round"
        />
      ))}

      {/* The flank, drawn BEFORE the front face so the front overlaps it. Its
          corners come from recede(), so both receding edges meet the
          vanishing point on the horizon rather than being angled by eye. */}
      {depth &&
        (() => {
          const near = depth === "right" ? r : l;
          const vp = depth === "right" ? VP_RIGHT : VP_LEFT;
          const far = near + (depth === "right" ? 11 : -11);
          const body = recede(near, bodyTop, base, vp, far);
          const cap = recede(near, top, top + capH, vp, far);
          return (
            <g>
              <path
                d={`M${near},${bodyTop} L${far},${body.yt} L${far},${body.yb} L${near},${base} Z`}
                fill={ILLO.cabShade}
                stroke={ILLO.cabLow}
                strokeWidth={1}
                strokeOpacity={0.7}
                strokeLinejoin="round"
              />
              <path
                d={`M${near + (depth === "right" ? 2.4 : -2.4)},${top} L${far + (depth === "right" ? 2.4 : -2.4)},${cap.yt} L${far + (depth === "right" ? 2.4 : -2.4)},${cap.yb} L${near + (depth === "right" ? 2.4 : -2.4)},${top + capH} Z`}
                fill={ILLO.cabLow}
                stroke={ILLO.cabMid}
                strokeWidth={1}
                strokeOpacity={0.75}
                strokeLinejoin="round"
              />
            </g>
          );
        })()}

      {/* body */}
      <rect x={l} y={bodyTop} width={w} height={base - bodyTop} rx={1.5} fill={`url(#${id}-unit)`} />
      <rect x={l} y={bodyTop} width={w} height={base - bodyTop} rx={1.5} fill="none" stroke={ILLO.cabTop} strokeWidth={1.4} strokeOpacity={0.85} strokeLinejoin="round" />

      {/* flat cap, overhanging a little as it does on the real cabinet */}
      <rect x={l - 2.4} y={top} width={w + 4.8} height={capH} rx={1.2} fill={ILLO.cabMid} stroke={ILLO.cabTop} strokeWidth={1.2} strokeOpacity={0.9} strokeLinejoin="round" />

      {/* Brand band, where the wordmark is printed on the real cabinet. Split
          grey/orange like the logo: a solid orange slab sat above the two
          status bars and read as a third, brighter status light. */}
      <rect x={x - w * 0.31} y={bodyTop + 4} width={w * 0.26} height={3.4} rx={1.2} fill={ILLO.cabTop} />
      <rect x={x - w * 0.02} y={bodyTop + 4} width={w * 0.33} height={3.4} rx={1.2} fill={ILLO.live} />

      {/* Twin status bars. Green when the bay is free, orange only while
          power is actually moving — which is both what the real cabinet does
          and the only way a free bay and a busy one can be told apart. They
          used to be orange-or-dim, so the two looked the same. */}
      {[-1, 1].map((sgn) => (
        <rect
          key={sgn}
          x={x + sgn * w * 0.055 - (sgn < 0 ? w * 0.2 : 0)}
          y={bodyTop + 11}
          width={w * 0.2}
          height={2.2}
          rx={1.1}
          fill={inUse ? ILLO.live : lit ? ILLO.ok : ILLO.idle}
        />
      ))}

      {/* portrait touchscreen */}
      <rect x={x - w * 0.31} y={bodyTop + 17} width={w * 0.62} height={h * 0.36} rx={2} fill={ILLO.shadow} />
      <rect x={x - w * 0.31 + 0.8} y={bodyTop + 17.8} width={w * 0.62 - 1.6} height={h * 0.36 - 1.6} rx={1.6} fill={`url(#${id}-screen)`} />
      {/* the faintest suggestion of a running interface — without it the
          screen reads as a hole cut in the cabinet */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={x - w * 0.22}
          y={bodyTop + 22 + i * 4}
          width={w * (i === 0 ? 0.44 : i === 1 ? 0.3 : 0.36)}
          height={1.5}
          rx={0.75}
          fill={ILLO.seam}
          opacity={i === 0 ? 0.5 : 0.3}
        />
      ))}

      {/* card reader, flanked by the two holsters */}
      <rect x={x - w * 0.075} y={holsterY - 1} width={w * 0.15} height={6.5} rx={1.4} fill={ILLO.pane} stroke={ILLO.cabTop} strokeWidth={0.7} strokeOpacity={0.6} />
      <Holster x={x - hx} y={holsterY} seated />
      <Holster x={x + hx} y={holsterY} seated={!inUse} />

      {/* The cabinet has TWO connectors and therefore two cables — this drew
          one, on the right, so the left connector sat in its holster attached
          to nothing and an in-use unit showed no cable at all. Each cable
          drapes down the OUTSIDE of its own side and reaches back into its
          holster, which is how they hang in fontana-station.webp; routed
          across the face they cut straight over the screen.

          The right one is drawn here only when the bay is free. When it is in
          use that same cable runs out to the car, and the motif draws it. */}
      <Cable
        d={`M${hornL.x},${hornL.y} C${l - 3},${hornL.y + 5} ${l - 4},${holsterY - 26} ${l - 4},${holsterY - 12} C${l - 4},${holsterY - 2} ${x - hx - 4},${holsterY + 3} ${x - hx},${holsterY + 3.5}`}
      />
      {!inUse && (
        <Cable
          d={`M${horn.x},${horn.y} C${r + 3},${horn.y + 5} ${r + 4},${holsterY - 26} ${r + 4},${holsterY - 12} C${r + 4},${holsterY - 2} ${x + hx + 4},${holsterY + 3} ${x + hx},${holsterY + 3.5}`}
        />
      )}

      {/* plinth */}
      <path d={`M${l - 3},${base} H${r + 3} a2,2 0 0 1 0,6 H${l - 3} a2,2 0 0 1 0,-6 Z`} fill={ILLO.cabLow} stroke={ILLO.cabTop} strokeWidth={0.8} strokeOpacity={0.45} />
    </g>
  );
}

/* ── The car ──────────────────────────────────────────────────────── */

/** Tyre radius. Wheel centres sit at y = -R so the tyre is TANGENT to the
 *  road; they used to sit at y = 0, which buried exactly half of every wheel
 *  in the tarmac and hid the arches entirely. Eight rounds of reshaping could
 *  not fix that, because the shape was never the fault. */
const CAR_R = 5.06;
const CAR_ARCH = 6.16;
const CAR_WX = 19.57;
const CAR_SILL = -4.2;
/** where each arch meets the sill, solved rather than typed */
const CAR_AX = Math.sqrt(CAR_ARCH ** 2 - (CAR_SILL + CAR_R) ** 2);

/**
 * Uniform Catmull-Rom through the landmarks, converted to cubic Beziers.
 *
 * The point of doing it this way: Catmull-Rom is C1 by construction, so every
 * joint is tangent-continuous with no hand-tuning. Curve quality stops being
 * a matter of where I happened to drop a control point and becomes a property
 * the harness can measure — it comes out at 0.000 degrees of discontinuity.
 */
function spline(pts: readonly (readonly [number, number])[]) {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  const n = (v: number) => Number(v.toFixed(2));
  let d = `M${n(pts[0][0])},${n(pts[0][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    d += ` C${n(x1 + (x2 - x0) / 6)},${n(y1 + (y2 - y0) / 6)} ${n(x2 - (x3 - x1) / 6)},${n(y2 - (y3 - y1) / 6)} ${n(x2)},${n(y2)}`;
  }
  return d;
}

/** Upper profiles, front to rear. Taycan: short front overhang, a long low
 *  bonnet clearing the front arch, the cab set back, the roof peaking over
 *  the front seats and falling in one line into a ducktail. */
const CAR_PROFILE = {
  taycan: [
    [-33.5, -3.2], [-33.1, -6.4], [-31.6, -9], [-28, -10.8], [-23, -12.2],
    [-17, -13.2], [-12.4, -14], [-6.6, -17], [-1, -18.5], [4.5, -18.64],
    [10.5, -18], [17, -15.8], [23.5, -12.6], [29.5, -8.6], [33.1, -5.6], [33.5, -3.2],
  ],
  sedan: [
    [-33.5, -3.2], [-33.1, -6.6], [-31.4, -9.4], [-27.6, -11.4], [-22, -13],
    [-16, -14], [-11.6, -14.8], [-6, -18.4], [-0.5, -20.2], [5, -20.4],
    [11, -19.8], [17.4, -17], [23.8, -13], [29.6, -8.8], [33.1, -5.8], [33.5, -3.2],
  ],
  suv: [
    [-33.5, -3.4], [-33.1, -7], [-31.2, -10.2], [-27.2, -12.6], [-21.6, -14.4],
    [-15.4, -15.4], [-11, -16.4], [-5.6, -21.4], [0, -23.4], [6, -23.6],
    [12.4, -23], [18.6, -20.6], [24.6, -15.6], [30, -9.6], [33.1, -6], [33.5, -3.4],
  ],
} as const;

/**
 * A car in profile, drawn on the road rather than in it.
 *
 * Geometry from the real Taycan: 4963 x 1381 mm is 3.59 length-to-height,
 * wheelbase 0.584 of length, wheel diameter 0.151. The harness asserts all
 * three against the published figures, plus the things that actually went
 * wrong here — that nothing sits below the road, that the tyres touch it, and
 * that every joint in the outline is tangent-continuous.
 */
function CarSide({
  id,
  x,
  y = FLOOR,
  s = 1,
  flip = false,
  port,
  far = false,
  shape = "taycan",
  paint = "paint",
}: {
  id: string;
  x: number;
  y?: number;
  s?: number;
  flip?: boolean;
  port?: "front" | "rear";
  far?: boolean;
  shape?: "taycan" | "sedan" | "suv";
  /** Body colour. A forecourt of identical cars reads as a repeat. */
  paint?: "paint" | "silver" | "graphite";
}) {
  const prof = CAR_PROFILE[shape];
  const body =
    spline(prof) +
    ` L${(CAR_WX + CAR_AX).toFixed(2)},${CAR_SILL}` +
    ` A${CAR_ARCH},${CAR_ARCH} 0 0 0 ${(CAR_WX - CAR_AX).toFixed(2)},${CAR_SILL}` +
    ` L${(-CAR_WX + CAR_AX).toFixed(2)},${CAR_SILL}` +
    ` A${CAR_ARCH},${CAR_ARCH} 0 0 0 ${(-CAR_WX - CAR_AX).toFixed(2)},${CAR_SILL} Z`;
  /* the glasshouse follows the roof landmarks instead of floating under it */
  const roof = prof.slice(7, 12);
  const belt = shape === "suv" ? -11.4 : shape === "sedan" ? -10.4 : -9.6;
  const glass =
    `M${roof[0][0] + 2},${belt} ` +
    roof.map(([gx, gy]) => `L${gx},${gy + 1.4}`).join(" ") +
    ` L${roof[roof.length - 1][0] - 2},${belt} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={0} rx={34} ry={3} fill={`url(#${id}-contact)`} />
      {[-CAR_WX, CAR_WX].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-CAR_R} r={CAR_R} fill={ILLO.tyre} />
          <circle cx={wx} cy={-CAR_R} r={CAR_R * 0.52} fill={ILLO.hub} fillOpacity={0.28} />
          <circle cx={wx} cy={-CAR_R} r={CAR_R * 0.52} fill="none" stroke={ILLO.hub} strokeWidth={0.5} strokeOpacity={0.5} />
        </g>
      ))}
      <path d={body} fill={`url(#${id}-${paint})`} opacity={far ? 0.7 : 1} />
      <path d={glass} fill={ILLO.pane} />
      <path d={spline(prof).replace(/^M/, "M")} fill="none" stroke={ILLO.hub} strokeWidth={0.9} strokeOpacity={0.4} strokeLinecap="round" />
      {port && (
        <g transform={`translate(${port === "front" ? -10.5 : 10.5} -7.4)`}>
          <rect x={-2.1} y={-2.1} width={4.2} height={4.2} rx={1.1} fill={ILLO.stage} fillOpacity={0.65} />
          {/* orange only because power is moving through it */}
          <circle cx={0} cy={0} r={1.1} fill={ILLO.live} />
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
    label: "A HubCharge unit with a car connected to it.",
    ground: "bay",
    pools: [72],
    draw: (id) => (
      <>
        <Unit id={id} x={72} lit inUse depth="right" />
        <CarSide id={id} x={190} s={1.15} port="front" />
        {/* over the horn and down to the port — the route it takes on the
            real machine, and the reason the arc starts so high */}
        <Cable d="M81.9,70.5 C106,74 120,120 150,136 C160,141 170,142 177.9,143.5" live />
      </>
    ),
  },

  /* what a visit is, as three beats */
  arrival: {
    label: "A car connected to a unit, above the three named steps of a stop.",
    pools: [222],
    draw: (id) => (
      <>
        <Unit id={id} x={222} lit inUse />
        <CarSide id={id} x={112} s={1.05} port="rear" />
        <Cable d="M212.1,70.5 C190,74 176,120 147,136 C139,141 131,143 123,144.2" live />
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
        <Cable d="M114,120 C128,130 134,142 142,152" />
        <Cable d="M223,96 C236,108 240,120 246,132" />
        <Plug x={96} y={84} r={30} kind="ccs1" lit />
        <Plug x={208} y={84} r={21} kind="nacs" lit />
        <Label x={96} y={146} text="CCS1" />
        <Label x={208} y={122} text="NACS" />
        <Label x={150} y={176} text="BOTH FITTED" size={8.5} tone={ILLO.ok} />
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
        <CarSide id={id} x={202} y={128} s={1.5} port="front" />
        {/* ring the port, because it is the thing the arrow points at */}
        <circle cx={186} cy={117} r={15} fill="none" stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.75} strokeDasharray="3 3" />
        <Tick x={150} y={170} r={12} />
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
          <Cable d="M143,126 C143,135 151,137 150,144" />
        </g>
        <Unit id={id} x={224} w={32} h={80} lit />
        <Label x={71} y={168} text="L1" />
        <Label x={143} y={168} text="L2" />
        <Label x={224} y={168} text="DC" tone={ILLO.live} />
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
        <path d={CURVE} fill="none" stroke={ILLO.live} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
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
            <g key={t} transform={`translate(20 ${52 + i * 22})`}>
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
        <Unit id={id} x={266} w={28} h={62} lit />
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
            <rect key={i} x={186 + i * 18} y={102} width={14} height={28} rx={2} fill={ILLO.live} opacity={0.92} />
          ))}
          <Label x={213} y={150} text="FLAT" tone={ILLO.live} size={8} />
        </g>
        <Tick x={213} y={78} r={13} />
      </>
    ),
  },

  /* a range of cars */
  fleet: {
    label: "Three different kinds of car — a sedan, a crossover and a pickup — side by side.",
    ground: "bay",
    draw: (id) => (
      <>
        {/* was the same car three times at three scales, which says "one car,
            three sizes". Three body types says what the guide says. */}
        <CarSide id={id} x={66} y={FLOOR - 20} s={0.62} shape="sedan" paint="silver" far />
        <Label x={66} y={FLOOR - 4} text="NACS" size={7.5} tone={ILLO.seam} />
        <CarSide id={id} x={238} y={FLOOR - 20} s={0.62} shape="suv" paint="graphite" flip far />
        <Label x={238} y={FLOOR - 4} text="CCS1" size={7.5} tone={ILLO.seam} />
        <CarSide id={id} x={150} s={1.05} shape="taycan" />
        {/* the guide is "what your car plugs into" — so say what each plugs into */}
        <Label x={150} y={178} text="CCS1" size={9} tone={ILLO.live} />
      </>
    ),
  },

  /* one bay busy, one free */
  bays: {
    label: "Two charging bays: one occupied, and one marked free with its cable holstered.",
    teaches: "Move when you're done",
    ground: "bay",
    pools: [66, 238],
    draw: (id) => (
      <>
        <Unit id={id} x={66} lit inUse />
        <CarSide id={id} x={140} s={0.86} port="front" />
        <Cable d="M75.9,70.5 C98,74 106,124 122,139 C125,143 128,145 131,145.6" live />
        {/* the free bay: its connector is holstered and its cable stowed, both
            drawn by Unit itself, so there is nothing to draw here */}
        <Unit id={id} x={244} />
        {/* say which one you can take, rather than leaving the reader to
            notice that one cable is stowed */}
        <Label x={244} y={182} text="FREE" tone={ILLO.ok} size={8} />
        {/* the guide's first rule */}
        <Label x={110} y={182} text="MOVE WHEN DONE" tone={ILLO.hub} size={8} />
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
        <Cell x={84} y={104} w={92} h={46} from={0} to={TEMPERATURE_FACTORS.cold.factor} tone={ILLO.cold} />
        <Cell x={216} y={104} w={92} h={46} from={0} to={TEMPERATURE_FACTORS.hot.factor} tone={ILLO.heat} />
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
        <g transform="translate(150 170)">
          <rect x={-58} y={-13} width={116} height={26} rx={6} fill={ILLO.recess} stroke={ILLO.ok} strokeWidth={1.3} strokeOpacity={0.7} />
          <path d="M-42,-5 L-38,0 L-33,-8" fill="none" stroke={ILLO.ok} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <Label x={8} y={4} text="PRECONDITION" size={8.5} tone={ILLO.ok} />
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
        <Cell x={150} y={100} w={150} h={60} from={0.2} to={0.8} />
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
        <Cable d="M127,126 C127,136 134,140 142,142" />
        <path d="M150,52 V150" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.45} />
        <Unit id={id} x={214} lit />
        <CarSide id={id} x={262} s={0.6} paint="silver" far />
        <Label x={78} y={178} text="HOME" />
        <Label x={222} y={178} text="PUBLIC" tone={ILLO.live} />
      </>
    ),
  },

  /* no driveway */
  street: {
    label:
      "Apartment blocks with cars parked nose-to-tail at the kerb and no charger anywhere on the street.",
    teaches: "What it actually takes each week",
    ground: "road",
    draw: (id) => (
      <>
        {/* Three blank rectangles with two squares each, which is what reusing
            Roof with pitch=0 produced. These are buildings: window grids,
            balconies, setbacks, an entrance. The guide is about having
            nowhere at home to plug in, so the kerb is the subject. */}
        {[
          { x: 24, w: 74, h: 104, cols: 3, rows: 4 },
          { x: 110, w: 82, h: 128, cols: 3, rows: 5 },
          { x: 204, w: 70, h: 88, cols: 3, rows: 3 },
        ].map(({ x, w, h, cols, rows }) => (
          <g key={x}>
            <rect x={x} y={FLOOR - h} width={w} height={h} rx={1.5} fill={ILLO.bodyDark} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.5} />
            {/* parapet */}
            <rect x={x - 2} y={FLOOR - h - 3} width={w + 4} height={3.4} rx={1} fill={ILLO.body} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.45} />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const ww = (w - 14) / cols - 5;
                const wx = x + 7 + c * ((w - 14) / cols) + 2.5;
                const wy = FLOOR - h + 10 + r * ((h - 20) / rows);
                /* a few windows lit, so the block reads as lived in */
                const on = (r * cols + c + x) % 5 === 0;
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={wx} y={wy} width={ww} height={9} rx={0.8} fill={on ? ILLO.heat : ILLO.recess} opacity={on ? 0.55 : 1} />
                    {/* balcony rail under every second row */}
                    {r % 2 === 1 && (
                      <rect x={wx - 1.4} y={wy + 10.4} width={ww + 2.8} height={1.2} rx={0.6} fill={ILLO.seam} opacity={0.5} />
                    )}
                  </g>
                );
              })
            )}
            {/* entrance */}
            <rect x={x + w / 2 - 5} y={FLOOR - 13} width={10} height={13} rx={1} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={0.7} strokeOpacity={0.5} />
          </g>
        ))}
        {/* street lamp */}
        <g>
          <path d="M288,152 V96 q0,-6 -7,-6 h-9" fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeOpacity={0.6} strokeLinecap="round" />
          <ellipse cx={270} cy={91} rx={5} ry={2.4} fill={ILLO.heat} opacity={0.5} />
        </g>
        {/* the kerb: cars nose-to-tail, nowhere to plug in */}
        <path d={`M0,${FLOOR + 4} H300`} stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.5} />
        <CarSide id={id} x={56} y={FLOOR + 20} s={0.56} shape="sedan" paint="silver" far />
        <CarSide id={id} x={150} y={FLOOR + 20} s={0.56} paint="graphite" far />
        <CarSide id={id} x={244} y={FLOOR + 20} s={0.56} shape="suv" far />
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
            <g key={t} transform={`translate(40 ${58 + i * 20})`}>
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
          <Cable d="M0,30 C0,42 16,44 26,48" live />
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
        <Unit id={id} x={78} />
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
        <g opacity={0.5}>
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
      "A driver's shift as a loop, with two charging stops on it and the hours and takings marked.",
    teaches: "Charging time is unpaid time",
    ground: "road",
    draw: (id) => (
      <>
        <ellipse cx={150} cy={100} rx={104} ry={44} fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.45} />
        {/* the two stops sit ON the loop, where the ellipse actually passes */}
        <Pin x={46} y={92} r={8} lit />
        <Pin x={254} y={92} r={8} lit />
        <g>
          <CarSide id={id} x={150} y={74} s={0.72} />
          {/* roof sign — what makes this a working shift and not a commute */}
          <rect x={143} y={56} width={15} height={5.6} rx={2} fill={ILLO.live} opacity={0.95} />
        </g>
        {/* hours and takings, set into the composition rather than floating */}
        <g transform="translate(150 118)">
          <rect x={-62} y={0} width={124} height={26} rx={5} fill={ILLO.recess} stroke={ILLO.seam} strokeWidth={1} strokeOpacity={0.45} />
          <g transform="translate(-42 13)">
            <circle cx={0} cy={0} r={8} fill="none" stroke={ILLO.hub} strokeWidth={1.3} strokeOpacity={0.85} />
            <path d="M0,0 L0,-4.6 M0,0 L3.4,2" fill="none" stroke={ILLO.hub} strokeWidth={1.3} strokeLinecap="round" />
          </g>
          <Label x={-22} y={17} text="UNPAID" size={7.5} anchor="start" tone={ILLO.fault} />
          <Label x={40} y={19} text="$" tone={ILLO.live} size={20} />
        </g>
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
        <Label x={62} y={176} text="ARRIVE LOW" size={8.5} tone={ILLO.live} />
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
        <path d="M16,124 C70,122 150,118 288,112" fill="none" stroke={ILLO.live} strokeWidth={2.8} strokeOpacity={0.85} strokeLinecap="round" />
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
            <path d={`M156,${y + 3.5} h22`} stroke={ILLO.live} strokeWidth={1.6} strokeOpacity={0.85} strokeLinecap="round" />
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
