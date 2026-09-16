import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* /dev/* is scaffolding — the cover style-test variants and a bare map
         harness. It builds and deploys with everything else, so without this
         it is a public, crawlable part of the site: "hubcharge.com/dev/map"
         is the kind of URL that ends up in a search result. Excluded here
         rather than deleted, because the three cover directions still need
         reviewing; delete the routes and this line goes with them. */
      disallow: "/dev/",
    },
    sitemap: "https://hubcharge.com/sitemap.xml",
    host: "https://hubcharge.com",
  };
}
