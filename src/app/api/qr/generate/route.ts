import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { qrGenerateSchema, buildQRData } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = qrGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      type,
      content,
      foregroundColor,
      backgroundColor,
      size,
      errorCorrection,
      isDirect,
    } = parsed.data;

    // Build the actual content data string
    const destinationData = buildQRData(type, content);

    let qrEncodeData: string;

    if (isDirect) {
      // Direct mode: encode the content directly in the QR code
      qrEncodeData = destinationData;
    } else {
      // Tracked mode: save to DB with a shortCode, encode the redirect URL
      let shortCode = generateShortCode();

      // Ensure uniqueness
      let exists = await prisma.qRCode.findUnique({ where: { shortCode } });
      while (exists) {
        shortCode = generateShortCode();
        exists = await prisma.qRCode.findUnique({ where: { shortCode } });
      }

      await prisma.qRCode.create({
        data: {
          type,
          content,
          foregroundColor,
          backgroundColor,
          errorCorrection,
          size,
          isDirect: false,
          shortCode,
          destinationUrl: destinationData,
          isDynamic: false,
        },
      });

      qrEncodeData = `${SITE_URL}/r/${shortCode}`;
    }

    // Generate QR as PNG buffer
    const qrBuffer = await QRCode.toBuffer(qrEncodeData, {
      width: Math.min(size, 600),
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: errorCorrection,
    });

    const headers: Record<string, string> = {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qrforge-${type.toLowerCase()}.png"`,
    };

    // Only cache direct QR codes (tracked ones are unique per request)
    if (isDirect) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }

    return new NextResponse(new Uint8Array(qrBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
