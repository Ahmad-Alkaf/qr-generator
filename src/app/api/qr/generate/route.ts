import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { qrGenerateSchema, buildQRData } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type FrameStyle = "plain" | "rounded" | "scan-me" | "bordered";

const FRAME_PAD = 16;

function parseHex(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

/** SVG frame wrapping — used only for SVG downloads (browsers render <text> fine). */
function applyFrameToSvg(
  innerSvg: string,
  frameStyle: FrameStyle,
  fgColor: string,
  bgColor: string,
  qrSize: number,
): string {
  // Extract inner paths and viewBox, use <g transform> instead of nested <svg>
  const contentMatch = innerSvg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const innerContent = contentMatch ? contentMatch[1] : "";
  const vbMatch = innerSvg.match(/viewBox="0\s+0\s+(\d+)\s+(\d+)"/);
  const vbSize = vbMatch ? Number(vbMatch[1]) : qrSize;
  const scale = qrSize / vbSize;

  function positionQR(x: number, y: number): string {
    return `<g transform="translate(${x},${y}) scale(${scale})" shape-rendering="crispEdges">${innerContent}</g>`;
  }

  const pad = FRAME_PAD;

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

/** Apply frame to a PNG buffer using sharp native ops — no SVG text dependency. */
async function applyFrameToPng(
  basePng: Buffer,
  frameStyle: FrameStyle,
  fgColor: string,
  bgColor: string,
  qrSize: number,
): Promise<Buffer> {
  const pad = FRAME_PAD;

  switch (frameStyle) {
    case "rounded": {
      const rPad = 20;
      return sharp(basePng)
        .extend({ top: rPad, bottom: rPad, left: rPad, right: rPad, background: bgColor })
        .png()
        .toBuffer();
    }

    case "scan-me": {
      const bannerH = 40;
      const gap = 12;
      const bannerSvg = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${bannerH}">
          <rect width="${qrSize}" height="${bannerH}" rx="8" fill="${fgColor}"/>
          <text x="${qrSize / 2}" y="${bannerH / 2 + 5}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="14" letter-spacing="3" fill="${bgColor}">SCAN ME</text>
        </svg>`
      );
      // Extend the QR image with padding around it and space for the banner below
      const extended = await sharp(basePng)
        .extend({ top: pad, bottom: gap + bannerH + pad, left: pad, right: pad, background: bgColor })
        .png()
        .toBuffer();
      // Composite the banner onto the extended image
      const bannerY = pad + qrSize + gap;
      return sharp(extended)
        .composite([{ input: bannerSvg, top: bannerY, left: pad }])
        .png()
        .toBuffer();
    }

    case "bordered": {
      const border = 4;
      // Inner padding with bgColor, then outer border with fgColor
      const padded = await sharp(basePng)
        .extend({ top: pad, bottom: pad, left: pad, right: pad, background: bgColor })
        .png()
        .toBuffer();
      return sharp(padded)
        .extend({ top: border, bottom: border, left: border, right: border, background: fgColor })
        .png()
        .toBuffer();
    }

    case "plain":
    default:
      return sharp(basePng)
        .extend({ top: pad, bottom: pad, left: pad, right: pad, background: bgColor })
        .png()
        .toBuffer();
  }
}

/** Build a framed PDF using pdf-lib native drawing — reliable text via built-in fonts. */
async function buildFramedPdf(
  basePng: Buffer,
  frameStyle: FrameStyle,
  fgColor: string,
  bgColor: string,
  qrSize: number,
): Promise<Uint8Array> {
  const pad = FRAME_PAD;
  const fg = parseHex(fgColor);
  const bg = parseHex(bgColor);

  const pdfDoc = await PDFDocument.create();
  const qrImage = await pdfDoc.embedPng(basePng);

  switch (frameStyle) {
    case "scan-me": {
      const bannerH = 40;
      const gap = 12;
      const pageW = qrSize + pad * 2;
      const pageH = qrSize + pad + gap + bannerH + pad;
      const page = pdfDoc.addPage([pageW, pageH]);

      // Background (PDF y=0 is bottom)
      page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: rgb(bg.r, bg.g, bg.b) });

      // QR image — positioned above the banner
      page.drawImage(qrImage, { x: pad, y: pad + bannerH + gap, width: qrSize, height: qrSize });

      // Banner rectangle
      page.drawRectangle({ x: pad, y: pad, width: qrSize, height: bannerH, color: rgb(fg.r, fg.g, fg.b) });

      // "SCAN ME" text using built-in Helvetica Bold
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 14;
      const textWidth = font.widthOfTextAtSize("SCAN ME", fontSize);
      page.drawText("SCAN ME", {
        x: pageW / 2 - textWidth / 2,
        y: pad + bannerH / 2 - fontSize * 0.35,
        size: fontSize,
        font,
        color: rgb(bg.r, bg.g, bg.b),
      });
      break;
    }

    case "bordered": {
      const border = 4;
      const total = qrSize + (pad + border) * 2;
      const page = pdfDoc.addPage([total, total]);

      // Outer border
      page.drawRectangle({ x: 0, y: 0, width: total, height: total, color: rgb(fg.r, fg.g, fg.b) });
      // Inner background
      const inner = total - border * 2;
      page.drawRectangle({ x: border, y: border, width: inner, height: inner, color: rgb(bg.r, bg.g, bg.b) });
      // QR image
      page.drawImage(qrImage, { x: pad + border, y: pad + border, width: qrSize, height: qrSize });
      break;
    }

    case "rounded":
    case "plain":
    default: {
      const p = frameStyle === "rounded" ? 20 : pad;
      const total = qrSize + p * 2;
      const page = pdfDoc.addPage([total, total]);
      page.drawRectangle({ x: 0, y: 0, width: total, height: total, color: rgb(bg.r, bg.g, bg.b) });
      page.drawImage(qrImage, { x: p, y: p, width: qrSize, height: qrSize });
      break;
    }
  }

  return pdfDoc.save();
}

async function buildQRResponse(
  qrData: string,
  format: "png" | "svg" | "pdf",
  opts: { size: number; foregroundColor: string; backgroundColor: string; errorCorrection: "L" | "M" | "Q" | "H"; frameStyle: FrameStyle },
  filename: string,
  extraHeaders?: Record<string, string>,
): Promise<NextResponse> {
  const qrSize = Math.min(opts.size, 600);
  const qrOpts = {
    width: qrSize,
    margin: 2,
    color: { dark: opts.foregroundColor, light: opts.backgroundColor },
    errorCorrectionLevel: opts.errorCorrection,
  };

  // SVG: use SVG wrapping (browsers render <text> natively)
  if (format === "svg") {
    const baseSvg = await QRCode.toString(qrData, { ...qrOpts, type: "svg" });
    const framedSvg = applyFrameToSvg(baseSvg, opts.frameStyle, opts.foregroundColor, opts.backgroundColor, qrSize);
    return new NextResponse(framedSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${filename}.svg"`,
        ...extraHeaders,
      },
    });
  }

  // PNG & PDF: generate base QR as PNG, apply frame natively
  const basePng = await QRCode.toBuffer(qrData, qrOpts);

  if (format === "pdf") {
    const pdfBytes = await buildFramedPdf(basePng, opts.frameStyle, opts.foregroundColor, opts.backgroundColor, qrSize);
    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        ...extraHeaders,
      },
    });
  }

  // PNG: use sharp native operations
  const framedPng = await applyFrameToPng(basePng, opts.frameStyle, opts.foregroundColor, opts.backgroundColor, qrSize);
  return new NextResponse(new Uint8Array(framedPng), {
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
