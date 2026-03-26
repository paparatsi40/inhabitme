'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { WaitlistModal } from '@/components/waitlist/WaitlistModal'
import { useTranslations } from 'next-intl'


interface AlternativeCity {
  name: string
  slug: string
  distance?: string
  properties: number
  priceFrom: number
  highlight: string
}

interface CityPageClientProps {
  cityName: string
  citySlug: string
  neighborhoods: Array<{ name: string; slug: string }>
  alternatives: AlternativeCity[]
}

export function CityPageClient({ cityName, citySlug, neighborhoods, alternatives }: CityPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const t = useTranslations('cityPage')

  return (
    <>
      <section className="text-center py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-3xl border-2 border-dashed border-blue-300 shadow-inner">
        <div className="inline-flex p-8 bg-white rounded-3xl shadow-xl mb-8">
          <Building2 className="h-16 w-16 text-blue-600" />
        </div>

        <h2 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('noPropertiesTitle', { city: cityName })}
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('noPropertiesDesc', { city: cityName })}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg px-8 py-6 text-lg rounded-lg transition-all hover:shadow-xl"
          >
            {t('notifyMeButton', { city: cityName })}
          </button>
          <Link href="/">
            <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg">
              {t('exploreOtherCities')}
            </Button>
          </Link>
        </div>

        {/* Mientras tanto, explora barrios */}
        <div className="mt-16 pt-10 border-t-2 border-gray-200">
          <p className="text-base font-semibold text-gray-700 mb-6">
            {t('exploreNeighborhoodsTitle', { city: cityName })}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {neighborhoods.slice(0, 8).map(({ name, slug }) => (
              <Link
                key={slug}
                href={`/${citySlug}/${slug}`}
                className="group rounded-2xl border border-purple-200 bg-purple-100 hover:bg-purple-200 hover:shadow-md transition-all h-24 flex items-center justify-center text-center px-4"
              >
                <span className="font-black text-base md:text-lg text-purple-900 group-hover:text-purple-950 transition leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cityName={cityName}
        citySlug={citySlug}
        alternatives={alternatives}
      />
    </>
  )
}
