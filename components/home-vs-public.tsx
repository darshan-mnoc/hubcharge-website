"use client";

import { GuideFigure } from "@/components/guide-figure";
import { House, MapPin } from "lucide-react";

/* ── The day, drawn to scale ──────────────────────────────────────────
 *
 * Six rows of prose below can tell you home charging happens overnight and
 * public charging happens in a gap. What they cannot do is show you the
 * SIZES, and the sizes are the entire argument: eight hours you sleep
 * through against twenty minutes you are awake for. Written down, "8 hours"
 * looks like the bigger commitment. Drawn to one scale, it is obviously the
 * smaller one, because you were not there for it.
 *
 * The axis runs 6am to 6am rather than midnight to midnight, so the night
 * block is one contiguous shape instead of being cut in half by the frame.
 * That is a drawing decision, not a data one — the hours are real.
 *
 * Both rows share x(), so nothing here can be drawn out of proportion to
 * anything else. That is the only property this figure has to protect. */
/* Geometry. A left gutter for the row names, the 24 hours across the rest —
   so the two rows read as one chart with one axis rather than as two
   floating shapes, and nothing has to be labelled twice. */
const GUT = 104;              // row-name gutter
const PLOT = 720 - GUT;       // 24 hours live here
const H = PLOT / 24;          // one hour, in user units
const x = (hour: number) => GUT + hour * H;
/** Clock hour -> position on an axis that starts at 6am. */
const from6 = (clock: number) => (clock - 6 + 24) % 24;

const ROW = { home: 30, out: 92 };  // top of each band
const BAND = 30;

/** Minutes, so the widths below are the claim rather than a shape someone
 *  liked. A 20-80% DC stop is the same session routine-planner costs. */
const SESSIONS = {
  home: { start: 22, mins: 8 * 60, note: "You are asleep for all of it" },
  /* `label` is the React key and the thing the alt text is written from; it
     is deliberately not drawn. It sat one line above the hour axis and
     collided with it, and the axis already says when — the claim this figure
     makes is how LONG. */
  out: [
    { start: 12.75, mins: 20, label: "Lunch" },
    { start: 17.9, mins: 25, label: "On the way home" },
  ],
};

/* Written out rather than computed — the arithmetic version rendered "18pm".
   Carrying the axis position makes each tick its own thing, so the two "6am"
   ends are distinguishable and the list has a real key. */
const TICKS = [
  { at: 0, label: "6am" },
  { at: 6, label: "noon" },
  { at: 12, label: "6pm" },
  { at: 18, label: "midnight" },
  { at: 24, label: "6am" },
];

function DayStrip() {
  const home = SESSIONS.home;
  const homeX = x(from6(home.start));
  const homeW = (home.mins / 60) * H;

  return (
    <svg
      viewBox="0 0 720 154"
      className="mb-7 h-auto w-full"
      role="img"
      aria-label="A day drawn to scale: home charging is one eight-hour block overnight while you sleep; public charging is two stops of about twenty minutes each, during the day."
    >
      {/* Night, behind both rows, so it reads as the same night for both.
          Light enough to be ground rather than a panel — at full ink-100 the
          right third of the chart read as a separate card. */}
      <rect
        x={x(from6(21.5))} y="22" width={x(24) - x(from6(21.5))} height="106"
        fill="#48607F" fillOpacity="0.07"
      />
      <text x={x(from6(21.5)) + 8} y="16" fill="#647287" fontSize="10" letterSpacing="0.06em">
        NIGHT
      </text>

      {TICKS.map((t) => (
        <g key={t.at} data-rise style={{ "--d": `${0.3 + (t.at / 6) * 0.03}s` } as React.CSSProperties}>
          <line x1={x(t.at)} y1="22" x2={x(t.at)} y2="128" stroke="#DCE2E9" strokeWidth="1" />
          <text
            x={x(t.at)} y="146"
            textAnchor={t.at === 0 ? "start" : t.at === 24 ? "end" : "middle"}
            fill="#647287" fontSize="11"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* ── At home ───────────────────────────────────────────────── */}
      <text x="0" y={ROW.home + 19} fill="#48607F" fontSize="12" fontWeight="600">
        At home
      </text>
      <rect
        data-fill
        x={homeX} y={ROW.home} width={homeW} height={BAND} rx="4"
        fill="#1B3252"
        style={{ "--d": "0.1s" } as React.CSSProperties}
      />
      <text
        data-rise
        x={homeX + 12} y={ROW.home + 19}
        fill="#e0e3e5" fontSize="12" fontWeight="600"
        style={{ "--d": "0.6s" } as React.CSSProperties}
      >
        {home.mins / 60} hours
      </text>
      <text
        data-rise
        x={homeX} y={ROW.home + BAND + 16}
        fill="#647287" fontSize="11"
        style={{ "--d": "0.66s" } as React.CSSProperties}
      >
        {home.note}
      </text>

      {/* ── Out and about ─────────────────────────────────────────── */}
      <text x="0" y={ROW.out + 19} fill="#48607F" fontSize="12" fontWeight="600">
        Out and about
      </text>
      {SESSIONS.out.map((o, i) => {
        const ox = x(from6(o.start));
        const ow = (o.mins / 60) * H;
        return (
          <g key={o.label} data-pop style={{ "--d": `${0.5 + i * 0.12}s` } as React.CSSProperties}>
            <rect x={ox} y={ROW.out} width={ow} height={BAND} rx="3" fill="#FF7A00" />
            {/* Above the mark, not below: below is where the hour axis lives,
                and "20 min" landed straight on top of "noon". */}
            <text x={ox + ow / 2} y={ROW.out - 7} textAnchor="middle" fill="#B34D00" fontSize="11" fontWeight="600">
              {o.mins} min
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const ROWS: { q: string; home: string; out: string }[] = [
  {
    q: "When it happens",
    home: "While you sleep. You are not present for it.",
    out: "In a gap you already had — a shop, a meal, a coffee.",
  },
  {
    q: "How long you wait",
    home: "Nothing. You plug in and walk away.",
    out: "Minutes, not hours. Long enough to do the thing you stopped for.",
  },
  {
    q: "What it takes to set up",
    home: "An electrician, a permit, and somewhere to park that is yours.",
    out: "Nothing. Turn up.",
  },
  {
    q: "What it costs to run",
    home: "Your household electricity rate — usually the cheapest option there is.",
    out: "More per mile than home, less than petrol for most drivers.",
  },
  {
    q: "How often you think about it",
    home: "Almost never, after the first fortnight.",
    out: "Once or twice a week, and it becomes routine fast.",
  },
  {
    q: "Who it suits",
    home: "Anyone with a driveway, garage or an assigned space they can wire.",
    out: "Renters, street parkers, flat dwellers, and anyone doing a long day.",
  },
];

export function HomeVsPublic() {
  return (
    <GuideFigure
      eyebrow="Side by side"
      title="What each one is actually like"
      footnote="Both rows above are the same 24-hour scale, so the blocks are in true proportion; the day itself is one plausible day, not an average. Most people end up doing both — mostly at home, topping up out when a day runs long. The two are not rivals so much as a default and a backstop."
    >
      <DayStrip />

      <dl className="grid gap-px overflow-hidden rounded-lg bg-paper-300">
        <div className="grid bg-paper sm:grid-cols-[minmax(0,13rem)_1fr_1fr] sm:items-end">
          <span className="hidden sm:block" />
          {[
            { Icon: House, label: "Charging where you sleep" },
            { Icon: MapPin, label: "Charging out and about" },
          ].map((h) => (
            <p
              key={h.label}
              className="flex items-center gap-2 px-4 pb-3 pt-4 text-body-sm font-semibold text-ink-900"
            >
              <h.Icon aria-hidden className="h-4 w-4 shrink-0 text-ink-400" strokeWidth={2} />
              {h.label}
            </p>
          ))}
        </div>

        {ROWS.map((r) => (
          <div key={r.q} className="grid gap-y-1 bg-paper p-4 sm:grid-cols-[minmax(0,13rem)_1fr_1fr] sm:gap-x-0">
            <dt className="text-caption text-ink-400 sm:pr-6 sm:pt-0.5">{r.q}</dt>
            {/* The label repeats on mobile because the column header scrolls
                away once the grid stacks, and "Nothing. Turn up." with no
                heading above it means nothing at all. */}
            <dd className="text-body-sm text-ink-700 sm:pr-6">
              <span className="mt-2 block text-caption font-semibold text-ink-500 sm:hidden">
                At home
              </span>
              {r.home}
            </dd>
            <dd className="text-body-sm text-ink-700">
              <span className="mt-2 block text-caption font-semibold text-ink-500 sm:hidden">
                Out and about
              </span>
              {r.out}
            </dd>
          </div>
        ))}
      </dl>
    </GuideFigure>
  );
}
