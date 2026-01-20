'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'
import { SearchFilters as SearchFiltersType } from '@/lib/domain/search-filters'
import { useState } from 'react'

export type SearchFiltersProps = {
  filters: SearchFiltersType
  onChange: (filters: SearchFiltersType) => void
  onApply: (filters: SearchFiltersType) => void
  onClear: () => void
}

export function SearchFiltersEnhanced({
  filters,
  onChange,
  onApply,
  onClear
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const hasActiveFilters = Object.values(filters).some(Boolean)

  // Contador de amenities seleccionadas
  const amenitiesCount = [
    filters.hasHeating,
    filters.hasAc,
    filters.hasElevator,
    filters.hasParking,
    filters.petsAllowed,
    filters.hasWashingMachine,
    filters.hasDryer,
    filters.hasDishwasher,
    filters.hasKitchen,
    filters.hasBalcony,
    filters.hasTerrace,
    filters.hasDoorman,
    filters.hasSecuritySystem,
    filters.hasSafe,
    filters.smokingAllowed,
    filters.hasDesk,
    filters.hasSecondMonitor,
    filters.furnished
  ].filter(Boolean).length

  const updateFilter = (key: keyof SearchFiltersType, value: any) => {
    onChange({
      ...filters,
      [key]: value || undefined
    })
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* FILTROS BÁSICOS - Siempre visibles */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <input
              value={filters.city ?? ''}
              onChange={(e) => updateFilter('city', e.target.value)}
              placeholder="Madrid"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Barrio */}
          <div>
            <label className="block text-sm font-medium mb-2">Barrio</label>
            <select
              value={filters.neighborhood ?? ''}
              onChange={(e) => updateFilter('neighborhood', e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos</option>
              {filters.city === 'Madrid' && (
                <>
                  <option value="Malasaña">Malasaña</option>
                  <option value="Chamberí">Chamberí</option>
                  <option value="Salamanca">Salamanca</option>
                  <option value="Chueca">Chueca</option>
                </>
              )}
            </select>
          </div>

          {/* Precio mínimo */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio mín. (€)</label>
            <input
              type="number"
              value={filters.minPrice ?? ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="800"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Precio máximo */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio máx. (€)</label>
            <input
              type="number"
              value={filters.maxPrice ?? ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="2000"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Habitaciones */}
          <div>
            <label className="block text-sm font-medium mb-2">Habitaciones</label>
            <select
              value={filters.bedrooms ?? ''}
              onChange={(e) => updateFilter('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todas</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        {/* Toggle filtros avanzados */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Amenities y Filtros Avanzados
            {amenitiesCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {amenitiesCount}
              </span>
            )}
          </button>
        </div>

        {/* FILTROS AVANZADOS - Expandible */}
        {showAdvanced && (
          <div className="space-y-6 pt-4 border-t">
            {/* ESENCIALES PARA NÓMADAS DIGITALES */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                💼 Espacio de Trabajo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasDesk ?? false}
                    onChange={(e) => updateFilter('hasDesk', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🪑 Escritorio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasSecondMonitor ?? false}
                    onChange={(e) => updateFilter('hasSecondMonitor', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🖥️ Monitor extra</span>
                </label>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">WiFi mínimo (Mbps)</label>
                  <input
                    type="number"
                    value={filters.minWifiSpeed ?? ''}
                    onChange={(e) => updateFilter('minWifiSpeed', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="50"
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CLIMA Y CONFORT */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                ❄️🔥 Clima y Confort
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasHeating ?? false}
                    onChange={(e) => updateFilter('hasHeating', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🔥 Calefacción</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasAc ?? false}
                    onChange={(e) => updateFilter('hasAc', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">❄️ Aire Acondicionado</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasBalcony ?? false}
                    onChange={(e) => updateFilter('hasBalcony', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🪴 Balcón</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasTerrace ?? false}
                    onChange={(e) => updateFilter('hasTerrace', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🌿 Terraza</span>
                </label>
              </div>
            </div>

            {/* HOGAR Y COMODIDADES */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                🏠 Hogar y Comodidades
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasKitchen ?? false}
                    onChange={(e) => updateFilter('hasKitchen', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🍳 Cocina equipada</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasWashingMachine ?? false}
                    onChange={(e) => updateFilter('hasWashingMachine', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">👕 Lavadora</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasDryer ?? false}
                    onChange={(e) => updateFilter('hasDryer', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🌬️ Secadora</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasDishwasher ?? false}
                    onChange={(e) => updateFilter('hasDishwasher', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🍽️ Lavavajillas</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.furnished ?? false}
                    onChange={(e) => updateFilter('furnished', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🛋️ Amueblado</span>
                </label>
              </div>
            </div>

            {/* EDIFICIO Y ACCESIBILIDAD */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                🏢 Edificio y Accesibilidad
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasElevator ?? false}
                    onChange={(e) => updateFilter('hasElevator', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🛗 Ascensor</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasParking ?? false}
                    onChange={(e) => updateFilter('hasParking', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🚗 Parking</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasDoorman ?? false}
                    onChange={(e) => updateFilter('hasDoorman', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">👔 Portero</span>
                </label>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Piso máximo</label>
                  <input
                    type="number"
                    value={filters.maxFloor ?? ''}
                    onChange={(e) => updateFilter('maxFloor', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="3"
                    className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* MASCOTAS Y ESTILO DE VIDA */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                🐾 Mascotas y Lifestyle
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.petsAllowed ?? false}
                    onChange={(e) => updateFilter('petsAllowed', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🐕 Pet Friendly</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.smokingAllowed ?? false}
                    onChange={(e) => updateFilter('smokingAllowed', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🚬 Se permite fumar</span>
                </label>
              </div>
            </div>

            {/* SEGURIDAD */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                🔒 Seguridad
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasSecuritySystem ?? false}
                    onChange={(e) => updateFilter('hasSecuritySystem', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🔐 Sistema de seguridad</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.hasSafe ?? false}
                    onChange={(e) => updateFilter('hasSafe', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">🔐 Caja fuerte</span>
                </label>
              </div>
            </div>

            {/* OTROS */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                ⭐ Destacados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.featured ?? false}
                    onChange={(e) => updateFilter('featured', e.target.checked || undefined)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm group-hover:text-blue-600">⭐ Solo Featured</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ACCIONES */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            onClick={() => onApply(filters)}
            className="flex-1 md:flex-initial"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClear}
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          )}

          <div className="ml-auto text-sm text-gray-600">
            {amenitiesCount > 0 && (
              <span className="hidden md:inline">
                {amenitiesCount} amenity{amenitiesCount !== 1 ? 's' : ''} seleccionada{amenitiesCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
