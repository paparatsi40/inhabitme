'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, X } from 'lucide-react'
import { SearchFilters as SearchFiltersType } from '@/lib/domain/search-filters'
import { getCurrencyFromLocation } from '@/lib/currency'

export type SearchFiltersProps = {
  filters: SearchFiltersType
  onChange: (filters: SearchFiltersType) => void
  onApply: (filters: SearchFiltersType) => void
  onClear: () => void
}

export function SearchFilters({
  filters,
  onChange,
  onApply,
  onClear
}: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)
  const currency = getCurrencyFromLocation(undefined, filters.city)
  const currencySymbol = currency === 'EUR' ? '€' : '$'

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-5 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <input
              value={filters.city ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  city: e.target.value || undefined,
                  neighborhood: undefined
                })
              }
              placeholder="Madrid"
              className="w-full p-2 border rounded-lg"
            />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Barrio
            </label>
            <select
              value={filters.neighborhood ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  neighborhood: e.target.value || undefined
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los barrios</option>

              {filters.city === 'Madrid' && (
                <>
                  <option value="Malasaña">Malasaña</option>
                  <option value="Chamberí">Chamberí</option>
                  <option value="Salamanca">Salamanca</option>
                </>
              )}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Precio mín. ({currencySymbol})
            </label>
            <input
              type="number"
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined
                })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Precio máx. ({currencySymbol})
            </label>
            <input
              type="number"
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: e.target.value
                    ? Number(e.target.value)
                    : undefined
                })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Habitaciones
            </label>
            <select
              value={filters.bedrooms ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  bedrooms: e.target.value
                    ? Number(e.target.value)
                    : undefined
                })
              }
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Todas</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <Button
              className="flex-1"
              onClick={() => onApply(filters)}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="icon"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
