import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QRType } from "@/generated/prisma/client";

const VALID_TYPES = new Set(Object.values(QRType));

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();
    if (!type || !VALID_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await prisma.qRGenEvent.create({ data: { type } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
