import type { Metadata } from "next";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { GuideCta } from "@/components/learn";

export const metadata: Metadata = {
  title: "Your First Visit — What to Expect | HubCharge",
  description:
    "New to HubCharge? Here's exactly what happens on your first visit: pull up, stay in your car, our attendant plugs you in, you pay from your phone's browser, and you're back on the road in about 10 minutes.",
  alternates: { canonical: "https://hubcharge.com/what-to-expect" },
};

const steps = [
  {
    n: "01",
    title: "Pull up to an open charger",
    desc: "Drive in like you would at a full-service gas station. Pick any open spot — no reservation needed, no app to fumble with.",
    image: "/images/home.webp",
    alt: "HubCharge charging station at dusk",
  },
  {
    n: "02",
    title: "We come to you",
    desc: "At participating locations, a HubCharge attendant greets you at your window. Tell them how much charge you want — or just say \"top me up.\"*",
    image: "/images/valet-greet-v2.webp",
    alt: "HubCharge attendant greeting a driver at their car window",
  },
  {
    n: "03",
    title: "Approve your flat rate from your phone",
    desc: "Tap your phone to the charger or scan the code — the checkout opens right in your browser. Your exact flat price is shown before anything starts.",
    image: "/images/charging-service-v2.webp",
    alt: "An attendant connecting the charging cable to a car",
  },
  {
    n: "04",
    title: "Relax while you charge",
    desc: `Stay in your seat — your car is your space. A quick top-up takes about 10 minutes and adds roughly ${TEN_MINUTE_RANGE} miles, depending on your vehicle.*`,
    image: "/images/charging-service-v2.webp",
    alt: "EV charging while the driver relaxes in the car",
  },
  {
    n: "05",
    title: "We unplug — you're done",
    desc: "No idle fees ticking, no cable wrangling. The attendant unplugs, you pull out, and you're back on the road.",
    image: "/images/coffee-delivery-v3.webp",
    alt: "Attendant finishing a charging session",
  },
];

export default function WhatToExpectPage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="First visit"
      image="/images/valet-greet-v2.webp"
      imageAlt="A HubCharge attendant greeting a driver at their car window"
      title="Your first visit, step by step"
      intro="Never used a full-service charger before? Almost nobody has — that's the point. Here's exactly how it goes."
    >
      <div className="max-w-4xl space-y-12 mb-16">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className={`grid md:grid-cols-2 gap-8 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative h-56 sm:h-64 rounded-lg overflow-hidden">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-brand-ink font-bold text-body-sm tracking-widest mb-2">
                {step.n}
              </p>
              <h2 className="text-h3 text-ink-900 mb-3">{step.title}</h2>
              <p className="text-ink-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <GuideCta
        headline="That’s it. Really."
        sub="No app downloads, no memberships, no guessing what it’ll cost. Come see why drivers don’t go back to self-serve."
      />

      <p className="text-caption text-ink-500 mt-8 max-w-2xl">
        Attendant service at select locations and hours — self-serve is always
        available. Charging speed and added range vary by vehicle, battery
        state of charge, and temperature.
      </p>
    </PageShell>
  );
}
