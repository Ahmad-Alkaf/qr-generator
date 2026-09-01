import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, KAFLABS_URL, KAFLABS_PRIVACY_URL, KAFLABS_TERMS_URL } from "@/lib/constants";

const footerLinks = {
  Product: [
    { href: "/qr-types/url", label: "URL QR Code" },
    { href: "/qr-types/wifi", label: "Wi-Fi QR Code" },
    { href: "/qr-types/vcard", label: "vCard QR Code" },
    { href: "/qr-types/email", label: "Email QR Code" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/support", label: "Support Me" },
  ],
};

const legalLinks = [
  { href: KAFLABS_PRIVACY_URL, label: "Privacy Policy" },
  { href: KAFLABS_TERMS_URL, label: "Terms of Service" },
];

const linkClass =
  "text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Image src="/logo/symbol.svg" alt={SITE_NAME} width={22} height={22} />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                <span className="text-primary">QR</span>
                <span className="text-gray-900 dark:text-white">Forge</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Create, customize, and track QR codes. Free for everyone.
            </p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              A{" "}
              <a
                href={KAFLABS_URL}
                target="_blank"
                rel="noopener"
                className="underline decoration-gray-400/40 underline-offset-2 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                KafLabs
              </a>{" "}
              product
            </p>
          </div>

          {/* Internal links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal (shared KafLabs pages) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={KAFLABS_URL}
              target="_blank"
              rel="noopener"
              className="transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              KafLabs LLC
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
