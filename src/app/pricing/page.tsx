import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro & Business Plans",
  description:
    "Choose the right QR code plan for you. Start free, upgrade to Pro for unlimited QR codes and analytics, or go Business for API access and teams.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-extrabold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 ${
                  key === "PRO"
                    ? "border-primary bg-white shadow-xl ring-2 ring-primary dark:bg-gray-900"
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                {key === "PRO" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h2>
                <div className="mt-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    ${plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  )}
                </div>
                {plan.price.yearly > 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    or ${plan.price.yearly}/year (save{" "}
                    {Math.round(
                      (1 - plan.price.yearly / (plan.price.monthly * 12)) * 100
                    )}
                    %)
                  </p>
                )}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={key === "FREE" ? "/#generator" : "/login"}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors ${
                    key === "PRO"
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {key === "FREE" ? "Get Started Free" : `Choose ${plan.name}`}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
