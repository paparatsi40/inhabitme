/**
 * Booking intent pricing (flat fee by stay duration)
 * - 1-3 months: €129
 * - 4-6 months: €179
 * - 7-12 months: €229
 */

export type LeadPriceTier = 'short' | 'mid' | 'long'

export interface LeadPricing {
  amount: number
  tier: LeadPriceTier
  currency: string
}

const TIER_PRICES: Record<LeadPriceTier, number> = {
  short: 129,
  mid: 179,
  long: 229,
}

function normalizeDurationMonths(input?: number): number {
  if (!input || Number.isNaN(input)) return 3
  return Math.min(12, Math.max(1, Math.floor(input)))
}

function getTierByDuration(durationMonths?: number): LeadPriceTier {
  const months = normalizeDurationMonths(durationMonths)
  if (months <= 3) return 'short'
  if (months <= 6) return 'mid'
  return 'long'
}

/**
 * Gets booking-intent price by intended stay duration
 */
export function getLeadPrice(durationMonths?: number): LeadPricing {
  const tier = getTierByDuration(durationMonths)

  return {
    amount: TIER_PRICES[tier],
    tier,
    currency: 'EUR',
  }
}

/**
 * Formatea el precio para mostrar en UI
 */
export function formatLeadPrice(pricing: LeadPricing): string {
  return `€${pricing.amount}`
}

/**
 * Obtiene el precio en centavos para Stripe
 */
export function getLeadPriceInCents(durationMonths?: number): number {
  const pricing = getLeadPrice(durationMonths)
  return pricing.amount * 100
}

/**
 * Obtiene información de por qué este precio (para tooltips/info)
 */
export function getPricingRationale(tier: LeadPriceTier): string {
  switch (tier) {
    case 'short':
      return 'Best for 1-3 month stays'
    case 'mid':
      return 'Best for 4-6 month stays'
    case 'long':
      return 'Best for 7-12 month stays'
    default:
      return ''
  }
}
