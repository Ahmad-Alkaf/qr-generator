import { prisma } from "./prisma";

export async function getSiteStats() {
  const [qrCount, userCount, scanCount] = await Promise.all([
    prisma.qRGenEvent.count(),
    prisma.user.count(),
    prisma.scan.count(),
  ]);

  return { qrCount, userCount, scanCount };
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return n.toLocaleString("en-US");
}
