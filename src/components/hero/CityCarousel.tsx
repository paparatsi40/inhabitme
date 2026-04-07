'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { CITIES } from '@/config/cities'

const FALLBACK_CITY_IMAGE = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=640&h=480&fit=crop&q=60'

function normalizeImageUrl(src?: string) {
  if (!src) return FALLBACK_CITY_IMAGE

  try {
    const parsed = new URL(src)
    if (!parsed.hostname) return FALLBACK_CITY_IMAGE

    // Next/Image remotePatterns in this project only allow HTTPS
    if (parsed.protocol === 'http:') parsed.protocol = 'https:'
    if (parsed.protocol !== 'https:') return FALLBACK_CITY_IMAGE

    if (!parsed.searchParams.get('q')) parsed.searchParams.set('q', '60')
    return parsed.toString()
  } catch {
    return FALLBACK_CITY_IMAGE
  }
}

interface CityCarouselMessages {
  stats: {
    propertiesValue: string
    propertiesLabel: string
    citiesValue: string
    citiesLabel: string
    verifiedValue: string
    verifiedLabel: string
  }
  wifiBadge: string
}

export function CityCarousel({ messages }: { messages: CityCarouselMessages }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentCity = CITIES[currentIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CITIES.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 min-h-[320px] sm:min-h-0">
        {/* Carrusel de imágenes */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <div key={currentCity.name} className="absolute inset-0 transition-opacity duration-700 opacity-100">
            <Image
              src={normalizeImageUrl(currentCity.image)}
              alt={currentCity.name}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 560px"
              quality={24}
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzYnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzYnIGZpbGw9JyNlNWU3ZWInLz48L3N2Zz4="
              priority={currentIndex === 0}
              fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Nombre de ciudad */}
            <div className="absolute top-6 left-6 right-6">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-gray-900">{currentCity.name}</span>
              </div>
            </div>

            {/* Subtitle */}
            <div className="absolute bottom-24 left-6 right-6">
              <p className="text-white text-lg font-semibold drop-shadow-lg">
                {currentCity.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-10 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 grid grid-cols-3 gap-2 sm:gap-3 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-2 sm:p-3 text-center shadow-lg">
            <p className="text-sm sm:text-xl font-black text-blue-700 leading-tight">{messages.stats.propertiesValue}</p>
            <p className="text-[11px] text-gray-700 font-semibold leading-tight mt-0.5">{messages.stats.propertiesLabel}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-2 sm:p-3 text-center shadow-lg">
            <p className="text-lg sm:text-2xl font-black text-purple-700 leading-tight">{messages.stats.citiesValue}</p>
            <p className="text-[11px] text-gray-700 font-semibold leading-tight mt-0.5">{messages.stats.citiesLabel}</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-2 sm:p-3 text-center shadow-lg">
            <p className="text-lg sm:text-2xl font-black text-green-700 leading-tight">{messages.stats.verifiedValue}</p>
            <p className="text-[11px] text-gray-700 font-semibold leading-tight mt-0.5">{messages.stats.verifiedLabel}</p>
          </div>
        </div>

        {/* Indicadores de progreso (dots) - separados de las cards */}
        <div className="absolute bottom-32 sm:bottom-20 left-0 right-0 flex justify-center gap-2 z-10 px-4">
          {CITIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="h-10 w-10 flex items-center justify-center rounded-full transition-all"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={`block h-3.5 w-3.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-white ring-2 ring-white/60' : 'bg-white/55 hover:bg-white/80'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm rotate-3 z-20">
        {messages.wifiBadge}
      </div>
    </div>
  )
}
