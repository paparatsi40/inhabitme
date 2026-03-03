import { Metadata } from 'next'
// UTF-8 clean file - redeploy trigger
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Home, ChevronRight, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

const CITIES_CONFIG: Record<string, { name: string; description: string }> = {
  madrid: { 
    name: 'Madrid', 
    description: 'Descubre Madrid: alojamientos verificados para estancias de 1-12 meses.'
  },
  barcelona: { 
    name: 'Barcelona', 
    description: 'Explora Barcelona: viviendas verificadas para estancias medias.'
  },
  valencia: { 
    name: 'Valencia', 
    description: 'Descubre Valencia: alojamientos para profesionales remotos.'
  },
  sevilla: { 
    name: 'Sevilla', 
    description: 'Alquiler mensual en Sevilla: viviendas con WiFi rapido.'
  },
  'ciudad-de-mexico': { 
    name: 'Ciudad de Mexico', 
    description: 'CDMX para nómadas digitales: alojamientos verificados.'
  },
  'buenos-aires': { 
    name: 'Buenos Aires', 
    description: 'Buenos Aires para remotos: departamentos con WiFi verificado.'
  },
  medellin: { 
    name: 'Medellin', 
    description: 'Medellin: capital digital de Colombia.'
  },
  lisboa: { 
    name: 'Lisboa', 
    description: 'Lisboa para nómadas: alojamientos en barrios auténticos.'
  },
  porto: { 
    name: 'Porto', 
    description: 'Porto: segunda ciudad de Portugal con escena tech creciente.'
  },
  austin: { 
    name: 'Austin', 
    description: 'Austin, Texas: capital tech del Lone Star State.'
  },
}

type PageProps = {
  params: {
    city: string
    locale: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const citySlug = params.city.toLowerCase()
  const config = CITIES_CONFIG[citySlug]
  
  if (!config) {
    return { title: 'Ciudad no encontrada | inhabitme' }
  }

  return {
    title: `Vive en ${config.name} | inhabitme`,
    description: config.description,
  }
}

export default async function CityPage({ params }: PageProps) {
  const citySlug = params.city.toLowerCase()
  const locale = params.locale || 'es'
  const t = await getTranslations({ locale, namespace: 'cityPage' })
  
  const config = CITIES_CONFIG[citySlug]

  if (!config) {
    notFound()
  }

  const cityName = config.name

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium">
            <Home className="h-4 w-4" />
            {t('breadcrumbHome') || 'Inicio'}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-semibold">{cityName}</span>
        </nav>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <header className="mb-12">
          <div className="bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-gray-200">
            <div className="grid lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-6 sm:p-8 lg:p-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 lg:mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  {t('heroTitle', { city: cityName }) || `Vive en ${cityName}`}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-6 lg:mb-8 leading-relaxed">
                  Espacios disenados para <span className="text-blue-600 font-bold">nómadas digitales</span>
                </p>
                <Link href="/">
                  <Button>Volver al inicio</Button>
                </Link>
              </div>

              <div className="lg:col-span-2 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Building2 className="h-20 w-20 mb-4 opacity-90" />
                  <p className="text-3xl font-black">{cityName}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="text-center py-16">
          <div className="inline-flex p-8 bg-white rounded-3xl shadow-xl mb-8">
            <MapPin className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black mb-4">
            Próximamente en {cityName}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos trabajando para traerte las mejores opciones de alquiler mensual en {cityName}.
          </p>
          <Link href="/">
            <Button size="lg">Explorar otras ciudades</Button>
          </Link>
        </section>
      </div>
    </main>
  )
}
