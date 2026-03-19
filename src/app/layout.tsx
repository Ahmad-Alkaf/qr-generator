import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.qrforge.app"
  ),
  title: {
    default: "Free QR Code Generator — Create Custom QR Codes Instantly | QRForge",
    template: "%s | QRForge",
  },
  description:
    "Create free QR codes for URLs, Wi-Fi, vCards, and more. Add your logo, customize colors, and track scans with analytics. No signup required.",
  keywords: [
    "QR code generator",
    "create QR code",
    "QR code with logo",
    "free QR code",
    "dynamic QR code",
    "QR code maker",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "QRForge",
    title: "Free QR Code Generator — Create Custom QR Codes Instantly",
    description:
      "Create, customize, and track QR codes. Free forever for basic use.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator",
    description: "Create, customize, and track QR codes.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark ${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider appearance={{ theme: dark }}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
