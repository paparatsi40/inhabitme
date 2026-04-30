import { JsonLd } from './JsonLd'
import { SEO_CONFIG } from '@/lib/seo/config'

/**
 * Schema.org Organization — debe ir en el layout raíz de cada idioma.
 * Sirve para que Google asocie logo, redes sociales y datos de contacto al dominio.
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    logo: `${SEO_CONFIG.baseUrl}/icon-512.png`,
    description:
      'Platform for medium-term rentals (1–6 months) tailored for digital nomads and remote workers. Flat fee, no commissions.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@inhabitme.com',
      availableLanguage: ['English', 'Spanish'],
    },
    sameAs: [
      'https://twitter.com/inhabitme',
      'https://instagram.com/inhabitme',
    ],
  }
  return <JsonLd data={data} id="ld-organization" />
}
