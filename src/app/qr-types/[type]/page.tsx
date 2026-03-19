import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { QRGenerator } from "@/components/qr/qr-generator";
import type { QRTypeValue } from "@/lib/qr";

const QR_TYPE_PAGES: Record<
  string,
  {
    qrType: QRTypeValue;
    title: string;
    h1: string;
    description: string;
    content: string;
    faqs: { q: string; a: string }[];
  }
> = {
  url: {
    qrType: "URL",
    title: "URL QR Code Generator — Create Link QR Codes Free",
    h1: "URL QR Code Generator",
    description:
      "Create free QR codes that link to any website or URL. Customize colors, choose Direct or Tracked mode, and download instantly.",
    content:
      "URL QR codes are the most popular type of QR code. Simply paste any web address and our generator will create a scannable QR code that opens the link when scanned. Choose Direct mode for instant access with no redirect, or Tracked mode to monitor how many people scan your code, where they are, and what device they use.",
    faqs: [
      {
        q: "Can I create a QR code for any URL?",
        a: "Yes! You can create a QR code for any valid URL — websites, social media profiles, YouTube videos, Google Forms, app download links, and more.",
      },
      {
        q: "What's the difference between Direct and Tracked URL QR codes?",
        a: "A Direct QR code encodes the URL directly — scanning opens the link instantly with no redirect. A Tracked QR code goes through our server first, allowing us to count scans and collect analytics, and letting you change the destination URL later.",
      },
    ],
  },
  wifi: {
    qrType: "WIFI",
    title: "Wi-Fi QR Code Generator — Share Network Access Instantly",
    h1: "Wi-Fi QR Code Generator",
    description:
      "Create a QR code for your Wi-Fi network. Guests scan to connect automatically — no typing passwords. Works with WPA, WPA2, and WEP.",
    content:
      "Wi-Fi QR codes let your guests connect to your network by simply scanning a code — no need to spell out complicated passwords. Perfect for restaurants, hotels, offices, and home networks. The QR code encodes your network name (SSID), password, and encryption type. Wi-Fi QR codes are best used in Direct mode since they don't link to a URL.",
    faqs: [
      {
        q: "Is it safe to share my Wi-Fi password via QR code?",
        a: "The password is encoded in the QR code image itself. Only people who can scan the physical QR code will get access. For added security, create a separate guest network.",
      },
      {
        q: "Does the Wi-Fi QR code work on both iPhone and Android?",
        a: "Yes! Both iOS (11+) and Android can scan Wi-Fi QR codes natively using the built-in camera app.",
      },
    ],
  },
  vcard: {
    qrType: "VCARD",
    title: "vCard QR Code Generator — Digital Business Card QR Code",
    h1: "vCard QR Code Generator",
    description:
      "Create a QR code that shares your contact information. Recipients scan to save your name, phone, email, and more to their phone contacts.",
    content:
      "vCard QR codes encode your contact information in a standardized format. When someone scans the code, your details are automatically formatted as a contact card that can be saved directly to their phone. Include your name, phone number, email, company, title, website, and address. Great for business cards, name badges, and email signatures.",
    faqs: [
      {
        q: "What information can I include in a vCard QR code?",
        a: "You can include your full name, phone number, email address, company name, job title, website URL, and physical address.",
      },
      {
        q: "Should I use Direct or Tracked mode for vCard QR codes?",
        a: "Direct mode is recommended for vCards since the data is contact information, not a URL. The contact details are encoded directly in the QR code for instant saving.",
      },
    ],
  },
  email: {
    qrType: "EMAIL",
    title: "Email QR Code Generator — Pre-Compose Email Messages",
    h1: "Email QR Code Generator",
    description:
      "Create a QR code that opens an email client with a pre-filled recipient, subject, and body. Perfect for feedback forms and support.",
    content:
      "Email QR codes make it easy for people to send you an email. When scanned, the code opens their default email app with the recipient address, subject line, and message body pre-filled. All they have to do is hit send. Great for customer feedback, event RSVPs, and support requests.",
    faqs: [
      {
        q: "Can I pre-fill the email subject and body?",
        a: "Yes! You can set the recipient email address, subject line, and message body. The person scanning just needs to tap send.",
      },
      {
        q: "Which email apps are supported?",
        a: "Email QR codes use the standard mailto: protocol, which works with any email client — Gmail, Outlook, Apple Mail, and more.",
      },
    ],
  },
  sms: {
    qrType: "SMS",
    title: "SMS QR Code Generator — Pre-Compose Text Messages",
    h1: "SMS QR Code Generator",
    description:
      "Create a QR code that opens a text message with a pre-filled phone number and message. Great for opt-ins and customer support.",
    content:
      "SMS QR codes open the user's messaging app with a phone number and optional message pre-filled. They're perfect for text-to-join campaigns, customer support shortcuts, appointment confirmations, and RSVP systems. The recipient just needs to tap send after scanning.",
    faqs: [
      {
        q: "Can I pre-fill the text message content?",
        a: "Yes! You can set both the phone number and the message body. The person scanning just needs to hit send.",
      },
      {
        q: "Does this work internationally?",
        a: "Yes, use the international format with country code (e.g., +1 for US) to ensure it works globally.",
      },
    ],
  },
  whatsapp: {
    qrType: "WHATSAPP",
    title: "WhatsApp QR Code Generator — Open WhatsApp Chats Instantly",
    h1: "WhatsApp QR Code Generator",
    description:
      "Create a QR code that opens a WhatsApp chat with your number and a pre-filled message. Perfect for customer support and marketing.",
    content:
      "WhatsApp QR codes let people start a conversation with you on WhatsApp instantly. The QR code encodes a link that opens WhatsApp with your phone number and an optional pre-filled message. Ideal for businesses that use WhatsApp for customer support, order inquiries, or appointment booking.",
    faqs: [
      {
        q: "Do I need a WhatsApp Business account?",
        a: "No, WhatsApp QR codes work with both regular WhatsApp and WhatsApp Business accounts.",
      },
      {
        q: "What phone number format should I use?",
        a: "Use the international format without any dashes or plus signs (e.g., 12025551234 for a US number).",
      },
    ],
  },
  pdf: {
    qrType: "PDF",
    title: "PDF QR Code Generator — Link to PDF Documents",
    h1: "PDF QR Code Generator",
    description:
      "Create a QR code that links directly to a PDF document. Perfect for menus, brochures, manuals, and digital documents.",
    content:
      "PDF QR codes link directly to a PDF document hosted online. When scanned, the PDF opens in the user's browser or PDF viewer. Upload your PDF to any hosting service and paste the link — perfect for restaurant menus, event programs, product manuals, and digital brochures. Use Tracked mode to see how many people view your document.",
    faqs: [
      {
        q: "Where should I host my PDF file?",
        a: "You can host your PDF on any file hosting service — Google Drive (with public sharing), Dropbox, your own website, or any cloud storage with a direct download link.",
      },
      {
        q: "Can I update the PDF without changing the QR code?",
        a: "If you use a Tracked QR code, you can change the destination URL to point to an updated PDF without reprinting the QR code.",
      },
    ],
  },
  "plain-text": {
    qrType: "PLAIN_TEXT",
    title: "Plain Text QR Code Generator — Encode Any Text in a QR Code",
    h1: "Plain Text QR Code Generator",
    description:
      "Create a QR code that displays plain text when scanned. Perfect for short messages, serial numbers, codes, and notes.",
    content:
      "Plain Text QR codes encode any text you want — when scanned, the text is displayed directly on the user's device. Use them for short messages, coupon codes, serial numbers, instructions, or any text that doesn't need to be a link. Since the text is embedded directly in the QR code, no internet connection is required to read it.",
    faqs: [
      {
        q: "How much text can a plain text QR code hold?",
        a: "A QR code can hold up to about 4,296 characters of text. However, shorter text produces a simpler, more scannable QR code. We recommend keeping it under 300 characters for best results.",
      },
      {
        q: "Does scanning a plain text QR code require an internet connection?",
        a: "No! The text is encoded directly in the QR code itself, so it can be read entirely offline.",
      },
    ],
  },
};

const ALL_QR_TYPE_SLUGS = Object.keys(QR_TYPE_PAGES);

export async function generateStaticParams() {
  return ALL_QR_TYPE_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const page = QR_TYPE_PAGES[type];
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/qr-types/${type}` },
  };
}

export default async function QRTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const page = QR_TYPE_PAGES[type];
  if (!page) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
              {page.h1}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {page.description}
            </p>
          </div>

          {/* Generator */}
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 dark:border-gray-800 dark:bg-gray-900">
            <QRGenerator defaultType={page.qrType} />
          </div>

          {/* Content */}
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
              About {page.h1.replace(" Generator", "")}s
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {page.content}
            </p>
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-4">
              {page.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
              Other QR Code Types
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {ALL_QR_TYPE_SLUGS.filter((s) => s !== type).map((slug) => {
                const p = QR_TYPE_PAGES[slug];
                return (
                  <Link
                    key={slug}
                    href={`/qr-types/${slug}`}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {p.h1.replace(" QR Code Generator", "")}
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
