import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Globe, Smartphone, Monitor } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  const scanFilter = { qrCode: { userId: user?.id ?? "" } };

  const [totalScans, countries, devices, topQRRows] = user
    ? await Promise.all([
        prisma.scan.count({ where: scanFilter }),
        prisma.scan.groupBy({
          by: ["country"],
          where: scanFilter,
          _count: { _all: true },
          orderBy: { _count: { country: "desc" } },
          take: 8,
        }),
        prisma.scan.groupBy({
          by: ["device"],
          where: scanFilter,
          _count: { _all: true },
          orderBy: { _count: { device: "desc" } },
        }),
        prisma.scan.groupBy({
          by: ["qrCodeId"],
          where: scanFilter,
          _count: { _all: true },
          orderBy: { _count: { qrCodeId: "desc" } },
          take: 10,
        }),
      ])
    : [0, [], [], []];

  const topQRCodes = topQRRows.length
    ? await prisma.qRCode.findMany({
        where: { id: { in: topQRRows.map((row) => row.qrCodeId) } },
        select: { id: true, name: true, shortCode: true, type: true },
      })
    : [];
  const qrById = new Map(topQRCodes.map((qr) => [qr.id, qr]));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">
        Analytics Overview
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Aggregated scan data across all your Tracked QR codes
      </p>

      {totalScans === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          No scan data yet. Create and share Tracked QR codes to see analytics here.
        </p>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Scans</p>
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
                {topQRRows.map((row) => {
                  const qr = qrById.get(row.qrCodeId);
                  const label = qr?.name || qr?.shortCode || qr?.type || "Deleted";
                  return (
                    <div key={row.qrCodeId} className="flex items-center justify-between gap-2">
                      {qr ? (
                        <Link
                          href={`/dashboard/qr-codes/${qr.id}`}
                          className="truncate text-sm text-gray-600 hover:text-primary dark:text-gray-400"
                        >
                          {label}
                        </Link>
                      ) : (
                        <span className="truncate text-sm text-gray-600 dark:text-gray-400">
                          {label}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {row._count._all}
                      </span>
                    </div>
                  );
                })}
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
                {countries.map((row) => (
                  <div key={row.country ?? "unknown"} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {row.country ?? "Unknown"}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {row._count._all}
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
                {devices.map((row) => {
                  const device = row.device ?? "Unknown";
                  const pct = Math.round((row._count._all / totalScans) * 100);
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
