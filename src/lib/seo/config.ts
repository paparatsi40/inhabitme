/**
 * SEO Configuration - Centralized SEO settings
 * 
 * This file contains all SEO-related configuration including:
 * - Base URLs and domains
 * - Open Graph default settings
 * - Twitter Card settings
 * - Structured data templates
 */

export const SEO_CONFIG = {
  // Base configuration
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com',
  siteName: 'InhabitMe',
  siteNameShort: 'InhabitMe',
  
  // Default metadata
  defaultTitle: {
    en: 'InhabitMe - Medium-term rentals for digital nomads',
    es: 'InhabitMe - Estancias sin sorpresas',
  },
  defaultDescription: {
    en: 'Find verified 1-6 month stays with dedicated workspace, fast WiFi, and transparent pricing in Madrid, Barcelona & Valencia.',
    es: 'Alojamientos verificados de 1-6 meses con workspace dedicado, WiFi rápido y precios claros en Madrid, Barcelona y Valencia.',
  },
  
  // Open Graph defaults
  openGraph: {
    type: 'website',
    defaultImage: '/og-image.png',
    imageWidth: 1200,
    imageHeight: 630,
    siteName: 'InhabitMe',
  },
  
  // Twitter defaults
  twitter: {
    card: 'summary_large_image' as const,
    // Twitter handle no configurado — eliminar cuando se cree la cuenta
    // site: '@inhabitme',
    // creator: '@inhabitme',
  },
  
  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  
  // Verification codes
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || '',
    // Add other verification codes as needed:
    // bing: process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE,
    // yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION_CODE,
  },
  
  // Language alternates
  languages: ['en', 'es'] as const,
  defaultLanguage: 'en' as const,
  
  // Structured data organization
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'InhabitMe',
    url: 'https://www.inhabitme.com',
    logo: 'https://www.inhabitme.com/icon.svg',
    description: 'Platform for medium-term rentals tailored for digital nomads and remote workers',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '',
      contactType: 'customer support',
      email: 'contact@inhabitme.com',
      availableLanguage: ['English', 'Spanish'],
    },
    sameAs: [
      // Add social media URLs when available
      // 'https://twitter.com/inhabitme',
      // 'https://www.facebook.com/inhabitme',
      // 'https://www.instagram.com/inhabitme',
      // 'https://www.linkedin.com/company/inhabitme',
    ],
  },
} as const

/**
 * Generate locale-aware URL
 */
export function getLocalizedUrl(path: string, locale: 'en' | 'es'): string {
  const baseUrl = SEO_CONFIG.baseUrl
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${baseUrl}/${locale}${cleanPath ? `/${cleanPath}` : ''}`
}

/**
 * Generate Open Graph image URL for city pages (dynamic)
 */
export function getCityOgImage(citySlug: string, cityName?: string): string {
  const params = new URLSearchParams({
    city: citySlug,
    ...(cityName && { title: `Medium-term rentals in ${cityName}` }),
  })
  return `${SEO_CONFIG.baseUrl}/api/og?${params.toString()}`
}

/**
 * Generate Open Graph image URL for property pages (dynamic)
 */
export function getPropertyOgImage(propertyTitle: string, city?: string): string {
  const params = new URLSearchParams({
    title: propertyTitle,
    ...(city && { city: city.toLowerCase() }),
    subtitle: 'Verified stay with workspace & fast WiFi',
  })
  return `${SEO_CONFIG.baseUrl}/api/og?${params.toString()}`
}

/**
 * Generate fallback Open Graph image
 */
export function getDefaultOgImage(): string {
  return `${SEO_CONFIG.baseUrl}/api/og`
}

/**
 * Get localized title
 */
export function getLocalizedTitle(key: keyof typeof SEO_CONFIG.defaultTitle, locale: 'en' | 'es'): string {
  return SEO_CONFIG.defaultTitle[locale]
}

/**
 * Get localized description
 */
export function getLocalizedDescription(key: keyof typeof SEO_CONFIG.defaultDescription, locale: 'en' | 'es'): string {
  return SEO_CONFIG.defaultDescription[locale]
}
