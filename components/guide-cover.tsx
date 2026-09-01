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
        fill={ILLO.unitLow}
        stroke={ILLO.hub}
        strokeWidth={0.7}
        strokeOpacity={0.55}
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
}: {
  id: string;
  x: number;
  w?: number;
  h?: number;
  lit?: boolean;
  /** Leaves the right holster empty — its connector is in a car. */
  inUse?: boolean;
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
          fill={ILLO.unitMid}
          stroke={ILLO.hub}
          strokeWidth={1}
          strokeOpacity={0.8}
          strokeLinejoin="round"
        />
      ))}

      {/* body */}
      <rect x={l} y={bodyTop} width={w} height={base - bodyTop} rx={1.5} fill={`url(#${id}-unit)`} />
      <rect x={l} y={bodyTop} width={w} height={base - bodyTop} rx={1.5} fill="none" stroke={ILLO.hub} strokeWidth={1.6} strokeOpacity={0.95} strokeLinejoin="round" />

      {/* flat cap, overhanging a little as it does on the real cabinet */}
      <rect x={l - 2.4} y={top} width={w + 4.8} height={capH} rx={1.2} fill={ILLO.unitTop} stroke={ILLO.hub} strokeWidth={1.3} strokeOpacity={0.9} strokeLinejoin="round" />

      {/* Brand band, where the wordmark is printed on the real cabinet. Split
          grey/orange like the logo: a solid orange slab sat above the two
          status bars and read as a third, brighter status light. */}
      <rect x={x - w * 0.31} y={bodyTop + 4} width={w * 0.26} height={3.4} rx={1.2} fill={ILLO.hub} />
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
      <rect x={x - w * 0.075} y={holsterY - 1} width={w * 0.15} height={6.5} rx={1.4} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={0.7} strokeOpacity={0.5} />
      <Holster x={x - hx} y={holsterY} seated />
      <Holster x={x + hx} y={holsterY} seated={!inUse} />

      {/* An idle unit stows its own cable, so every unconnected unit is
          complete without the motif drawing one. It drapes down the OUTSIDE
          of the cabinet and reaches back into the holster, which is how the
          cables hang in fontana-station.webp — routed across the face it cut
          straight over the screen. */}
      {!inUse && (
        <Cable
          d={`M${horn.x},${horn.y} C${r + 3},${horn.y + 5} ${r + 4},${holsterY - 26} ${r + 4},${holsterY - 12} C${r + 4},${holsterY - 2} ${x + hx + 4},${holsterY + 3} ${x + hx},${holsterY + 3.5}`}
        />
      )}

      {/* plinth */}
      <path d={`M${l - 3},${base} H${r + 3} a2,2 0 0 1 0,6 H${l - 3} a2,2 0 0 1 0,-6 Z`} fill={ILLO.unitLow} stroke={ILLO.seam} strokeWidth={0.8} strokeOpacity={0.5} />
    </g>
  );
}

/**
 * A car in profile — a modern EV crossover, drawn as a flat silhouette.
 *
 * The geometry is measured rather than guessed: length 67, overall height
 * 23.2 (2.89 — a Model Y is 2.93, an Ioniq 5 2.89), wheelbase 0.615 of
 * length, wheel diameter 0.453 of height, beltline 0.665 above ground. Those
 * last two matter most: an earlier version had the beltline 2.5 units low,
 * leaving a 23% glass band against a real 33.5%, which is a shallow slot of
 * glass over a deep slab of door — a panel van.
 *
 * The silhouette is faceted rather than smooth, because an Ioniq 5 nearly
 * is: blunt nose, near-flat bonnet, a hard cowl corner into a raked
 * windscreen, a flat roof, a straight-sided trapezoidal glasshouse and an
 * upright tailgate.
 *
 * The TREATMENT is deliberately flat — one solid tone, no outline, no
 * creases, no light bars, glass cut straight out of the body. Four
 * treatments were built and compared side by side at real size and this is
 * the one chosen. Earlier versions failed by adding: a gradient body with a
 * uniform bright outline reads as a clipart sticker, and shut lines, a
 * handle and a mirror are noise at the size this renders. The shape does all
 * the work.
 */
function CarSide({
  id,
  x,
  y = FLOOR,
  s = 1,
  flip = false,
  port,
  far = false,
  shape = "crossover",
}: {
  id: string;
  x: number;
  y?: number;
  s?: number;
  flip?: boolean;
  /** Body type. Crossover keeps the measured geometry; the other two vary
   *  only the roof and tail, so all three share a wheelbase and ride height
   *  and still read as the same family of drawing. */
  shape?: "crossover" | "sedan" | "pickup";
  /** Draw a charge socket on the named flank. Cables must land on one of
   *  these — a cable ending in mid-air is the drawn equivalent of the
   *  floating-cable renders these covers replaced. */
  port?: "front" | "rear";
  /** Sit this one back in the scene. On a dark plate haze LIFTS a distant
   *  object toward the background; darkening it just makes it vanish, which
   *  is what happened when the flanking cars were simply drawn dimmer. */
  far?: boolean;
}) {
  const NOSE =
    "M-33.5,-2 L-33.5,-6.4 C-33.5,-9 -32.4,-9.7 -29.6,-10 " +
    "L-23.2,-10.4 L-21.6,-10.7 L-12.4,-17 " +
    "C-11.6,-17.5 -10.8,-17.6 -9.8,-17.6 ";
  const WHEELS =
    "L27.1,-2 A6.8,6.8 0 0 0 14.1,-2 " +
    "L-14.1,-2 A6.8,6.8 0 0 0 -27.1,-2 Z";
  const ROOF = {
    /* flat roof carried well back, then an upright tailgate */
    crossover:
      "L13,-17.6 C17.6,-17.5 21,-16 24,-13.4 L26.6,-11.4 " +
      "C29.6,-9 32,-6 32.9,-4 C33.4,-3 33.5,-2.4 33.5,-2.2 L33.5,-2 ",
    /* shorter cabin falling into a boot deck */
    sedan:
      "L7,-17.6 C11.4,-17.4 15,-15.6 18.6,-12.4 L26,-10.2 " +
      "C30,-9.4 32.6,-7.4 33.2,-5 C33.5,-3.8 33.5,-2.6 33.5,-2.2 L33.5,-2 ",
    /* cab stops early, then an open bed with a tailgate at the back */
    pickup:
      "L2,-17.6 C4.4,-17.5 5.6,-16.4 5.6,-14.4 L5.6,-11 L30.6,-11 " +
      "C32.4,-11 33.5,-9.8 33.5,-8 L33.5,-2 ",
  } as const;
  const GLASS = {
    crossover: "M-17.6,-9.9 L-11.4,-16.8 L12.4,-16.8 L21.4,-9.9 Z",
    sedan: "M-17.6,-9.9 L-11.4,-16.8 L6.4,-16.8 L15.6,-9.9 Z",
    pickup: "M-17.6,-9.9 L-11.4,-16.8 L1.4,-16.8 L4.4,-9.9 Z",
  } as const;
  const body = NOSE + ROOF[shape] + WHEELS;
  const glass = GLASS[shape];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* Light, not paint. The flat silhouette was the right answer against a
          sticker rendering; it is the wrong one against a dead scene. The
          geometry is untouched — only the shading is new. */}
      <ellipse cx={0} cy={5.6} rx={36} ry={4.6} fill={`url(#${id}-contact)`} />
      <path d={body} fill={`url(#${id}-car)`} opacity={far ? 0.66 : 1} />
      {/* the specular streak where light would actually land */}
      <path
        d="M-29.6,-10 L-23.2,-10.4 L-21.6,-10.7 L-12.4,-17 C-11.6,-17.5 -10.8,-17.6 -9.8,-17.6 L13,-17.6 C17.6,-17.5 21,-16 24,-13.4"
        fill="none"
        stroke={ILLO.hub}
        strokeWidth={1.1}
        strokeOpacity={0.5}
        strokeLinecap="round"
      />
      <path d={glass} fill={`url(#${id}-cargla)`} />
      {/* one reflection across the glass */}
      <path d="M-14.4,-12.6 L-9.6,-16.8 L-2.2,-16.8 L-7,-12.6 Z" fill={ILLO.glassTop} fillOpacity={0.2} />
      {[-20.6, 20.6].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={0} r={5.6} fill={ILLO.tyre} />
          <circle cx={wx} cy={0} r={2.6} fill={ILLO.carMid} />
          <circle cx={wx} cy={0} r={2.6} fill="none" stroke={ILLO.hub} strokeWidth={0.6} strokeOpacity={0.45} />
        </g>
      ))}
      {port && (
        <g transform={`translate(${port === "front" ? -10.5 : 10.5} -7)`}>
          <rect x={-2.1} y={-2.1} width={4.2} height={4.2} rx={1.1} fill={ILLO.stage} fillOpacity={0.6} />
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
      <linearGradient id={`${id}-unit`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={ILLO.bodyLight} />
        <stop offset="45%" stopColor={ILLO.unitTop} />
        <stop offset="100%" stopColor={ILLO.unitMid} />
      </linearGradient>
      <linearGradient id={`${id}-floor`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.shadow} stopOpacity={0.1} />
        <stop offset="100%" stopColor={ILLO.shadow} stopOpacity={0.5} />
      </linearGradient>
      {/* Every stop measured against the plate. A carTop->carMid->carLow ramp
          bottomed out at 1.17:1 and the car dissolved into the background;
          this holds 2.73 / 2.31 / 1.69, so light still falls across the body
          but no part of it disappears. */}
      <linearGradient id={`${id}-car`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={ILLO.seam} />
        <stop offset="52%" stopColor={ILLO.carTop} />
        <stop offset="100%" stopColor={ILLO.carMid} />
      </linearGradient>
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
        <Unit id={id} x={72} lit inUse />
        <CarSide id={id} x={190} s={1.15} port="front" />
        {/* over the horn and down to the port — the route it takes on the
            real machine, and the reason the arc starts so high */}
        <Cable d="M81.9,70.5 C106,74 120,120 150,136 C160,141 170,143 177.9,143.9" live />
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
        <Cable d="M212.1,70.5 C190,74 176,120 147,136 C139,141 131,143 123,144.7" live />
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
        <Tick x={150} y={172} r={12} />
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
      "The delivered charging curve: flat at the station's output while the battery is low, then tapering as it fills.",
    draw: () => (
      <>
        <path d="M44,44 V136 H266" fill="none" stroke={ILLO.seam} strokeWidth={1.2} strokeOpacity={0.55} strokeLinecap="round" />
        <path
          d={`${CURVE} L${CURVE_PLOT.X1},136 L${CURVE_PLOT.X0},136 Z`}
          fill={ILLO.live}
          opacity={0.09}
        />
        <path d={CURVE} fill="none" stroke={ILLO.live} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <Label x={CURVE_PLOT.X0 + 6} y={154} text="EMPTY" size={8} anchor="start" />
        <Label x={CURVE_PLOT.X1} y={154} text="FULL" size={8} anchor="end" />
        {/* the two things the shape is there to say */}
        <Label x={92} y={48} text="FULL SPEED" tone={ILLO.live} size={9} />
        <Label x={232} y={96} text="TAPERS" tone={ILLO.seam} size={9} />
      </>
    ),
  },

  /* time, priced */
  clock: {
    label: "A ten-minute segment lit on a clock face, marked with a currency symbol.",
    ground: "bay",
    pools: [236],
    draw: (id) => (
      <>
        <Unit id={id} x={236} lit />
        <circle cx={108} cy={94} r={40} fill={ILLO.recess} stroke={ILLO.hub} strokeWidth={1.4} strokeOpacity={0.85} />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={108}
            y1={58}
            x2={108}
            y2={62.5}
            stroke={ILLO.hub}
            strokeWidth={1.1}
            strokeOpacity={i % 3 === 0 ? 0.85 : 0.45}
            transform={`rotate(${i * 30} 108 94)`}
          />
        ))}
        {/* Ten minutes is 60 degrees of a clock face. The arc used to span
            40.8, which is 6.8 minutes — a drawing on the cost page quietly
            stating the wrong length of stop. */}
        <path
          d="M108,60 A34,34 0 0 1 137.4,77.0"
          fill="none"
          stroke={ILLO.live}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle cx={108} cy={94} r={3} fill={ILLO.hub} />
        {/* the hand agrees with the end of the arc */}
        <path d="M108,94 L133.1,79.5" stroke={ILLO.hub} strokeWidth={1.6} strokeLinecap="round" />
        {/* This cover heads the COST guide and used to draw only a clock,
            which says time, not money. The symbol is a category marker: the
            rate itself appears nowhere but the product screenshot. */}
        <Label x={108} y={104} text="$" tone={ILLO.live} size={26} />
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
        <CarSide id={id} x={66} y={FLOOR - 20} s={0.62} shape="sedan" far />
        <CarSide id={id} x={238} y={FLOOR - 20} s={0.62} shape="pickup" flip far />
        <CarSide id={id} x={150} s={1.05} shape="crossover" />
      </>
    ),
  },

  /* one bay busy, one free */
  bays: {
    label: "Two charging bays: one occupied, and one marked free with its cable holstered.",
    ground: "bay",
    pools: [66, 244],
    draw: (id) => (
      <>
        <Unit id={id} x={66} lit inUse />
        <CarSide id={id} x={140} s={0.86} port="front" />
        <Cable d="M75.9,70.5 C98,74 106,124 122,139 C125,143 128,145 131,146" live />
        {/* the free bay: its connector is holstered and its cable stowed, both
            drawn by Unit itself, so there is nothing to draw here */}
        <Unit id={id} x={244} />
        {/* say which one you can take, rather than leaving the reader to
            notice that one cable is stowed */}
        <Label x={244} y={182} text="FREE" tone={ILLO.ok} size={8} />
      </>
    ),
  },

  /* cold on one side, heat on the other */
  climate: {
    label:
      "Two batteries, one cold and one hot, filled to the share of normal charging speed each temperature actually allows.",
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
        <Label x={84} y={152} text="COLD" tone={ILLO.cold} />
        <Label x={216} y={152} text="HOT" tone={ILLO.heat} />
      </>
    ),
  },

  /* the band that matters */
  band: {
    label: "A battery with the middle band lit and the twenty and eighty percent marks named.",
    draw: () => (
      <>
        <Cell x={150} y={100} w={150} h={60} from={0.2} to={0.8} />
        {/* the window the guide recommends, marked at both ends rather than
            left for the reader to infer from a highlighted rectangle */}
        {/* x=105 and x=195 are where the 0.2 and 0.8 fill edges actually fall for
            a 150-wide cell centred on 150 — derived, not eyeballed */}
        {[{ x: 105, t: "20" }, { x: 195, t: "80" }].map(({ x, t }) => (
          <g key={t}>
            <path d={`M${x},134 V142`} stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.8} />
            <Label x={x} y={158} text={t} tone={ILLO.live} size={9} />
          </g>
        ))}
        <path d="M105,142 H195" stroke={ILLO.live} strokeWidth={1.4} strokeOpacity={0.5} />
      </>
    ),
  },

  /* home and away */
  homeAway: {
    label: "A house with a wall charger on one side and a HubCharge unit on the other, both named.",
    ground: "bay",
    pools: [214],
    draw: (id) => (
      <>
        <Roof x={78} w={80} h={54} pitch={16} />
        <rect x={122} y={112} width={9} height={14} rx={2} fill={ILLO.unitMid} stroke={ILLO.edge} strokeWidth={0.7} strokeOpacity={0.5} />
        <Cable d="M127,126 C127,136 134,140 142,142" />
        <path d="M150,52 V150" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.45} />
        <Unit id={id} x={214} lit />
        <CarSide id={id} x={262} s={0.6} far />
        <Label x={78} y={178} text="HOME" />
        <Label x={222} y={178} text="PUBLIC" tone={ILLO.live} />
      </>
    ),
  },

  /* no driveway */
  street: {
    label: "A row of apartment buildings with cars parked along the kerb.",
    ground: "road",
    draw: (id) => (
      <>
        <Roof x={62} w={62} h={78} pitch={0} />
        <Roof x={132} w={58} h={94} pitch={0} />
        <Roof x={202} w={54} h={66} pitch={0} />
        <CarSide id={id} x={92} y={FLOOR + 14} s={0.62} far />
        <CarSide id={id} x={186} y={FLOOR + 14} s={0.62} flip far />
        <path d="M0,168 H300" stroke={ILLO.seam} strokeWidth={1} opacity={0.4} />
        <path d="M20,178 h24 M64,178 h24 M108,178 h24 M152,178 h24 M196,178 h24 M240,178 h24" stroke={ILLO.idle} strokeWidth={1.6} opacity={0.5} />
      </>
    ),
  },

  /* something went wrong */
  fault: {
    label: "A broken connection beside the same connection working again after a retry.",
    draw: () => (
      <>
        {/* used to show only the fault. A troubleshooting guide should show
            the fault AND the thing you get back, or it is just bad news. */}
        <g>
          <Plug x={70} y={92} r={20} kind="nacs" />
          <Cable d="M90,92 C100,92 104,96 110,98" />
          <g stroke={ILLO.fault} strokeWidth={2.6} strokeLinecap="round">
            <line x1={122} y1={82} x2={140} y2={104} />
            <line x1={140} y1={82} x2={122} y2={104} />
          </g>
          <Label x={106} y={132} text="STUCK" tone={ILLO.fault} size={8} />
        </g>
        <path d="M150,50 V140" stroke={ILLO.seam} strokeWidth={0.9} strokeDasharray="4 5" opacity={0.4} />
        <g>
          <Plug x={200} y={92} r={20} kind="nacs" lit />
          <Cable d="M220,92 C232,92 240,94 250,96" live />
          <Tick x={264} y={98} r={12} />
          <Label x={222} y={132} text="RETRY" tone={ILLO.ok} size={8} />
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
            d="M158,140 H214 a8,8 0 0 1 8,8 V166 a8,8 0 0 1 -8,8 H176 l-10,10 v-10 H158 a8,8 0 0 1 -8,-8 V148 a8,8 0 0 1 8,-8 Z"
            fill={ILLO.recess}
            stroke={ILLO.edge}
            strokeWidth={1.1}
            strokeOpacity={0.7}
            strokeLinejoin="round"
          />
          <Label x={186} y={165} text="?" tone={ILLO.hub} size={22} />
        </g>
      </>
    ),
  },

  /* a working day */
  shift: {
    label: "A car with a roof sign between a clock and a currency symbol, on a short repeating loop.",
    ground: "road",
    draw: (id) => (
      <>
        <ellipse cx={150} cy={104} rx={96} ry={40} fill="none" stroke={ILLO.seam} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.5} />
        <Pip x={54} y={104} lit />
        <Pip x={246} y={104} lit />
        <g>
          <CarSide id={id} x={150} y={86} s={0.68} />
          {/* roof sign — what makes this a working shift and not a commute */}
          <rect x={143} y={65} width={15} height={6} rx={2} fill={ILLO.live} opacity={0.95} />
        </g>
        <g transform="translate(72 148)">
          <circle cx={0} cy={0} r={11} fill="none" stroke={ILLO.hub} strokeWidth={1.4} strokeOpacity={0.8} />
          <path d="M0,0 L0,-6 M0,0 L4.4,2.6" fill="none" stroke={ILLO.hub} strokeWidth={1.4} strokeLinecap="round" />
        </g>
        <Label x={228} y={155} text="$" tone={ILLO.live} size={24} />
      </>
    ),
  },

  /* the long way */
  highway: {
    label: "A road running to the horizon with three charging stops pinned along it.",
    draw: () => (
      <>
        {/* The road now runs off the bottom of the frame rather than stopping
            at the horizon line, which both fills the lower band and puts the
            viewer on the road instead of beside it. */}
        <path d="M76,200 L138,58 H162 L224,200 Z" fill={ILLO.bodyDark} />
        <path d="M76,200 L138,58 H162 L224,200 Z" fill="none" stroke={ILLO.seam} strokeWidth={0.9} strokeOpacity={0.45} strokeLinejoin="round" />
        {/* centre line, shortening and narrowing with distance */}
        {[
          [72, 1.4, 5],
          [92, 1.8, 7],
          [120, 2.4, 10],
          [156, 3.2, 14],
        ].map(([y, w, h]) => (
          <rect key={y} x={150 - w / 2} y={y} width={w} height={h} rx={w / 2} fill={ILLO.idle} opacity={0.75} />
        ))}
        {/* A rear-view car at this scale defeated two attempts and read as a
            bell on a post both times. Pins say "stops along the way" without
            asking a 20-pixel shape to be recognisable as a vehicle. */}
        <Pin x={120} y={72} r={5} />
        <Pin x={198} y={104} r={7} />
        <Pin x={70} y={150} r={10} lit />
      </>
    ),
  },

  /* two corridors */
  corridors: {
    label: "Two charging locations pinned on a route running across the region.",
    ground: "road",
    draw: () => (
      <>
        {/* was two parallel lines and six dots, which is not a map of
            anything. Pins say "places you can drive to". */}
        <path
          d="M18,124 C64,124 78,74 130,74 C186,74 200,116 282,102"
          fill="none"
          stroke={ILLO.seam}
          strokeWidth={2.2}
          strokeOpacity={0.55}
          strokeLinecap="round"
        />
        <path
          d="M18,124 C64,124 78,74 130,74"
          fill="none"
          stroke={ILLO.live}
          strokeWidth={2.4}
          strokeOpacity={0.85}
          strokeLinecap="round"
        />
        <Pin x={130} y={62} r={10} lit />
        <Pin x={18} y={112} r={8} />
        <Pin x={264} y={92} r={8} />
      </>
    ),
  },

  /* first month */
  milestones: {
    label: "Three numbered steps rising along a path, the last one reached.",
    draw: () => (
      <>
        <path
          d="M52,126 C96,126 98,98 142,98 C186,98 190,70 248,70"
          fill="none"
          stroke={ILLO.seam}
          strokeWidth={1.8}
          opacity={0.55}
          strokeLinecap="round"
        />
        {/* was three unlabelled dots on a line, which could have been
            anything. Numbering them says "first, then, then". */}
        {[
          { x: 52, y: 126, n: "1", lit: false },
          { x: 142, y: 98, n: "2", lit: false },
          { x: 248, y: 70, n: "3", lit: true },
        ].map(({ x, y, n, lit }) => (
          <g key={n}>
            <circle
              cx={x}
              cy={y}
              r={13}
              fill={lit ? ILLO.live : ILLO.recess}
              fillOpacity={lit ? 0.2 : 1}
              stroke={lit ? ILLO.live : ILLO.seam}
              strokeWidth={1.6}
            />
            <Label x={x} y={y + 4} text={n} tone={lit ? ILLO.live : ILLO.hub} size={11} />
          </g>
        ))}
      </>
    ),
  },

  /* paperwork */
  paperwork: {
    label: "A rebate form with one line approved, stamped with a tick and a currency symbol.",
    draw: () => (
      <>
        <g>
          <rect x={64} y={48} width={128} height={116} rx={7} fill={ILLO.recess} stroke={ILLO.edge} strokeWidth={1.3} strokeOpacity={0.85} />
          <rect x={80} y={66} width={80} height={9} rx={4} fill={ILLO.live} opacity={0.9} />
          {[88, 104, 120].map((y) => (
            <rect key={y} x={80} y={y} width={70} height={6} rx={3} fill={ILLO.idle} opacity={0.7} />
          ))}
          <rect x={80} y={136} width={44} height={6} rx={3} fill={ILLO.idle} opacity={0.5} />
        </g>
        {/* money back, not just a form to fill in */}
        <Label x={228} y={92} text="$" tone={ILLO.live} size={44} />
        <Tick x={228} y={130} r={15} />
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
