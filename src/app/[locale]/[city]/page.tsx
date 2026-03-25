import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Home, ChevronRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { getCityBySlug, getAllCitySlugs } from '@/config/cities'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllCitySlugs().map((city) => ({
      locale,
      city,
    }))
  )
}

type PageProps = {
  params: Promise<{
    locale: string
    city: string
  }>
}

function safeLower(input: unknown): string {
  return typeof input === 'string' ? input.toLowerCase() : ''
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, city } = await params
  const localeSafe = safeLower(locale) || 'en'
  const citySlug = safeLower(city)

  const cityConfig = getCityBySlug(citySlug)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'

  if (!cityConfig) {
    return { title: 'Ciudad no encontrada | inhabitme' }
  }

  const canonical = `${baseUrl}/${localeSafe}/${citySlug}`

  return {
    title: `Vive en ${cityConfig.name} | inhabitme`,
    description: cityConfig.description,
    alternates: { canonical },
    openGraph: {
      title: `Vive en ${cityConfig.name} | inhabitme`,
      description: cityConfig.description,
      url: canonical,
      siteName: 'inhabitme',
      locale: localeSafe === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { locale, city } = await params
  const localeSafe = safeLower(locale) || 'en'
  const citySlug = safeLower(city)

  const t = await getTranslations({ locale: localeSafe, namespace: 'cityPage' })

  const cityConfig = getCityBySlug(citySlug)

  if (!cityConfig) {
    notFound()
  }

  const cityName = cityConfig.name
  const neighborhoods = cityConfig.neighborhoods

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
                  Espacios diseñados para <span className="text-blue-600 font-bold">nómadas digitales</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/">
                    <Button>Volver al inicio</Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="outline">Buscar propiedades</Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-2 relative h-64 sm:h-80 lg:h-auto overflow-hidden">
                <Image
                  src={cityConfig.image}
                  alt={cityName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-2xl sm:text-3xl font-black drop-shadow-lg">{cityName}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Coming soon */}
        <section className="text-center py-12">
          <div className="inline-flex p-8 bg-white rounded-3xl shadow-xl mb-8">
            <MapPin className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black mb-4">Próximamente en {cityName}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Estamos trabajando para traerte las mejores opciones de alquiler mensual en {cityName}.
          </p>
        </section>

        {/* Neighborhoods */}
        <section className="pb-10">
          <h3 className="text-2xl font-black text-gray-900 mb-4">Explora barrios en {cityName}</h3>
          <div className="flex flex-wrap gap-3">
            {neighborhoods.map((n) => (
              <Link
                key={n.slug}
                href={`/${citySlug}/${n.slug}`}
                className="px-5 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-bold text-sm hover:border-blue-500 hover:shadow-lg transition-all"
              >
                {n.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}