import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { qrGenerateSchema, buildQRData } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortcode";
import { checkRateLimit } from "@/lib/rate-limit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    const { success } = await checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
    const body = await req.json();
    const parsed = qrGenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: z.treeifyError(parsed.error) },
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

    const { userId } = await auth();

    // Non-URL types require authentication
    if (type !== "URL" && !userId) {
      return NextResponse.json(
        { error: "Sign in required to use this QR code type" },
        { status: 401 }
      );
    }

    // Tracked QR codes require authentication
    if (!isDirect) {
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
      let shortCode = "";
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        shortCode = generateShortCode();
        const exists = await prisma.qRCode.findUnique({ where: { shortCode } });
        if (!exists) break;
        if (attempt === MAX_RETRIES - 1) {
          return NextResponse.json(
            { error: "Failed to generate unique short code. Please try again." },
            { status: 500 }
          );
        }
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

      const qrData = `${SITE_URL}/r/${shortCode}`;
      return NextResponse.json({ qrData });
    }

    // Direct mode — save to account if authenticated
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
