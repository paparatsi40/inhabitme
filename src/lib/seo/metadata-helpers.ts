import { Metadata } from 'next'
import { SEO_CONFIG, getLocalizedUrl, getCityOgImage, getDefaultOgImage, getPropertyOgImage } from './config'

type Locale = 'en' | 'es'

type OGType = 'website' | 'article'

interface GenerateMetadataOptions {
  title: string
  description: string
  locale?: Locale
  path?: string
  keywords?: string[]
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
  type?: OGType
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

/**
 * Generate complete metadata for a page with Open Graph and Twitter cards
 */
export function generatePageMetadata({
  title,
  description,
  locale = 'en',
  path = '',
  keywords = [],
  images,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: GenerateMetadataOptions): Metadata {
  const url = getLocalizedUrl(path, locale)
  const fullTitle = title.includes('InhabitMe') ? title : `${title} | InhabitMe`
  
  // Use provided images or fallback to default
  const ogImages = images || [
    {
      url: getDefaultOgImage(),
      width: SEO_CONFIG.openGraph.imageWidth,
      height: SEO_CONFIG.openGraph.imageHeight,
      alt: title,
    },
  ]

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: authors ? authors.map(name => ({ name })) : [{ name: 'InhabitMe' }],
    creator: 'InhabitMe',
    publisher: 'InhabitMe',
    
    alternates: {
      canonical: url,
      languages: {
        'en': getLocalizedUrl(path, 'en'),
        'es': getLocalizedUrl(path, 'es'),
      },
    },

    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SEO_CONFIG.openGraph.siteName,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type,
      images: ogImages,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    twitter: {
      card: SEO_CONFIG.twitter.card,
      title: fullTitle,
      description,
      images: ogImages.map(img => img.url),
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
    },

    robots: SEO_CONFIG.robots,
  }

  // Add verification if available
  if (SEO_CONFIG.verification.google) {
    metadata.verification = {
      google: SEO_CONFIG.verification.google,
    }
  }

  return metadata
}

/**
 * Generate metadata for property/listing pages
 */
export function generatePropertyMetadata({
  property,
  locale = 'en',
}: {
  property: {
    id: string
    title: string
    description?: string
    city?: string
    neighborhood?: string
    monthlyPrice?: number
    images?: Array<{ url: string; alt?: string }>
  }
  locale?: Locale
}): Metadata {
  const cityText = property.city ? ` in ${property.city}` : ''
  const neighborhoodText = property.neighborhood ? `, ${property.neighborhood}` : ''
  const priceText = property.monthlyPrice ? ` - €${property.monthlyPrice}/month` : ''
  
  const title = `${property.title}${cityText}`
  const description = property.description || 
    `Verified medium-term rental${cityText}${neighborhoodText}. Workspace, fast WiFi, and transparent pricing${priceText}.`

  const keywords = [
    'medium-term rental',
    'furnished apartment',
    'digital nomad',
    'remote work',
    'coliving',
    ...(property.city ? [
      `rental ${property.city}`,
      `apartment ${property.city}`,
      `${property.city} accommodation`,
    ] : []),
    ...(property.neighborhood ? [
      `${property.neighborhood} rental`,
      `${property.neighborhood} apartment`,
    ] : []),
  ]

  // Use property images for Open Graph, or generate dynamic OG image
  const images = property.images && property.images.length > 0
    ? property.images.slice(0, 1).map(img => ({
        url: img.url,
        width: 1200,
        height: 630,
        alt: img.alt || property.title,
      }))
    : [
        {
          url: getPropertyOgImage(property.title, property.city),
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ]

  return generatePageMetadata({
    title,
    description,
    locale,
    path: `properties/${property.id}`,
    keywords,
    images,
    type: 'product',
  })
}

/**
 * Generate metadata for city pages
 */
export function generateCityMetadata({
  cityName,
  citySlug,
  description,
  locale = 'en',
  neighborhoods = [],
}: {
  cityName: string
  citySlug: string
  description: string
  locale?: Locale
  neighborhoods?: string[]
}): Metadata {
  const title = locale === 'en' 
    ? `Monthly Rentals in ${cityName}`
    : `Alquiler mensual en ${cityName}`
    
  const keywords = [
    `${citySlug} monthly rental`,
    `${citySlug} furnished apartment`,
    `${citySlug} digital nomad`,
    `${citySlug} coliving`,
    `${citySlug} medium-term stay`,
    `${citySlug} remote work`,
    ...neighborhoods.map(n => `${n} ${citySlug}`),
  ]

  // Generate dynamic city-specific image
  const images = [
    {
      url: getCityOgImage(citySlug, cityName),
      width: SEO_CONFIG.openGraph.imageWidth,
      height: SEO_CONFIG.openGraph.imageHeight,
      alt: `${cityName} - Medium-term rentals`,
    },
  ]

  return generatePageMetadata({
    title,
    description,
    locale,
    path: citySlug,
    keywords,
    images,
  })
}

/**
 * Generate structured data for properties (JSON-LD)
 */
export function generatePropertyStructuredData({
  property,
  locale = 'en',
}: {
  property: {
    id: string
    title: string
    description?: string
    monthlyPrice?: number
    images?: Array<{ url: string }>
    address?: {
      street?: string
      city?: string
      region?: string
      postalCode?: string
      country?: string
    }
  }
  locale?: Locale
}) {
  const url = getLocalizedUrl(`properties/${property.id}`, locale)
  
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url,
    ...(property.monthlyPrice && {
      offers: {
        '@type': 'Offer',
        price: property.monthlyPrice,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(property.images && property.images.length > 0 && {
      image: property.images.map(img => img.url),
    }),
    ...(property.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address.street,
        addressLocality: property.address.city,
        addressRegion: property.address.region,
        postalCode: property.address.postalCode,
        addressCountry: property.address.country || 'ES',
      },
    }),
  }
}
