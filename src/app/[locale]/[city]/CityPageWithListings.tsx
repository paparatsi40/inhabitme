'use client'

import { ListingGrid } from '@/components/listings/ListingGrid'
import type { Listing } from '@/lib/domain/listing'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'

function getNeighborhoodMapEmbedUrl(cityName: string, neighborhoodName: string): string {
  const query = encodeURIComponent(`${neighborhoodName}, ${cityName}`)
  return `https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=&q=${query}`
}

interface CityPageWithListingsProps {
  cityName: string
  citySlug: string
  listings: Listing[]
  neighborhoods: Array<{ name: string; slug: string }>
}

export function CityPageWithListings({
  cityName,
  citySlug,
  listings,
  neighborhoods
}: CityPageWithListingsProps) {
  const t = useTranslations('cityPage')

  return (
    <>
      {/* Sección de Propiedades */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('availableProperties') || 'Available Properties'}
            </h2>
            <p className="text-gray-600 mt-1">
              {listings.length} {listings.length === 1 ? 'property' : 'properties'} available
            </p>
          </div>
          <Link href={`/search?city=${cityName}`}>
            <Button variant="outline">
              {t('viewAll') || 'View all'}
            </Button>
          </Link>
        </div>

        <ListingGrid listings={listings} />
      </section>

      {/* Sección de Barrios */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('exploreNeighborhoodsTitle', { city: cityName }) || `Explore neighborhoods in ${cityName}`}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {neighborhoods.slice(0, 8).map(({ name, slug }) => (
            <Link
              key={slug}
              href={`/${citySlug}/${slug}`}
              className="group rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-blue-500 transition-all"
            >
              <div className="relative h-24">
                <iframe
                  src={getNeighborhoodMapEmbedUrl(cityName, name)}
                  title={`${name} map`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
              <div className="p-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-gray-700 group-hover:text-blue-700">{name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}