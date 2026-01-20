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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://inhabitme.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // URLs estáticas base
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0, // Homepage = máxima prioridad
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9, // Búsqueda = muy importante
    },
  ]

  // URLs de ciudades
  const cityRoutes: MetadataRoute.Sitemap = Object.keys(CITIES_CONFIG).map((citySlug) => ({
    url: `${BASE_URL}/${citySlug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8, // Ciudades = alta prioridad
  }))

  // URLs de barrios (todas las combinaciones ciudad/barrio)
  const neighborhoodRoutes: MetadataRoute.Sitemap = []
  
  for (const [citySlug, cityConfig] of Object.entries(CITIES_CONFIG)) {
    for (const neighborhood of cityConfig.neighborhoods) {
      neighborhoodRoutes.push({
        url: `${BASE_URL}/${citySlug}/${neighborhood.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7, // Barrios = prioridad media-alta
      })
    }
  }

  // URLs de propiedades (dinámicas desde Supabase)
  let propertyRoutes: MetadataRoute.Sitemap = []

  try {
    // Obtener TODAS las propiedades activas de Supabase
    const allListings = await listingRepository.search({}) // Sin filtros = todas
    
    if (allListings && allListings.length > 0) {
      // Generar URLs tanto para /listings/[id] como /properties/[id]
      // (ambas páginas existen y muestran propiedades)
      propertyRoutes = allListings.flatMap((listing) => [
        {
          url: `${BASE_URL}/listings/${listing.id}`,
          lastModified: listing.createdAt ? new Date(listing.createdAt) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.6, // Propiedades = prioridad media
        },
        {
          url: `${BASE_URL}/properties/${listing.id}`,
          lastModified: listing.createdAt ? new Date(listing.createdAt) : now,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        },
      ])
    }

    console.log(`[Sitemap] Generated ${propertyRoutes.length} property URLs (listings + properties)`)
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
