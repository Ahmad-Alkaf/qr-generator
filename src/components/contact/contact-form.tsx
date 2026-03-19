"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactForm({
  defaultName,
  defaultEmail,
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "Something went wrong";
        try {
          message = JSON.parse(text).error || message;
        } catch { /* non-JSON response */ }
        throw new Error(message);
      }

      router.push("/contact/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

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
            name="name"
            type="text"
            readOnly
            value={defaultName}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
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
            name="email"
            type="email"
            readOnly
            value={defaultEmail}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
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
          name="subject"
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
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Tell us more..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
