import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Mail, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the QRForge team. We're here to help with questions about QR code generation and support.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/contact");
  }

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

        <ContactForm
          defaultName={user?.fullName ?? undefined}
          defaultEmail={user?.emailAddresses[0]?.emailAddress}
        />
      </div>
    </div>
  );
}
