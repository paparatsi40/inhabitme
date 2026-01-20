'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { loadGoogleMaps } from '@/lib/maps/google-maps-loader'

interface ListingMapProps {
  cityName?: string
  neighborhoodName?: string | null
  cityCountry?: string
}

// Coordenadas de barrios específicos (más zoom que city pages)
const NEIGHBORHOOD_COORDS: Record<string, Record<string, { lat: number; lng: number }>> = {
  madrid: {
    malasana: { lat: 40.4259, lng: -3.7047 },
    chamberi: { lat: 40.4378, lng: -3.7072 },
    salamanca: { lat: 40.4286, lng: -3.6797 },
    chueca: { lat: 40.4225, lng: -3.6967 },
    lavapies: { lat: 40.4087, lng: -3.7007 },
    retiro: { lat: 40.4153, lng: -3.6838 },
    centro: { lat: 40.4168, lng: -3.7038 },
  },
  barcelona: {
    gracia: { lat: 41.4036, lng: 2.1582 },
    eixample: { lat: 41.3930, lng: 2.1639 },
    gotico: { lat: 41.3828, lng: 2.1761 },
    born: { lat: 41.3856, lng: 2.1820 },
    raval: { lat: 41.3797, lng: 2.1688 },
    poblenou: { lat: 41.4020, lng: 2.2005 },
  },
  valencia: {
    ruzafa: { lat: 39.4630, lng: -0.3701 },
    'el-carmen': { lat: 39.4777, lng: -0.3774 },
    benimaclet: { lat: 39.4855, lng: -0.3520 },
    centro: { lat: 39.4699, lng: -0.3763 },
  },
}

// Fallback a coordenadas de ciudad
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'barcelona': { lat: 41.3851, lng: 2.1734 },
  'valencia': { lat: 39.4699, lng: -0.3763 },
  'sevilla': { lat: 37.3891, lng: -5.9845 },
  'lisboa': { lat: 38.7223, lng: -9.1393 },
  'porto': { lat: 41.1579, lng: -8.6291 },
  'ciudad-de-mexico': { lat: 19.4326, lng: -99.1332 },
  'buenos-aires': { lat: -34.6037, lng: -58.3816 },
  'medellin': { lat: 6.2476, lng: -75.5658 },
}

export function ListingMap({ cityName, neighborhoodName, cityCountry }: ListingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    let mounted = true
    
    const initMap = async () => {
      if (!mounted || !mapRef.current || mapInstanceRef.current) return

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        console.error('[ListingMap] Google Maps API key not found')
        if (mounted) setError('API key no configurada')
        return
      }

      try {
        await loadGoogleMaps(apiKey)
        
        if (!mounted || !mapRef.current || !window.google?.maps) return

        const citySlug = cityName?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') || 'madrid'
        const neighborhoodSlug = neighborhoodName?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
        
        // Buscar coordenadas del barrio específico, si no, usar ciudad
        let coordinates = CITY_COORDINATES[citySlug] || CITY_COORDINATES['madrid']
        let zoom = 15 // Más zoom que neighborhood pages (que usan 14-15)
        
        if (neighborhoodSlug && NEIGHBORHOOD_COORDS[citySlug]?.[neighborhoodSlug]) {
          coordinates = NEIGHBORHOOD_COORDS[citySlug][neighborhoodSlug]
          zoom = 16 // Aún más zoom para listing específico
        }

        const map = new google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        mapInstanceRef.current = map

        // Círculo mostrando área aproximada (no ubicación exacta)
        new google.maps.Circle({
          strokeColor: '#8B5CF6',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#8B5CF6',
          fillOpacity: 0.15,
          map,
          center: coordinates,
          radius: 300, // 300 metros de radio (más pequeño que neighborhood pages)
        })

        // Pin central
        new google.maps.Marker({
          position: coordinates,
          map,
          title: neighborhoodName || cityName || 'Ubicación',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#8B5CF6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        })

        if (mounted) setMapLoaded(true)
      } catch (err) {
        console.error('[ListingMap] Error initializing map:', err)
        if (mounted) setError('Error al inicializar el mapa')
      }
    }

    initMap()

    // Cleanup: NO intentar limpiar el DOM de Google Maps, solo marcar como desmontado
    return () => {
      mounted = false
      // NO hacemos mapInstanceRef.current = null para evitar conflictos con el DOM
    }
  }, [cityName, neighborhoodName])

  // Error state - fallback to placeholder
  if (error) {
    return (
      <div className="h-[320px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{cityName}, {cityCountry}</p>
          {neighborhoodName && (
            <p className="text-gray-500 text-sm mt-1">{neighborhoodName}</p>
          )}
          <p className="text-xs text-red-500 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className="h-[320px] rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
    >
      {!mapLoaded && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3 animate-bounce" />
            <p className="text-gray-600 font-medium">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}
