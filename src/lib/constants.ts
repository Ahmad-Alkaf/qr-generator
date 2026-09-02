export const SITE_NAME = "QRForge";
// Canonical origin. Tracked QR codes embed it, so set NEXT_PUBLIC_SITE_URL
// at build time in production (see Dockerfile).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");
// All KafLabs products share the kaflabs.com contact addresses.
export const SUPPORT_EMAIL = "support@kaflabs.com";
export const PRIVACY_EMAIL = "privacy@kaflabs.com";
export const LEGAL_EMAIL = "legal@kaflabs.com";

// KafLabs is the parent brand. Product footers link to the shared legal pages.
export const KAFLABS_URL = "https://kaflabs.com";
export const KAFLABS_PRIVACY_URL = "https://kaflabs.com/privacy.html";
export const KAFLABS_TERMS_URL = "https://kaflabs.com/terms.html";

export const SITE_DESCRIPTION =
  "Create free QR codes for URLs, Wi-Fi, vCards, and more. Customize colors and track scans with analytics.";

export const QR_TYPE_INFO = {
  URL: {
    label: "URL",
    description: "Link to any website or web page",
    icon: "Link",
    slug: "url",
  },
  WIFI: {
    label: "Wi-Fi",
    description: "Share Wi-Fi network credentials instantly",
    icon: "Wifi",
    slug: "wifi",
  },
  VCARD: {
    label: "vCard",
    description: "Share contact information digitally",
    icon: "Contact",
    slug: "vcard",
  },
  EMAIL: {
    label: "Email",
    description: "Pre-compose an email message",
    icon: "Mail",
    slug: "email",
  },
  SMS: {
    label: "SMS",
    description: "Pre-compose a text message",
    icon: "MessageSquare",
    slug: "sms",
  },
  WHATSAPP: {
    label: "WhatsApp",
    description: "Open a WhatsApp chat with a message",
    icon: "MessageCircle",
    slug: "whatsapp",
  },
  PDF: {
    label: "PDF",
    description: "Link directly to a PDF document",
    icon: "FileText",
    slug: "pdf",
  },
  PLAIN_TEXT: {
    label: "Plain Text",
    description: "Encode any text into a QR code",
    icon: "Type",
    slug: "plain-text",
  },
} as const;
