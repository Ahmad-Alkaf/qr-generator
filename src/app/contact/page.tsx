import type { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the QRForge team. We're here to help with questions about QR code generation, pricing, and support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <Mail className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Email
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                support@qrforge.app
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <MessageSquare className="mt-0.5 h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Live Chat
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available Mon–Fri, 9am–5pm EST
              </p>
            </div>
          </div>
        </div>

        <form className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Tell us more..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
