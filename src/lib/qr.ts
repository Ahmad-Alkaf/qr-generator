import { z } from "zod";

export const QR_TYPES = [
  "URL",
  "WIFI",
  "VCARD",
  "EMAIL",
  "SMS",
  "WHATSAPP",
  "PDF",
  "PLAIN_TEXT",
] as const;

export type QRTypeValue = (typeof QR_TYPES)[number];

export const qrGenerateSchema = z.object({
  type: z.enum(QR_TYPES),
  content: z.string().min(1, "Content is required").max(4000),
  foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#000000"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#FFFFFF"),
  size: z.number().min(100).max(2000).default(300),
  errorCorrection: z.enum(["L", "M", "Q", "H"]).default("M"),
  // Direct: content encoded directly in QR (fast, no analytics)
  // Tracked: QR points to redirect URL (enables analytics + editable destination)
  isDirect: z.boolean().default(true),
});

export type QRGenerateInput = z.infer<typeof qrGenerateSchema>;

export function buildQRData(type: QRTypeValue, content: string): string {
  switch (type) {
    case "URL":
      return content;
    case "WIFI": {
      try {
        const parsed = JSON.parse(content);
        const ssid = parsed.ssid || "";
        const password = parsed.password || "";
        const encryption = parsed.encryption || "WPA";
        const hidden = parsed.hidden ? "H:true" : "";
        return `WIFI:T:${encryption};S:${ssid};P:${password};${hidden};`;
      } catch {
        return content;
      }
    }
    case "VCARD": {
      try {
        const parsed = JSON.parse(content);
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${parsed.lastName || ""};${parsed.firstName || ""}`,
          `FN:${parsed.firstName || ""} ${parsed.lastName || ""}`,
          parsed.org ? `ORG:${parsed.org}` : "",
          parsed.title ? `TITLE:${parsed.title}` : "",
          parsed.phone ? `TEL:${parsed.phone}` : "",
          parsed.email ? `EMAIL:${parsed.email}` : "",
          parsed.url ? `URL:${parsed.url}` : "",
          parsed.address ? `ADR:;;${parsed.address}` : "",
          "END:VCARD",
        ]
          .filter(Boolean)
          .join("\n");
      } catch {
        return content;
      }
    }
    case "EMAIL": {
      try {
        const parsed = JSON.parse(content);
        const email = parsed.email || content;
        const subject = parsed.subject ? `?subject=${encodeURIComponent(parsed.subject)}` : "";
        const body = parsed.body
          ? `${subject ? "&" : "?"}body=${encodeURIComponent(parsed.body)}`
          : "";
        return `mailto:${email}${subject}${body}`;
      } catch {
        return `mailto:${content}`;
      }
    }
    case "SMS": {
      try {
        const parsed = JSON.parse(content);
        const phone = parsed.phone || content;
        const message = parsed.message ? `:${parsed.message}` : "";
        return `smsto:${phone}${message}`;
      } catch {
        return `smsto:${content}`;
      }
    }
    case "WHATSAPP": {
      try {
        const parsed = JSON.parse(content);
        const phone = parsed.phone || content;
        const message = parsed.message
          ? `?text=${encodeURIComponent(parsed.message)}`
          : "";
        return `https://wa.me/${phone.replace(/[^0-9]/g, "")}${message}`;
      } catch {
        return `https://wa.me/${content.replace(/[^0-9]/g, "")}`;
      }
    }
    case "PDF":
      return content; // URL to PDF
    case "PLAIN_TEXT":
      return content;
    default:
      return content;
  }
}
