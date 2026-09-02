import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set; webhook rejected");
    return new Response("Webhook not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Verify the raw body. Re-serializing JSON could change the signature.
  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      email_addresses,
      primary_email_address_id,
      first_name,
      last_name,
      image_url,
    } = evt.data;
    const primary = email_addresses?.find(
      (address) => address.id === primary_email_address_id
    );
    const email = primary?.email_address ?? email_addresses?.[0]?.email_address;

    if (!email) {
      return new Response("No email found", { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: { email, name, image: image_url },
      create: { clerkId: id, email, name, image: image_url },
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (id) {
      const user = await prisma.user.findUnique({
        where: { clerkId: id },
        select: { id: true },
      });
      if (user) {
        // Remove the user's QR codes (and their scans via cascade) so no
        // personal data outlives the account.
        await prisma.$transaction([
          prisma.qRCode.deleteMany({ where: { userId: user.id } }),
          prisma.user.delete({ where: { id: user.id } }),
        ]);
      }
    }
  }

  return new Response("OK", { status: 200 });
}
