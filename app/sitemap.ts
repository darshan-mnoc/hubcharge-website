import type { MetadataRoute } from "next";
import { stations, statesWithCoverage } from "@/lib/stations";
import { guides } from "@/lib/guides";
import { evMakes } from "@/lib/ev-models";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hubcharge.com";
  const lastModified = new Date();

  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/locations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...stations.map((s) => ({
      url: `${base}/locations/${s.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    /* The state tier. Announced-but-unopened states are listed on purpose: the
       page says plainly that it is not open yet, and that is a better answer
       to "is there a HubCharge in Texas" than a 404. Lower priority than a
       state you can actually charge in. */
    ...statesWithCoverage().map((g) => ({
      url: `${base}/locations/state/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: g.live.length ? 0.8 : 0.5,
    })),
    { url: `${base}/plan-your-charge`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/faq`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/what-to-expect`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/charging-101`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...guides.map((g) => ({
      url: `${base}/charging-101/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: g.slug === "can-my-ev-charge-here" ? 0.7 : 0.6,
    })),
    ...evMakes
      .filter((m) => m.id !== "other")
      .map((m) => ({
        url: `${base}/charging-101/vehicles/${m.id}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    { url: `${base}/accessibility`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
