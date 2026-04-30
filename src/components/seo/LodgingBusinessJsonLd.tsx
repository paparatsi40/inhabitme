import { JsonLd } from './JsonLd'
import { SEO_CONFIG } from '@/lib/seo/config'

/**
 * Schema.org LodgingBusiness — usar en páginas de ciudad.
 * Comunica a Google que la página representa un negocio/oferta de alojamiento.
 */
export function LodgingBusinessJsonLd({
  cityName,
  citySlug,
  locale,
  priceFrom,
  currency = 'USD',
  description,
  latitude,
  longitude,
}: {
  cityName: string
  citySlug: string
  locale: 'en' | 'es'
  priceFrom?: string | number
  currency?: 'USD' | 'EUR'
  description?: string
  latitude?: number
  longitude?: number
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: `${SEO_CONFIG.siteName} — ${cityName}`,
    url: `${SEO_CONFIG.baseUrl}/${locale}/${citySlug}`,
    description:
      description ??
      `Verified medium-term rentals (1–6 months) in ${cityName}. Remote-work-ready apartments, transparent flat fee.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
    },
    ...(priceFrom !== undefined && {
      priceRange: typeof priceFrom === 'number' ? `${priceFrom}+` : priceFrom,
      makesOffer: {
        '@type': 'Offer',
        priceCurrency: currency,
        price: priceFrom,
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(latitude !== undefined &&
      longitude !== undefined && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude,
          longitude,
        },
      }),
  }
  return <JsonLd data={data} id={`ld-lodging-${citySlug}`} />
}
