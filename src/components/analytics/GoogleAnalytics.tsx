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
 * Flujo:
 * 1. Inyecta un <script> inline en el HTML que declara `consent default` con
 *    todo en 'denied' ANTES de que gtag.js cargue.
 * 2. Carga gtag.js con strategy="afterInteractive".
 * 3. Si el usuario tiene consent='all' guardado, dispara `consent update -> granted`.
 * 4. Escucha `cookieConsentChange` para actualizar en tiempo real.
 *
 * Ref: https://developers.google.com/tag-platform/security/guides/consent
 */
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    if (!measurementId) return
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

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

  // Consent default inline — debe ejecutarse ANTES de cargar gtag.js
  const consentDefault = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
  `.trim()

  return (
    <>
      {/* Inicialización: declarar consent default ANTES de gtag/js */}
      <script
        id="ga-consent-default"
        dangerouslySetInnerHTML={{ __html: consentDefault }}
      />

      {/* Cargar el SDK de GA4 (afterInteractive: carga sin bloquear LCP) */}
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      {/* Configurar el measurement ID.
          Usamos window.gtag(...) en vez de gtag(...) porque next/script con
          strategy="afterInteractive" envuelve el contenido inline en una función,
          haciendo que gtag (variable local del consent default) no sea visible aquí.
          window.gtag SÍ está expuesto desde el script anterior. */}
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.gtag('js', new Date());
          window.gtag('config', '${measurementId}', { send_page_view: true });
        `}
      </Script>
    </>
  )
}
