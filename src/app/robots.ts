import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://inhabitme.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // No indexar APIs
          '/dashboard/',     // No indexar dashboards privados
          '/sign-in',        // No indexar auth
          '/sign-up',        // No indexar auth
          '/onboarding',     // No indexar onboarding
          '/admin/',         // No indexar admin
          '/*.json',         // No indexar archivos JSON
          '/*?*',            // No indexar URLs con query params (evita duplicados)
        ],
      },
      {
        // Googlebot específico - más permisivo
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/sign-in',
          '/sign-up',
          '/onboarding',
          '/admin/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
