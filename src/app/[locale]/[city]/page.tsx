import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Home, ChevronRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import { CityPageClient } from './CityPageClient'
import { CityPageWithListings } from './CityPageWithListings'
import { CITIES, getCityBySlug } from '@/config/cities'
import { listingRepository } from '@/lib/repositories/listing.repository'

type PageProps = {
  params: Promise<{
    city?: string
    locale?: string
  }>
}

function requireParam(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) notFound()
  return value
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const citySlug = requireParam(resolvedParams?.city).toLowerCase()
  const city = getCityBySlug(citySlug)

  if (!city) {
    return { title: 'Ciudad no encontrada | inhabitme' }
  }

  return {
    title: `Vive en ${city.name} | inhabitme`,
    description: city.description,
  }
}

export default async function CityPage({ params }: PageProps) {
  const resolvedParams = await params
  const citySlug = requireParam(resolvedParams?.city).toLowerCase()
  const locale = typeof resolvedParams?.locale === 'string' && resolvedParams.locale.trim() ? resolvedParams.locale : 'es'

  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const t = await getTranslations({ locale, namespace: 'cityPage' })
  const cityName = city.name

  // Get neighborhoods for this city
  const neighborhoods = city.neighborhoods || []

  // Buscar propiedades reales en esta ciudad
  const listings = await listingRepository.search({ city: cityName })
  const hasListings = listings && listings.length > 0

  // Get alternative cities (other cities with properties)
  const alternatives = CITIES
    .filter((c) => c.slug !== citySlug)
    .slice(0, 3)
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      properties: Math.floor(Math.random() * 50) + 20, // Placeholder
      priceFrom: Math.floor(Math.random() * 500) + 800,
      highlight: c.description.slice(0, 50) + '...',
    }))

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
                  {t('heroTitle', { city: cityName })}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-6 lg:mb-8 leading-relaxed">
                  {t('heroSubtitle')}
                </p>
                <Link href="/">
                  <Button>{t('backToHome')}</Button>
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

        {/* Neighborhoods Section - Client Component */}
        {hasListings ? (
          <CityPageWithListings
            cityName={cityName}
            citySlug={citySlug}
            listings={listings}
            neighborhoods={neighborhoods}
          />
        ) : (
          <CityPageClient
            cityName={cityName}
            citySlug={citySlug}
            neighborhoods={neighborhoods}
            alternatives={alternatives}
          />
        )}
      </div>
    </main>
  )
}
