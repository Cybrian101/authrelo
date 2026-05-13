// Simple in-memory rate limiter (no Redis required)
// Resets on server restart — suitable for serverless with low traffic

const store = new Map<string, { count: number; resetAt: number }>();

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // Clean up expired entries periodically
  if (store.size > 10000) {
    store.forEach((v, k) => {
      if (v.resetAt < now) store.delete(k);
    });
  }

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}
