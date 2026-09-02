/**
 * Helpers that read client information from request headers.
 *
 * The app runs behind a reverse proxy (Coolify/Traefik, optionally with
 * Cloudflare in front). Vercel headers are still recognised so the same
 * code works on both hosts.
 */

type HeaderSource = Headers | Record<string, string | undefined>;

function read(headers: HeaderSource, name: string): string | null {
  const value =
    headers instanceof Headers ? headers.get(name) : headers[name.toLowerCase()];
  return value ? value.trim() : null;
}

/** Best-effort client IP behind common proxies. */
export function getClientIp(headers: HeaderSource): string | null {
  const cf = read(headers, "cf-connecting-ip");
  if (cf) return cf;
  const forwarded = read(headers, "x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return read(headers, "x-real-ip");
}

/**
 * Anonymize an IP address before it is stored.
 * IPv4 keeps the first three octets, IPv6 keeps the first three groups.
 */
export function anonymizeIp(ip: string | null): string | null {
  if (!ip) return null;
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length !== 4) return null;
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (ip.includes(":")) {
    const groups = ip.split(":");
    return `${groups.slice(0, 3).join(":")}::`;
  }
  return null;
}

/**
 * Approximate location. Supported sources:
 * - Cloudflare: `cf-ipcountry`, and `cf-ipcity` when the
 *   "Add visitor location headers" managed transform is enabled.
 * - Vercel: `x-vercel-ip-country`, `x-vercel-ip-city`.
 * Returns nulls when the proxy sends no location headers.
 */
export function getGeo(headers: HeaderSource): { country: string | null; city: string | null } {
  const rawCountry = read(headers, "cf-ipcountry") ?? read(headers, "x-vercel-ip-country");
  const rawCity = read(headers, "cf-ipcity") ?? read(headers, "x-vercel-ip-city");

  // Cloudflare uses "XX" for unknown and "T1" for Tor.
  const country =
    rawCountry && /^[A-Z]{2}$/i.test(rawCountry) && !["XX", "T1"].includes(rawCountry.toUpperCase())
      ? rawCountry.toUpperCase()
      : null;

  let city: string | null = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  return { country, city };
}
