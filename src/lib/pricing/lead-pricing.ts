/**
 * Sistema de pricing dinámico por ciudad
 * 
 * Estrategia:
 * - Tier 1 (Premium): €19 - Ciudades top nómadas digitales
 * - Tier 2 (Standard): €12 - Ciudades emergentes
 * - Tier 3 (Growth): €9 - Ciudades en expansión
 */

export type LeadPriceTier = 'premium' | 'standard' | 'growth'

export interface LeadPricing {
  amount: number
  tier: LeadPriceTier
  currency: string
}

// Configuración de precios por ciudad
const CITY_PRICING_MAP: Record<string, LeadPriceTier> = {
  // Tier 1 - Premium (€19)
  'madrid': 'premium',
  'barcelona': 'premium',
  'ciudad-de-mexico': 'premium',
  'cdmx': 'premium',
  'lisboa': 'premium',
  'lisbon': 'premium',
  
  // Tier 2 - Standard (€12)
  'valencia': 'standard',
  'buenos-aires': 'standard',
  'porto': 'standard',
  'medellin': 'standard',
  'medellín': 'standard',
  
  // Tier 3 - Growth (€9)
  'sevilla': 'growth',
}

// Precios por tier
const TIER_PRICES: Record<LeadPriceTier, number> = {
  premium: 19,
  standard: 12,
  growth: 9,
}

/**
 * Obtiene el precio del lead para una ciudad específica
 */
export function getLeadPrice(city: string): LeadPricing {
  const cityNormalized = city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  const tier = CITY_PRICING_MAP[cityNormalized] || 'standard' // Default: standard
  
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
export function getLeadPriceInCents(city: string): number {
  const pricing = getLeadPrice(city)
  return pricing.amount * 100
}

/**
 * Obtiene información de por qué este precio (para tooltips/info)
 */
export function getPricingRationale(tier: LeadPriceTier): string {
  switch (tier) {
    case 'premium':
      return 'Ciudad con alta demanda de nómadas digitales'
    case 'standard':
      return 'Ciudad emergente para profesionales remotos'
    case 'growth':
      return 'Ciudad en expansión para la comunidad'
    default:
      return ''
  }
}
