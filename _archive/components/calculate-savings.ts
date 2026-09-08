export type SavingsInput = {
  city: string
  months: number
}

export type SavingsResult = {
  airbnb: number
  inhabitme: number
  savings: number
}

const PRICING_BY_CITY: Record<
  string,
  { airbnbMonthly: number; inhabitmeMonthly: number }
> = {
  madrid: { airbnbMonthly: 1800, inhabitmeMonthly: 1400 },
  barcelona: { airbnbMonthly: 1900, inhabitmeMonthly: 1500 },
  lisboa: { airbnbMonthly: 1600, inhabitmeMonthly: 1300 },
  porto: { airbnbMonthly: 1500, inhabitmeMonthly: 1200 },
  valencia: { airbnbMonthly: 1700, inhabitmeMonthly: 1350 }
}

export function calculateSavings({
  city,
  months
}: SavingsInput): SavingsResult {
  const pricing = PRICING_BY_CITY[city] ?? PRICING_BY_CITY.madrid

  const airbnbFees = pricing.airbnbMonthly * 0.15
  const cleaning = 150

  const totalAirbnb =
    (pricing.airbnbMonthly + airbnbFees) * months + cleaning * 2

  const totalInhabitme = pricing.inhabitmeMonthly * months

  return {
    airbnb: totalAirbnb,
    inhabitme: totalInhabitme,
    savings: totalAirbnb - totalInhabitme
  }
}
