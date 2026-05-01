import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { CheckCircle, ArrowRight, Wifi, Calculator, Mail, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HostSavingsCalculator } from '@/components/hosts/HostSavingsCalculator'
import type { Metadata } from 'next'
import { SEO_CONFIG, getLocalizedUrl } from '@/lib/seo/config'

type LocaleParams = Promise<{ locale: string }>

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'listYourSpacePage' })
  const url = getLocalizedUrl('list-your-space', locale as 'en' | 'es')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: url,
      languages: {
        en: getLocalizedUrl('list-your-space', 'en'),
        es: getLocalizedUrl('list-your-space', 'es'),
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url,
      siteName: SEO_CONFIG.siteName,
      type: 'website',
    },
  }
}

export default async function ListYourSpacePage({ params }: { params: LocaleParams }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'listYourSpacePage' })

  // Tarifas por duración (mantener sincronizado con homepage)
  const fees = [
    { duration: '1 month', host: 49 },
    { duration: '2–3 months', host: 79 },
    { duration: '4–6 months', host: 99 },
    { duration: '7+ months', host: 119 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* HERO */}
      <section className="pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 text-green-700 rounded-2xl text-sm font-bold mb-6 shadow-sm">
            <Zap className="h-4 w-4" />
            {t('hero.badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-[1.1]">
            {t('hero.title')}
            <br />
            <span className="bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg px-8 py-6 text-lg">
              <Link href="/properties/new" className="inline-flex items-center">
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg">
              <Link href="/contact" className="inline-flex items-center">
                {t('hero.cta.secondary')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('benefits.title')}
            </h2>
            <p className="text-lg text-gray-700">{t('benefits.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(['noCommission', 'longerStays', 'verifiedTenants'] as const).map((key) => {
              const Icon = { noCommission: Shield, longerStays: Calculator, verifiedTenants: Wifi }[key]
              return (
                <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="inline-flex p-3 bg-white rounded-xl shadow-sm mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{t(`benefits.${key}.title`)}</h3>
                  <p className="text-gray-700">{t(`benefits.${key}.description`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEE TABLE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{t('fees.title')}</h2>
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
                {fees.map((row, i) => (
                  <tr key={row.duration} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{row.duration}</td>
                    <td className="px-6 py-4 text-right font-black text-green-600">${row.host} USD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">{t('fees.disclaimer')}</p>
        </div>
      </section>

      {/* SAVINGS CALCULATOR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <HostSavingsCalculator
            labels={{
              title: t('calculator.title'),
              description: t('calculator.description'),
              monthlyRentLabel: t('calculator.monthlyRentLabel'),
              monthlyRentPlaceholder: t('calculator.monthlyRentPlaceholder'),
              durationLabel: t('calculator.durationLabel'),
              durationUnitSingular: t('calculator.durationUnitSingular'),
              durationUnitPlural: t('calculator.durationUnitPlural'),
              results: {
                totalRevenue: t('calculator.results.totalRevenue'),
                airbnbFee: t('calculator.results.airbnbFee'),
                inhabitmeFee: t('calculator.results.inhabitmeFee'),
                yourSavings: t('calculator.results.yourSavings'),
                perStay: t('calculator.results.perStay'),
              },
              cta: t('calculator.cta'),
              disclaimer: t('calculator.disclaimer'),
            }}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{t('how.title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(['step1', 'step2', 'step3'] as const).map((key, i) => (
              <div key={key} className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{t(`how.${key}.title`)}</h3>
                <p className="text-gray-700">{t(`how.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{t('finalCta.title')}</h2>
          <p className="text-xl mb-10 opacity-90">{t('finalCta.subtitle')}</p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl px-10 py-6 text-lg">
            <Link href="/properties/new" className="inline-flex items-center">
              {t('finalCta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-6 text-sm opacity-75 inline-flex items-center gap-2 justify-center">
            <Mail className="h-4 w-4" />
            {t('finalCta.support')}
          </p>
        </div>
      </section>
    </div>
  )
}
