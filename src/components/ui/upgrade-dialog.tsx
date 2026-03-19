"use client";

import { useEffect, useRef } from "react";
import { X, Crown, Check } from "lucide-react";
import NextLink from "next/link";

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  feature: string;
}

const PRO_PERKS = [
  "Download as SVG, PDF & PNG",
  "All 8 QR code types",
  "Up to 50 dynamic QR codes",
  "Full scan analytics",
  "Logo upload & branding",
  "No watermark",
];

export function UpgradeDialog({ open, onClose, feature }: UpgradeDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Crown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 id="upgrade-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Upgrade to Pro
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unlock {feature}
            </p>
          </div>
        </div>

        <ul className="mb-6 space-y-2.5">
          {PRO_PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2.5">
          <NextLink
            href="/pricing"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
            onClick={onClose}
          >
            <Crown className="h-4 w-4" />
            View Plans & Pricing
          </NextLink>
          <button
            onClick={onClose}
            className="w-full rounded-xl px-6 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
