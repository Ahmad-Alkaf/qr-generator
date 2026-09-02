import type { QRTypeValue } from "@/lib/qr";

/**
 * Editorial content for the /qr-types/[slug] landing pages.
 *
 * One source of truth so the pages, the sitemap, the hub page, and the
 * llms.txt files all describe the same things in the same words. Keep the
 * wording factual and self-contained: search engines and AI assistants quote
 * these sentences directly.
 */
export type QRTypeFaq = { q: string; a: string };

export type QRTypePage = {
  slug: string;
  qrType: QRTypeValue;
  /** Short label used in navigation and lists. */
  label: string;
  /** <title> without the site suffix. */
  title: string;
  h1: string;
  /** Meta description, under 160 characters. */
  description: string;
  /** Search phrases this page targets. */
  keywords: string[];
  /** One-sentence definition. Used as the lead sentence and in llms.txt. */
  definition: string;
  /** Longer explanation paragraph. */
  content: string;
  /** Concrete situations where this type is the right choice. */
  useCases: string[];
  /** Ordered steps to create this type of QR code on QR Anvil. */
  steps: string[];
  faqs: QRTypeFaq[];
};

export const QR_TYPE_PAGES: Record<string, QRTypePage> = {
  url: {
    slug: "url",
    qrType: "URL",
    label: "URL",
    title: "URL QR Code Generator — Create Link QR Codes Free",
    h1: "URL QR Code Generator",
    description:
      "Create free QR codes that link to any website or URL. Customize colors, choose Direct or Tracked mode, and download as PNG, SVG, or PDF.",
    keywords: [
      "URL QR code generator",
      "QR code for website",
      "link QR code",
      "QR code for link free",
      "website QR code",
    ],
    definition:
      "A URL QR code is a QR code that opens a web address when it is scanned with a phone camera.",
    content:
      "URL QR codes are the most popular type of QR code. Paste any web address and QR Anvil creates a scannable QR code that opens the link when scanned. Choose Direct mode for instant access with no redirect, or Tracked mode to count scans, see where and on which devices they happen, and change the destination after the code is printed.",
    useCases: [
      "Posters, flyers, and business cards that link to a website",
      "Product packaging that opens a product page or manual",
      "Social media profiles, YouTube videos, and app store listings",
      "Google Forms, surveys, and event registration pages",
    ],
    steps: [
      "Paste the full web address, including https://, into the URL field.",
      "Pick Direct mode for the fastest scan, or Tracked mode for scan analytics and an editable destination.",
      "Adjust the colors and dot style, then download the QR code as PNG, SVG, or PDF.",
    ],
    faqs: [
      {
        q: "Can I create a QR code for any URL?",
        a: "Yes. You can create a QR code for any valid URL: websites, social media profiles, YouTube videos, Google Forms, app download links, and more.",
      },
      {
        q: "What is the difference between Direct and Tracked URL QR codes?",
        a: "A Direct QR code encodes the URL itself, so scanning opens the link instantly with no redirect. A Tracked QR code encodes a short QR Anvil redirect link, which lets QR Anvil count scans, record location and device data, and lets you change the destination URL later without reprinting.",
      },
      {
        q: "Do URL QR codes expire?",
        a: "Direct URL QR codes never expire because the address is stored in the image itself. Tracked QR codes keep working as long as the code exists in your QR Anvil dashboard.",
      },
    ],
  },
  wifi: {
    slug: "wifi",
    qrType: "WIFI",
    label: "Wi-Fi",
    title: "Wi-Fi QR Code Generator — Share Network Access Instantly",
    h1: "Wi-Fi QR Code Generator",
    description:
      "Create a QR code for your Wi-Fi network. Guests scan to connect automatically without typing a password. Works with WPA, WPA2, and WEP.",
    keywords: [
      "Wi-Fi QR code generator",
      "WiFi QR code",
      "QR code for Wi-Fi password",
      "share Wi-Fi with QR code",
      "guest Wi-Fi QR code",
    ],
    definition:
      "A Wi-Fi QR code is a QR code that stores a network name, password, and security type so a phone can join the network by scanning it.",
    content:
      "Wi-Fi QR codes let guests connect to your network by scanning a code instead of typing a long password. They are ideal for restaurants, hotels, offices, Airbnb rentals, and home networks. The QR code encodes the network name (SSID), the password, and the encryption type using the standard WIFI: format that iOS and Android understand natively. Wi-Fi QR codes use Direct mode because the credentials are stored in the image itself and do not need a redirect.",
    useCases: [
      "Table cards and menus in cafés and restaurants",
      "Guest rooms in hotels and short-term rentals",
      "Office reception desks and meeting rooms",
      "Home networks for visitors and family",
    ],
    steps: [
      "Enter the network name (SSID) exactly as it appears in your Wi-Fi settings.",
      "Enter the password and select the security type: WPA/WPA2, WEP, or none for open networks.",
      "Customize the design, download the QR code, and print it where guests can scan it.",
    ],
    faqs: [
      {
        q: "Is it safe to share my Wi-Fi password with a QR code?",
        a: "The password is stored in the QR code image itself and never sent to QR Anvil. Only people who can scan the physical QR code get access. For extra safety, create a separate guest network and make a QR code for that network.",
      },
      {
        q: "Does a Wi-Fi QR code work on both iPhone and Android?",
        a: "Yes. iOS 11 and later and all modern Android versions can read Wi-Fi QR codes with the built-in camera app and offer to join the network.",
      },
      {
        q: "Can I change the password after I print the Wi-Fi QR code?",
        a: "No. The password is part of the image, so a new password needs a new QR code. Print a new code whenever the network password changes.",
      },
    ],
  },
  vcard: {
    slug: "vcard",
    qrType: "VCARD",
    label: "vCard",
    title: "vCard QR Code Generator — Digital Business Card QR Code",
    h1: "vCard QR Code Generator",
    description:
      "Create a QR code that shares your contact details. Recipients scan to save your name, phone, email, company, and website to their phone contacts.",
    keywords: [
      "vCard QR code generator",
      "contact QR code",
      "business card QR code",
      "QR code for contact information",
      "digital business card QR code",
    ],
    definition:
      "A vCard QR code is a QR code that contains a contact card in the vCard format, so a phone can save the contact when it scans the code.",
    content:
      "vCard QR codes encode contact information in the standard vCard 3.0 format. When someone scans the code, the details appear as a contact card that can be saved to their phone address book in one tap. Include your name, phone number, email, company, job title, website, and address. vCard QR codes are common on business cards, name badges, email signatures, and conference slides.",
    useCases: [
      "Printed business cards and name badges",
      "Email signatures and presentation closing slides",
      "Storefront windows and reception desks",
      "Real estate signs and service vehicles",
    ],
    steps: [
      "Fill in the contact fields you want to share: name, phone, email, company, title, website, and address.",
      "Keep the QR code in Direct mode so the contact card is saved instantly, even offline.",
      "Choose a high error correction level if you plan to print the code small, then download it.",
    ],
    faqs: [
      {
        q: "What information can I include in a vCard QR code?",
        a: "You can include a full name, phone number, email address, company name, job title, website URL, and postal address.",
      },
      {
        q: "Should I use Direct or Tracked mode for a vCard QR code?",
        a: "Use Direct mode. The contact details are stored in the QR code itself, so the phone can save them instantly without an internet connection.",
      },
      {
        q: "Does a vCard QR code work without an internet connection?",
        a: "Yes. The contact card is encoded in the image, so the phone can read and save it offline.",
      },
    ],
  },
  email: {
    slug: "email",
    qrType: "EMAIL",
    label: "Email",
    title: "Email QR Code Generator — Pre-Compose Email Messages",
    h1: "Email QR Code Generator",
    description:
      "Create a QR code that opens an email app with the recipient, subject, and body pre-filled. Useful for feedback, support, and RSVP forms.",
    keywords: [
      "email QR code generator",
      "mailto QR code",
      "QR code for email address",
      "QR code to send email",
    ],
    definition:
      "An email QR code is a QR code that opens the phone's email app with the recipient address, subject, and message already filled in.",
    content:
      "Email QR codes make it simple for people to contact you. When scanned, the code opens the default email app with the recipient address, subject line, and message body pre-filled. The person only needs to tap send. Email QR codes use the standard mailto: link format, so they work with Gmail, Outlook, Apple Mail, and every other email client.",
    useCases: [
      "Customer feedback requests on receipts and packaging",
      "Support contact points on product manuals",
      "Event invitations that collect RSVPs by email",
      "Job postings and press kits with a ready-to-send inquiry",
    ],
    steps: [
      "Enter the recipient email address.",
      "Add an optional subject line and message body so the sender does not need to type anything.",
      "Download the QR code and place it where people are likely to contact you.",
    ],
    faqs: [
      {
        q: "Can I pre-fill the email subject and body?",
        a: "Yes. You can set the recipient address, the subject line, and the message body. The person scanning the code only needs to tap send.",
      },
      {
        q: "Which email apps are supported?",
        a: "Email QR codes use the standard mailto: protocol, which works with any email client, including Gmail, Outlook, Apple Mail, and Yahoo Mail.",
      },
    ],
  },
  sms: {
    slug: "sms",
    qrType: "SMS",
    label: "SMS",
    title: "SMS QR Code Generator — Pre-Compose Text Messages",
    h1: "SMS QR Code Generator",
    description:
      "Create a QR code that opens a text message with a pre-filled phone number and message. Good for text-to-join campaigns and customer support.",
    keywords: [
      "SMS QR code generator",
      "text message QR code",
      "QR code to send SMS",
      "text to join QR code",
    ],
    definition:
      "An SMS QR code is a QR code that opens the phone's messaging app with a phone number and an optional message already filled in.",
    content:
      "SMS QR codes open the messaging app with a phone number and an optional message pre-filled. They are useful for text-to-join campaigns, customer support shortcuts, appointment confirmations, and RSVP systems. The person only needs to tap send after scanning. SMS QR codes use the standard smsto: format that iOS and Android both support.",
    useCases: [
      "Text-to-join marketing lists on posters and packaging",
      "Support lines printed on invoices and delivery notes",
      "Appointment confirmations and reminders",
      "Contest entries and voting by text",
    ],
    steps: [
      "Enter the phone number in international format, for example +1 555 123 4567.",
      "Add an optional message, such as a keyword for a text-to-join campaign.",
      "Download the QR code and add it to your print or digital material.",
    ],
    faqs: [
      {
        q: "Can I pre-fill the text message content?",
        a: "Yes. You can set both the phone number and the message body. The person scanning only needs to tap send.",
      },
      {
        q: "Does an SMS QR code work internationally?",
        a: "Yes. Use the international format with the country code, for example +1 for the United States or +44 for the United Kingdom, so the number works from any country.",
      },
    ],
  },
  whatsapp: {
    slug: "whatsapp",
    qrType: "WHATSAPP",
    label: "WhatsApp",
    title: "WhatsApp QR Code Generator — Open WhatsApp Chats Instantly",
    h1: "WhatsApp QR Code Generator",
    description:
      "Create a QR code that opens a WhatsApp chat with your number and a pre-filled message. Useful for customer support, orders, and marketing.",
    keywords: [
      "WhatsApp QR code generator",
      "QR code for WhatsApp number",
      "WhatsApp chat QR code",
      "click to chat QR code",
    ],
    definition:
      "A WhatsApp QR code is a QR code that opens a WhatsApp chat with a specific phone number, optionally with a pre-written message.",
    content:
      "WhatsApp QR codes let people start a conversation with you on WhatsApp instantly. The QR code encodes a wa.me click-to-chat link with your phone number and an optional pre-filled message. They are ideal for businesses that use WhatsApp for customer support, order inquiries, and appointment booking. WhatsApp QR codes work with both regular WhatsApp and WhatsApp Business accounts.",
    useCases: [
      "Customer support contact on websites and packaging",
      "Order and reservation requests for restaurants and shops",
      "Lead capture on trade show banners",
      "Appointment booking for clinics, salons, and services",
    ],
    steps: [
      "Enter your WhatsApp phone number with the country code.",
      "Add an optional message so the customer only needs to tap send.",
      "Download the QR code and share it in print or online.",
    ],
    faqs: [
      {
        q: "Do I need a WhatsApp Business account?",
        a: "No. WhatsApp QR codes work with both regular WhatsApp and WhatsApp Business accounts.",
      },
      {
        q: "What phone number format should I use?",
        a: "Include your country code, for example +1 for the United States or +44 for the United Kingdom. Dashes and spaces are removed automatically.",
      },
    ],
  },
  pdf: {
    slug: "pdf",
    qrType: "PDF",
    label: "PDF",
    title: "PDF QR Code Generator — Link to PDF Documents",
    h1: "PDF QR Code Generator",
    description:
      "Create a QR code that opens a PDF document. Ideal for restaurant menus, brochures, manuals, and event programs. Track views with Tracked mode.",
    keywords: [
      "PDF QR code generator",
      "QR code for PDF",
      "QR code menu PDF",
      "QR code for document",
    ],
    definition:
      "A PDF QR code is a QR code that opens a PDF document hosted online when it is scanned.",
    content:
      "PDF QR codes link to a PDF document hosted online. When scanned, the PDF opens in the phone's browser or PDF viewer. Upload the PDF to any hosting service, paste the link, and QR Anvil creates the code. PDF QR codes are common for restaurant menus, event programs, product manuals, and digital brochures. Use Tracked mode to count how many people open the document and to swap the file later without reprinting.",
    useCases: [
      "Contactless restaurant and café menus",
      "Product manuals and safety data sheets on packaging",
      "Event programs, schedules, and floor plans",
      "Brochures and price lists for real estate and retail",
    ],
    steps: [
      "Upload the PDF to a hosting service such as Google Drive, Dropbox, or your own website and copy the public link.",
      "Paste the link into the PDF field and choose Tracked mode if you want view counts and the ability to replace the file later.",
      "Download the QR code and print it on the menu, package, or brochure.",
    ],
    faqs: [
      {
        q: "Where should I host my PDF file?",
        a: "You can host the PDF on any service that gives a public link: Google Drive with sharing enabled, Dropbox, OneDrive, your own website, or any cloud storage with a direct link.",
      },
      {
        q: "Can I update the PDF without changing the QR code?",
        a: "Yes, if you use a Tracked QR code. You can change the destination URL to a new PDF at any time, and the printed QR code keeps working.",
      },
    ],
  },
  "plain-text": {
    slug: "plain-text",
    qrType: "PLAIN_TEXT",
    label: "Plain Text",
    title: "Plain Text QR Code Generator — Encode Any Text in a QR Code",
    h1: "Plain Text QR Code Generator",
    description:
      "Create a QR code that shows plain text when scanned. Works offline. Ideal for short messages, serial numbers, coupon codes, and notes.",
    keywords: [
      "text QR code generator",
      "plain text QR code",
      "QR code for text message",
      "offline QR code",
    ],
    definition:
      "A plain text QR code is a QR code that displays a piece of text when it is scanned, with no link and no internet connection required.",
    content:
      "Plain text QR codes encode any text. When scanned, the text appears directly on the phone screen. Use them for short messages, coupon codes, serial numbers, asset tags, instructions, or any text that does not need to be a link. Because the text is stored in the image itself, the code can be read fully offline.",
    useCases: [
      "Serial numbers and asset tags for inventory",
      "Coupon and voucher codes",
      "Short instructions on equipment and machinery",
      "Scavenger hunts, classroom activities, and puzzles",
    ],
    steps: [
      "Type or paste the text you want to encode. Shorter text produces a simpler, easier-to-scan code.",
      "Pick the colors and dot style.",
      "Download the QR code. The text is stored in the image, so no account or server is involved.",
    ],
    faqs: [
      {
        q: "How much text can a plain text QR code hold?",
        a: "A QR code can hold up to 4,296 alphanumeric characters. Shorter text produces a simpler, more reliable QR code. Keep it under 300 characters for the best scan results.",
      },
      {
        q: "Does scanning a plain text QR code require an internet connection?",
        a: "No. The text is encoded in the QR code itself, so it can be read fully offline.",
      },
    ],
  },
};

export const QR_TYPE_SLUGS = Object.keys(QR_TYPE_PAGES);

export const QR_TYPE_PAGE_LIST = QR_TYPE_SLUGS.map((slug) => QR_TYPE_PAGES[slug]);
