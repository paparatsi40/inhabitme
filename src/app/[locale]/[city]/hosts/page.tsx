import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Shield, CalendarRange, Handshake, Mail } from 'lucide-react'
import { getCityBySlug, getAllCitySlugs } from '@/config/cities'
import { SEO_CONFIG, getLocalizedUrl } from '@/lib/seo/config'
import { HostCtaButton } from '@/components/hosts/HostCtaButton'

/**
 * Landing de captación de anfitriones por ciudad.
 *
 *   /en/{city}/hosts
 *   /es/{city}/anfitriones   (re-export en ../anfitriones/page.tsx)
 *
 * Destino de las campañas de pago (Google Ads "…-Hosts-Search"). Un solo objetivo:
 * que el propietario pulse "Publicar mi piso". Sin navegación secundaria.
 */

type Params = Promise<{ locale: string; city: string }>

const HOST_FEES = [
  { key: 'm1', fee: 49 },
  { key: 'm2', fee: 79 },
  { key: 'm4', fee: 99 },
  { key: 'm7', fee: 119 },
] as const

/** Ruta localizada de esta landing para canonical/hreflang */
function hostsPath(citySlug: string, locale: 'en' | 'es') {
  return `${citySlug}/${locale === 'es' ? 'anfitriones' : 'hosts'}`
}

export async function generateStaticParams() {
  return getAllCitySlugs().flatMap((city) => [
    { locale: 'en', city },
    { locale: 'es', city },
  ])
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) return {}
  const loc = locale === 'es' ? 'es' : 'en'
  const t = await getTranslations({ locale: loc, namespace: 'cityHostsPage' })
  const url = getLocalizedUrl(hostsPath(citySlug, loc), loc)

  return {
    title: t('meta.title', { city: city.name }),
    description: t('meta.description', { city: city.name }),
    alternates: {
      canonical: url,
      languages: {
        en: getLocalizedUrl(hostsPath(citySlug, 'en'), 'en'),
        es: getLocalizedUrl(hostsPath(citySlug, 'es'), 'es'),
      },
    },
    openGraph: {
      title: t('meta.title', { city: city.name }),
      description: t('meta.description', { city: city.name }),
      url,
      siteName: SEO_CONFIG.siteName,
      type: 'website',
    },
    robots: { index: true, follow: true },
  }
}

export default async function CityHostsPage({ params }: { params: Params }) {
  const { locale, city: citySlug } = await params
  const city = getCityBySlug(citySlug)
  if (!city) notFound()

  const loc = locale === 'es' ? 'es' : 'en'
  const t = await getTranslations({ locale: loc, namespace: 'cityHostsPage' })
  const cityName = city.name
  // Moneda por país de la ciudad: los importes son los mismos en EUR y USD (decisión de producto)
  const currency = city.country === 'ES' || city.country === 'PT' ? '€' : '$'

  const benefits = [
    { key: 'noCommission', Icon: Shield },
    { key: 'longerStays', Icon: CalendarRange },
    { key: 'directContact', Icon: Handshake },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* HERO */}
      <section className="pt-20 lg:pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-semibold mb-6">
            {t('hero.badge', { city: cityName })}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.08] text-gray-900">
            {t('hero.title', { city: cityName })}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <HostCtaButton label={t('hero.cta')} city={citySlug} source="hero" />
          <p className="mt-4 text-sm text-gray-500">{t('hero.trust')}</p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-center mb-10 text-gray-900">
            {t('benefits.title', { city: cityName })}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map(({ key, Icon }) => (
              <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                <div className="inline-flex p-3 bg-white rounded-xl shadow-sm mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t(`benefits.${key}.title`)}</h3>
                <p className="text-gray-700">{t(`benefits.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-black mb-3 text-gray-900">{t('fees.title')}</h2>
            <p className="text-lg text-gray-700">{t('fees.subtitle')}</p>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-bold">{t('fees.duration')}</th>
                  <th className="text-right px-6 py-4 font-bold">{t('fees.hostFee')}</th>
                </tr>
              </thead>
              <tbody>
                {HOST_FEES.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{t(`fees.rows.${row.key}`)}</td>
                    <td className="px-6 py-4 text-right font-black text-green-700 tabular-nums">
                      {currency}{row.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4 max-w-xl mx-auto">{t('fees.disclaimer')}</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-center mb-10 text-gray-900">{t('how.title')}</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {(['step1', 'step2', 'step3'] as const).map((key, i) => (
              <li key={key} className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
                <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t(`how.${key}.title`)}</h3>
                <p className="text-gray-700">{t(`how.${key}.description`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black text-center mb-8 text-gray-900">
            {t('faq.title', { city: cityName })}
          </h2>
          <div className="space-y-3">
            {(['q1', 'q2', 'q3', 'q4'] as const).map((key) => (
              <details key={key} className="group bg-white border border-gray-200 rounded-xl px-5 py-4">
                <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-gray-900">
                  {t(`faq.${key}.q`)}
                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">{t(`faq.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-black mb-4">{t('finalCta.title', { city: cityName })}</h2>
          <p className="text-xl mb-8 opacity-90">{t('finalCta.subtitle')}</p>
          <HostCtaButton label={t('finalCta.button')} city={citySlug} source="final" variant="light" />
          <p className="mt-6 text-sm opacity-80 inline-flex items-center gap-2 justify-center">
            <Mail className="h-4 w-4" />
            {t('finalCta.support')}
          </p>
        </div>
      </section>
    </div>
  )
}
