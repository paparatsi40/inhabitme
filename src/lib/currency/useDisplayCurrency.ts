'use client'

/**
 * useDisplayCurrency — hook client-side para detectar la moneda preferida del visitante.
 *
 * Estrategia:
 * 1. Lee `Intl.DateTimeFormat().resolvedOptions().timeZone` (e.g. 'Europe/Madrid')
 * 2. Mapea el timezone a moneda según el continente/país
 * 3. Default: USD si no se reconoce el timezone
 *
 * Pros: 100% client-side, sin geo-IP, sin consentimiento adicional.
 * Cons: el usuario puede tener su tz cambiada manualmente. Aceptable: default USD.
 */

import { useEffect, useState } from 'react'
import type { SupportedCurrency } from '@/lib/currency'

// Timezones europeos que usan EUR (eurozone + algunos cercanos por simplicidad)
const EUR_TIMEZONES = new Set([
  'Europe/Madrid',
  'Europe/Lisbon',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Brussels',
  'Europe/Vienna',
  'Europe/Dublin',
  'Europe/Helsinki',
  'Europe/Athens',
  'Europe/Luxembourg',
  'Europe/Malta',
  'Europe/Bratislava',
  'Europe/Ljubljana',
  'Europe/Tallinn',
  'Europe/Riga',
  'Europe/Vilnius',
  'Europe/Nicosia',
])

function detectCurrencyFromTimezone(): SupportedCurrency {
  if (typeof window === 'undefined') return 'USD'
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (EUR_TIMEZONES.has(tz)) return 'EUR'
    // Cualquier otro timezone (incluyendo Americas, Asia, etc.) → USD
    return 'USD'
  } catch {
    return 'USD'
  }
}

/**
 * Devuelve la moneda preferida del visitante.
 * Empieza con el SSR default (USD) y se reconcilia client-side al hidratar.
 *
 * @param ssrDefault Moneda por defecto durante SSR (default: 'USD')
 */
export function useDisplayCurrency(ssrDefault: SupportedCurrency = 'USD'): SupportedCurrency {
  const [currency, setCurrency] = useState<SupportedCurrency>(ssrDefault)

  useEffect(() => {
    setCurrency(detectCurrencyFromTimezone())
  }, [])

  return currency
}

/**
 * Helper síncrono para usos no-hook (e.g., dentro de un onClick).
 * No respeta SSR — solo úsalo cuando ya estés client-side.
 */
export function getCurrencyFromTimezone(): SupportedCurrency {
  return detectCurrencyFromTimezone()
}
