import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@clerk/nextjs";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const clerkUser = await currentUser();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { _count: { select: { qrCodes: true } } },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Usage info */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Usage
        </h2>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>QR codes created: {user?._count.qrCodes ?? 0}</p>
        </div>
      </div>

      {/* Clerk User Profile */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Account
        </h2>
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-gray-200 dark:border-gray-800 rounded-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
