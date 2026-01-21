/**
 * Simple Tiered Pricing by Duration
 * InhabitMe charges based on stay duration (months)
 * Much simpler to explain and more aligned with value delivered
 */

export interface DurationFee {
  guestFee: number // in cents
  hostFee: number // in cents
  hostFeaturedFee: number // in cents (for featured listings)
  total: number // in cents
}

/**
 * Calculate fees based on booking duration in months
 * 
 * Tier structure:
 * - 1 month: €79 guest + €49 host = €128 total
 * - 2-3 months: €139 guest + €79 host = €218 total
 * - 4-6 months: €189 guest + €99 host = €288 total
 * - 7+ months: €239 guest + €119 host = €358 total
 * 
 * For comparison:
 * - Airbnb charges 15-20% = €180-360 on a 3-month €3,600 booking
 * - InhabitMe charges €218 = 6% (70% cheaper)
 */
export function calculateDurationFees(months: number): DurationFee {
  // Tier 1: 1 month
  if (months === 1) {
    return {
      guestFee: 7900, // €79
      hostFee: 4900, // €49
      hostFeaturedFee: 6900, // €69
      total: 12800 // €128
    }
  }
  
  // Tier 2: 2-3 months
  if (months >= 2 && months <= 3) {
    return {
      guestFee: 13900, // €139
      hostFee: 7900, // €79
      hostFeaturedFee: 9900, // €99
      total: 21800 // €218
    }
  }
  
  // Tier 3: 4-6 months
  if (months >= 4 && months <= 6) {
    return {
      guestFee: 18900, // €189
      hostFee: 9900, // €99
      hostFeaturedFee: 12900, // €129
      total: 28800 // €288
    }
  }
  
  // Tier 4: 7+ months
  return {
    guestFee: 23900, // €239
    hostFee: 11900, // €119
    hostFeaturedFee: 15900, // €159
    total: 35800 // €358
  }
}

/**
 * Get the tier name for display purposes
 */
export function getTierName(months: number): string {
  if (months === 1) return 'Tier 1 (1 month)'
  if (months >= 2 && months <= 3) return 'Tier 2 (2-3 months)'
  if (months >= 4 && months <= 6) return 'Tier 3 (4-6 months)'
  return 'Tier 4 (7+ months)'
}

/**
 * Format price in euros for display
 */
export function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(0)}`
}

/**
 * Get all tiers for display (e.g., in pricing page)
 */
export function getAllTiers() {
  return [
    { duration: '1 month', months: 1, ...calculateDurationFees(1) },
    { duration: '2-3 months', months: 2, ...calculateDurationFees(2) },
    { duration: '4-6 months', months: 4, ...calculateDurationFees(4) },
    { duration: '7+ months', months: 7, ...calculateDurationFees(7) },
  ]
}

/**
 * Example usage:
 * 
 * const booking = { duration: 3 } // 3 months
 * const fees = calculateDurationFees(booking.duration)
 * // Returns: { guestFee: 13900, hostFee: 7900, hostFeaturedFee: 9900, total: 21800 }
 * // Guest pays €139, host pays €79, total €218
 */
