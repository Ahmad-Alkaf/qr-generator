import {
  Link as LinkIcon,
  Wifi,
  Contact,
  Mail,
  MessageSquare,
  FileText,
  Zap,
  Palette,
  BarChart3,
  Shield,
  ArrowRight,
  Star,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { QRGenerator } from "@/components/qr/qr-generator";

const qrTypes = [
  { icon: LinkIcon, label: "URL", slug: "url", description: "Link to any website" },
  { icon: Wifi, label: "Wi-Fi", slug: "wifi", description: "Share network access" },
  { icon: Contact, label: "vCard", slug: "vcard", description: "Digital business card" },
  { icon: Mail, label: "Email", slug: "email", description: "Pre-compose emails" },
  { icon: MessageSquare, label: "SMS", slug: "sms", description: "Send text messages" },
  { icon: FileText, label: "PDF", slug: "pdf", description: "Link to documents" },
];

const features = [
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create QR codes in seconds. Choose Direct mode for lightning-fast scans or Tracked mode for analytics.",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Customize colors, add your logo, and choose from multiple dot styles to match your brand.",
  },
  {
    icon: BarChart3,
    title: "Scan Analytics",
    description: "Track scans with Tracked QR codes: see location, device, time, and more in real-time.",
  },
  {
    icon: Shield,
    title: "Reliable & Secure",
    description: "Enterprise-grade infrastructure with 99.9% uptime. Your QR codes always work.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    text: "QRForge replaced three different tools we were using. The analytics on tracked QR codes are incredibly detailed.",
  },
  {
    name: "Marcus Johnson",
    role: "Restaurant Owner",
    text: "We use direct QR codes for our menu — customers scan instantly without any redirect delay. Brilliant!",
  },
  {
    name: "Emily Rodriguez",
    role: "Event Planner",
    text: "The ability to choose between direct and tracked QR codes is a game-changer for our events.",
  },
];

const faqs = [
  {
    q: "What is the difference between Direct and Tracked QR codes?",
    a: "Direct QR codes encode your content directly — they're faster to scan because there's no redirect. Tracked QR codes go through our redirect server, which lets us collect scan analytics (location, device, time) and lets you edit the destination URL after printing.",
  },
  {
    q: "Is QRForge really free?",
    a: "Yes! QRForge is completely free with all features unlocked. Create unlimited QR codes, download in any format, and use all QR types at no cost.",
  },
  {
    q: "Can I customize my QR code with colors and a logo?",
    a: "Yes! You can customize foreground and background colors for all QR codes.",
  },
  {
    q: "What QR code types are supported?",
    a: "We support URL, Wi-Fi, vCard (contact), Email, SMS, WhatsApp, PDF, and Plain Text QR codes. All types are available for free.",
  },
  {
    q: "Can I edit a QR code after printing it?",
    a: "Yes — if you create a Tracked QR code, you can change the destination URL at any time without reprinting the physical QR code. Just sign in to use Tracked mode.",
  },
  {
    q: "How do scan analytics work?",
    a: "When someone scans a Tracked QR code, they are briefly redirected through our server, which records the scan event including country, city, device type, browser, and timestamp. Direct QR codes do not have analytics since they don't redirect.",
  },
  {
    q: "What does Error Correction do?",
    a: "QR codes have built-in error correction that lets them scan even when partially damaged or obscured. Low (7%), Medium (15%), Quartile (25%), and High (30%) indicate how much of the code can be lost and still work. Higher levels make the QR denser but more resilient — use High if you plan to add a logo overlay. Note: for short content, lower levels may look identical because the QR encoder automatically upgrades the error correction when there is spare capacity in the grid.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QRForge",
    url: "https://www.qrforge.app",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1200",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/10">
              <Zap className="h-3.5 w-3.5" />
              100% Free — All Features Unlocked
            </div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Create QR Codes
              <br />
              <span className="text-primary">in Seconds</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Generate free QR codes for URLs, Wi-Fi, vCards, and more. Choose{" "}
              <strong>Direct</strong> for instant scans or <strong>Tracked</strong>{" "}
              for scan analytics. Customize colors, download in high quality.
            </p>
          </div>

          {/* Inline QR Generator */}
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 dark:border-gray-800 dark:bg-gray-900">
            <QRGenerator />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                4.8/5 rating
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trusted by <strong className="text-gray-900 dark:text-white">50,000+</strong> users
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">2M+</strong> QR codes created
            </div>
          </div>
        </div>
      </section>

      {/* QR Types Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              QR Codes for Every Use Case
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Generate QR codes for URLs, Wi-Fi, contacts, and more
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {qrTypes.map((qr) => (
              <Link
                key={qr.slug}
                href={`/qr-types/${qr.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                  <qr.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  {qr.label}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {qr.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Three simple steps to create your QR code
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose Your Type",
                description:
                  "Select what kind of QR code you need — URL, Wi-Fi, vCard, or more.",
              },
              {
                step: "2",
                title: "Customize & Choose Mode",
                description:
                  "Set colors, pick Direct mode for speed or Tracked mode for analytics.",
              },
              {
                step: "3",
                title: "Download & Share",
                description:
                  "Download your QR code as PNG, SVG, or PDF. Print it or share it digitally.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Powerful features to create, customize, and track your QR codes
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section id="support" className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
            Support QRForge
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            QRForge is completely free with all features unlocked. If you find it useful, consider supporting the project to help keep it running and growing.
          </p>
          <Link
            href="/support"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Support Me
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Loved by Thousands
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
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
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Ready to Create Your QR Code?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Join 50,000+ users. Start for free — no signup required.
          </p>
          <Link
            href="/#generator"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl"
          >
            Create QR Code Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
