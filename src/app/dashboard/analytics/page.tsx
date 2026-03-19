import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Globe, Smartphone, Monitor } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  const scans = user
    ? await prisma.scan.findMany({
        where: { qrCode: { userId: user.id } },
        orderBy: { scannedAt: "desc" },
        take: 200,
        include: {
          qrCode: { select: { name: true, shortCode: true, type: true } },
        },
      })
    : [];

  const totalScans = scans.length;

  // Aggregate
  const countryStats = new Map<string, number>();
  const deviceStats = new Map<string, number>();
  const qrStats = new Map<string, { name: string; count: number }>();

  for (const scan of scans) {
    const country = scan.country || "Unknown";
    countryStats.set(country, (countryStats.get(country) || 0) + 1);

    const device = scan.device || "Unknown";
    deviceStats.set(device, (deviceStats.get(device) || 0) + 1);

    const qrName =
      scan.qrCode.name || scan.qrCode.shortCode || scan.qrCode.type;
    const existing = qrStats.get(scan.qrCodeId);
    if (existing) {
      existing.count++;
    } else {
      qrStats.set(scan.qrCodeId, { name: qrName, count: 1 });
    }
  }

  const sortedCountries = [...countryStats.entries()].sort((a, b) => b[1] - a[1]);
  const sortedDevices = [...deviceStats.entries()].sort((a, b) => b[1] - a[1]);
  const topQR = [...qrStats.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
        Analytics Overview
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Aggregated scan data across all your tracked QR codes
      </p>

      {totalScans === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          No scan data yet. Create and share Tracked QR codes to see analytics here.
        </p>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Scans (last 200)
            </p>
            <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white">
              {totalScans}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Top QR codes */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Top QR Codes
              </h3>
              <div className="mt-4 space-y-3">
                {topQR.map(([id, data]) => (
                  <div key={id} className="flex items-center justify-between">
                    <span className="truncate text-sm text-gray-600 dark:text-gray-400">
                      {data.name}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Top Countries
                </h3>
              </div>
              <div className="mt-4 space-y-3">
                {sortedCountries.slice(0, 8).map(([country, count]) => (
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
                  const pct =
                    totalScans > 0 ? Math.round((count / totalScans) * 100) : 0;
                  return (
                    <div key={device}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          {device === "Mobile" ? (
                            <Smartphone className="h-3 w-3" />
                          ) : (
                            <Monitor className="h-3 w-3" />
                          )}
                          {device}
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
          </div>
        </>
      )}
    </div>
  );
}
