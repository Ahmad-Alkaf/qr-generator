import Link from "next/link";
import Image from "next/image";

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
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <Image src="/logo/symbol.svg" alt="QRForge" width={22} height={22} />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                <span className="text-primary">QR</span>
                <span className="text-gray-900 dark:text-white">Forge</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Create, customize, and track QR codes. Free for everyone.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} QRForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
