export const SITE_NAME = "QRForge";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.qrforge.app";
export const SITE_DESCRIPTION =
  "Create free QR codes for URLs, Wi-Fi, vCards, and more. Customize colors and track scans with analytics. No signup required.";

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
