export const SUPPORTED_CURRENCIES = ['EUR', 'USD'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

const COUNTRY_TO_CURRENCY: Record<string, SupportedCurrency> = {
  ES: 'EUR',
  PT: 'EUR',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  FI: 'EUR',
  US: 'USD',
}

const CITY_TO_CURRENCY: Record<string, SupportedCurrency> = {
  madrid: 'EUR',
  barcelona: 'EUR',
  valencia: 'EUR',
  sevilla: 'EUR',
  lisboa: 'EUR',
  porto: 'EUR',
  'ciudad-de-mexico': 'USD',
  cdmx: 'USD',
  'buenos-aires': 'USD',
  medellin: 'USD',
  medellín: 'USD',
  austin: 'USD',
}

export function normalizeCurrency(input: unknown): SupportedCurrency {
  if (typeof input !== 'string') return 'EUR'
  const normalized = input.toUpperCase()
  return normalized === 'USD' ? 'USD' : 'EUR'
}

export function getCurrencyFromLocation(country?: string, city?: string): SupportedCurrency {
  const cityKey = city?.toLowerCase().trim()
  if (cityKey && CITY_TO_CURRENCY[cityKey]) {
    return CITY_TO_CURRENCY[cityKey]
  }

  const countryKey = country?.toUpperCase().trim()
  if (countryKey && COUNTRY_TO_CURRENCY[countryKey]) {
    return COUNTRY_TO_CURRENCY[countryKey]
  }

  return 'EUR'
}

export function toStripeCurrency(currency: SupportedCurrency): 'eur' | 'usd' {
  return currency.toLowerCase() as 'eur' | 'usd'
}

export function formatMoneyFromMinor(amountMinor: number, currency: SupportedCurrency, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  }).format((amountMinor || 0) / 100)
}
