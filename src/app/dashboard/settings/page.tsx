import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { PLANS } from "@/lib/constants";

export default async function SettingsPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
    include: { _count: { select: { qrCodes: true } } },
  });

  const plan = user?.plan ?? "FREE";
  const planInfo = PLANS[plan as keyof typeof PLANS];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Plan info */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Current Plan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You are on the <strong className="text-primary">{planInfo.name}</strong> plan
            </p>
          </div>
          {plan === "FREE" && (
            <Link
              href="/pricing"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Upgrade
            </Link>
          )}
        </div>
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
