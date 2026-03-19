import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Support QRForge",
  description:
    "QRForge is free for everyone. Support the project to help keep it running.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-900/30">
          <Heart className="h-8 w-8 text-pink-500" />
        </div>

        <h1 className="mt-6 font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
          Support QRForge
        </h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          QRForge is completely free with all features unlocked — no paywalls, no
          limits. If you find it useful, consider supporting the project to help
          cover hosting costs and fund new features.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-left dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
            What you get for free
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li>Unlimited QR codes — all 8 types</li>
            <li>PNG, SVG, and PDF downloads</li>
            <li>Full color customization and frame styles</li>
            <li>Tracked QR codes with scan analytics</li>
            <li>No watermark, no signup required for basic use</li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          A payment portal is coming soon. In the meantime, sharing QRForge with
          others is the best way to support us!
        </p>

        <Link
          href="/#generator"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          Create a QR Code
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
