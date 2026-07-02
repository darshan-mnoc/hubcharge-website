import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Cursor } from "@/components/cursor";

// Design system typeface — exposed as var(--font-jakarta) (referenced by fontFamily.sans)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hubcharge.com"),
  title:
    "HubCharge | Full-Service EV Fast Charging Near You | 180kW DC Charger",
  description:
    "Find fast EV charging near you. 180kW DC fast charging with full-service attendants and food & coffee delivered to your car — no app needed. CCS & NACS for Tesla, BMW, Ford, Rivian & all EVs. Live now in Alhambra & Fontana, California.",
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
      "180kW DC fast charging with full-service attendants — no app needed. Live in Alhambra & Fontana, CA. Tesla, BMW, Ford, Rivian & all EVs.",
    url: "https://hubcharge.com",
    siteName: "HubCharge",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/home.png",
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
      "180kW DC fast charging, full-service — no app needed. Alhambra & Fontana, CA.",
    images: ["/images/home.png"],
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
};

// Structured data for local business (Google Maps visibility)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HubCharge",
  description: "Premium DC fast EV charging stations with attendant service",
  url: "https://hubcharge.com",
  telephone: "+1-949-391-4676",
  priceRange: "$$",
  image: "https://hubcharge.com/images/hubcharge-logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "108 S Monterey St, Unit 102",
    addressLocality: "Alhambra",
    addressRegion: "CA",
    postalCode: "91801",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 34.095,
    longitude: -118.127,
  },
  areaServed: [
    { "@type": "City", name: "Alhambra" },
    { "@type": "City", name: "Fontana" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "06:00",
    closes: "22:00",
  },
  sameAs: ["https://www.linkedin.com/company/micronocinc"],
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Full-service DC fast EV charging",
      description:
        "180kW DC fast charging with full-service attendants and lifestyle delivery. CCS & NACS connectors.",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="icon" href="/images/hubcharge-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/hubcharge-logo.png" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="California" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <ScrollReveal />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
