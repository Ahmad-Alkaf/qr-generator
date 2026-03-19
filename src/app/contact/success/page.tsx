import type { Metadata } from "next";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Message Sent",
  robots: { index: false, follow: false },
};

export default function ContactSuccessPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-lg px-4 text-center sm:px-6 lg:px-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="mt-6 font-heading text-3xl font-extrabold text-gray-900 dark:text-white">
          Message Sent!
        </h1>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Thank you for reaching out. We&apos;ve received your message and will
          get back to you via email soon.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
