/**
 * Consent helper — fuente única de verdad para el estado de cookies.
 *
 * El CookieBanner ya guarda la decisión en localStorage bajo `inhabitme_cookie_consent`
 * y dispara un CustomEvent('cookieConsentChange') cuando el usuario decide.
 *
 * Este módulo abstrae la lectura/escucha de ese estado para que GA y PostHog
 * solo se "enciendan" cuando el usuario aceptó.
 */

export type CookieConsent = 'all' | 'essential' | null

const STORAGE_KEY = 'inhabitme_cookie_consent'

export function getConsent(): CookieConsent {
  if (typeof window === 'undefined') return null
  return (window.localStorage.getItem(STORAGE_KEY) as CookieConsent) ?? null
}

export function hasAnalyticsConsent(): boolean {
  return getConsent() === 'all'
}

/**
 * Subscribe to consent changes.
 * Returns an unsubscribe function.
 */
export function onConsentChange(handler: (consent: CookieConsent) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const listener = (e: Event) => {
    const detail = (e as CustomEvent<{ consent: CookieConsent }>).detail
    handler(detail?.consent ?? null)
  }

  window.addEventListener('cookieConsentChange', listener)
  return () => window.removeEventListener('cookieConsentChange', listener)
}
