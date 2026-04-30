'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { hasAnalyticsConsent, onConsentChange } from '@/lib/analytics/consent'

/**
 * Inicialización lazy de PostHog.
 * - opt_out por defecto hasta que el usuario acepte cookies.
 * - autocapture está habilitado pero no envía nada hasta el opt_in.
 */
function initPostHog() {
  if (typeof window === 'undefined') return
  if (posthog.__loaded) return

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
  if (!key) return

  posthog.init(key, {
    api_host: host,
    // El usuario tiene que opt-in explícitamente vía CookieBanner
    opt_out_capturing_by_default: !hasAnalyticsConsent(),
    // Pageviews los manejamos nosotros vía usePathname (más fiable en App Router)
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
    person_profiles: 'identified_only',
    loaded: () => {
      if (process.env.NODE_ENV === 'development') {
        // Útil para debugging local
        // posthog.debug()
      }
    },
  })
}

function PostHogPageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    if (posthog.has_opted_out_capturing()) return

    const url = searchParams && searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    posthog.capture('$pageview', { $current_url: window.location.origin + url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    // Sincronizar opt-in/out con el consent banner
    return onConsentChange((consent) => {
      if (consent === 'all') {
        posthog.opt_in_capturing()
      } else {
        posthog.opt_out_capturing()
      }
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
