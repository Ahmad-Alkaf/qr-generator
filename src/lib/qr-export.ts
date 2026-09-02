/**
 * Browser-only helpers that render a QR code to a file and trigger a
 * download. The server never generates images.
 */
import type { QRDotType, QRCornerSquareType, QRCornerDotType } from "./qr";

export type DownloadFormat = "png" | "svg" | "pdf";
export type ErrorCorrection = "L" | "M" | "Q" | "H";

export const EXPORT_SIZE = 600;

export interface RenderOptions {
  data: string;
  format: DownloadFormat;
  fgColor: string;
  bgColor: string;
  errorCorrection: ErrorCorrection;
  dotType: QRDotType;
  cornerSquareType: QRCornerSquareType;
  cornerDotType: QRCornerDotType;
  size?: number;
}

export async function renderQRBlob(options: RenderOptions): Promise<Blob> {
  const { default: QRCodeStyling } = await import("qr-code-styling");
  const size = options.size ?? EXPORT_SIZE;

  const qr = new QRCodeStyling({
    width: size,
    height: size,
    type: options.format === "svg" ? "svg" : "canvas",
    data: options.data,
    margin: 8,
    dotsOptions: { color: options.fgColor, type: options.dotType },
    cornersSquareOptions: { color: options.fgColor, type: options.cornerSquareType },
    cornersDotOptions: { color: options.fgColor, type: options.cornerDotType },
    backgroundOptions: { color: options.bgColor },
    qrOptions: { errorCorrectionLevel: options.errorCorrection },
  });

  if (options.format === "svg") {
    const blob = await qr.getRawData("svg");
    if (!blob) throw new Error("Failed to generate SVG");
    return blob as Blob;
  }

  const png = await qr.getRawData("png");
  if (!png) throw new Error("Failed to generate PNG");
  if (options.format === "png") return png as Blob;

  return createPdfFromPng(png as Blob);
}

async function createPdfFromPng(pngBlob: Blob): Promise<Blob> {
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const padding = 40;
  const pageW = pngImage.width + padding * 2;
  const pageH = pngImage.height + padding * 2;
  const page = pdfDoc.addPage([pageW, pageH]);
  page.drawImage(pngImage, {
    x: padding,
    y: padding,
    width: pngImage.width,
    height: pngImage.height,
  });
  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
