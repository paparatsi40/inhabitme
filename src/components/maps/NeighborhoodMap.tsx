'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface NeighborhoodMapProps {
  city: string
  neighborhood: string
  className?: string
}

// Coordenadas de barrios conocidos (puedes expandir esto)
const NEIGHBORHOOD_COORDS: Record<string, Record<string, { lat: number; lng: number; zoom: number }>> = {
  madrid: {
    malasana: { lat: 40.4259, lng: -3.7047, zoom: 15 },
    chamberi: { lat: 40.4378, lng: -3.7072, zoom: 15 },
    salamanca: { lat: 40.4286, lng: -3.6797, zoom: 15 },
    chueca: { lat: 40.4225, lng: -3.6967, zoom: 16 },
    lavapies: { lat: 40.4087, lng: -3.7007, zoom: 15 },
    retiro: { lat: 40.4153, lng: -3.6838, zoom: 15 },
    centro: { lat: 40.4168, lng: -3.7038, zoom: 14 },
  },
  barcelona: {
    gracia: { lat: 41.4036, lng: 2.1582, zoom: 15 },
    eixample: { lat: 41.3930, lng: 2.1639, zoom: 14 },
    gotico: { lat: 41.3828, lng: 2.1761, zoom: 16 },
    born: { lat: 41.3856, lng: 2.1820, zoom: 16 },
    raval: { lat: 41.3797, lng: 2.1688, zoom: 16 },
    poblenou: { lat: 41.4020, lng: 2.2005, zoom: 15 },
  },
  valencia: {
    ruzafa: { lat: 39.4630, lng: -0.3701, zoom: 15 },
    'el-carmen': { lat: 39.4777, lng: -0.3774, zoom: 16 },
    benimaclet: { lat: 39.4855, lng: -0.3520, zoom: 15 },
    centro: { lat: 39.4699, lng: -0.3763, zoom: 14 },
  },
}

export function NeighborhoodMap({ city, neighborhood, className = '' }: NeighborhoodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Verificar si ya está cargado
      if (window.google?.maps) {
        initMap()
        return
      }

      // Cargar Google Maps
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

      if (!apiKey) {
        console.error('[Map] Google Maps API key not found')
        setError('API key no configurada')
        return
      }

      try {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          setMapLoaded(true)
          initMap()
        }
        script.onerror = () => {
          setError('Error al cargar el mapa')
        }
        document.head.appendChild(script)
      } catch (err) {
        console.error('[Map] Error loading Google Maps:', err)
        setError('Error al cargar el mapa')
      }
    }

    const initMap = () => {
      if (!mapRef.current || !window.google?.maps) return

      const citySlug = city.toLowerCase()
      const neighborhoodSlug = neighborhood.toLowerCase()
      
      // Obtener coordenadas del barrio
      const coords = NEIGHBORHOOD_COORDS[citySlug]?.[neighborhoodSlug] || {
        lat: 40.4168,
        lng: -3.7038,
        zoom: 13,
      }

      // Crear mapa
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: coords.lat, lng: coords.lng },
        zoom: coords.zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      // Añadir marcador en el centro del barrio
      new window.google.maps.Marker({
        position: { lat: coords.lat, lng: coords.lng },
        map: map,
        title: neighborhood,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#8B5CF6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      })

      // Círculo semi-transparente para mostrar el área aproximada
      new window.google.maps.Circle({
        center: { lat: coords.lat, lng: coords.lng },
        radius: 500, // 500 metros de radio
        map: map,
        fillColor: '#8B5CF6',
        fillOpacity: 0.1,
        strokeColor: '#8B5CF6',
        strokeOpacity: 0.3,
        strokeWeight: 2,
      })
    }

    loadGoogleMaps()
  }, [city, neighborhood])

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <MapPin className="h-20 w-20 mb-4 opacity-90" />
            <p className="text-2xl lg:text-3xl font-bold text-center">{neighborhood}</p>
            <p className="text-base opacity-90 mt-2">{city}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: '100%' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl animate-pulse">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <MapPin className="h-20 w-20 mb-4 opacity-90 animate-bounce" />
            <p className="text-lg">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Tipos para TypeScript
declare global {
  interface Window {
    google: any
  }
}
