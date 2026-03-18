"use client";

import { useState, useCallback } from "react";
import { Download, Link as LinkIcon, Loader2, Zap, BarChart3 } from "lucide-react";
import { QRPreview } from "./qr-preview";
import { buildQRData, type QRTypeValue } from "@/lib/qr";
import { cn } from "@/lib/utils";

interface QRGeneratorProps {
  defaultType?: QRTypeValue;
  compact?: boolean;
}

export function QRGenerator({ defaultType = "URL", compact = false }: QRGeneratorProps) {
  const [content, setContent] = useState("");
  const [type] = useState<QRTypeValue>(defaultType);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [isDirect, setIsDirect] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");

  const directData = content ? buildQRData(type, content) : "";
  // For the live preview: Direct shows actual content, Tracked shows a placeholder redirect URL
  const qrData = isDirect
    ? directData
    : content
      ? `${window.location.origin}/r/preview`
      : "";

  const handleDownload = useCallback(async () => {
    if (!content) return;
    setDownloading(true);

    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          content,
          foregroundColor: fgColor,
          backgroundColor: bgColor,
          size: 600,
          errorCorrection,
          isDirect,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to generate QR code");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrforge-${type.toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [type, content, fgColor, bgColor, errorCorrection, isDirect]);

  const placeholder = type === "URL" ? "https://example.com" : "Enter your content...";

  return (
    <div
      id="generator"
      className={cn(
        "grid gap-8",
        compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      )}
    >
      {/* Left: Form */}
      <div className="space-y-5">
        {/* Content input */}
        <div>
          <label
            htmlFor="qr-content"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {type === "URL" ? "Enter URL" : "Content"}
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="qr-content"
              type={type === "URL" ? "url" : "text"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* QR Mode: Direct vs Tracked */}
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
          {!isDirect && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Tracked QR codes redirect through our server, enabling scan analytics and editable destinations.
            </p>
          )}
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
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-700"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
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
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={!content || downloading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {downloading
            ? isDirect
              ? "Generating..."
              : "Creating tracked QR..."
            : "Download PNG"}
        </button>
      </div>

      {/* Right: Preview */}
      <div className="flex items-center justify-center">
        <QRPreview
          value={qrData}
          size={compact ? 200 : 280}
          fgColor={fgColor}
          bgColor={bgColor}
          level={errorCorrection}
        />
      </div>
    </div>
  );
}
