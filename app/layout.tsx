import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollReset } from "@/components/scroll-reset";
import { STATE_NAMES, stations, statesWithCoverage } from "@/lib/stations";
import { COMPANY } from "@/lib/company";

// Body / UI typeface — var(--font-jakarta), referenced by fontFamily.sans.
// 800 dropped: nothing in the new scale is that heavy.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Display typeface — var(--font-fraunces), referenced by fontFamily.serif.
// Variable font: pass `axes` only. Passing `weight` alongside it is a build error.
// The optical-size axis is why this holds at both 84px display and 20px numerals.
const fraunces = Fraunces({
  subsets: ["latin"],
  /* opsz only. SOFT and WONK were requested and then pinned to 0 — the axis
     default — at every one of the seven places this font is configured, so
     the site paid to ship two axes it never moved. Fraunces' latin subset is
     preloaded on all 60 routes and sits on the critical rendering path, which
     makes it the most expensive place on the site to carry something unused. */
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hubcharge.com"),
  title:
    "HubCharge | Full-Service EV Fast Charging Near You | DC Fast Charger",
  /* Was "…full-service attendants and food & coffee delivered to your car".
     Delivery is not launched anywhere — the lifestyle section carries a
     "Coming Soon" badge and the FAQ says so outright — and this string is in
     <head> on every route, which made it the site's most widely published
     claim about a service nobody can order yet. Attendant service is real but
     varies by site and hour, so it keeps its hedge here too. */
  description:
    "Find fast EV charging near you. DC fast charging up to 180kW, with attendant service at select locations and hours — no app needed, pay from your phone's browser. CCS & NACS for Tesla, BMW, Ford, Rivian & all EVs. Live now in Alhambra & Fontana, California.",
  keywords: [
    "EV charging near me",
    "fast EV charging",
    "DC fast charger",
    "electric vehicle charging station",
    "Tesla charging alternative",
    "180kW charger",
    "rapid EV charging",
    "quick charge station",
    "EV charger California",
    "electric car charging",
    "CCS charger",
    "NACS charger",
    "level 3 charging",
    "HubCharge",
    "EV charging station near me",
    "fast charger near me",
    "public EV charging",
    "premium EV charging",
    "full-service EV charging",
    "no app EV charging",
    "Alhambra EV charging",
    "Fontana EV charging",
  ],
  authors: [{ name: "HubCharge" }],
  openGraph: {
    title: "HubCharge | Full-Service EV Fast Charging",
    description:
      "DC fast charging up to 180kW, with attendant service at select locations and hours — no app needed. Live in Alhambra & Fontana, CA. Tesla, BMW, Ford, Rivian & all EVs.",
    url: "https://hubcharge.com",
    siteName: "HubCharge",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "HubCharge DC Fast Charging Station",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HubCharge | Full-Service EV Fast Charging",
    description:
      "DC fast charging up to 180kW, full-service — no app needed. Alhambra & Fontana, CA.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hubcharge.com",
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#FF7A00",
  width: "device-width",
  initialScale: 1,
  // Required for env(safe-area-inset-*) to resolve to anything but 0, which
  // the mobile tab bar's .safe-area-bottom depends on.
  viewportFit: "cover",
};

// Brand-level structured data (site-wide). Each station page emits its own
// AutomotiveBusiness with the station's address — see app/locations/[slug].
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  description:
    "DC fast EV charging stations in California, with attendant service at select locations and hours.",
  url: "https://hubcharge.com",
  logo: "https://hubcharge.com/images/hubcharge-logo.webp",
  image: "https://hubcharge.com/og.jpg",
  /* Was "+1-949-392-8755" — the same number lib/stations.ts writes as
     "+19493928755". Two formats for one fact is how a NAP splits. */
  telephone: COMPANY.phoneE164,
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.zip,
    addressCountry: COMPANY.address.country,
  },
  /* Cities AND the state they are in. This listed two cities and no state,
     which understates the area to anything reading the graph — and now that
     the site has per-state pages the structured data should agree with the
     information architecture. Derived from the station data so it cannot drift
     from the pages. */
  areaServed: [
    ...Array.from(new Set(stations.map((s) => s.city))).map((name) => ({
      "@type": "City" as const,
      name,
    })),
    ...Array.from(new Set(stations.map((s) => s.state))).map((code) => ({
      "@type": "State" as const,
      name: STATE_NAMES[code] ?? code,
    })),
  ],
  sameAs: ["https://www.linkedin.com/company/micronocinc"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <head>
        {/* Derived from the station data rather than pinned to US-CA. These
            were two literals on the ROOT layout, so every page on the site —
            including the Texas state page and the Round Rock station page —
            told search engines it was about California. */}
        {statesWithCoverage().map((g) => (
          <meta key={g.code} name="geo.region" content={`US-${g.code}`} />
        ))}
        <meta
          name="geo.placename"
          content={statesWithCoverage().map((g) => g.name).join(", ")}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <SmoothScroll />
        <ScrollReset />
        <ScrollReveal />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
