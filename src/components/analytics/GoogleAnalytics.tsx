'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { hasAnalyticsConsent, onConsentChange } from '@/lib/analytics/consent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/**
 * Google Analytics 4 con Consent Mode v2.
 *
 * Patrón único de inicialización (recomendado por Google):
 * 1. Un solo <script> inline que define dataLayer + gtag stub + consent default + js + config.
 *    Esto garantiza que window.gtag SIEMPRE sea una función, incluso antes de que gtag.js cargue.
 * 2. <Script> con afterInteractive que carga gtag.js. Cuando gtag.js carga, "absorbe" la cola
 *    de dataLayer y reemplaza el stub con el SDK real.
 * 3. useEffect maneja consent updates cuando el banner cambia.
 *
 * Refs:
 *   - https://developers.google.com/tag-platform/security/guides/consent
 *   - https://developers.google.com/tag-platform/gtagjs/install
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return

    // gtag debería estar definido por el inline script, pero por defensa:
    if (typeof window.gtag !== 'function') return

    if (hasAnalyticsConsent()) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      })
    }

    return onConsentChange((consent) => {
      if (typeof window.gtag !== 'function') return
      const granted = consent === 'all' ? 'granted' : 'denied'
      window.gtag('consent', 'update', {
        ad_storage: granted,
        ad_user_data: granted,
        ad_personalization: granted,
        analytics_storage: granted,
      })
    })
  }, [measurementId])

  if (!measurementId) return null

  // TODO en un solo script para evitar race conditions de afterInteractive
  const initScript = `
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    window.gtag('js', new Date());
    window.gtag('config', '${measurementId}', { send_page_view: true });
  `.trim()

  return (
    <>
      {/* Inicialización: stub de gtag + consent default + config — TODO en un script */}
      <script
        id="ga-init"
        dangerouslySetInnerHTML={{ __html: initScript }}
      />

      {/* Cargar gtag.js asíncrono. Cuando termina, reemplaza el stub con el SDK real */}
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  )
}
