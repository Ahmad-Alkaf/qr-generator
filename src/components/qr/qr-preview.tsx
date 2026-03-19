"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

export type QRFrameStyle = "plain" | "rounded" | "scan-me" | "bordered";

interface QRPreviewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  frameStyle?: QRFrameStyle;
}

export function QRPreview({
  value,
  size = 256,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  level = "M",
  frameStyle = "plain",
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

  const qr = (
    <QRCodeSVG
      value={value}
      size={size}
      fgColor={fgColor}
      bgColor={bgColor}
      level={level}
      includeMargin={false}
    />
  );

  switch (frameStyle) {
    case "rounded":
      return (
        <div
          className="inline-flex overflow-hidden rounded-3xl bg-white p-5 shadow-xl"
          style={{ backgroundColor: bgColor }}
        >
          <div className="overflow-hidden rounded-2xl">{qr}</div>
        </div>
      );

    case "scan-me":
      return (
        <div className="inline-flex flex-col items-center rounded-2xl bg-white p-4 pb-3 shadow-lg">
          {qr}
          <div
            className="mt-3 w-full rounded-lg px-4 py-1.5 text-center text-sm font-bold tracking-widest uppercase"
            style={{ backgroundColor: fgColor, color: bgColor }}
          >
            Scan Me
          </div>
        </div>
      );

    case "bordered":
      return (
        <div
          className={cn("inline-flex rounded-2xl border-4 p-4 shadow-lg")}
          style={{
            borderColor: fgColor,
            backgroundColor: bgColor,
          }}
        >
          {qr}
        </div>
      );

    case "plain":
    default:
      return (
        <div className="inline-flex rounded-2xl bg-white p-4 shadow-lg">
          {qr}
        </div>
      );
  }
}
