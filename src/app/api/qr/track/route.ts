import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QRType } from "@/generated/prisma/client";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

const VALID_TYPES = new Set<string>(Object.values(QRType));

/** Anonymous counter: records only the QR type, never the content. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers) || "anonymous";
  const { success } = await checkRateLimit(`track:${ip}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body: unknown = await req.json();
    const type =
      body && typeof body === "object" && "type" in body
        ? (body as { type?: unknown }).type
        : undefined;
    if (typeof type !== "string" || !VALID_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await prisma.qRGenEvent.create({ data: { type: type as QRType } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
