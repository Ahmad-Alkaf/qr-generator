import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QRForge — Free QR Code Generator",
    short_name: "QRForge",
    description:
      "Create free QR codes for URLs, Wi-Fi, vCards, and more. Customize colors, add logos, and track scans.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#C45B28",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
