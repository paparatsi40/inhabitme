/**
 * InhabitMe — Fee Model by Duration
 *
 * Fuente única de verdad para todos los fees de la plataforma.
 * Se usa en: guest-checkout, host-checkout, webhook, UI de precios.
 *
 * Monedas soportadas: EUR (default) y USD (guests americanos).
 * Decisión de producto (sep-2026): los importes son los MISMOS números
 * en ambas monedas (€79 = $79). Así el copy de precios (hero, FAQ,
 * tabla) es válido en las dos monedas sin depender del tipo de cambio.
 *
 * Tiers:
 *  Tier 1 — 1 mes:    €79 guest  / €49 host   |  $79 guest  / $49 host
 *  Tier 2 — 2-3 mes: €139 guest  / €79 host   | $139 guest  / $79 host
 *  Tier 3 — 4-6 mes: €189 guest  / €99 host   | $189 guest  / $99 host
 *  Tier 4 — 7+ mes:  €239 guest  / €119 host  | $239 guest  / $119 host
 */

export type SupportedCurrency = 'eur' | 'usd'

export interface DurationFee {
  guestFee: number        // in cents (€ or $)
  hostFee: number         // in cents
  hostFeaturedFee: number // in cents (para listings destacados)
  total: number           // in cents (guest + host standard)
  currency: SupportedCurrency
}

const TIERS_EUR = [
  { months: [1, 1],   guestFee: 7900,  hostFee: 4900,  hostFeaturedFee: 6900  },
  { months: [2, 3],   guestFee: 13900, hostFee: 7900,  hostFeaturedFee: 9900  },
  { months: [4, 6],   guestFee: 18900, hostFee: 9900,  hostFeaturedFee: 12900 },
  { months: [7, 999], guestFee: 23900, hostFee: 11900, hostFeaturedFee: 15900 },
]

// Mismos importes que EUR (ver nota arriba).
const TIERS_USD = TIERS_EUR

/**
 * Calcula los fees según duración y moneda.
 * @param months  Duración de la estancia en meses
 * @param currency 'eur' (default) | 'usd'
 */
export function calculateDurationFees(
  months: number,
  currency: SupportedCurrency = 'eur'
): DurationFee {
  const tiers = currency === 'usd' ? TIERS_USD : TIERS_EUR

  const tier = tiers.find(
    (t) => months >= t.months[0] && months <= t.months[1]
  ) ?? tiers[tiers.length - 1] // fallback al último tier

  return {
    guestFee: tier.guestFee,
    hostFee: tier.hostFee,
    hostFeaturedFee: tier.hostFeaturedFee,
    total: tier.guestFee + tier.hostFee,
    currency,
  }
}

/**
 * Nombre del tier para mostrar al usuario o en metadatos de Stripe.
 */
export function getTierName(months: number): string {
  if (months === 1)              return 'Tier 1 — 1 mes'
  if (months >= 2 && months <= 3) return 'Tier 2 — 2-3 meses'
  if (months >= 4 && months <= 6) return 'Tier 3 — 4-6 meses'
  return 'Tier 4 — 7+ meses'
}

/**
 * Formatea un monto en centavos como string con símbolo de moneda.
 * Ej: formatFee(7900, 'eur') → '€79'
 *     formatFee(7900, 'usd') → '$79'
 */
export function formatFee(cents: number, currency: SupportedCurrency = 'eur'): string {
  const amount = Math.round(cents / 100)
  return currency === 'usd' ? `$${amount}` : `€${amount}`
}

/** @deprecated Usa formatFee() con currency param */
export function formatEuros(cents: number): string {
  return formatFee(cents, 'eur')
}

/**
 * Devuelve todos los tiers para la página de precios.
 */
export function getAllTiers(currency: SupportedCurrency = 'eur') {
  const durations = ['1 mes', '2-3 meses', '4-6 meses', '7+ meses']
  const months    = [1, 2, 4, 7]
  return months.map((m, i) => ({
    duration: durations[i],
    months: m,
    ...calculateDurationFees(m, currency),
  }))
}
