'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { CITIES } from '@/config/cities'
import { useTranslations } from 'next-intl'

export function CityCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const t = useTranslations('home.heroCarousel')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CITIES.length)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
        {/* Carrusel de imágenes */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {CITIES.map((city, index) => (
            <div
              key={city.name}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
                fetchPriority={index === currentIndex ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Nombre de ciudad */}
              <div className="absolute top-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">{city.name}</span>
                </div>
              </div>

              {/* Subtitle */}
              <div className="absolute bottom-24 left-6 right-6">
                <p className="text-white text-lg font-semibold drop-shadow-lg">
                  {city.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-xl font-black text-blue-700">{t('stats.propertiesValue')}</p>
            <p className="text-xs text-gray-700 font-semibold">{t('stats.propertiesLabel')}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-black text-purple-700">{t('stats.citiesValue')}</p>
            <p className="text-xs text-gray-700 font-semibold">{t('stats.citiesLabel')}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-black text-green-700">{t('stats.verifiedValue')}</p>
            <p className="text-xs text-gray-700 font-semibold">{t('stats.verifiedLabel')}</p>
          </div>
        </div>

        {/* Indicadores de progreso (dots) - Fixed touch targets */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10 px-4">
          {CITIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex items-center justify-center rounded-full transition-all min-w-[48px] min-h-[48px] p-2 ${
                index === currentIndex 
                  ? 'bg-white shadow-md' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={`block h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-6 bg-gray-800' : 'w-2 bg-gray-600'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm rotate-3 z-20">
        {t('wifiBadge')}
      </div>
    </div>
  )
}
