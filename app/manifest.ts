import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HubCharge — Full-Service EV Fast Charging",
    short_name: "HubCharge",
    description:
      "Full-service DC fast EV charging in California. Stay in your car — we handle the rest.",
    start_url: "/",
    display: "browser",
    background_color: "#0A192F",
    theme_color: "#FF7A00",
    /* Four entries, not one.
       This declared a single 512 with no `purpose`, so Android took an icon
       that already has its own rounded corners and applied its own mask over
       the top — a visible double-round — and downscaled 512 to launcher size
       every time. `maskable` is the same mark inset into the middle 80% on a
       full-bleed square, which is what lets the platform crop to a circle, a
       squircle or a teardrop without clipping a letter.
       All generated from brand/hc-mark.svg by scripts/build-icons.mjs. */
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
