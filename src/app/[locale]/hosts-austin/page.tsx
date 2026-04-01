'use client'

import { ArrowRight, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function HostsAustinLocalizedPage() {
  const t = useTranslations('hostsAustin')

  const whyItems = [
    t('why.item1'),
    t('why.item2'),
    t('why.item3'),
    t('why.item4'),
    t('why.item5'),
  ]

  const austinAreas = [
    t('austinFocus.area1'),
    t('austinFocus.area2'),
    t('austinFocus.area3'),
    t('austinFocus.area4'),
  ]

  const earlyItems = [
    t('austinFocus.early1'),
    t('austinFocus.early2'),
    t('austinFocus.early3'),
  ]

  const howSteps = [
    t('how.step1'),
    t('how.step2'),
    t('how.step3'),
  ]

  const guestTypes = [
    t('guests.item1'),
    t('guests.item2'),
    t('guests.item3'),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 text-gray-900">
      <main>
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">{t('hero.title')}</h1>
            <p className="text-xl lg:text-2xl font-semibold text-gray-800 mb-3">
              {t('hero.line1')}
              <br />
              {t('hero.line2')}
            </p>
            <p className="text-lg text-gray-700 mb-8">{t('hero.subtitle')}</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 text-lg">
              <Link href="/properties/new">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-6 text-sm sm:text-base text-gray-700">{t('hero.microcopy')}</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black mb-8 text-center">{t('why.title')}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {whyItems.map((item) => (
                <div key={item} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 text-lg">
                <Link href="/properties/new">{t('why.cta')}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black mb-8 text-center">{t('compare.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8">
                <p className="text-2xl font-black mb-4">{t('compare.leftTitle')}</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2"><X className="h-5 w-5 text-red-500 mt-0.5" />{t('compare.left1')}</li>
                  <li className="flex items-start gap-2"><X className="h-5 w-5 text-red-500 mt-0.5" />{t('compare.left2')}</li>
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <p className="text-2xl font-black mb-4">{t('compare.rightTitle')}</p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />{t('compare.right1')}</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />{t('compare.right2')}</li>
                  <li className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />{t('compare.right3')}</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center font-bold text-lg">
              {t('compare.savings')}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{t('austinFocus.title')}</h2>
            <p className="text-lg text-gray-700 mb-8">{t('austinFocus.subtitle')}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
              {austinAreas.map((area) => (
                <div key={area} className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-semibold">• {area}</div>
              ))}
            </div>
            <p className="font-bold mb-4">{t('austinFocus.earlyTitle')}</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              {earlyItems.map((item) => (
                <div key={item} className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 text-lg">
              <Link href="/properties/new">{t('austinFocus.cta')}</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black mb-8 text-center">{t('how.title')}</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {howSteps.map((step, idx) => (
                <div key={step} className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">{idx + 1}</div>
                  <p className="font-semibold">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-lg font-bold">{t('how.footer')}</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-black mb-6">{t('guests.title')}</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {guestTypes.map((item) => (
                <div key={item} className="rounded-xl border border-gray-200 bg-gray-50 p-5 font-semibold">• {item}</div>
              ))}
            </div>
            <p className="text-gray-700">{t('guests.footer')}</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-black mb-8 text-center">{t('faq.title')}</h2>
            <div className="space-y-4">
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="font-bold cursor-pointer">{t('faq.q1')}</summary>
                <p className="mt-3 text-gray-700">{t('faq.a1')}</p>
              </details>
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="font-bold cursor-pointer">{t('faq.q2')}</summary>
                <p className="mt-3 text-gray-700">{t('faq.a2')}</p>
              </details>
              <details className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="font-bold cursor-pointer">{t('faq.q3')}</summary>
                <p className="mt-3 text-gray-700">{t('faq.a3')}</p>
              </details>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-4">{t('finalCta.title')}</h2>
            <p className="text-xl opacity-90 mb-8">{t('finalCta.subtitle')}</p>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100 font-bold px-10 py-6 text-lg">
              <Link href="/properties/new">
                {t('finalCta.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
