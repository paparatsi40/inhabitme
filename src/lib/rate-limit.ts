import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

// Only create a Redis client when Upstash is configured. In local/dev
// environments without these env vars we fall back to a no-op limiter.
const redis = url && token ? new Redis({ url, token }) : null

// Reuse limiter instances per (limit, window) config.
const limiterCache = new Map<string, Ratelimit>()

function getLimiter(limit: number, window: number): Ratelimit | null {
  if (!redis) return null
  const key = `${limit}:${window}`
  let limiter = limiterCache.get(key)
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window} s`),
      prefix: 'ratelimit',
      analytics: false,
    })
    limiterCache.set(key, limiter)
  }
  return limiter
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Sliding-window rate limit.
 *
 * @param identifier  Key to rate-limit on (e.g. client IP).
 * @param limit       Max requests allowed within the window.
 * @param window      Window length in seconds.
 *
 * If the Upstash env vars (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)
 * are not configured, this silently allows the request so local environments
 * without Redis keep working.
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  window: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, window)
  if (!limiter) {
    return { success: true, limit, remaining: limit, reset: 0 }
  }
  const res = await limiter.limit(identifier)
  return {
    success: res.success,
    limit: res.limit,
    remaining: res.remaining,
    reset: res.reset,
  }
}
