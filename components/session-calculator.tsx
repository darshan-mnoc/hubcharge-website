"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BatteryCharging, Info, Clock, Zap } from "lucide-react";
import { getModel, type EvModel } from "@/lib/ev-models";
import { ModelPicker } from "@/components/model-picker";
import { CurveSpark } from "@/components/curve-spark";
import {
  simulateSession,
  minutesBetweenSoc,
  TEMPERATURE_FACTORS,
  type TemperatureId,
  ESTIMATE_BASIS,
  POWER_BASIS,
} from "@/lib/charging-math";
import {
  sessionSteps,
  sessionBreakdown,
  maxSessionMinutes,
  type Station,
  type SessionStep,
} from "@/lib/stations";
import { availableNow, servicesBy, caveatsFor } from "@/lib/services";

const START_SOCS = [10, 20, 40, 60] as const;

/** A numbered control group. Four unlabelled stacks read as one long list;
 *  numbering them says there are exactly four decisions and you're on the second. */
function Step({
  n,
  label,
  hint,
  children,
}: {
  n: number;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr] gap-x-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-footnote text-on-dark/70"
      >
        {n}
      </span>
      <div className="min-w-0">
        {/* The hint used to sit inline after the label, where it was the first
            thing to wrap and pushed two-word labels onto four lines. On its
            own row it also gets a legible colour: text-on-dark/55 measured
            3.20:1 on ink-900, which fails AA. */}
        <p className="text-caption text-on-dark/60">{label}</p>
        {hint && (
          <p className="text-footnote text-on-dark/55 mt-0.5">{hint}</p>
        )}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

/** The pill idiom used by every choice in this panel. */
function Pill({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      /* hc-tint rather than Tailwind's transition-colors, which compiles to
         Material's cubic-bezier(0.4,0,0.2,1) — not this site's curve, and
         written by the compiler where a source grep cannot see it. */
      className={`hc-tint rounded-full border px-4 py-1.5 text-caption outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 ${
        active
          ? "border-brand bg-brand text-ink-900"
          : "border-white/20 text-on-dark/75 hover:border-white/45"
      }`}
    >
      {children}
    </button>
  );
}

/** One line of the result rail. */
function Fact({
  term,
  children,
  strong,
}: {
  term: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-white/10 py-2 first:border-t-0">
      <dt className="text-caption text-on-dark/60">{term}</dt>
      <dd
        className={`text-right tabular-nums ${
          strong ? "text-body-sm font-semibold text-white" : "text-caption text-on-dark"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/**
 * The session calculator.
 *
 * Pick a station, a car, the charge you arrive with and how long you stay;
 * get the energy, the range, the state of charge you leave on, and the average
 * power that produced them. Every figure is one integration of that car's
 * published curve against that station's ceiling — not a per-make average
 * multiplied by a factor.
 *
 * WHY THE DURATIONS COME FROM THE STATION
 * This used to offer "Quick top-up / Half stop / Longer stop" at 10, 20 and
 * 30 minutes, which were made up. The charger sells a base period plus a
 * bounded number of equal extensions, so those are the only stop lengths that
 * exist, and `sessionSteps` derives them from the station record. Showing what
 * each duration is *made of* is also the closest thing to an itemised bill the
 * site prints — see the note about money below.
 *
 * WHY THERE IS NO PRICE HERE
 * Deliberate, and load-bearing: HubCharge discloses the rate on the charger
 * screen and in the browser checkout, and the promise the site makes is the
 * model rather than the number. `station.tariff` is the slot that would change
 * that, it is unset on every station, and the branch below is what renders if
 * it is ever filled in. Nothing in this file hard-codes an amount.
 */
export function SessionCalculator({
  stations,
  variant = "section",
}: {
  stations: Station[];
  /** "hero" is page-primary and leads with the summary; "section" is a slab. */
  variant?: "hero" | "section";
}) {
  const [siteId, setSiteId] = useState(stations[0].slug);
  const station = stations.find((s) => s.slug === siteId) ?? stations[0];
  const [modelId, setModelId] = useState("hyundai-ioniq-5");
  const [startSoc, setStartSoc] = useState<number>(20);
  const [minutes, setMinutes] = useState<number>(station.session.baseMinutes);
  const [temp, setTemp] = useState<TemperatureId>("mild");

  const model = getModel(modelId) as EvModel;
  const steps = useMemo(() => sessionSteps(station), [station]);

  /* Stations could in principle be configured differently, so a duration
     chosen at one site may not exist at another. Fall back to the longest
     stop that does rather than simulating a session nobody can buy. */
  const step: SessionStep =
    steps.find((s) => s.minutes === minutes) ?? steps[steps.length - 1];

  const result = useMemo(
    () => simulateSession(model, station.maxKw, startSoc, step.minutes, temp),
    [model, station.maxKw, startSoc, step.minutes, temp]
  );

  const tenToEighty = useMemo(
    () => minutesBetweenSoc(model, station.maxKw, 10, 80, temp),
    [model, station.maxKw, temp]
  );

  const hero = variant === "hero";
  const now = availableNow();
  const soon = servicesBy("soon");
  const caveats = caveatsFor([...now, ...soon]);

  /* One number of record for a screen reader, rather than making it walk a
     definition list to find out what changed. */
  const spoken =
    `About ${result.milesLow} to ${result.milesHigh} miles, ` +
    `${result.kwhToBattery} kilowatt hours into a ${model.name} ` +
    `over ${step.minutes} minutes, arriving at ${startSoc} percent and ` +
    `leaving at ${result.endSoc} percent, averaging ${result.avgKw} kilowatts.`;

  const controls = (
    <div
      className={
        hero
          ? "grid gap-x-8 gap-y-5 sm:grid-cols-2 min-w-0"
          : "space-y-5 min-w-0"
      }
    >
      {stations.length > 1 && (
        <Step n={1} label="Station">
          <div role="group" aria-label="Station" className="flex flex-wrap gap-2">
            {stations.map((st) => (
              <Pill
                key={st.slug}
                active={st.slug === station.slug}
                onClick={() => setSiteId(st.slug)}
              >
                {st.city}
                {st.status === "coming-soon" && (
                  <span className="ml-1.5 opacity-60">opening soon</span>
                )}
              </Pill>
            ))}
          </div>
        </Step>
      )}

      <Step n={stations.length > 1 ? 2 : 1} label="Your car">
        <div className="max-w-sm">
          <ModelPicker
            id="calc-model"
            value={modelId}
            onChange={setModelId}
            label=""
            tone="dark"
          />
        </div>
      </Step>

      <Step
        n={stations.length > 1 ? 3 : 2}
        label="Battery when you arrive"
        hint="the biggest factor"
      >
        <div
          role="group"
          aria-label="Battery when you arrive"
          className="flex flex-wrap gap-2"
        >
          {START_SOCS.map((s) => (
            <Pill key={s} active={s === startSoc} onClick={() => setStartSoc(s)}>
              {s}%
            </Pill>
          ))}
        </div>
      </Step>

      <Step
        n={stations.length > 1 ? 4 : 3}
        label="How long you stay"
        hint={`up to ${maxSessionMinutes(station)} min`}
      >
        <div
          role="group"
          aria-label="How long you stay"
          className="flex flex-wrap gap-2"
        >
          {steps.map((s) => (
            <Pill
              key={s.minutes}
              active={s.minutes === step.minutes}
              onClick={() => setMinutes(s.minutes)}
              label={`${s.minutes} minutes — ${sessionBreakdown(station, s)}`}
            >
              {s.minutes} min
            </Pill>
          ))}
        </div>
        {/* What the chosen duration is made of. The charger sells a base
            period plus extensions and the site never said so anywhere. */}
        <p className="mt-2 text-footnote text-on-dark/55">
          {sessionBreakdown(station, step)}
        </p>
      </Step>

      {/* Not numbered: weather is a condition you arrive in, not a decision
          you make, and numbering it implied there were five things to choose.
          Spans the full width in hero mode so it reads as a closing row
          rather than being orphaned in half of one. */}
      <div
        className={`grid grid-cols-[1.5rem_1fr] gap-x-3 pt-1 ${
          hero ? "sm:col-span-2" : ""
        }`}
      >
        <span aria-hidden />
        <div className="min-w-0">
          <p className="text-caption text-on-dark/60 mb-2">Weather on the day</p>
          <div role="group" aria-label="Weather" className="flex flex-wrap gap-2">
            {Object.values(TEMPERATURE_FACTORS).map((t) => (
              <Pill
                key={t.id}
                active={t.id === temp}
                onClick={() => setTemp(t.id as TemperatureId)}
              >
                {t.label}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const summary = (
    <div
      className={
        hero
          ? "self-start lg:sticky lg:top-24 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          : "border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10"
      }
    >
      <p aria-live="polite" className="sr-only">
        {spoken}
      </p>

      <span className="flex items-center gap-2 text-on-dark/60 text-caption mb-1">
        <BatteryCharging aria-hidden className="h-4 w-4 text-brand" />
        Estimated range added, arriving at {startSoc}%
      </span>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${station.slug}-${modelId}-${step.minutes}-${startSoc}-${temp}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="text-stat text-white whitespace-nowrap tabular-nums"
        >
          {result.milesLow}–{result.milesHigh}
          <span className="text-h2 text-on-dark/60 ml-2">mi</span>
        </motion.p>
      </AnimatePresence>

      {/* The shape behind the number — same curve the estimate integrates.
          Width is capped and the box is taller than it looks like it needs to
          be: CurveSpark sets preserveAspectRatio="none" over a 160x44 viewBox,
          so an unbounded `w-full h-9` stretched it to roughly 44:1 and the
          orange fill read as a solid brown slab rather than a taper. */}
      <CurveSpark
        model={model}
        tone="dark"
        className="mt-4 h-14 w-full max-w-[18rem]"
      />

      <dl className="mt-5">
        <Fact term="Energy into your battery" strong>
          {result.kwhToBattery} kWh
        </Fact>
        <Fact term="Battery after" strong>
          {startSoc}% → {result.endSoc}%
        </Fact>
        <Fact term="Estimated average power" strong>
          {result.avgKw} kW
        </Fact>
        <Fact term="Session">{sessionBreakdown(station, step)}</Fact>
        <Fact term={`10–80% at ${station.city}`}>{tenToEighty} min</Fact>
      </dl>

      {/* Price. The amount is disclosed on the charger and in the checkout,
          not here — and `station.tariff` is the slot that would change that. */}
      <div className="mt-5 rounded-lg border border-white/10 bg-ink-900/60 p-4">
        <p className="flex items-center gap-2 text-caption font-semibold text-white">
          <Clock aria-hidden className="h-3.5 w-3.5 text-brand" />
          What this stop costs
        </p>
        {station.tariff ? (
          <dl className="mt-2.5">
            <Fact term={`First ${station.session.baseMinutes} min`}>
              {usd(station.tariff.basePrice)}
            </Fact>
            {step.extensions > 0 && (
              <Fact
                term={`${step.extensions} × ${station.session.extensionMinutes} min extension${
                  step.extensions > 1 ? "s" : ""
                }`}
              >
                {usd(station.tariff.extensionPrice * step.extensions)}
              </Fact>
            )}
            <Fact term="Total" strong>
              {usd(
                station.tariff.basePrice +
                  station.tariff.extensionPrice * step.extensions
              )}
            </Fact>
            <Fact term="Card authorisation at start">
              {usd(station.tariff.preAuth)}
            </Fact>
          </dl>
        ) : (
          <p className="mt-1.5 text-caption text-on-dark/65">
            One flat rate for the session. Your exact price appears on your
            phone at the charger and you approve it before anything starts —{" "}
            <Link
              href="/plan-your-charge#price"
              className="text-brand underline underline-offset-2"
            >
              why we show it there and not here
            </Link>
            .
          </p>
        )}
      </div>

      {result.vehicleLimited && (
        <p className="mt-4 flex gap-1.5 text-caption text-brass">
          <Info aria-hidden className="h-3 w-3 mt-0.5 shrink-0" />
          <span>
            This car peaks at {model.peakKw}kW — it, not our charger, sets the
            pace.
          </span>
        </p>
      )}
      {result.stationLimited && !result.vehicleLimited && (
        <p className="mt-4 flex gap-1.5 text-caption text-brass">
          <Info aria-hidden className="h-3 w-3 mt-0.5 shrink-0" />
          <span>
            This car can take more than {station.maxKw}kW — our charger sets the
            pace here.
          </span>
        </p>
      )}
    </div>
  );

  /* Services, split by what a driver can actually count on. The homepage
     add-on picker used to offer four of these with no marker at all and fold
     them into a list headed "included in your flat rate". */
  const serviceSplit = (
    <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
      <div>
        <p className="flex items-center gap-2 text-caption font-semibold text-white">
          <Zap aria-hidden className="h-3.5 w-3.5 text-ok-on-dark" />
          At this stop today
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {now.map((s) => (
            <li key={s.id} className="text-caption text-on-dark/75">
              {s.label}
              {s.availability === "limited" && (
                <span className="ml-1.5 rounded-full bg-brass/20 px-2 py-0.5 text-footnote text-brass">
                  limited
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="flex items-center gap-2 text-caption font-semibold text-white">
          <Clock aria-hidden className="h-3.5 w-3.5 text-on-dark/55" />
          Not yet — coming soon
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {soon.map((s) => (
            <li key={s.id} className="text-caption text-on-dark/55">
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const footnotes = (
    <>
      {model.note && (
        <p className="mt-7 flex gap-2 text-caption text-on-dark/60 max-w-[80ch]">
          <Info aria-hidden className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brass" />
          {model.note}
        </p>
      )}
      <p className="text-caption text-on-dark/60 mt-3 max-w-[80ch]">
        {ESTIMATE_BASIS}
      </p>
      <p className="text-caption text-on-dark/60 mt-2 max-w-[80ch]">
        {POWER_BASIS}
      </p>
      {caveats.map((c) => (
        <p key={c} className="text-caption text-on-dark/55 mt-2 max-w-[80ch]">
          {c}
        </p>
      ))}
    </>
  );

  return (
    <section
      id="plan"
      className={`bg-ink-900 scroll-mt-28 ${
        hero ? "rounded-lg p-5 sm:p-8 lg:p-10" : "rounded-lg p-5 sm:p-8"
      }`}
    >
      {hero ? (
        /* No visible heading here. This panel is the page's primary content
           and sits immediately below an H1 that already says what it is —
           an overline, a rule and an H2 restating it cost 149px of the first
           viewport, which is the one thing this layout exists to protect.
           The heading stays for anyone navigating by headings. */
        <h2 className="sr-only">Session calculator</h2>
      ) : (
        <>
          <p className="text-overline text-white/55">What a stop adds</p>
          <span aria-hidden className="mt-3 mb-5 block h-px w-8 bg-brass" />
          <h2 className="text-h3 text-white mb-6">
            What {station.city} adds to your car
          </h2>
        </>
      )}

      {/* Both variants bound the rail explicitly.
          The section variant was `lg:grid-cols-[1fr_auto]`, and `auto` means
          max-content: once the rail gained a price paragraph, it claimed the
          width of that paragraph's longest line and the `1fr` column — whose
          automatic minimum `min-w-0` had already removed — collapsed to about
          100px. Labels then wrapped a word per line and the pills squeezed
          into circles. `minmax(0,1fr)` beside a fixed rail cannot do that. */}
      <div
        className={`grid gap-8 lg:gap-12 items-start ${
          hero
            ? "lg:grid-cols-[minmax(0,1fr)_22rem]"
            : "lg:grid-cols-[minmax(0,1fr)_20rem]"
        }`}
      >
        {controls}
        {summary}
      </div>

      {serviceSplit}
      {footnotes}
    </section>
  );
}
