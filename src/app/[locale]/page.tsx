'use client'

import { Link } from '@/i18n/routing'
import NextLink from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ClientNav } from '@/components/home/ClientNav'
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
import { calculateSavings } from '@/lib/use-cases/calculate-savings'
import { SavingsCalculator } from '@/components/home/SavingsCalculator'

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const tHow = useTranslations('home.howItWorks');
  const tFaq = useTranslations('home.faq');
  const tFaqSection = useTranslations('home.faqSection');
  const tCities = useTranslations('home.citiesSection');
  const tFinalCta = useTranslations('home.finalCtaSection');
  const [months, setMonths] = useState(3)
  const [city, setCity] = useState('madrid')
  const savings = calculateSavings({ city, months })

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
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
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
                <a href="#ciudades" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg">
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
              <p className="text-sm text-gray-600 mt-6 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('hero.joinMessage')}
              </p>
            </div>
            <CityCarousel />
          </div>
        </div>
      </section>

      {/* Rest of the page content... */}
      <section id="ciudades" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{tCities('title')}</h2>
            <p className="text-lg text-gray-600">{tCities('subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* City cards would go here */}
            <div className="text-center py-8 text-gray-500">
              City grid content loading...
            </div>
          </div>
        </div>
      </section>
      </main>
    </div>
  )
}
