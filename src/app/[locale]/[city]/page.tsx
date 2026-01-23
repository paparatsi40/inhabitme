import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Home, ChevronRight, MapPin, TrendingUp, Building2, Wifi, CheckCircle, Euro, Clock } from 'lucide-react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { listingRepository } from '@/lib/repositories/listing.repository'
import { Button } from '@/components/ui/button'
import { getNeighborhoodShortDescription } from '@/config/neighborhood-descriptions'
import { CityPageClient } from './CityPageClient'
import { generateCityMetadata } from '@/lib/seo/metadata-helpers'

/* City Images - Same as home page */
const CITY_IMAGES: Record<string, string> = {
  'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&q=80',
  'valencia': 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop&q=80',
  'sevilla': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop&q=80',
  'lisboa': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop&q=80',
  'porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop&q=80',
  'ciudad-de-mexico': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&h=600&fit=crop&q=80',
  'buenos-aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop&q=80',
  'medellin': 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&h=600&fit=crop&q=80',
}

/* Alternative cities recommendations */
const CITY_ALTERNATIVES: Record<string, Array<{ name: string; slug: string; distance?: string; highlight: string }>> = {
  'sevilla': [
    { name: 'Madrid', slug: 'madrid', distance: '2h en AVE', highlight: 'Capital con más opciones y gran comunidad de nómadas digitales' },
    { name: 'Valencia', slug: 'valencia', distance: 'Por la costa', highlight: 'Playa, clima mediterráneo y precios más accesibles' },
    { name: 'Lisboa', slug: 'lisboa', highlight: 'Clima similar, fiscalidad favorable para nómadas' },
  ],
  'porto': [
    { name: 'Lisboa', slug: 'lisboa', distance: '3h en tren', highlight: 'Más opciones, comunidad tech consolidada' },
    { name: 'Madrid', slug: 'madrid', highlight: 'Conexión directa, hub de España' },
    { name: 'Barcelona', slug: 'barcelona', highlight: 'Startups, tech y vida cosmopolita' },
  ],
  'medellin': [
    { name: 'Ciudad de México', slug: 'ciudad-de-mexico', highlight: 'Capital digital de LatAm, más opciones de alojamiento' },
    { name: 'Buenos Aires', slug: 'buenos-aires', highlight: 'Gran comunidad de nómadas, cultura vibrante' },
    { name: 'Barcelona', slug: 'barcelona', highlight: 'Si buscas Europa con buen clima' },
  ],
  // Default para ciudades sin alternativas específicas
  'default': [
    { name: 'Madrid', slug: 'madrid', highlight: 'Capital de España, máxima conectividad' },
    { name: 'Barcelona', slug: 'barcelona', highlight: 'Mar, arquitectura y vida cosmopolita' },
    { name: 'Lisboa', slug: 'lisboa', highlight: 'Fiscalidad favorable, comunidad internacional' },
  ],
}

// ISR con revalidación cada 60 segundos
export const revalidate = 60

type PageProps = {
  params: {
    city: string
  }
}

/**
 * Configuración de ciudades y barrios
 */
const CITIES_CONFIG: Record<string, {
  name: string
  neighborhoods: Array<{ name: string; slug: string }>
  description: string
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
    description: 'Descubre Madrid: alojamientos verificados para estancias de 1-12 meses. Viviendas con WiFi rápido, escritorio dedicado y espacios de trabajo. Ideal para nómadas digitales y profesionales remotos.',
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
    description: 'Explora Barcelona: viviendas verificadas para estancias medias. Perfectas para nómadas digitales con WiFi rápido y workspace dedicado.',
  },
  valencia: {
    name: 'Valencia',
    neighborhoods: [
      { name: 'Ruzafa', slug: 'ruzafa' },
      { name: 'El Carmen', slug: 'el-carmen' },
      { name: 'Benimaclet', slug: 'benimaclet' },
      { name: 'Centro', slug: 'centro' },
    ],
    description: 'Descubre Valencia: alojamientos para profesionales remotos con estancias de 1-12 meses. WiFi verificado y espacios de trabajo.',
  },
  sevilla: {
    name: 'Sevilla',
    neighborhoods: [
      { name: 'Triana', slug: 'triana' },
      { name: 'Centro', slug: 'centro' },
      { name: 'Nervión', slug: 'nervion' },
      { name: 'Macarena', slug: 'macarena' },
    ],
    description: 'Alquiler mensual en Sevilla: viviendas con WiFi rápido para nómadas digitales. Estancias flexibles de 1-12 meses en barrios auténticos.',
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
    description: 'CDMX para nómadas digitales: alojamientos verificados en las mejores colonias. WiFi rápido, espacios de coworking y comunidad de remotos.',
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
    description: 'Buenos Aires para remotos: departamentos con WiFi verificado en los mejores barrios. Estancias de 1-12 meses ideales para nómadas digitales.',
  },
  medellin: {
    name: 'Medellín',
    neighborhoods: [
      { name: 'El Poblado', slug: 'el-poblado' },
      { name: 'Laureles', slug: 'laureles' },
      { name: 'Envigado', slug: 'envigado' },
      { name: 'Sabaneta', slug: 'sabaneta' },
    ],
    description: 'Medellín: capital digital de Colombia. Alojamientos con WiFi de alta velocidad en las mejores zonas. Comunidad de nómadas consolidada.',
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
    description: 'Lisboa para nómadas: alojamientos en los barrios más auténticos. WiFi rápido, fiscalidad favorable y comunidad internacional.',
  },
  porto: {
    name: 'Porto',
    neighborhoods: [
      { name: 'Ribeira', slug: 'ribeira' },
      { name: 'Cedofeita', slug: 'cedofeita' },
      { name: 'Boavista', slug: 'boavista' },
      { name: 'Foz', slug: 'foz' },
    ],
    description: 'Porto: segunda ciudad de Portugal con escena tech creciente. Alojamientos verificados con WiFi rápido para estancias medias.',
  },
}

/**
 * Metadata dinámica por ciudad
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const citySlug = params.city.toLowerCase()
  
  // Excluir rutas que NO son ciudades
  const excludedRoutes = ['sign-in', 'sign-up', 'dashboard', 'properties', 'contact', 'faq', 'about', 'privacy', 'terms', 'cookies', 'search', 'bookings', 'host', 'leads', 'listings', 'onboarding', 'founding-host', 'founding-hosts', 'admin']
  if (excludedRoutes.includes(citySlug)) {
    return {}
  }
  
  const config = CITIES_CONFIG[citySlug]
  
  if (!config) {
    return {
      title: 'Ciudad no encontrada | inhabitme',
    }
  }

  const cityName = config.name
  const locale = (params.locale || 'es') as 'en' | 'es'
  const neighborhoods = config.neighborhoods?.map(n => n.slug) || []

  return generateCityMetadata({
    cityName,
    citySlug,
    description: config.description,
    locale,
    neighborhoods,
  })
}

export default async function CityPage({ params }: PageProps) {
  const citySlug = params.city.toLowerCase()
  
  // Excluir rutas que NO son ciudades (auth, etc)
  const excludedRoutes = ['sign-in', 'sign-up', 'dashboard', 'properties', 'contact', 'faq', 'about', 'privacy', 'terms', 'cookies', 'search', 'bookings', 'host', 'leads', 'listings', 'onboarding', 'founding-host', 'founding-hosts', 'admin']
  if (excludedRoutes.includes(citySlug)) {
    // Esta ruta no debería ser manejada por [city]
    notFound()
  }
  
  const config = CITIES_CONFIG[citySlug]

  // Si la ciudad no existe en la configuración, mostrar error
  if (!config) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center py-20">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">
            Ciudad no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            No encontramos la ciudad &quot;{params.city}&quot;
          </p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </main>
    )
  }

  const cityName = config.name
  const neighborhoods = config.neighborhoods

  // Buscar listings
  const listings = await listingRepository.search({
    city: cityName,
  })

  // Calcular stats (usando estructura del dominio)
  const listingsCount = listings?.length || 0
  const minPrice =
    listings && listings.length > 0
      ? Math.min(...listings.map((l) => l.price.monthly))
      : 0
  const avgPrice =
    listings && listings.length > 0
      ? Math.round(
          listings.reduce((sum, l) => sum + l.price.monthly, 0) / listings.length
        )
      : 0

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Breadcrumbs con backdrop */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-600"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-semibold">{cityName}</span>
          </nav>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* HERO PREMIUM - Landing page style */}
          <header className="mb-12 lg:mb-16">
            <div className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-gray-200">
              <div className="grid lg:grid-cols-5 gap-0">
                
                {/* Texto - 3 columnas en desktop */}
                <div className="lg:col-span-3 p-6 sm:p-8 lg:p-12">
                  {/* Badge contextual mejorado */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-bold mb-4 lg:mb-6 shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                    Estancias de 1 a 12 meses
                  </div>
                  
                  {/* Typography GRANDE y impactante */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 lg:mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Vive y trabaja en {cityName}
                  </h1>
                  
                  {/* Subheadline emocional */}
                  <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-6 lg:mb-8 leading-relaxed">
                    Espacios diseñados para <span className="text-blue-600 font-bold">nómadas digitales</span> y <span className="text-purple-600 font-bold">profesionales remotos</span>
                  </p>

                  {/* Stats DESTACADAS - Cards premium */}
                  {listingsCount > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-6 lg:mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-5 w-5 text-blue-600" />
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
                          <span className="text-3xl font-black text-gray-900">
                            €{minPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">/mes</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Value props - Chips mejorados */}
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2.5 rounded-xl border border-green-200">
                      <Wifi className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-bold text-gray-900">WiFi verificado</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2.5 rounded-xl border border-blue-200">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-bold text-gray-900">Sin burocracia</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-2.5 rounded-xl border border-purple-200">
                      <Euro className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-bold text-gray-900">Precio claro</span>
                    </div>
                  </div>
                  
                  {/* CTA visible en hero */}
                  {listingsCount > 0 && (
                    <div className="pt-2">
                      <a href="#propiedades" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Ver {listingsCount} propiedad{listingsCount > 1 ? 'es' : ''}
                        <ChevronRight className="h-5 w-5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Imagen contextual REAL - 2 columnas en desktop */}
                <div className="lg:col-span-2 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
                  {CITY_IMAGES[citySlug] ? (
                    <>
                      <img
                        src={CITY_IMAGES[citySlug]}
                        alt={`${cityName} cityscape`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 lg:pb-12 text-white">
                        <p className="text-3xl lg:text-4xl font-black drop-shadow-lg">{cityName}</p>
                        <p className="text-base lg:text-lg opacity-95 mt-2 font-medium drop-shadow-md">Tu próximo hogar</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700"></div>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Building2 className="h-20 w-20 lg:h-24 lg:w-24 mb-4 opacity-90" />
                        <p className="text-2xl lg:text-3xl font-bold">{cityName}</p>
                        <p className="text-sm lg:text-base opacity-90 mt-2">Tu próximo hogar</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ¿POR QUÉ VIVIR EN [CIUDAD]? - PREMIUM */}
          <section className="mb-12 lg:mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ¿Por qué elegir {cityName}?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Espacios diseñados específicamente para <strong>estancias medias</strong> y <strong>trabajo remoto</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Razón 1: Verificado para trabajo remoto */}
              <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                  <Wifi className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">
                  WiFi verificado y escritorio
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Todas las propiedades incluyen <strong className="text-gray-900">WiFi de alta velocidad</strong>, 
                  escritorio dedicado y ambiente tranquilo. <strong className="text-blue-600">100% listo para trabajar</strong>.
                </p>
              </div>

              {/* Razón 2: Transparencia de precios */}
              <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-green-400 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">
                  Precio claro, sin sorpresas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Precio mensual todo incluido. <strong className="text-gray-900">Sin tarifas ocultas</strong>, sin comisiones sorpresa. 
                  Sabes exactamente cuánto pagas desde el día 1.
                </p>
              </div>

              {/* Razón 3: Estancias flexibles */}
              <div className="group bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-purple-400 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-5 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">
                  De 1 a 12 meses, tú decides
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estancias medias pensadas para <strong className="text-gray-900">movilidad profesional</strong>. 
                  Sin compromisos eternos, <strong className="text-purple-600">sin burocracia compleja</strong>.
                </p>
              </div>
            </div>

            {/* Trust signal DESTACADO */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-bold text-gray-900">{listingsCount} propiedades verificadas</span>
                <span className="text-gray-600">en {cityName}</span>
              </div>
            </div>
          </section>

          {/* SECCIÓN DE BARRIOS - SHOWCASE PREMIUM */}
          <section id="barrios" className="mb-12 lg:mb-16">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-10">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-3xl lg:text-4xl font-black mb-3 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                    Explora barrios en {cityName}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Cada barrio tiene su propia <strong>personalidad</strong> y <strong>comunidad</strong>
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 rounded-xl shadow-sm">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-gray-900">{neighborhoods.length}</span>
                  <span className="text-gray-600">barrios</span>
                </div>
              </div>

              {/* Grid MEJORADO con descripciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {neighborhoods.map(({ name, slug }) => {
                  const shortDesc = getNeighborhoodShortDescription(citySlug, slug)
                  return (
                    <Link
                      key={slug}
                      href={`/${citySlug}/${slug}`}
                      className="group relative bg-white p-5 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-black text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {name}
                          </h3>
                        </div>
                        {shortDesc && (
                          <p className="text-sm text-gray-600 mb-3 pl-11">
                            {shortDesc}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-blue-600 group-hover:text-blue-700 font-medium transition-colors pl-11">
                          <span>Explorar</span>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Tip mejorado */}
              <div className="mt-8 p-5 bg-white rounded-2xl border-2 border-blue-200 shadow-sm">
                <p className="text-sm text-gray-700 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <span>
                    <strong className="text-gray-900">Consejo pro:</strong> Cada barrio de {cityName} tiene su vibe única. 
                    Haz click para ver <strong>qué hace especial</strong> a cada zona y encuentra tu match perfecto.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* LISTINGS SECTION PREMIUM */}
          {listingsCount > 0 ? (
            <section id="propiedades" className="scroll-mt-20">
              {/* Separador visual mejorado */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full"></div>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-base font-black shadow-lg">
                  ✨ Propiedades Disponibles
                </div>
                <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent rounded-full"></div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                    {listingsCount} propiedad{listingsCount > 1 ? 'es' : ''} en {cityName}
                  </h2>
                  <p className="text-base text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Todas con WiFi verificado y listas para trabajar
                  </p>
                </div>
                
                {/* Badge precio medio mejorado */}
                {avgPrice > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 px-5 py-3 rounded-2xl shadow-sm">
                    <p className="text-xs text-green-700 font-bold uppercase tracking-wide mb-1">Precio medio</p>
                    <p className="text-2xl font-black text-green-800">€{avgPrice.toLocaleString()}<span className="text-base font-medium">/mes</span></p>
                  </div>
                )}
              </div>

              <ListingGrid listings={listings} />
            </section>
          ) : (
            <CityPageClient
              cityName={cityName}
              citySlug={citySlug}
              neighborhoods={neighborhoods}
              alternatives={(CITY_ALTERNATIVES[citySlug] || CITY_ALTERNATIVES['default']).map(alt => ({
                ...alt,
                properties: 0,
                priceFrom: alt.slug === 'madrid' ? 800 : alt.slug === 'barcelona' ? 900 : alt.slug === 'valencia' ? 700 : alt.slug === 'lisboa' ? 750 : alt.slug === 'ciudad-de-mexico' ? 500 : alt.slug === 'buenos-aires' ? 400 : 750,
              }))}
            />
          )}
          
        </div>
      </main>

      {/* Schema.org JSON-LD para Rich Results */}
      {listingsCount > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `Alquiler mensual en ${cityName}`,
              description: config.description,
              numberOfItems: listingsCount,
              itemListElement: listings?.slice(0, 10).map((listing, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Apartment',
                  name: listing.title,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: listing.city.name,
                    addressCountry: listing.city.country,
                    addressRegion: listing.neighborhood?.name,
                  },
                  offers: {
                    '@type': 'Offer',
                    price: listing.price.monthly,
                    priceCurrency: listing.price.currency,
                    availability: 'https://schema.org/InStock',
                  },
                },
              })),
            }),
          }}
        />
      )}

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
            ],
          }),
        }}
      />
    </>
  )
}
