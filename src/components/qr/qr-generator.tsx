"use client";

import { useState, useCallback } from "react";
import {
  Loader2,
  Zap,
  BarChart3,
  LogIn,
  Lock,
  FileImage,
  FileCode2,
  FileText,
  Square,
  Link as LinkIcon,
  Wifi,
  Contact,
  Mail,
  MessageSquare,
  MessageCircle,
  Type,
  Circle,
  RectangleHorizontal,
  Diamond,
  Sparkles,
  Gem,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import NextLink from "next/link";
import {
  QRPreview,
  type QRDotType,
  type QRCornerSquareType,
  type QRCornerDotType,
} from "./qr-preview";
import { QRTypeFields } from "./qr-type-fields";
import { buildQRData, type QRTypeValue } from "@/lib/qr";
import { cn } from "@/lib/utils";

interface QRGeneratorProps {
  defaultType?: QRTypeValue;
  compact?: boolean;
}

const QR_TYPE_OPTIONS: { value: QRTypeValue; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "URL", label: "URL", icon: LinkIcon },
  { value: "WIFI", label: "Wi-Fi", icon: Wifi },
  { value: "VCARD", label: "vCard", icon: Contact },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "SMS", label: "SMS", icon: MessageSquare },
  { value: "WHATSAPP", label: "WhatsApp", icon: MessageCircle },
  { value: "PDF", label: "PDF", icon: FileText },
  { value: "PLAIN_TEXT", label: "Text", icon: Type },
];

const TRACKABLE_TYPES = new Set<QRTypeValue>(["URL", "PDF", "WHATSAPP"]);

const DOT_STYLES: { value: QRDotType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "square", label: "Square", icon: Square },
  { value: "dots", label: "Dots", icon: Circle },
  { value: "rounded", label: "Rounded", icon: RectangleHorizontal },
  { value: "extra-rounded", label: "Smooth", icon: Gem },
  { value: "classy", label: "Classy", icon: Diamond },
  { value: "classy-rounded", label: "Elegant", icon: Sparkles },
];

const CORNER_SQUARE_STYLES: { value: QRCornerSquareType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Rounded" },
];

const CORNER_DOT_STYLES: { value: QRCornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

/* ── Client-side helpers for download ── */

async function createPdfFromPng(pngBlob: Blob): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const padding = 40;
  const pageW = pngImage.width + padding * 2;
  const pageH = pngImage.height + padding * 2;
  const page = pdfDoc.addPage([pageW, pageH]);
  page.drawImage(pngImage, { x: padding, y: padding, width: pngImage.width, height: pngImage.height });
  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Component ── */

export function QRGenerator({ defaultType = "URL", compact = false }: QRGeneratorProps) {
  const { isSignedIn } = useUser();
  const [content, setContent] = useState("");
  const [type, setType] = useState<QRTypeValue>(defaultType);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [transparentBg, setTransparentBg] = useState(false);
  const [isDirect, setIsDirect] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"png" | "svg" | "pdf" | null>(null);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [dotType, setDotType] = useState<QRDotType>("square");
  const [cornerSquareType, setCornerSquareType] = useState<QRCornerSquareType>("square");
  const [cornerDotType, setCornerDotType] = useState<QRCornerDotType>("square");

  const effectiveBgColor = transparentBg ? "transparent" : bgColor;

  // Preview always shows the actual content so users can verify their input.
  // The tracked redirect URL is generated server-side only at download time.
  const qrData = content ? buildQRData(type, content) : "";

  const handleDownload = useCallback(async (format: "png" | "svg" | "pdf") => {
    if (!content || downloadingFormat) return;
    if (!isDirect && !isSignedIn) return;

    setDownloadingFormat(format);

    try {
      let qrDataToEncode: string;

      if (isDirect) {
        qrDataToEncode = buildQRData(type, content);
        // Fire-and-forget save to user account
        if (isSignedIn) {
          fetch("/api/qr/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, content, foregroundColor: fgColor, backgroundColor: bgColor, size: 600, errorCorrection, isDirect: true }),
          }).catch(() => {});
        }
      } else {
        // Tracked: call API to create entry and get redirect URL
        const res = await fetch("/api/qr/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, content, foregroundColor: fgColor, backgroundColor: bgColor, size: 600, errorCorrection, isDirect: false }),
        });
        if (!res.ok) {
          const err = await res.json();
          alert(err.error || "Failed to create tracked QR code");
          return;
        }
        const data = await res.json();
        qrDataToEncode = data.qrData;
      }

      // Generate QR image client-side
      const { default: QRCodeStyling } = await import("qr-code-styling");
      const qrSize = 600;

      const qr = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: format === "svg" ? "svg" : "canvas",
        data: qrDataToEncode,
        margin: 8,
        dotsOptions: { color: fgColor, type: dotType },
        cornersSquareOptions: { color: fgColor, type: cornerSquareType },
        cornersDotOptions: { color: fgColor, type: cornerDotType },
        backgroundOptions: { color: effectiveBgColor },
        qrOptions: { errorCorrectionLevel: errorCorrection },
      });

      const filename = `qrforge-${type.toLowerCase()}`;

      if (format === "svg") {
        const blob = await qr.getRawData("svg");
        if (!blob) throw new Error("Failed to generate SVG");
        downloadBlob(blob as Blob, `${filename}.svg`);
        return;
      }

      // PNG or PDF
      const rawBlob = await qr.getRawData("png");
      if (!rawBlob) throw new Error("Failed to generate PNG");

      if (format === "pdf") {
        const pdfBlob = await createPdfFromPng(rawBlob as Blob);
        downloadBlob(pdfBlob, `${filename}.pdf`);
        return;
      }

      downloadBlob(rawBlob as Blob, `${filename}.png`);
    } catch {
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setDownloadingFormat(null);
    }
  }, [type, content, fgColor, effectiveBgColor, errorCorrection, isDirect, isSignedIn, downloadingFormat, dotType, cornerSquareType, cornerDotType]);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const showSignInPrompt = !isDirect && !isSignedIn;
  const needsLoginForType = type !== "URL" && !isSignedIn;
  const needsLoginForFormat = !isSignedIn;

  return (
    <>
      <div
        id="generator"
        className={cn(
          "grid gap-8",
          compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        )}
      >
        {/* Left: Form */}
        <div className="space-y-5">
          {/* QR Type selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              QR Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QR_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (value !== type) {
                      setType(value);
                      setContent("");
                      if (!TRACKABLE_TYPES.has(value)) setIsDirect(true);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    type === value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Type-specific fields */}
          <QRTypeFields key={type} type={type} onChange={handleContentChange} />

          {/* QR Mode */}
          {TRACKABLE_TYPES.has(type) && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              QR Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDirect(true)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                  isDirect
                    ? "border-primary bg-primary-50 text-primary dark:bg-primary/10"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                )}
              >
                <Zap className="h-4 w-4" />
                <div>
                  <div>Direct</div>
                  <div className="text-xs font-normal opacity-70">Fast, no tracking</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsDirect(false)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                  !isDirect
                    ? "border-primary bg-primary-50 text-primary dark:bg-primary/10"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <div>
                  <div>Tracked</div>
                  <div className="text-xs font-normal opacity-70">Analytics enabled</div>
                </div>
              </button>
            </div>
            {!isDirect && isSignedIn && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Tracked QR codes redirect through our server, enabling scan analytics and editable destinations.
              </p>
            )}
            {showSignInPrompt && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                <LogIn className="h-4 w-4 shrink-0" />
                <span>
                  <NextLink href="/sign-in" className="font-semibold underline hover:no-underline">
                    Sign in
                  </NextLink>{" "}
                  to create Tracked QR codes with analytics.
                </span>
              </div>
            )}
          </div>
          )}

          {/* Dot Style */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dot Style
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {DOT_STYLES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDotType(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2 text-[10px] font-medium transition-all",
                    dotType === value
                      ? "border-primary bg-primary-50 text-primary dark:bg-primary/10"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Corner Square
              </label>
              <div className="flex gap-1.5">
                {CORNER_SQUARE_STYLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCornerSquareType(value)}
                    className={cn(
                      "flex-1 rounded-lg border-2 px-2 py-1.5 text-[10px] font-medium transition-all",
                      cornerSquareType === value
                        ? "border-primary bg-primary-50 text-primary dark:bg-primary/10"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Corner Dot
              </label>
              <div className="flex gap-1.5">
                {CORNER_DOT_STYLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCornerDotType(value)}
                    className={cn(
                      "flex-1 rounded-lg border-2 px-2 py-1.5 text-[10px] font-medium transition-all",
                      cornerDotType === value
                        ? "border-primary bg-primary-50 text-primary dark:bg-primary/10"
                        : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fg-color"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Foreground
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="bg-color"
                className="mb-1.5 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Background
                <button
                  type="button"
                  onClick={() => setTransparentBg(!transparentBg)}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-all",
                    transparentBg
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  )}
                >
                  Transparent
                </button>
              </label>
              <div className={cn("flex items-center gap-2", transparentBg && "pointer-events-none opacity-40")}>
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  disabled={transparentBg}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={transparentBg ? "transparent" : bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  disabled={transparentBg}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Error Correction */}
          <div>
            <label
              htmlFor="error-correction"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Error Correction
            </label>
            <select
              id="error-correction"
              value={errorCorrection}
              onChange={(e) =>
                setErrorCorrection(e.target.value as "L" | "M" | "Q" | "H")
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              How much of the QR code can be damaged and still scan. Higher
              levels make the code denser but more resilient. Use High if
              you&apos;re adding a logo overlay.
            </p>
          </div>

          {/* Download buttons */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Download
            </label>
            {showSignInPrompt ? (
              <NextLink
                href="/sign-in"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
              >
                <LogIn className="h-4 w-4" />
                Sign in to Create Tracked QR Code
              </NextLink>
            ) : needsLoginForType ? (
              <NextLink
                href="/sign-in"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark"
              >
                <LogIn className="h-4 w-4" />
                Sign in to Download
              </NextLink>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {([
                  {
                    format: "png" as const,
                    label: "PNG",
                    sub: "Raster",
                    icon: FileImage,
                    locked: false,
                    bg: "bg-amber-600/20 hover:bg-amber-600/30 dark:bg-amber-500/15 dark:hover:bg-amber-500/25",
                    activeBg: "bg-amber-600/30 dark:bg-amber-500/25",
                  },
                  {
                    format: "svg" as const,
                    label: "SVG",
                    sub: "Vector",
                    icon: FileCode2,
                    locked: needsLoginForFormat,
                    bg: "bg-emerald-600/20 hover:bg-emerald-600/30 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25",
                    activeBg: "bg-emerald-600/30 dark:bg-emerald-500/25",
                  },
                  {
                    format: "pdf" as const,
                    label: "PDF",
                    sub: "Print",
                    icon: FileText,
                    locked: needsLoginForFormat,
                    bg: "bg-rose-600/20 hover:bg-rose-600/30 dark:bg-rose-500/15 dark:hover:bg-rose-500/25",
                    activeBg: "bg-rose-600/30 dark:bg-rose-500/25",
                  },
                ] as const).map(({ format, label, sub, icon: Icon, locked, bg, activeBg }) => {
                  const isActive = downloadingFormat === format;
                  const isDisabled = !content || !!downloadingFormat;

                  if (locked) {
                    return (
                      <NextLink
                        key={format}
                        href="/sign-in"
                        className="group flex flex-col items-center gap-2 rounded-xl bg-gray-200 px-4 py-4 text-center opacity-50 transition-all hover:opacity-70 dark:bg-gray-800"
                      >
                        <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div>
                          <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">{sub}</div>
                        </div>
                      </NextLink>
                    );
                  }

                  return (
                    <button
                      key={format}
                      onClick={() => handleDownload(format)}
                      disabled={isDisabled}
                      className={cn(
                        "group flex flex-col items-center gap-2 rounded-xl px-4 py-4 text-center shadow-sm transition-all duration-200",
                        "disabled:cursor-not-allowed disabled:opacity-40",
                        !isDisabled && "active:scale-[0.97] hover:shadow-md",
                        isActive ? activeBg : bg
                      )}
                    >
                      {isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-700 dark:text-gray-200" />
                      ) : (
                        <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex items-center justify-center">
          <QRPreview
            value={qrData}
            size={compact ? 200 : 280}
            fgColor={fgColor}
            bgColor={effectiveBgColor}
            level={errorCorrection}
            dotType={dotType}
            cornerSquareType={cornerSquareType}
            cornerDotType={cornerDotType}
          />
        </div>
      </div>
    </>
  );
}
