import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "HubCharge | Fastest EV Charging Stations Near You | DC Fast Charger",
  description:
    "Find the fastest EV charging stations near you. 180kW DC fast charging in 10 minutes for $12.50. Tesla, BMW, Mercedes, Ford, Rivian compatible. Premium valet service. CCS & NACS connectors. Open 24/7 in California.",
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
  ],
  authors: [{ name: "HubCharge" }],
  openGraph: {
    title: "HubCharge | Fastest EV Charging Stations | 10 Min = 75+ Miles",
    description:
      "180kW DC fast charging. 10 minutes. 75+ miles. $12.50 flat rate. Find EV chargers near you. Tesla, BMW, Ford & all EVs.",
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
    title: "HubCharge | Fastest EV Charging | 10 Min = 75+ Miles",
    description:
      "180kW DC fast charging. $12.50 flat rate. Find fast chargers near you.",
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
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
};

// Structured data for local business (Google Maps visibility)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HubCharge",
  description: "Premium DC fast EV charging stations with valet service",
  url: "https://hubcharge.com",
  telephone: "+1-800-HUBCHARGE",
  priceRange: "$12.50-$24.50",
  image: "https://hubcharge.com/images/hubcharge-logo.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  sameAs: [
    "https://twitter.com/hubcharge",
    "https://instagram.com/hubcharge",
    "https://linkedin.com/company/hubcharge",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "12000",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "EV Charging Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "10-Minute DC Fast Charge",
          description: "180kW DC fast charging with valet service",
        },
        price: "12.50",
        priceCurrency: "USD",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
