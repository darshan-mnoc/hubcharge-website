import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://hubcharge.com/sitemap.xml",
    host: "https://hubcharge.com",
  };
}
