import type { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import {
  Home,
  ChevronRight,
  MapPin,
  TrendingUp,
  Building2,
  ArrowRight,
  HelpCircle,
  Wifi,
  CheckCircle,
  Coffee,
  Train,
  Users,
} from 'lucide-react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { listingRepository } from '@/lib/repositories/listing.repository'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import {
  getRelatedNeighborhoods,
  getCityConfig,
  getNeighborhoodConfig,
  getAllCityNeighborhoodParams,
} from '@/config/neighborhoods'
import { getFAQs } from '@/config/faqs'
import { NeighborhoodMap } from '@/components/maps/NeighborhoodMap'
import { getNeighborhoodDescription } from '@/config/neighborhood-descriptions'
import { getCurrencyFromLocation } from '@/lib/currency'
import { getTranslations } from 'next-intl/server'

// ISR con revalidación cada 60 segundos
export const revalidate = 60

type PageProps = {
  params: Promise<{
    locale: string
    city: string
    neighborhood: string
  }>
}

function safeLower(input: unknown): string {
  return typeof input === 'string' ? input.toLowerCase() : ''
}

/** Normaliza slug a nombre (slug to title case) */
function slugToName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

/** Genera todos los params estáticos para pre-renderizar páginas */
export async function generateStaticParams() {
  // Importante: esto solo devuelve city+neighborhood (Next inferirá locale en runtime con next-intl)
  return getAllCityNeighborhoodParams()
}

/** Metadata dinámica por barrio */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, city, neighborhood: neighborhoodSlugRaw } = await params
  const localeSafe = safeLower(locale) || 'en'
  const citySlug = safeLower(city)
  const neighborhoodSlug = safeLower(neighborhoodSlugRaw)

  const cityConfig = getCityConfig(citySlug)
  if (!cityConfig) return { title: localeSafe === 'es' ? 'Barrio no encontrado | inhabitme' : 'Neighborhood not found | inhabitme' }

  const neighborhood = getNeighborhoodConfig(citySlug, neighborhoodSlug)
  const cityName = cityConfig.name
  const neighborhoodName = neighborhood?.name || slugToName(neighborhoodSlug)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'
  const canonical = `${baseUrl}/${localeSafe}/${citySlug}/${neighborhoodSlug}`

  const isEs = localeSafe === 'es'

  const title = isEs
    ? `Alquiler medio plazo en ${neighborhoodName}, ${cityName} | inhabitme`
    : `Medium-term rentals in ${neighborhoodName}, ${cityName} | inhabitme`

  const description = isEs
    ? `Alojamientos verificados en ${neighborhoodName}, ${cityName}: estancias de 1-6 meses con WiFi rápido, escritorio dedicado y precios transparentes. Ideal para nómadas digitales.`
    : `Verified 1-6 month stays in ${neighborhoodName}, ${cityName}. Fast WiFi, dedicated workspace, and transparent pricing for digital nomads and remote workers.`

  const keywords = isEs
    ? [`alquiler medio plazo ${neighborhoodName}`, `alquiler ${neighborhoodName} ${cityName}`, 'nómadas digitales', 'alquiler con WiFi', 'estancias medias']
    : [`medium-term rental ${neighborhoodName}`, `furnished apartment ${neighborhoodName} ${cityName}`, 'digital nomads', 'remote work accommodation']

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'inhabitme',
      locale: isEs ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
    },
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/${citySlug}/${neighborhoodSlug}`,
        es: `${baseUrl}/es/${citySlug}/${neighborhoodSlug}`,
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { locale, city, neighborhood: neighborhoodSlugRaw } = await params
  const localeSafe = safeLower(locale) || 'en'
  const citySlug = safeLower(city)
  const neighborhoodSlug = safeLower(neighborhoodSlugRaw)
  const t = await getTranslations({ locale: localeSafe, namespace: 'neighborhoodPage' })
  const tNeighborhoods = await getTranslations({ locale: localeSafe, namespace: 'neighborhoods' })

  const cityConfig = getCityConfig(citySlug)
  const neighborhood = getNeighborhoodConfig(citySlug, neighborhoodSlug)

  if (!cityConfig || !neighborhood) notFound()

  const cityName = cityConfig.name
  const neighborhoodName = neighborhood.name

  // Buscar listings
  const listings = await listingRepository.search({
    city: cityName,
    neighborhood: neighborhoodName,
  })

  // Calcular stats
  const listingsCount = listings?.length || 0
  const minPrice =
    listings && listings.length > 0 ? Math.min(...listings.map((l) => l.price.monthly)) : 0
  const cityCurrency = getCurrencyFromLocation(undefined, cityConfig.slug)
  const moneyLocale = cityCurrency === 'EUR' ? 'es-ES' : 'en-US'
  const formatMajor = (amount: number) => new Intl.NumberFormat(moneyLocale, { style: 'currency', currency: cityCurrency }).format(amount || 0)
  const getNeighborhoodLongDescription = () => {
    const key = `${citySlug}.${neighborhoodSlug}`
    if (tNeighborhoods.has(key as any)) {
      return tNeighborhoods(key as any)
    }
    return getNeighborhoodDescription(citySlug, neighborhoodSlug, cityName, neighborhoodName)
  }

  const getRelatedCardDescription = (relatedSlug: string, fallback?: string) => {
    const key = `${citySlug}.${relatedSlug}`
    if (tNeighborhoods.has(key as any)) {
      const fullDescription = tNeighborhoods(key as any)
      const firstSentence = fullDescription.split('. ')[0]?.trim() || fullDescription
      const normalized = firstSentence.replace(/\.$/, '')
      return normalized.length > 70 ? `${normalized.slice(0, 67)}…` : normalized
    }
    return fallback || ''
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        {/* Breadcrumbs */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="py-3 flex items-center gap-2 text-sm text-gray-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium">
                <Home className="h-4 w-4" />
                {t('breadcrumbHome')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/${citySlug}`}
                className="hover:text-blue-600 transition-colors font-semibold group flex items-center gap-1.5"
              >
                <span>{cityName}</span>
                <span className="hidden sm:inline text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  ({t('viewAllNeighborhoods')})
                </span>
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-semibold">{neighborhoodName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Hero */}
          <header className="mb-12">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200">
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 text-blue-700 rounded-2xl text-sm font-bold mb-6">
                    <MapPin className="h-4 w-4" />
                    {neighborhoodName}, {cityName}
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    {t('liveIn')} {neighborhoodName}
                  </h1>

                  <p className="text-lg lg:text-xl text-gray-700 mb-6 leading-relaxed">
                    <strong className="text-gray-900">{neighborhoodName}:</strong>{' '}
                    {getNeighborhoodLongDescription()}
                  </p>

                  <div className="mb-8">
                    <Link
                      href={`/${citySlug}`}
                      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-base group"
                    >
                      <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span>{t('compareNeighborhoods')} {cityName}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {listingsCount > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">{t('properties')}</span>
                        </div>
                        <span className="text-3xl font-black text-gray-900">{listingsCount}</span>
                      </div>

                      {minPrice > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">{t('from')}</span>
                          </div>
                          <span className="text-3xl font-black text-gray-900">{formatMajor(minPrice)}</span>
                          <span className="text-sm text-gray-600 font-medium">{t('perMonth')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 relative">
                  <NeighborhoodMap
                    city={citySlug}
                    neighborhood={neighborhoodSlug}
                    className="h-64 lg:h-full min-h-[300px]"
                  />

                  {listingsCount > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg z-10">
                      <p className="text-sm font-bold text-gray-900">{listingsCount} {t('properties')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Lifestyle Signals */}
          <section className="mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-black mb-6 text-gray-900">{t('whyLive')} {neighborhoodName}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <Wifi className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('wifiVerified')}</h3>
                    <p className="text-sm text-gray-600">{t('wifiDescription')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Coffee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('coworking')}</h3>
                    <p className="text-sm text-gray-600">{t('coworkingDescription')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <Train className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('wellConnected')}</h3>
                    <p className="text-sm text-gray-600">{t('connectedDescription')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t('community')}</h3>
                    <p className="text-sm text-gray-600">{t('communityDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Listings */}
          {listingsCount > 0 ? (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                <div className="h-1 w-1 bg-purple-600 rounded-full" />
                <div className="h-1 w-1 bg-purple-400 rounded-full" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                    {t('monthlyRental')} {neighborhoodName}
                  </h2>
                  <p className="text-gray-600">
                    {listingsCount} {t('verifiedProperties')}
                  </p>
                </div>

                {minPrice > 0 && (
                  <div className="hidden sm:block bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-3 rounded-xl border-2 border-green-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">{t('averagePrice')}</p>
                    <p className="text-2xl font-black text-gray-900">
                      {formatMajor(minPrice)}
                      <span className="text-sm font-medium text-gray-600">{t('perMonth')}</span>
                    </p>
                  </div>
                )}
              </div>

              <ListingGrid listings={listings} />
            </section>
          ) : null}
        </div>
      </main>

      {/* Related neighborhoods */}
      <div className="bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {(() => {
            const relatedNeighborhoods = getRelatedNeighborhoods(citySlug, neighborhoodSlug)
            if (relatedNeighborhoods.length === 0) return null

            return (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
                  <div className="h-1 w-1 bg-blue-600 rounded-full" />
                  <div className="h-1 w-1 bg-blue-400 rounded-full" />
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">{t('relatedNeighborhoods')}</h2>
                  <p className="text-lg text-gray-600 max-w-3xl">
                    {t('relatedDescription')} {cityName} {t('nomadsLove')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNeighborhoods.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/${citySlug}/${related.slug}`}
                      className="group relative bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors mb-2">
                              {related.name}
                            </h3>
                            {getRelatedCardDescription(related.slug, related.description) && (
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {getRelatedCardDescription(related.slug, related.description)}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 group-hover:scale-110 transition-all flex-shrink-0 ml-3" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                          <MapPin className="h-4 w-4" />
                          <span>{t('ctaButton')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-12 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl lg:text-3xl font-black mb-4">{t('relatedCtaTitle')} {cityName}?</h3>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                      {t('relatedCtaDescription')}
                    </p>
                    <Link href={`/${citySlug}`}>
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all font-bold text-lg px-8 py-6 shadow-xl"
                      >
                        {t('relatedCtaButton')} {cityName}
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

      {/* Empty state */}
      {listingsCount === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <section className="text-center py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative max-w-3xl mx-auto px-6">
              <div className="inline-flex p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl mb-8">
                <Building2 className="h-16 w-16 text-purple-600" />
              </div>

              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">{t('noProperties')} {neighborhoodName}</h2>

              <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                {t('noPropertiesDescription')} <strong className="text-white">{neighborhoodName}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all font-bold text-lg px-8 py-6 shadow-xl"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {t('notifyMeButton')}
                </Button>

                <Link href={`/${citySlug}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 font-bold text-lg px-8 py-6"
                  >
                    {t('checkOtherNeighborhoods')} {cityName}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="pt-8 border-t border-white/20">
                <p className="text-base text-white/80 mb-6 font-medium">{t('exploreNearby')}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {cityConfig.neighborhoods
                    .filter((nb) => nb.slug !== neighborhoodSlug)
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

      {/* FAQ */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {(() => {
            const faqs = getFAQs(cityName, neighborhoodName)

            return (
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                  <div className="h-1 w-1 bg-purple-600 rounded-full" />
                  <div className="h-1 w-1 bg-purple-400 rounded-full" />
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                    <HelpCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900">{t('frequentlyAsked')}</h2>
                    <p className="text-gray-600 mt-1">{t('faqDescription')} {neighborhoodName}</p>
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

                <div className="mt-10 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    {t('moreQuestionsAboutRenting')} {neighborhoodName}?
                  </p>
                  <p className="text-gray-600">{t('contactHelpText')}</p>
                </div>
              </section>
            )
          })()}
        </div>
      </div>

      {/* FAQ Schema.org */}
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
                name: t('breadcrumbHome'),
                item: `https://www.inhabitme.com/${localeSafe}`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: cityName,
                item: `https://www.inhabitme.com/${localeSafe}/${citySlug}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: neighborhoodName,
                item: `https://www.inhabitme.com/${localeSafe}/${citySlug}/${neighborhoodSlug}`,
              },
            ],
          }),
        }}
      />
    </>
  )
}