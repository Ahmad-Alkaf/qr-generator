"use client";

import { useEffect, useRef, useState } from "react";

export type QRDotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type QRCornerSquareType = "square" | "dot" | "extra-rounded";
export type QRCornerDotType = "square" | "dot";

interface QRPreviewProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  dotType?: QRDotType;
  cornerSquareType?: QRCornerSquareType;
  cornerDotType?: QRCornerDotType;
}

export function QRPreview({
  value,
  size = 256,
  fgColor = "#000000",
  bgColor = "#FFFFFF",
  level = "M",
  dotType = "square",
  cornerSquareType = "square",
  cornerDotType = "square",
}: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [QRStyling, setQRStyling] = useState<any>(null);

  useEffect(() => {
    import("qr-code-styling").then((mod) => setQRStyling(() => mod.default));
  }, []);

  useEffect(() => {
    if (!QRStyling || !containerRef.current || !value) {
      if (containerRef.current) containerRef.current.innerHTML = "";
      return;
    }

    const qr = new QRStyling({
      width: size,
      height: size,
      type: "svg",
      data: value,
      margin: 4,
      dotsOptions: { color: fgColor, type: dotType },
      cornersSquareOptions: { color: fgColor, type: cornerSquareType },
      cornersDotOptions: { color: fgColor, type: cornerDotType },
      backgroundOptions: { color: bgColor },
      qrOptions: { errorCorrectionLevel: level },
    });

    containerRef.current.innerHTML = "";
    qr.append(containerRef.current);
  }, [QRStyling, value, size, fgColor, bgColor, level, dotType, cornerSquareType, cornerDotType]);

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
    <div
      className="inline-flex rounded-2xl p-4 shadow-lg"
      style={{ backgroundColor: bgColor === "transparent" ? "transparent" : bgColor }}
    >
      <div ref={containerRef} style={{ width: size, height: size }} />
    </div>
  );
}
