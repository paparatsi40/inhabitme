import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import * as Sentry from '@sentry/nextjs'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

// Only create a Redis client when Upstash is configured. In local/dev
// environments without these env vars we fall back to a no-op limiter.
const redis = url && token ? new Redis({ url, token }) : null

// Sin Redis el limitador deja pasar todo. En local es lo que queremos; en
// produccion es una brecha silenciosa, asi que tiene que verse.
if (!redis && process.env.NODE_ENV === 'production') {
  console.error(
    '[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN no configuradas: ' +
      'el rate limiting esta DESACTIVADO en produccion.'
  )
  Sentry.captureMessage('Rate limiting disabled: Upstash not configured', {
    level: 'error',
    tags: { area: 'rate-limit' },
  })
}

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

/**
 * IP del cliente a prueba de cabeceras falsificadas.
 *
 * `x-forwarded-for` es la ultima opcion a proposito: el cliente puede enviar la
 * suya y el proxy la conserva, asi que usar el valor crudo como clave permite
 * rotarla en cada peticion y saltarse el limite por completo. Se prefieren las
 * cabeceras que pone la plataforma, y como fallback se toma la entrada mas a la
 * derecha de la lista (la que añade el proxy de confianza, no el cliente).
 */
export function getClientIp(headers: { get(name: string): string | null }): string {
  const vercelIp = headers.get('x-vercel-forwarded-for')
  if (vercelIp) {
    const first = vercelIp.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }

  return 'unknown'
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
