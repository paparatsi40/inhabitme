import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Home, ChevronRight, MapPin, TrendingUp, Building2, ArrowRight, HelpCircle,
  Wifi, Clock, Euro, CheckCircle, Coffee, Train, Users
} from 'lucide-react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { listingRepository } from '@/lib/repositories/listing.repository'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { getRelatedNeighborhoods } from '@/config/neighborhoods'
import { getFAQs } from '@/config/faqs'
import { NeighborhoodMap } from '@/components/maps/NeighborhoodMap'
import { getNeighborhoodDescription } from '@/config/neighborhood-descriptions'

// ISR con revalidación cada 60 segundos
export const revalidate = 60

type PageProps = {
  params: {
    city: string
    neighborhood: string
  }
}

// Usar la misma configuración que [city]/page.tsx
const CITIES_CONFIG: Record<string, {
  name: string
  neighborhoods: Array<{ name: string; slug: string }>
}> = {
  madrid: {
    name: 'Madrid',
    neighborhoods: [
      { name: 'Malasaña', slug: 'malasana' },
      { name: 'Chamberí', slug: 'chamberi' },
      { name: 'Salamanca', slug: 'salamanca' },
      { name: 'Chueca', slug: 'chueca' },
      { name: 'Lavapiés', slug: 'lavapies' },
      { name: 'Retiro', slug: 'retiro' },
      { name: 'Centro', slug: 'centro' },
      { name: 'Las Letras', slug: 'las-letras' },
      { name: 'Huertas', slug: 'huertas' },
      { name: 'Justicia', slug: 'justicia' },
      { name: 'Sol', slug: 'sol' },
      { name: 'Gran Vía', slug: 'gran-via' },
      { name: 'Argüelles', slug: 'arguelles' },
      { name: 'Moncloa', slug: 'moncloa' },
      { name: 'Tetuán', slug: 'tetuan' },
      { name: 'Prosperidad', slug: 'prosperidad' },
    ],
  },
  barcelona: {
    name: 'Barcelona',
    neighborhoods: [
      { name: 'Gracia', slug: 'gracia' },
      { name: 'Eixample', slug: 'eixample' },
      { name: 'Gótico', slug: 'gotico' },
      { name: 'Born', slug: 'born' },
      { name: 'Raval', slug: 'raval' },
      { name: 'Poblenou', slug: 'poblenou' },
    ],
  },
  valencia: {
    name: 'Valencia',
    neighborhoods: [
      { name: 'Ruzafa', slug: 'ruzafa' },
      { name: 'El Carmen', slug: 'el-carmen' },
      { name: 'Benimaclet', slug: 'benimaclet' },
      { name: 'Centro', slug: 'centro' },
    ],
  },
  sevilla: {
    name: 'Sevilla',
    neighborhoods: [
      { name: 'Triana', slug: 'triana' },
      { name: 'Centro', slug: 'centro' },
      { name: 'Nervión', slug: 'nervion' },
      { name: 'Macarena', slug: 'macarena' },
    ],
  },
  lisboa: {
    name: 'Lisboa',
    neighborhoods: [
      { name: 'Baixa', slug: 'baixa' },
      { name: 'Chiado', slug: 'chiado' },
      { name: 'Alfama', slug: 'alfama' },
      { name: 'Bairro Alto', slug: 'bairro-alto' },
      { name: 'Príncipe Real', slug: 'principe-real' },
    ],
  },
  porto: {
    name: 'Porto',
    neighborhoods: [
      { name: 'Ribeira', slug: 'ribeira' },
      { name: 'Cedofeita', slug: 'cedofeita' },
      { name: 'Boavista', slug: 'boavista' },
      { name: 'Foz', slug: 'foz' },
    ],
  },
  'ciudad-de-mexico': {
    name: 'Ciudad de México',
    neighborhoods: [
      { name: 'Condesa', slug: 'condesa' },
      { name: 'Roma Norte', slug: 'roma-norte' },
      { name: 'Polanco', slug: 'polanco' },
      { name: 'Coyoacán', slug: 'coyoacan' },
      { name: 'Santa Fe', slug: 'santa-fe' },
    ],
  },
  'buenos-aires': {
    name: 'Buenos Aires',
    neighborhoods: [
      { name: 'Palermo', slug: 'palermo' },
      { name: 'Recoleta', slug: 'recoleta' },
      { name: 'San Telmo', slug: 'san-telmo' },
      { name: 'Belgrano', slug: 'belgrano' },
      { name: 'Puerto Madero', slug: 'puerto-madero' },
    ],
  },
  medellin: {
    name: 'Medellín',
    neighborhoods: [
      { name: 'El Poblado', slug: 'el-poblado' },
      { name: 'Laureles', slug: 'laureles' },
      { name: 'Envigado', slug: 'envigado' },
      { name: 'Sabaneta', slug: 'sabaneta' },
    ],
  },
}

/**
 * Normaliza slug a nombre (slug to title case)
 */
function slugToName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Genera todos los params estáticos para pre-renderizar páginas
 */
export async function generateStaticParams() {
  const params: Array<{ city: string; neighborhood: string }> = []
  
  // Generar params para cada ciudad y barrio
  Object.entries(CITIES_CONFIG).forEach(([citySlug, cityConfig]) => {
    cityConfig.neighborhoods.forEach((neighborhood) => {
      params.push({
        city: citySlug,
        neighborhood: neighborhood.slug,
      })
    })
  })
  
  return params
}

/**
 * Metadata dinámica por barrio
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const citySlug = params.city.toLowerCase()
  const neighborhoodSlug = params.neighborhood.toLowerCase()
  const cityConfig = CITIES_CONFIG[citySlug]
  
  if (!cityConfig) {
    return { title: 'Barrio no encontrado | inhabitme' }
  }

  const cityName = cityConfig.name
  const neighborhood = cityConfig.neighborhoods.find(n => n.slug === neighborhoodSlug)
  const neighborhoodName = neighborhood?.name || slugToName(neighborhoodSlug)
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inhabitme.com'

  return {
    title: `Alquiler mensual en ${neighborhoodName}, ${cityName} | inhabitme`,
    description: `Descubre ${neighborhoodName}, ${cityName}: alojamientos verificados para estancias de 1-12 meses. Viviendas con WiFi rápido, escritorio dedicado y espacios de trabajo. Ideal para nómadas digitales y profesionales remotos.`,
    
    keywords: [
      `alquiler mensual ${neighborhoodName}`,
      `alquiler ${neighborhoodName} ${cityName}`,
      `piso mensual ${neighborhoodName}`,
      'estancias medias',
      'vivienda nómadas digitales',
      'alquiler con WiFi',
    ],

    openGraph: {
      title: `Alquiler mensual en ${neighborhoodName}, ${cityName}`,
      description: `Alojamientos verificados en ${neighborhoodName} con workspace dedicado, WiFi rápido y precios claros. Estancias de 1-12 meses.`,
      url: `${baseUrl}/${citySlug}/${neighborhoodSlug}`,
      siteName: 'inhabitme',
      locale: 'es_ES',
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title: `Alquiler mensual en ${neighborhoodName}, ${cityName}`,
    },

    alternates: {
      canonical: `${baseUrl}/${citySlug}/${neighborhoodSlug}`,
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const citySlug = params.city.toLowerCase()
  const neighborhoodSlug = params.neighborhood.toLowerCase()
  const cityConfig = CITIES_CONFIG[citySlug]

  if (!cityConfig) {
    notFound()
  }

  const cityName = cityConfig.name
  const neighborhood = cityConfig.neighborhoods.find(n => n.slug === neighborhoodSlug)
  const neighborhoodName = neighborhood?.name || slugToName(neighborhoodSlug)

  // Buscar listings
  const listings = await listingRepository.search({
    city: cityName,
    neighborhood: neighborhoodName,
  })

  // Calcular stats
  const listingsCount = listings?.length || 0
  const minPrice =
    listings && listings.length > 0
      ? Math.min(...listings.map((l) => l.price.monthly))
      : 0

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        
        {/* Breadcrumbs PREMIUM con micro-copy */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav
              className="py-3 flex items-center gap-2 text-sm text-gray-600"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium">
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link 
                href={`/${citySlug}`} 
                className="hover:text-blue-600 transition-colors font-semibold group flex items-center gap-1.5"
              >
                <span>{cityName}</span>
                <span className="hidden sm:inline text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  (ver todos los barrios)
                </span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-semibold">{neighborhoodName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Hero PREMIUM */}
          <header className="mb-12">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200">
              <div className="grid lg:grid-cols-5 gap-8">
                
                {/* Content - 3 cols */}
                <div className="lg:col-span-3">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 text-blue-700 rounded-2xl text-sm font-bold mb-6">
                    <MapPin className="h-4 w-4" />
                    {neighborhoodName}, {cityName}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Vive en {neighborhoodName}
                  </h1>

                  {/* Description ÚNICA por barrio */}
                  <p className="text-lg lg:text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong className="text-gray-900">{neighborhoodName}:</strong> {getNeighborhoodDescription(citySlug, neighborhoodSlug, cityName, neighborhoodName)}
                  </p>

                  {/* CTA Comparar - NUEVO */}
                  <div className="mb-8">
                    <Link 
                      href={`/${citySlug}`}
                      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-base group"
                    >
                      <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span>Comparar con otros barrios de {cityName}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Stats */}
                  {listingsCount > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">Propiedades</span>
                        </div>
                        <span className="text-3xl font-black text-gray-900">{listingsCount}</span>
                      </div>

                      {minPrice > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Desde</span>
                          </div>
                          <span className="text-3xl font-black text-gray-900">€{minPrice.toLocaleString()}</span>
                          <span className="text-sm text-gray-600 font-medium">/mes</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Visual - 2 cols con MAPA REAL */}
                <div className="lg:col-span-2 relative">
                  <NeighborhoodMap 
                    city={cityName}
                    neighborhood={neighborhoodName}
                    className="h-64 lg:h-full min-h-[300px]"
                  />
                  
                  {/* Floating badge */}
                  {listingsCount > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg z-10">
                      <p className="text-sm font-bold text-gray-900">{listingsCount} propiedades</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </header>

          {/* Lifestyle Signals - NUEVO */}
          <section className="mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-black mb-6 text-gray-900">Por qué vivir en {neighborhoodName}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Wifi className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">WiFi Verificado</h3>
                    <p className="text-sm text-gray-600">Todas las propiedades con conexión rápida</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Coffee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Cafés & Coworking</h3>
                    <p className="text-sm text-gray-600">Espacios para trabajar cerca</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Train className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Bien Conectado</h3>
                    <p className="text-sm text-gray-600">Transporte público accesible</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Comunidad Local</h3>
                    <p className="text-sm text-gray-600">Ambiente auténtico y acogedor</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Listings PREMIUM */}
          {listingsCount > 0 ? (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                <div className="h-1 w-1 bg-purple-400 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                    Propiedades en {neighborhoodName}
                  </h2>
                  <p className="text-gray-600">
                    {listingsCount} alojamiento{listingsCount > 1 ? 's' : ''} verificado{listingsCount > 1 ? 's' : ''} con workspace dedicado
                  </p>
                </div>
                {minPrice > 0 && (
                  <div className="hidden sm:block bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-3 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Precio medio</p>
                    <p className="text-2xl font-black text-gray-900">€{minPrice.toLocaleString()}<span className="text-sm font-medium text-gray-600">/mes</span></p>
                  </div>
                )}
              </div>

              <ListingGrid listings={listings} />
            </section>
          ) : null}

        </div>

      </main>

      {/* BARRIOS RELACIONADOS PREMIUM */}
      <div className="bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {(() => {
            const relatedNeighborhoods = getRelatedNeighborhoods(citySlug, neighborhoodSlug)
            
            if (relatedNeighborhoods.length === 0) return null

            return (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  <div className="h-1 w-1 bg-blue-600 rounded-full"></div>
                  <div className="h-1 w-1 bg-blue-400 rounded-full"></div>
                </div>
                
                <div className="mb-10">
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
                    Otros barrios en {cityName}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl">
                    Cada barrio tiene su propia <strong>personalidad</strong>. Compara y encuentra tu match perfecto.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNeighborhoods.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/${citySlug}/${related.slug}`}
                      className="group relative bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                              {related.name}
                            </h3>
                            {related.description && (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {related.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 group-hover:scale-110 transition-all flex-shrink-0 ml-3" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                          <MapPin className="h-4 w-4" />
                          <span>Ver propiedades</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* CTA Premium */}
                <div className="mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl lg:text-3xl font-black mb-4">
                      ¿Buscas otras opciones en {cityName}?
                    </h3>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                      Explora todos los barrios disponibles y encuentra el lugar perfecto para tu próxima estancia
                    </p>
                    <Link href={`/${citySlug}`}>
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all font-bold text-lg px-8 py-6 shadow-xl"
                      >
                        Ver todos los barrios de {cityName}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            )
          })()}
        </div>
      </div>

      {/* Empty state PREMIUM */}
      {listingsCount === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <section className="text-center py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative max-w-3xl mx-auto px-6">
              <div className="inline-flex p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl mb-8">
                <Building2 className="h-16 w-16 text-purple-600" />
              </div>

              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
                Próximamente en {neighborhoodName}
              </h2>

              <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                Estamos trabajando para traerte las mejores opciones de alquiler mensual en{' '}
                <strong className="text-white">{neighborhoodName}</strong>. ¡Regístrate para ser el primero en saberlo!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all font-bold text-lg px-8 py-6 shadow-xl"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Notificarme cuando haya propiedades
                </Button>
                <Link href={`/${citySlug}`}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 font-bold text-lg px-8 py-6"
                  >
                    Ver otros barrios de {cityName}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Barrios relacionados chips */}
              <div className="pt-8 border-t border-white/20">
                <p className="text-base text-white/80 mb-6 font-medium">
                  Mientras tanto, explora estos barrios cercanos:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {cityConfig.neighborhoods
                    .filter(nb => nb.slug !== neighborhoodSlug)
                    .slice(0, 6)
                    .map(({ name, slug }) => (
                      <Link
                        key={slug}
                        href={`/${citySlug}/${slug}`}
                        className="px-5 py-3 bg-white/95 backdrop-blur-sm text-gray-900 border-2 border-white rounded-2xl font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg"
                      >
                        {name}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* FAQS PREMIUM */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {(() => {
            const faqs = getFAQs(cityName, neighborhoodName)
            
            return (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div className="h-1 w-1 bg-purple-600 rounded-full"></div>
                  <div className="h-1 w-1 bg-purple-400 rounded-full"></div>
                </div>
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                    <HelpCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                      Preguntas frecuentes
                    </h2>
                    <p className="text-gray-600 mt-1">Todo lo que necesitas saber sobre {neighborhoodName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-purple-500 hover:shadow-lg transition-all"
                    >
                      <summary className="cursor-pointer p-6 font-bold text-gray-900 hover:text-purple-600 transition-colors flex items-start gap-4">
                        <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-black rounded-xl flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-lg">{faq.question}</span>
                        <ArrowRight className="h-6 w-6 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-6 pb-6 pt-2 text-gray-700 leading-relaxed border-t-2 border-gray-100 bg-white">
                        <p className="pl-12">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>

                {/* Trust signal PREMIUM */}
                <div className="mt-10 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    ¿Más preguntas sobre alquilar en {neighborhoodName}?
                  </p>
                  <p className="text-gray-600">
                    Contáctanos y te ayudamos a encontrar tu espacio ideal para vivir y trabajar
                  </p>
                </div>
              </section>
            )
          })()}
        </div>
      </div>

      {/* FAQ SCHEMA.ORG */}
      {(() => {
        const faqs = getFAQs(cityName, neighborhoodName)
        
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        )
      })()}

      {/* Breadcrumb Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: 'https://inhabitme.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: cityName,
                item: `https://inhabitme.com/${citySlug}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: neighborhoodName,
                item: `https://inhabitme.com/${citySlug}/${neighborhoodSlug}`,
              },
            ],
          }),
        }}
      />
    </>
  )
}
