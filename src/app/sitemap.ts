import { MetadataRoute } from 'next'
import { listingRepository } from '@/lib/repositories/listing.repository'

// Configuración de ciudades (mismo que en [city]/page.tsx)
const CITIES_CONFIG = {
  madrid: {
    name: 'Madrid',
    neighborhoods: [
      { slug: 'malasana' },
      { slug: 'chamberi' },
      { slug: 'salamanca' },
      { slug: 'chueca' },
      { slug: 'lavapies' },
      { slug: 'retiro' },
      { slug: 'centro' },
      { slug: 'las-letras' },
      { slug: 'huertas' },
      { slug: 'justicia' },
      { slug: 'sol' },
      { slug: 'gran-via' },
      { slug: 'arguelles' },
      { slug: 'moncloa' },
      { slug: 'tetuan' },
      { slug: 'prosperidad' },
    ],
  },
  barcelona: {
    name: 'Barcelona',
    neighborhoods: [
      { slug: 'gracia' },
      { slug: 'eixample' },
      { slug: 'gotico' },
      { slug: 'born' },
      { slug: 'raval' },
      { slug: 'poblenou' },
    ],
  },
  valencia: {
    name: 'Valencia',
    neighborhoods: [
      { slug: 'ruzafa' },
      { slug: 'el-carmen' },
      { slug: 'benimaclet' },
      { slug: 'centro' },
    ],
  },
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // URLs estáticas base con múltiples locales
  const locales = ['en', 'es']
  const staticRoutes: MetadataRoute.Sitemap = []
  
  // Homepage para cada locale
  locales.forEach(locale => {
    staticRoutes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    })
    staticRoutes.push({
      url: `${BASE_URL}/${locale}/search`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    })
  })

  // URLs de ciudades para cada locale
  const cityRoutes: MetadataRoute.Sitemap = []
  locales.forEach(locale => {
    Object.keys(CITIES_CONFIG).forEach((citySlug) => {
      cityRoutes.push({
        url: `${BASE_URL}/${locale}/${citySlug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    })
  })

  // URLs de barrios (todas las combinaciones ciudad/barrio) para cada locale
  const neighborhoodRoutes: MetadataRoute.Sitemap = []
  locales.forEach(locale => {
    for (const [citySlug, cityConfig] of Object.entries(CITIES_CONFIG)) {
      for (const neighborhood of cityConfig.neighborhoods) {
        neighborhoodRoutes.push({
          url: `${BASE_URL}/${locale}/${citySlug}/${neighborhood.slug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      }
    }
  })

  // URLs de propiedades (dinámicas desde Supabase)
  let propertyRoutes: MetadataRoute.Sitemap = []

  try {
    // Timeout de 5 segundos para no bloquear el build
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Supabase timeout')), 5000)
    )

    const allListings = await Promise.race([
      listingRepository.search({}),
      timeoutPromise
    ])
    
    if (allListings && allListings.length > 0) {
      // Generar URLs para ambos locales
      propertyRoutes = allListings.flatMap((listing) => 
        locales.flatMap(locale => [
          {
            url: `${BASE_URL}/${locale}/listings/${listing.id}`,
            lastModified: listing.createdAt ? new Date(listing.createdAt) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          },
          {
            url: `${BASE_URL}/${locale}/properties/${listing.id}`,
            lastModified: listing.createdAt ? new Date(listing.createdAt) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          },
        ])
      )
    }

    console.log(`[Sitemap] Generated ${propertyRoutes.length} property URLs`)
  } catch (error) {
    console.error('[Sitemap] Error fetching properties:', error)
    // Si falla, continuar sin propiedades (mejor que fallar todo el sitemap)
  }

  // Combinar todas las rutas
  const allRoutes = [
    ...staticRoutes,
    ...cityRoutes,
    ...neighborhoodRoutes,
    ...propertyRoutes,
  ]

  console.log(`[Sitemap] Total URLs generated: ${allRoutes.length}`)
  console.log(`[Sitemap] Breakdown:`)
  console.log(`  - Static: ${staticRoutes.length}`)
  console.log(`  - Cities: ${cityRoutes.length}`)
  console.log(`  - Neighborhoods: ${neighborhoodRoutes.length}`)
  console.log(`  - Properties: ${propertyRoutes.length}`)

  return allRoutes
}
