import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
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

      const qrData = `${SITE_URL}/r/${shortCode}`;
      return NextResponse.json({ qrData });
    }

    // Direct mode — save to account if authenticated
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

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
