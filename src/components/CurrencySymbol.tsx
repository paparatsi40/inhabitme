'use client'

import { useDisplayCurrency } from '@/lib/currency/useDisplayCurrency'

/**
 * Renderiza el símbolo de moneda según el timezone del visitante.
 * SSR: '$' (default conservador). Hidrata client-side a '€' si el visitante está en Europa.
 *
 * Uso:
 *   <CurrencySymbol />79–<CurrencySymbol />239
 */
export function CurrencySymbol() {
  const currency = useDisplayCurrency('USD')
  return <>{currency === 'EUR' ? '€' : '$'}</>
}
