/**
 * Tiered Pricing System - Value-based fees
 * InhabitMe charges based on total booking value to capture fair value
 * while remaining significantly cheaper than competitors (Airbnb: 15-20%, Booking: 15-20%)
 */

export interface TieredFee {
  guestFee: number // in cents
  hostFee: number // in cents
  hostFeaturedFee: number // in cents (for featured listings)
  total: number // in cents
}

export interface BookingValue {
  monthlyRent: number // in cents
  months: number
  totalValue: number // in cents
}

/**
 * Calculate fees based on total booking value
 * 
 * Tier structure:
 * - €0-2,000: €89 guest + €50 host = €139 total (6.95% of €2k)
 * - €2,001-4,000: €149 guest + €89 host = €238 total (5.95% of €4k)
 * - €4,001-6,000: €199 guest + €119 host = €318 total (5.3% of €6k)
 * - €6,000+: €249 guest + €149 host = €398 total (6.63% of €6k, decreasing % as value increases)
 * 
 * For comparison:
 * - Airbnb charges 15-20% = €600-800 on a €4,000 booking
 * - InhabitMe charges €238 = 5.95% (75% cheaper)
 */
export function calculateTieredFees(bookingValue: BookingValue): TieredFee {
  const { totalValue } = bookingValue

  // Convert to euros for easier tier calculation
  const totalEuros = totalValue / 100

  if (totalEuros <= 2000) {
    // Tier 1: €0-2,000
    return {
      guestFee: 8900, // €89
      hostFee: 5000, // €50
      hostFeaturedFee: 8000, // €80
      total: 13900 // €139
    }
  } else if (totalEuros <= 4000) {
    // Tier 2: €2,001-4,000
    return {
      guestFee: 14900, // €149
      hostFee: 8900, // €89
      hostFeaturedFee: 13900, // €139
      total: 23800 // €238
    }
  } else if (totalEuros <= 6000) {
    // Tier 3: €4,001-6,000
    return {
      guestFee: 19900, // €199
      hostFee: 11900, // €119
      hostFeaturedFee: 16900, // €169
      total: 31800 // €318
    }
  } else {
    // Tier 4: €6,000+
    return {
      guestFee: 24900, // €249
      hostFee: 14900, // €149
      hostFeaturedFee: 19900, // €199
      total: 39800 // €398
    }
  }
}

/**
 * Get the tier name for display purposes
 */
export function getTierName(totalValue: number): string {
  const totalEuros = totalValue / 100

  if (totalEuros <= 2000) return 'Tier 1 (€0-2,000)'
  if (totalEuros <= 4000) return 'Tier 2 (€2,001-4,000)'
  if (totalEuros <= 6000) return 'Tier 3 (€4,001-6,000)'
  return 'Tier 4 (€6,000+)'
}

/**
 * Calculate percentage of booking value that fees represent
 * Useful for comparing with competitors
 */
export function calculateFeePercentage(fees: TieredFee, bookingValue: BookingValue): number {
  return (fees.total / bookingValue.totalValue) * 100
}

/**
 * Format price in euros for display
 */
export function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(0)}`
}

/**
 * Example usage:
 * 
 * const booking = {
 *   monthlyRent: 120000, // €1,200/month
 *   months: 3,
 *   totalValue: 360000 // €3,600
 * }
 * 
 * const fees = calculateTieredFees(booking)
 * // Returns: { guestFee: 14900, hostFee: 8900, hostFeaturedFee: 13900, total: 23800 }
 * // Guest pays €149, host pays €89, total €238 (vs Airbnb ~€750)
 */
