import { Redis } from "@upstash/redis";

// Initialize Redis client
export const redis = Redis.fromEnv();

/**
 * Save a design snapshot to Redis with TTL
 */
export async function saveDesignSnapshot(
  sessionId: string, 
  data: unknown, 
  ttl: number = 86400 // 24 hours default
): Promise<void> {
  const key = `design:snap:${sessionId}`;
  await redis.set(key, JSON.stringify(data), { ex: ttl });
}

/**
 * Get a design snapshot from Redis
 */
export async function getDesignSnapshot<T>(sessionId: string): Promise<T | null> {
  const key = `design:snap:${sessionId}`;
  const raw = await redis.get<string>(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

/**
 * Delete a design snapshot from Redis
 */
export async function deleteDesignSnapshot(sessionId: string): Promise<void> {
  const key = `design:snap:${sessionId}`;
  await redis.del(key);
}

/**
 * Rate limiting utility
 */
export async function rateLimitCheck(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000 // 1 minute default
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const windowKey = `${key}:${window}`;
  
  const current = await redis.incr(windowKey);
  
  if (current === 1) {
    // Set expiration for the first request in this window
    await redis.expire(windowKey, Math.ceil(windowMs / 1000));
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetTime: (window + 1) * windowMs,
  };
}