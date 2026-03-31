'use client'

import { Link } from '@/i18n/routing'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

import { ClientNav } from '@/components/home/ClientNav'
import {
  ArrowRight,
  Zap,
  Euro,
  MapPin,
  Wifi,
  Monitor,
  CheckCircle,
  Clock,
  X
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CITIES } from '@/config/cities'

const FALLBACK_CITY_IMAGE = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=640&h=480&fit=crop&q=60'

function normalizeImageUrl(src?: string) {
  if (!src) return FALLBACK_CITY_IMAGE
  if (!src.startsWith('http://') && !src.startsWith('https://')) return FALLBACK_CITY_IMAGE

  try {
    const parsed = new URL(src)
    if (!parsed.hostname) return FALLBACK_CITY_IMAGE
    if (!parsed.searchParams.get('q')) parsed.searchParams.set('q', '60')
    return parsed.toString()
  } catch {
    return FALLBACK_CITY_IMAGE
  }
}

const CityCarousel = dynamic(
  () => import('@/components/hero/CityCarousel').then((mod) => mod.CityCarousel),
  {
    ssr: true,
    loading: () => <div className="aspect-[4/3] rounded-3xl border-2 border-gray-200 bg-white/60" />,
  }
)

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const tHow = useTranslations('home.howItWorks');
  const tFaq = useTranslations('home.faq');
  const tFaqSection = useTranslations('home.faqSection');
  const tCities = useTranslations('home.citiesSection');
  const tFinalCta = useTranslations('home.finalCtaSection');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-200 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl lg:text-2xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <ClientNav signIn={tCommon('signIn')} signUp={tCommon('signUp')} />
          </div>
        </div>
      </nav>

      <main id="main-content">
        <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-2 border-blue-200 text-blue-700 rounded-2xl text-sm font-bold mb-6 shadow-sm">
                <Zap className="h-4 w-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 lg:mb-8 leading-[1.1]">
                {t('hero.title')}
                <br />
                <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 lg:mb-10 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: t.raw('hero.subtitle')}} />
              <div className="flex flex-wrap gap-3 mb-8 lg:mb-10">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.wifi')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.workspace')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl">
                  <Euro className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.transparent')}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#ciudades" className="flex-1 sm:flex-initial min-h-11 inline-flex">
                  <Button size="lg" className="w-full sm:w-auto min-h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg">
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link href="/properties/new" className="flex-1 sm:flex-initial">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg">
                    {t('hero.cta.secondary')}
                  </Button>
                </Link>
              </div>
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-300 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Euro className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xl font-black text-gray-900">{t('hero.pricingBadge')}</p>
                </div>
                <p className="text-base text-gray-700 ml-13">{t('hero.pricingSubtitle')}</p>
              </div>
              <p className="text-sm text-gray-700 mt-6 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('hero.joinMessage')}
              </p>
            </div>
            <CityCarousel />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow-sm">
              {t('whyInhabitme.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto" dangerouslySetInnerHTML={{__html: t.raw('whyInhabitme.subtitle')}} />
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <TrustItem icon={<Wifi className="h-8 w-8 text-green-600" />} title={t('whyInhabitme.verified.title')} text={t('whyInhabitme.verified.description')} gradient="from-green-50 to-emerald-50" borderColor="border-green-200" />
            <TrustItem icon={<Euro className="h-8 w-8 text-blue-600" />} title={t('whyInhabitme.transparent.title')} text={t('whyInhabitme.transparent.description')} gradient="from-blue-50 to-blue-100" borderColor="border-blue-200" />
            <TrustItem icon={<Clock className="h-8 w-8 text-purple-600" />} title={t('whyInhabitme.flexible.title')} text={t('whyInhabitme.flexible.description')} gradient="from-purple-50 to-purple-100" borderColor="border-purple-200" />
          </div>
          <div className="mt-12 text-center">
            <Link href="/madrid">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold">
                {t('whyInhabitme.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tHow('title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto">{tHow('subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">{tHow('otherPlatforms.title')}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.commission')}</p>
                    <p className="text-base text-gray-700">{tHow('otherPlatforms.commissionDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.fees')}</p>
                    <p className="text-base text-gray-700">{tHow('otherPlatforms.feesDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.host')}</p>
                    <p className="text-base text-gray-700">{tHow('otherPlatforms.hostDesc')}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t-2 border-red-200">
                <p className="text-base text-gray-700 mb-2">{tHow('example.title')}</p>
                <p className="text-2xl font-black text-red-600">{tHow('example.otherPlatformTotal')}</p>
                <p className="text-sm text-gray-600 mt-1">{tHow('example.inhabitme')}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                {tHow('inhabitme.badge')}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">{tHow('inhabitme.title')}</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.oneFee')}</p>
                    <p className="text-base text-gray-700">{tHow('inhabitme.oneFeeDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.zeroCommission')}</p>
                    <p className="text-base text-gray-700">{tHow('inhabitme.zeroCommissionDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.host')}</p>
                    <p className="text-base text-gray-700">{tHow('inhabitme.hostDesc')}</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t-2 border-green-200">
                <p className="text-base text-gray-700 mb-2">{tHow('example.title')}</p>
                <p className="text-2xl font-black text-green-600">{tHow('example.inhabitmeTotal')}</p>
                <p className="text-sm text-gray-600 mt-1">{tHow('example.inhabitme')}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <p className="text-lg font-semibold mb-2">{tHow('savings.badge')}</p>
            <p className="text-5xl font-black mb-2">{tHow('savings.amount')}</p>
            <p className="text-blue-100">{tHow('savings.description')}</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{tHow('benefits.guest.title')}</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point1') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point2') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point3') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point4') }} />
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{tHow('benefits.host.title')}</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point1') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point2') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point3') }} />
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point4') }} />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="ciudades" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{tCities('title')}</h2>
            <p className="text-lg text-gray-700">{tCities('subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CITIES.map((city) => (
              <CityCard
                key={city.slug}
                slug={city.slug}
                name={city.name}
                subtitle={city.subtitle}
                price={city.price}
                gradient={city.gradient}
                hoverBorder={city.hoverBorder}
                textColor={city.textColor}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tFaqSection('title')}
            </h2>
            <p className="text-lg text-gray-700">{tFaqSection('subtitle')}</p>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                {tFaq('q1.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q1.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                {tFaq('q2.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q2.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                {tFaq('q3.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q3.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                {tFaq('q4.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q4.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                {tFaq('q5.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q5.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                {tFaq('q6.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q6.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">7</span>
                </div>
                {tFaq('q7.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q7.answer') }} />
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">8</span>
                </div>
                {tFaq('q8.question')}
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw('q8.answer') }} />
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-6">{tFaqSection('moreQuestions')}</p>
            <a href="mailto:hola@inhabitme.com" className="inline-block">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold">
                {tFaqSection('contactSupport')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{tFinalCta('title')}</h2>
          <p className="text-xl lg:text-2xl mb-10 opacity-90">{tFinalCta('subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/madrid">
              <Button size="lg" className="min-h-11 bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl px-10 py-6 text-lg">
                {tFinalCta('viewProperties')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg">
                {tFinalCta('listSpace')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
    </div>
  )
}

function TrustItem({ icon, title, text, gradient = 'from-gray-50 to-gray-100', borderColor = 'border-gray-200' }: { icon: React.ReactNode; title: string; text: string; gradient?: string; borderColor?: string }) {
  return (
    <div className={`group relative bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 ${borderColor} hover:shadow-xl transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`}></div>
      <div className="relative">
        <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
        </div>
        <h3 className="font-black text-xl lg:text-2xl mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-700 leading-relaxed text-base">{text}</p>
      </div>
    </div>
  )
}

function CityCard({ slug, name, subtitle, price, gradient, hoverBorder, textColor }: { slug: string; name: string; subtitle: string; price: string; gradient: string; hoverBorder: string; textColor: string }) {
  const city = CITIES.find(c => c.slug === slug)
  const imageUrl = city?.image
  return (
    <Link href={`/${slug}`} className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 ${hoverBorder}`}>
      <div className="aspect-[4/3] relative overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={normalizeImageUrl(imageUrl)}
              alt={`${name} cityscape`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 325px"
              quality={40}
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white opacity-90" />
            </div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <h3 className="text-2xl font-black text-white mb-1">{name}</h3>
          <p className="text-sm text-white/90">{subtitle}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">From {price}/month</span>
          <span className={`text-sm font-bold ${textColor} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
            View properties <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
