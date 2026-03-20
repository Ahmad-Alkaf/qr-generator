import { SITE_NAME } from './../lib/constants';
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Free QR Code Generator`,
    short_name: SITE_NAME,
    description:
      "Create free QR codes for URLs, Wi-Fi, vCards, and more. Customize colors and track scans with analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C45B28",
    icons: [
      { src: "/logo/icon-72.png", sizes: "72x72", type: "image/png" },
      { src: "/logo/icon-96.png", sizes: "96x96", type: "image/png" },
      { src: "/logo/icon-128.png", sizes: "128x128", type: "image/png" },
      { src: "/logo/icon-144.png", sizes: "144x144", type: "image/png" },
      { src: "/logo/icon-152.png", sizes: "152x152", type: "image/png" },
      { src: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo/icon-384.png", sizes: "384x384", type: "image/png" },
      { src: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
