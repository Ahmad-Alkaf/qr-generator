import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

/**
 * Get the current user from the database, creating them if they don't exist.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

/**
 * Get or create a user in our database from their Clerk ID.
 */
export async function getOrCreateUser(clerkId: string, email: string, name?: string, image?: string) {
  return prisma.user.upsert({
    where: { clerkId },
    update: { email, name, image },
    create: { clerkId, email, name, image },
  });
}
