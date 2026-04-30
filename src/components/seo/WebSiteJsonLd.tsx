import { JsonLd } from './JsonLd'
import { SEO_CONFIG } from '@/lib/seo/config'

/**
 * Schema.org WebSite + SearchAction — habilita la sitelinks search box en SERP.
 */
export function WebSiteJsonLd({ locale }: { locale: 'en' | 'es' }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: `${SEO_CONFIG.baseUrl}/${locale}`,
    inLanguage: locale === 'es' ? 'es-ES' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.baseUrl}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return <JsonLd data={data} id="ld-website" />
}
