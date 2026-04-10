'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Cookie, X } from 'lucide-react'

// ── Storage key ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'inhabitme_cookie_consent'

export type CookieConsent = 'all' | 'essential' | null

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem(STORAGE_KEY) as CookieConsent) ?? null
}

// ── Banner component ──────────────────────────────────────────────────────────
export function CookieBanner() {
  const t = useTranslations('cookieBanner')
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)

  // Only show after hydration and if no preference is stored yet
  useEffect(() => {
    if (!getCookieConsent()) {
      // Small delay so it doesn't flash on first paint
      const id = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(id)
    }
  }, [])

  const save = (value: 'all' | 'essential') => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, value)

    // If analytics scripts need to be loaded conditionally, dispatch a custom
    // event here so any analytics module can react without coupling to this component.
    window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: { consent: value } }))

    // Animate out
    setTimeout(() => setVisible(false), 200)
  }

  if (!visible) return null

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        transition-transform duration-300
        ${saving ? 'translate-y-full' : 'translate-y-0'}
      `}
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
    >
      {/* Backdrop blur on mobile */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Icon + text */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-orange-100 rounded-xl shrink-0 mt-0.5">
              <Cookie className="h-5 w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm mb-0.5">{t('title')}</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                {t('description')}{' '}
                <Link
                  href="/cookies"
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-2 whitespace-nowrap"
                >
                  {t('learnMore')}
                </Link>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => save('essential')}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors whitespace-nowrap"
            >
              {t('essentialOnly')}
            </button>
            <button
              onClick={() => save('all')}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all shadow-md whitespace-nowrap"
            >
              {t('acceptAll')}
            </button>
            {/* Close without choosing (defaults to essential-only) */}
            <button
              onClick={() => save('essential')}
              aria-label="Cerrar"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
