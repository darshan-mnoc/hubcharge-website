import type { MetadataRoute } from "next";
import { stations } from "@/lib/stations";
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
    { url: `${base}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/faq`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/what-to-expect`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
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
