import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const qr = await prisma.qRCode.findUnique({
    where: { shortCode },
  });

  if (!qr || !qr.destinationUrl) {
    return NextResponse.redirect(new URL("/not-found", req.url), {
      status: 302,
    });
  }

  // Log scan asynchronously — don't block the redirect
  const headers = Object.fromEntries(new Headers(req.headers));
  logScan(qr.id, headers, req.url).catch(console.error);

  // Only allow http(s) redirects to prevent open-redirect to javascript:, data:, etc.
  const dest = qr.destinationUrl;
  if (!/^https?:\/\//i.test(dest)) {
    return NextResponse.redirect(new URL("/not-found", req.url), {
      status: 302,
    });
  }

  return NextResponse.redirect(dest, { status: 302 });
}

async function logScan(
  qrCodeId: string,
  headers: Record<string, string>,
  url: string
) {
  const forwarded = headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0].trim() : headers["x-real-ip"] || null;
  const userAgent = headers["user-agent"] || "";
  const referer = headers["referer"] || headers["referrer"] || null;

  // Parse device/os/browser from user-agent (basic parsing)
  const device = /Mobile|Android|iPhone|iPad/i.test(userAgent)
    ? "Mobile"
    : "Desktop";
  const os = parseOS(userAgent);
  const browser = parseBrowser(userAgent);

  // Get geo info from Vercel headers if available
  const country = headers["x-vercel-ip-country"] || null;
  const city = headers["x-vercel-ip-city"]
    ? decodeURIComponent(headers["x-vercel-ip-city"])
    : null;

  await prisma.scan.create({
    data: {
      qrCodeId,
      ip,
      country,
      city,
      device,
      os,
      browser,
      referer,
    },
  });
}

function parseOS(ua: string): string {
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X|macOS/i.test(ua)) return "macOS";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
}

function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Opera|OPR\//i.test(ua)) return "Opera";
  return "Unknown";
}
