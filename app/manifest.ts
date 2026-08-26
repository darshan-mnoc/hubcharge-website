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
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
