'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Bed, Bath, Wifi, Check, Image as ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Listing } from '@/lib/domain/listing'
import { getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency'

type ListingGridProps = {
  listings: Listing[]
}

export function ListingGrid({ listings }: ListingGridProps) {
  const t = useTranslations('listings')

  // Empty state mejorado
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
          <ImageIcon className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {t('noPropertiesFound')}
        </h3>
        <p className="text-gray-500">
          {t('adjustFilters')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => {
        // Acceder a campos anidados del dominio con valores por defecto
        const mainImage = (listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
        const amenities = listing.amenities || {}
        const hasWorkspace = amenities.hasDesk || amenities.hasSecondMonitor
        const wifiSpeed = amenities.wifiSpeedMbps
        const price = listing.price || {}
        const monthlyPrice = price.monthly
        const city = listing.city || {}
        const cityName = city.name
        const cityCountry = city.country
        const currency = normalizeCurrency((price as any).currency ?? (listing as any).currency ?? getCurrencyFromLocation(cityCountry, cityName))
        const locale = currency === 'EUR' ? 'es-ES' : 'en-US'
        const monthlyPriceFormatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(monthlyPrice || 0))
        const neighborhoodName = listing.neighborhood?.name
        const availability = listing.availability || {}
        const minMonths = availability.minMonths
        const maxMonths = availability.maxMonths

        return (
          <Link
            key={listing.id}
            href={`/properties/${listing.id}`}
            className="group block rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white"
          >
            {/* Imagen Principal con Overlay */}
            <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badge de Workspace Verificado */}
              {hasWorkspace && (
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {t('workspace')}
                </div>
              )}

              {/* Badge de Amueblado */}
              {listing.amenities.furnished && (
                <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                  ✓ {t('furnished')}
                </div>
              )}
            </div>

            {/* Contenido del Card */}
            <div className="p-5">
              {/* Título */}
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {listing.title}
              </h3>

              {/* Ubicación */}
              <p className="text-sm text-gray-600 mb-3">
                📍 {neighborhoodName && `${neighborhoodName}, `}
                {cityName}, {cityCountry}
              </p>

              {/* Características Principales */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{listing.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{listing.bathrooms}</span>
                </div>
                {wifiSpeed && wifiSpeed >= 50 && (
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-xs">{wifiSpeed} Mbps</span>
                  </div>
                )}
              </div>

              {/* Precio y Estancia */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {monthlyPriceFormatted}
                    </p>
                    <p className="text-xs text-gray-500">{t('perMonth')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {minMonths}-{maxMonths} {t('months')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
