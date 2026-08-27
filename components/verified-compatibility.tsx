import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";
import { evModels, EV_DATA_UPDATED, type EvModel } from "@/lib/ev-models";
import { tenMinuteBand, tenToEighty, STATION_KW } from "@/lib/charging-math";

/**
 * Verified compatibility.
 *
 * Deliberately NOT testimonials. Every line here is a checkable fact about a
 * named vehicle — the port it uses, what our chargers deliver to it, how long
 * 10-80% takes — modelled from that car's published charging curve. A reader
 * can verify any of it against the manufacturer's own specification.
 *
 * If real, attributed, consented customer reviews arrive, they belong beside
 * this block, not instead of it — and they must be real.
 */

/** A spread across ports, architectures and price points. */
const FEATURED = [
  "hyundai-ioniq-5",
  "tesla-model-y-lr",
  "kia-ev6",
  "bmw-i4-edrive40",
  "porsche-taycan",
  "ford-mach-e-er",
  "honda-prologue",
  "toyota-bz",
  "rivian-r1t-large",
  "mercedes-eqe-350",
  "chevy-equinox-ev",
  "lucid-gravity",
];

function Row({ model }: { model: EvModel }) {
  const [lo, hi] = tenMinuteBand(model);
  const full = tenToEighty(model);
  return (
    <li className="grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,16ch)_8rem_minmax(0,1fr)_7rem] gap-x-6 gap-y-1 items-baseline py-4 border-t border-paper-300 last:border-b">
      <span className="flex items-center gap-2 text-h4 text-ink-900">
        <CheckCircle2 aria-hidden className="h-3.5 w-3.5 shrink-0 text-ok-ink" />
        {model.short}
      </span>
      <span className="hidden md:block text-caption text-ink-400">
        {model.port === "nacs" ? "NACS" : "CCS"} · {model.archV}V
      </span>
      <span className="col-span-2 md:col-span-1 text-body-sm text-ink-500">
        <span className="whitespace-nowrap">~{lo}–{hi} mi in 10 min</span>{" · "}<span className="whitespace-nowrap">10–80% in {full} min</span>
      </span>
      <span className="hidden md:block text-caption text-ink-400 text-right whitespace-nowrap">
        {Math.min(model.peakKw, STATION_KW)} kW here
      </span>
    </li>
  );
}

export function VerifiedCompatibility() {
  const models = FEATURED.map((id) => evModels.find((m) => m.id === id)).filter(
    Boolean
  ) as EvModel[];

  return (
    <section className="max-w-4xl">
      <p className="text-overline text-ink-500">Verified compatible</p>
      <span aria-hidden className="mt-4 mb-6 block h-px w-8 bg-brass" />
      <h2 className="text-h2 text-ink-900 max-w-headline mb-4">
        Bring the car you already own
      </h2>
      <p className="text-body-lg text-ink-500 max-w-[52ch] mb-3">
        Every charger carries both a NACS and a CCS cable, so there is no
        adapter to buy and nothing to check before you set off. Below is what
        our chargers actually deliver to some of the most common EVs on
        California roads.
      </p>
      <p className="flex items-start gap-2 text-caption text-ink-400 mb-8 max-w-[60ch]">
        <Zap aria-hidden className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brass" />
        These are modelled from each car&rsquo;s published charging curve
        against our 180kW output — not customer claims, and not marketing peak
        figures. Check any of them against the manufacturer&rsquo;s own spec.
      </p>

      <ul>
        {models.map((m) => (
          <Row key={m.id} model={m} />
        ))}
      </ul>

      <p className="text-caption text-ink-400 mt-6">
        {evModels.length} models modelled · last verified {EV_DATA_UPDATED} ·{" "}
        <Link
          href="/charging-101/can-my-ev-charge-here"
          className="text-brand-ink underline"
        >
          check your own car
        </Link>
      </p>
    </section>
  );
}

/**
 * Operational facts — all derived from real station data, none of it claimed
 * uptime or invented volume.
 */
export function OperationalTrust({
  stationCount,
  hours,
}: {
  stationCount: number;
  hours: string;
}) {
  const facts = [
    { v: `${stationCount}`, l: "Stations live in California" },
    { v: "NACS + CCS", l: "Both cables on every charger" },
    { v: hours, l: "Open daily" },
    { v: "No app", l: "Runs in your phone's browser" },
  ];
  return (
    <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-paper-300 border border-paper-300 rounded-lg overflow-hidden">
      {facts.map((f) => (
        <div key={f.l} className="bg-paper p-5">
          <dt className="text-h3 text-ink-900">{f.v}</dt>
          <dd className="text-caption text-ink-500 mt-1">{f.l}</dd>
        </div>
      ))}
    </dl>
  );
}
