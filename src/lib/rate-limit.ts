import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    analytics: true,
    prefix: "qrforge",
  });

  return ratelimit;
}

export async function checkRateLimit(identifier: string): Promise<{ success: boolean }> {
  const rl = getRatelimit();
  if (!rl) return { success: true };

  const result = await rl.limit(identifier);
  return { success: result.success };
}
