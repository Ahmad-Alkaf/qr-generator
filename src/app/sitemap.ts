import { SITE_URL } from "@/lib/constants";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const qrTypes = ["url", "wifi", "vcard", "email", "sms", "whatsapp", "pdf", "plain-text"];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const qrTypePages: MetadataRoute.Sitemap = qrTypes.map((type) => ({
    url: `${SITE_URL}/qr-types/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...qrTypePages];
}
