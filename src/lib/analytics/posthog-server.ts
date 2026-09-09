import 'server-only'

/**
 * Captura server-side en PostHog vía HTTP (sin dependencia extra).
 *
 * Se usa para eventos de negocio que deben contarse SIEMPRE, con independencia
 * del banner de cookies del cliente: p. ej. `listing_published`.
 * No identifica al usuario más allá de su id de Clerk (ya conocido por la app).
 */

interface ServerEvent {
  event: string
  distinctId: string
  properties?: Record<string, unknown>
}

export async function captureServerEvent({ event, distinctId, properties }: ServerEvent): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com').replace(/\/$/, '')
  if (!key) return

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        timestamp: new Date().toISOString(),
        properties: { ...properties, source: 'server', $lib: 'inhabitme-server' },
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)
  } catch (error) {
    console.error('[analytics] server capture failed:', event, error)
  }
}
