import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { QrCode, BarChart3, Eye } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
    include: {
      _count: { select: { qrCodes: true } },
    },
  });

  const totalScans = user
    ? await prisma.scan.count({
        where: { qrCode: { userId: user.id } },
      })
    : 0;

  const trackedCount = user
    ? await prisma.qRCode.count({
        where: { userId: user.id, isDirect: false },
      })
    : 0;

  const recentScans = user
    ? await prisma.scan.findMany({
        where: { qrCode: { userId: user.id } },
        orderBy: { scannedAt: "desc" },
        take: 10,
        include: { qrCode: { select: { name: true, shortCode: true, type: true } } },
      })
    : [];

  const stats = [
    {
      label: "Total QR Codes",
      value: user?._count.qrCodes ?? 0,
      icon: QrCode,
    },
    {
      label: "Tracked QR Codes",
      value: trackedCount,
      icon: Eye,
    },
    {
      label: "Total Scans",
      value: totalScans,
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary/10">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex gap-3">
        <Link
          href="/dashboard/qr-codes"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          View My QR Codes
        </Link>
        <Link
          href="/#generator"
          className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Create New QR Code
        </Link>
      </div>

      {/* Recent scans */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
          Recent Scans
        </h2>
        {recentScans.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No scans yet. Create a Tracked QR code to start collecting analytics.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">QR Code</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {scan.qrCode.name || scan.qrCode.shortCode || scan.qrCode.type}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {[scan.city, scan.country].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {scan.device || "—"} / {scan.browser || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {scan.scannedAt.toLocaleDateString()}{" "}
                      {scan.scannedAt.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
