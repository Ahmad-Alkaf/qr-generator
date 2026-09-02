import { prisma } from "./prisma";

export interface SiteStats {
  qrCount: number;
  userCount: number;
  scanCount: number;
}

/**
 * Site-wide counters shown on the home and about pages.
 * Returns null when the database is unreachable so a DB outage
 * (or a build without DATABASE_URL) never breaks page rendering.
 */
export async function getSiteStats(): Promise<SiteStats | null> {
  // The Docker build has no database. Skip the query instead of logging
  // a connection error; the page is revalidated after deploy.
  if (process.env.NEXT_PHASE === "phase-production-build") return null;

  try {
    const [qrCount, userCount, scanCount] = await Promise.all([
      prisma.qRGenEvent.count(),
      prisma.user.count(),
      prisma.scan.count(),
    ]);
    return { qrCount, userCount, scanCount };
  } catch (error) {
    console.error("Site stats unavailable:", error);
    return null;
  }
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return n.toLocaleString("en-US");
}
