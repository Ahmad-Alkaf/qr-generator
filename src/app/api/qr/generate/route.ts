import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { qrGenerateSchema, buildQRData } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type FrameStyle = "plain" | "rounded" | "scan-me" | "bordered";

function applyFrameToSvg(
  innerSvg: string,
  frameStyle: FrameStyle,
  fgColor: string,
  bgColor: string,
  qrSize: number,
): string {
  function positionQR(x: number, y: number): string {
    return innerSvg
      .replace(/<svg\b/, `<svg x="${x}" y="${y}"`)
      .replace(/width="[^"]*"/, `width="${qrSize}"`)
      .replace(/height="[^"]*"/, `height="${qrSize}"`);
  }

  const pad = 16;

  switch (frameStyle) {
    case "rounded": {
      const rPad = 20;
      const total = qrSize + rPad * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">
  <rect width="${total}" height="${total}" rx="24" fill="${bgColor}"/>
  <defs><clipPath id="rc"><rect x="${rPad}" y="${rPad}" width="${qrSize}" height="${qrSize}" rx="16"/></clipPath></defs>
  <g clip-path="url(#rc)">${positionQR(rPad, rPad)}</g>
</svg>`;
    }

    case "scan-me": {
      const bannerH = 40;
      const gap = 12;
      const totalW = qrSize + pad * 2;
      const totalH = qrSize + pad + gap + bannerH + pad;
      const bannerY = pad + qrSize + gap;
      const fontSize = Math.max(12, Math.round(qrSize * 0.023));
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <rect width="${totalW}" height="${totalH}" rx="16" fill="${bgColor}"/>
  ${positionQR(pad, pad)}
  <rect x="${pad}" y="${bannerY}" width="${qrSize}" height="${bannerH}" rx="8" fill="${fgColor}"/>
  <text x="${totalW / 2}" y="${bannerY + bannerH / 2 + fontSize * 0.35}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="${fontSize}" letter-spacing="${fontSize * 0.25}" fill="${bgColor}">SCAN ME</text>
</svg>`;
    }

    case "bordered": {
      const border = 4;
      const total = qrSize + (pad + border) * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">
  <rect width="${total}" height="${total}" rx="16" fill="${fgColor}"/>
  <rect x="${border}" y="${border}" width="${total - border * 2}" height="${total - border * 2}" rx="12" fill="${bgColor}"/>
  ${positionQR(pad + border, pad + border)}
</svg>`;
    }

    case "plain":
    default: {
      const total = qrSize + pad * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">
  <rect width="${total}" height="${total}" rx="16" fill="${bgColor}"/>
  ${positionQR(pad, pad)}
</svg>`;
    }
  }
}

async function buildQRResponse(
  qrData: string,
  format: "png" | "svg" | "pdf",
  opts: { size: number; foregroundColor: string; backgroundColor: string; errorCorrection: "L" | "M" | "Q" | "H"; frameStyle: FrameStyle },
  filename: string,
  extraHeaders?: Record<string, string>,
): Promise<NextResponse> {
  const qrSize = Math.min(opts.size, 600);
  const baseSvg = await QRCode.toString(qrData, {
    width: qrSize,
    margin: 2,
    color: { dark: opts.foregroundColor, light: opts.backgroundColor },
    errorCorrectionLevel: opts.errorCorrection,
    type: "svg",
  });

  const framedSvg = applyFrameToSvg(baseSvg, opts.frameStyle, opts.foregroundColor, opts.backgroundColor, qrSize);

  if (format === "svg") {
    return new NextResponse(framedSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${filename}.svg"`,
        ...extraHeaders,
      },
    });
  }

  const pngBuffer = await sharp(Buffer.from(framedSvg)).png().toBuffer();

  if (format === "pdf") {
    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    const pdfPadding = 40;
    const pageWidth = pngImage.width + pdfPadding * 2;
    const pageHeight = pngImage.height + pdfPadding * 2;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(pngImage, {
      x: pdfPadding,
      y: pdfPadding,
      width: pngImage.width,
      height: pngImage.height,
    });
    const pdfBytes = await pdfDoc.save();
    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        ...extraHeaders,
      },
    });
  }

  return new NextResponse(new Uint8Array(pngBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}.png"`,
      ...extraHeaders,
    },
  });
}

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
      format,
      frameStyle,
    } = parsed.data;

    const filename = `qrforge-${type.toLowerCase()}`;
    const qrOpts = { size, foregroundColor, backgroundColor, errorCorrection, frameStyle };

    // Non-URL types require authentication
    if (type !== "URL") {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Sign in required to use this QR code type" },
          { status: 401 }
        );
      }
    }

    // Tracked QR codes require authentication
    if (!isDirect) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Sign in required to create Tracked QR codes" },
          { status: 401 }
        );
      }

      // Get or create user in our DB
      let user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (!user) {
        // User exists in Clerk but not our DB yet (webhook may not have fired)
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
          return NextResponse.json(
            { error: "No email found for your account" },
            { status: 400 }
          );
        }
        user = await prisma.user.upsert({
          where: { clerkId: userId },
          update: { email, name: clerkUser.fullName },
          create: { clerkId: userId, email, name: clerkUser.fullName },
        });
      }

      // Build data & generate shortCode
      const destinationData = buildQRData(type, content);
      const MAX_RETRIES = 10;
      let shortCode = generateShortCode();
      let exists = null;
      let attempts = 1;
      do {
        if (attempts >= MAX_RETRIES) {
          return NextResponse.json(
            { error: "Failed to generate unique short code. Please try again." },
            { status: 500 }
          );
        }
        shortCode = generateShortCode();
        exists = await prisma.qRCode.findUnique({ where: { shortCode } });
        attempts++;
      } while (exists);

      await prisma.qRCode.create({
        data: {
          userId: user.id,
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

      const qrEncodeData = `${SITE_URL}/r/${shortCode}`;
      return buildQRResponse(qrEncodeData, format, qrOpts, filename);
    }

    // Direct mode — no auth required
    const data = buildQRData(type, content);

    // If user is authenticated, save the direct QR to their account too
    const { userId } = await auth();
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        await prisma.qRCode.create({
          data: {
            userId: user.id,
            type,
            content,
            foregroundColor,
            backgroundColor,
            errorCorrection,
            size,
            isDirect: true,
          },
        });
      }
    }

    return buildQRResponse(data, format, qrOpts, filename, { "Cache-Control": "no-store" });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
