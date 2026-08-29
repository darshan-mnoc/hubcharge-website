import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollReveal } from "@/components/scroll-reveal";

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
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hubcharge.com"),
  title:
    "HubCharge | Full-Service EV Fast Charging Near You | DC Fast Charger",
  description:
    "Find fast EV charging near you. DC fast charging up to 180kW with full-service attendants and food & coffee delivered to your car — no app needed. CCS & NACS for Tesla, BMW, Ford, Rivian & all EVs. Live now in Alhambra & Fontana, California.",
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
      "DC fast charging up to 180kW with full-service attendants — no app needed. Live in Alhambra & Fontana, CA. Tesla, BMW, Ford, Rivian & all EVs.",
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
  name: "HubCharge",
  legalName: "Micronoc Inc.",
  description:
    "Full-service DC fast EV charging stations with attendant service in California.",
  url: "https://hubcharge.com",
  logo: "https://hubcharge.com/images/hubcharge-logo.webp",
  image: "https://hubcharge.com/og.jpg",
  telephone: "+1-949-392-8755",
  email: "info@micronocinc.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "9383 Charles Smith Avenue",
    addressLocality: "Rancho Cucamonga",
    addressRegion: "CA",
    postalCode: "91730",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Alhambra" },
    { "@type": "City", name: "Fontana" },
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
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="California" />
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
        <ScrollReveal />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
