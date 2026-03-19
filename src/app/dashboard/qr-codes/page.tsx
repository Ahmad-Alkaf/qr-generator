import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ExternalLink, BarChart3, Zap, Trash2 } from "lucide-react";
import { DeleteQRButton } from "./delete-button";

export default async function QRCodesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const qrCodes = user
    ? await prisma.qRCode.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { scans: true } },
        },
      })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
          My QR Codes
        </h1>
        <Link
          href="/#generator"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          Create New
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            You haven&apos;t created any QR codes yet.
          </p>
          <Link
            href="/#generator"
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Create Your First QR Code
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {qrCodes.map((qr) => (
            <div
              key={qr.id}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-gray-900 dark:text-white">
                    {qr.name || `${qr.type} QR Code`}
                  </h3>
                  {qr.isDirect ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <Zap className="h-3 w-3" /> Direct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      <BarChart3 className="h-3 w-3" /> Tracked
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {qr.content.length > 80 ? qr.content.slice(0, 80) + "..." : qr.content}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>{qr.type}</span>
                  <span>{qr.createdAt.toLocaleDateString()}</span>
                  {!qr.isDirect && (
                    <span>{qr._count.scans} scan{qr._count.scans !== 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!qr.isDirect && (
                  <Link
                    href={`/dashboard/qr-codes/${qr.id}`}
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    title="View analytics"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                )}
                {qr.shortCode && (
                  <a
                    href={`/r/${qr.shortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                    title="Open redirect URL"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <DeleteQRButton qrId={qr.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
