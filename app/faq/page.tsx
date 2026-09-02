import type { Metadata } from "next";
import { GuideCover } from "@/components/guide-cover";
import { TEN_MINUTE_RANGE } from "@/lib/charging-math";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { FaqSearch } from "@/components/faq-search";

export const metadata: Metadata = {
  title: "FAQ — Charging, Compatibility, Pricing & More | HubCharge",
  description:
    "Answers about HubCharge full-service EV charging: which cars can charge (Tesla, NACS & CCS), how browser-based charging works with no app, flat-rate pricing, attendant service, hours, and accessibility.",
  alternates: { canonical: "https://hubcharge.com/faq" },
};

type QA = { q: string; a: React.ReactNode };
type Group = { title: string; items: QA[] };

const groups: Group[] = [
  {
    title: "Compatibility",
    items: [
      {
        q: "Can a Tesla charge at HubCharge?",
        a: "Yes. Our chargers have NACS connectors — the plug Tesla uses — so Teslas plug straight in with no adapter.",
      },
      {
        q: "Which EVs can charge here?",
        a: (
          <>
            Nearly all of them. We offer both NACS (Tesla and newer EVs) and
            CCS (BMW, Ford, Rivian, Hyundai, Kia, Mercedes, Porsche, VW, and
            most other EVs sold in the US) — no adapter needed. Check your
            make in{" "}
            <Link
              href="/charging-101/can-my-ev-charge-here"
              className="text-brand-ink underline"
            >
              our compatibility guide
            </Link>
            .
          </>
        ),
      },
      {
        q: "How fast will my car charge?",
        a: (
          <>
            Our chargers deliver up to 180kW. Your actual speed depends on
            your vehicle&apos;s maximum charging rate, battery state of
            charge, and temperature — a quick top-up typically takes about 10
            minutes and adds roughly {TEN_MINUTE_RANGE} miles, depending on your car. See{" "}
            <Link
              href="/charging-101/charging-speed"
              className="text-brand-ink underline"
            >
              how charging speed really works
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    title: "Starting a charge — no app needed",
    items: [
      {
        q: "Do I need to download an app?",
        a: "No. HubCharge runs entirely in your phone's browser. Tap your phone to the charger or scan the code on its screen, and you're in.",
      },
      {
        q: "Do I need an account?",
        a: "No — you can charge as a guest. Signing in is optional and just makes repeat visits quicker by saving your session history.",
      },
      {
        q: "How do I pay?",
        a: "Right from your phone in the browser flow — add a card and swipe to start. Your total flat rate is shown before your session begins.",
      },
    ],
  },
  {
    title: "Pricing",
    items: [
      {
        q: "How does flat-rate pricing work?",
        a: (
          <>
            You pay one flat price per session instead of a per-kWh rate that&apos;s
            hard to predict. Your exact price is shown on your phone before you
            plug in, and it never changes mid-session. Want more range? Extend
            in quick taps, up to 4 times. See{" "}
            <Link href="/pricing" className="text-brand-ink underline">
              our pricing page
            </Link>{" "}
            for the full model.
          </>
        ),
      },
      {
        q: "Is a membership or subscription required?",
        a: "No. Everyone gets the same flat rate — no subscription, no member/non-member price tiers, no commitment.",
      },
    ],
  },
  {
    title: "Full service & attendants",
    items: [
      {
        q: "What does \"full service\" mean?",
        a: "At participating locations, a HubCharge attendant greets you, plugs in your car, monitors your session, and unplugs when you're done — you never have to leave your seat.",
      },
      {
        q: "Is an attendant always there?",
        a: "Attendant availability varies by location and time of day. Check your station's page for details, or call us — chargers are always self-serve capable, so you can charge even when an attendant isn't on site.",
      },
      {
        q: "Can I really get food or coffee delivered to my car?",
        a: "That's the plan — lifestyle services (coffee, food, errands) are launching soon at select locations. Until then, both of our stations are steps away from great coffee, food, and shopping.",
      },
    ],
  },
  {
    title: "Locations, hours & access",
    items: [
      {
        q: "Where are HubCharge stations?",
        a: (
          <>
            We&apos;re live in{" "}
            <Link href="/locations/alhambra" className="text-brand-ink underline">
              Alhambra
            </Link>{" "}
            and{" "}
            <Link href="/locations/fontana" className="text-brand-ink underline">
              Fontana
            </Link>
            , California, with more locations on the way. See all on the{" "}
            <Link href="/locations" className="text-brand-ink underline">
              locations page
            </Link>
            .
          </>
        ),
      },
      {
        q: "What are the hours?",
        a: (
          <>
            Hours can differ by site, so check the one you&rsquo;re heading to
            on our{" "}
            <Link href="/locations" className="text-brand-ink underline">
              locations page
            </Link>
            .
          </>
        ),
      },
      {
        q: "Is charging accessible for drivers with disabilities?",
        a: (
          <>
            Our full-service model means an attendant can handle the entire
            charging process while you stay in your car, which many drivers
            find more accessible than self-service charging. If you need
            assistance, call (949) 392-8755. More on our{" "}
            <Link href="/accessibility" className="text-brand-ink underline">
              accessibility page
            </Link>
            .
          </>
        ),
      },
      {
        q: "How do I reach support?",
        a: (
          <>
            Call{" "}
            <a href="tel:+19493928755" className="text-brand-ink underline">
              (949) 392-8755
            </a>{" "}
            (Mon–Fri, 9 AM – 6 PM PST), email{" "}
            <a href="mailto:info@micronocinc.com" className="text-brand-ink underline">
              info@micronocinc.com
            </a>
            , or use the{" "}
            <Link href="/contact" className="text-brand-ink underline">
              contact form
            </Link>
            .
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <PageShell
      backTo={{ href: "/", label: "Home" }}
      eyebrow="Support"
      cover={<GuideCover motif="ask" />}
      title="Frequently asked questions"
      intro="Everything about charging with HubCharge — compatibility, pricing, and how full service works."
    >
      <FaqSearch groups={groups} />

      <div className="max-w-measure mt-14">
        <p className="text-caption text-ink-400">
          Charging speed and added range vary by vehicle, battery state of
          charge, and temperature. Attendant service at select locations and
          hours.
        </p>
      </div>
    </PageShell>
  );
}
