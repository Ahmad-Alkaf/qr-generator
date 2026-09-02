import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get the current user from the database.
 * Returns null if not authenticated or not synced yet.
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { clerkId: userId },
  });
}

/**
 * Get the database user for a Clerk ID. When the Clerk webhook has not
 * synced the user yet, the profile is fetched from Clerk and stored.
 * Returns null when Clerk has no email for the account.
 */
export async function ensureUser(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(clerkId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user.upsert({
    where: { clerkId },
    update: { email, name: clerkUser.fullName, image: clerkUser.imageUrl },
    create: {
      clerkId,
      email,
      name: clerkUser.fullName,
      image: clerkUser.imageUrl,
    },
  });
}
