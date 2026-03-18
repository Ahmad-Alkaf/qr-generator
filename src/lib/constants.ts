export const SITE_NAME = "QRForge";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.qrforge.app";
export const SITE_DESCRIPTION =
  "Create free QR codes for URLs, Wi-Fi, vCards, and more. Add your logo, customize colors, and track scans with analytics. No signup required.";

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

export const PLANS = {
  FREE: {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    features: [
      "5 static QR codes per day",
      "URL, Plain Text, Email, SMS types",
      "Basic color customization",
      "PNG download (300x300)",
      "QRForge watermark",
    ],
    limits: {
      qrPerDay: 5,
      qrPerMonth: 10,
      maxSize: 300,
      dynamicQR: false,
      logoUpload: false,
      analytics: false,
      formats: ["png"] as string[],
    },
  },
  PRO: {
    name: "Pro",
    price: { monthly: 9, yearly: 79 },
    features: [
      "Unlimited static QR codes",
      "All QR types",
      "50 dynamic QR codes",
      "Logo upload & full customization",
      "PNG, SVG, PDF downloads (up to 2000x2000)",
      "Scan analytics",
      "No watermark",
      "Bulk generation (CSV)",
      "QR code folders",
    ],
    limits: {
      qrPerDay: Infinity,
      qrPerMonth: Infinity,
      maxSize: 2000,
      dynamicQR: true,
      dynamicQRLimit: 50,
      logoUpload: true,
      analytics: true,
      formats: ["png", "svg", "pdf"] as string[],
    },
  },
  BUSINESS: {
    name: "Business",
    price: { monthly: 29, yearly: 249 },
    features: [
      "Everything in Pro",
      "Unlimited dynamic QR codes",
      "Advanced analytics & A/B testing",
      "Custom short domain",
      "Team members (up to 5)",
      "REST API access",
      "Priority support",
      "White-label exports",
    ],
    limits: {
      qrPerDay: Infinity,
      qrPerMonth: Infinity,
      maxSize: 2000,
      dynamicQR: true,
      dynamicQRLimit: Infinity,
      logoUpload: true,
      analytics: true,
      formats: ["png", "svg", "pdf"] as string[],
    },
  },
} as const;
