import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
        user = await prisma.user.create({
          data: { clerkId: userId, email: `pending-${userId}@placeholder.local` },
        });
      }

      // Enforce plan limits for tracked QR codes
      const trackedCount = await prisma.qRCode.count({
        where: { userId: user.id, isDirect: false },
      });

      if (user.plan === "FREE" && trackedCount >= 10) {
        return NextResponse.json(
          { error: "Free plan limit reached (10 tracked QR codes). Upgrade to Pro for unlimited." },
          { status: 403 }
        );
      }

      if (user.plan === "PRO" && trackedCount >= 50) {
        return NextResponse.json(
          { error: "Pro plan limit reached (50 tracked QR codes). Upgrade to Business for unlimited." },
          { status: 403 }
        );
      }

      // Build data & generate shortCode
      const destinationData = buildQRData(type, content);
      let shortCode = generateShortCode();
      let exists = await prisma.qRCode.findUnique({ where: { shortCode } });
      while (exists) {
        shortCode = generateShortCode();
        exists = await prisma.qRCode.findUnique({ where: { shortCode } });
      }

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

      const qrBuffer = await QRCode.toBuffer(qrEncodeData, {
        width: Math.min(size, 600),
        margin: 2,
        color: { dark: foregroundColor, light: backgroundColor },
        errorCorrectionLevel: errorCorrection,
      });

      return new NextResponse(new Uint8Array(qrBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="qrforge-${type.toLowerCase()}.png"`,
        },
      });
    }

    // Direct mode — no auth required
    const data = buildQRData(type, content);

    const qrBuffer = await QRCode.toBuffer(data, {
      width: Math.min(size, 600),
      margin: 2,
      color: { dark: foregroundColor, light: backgroundColor },
      errorCorrectionLevel: errorCorrection,
    });

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

    return new NextResponse(new Uint8Array(qrBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="qrforge-${type.toLowerCase()}.png"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
