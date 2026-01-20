'use client'

import { Link } from '@/i18n/routing'
import NextLink from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  ArrowRight,
  Shield,
  FileCheck,
  Zap,
  Building2,
  Check,
  Euro,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  Wifi,
  Monitor,
  CheckCircle,
  Clock,
  Home,
  X
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CityCarousel } from '@/components/hero/CityCarousel'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

// Logic outside UI
import { calculateSavings } from '@/lib/use-cases/calculate-savings'

// Extracted component
import { SavingsCalculator } from '@/components/home/SavingsCalculator'

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const tHow = useTranslations('home.howItWorks');
  // 👉 Estado mínimo (permitido en page.tsx)
  const [months, setMonths] = useState(3)
  const [city, setCity] = useState('madrid')

  // 👉 Caso de uso (no lógica local)
  const savings = calculateSavings({ city, months })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation PREMIUM */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* House shape */}
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  {/* Roof */}
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  {/* Door */}
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl lg:text-2xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              {/* Show user button when signed in */}
              <SignedIn>
                <NextLink href="/en/dashboard">
                  <Button variant="ghost" className="font-semibold">
                    Dashboard
                  </Button>
                </NextLink>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              
              {/* Show sign in/up buttons when signed out */}
              <SignedOut>
                <NextLink href="/sign-in">
                  <Button variant="ghost" className="font-semibold">{tCommon('signIn')}</Button>
                </NextLink>
                <NextLink href="/sign-up">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
                    {tCommon('signUp')}
                  </Button>
                </NextLink>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero PREMIUM - Narrativa emocional */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Texto - Narrativa emocional */}
            <div>
              {/* Badge premium */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-2 border-blue-200 text-blue-700 rounded-2xl text-sm font-bold mb-6 shadow-sm">
                <Zap className="h-4 w-4" />
                {t('hero.badge')}
              </div>

              {/* Título GIGANTE con narrativa */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 lg:mb-8 leading-[1.1]">
                {t('hero.title')}
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              {/* Promesa emocional (no solo funcional) */}
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 lg:mb-10 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: t.raw('hero.subtitle')}} />


              {/* Value props chips ANTES de CTAs */}
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

              {/* CTAs mejorados */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#ciudades" className="flex-1 sm:flex-initial">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
                  >
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>

                <Link href="/properties/new" className="flex-1 sm:flex-initial">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg"
                  >
                    {t('hero.cta.secondary')}
                  </Button>
                </Link>
              </div>

              {/* Pricing badge - Transparencia desde el inicio */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-300 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Euro className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xl font-black text-gray-900">
                    {t('hero.pricingBadge')}
                  </p>
                </div>
                <p className="text-base text-gray-700 ml-13">
                  {t('hero.pricingSubtitle')}
                </p>
              </div>

              {/* Trust signal sutil */}
              <p className="text-sm text-gray-600 mt-6 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('hero.joinMessage')}
              </p>
            </div>

            {/* Visual - Carrusel dinámico de ciudades */}
            <CityCarousel />

          </div>
        </div>
      </section>

      {/* Por qué inhabitme - PREMIUM */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header de sección */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('whyInhabitme.title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{__html: t.raw('whyInhabitme.subtitle')}} />
          </div>

          {/* Grid mejorado */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <TrustItem
              icon={<Wifi className="h-8 w-8 text-green-600" />}
              title={t('whyInhabitme.verified.title')}
              text={t('whyInhabitme.verified.description')}
              gradient="from-green-50 to-emerald-50"
              borderColor="border-green-200"
            />
            <TrustItem
              icon={<Euro className="h-8 w-8 text-blue-600" />}
              title={t('whyInhabitme.transparent.title')}
              text={t('whyInhabitme.transparent.description')}
              gradient="from-blue-50 to-blue-100"
              borderColor="border-blue-200"
            />
            <TrustItem
              icon={<Clock className="h-8 w-8 text-purple-600" />}
              title={t('whyInhabitme.flexible.title')}
              text={t('whyInhabitme.flexible.description')}
              gradient="from-purple-50 to-purple-100"
              borderColor="border-purple-200"
            />
          </div>

          {/* CTA secundario */}
          <div className="mt-12 text-center">
            <Link href="/madrid">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold"
              >
                {t('whyInhabitme.cta')}
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* How it works - Pricing transparency */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tHow('title')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {tHow('subtitle')}
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Traditional platforms */}
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
                    <p className="text-base text-gray-600">{tHow('otherPlatforms.commissionDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.fees')}</p>
                    <p className="text-base text-gray-600">{tHow('otherPlatforms.feesDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.host')}</p>
                    <p className="text-base text-gray-600">{tHow('otherPlatforms.hostDesc')}</p>
                  </div>
                </li>
              </ul>

              {/* Example calculation */}
              <div className="mt-6 pt-6 border-t-2 border-red-200">
                <p className="text-base text-gray-600 mb-2">{tHow('example.title')}</p>
                <p className="text-2xl font-black text-red-600">€3,600 + €540 = €4,140</p>
                <p className="text-sm text-gray-500 mt-1">{tHow('example.inhabitme')}</p>
              </div>
            </div>

            {/* InhabitMe */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 relative overflow-hidden">
              {/* Badge destacado */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
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
                    <p className="text-base text-gray-600">{tHow('inhabitme.oneFeeDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.zeroCommission')}</p>
                    <p className="text-base text-gray-600">{tHow('inhabitme.zeroCommissionDesc')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.host')}</p>
                    <p className="text-base text-gray-600">{tHow('inhabitme.hostDesc')}</p>
                  </div>
                </li>
              </ul>

              {/* Example calculation */}
              <div className="mt-6 pt-6 border-t-2 border-green-200">
                <p className="text-base text-gray-600 mb-2">{tHow('example.title')}</p>
                <p className="text-2xl font-black text-green-600">€3,600 + €89 = €3,689</p>
                <p className="text-sm text-gray-500 mt-1">{tHow('example.inhabitme')}</p>
              </div>
            </div>
          </div>

          {/* Savings highlight */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <p className="text-lg font-semibold mb-2">{tHow('savings.badge')}</p>
            <p className="text-5xl font-black mb-2">{tHow('savings.amount')}</p>
            <p className="text-blue-100">{tHow('savings.description')}</p>
          </div>

          {/* How it benefits everyone */}
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

      {/* Ciudades disponibles - NUEVO */}
      <section id="ciudades" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Encuentra tu ciudad perfecta</h2>
            <p className="text-lg text-gray-600">Estancias medias en las mejores ciudades para nómadas digitales</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Madrid */}
            <CityCard
              slug="madrid"
              name="Madrid"
              subtitle="Capital de España"
              price="€800"
              gradient="from-blue-600 to-blue-800"
              hoverBorder="hover:border-blue-400"
              textColor="text-blue-600"
            />

            {/* Barcelona */}
            <CityCard
              slug="barcelona"
              name="Barcelona"
              subtitle="Mar y Modernismo"
              price="€900"
              gradient="from-purple-600 to-purple-800"
              hoverBorder="hover:border-purple-400"
              textColor="text-purple-600"
            />

            {/* Valencia */}
            <CityCard
              slug="valencia"
              name="Valencia"
              subtitle="Playa y calidad de vida"
              price="€700"
              gradient="from-green-600 to-emerald-800"
              hoverBorder="hover:border-green-400"
              textColor="text-green-600"
            />

            {/* Lisboa */}
            <CityCard
              slug="lisboa"
              name="Lisboa"
              subtitle="Fiscalidad favorable"
              price="€750"
              gradient="from-yellow-600 to-orange-700"
              hoverBorder="hover:border-orange-400"
              textColor="text-orange-600"
            />

            {/* Ciudad de México */}
            <CityCard
              slug="ciudad-de-mexico"
              name="Ciudad de México"
              subtitle="Capital digital de LatAm"
              price="€500"
              gradient="from-pink-600 to-red-700"
              hoverBorder="hover:border-pink-400"
              textColor="text-pink-600"
            />

            {/* Buenos Aires */}
            <CityCard
              slug="buenos-aires"
              name="Buenos Aires"
              subtitle="Cultura y tango"
              price="€400"
              gradient="from-cyan-600 to-blue-700"
              hoverBorder="hover:border-cyan-400"
              textColor="text-cyan-600"
            />

            {/* Medellín */}
            <CityCard
              slug="medellin"
              name="Medellín"
              subtitle="Eterna primavera"
              price="€450"
              gradient="from-emerald-600 to-green-700"
              hoverBorder="hover:border-emerald-400"
              textColor="text-emerald-600"
            />

            {/* Porto */}
            <CityCard
              slug="porto"
              name="Porto"
              subtitle="Vino y autenticidad"
              price="€650"
              gradient="from-indigo-600 to-purple-700"
              hoverBorder="hover:border-indigo-400"
              textColor="text-indigo-600"
            />

            {/* Sevilla */}
            <CityCard
              slug="sevilla"
              name="Sevilla"
              subtitle="Sol y flamenco"
              price="€600"
              gradient="from-amber-600 to-orange-700"
              hoverBorder="hover:border-amber-400"
              textColor="text-amber-600"
            />
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Preguntas frecuentes
            </h2>
            <p className="text-lg text-gray-600">
              Todo lo que necesitas saber sobre cómo funciona inhabitme
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="space-y-6">
            
            {/* Question 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                ¿Cuánto cuesta usar inhabitme?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                <strong className="text-blue-600">€89 fee único para el inquilino</strong> cuando el host acepta tu solicitud. 
                Es un <strong>pago único, no mensual</strong>. Sin comisiones sobre el alquiler, 
                sin porcentajes ocultos. Pagas una sola vez para obtener el contacto y coordinar todo directamente.
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                ¿Por qué es tan barato comparado con Airbnb?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                Porque cobramos un <strong>fee flat transparente</strong> (€89), no porcentajes sobre el alquiler. 
                Airbnb cobra 14-20% del total. En 3 meses de €1200/mes, Airbnb cobra €500-720. inhabitme solo €89. 
                Ahorras cientos de euros. Es un <strong>modelo más justo y transparente</strong>.
              </p>
            </div>

            {/* Question 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                ¿Qué obtengo exactamente por €89?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                <strong>Contacto directo verificado del host</strong> (email + teléfono) + 
                <strong className="text-purple-600"> garantía de respuesta en 48h</strong> o devolución del dinero. 
                inhabitme actúa como intermediario de confianza. Después del match, te comunicas directamente con el host para coordinar todo.
              </p>
            </div>

            {/* Question 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                ¿El host paga algo?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                Sí, el host paga <strong className="text-orange-600">€50 cuando acepta una solicitud</strong> (€80 si tiene Featured Listing activo).
                Los <strong>Founding Hosts 2026 no pagan nada</strong> (€0 fee durante todo 2026). 
                Esto asegura compromiso de ambas partes y permite que inhabitme opere de forma sostenible.
              </p>
            </div>

            {/* Question 5 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                ¿Cómo sé que el WiFi realmente funciona?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                Verificamos cada propiedad. El host debe <strong>demostrar velocidad &gt;50 Mbps</strong> con 
                test de velocidad. También pedimos fotos del espacio de trabajo. Solo listamos propiedades 
                <strong className="text-teal-600"> realmente aptas para trabajar</strong>.
              </p>
            </div>

            {/* Question 6 */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                ¿Puedo cancelar o cambiar fechas?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                inhabitme solo conecta. Las <strong>condiciones de estancia las negocias directamente</strong> con 
                el host. Tienes total flexibilidad para acordar fechas, cancelaciones y condiciones. 
                Recomendamos discutir esto antes de confirmar.
              </p>
            </div>

            {/* Question 7 */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">7</span>
                </div>
                ¿Qué pasa si el host no responde?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                <strong className="text-violet-600">Garantía de respuesta en 48h</strong>. Si el host no responde 
                en ese plazo, te devolvemos el 100% del pago. También enviamos automáticamente emails de 
                notificación al host para maximizar la tasa de respuesta.
              </p>
            </div>

            {/* Question 8 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">8</span>
                </div>
                ¿Es seguro el pago?
              </h3>
              <p className="text-gray-700 leading-relaxed ml-11">
                Sí. Usamos <strong>Stripe</strong>, la plataforma de pagos más segura del mundo. 
                inhabitme <strong>nunca ve ni almacena</strong> tus datos de tarjeta. Todo es procesado 
                de forma segura por Stripe con encriptación bancaria.
              </p>
            </div>

          </div>

          {/* CTA after FAQ */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              ¿Tienes más preguntas? Estamos aquí para ayudarte
            </p>
            <a href="mailto:hola@inhabitme.com" className="inline-block">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold"
              >
                Contactar soporte
              </Button>
            </a>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">
            ¿Listo para encontrar tu próximo hogar?
          </h2>
          <p className="text-xl lg:text-2xl mb-10 opacity-90">
            Únete a cientos de nómadas digitales que ya viven y trabajan en inhabitme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/madrid">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl px-10 py-6 text-lg"
              >
                Ver propiedades
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg"
              >
                Publicar mi espacio
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

/* Trust Item PREMIUM */
function TrustItem({
  icon,
  title,
  text,
  gradient = 'from-gray-50 to-gray-100',
  borderColor = 'border-gray-200'
}: {
  icon: React.ReactNode
  title: string
  text: string
  gradient?: string
  borderColor?: string
}) {
  return (
    <div className={`group relative bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 ${borderColor} hover:shadow-xl transition-all duration-300`}>
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`}></div>
      
      <div className="relative">
        {/* Icon con gradiente */}
        <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="font-black text-xl lg:text-2xl mb-3 text-gray-900">
          {title}
        </h3>
        
        {/* Text */}
        <p className="text-gray-600 leading-relaxed text-base">
          {text}
        </p>
      </div>
    </div>
  )
}

/* City Images - Unsplash curated - Urban landscapes */
const CITY_IMAGES: Record<string, string> = {
  'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80', // Palacio Real
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&q=80', // Sagrada Familia
  'valencia': 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop&q=80', // Valencia urbana
  'lisboa': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop&q=80', // Tranvía amarillo
  'ciudad-de-mexico': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&h=600&fit=crop&q=80', // Calles coloridas CDMX
  'buenos-aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop&q=80', // Obelisco
  'medellin': 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&h=600&fit=crop&q=80', // Comuna 13 colorida
  'porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop&q=80', // Puente Dom Luís
  'sevilla': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop&q=80', // Plaza de España
}

/* City Card Component with Real Images */
function CityCard({
  slug,
  name,
  subtitle,
  price,
  gradient,
  hoverBorder,
  textColor,
}: {
  slug: string
  name: string
  subtitle: string
  price: string
  gradient: string
  hoverBorder: string
  textColor: string
}) {
  const imageUrl = CITY_IMAGES[slug]
  
  return (
    <Link href={`/${slug}`} className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 ${hoverBorder}`}>
      <div className="aspect-[4/3] relative overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`${name} cityscape`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
          <span className="text-sm font-semibold text-gray-600">Desde {price}/mes</span>
          <span className={`text-sm font-bold ${textColor} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
            Ver propiedades <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
