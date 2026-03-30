'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Building2, SlidersHorizontal } from 'lucide-react'

import { searchListings } from '@/lib/use-cases/search-listings'
import { SearchFilters as SearchFiltersType } from '@/lib/domain/search-filters'

import { SearchFiltersEnhanced } from '@/components/search/SearchFiltersEnhanced'
import { ListingGrid } from '@/components/listings/ListingGrid'

export default function SearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('searchPage')
  const locale = useLocale()

  // Helper para parsear booleanos de URL
  const parseBoolean = (value: string | null) => {
    if (value === 'true') return true
    if (value === 'false') return false
    return undefined
  }

  const [filters, setFilters] = useState<SearchFiltersType>({
    country: searchParams.get('country') || undefined,
    city: searchParams.get('city') || undefined,
    neighborhood: searchParams.get('neighborhood') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    minWifiSpeed: searchParams.get('minWifiSpeed') ? Number(searchParams.get('minWifiSpeed')) : undefined,
    hasDesk: parseBoolean(searchParams.get('hasDesk')),
    hasSecondMonitor: parseBoolean(searchParams.get('hasSecondMonitor')),
    hasHeating: parseBoolean(searchParams.get('hasHeating')),
    hasAc: parseBoolean(searchParams.get('hasAc')),
    hasBalcony: parseBoolean(searchParams.get('hasBalcony')),
    hasTerrace: parseBoolean(searchParams.get('hasTerrace')),
    hasWashingMachine: parseBoolean(searchParams.get('hasWashingMachine')),
    hasDryer: parseBoolean(searchParams.get('hasDryer')),
    hasDishwasher: parseBoolean(searchParams.get('hasDishwasher')),
    hasKitchen: parseBoolean(searchParams.get('hasKitchen')),
    hasElevator: parseBoolean(searchParams.get('hasElevator')),
    hasParking: parseBoolean(searchParams.get('hasParking')),
    hasDoorman: parseBoolean(searchParams.get('hasDoorman')),
    maxFloor: searchParams.get('maxFloor') ? Number(searchParams.get('maxFloor')) : undefined,
    petsAllowed: parseBoolean(searchParams.get('petsAllowed')),
    smokingAllowed: parseBoolean(searchParams.get('smokingAllowed')),
    hasSecuritySystem: parseBoolean(searchParams.get('hasSecuritySystem')),
    hasSafe: parseBoolean(searchParams.get('hasSafe')),
    furnished: parseBoolean(searchParams.get('furnished')),
    featured: parseBoolean(searchParams.get('featured')),
  })

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function runSearch() {
      setLoading(true)
      try {
        console.log('[SearchClient] Starting search with filters:', filters)
        const data = await searchListings(filters)
        console.log('[SearchClient] Received data:', data)
        console.log('[SearchClient] Data length:', data?.length)
        setResults(data)
      } catch (error) {
        console.error('[SearchClient] Search failed', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    runSearch()
  }, [filters])

  const applyFilters = (newFilters: SearchFiltersType) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value))
      }
    })

    router.push(`/${locale}/search?${params.toString()}`)
    setFilters(newFilters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    router.push(`/${locale}/search`)
    setFilters({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const showSkeletons = loading && results.length === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">inhabitme</span>
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost">{t('dashboard')}</Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>

        {/* Filters toggle */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t('filters')}
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-6">
            <SearchFiltersEnhanced
              filters={filters}
              onChange={setFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </div>
        )}

        {/* Results */}
        <div className="mt-10">
          {showSkeletons && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[340px] bg-gray-100 animate-pulse rounded-lg"
                />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('noListings')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('adjustFilters')}
              </p>
              <Button onClick={clearFilters}>
                {t('viewAllProperties')}
              </Button>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="text-gray-600 mb-6">
                {results.length}{' '}
                {results.length === 1
                  ? t('singleFound')
                  : t('multipleFound')}
              </p>

              <ListingGrid listings={results} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
