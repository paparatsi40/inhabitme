'use client'

/**
 * Eventos de negocio (client-side).
 *
 * - PostHog: solo si el usuario ha aceptado cookies (opt-in). El evento
 *   `listing_published` se captura ADEMÁS desde el servidor (posthog-server.ts),
 *   que es la fuente fiable para contar pisos publicados.
 * - Google Ads: conversión vía gtag si NEXT_PUBLIC_GADS_CONVERSION_ID está definido.
 *   Con Consent Mode, Google modela la conversión aunque no haya consentimiento.
 */

import posthog from 'posthog-js'
import { getAttribution } from './attribution'

const GADS_CONVERSION_ID = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID || ''

function captureIfAllowed(event: string, properties: Record<string, unknown>) {
  try {
    if (!posthog.__loaded || posthog.has_opted_out_capturing()) return
    posthog.capture(event, { ...properties, ...(getAttribution() ?? {}) })
  } catch {
    /* analytics nunca debe romper la UI */
  }
}

/** El visitante pulsa el CTA de publicar en una landing de anfitriones. */
export function trackHostSignupStarted(properties: { city?: string; source: string }) {
  captureIfAllowed('host_signup_started', properties)
}

export interface ListingPublishedProps {
  property_id: string
  city?: string
  bedrooms?: number
  monthly_price?: number
}

/** Piso publicado con éxito (respuesta OK de /api/properties/create). */
export function trackListingPublished(properties: ListingPublishedProps) {
  captureIfAllowed('listing_published', { ...properties, source: 'client' })

  if (GADS_CONVERSION_ID && typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', 'conversion', {
        send_to: GADS_CONVERSION_ID,
        transaction_id: properties.property_id,
      })
    } catch {
      /* noop */
    }
  }
}
