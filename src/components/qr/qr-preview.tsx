"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRPreviewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: "L" | "M" | "Q" | "H";
}

export function QRPreview({
  value,
  size = 256,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  level = "M",
}: QRPreviewProps) {
  if (!value) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
        style={{ width: size, height: size }}
      >
        <p className="px-4 text-center text-sm text-gray-400 dark:text-gray-500">
          Enter content to generate QR code
        </p>
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-2xl bg-white p-4 shadow-lg">
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        level={level}
        includeMargin={false}
      />
    </div>
  );
}
