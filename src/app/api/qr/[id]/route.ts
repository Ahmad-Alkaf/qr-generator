import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().max(255).optional(),
  destinationUrl: z.url().max(2048).optional(),
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const qrCode = await prisma.qRCode.findUnique({
    where: { id },
  });

  if (!qrCode || qrCode.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.qRCode.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const qrCode = await prisma.qRCode.findUnique({
    where: { id },
  });

  if (!qrCode || qrCode.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }

  if (parsed.data.destinationUrl && qrCode.isDirect) {
    return NextResponse.json(
      { error: "Cannot set destination URL on a Direct QR code" },
      { status: 400 }
    );
  }

  const updated = await prisma.qRCode.update({
    where: { id },
    data: {
      name: parsed.data.name ?? qrCode.name,
      destinationUrl: parsed.data.destinationUrl ?? qrCode.destinationUrl,
    },
  });

  return NextResponse.json(updated);
}
