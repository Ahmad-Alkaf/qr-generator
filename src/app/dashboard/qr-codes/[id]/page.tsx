import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Smartphone, Monitor, Clock, BarChart3 } from "lucide-react";

export default async function QRCodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) notFound();

  const qrCode = await prisma.qRCode.findUnique({
    where: { id, userId: user.id },
    include: {
      scans: {
        orderBy: { scannedAt: "desc" },
        take: 50,
      },
      _count: { select: { scans: true } },
    },
  });

  if (!qrCode) notFound();

  // Aggregate stats
  const countryStats = new Map<string, number>();
  const deviceStats = new Map<string, number>();
  const browserStats = new Map<string, number>();
  const dailyStats = new Map<string, number>();

  for (const scan of qrCode.scans) {
    const country = scan.country || "Unknown";
    countryStats.set(country, (countryStats.get(country) || 0) + 1);

    const device = scan.device || "Unknown";
    deviceStats.set(device, (deviceStats.get(device) || 0) + 1);

    const browser = scan.browser || "Unknown";
    browserStats.set(browser, (browserStats.get(browser) || 0) + 1);

    const day = scan.scannedAt.toISOString().split("T")[0];
    dailyStats.set(day, (dailyStats.get(day) || 0) + 1);
  }

  const sortedCountries = [...countryStats.entries()].sort((a, b) => b[1] - a[1]);
  const sortedDevices = [...deviceStats.entries()].sort((a, b) => b[1] - a[1]);
  const sortedBrowsers = [...browserStats.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <Link
        href="/dashboard/qr-codes"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to QR Codes
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
            {qrCode.name || `${qrCode.type} QR Code`}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {qrCode.isDirect ? "Direct" : "Tracked"} &middot; Created{" "}
            {qrCode.createdAt.toLocaleDateString()}
            {qrCode.shortCode && (
              <>
                {" "}&middot; Short code: <code className="text-primary">{qrCode.shortCode}</code>
              </>
            )}
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary/10">
          <BarChart3 className="h-8 w-8" />
        </div>
      </div>

      {/* Total scans */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Scans</p>
        <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">
          {qrCode._count.scans}
        </p>
      </div>

      {qrCode._count.scans === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No scans yet. Share your QR code to start collecting analytics.
        </p>
      ) : (
        <>
          {/* Analytics grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Countries */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Top Countries
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {sortedCountries.slice(0, 5).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {country}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Devices
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {sortedDevices.map(([device, count]) => {
                  const sampleTotal = qrCode.scans.length;
                  const pct = sampleTotal > 0 ? Math.round((count / sampleTotal) * 100) : 0;
                  return (
                    <div key={device}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {device === "Mobile" ? (
                            <span className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3" /> Mobile
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" /> Desktop
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {pct}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browsers */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Browsers
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {sortedBrowsers.slice(0, 5).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {browser}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent scans table */}
          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Clock className="h-4 w-4 text-primary" />
              Recent Scans
            </h3>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Device</th>
                    <th className="px-4 py-3">Browser</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {qrCode.scans.map((scan) => (
                    <tr key={scan.id} className="bg-white dark:bg-gray-900">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {[scan.city, scan.country].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {scan.device || "—"} / {scan.os || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {scan.browser || "—"}
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
          </div>
        </>
      )}
    </div>
  );
}
