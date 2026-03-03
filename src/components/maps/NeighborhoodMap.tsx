'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface NeighborhoodMapProps {
  city: string
  neighborhood: string
  className?: string
}

// Coordenadas de barrios conocidos
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
  austin: {
    mueller: { lat: 30.3048, lng: -97.6998, zoom: 15 },
    zilker: { lat: 30.2544, lng: -97.7856, zoom: 15 },
    'barton-hills': { lat: 30.2637, lng: -97.8037, zoom: 15 },
    domain: { lat: 30.4008, lng: -97.7265, zoom: 15 },
    'east-austin': { lat: 30.2645, lng: -97.7106, zoom: 14 },
    tarrytown: { lat: 30.3012, lng: -97.7604, zoom: 15 },
  },
  sevilla: {
    triana: { lat: 37.3857, lng: -5.9984, zoom: 15 },
    centro: { lat: 37.3891, lng: -5.9845, zoom: 15 },
    nervion: { lat: 37.3801, lng: -5.9732, zoom: 15 },
    macarena: { lat: 37.4015, lng: -5.9866, zoom: 15 },
    alameda: { lat: 37.3966, lng: -5.9935, zoom: 15 },
  },
  lisboa: {
    baixa: { lat: 38.7078, lng: -9.1366, zoom: 15 },
    chiado: { lat: 38.7106, lng: -9.1423, zoom: 15 },
    alfama: { lat: 38.7123, lng: -9.1305, zoom: 15 },
    'bairro-alto': { lat: 38.7108, lng: -9.1453, zoom: 15 },
    'principe-real': { lat: 38.7139, lng: -9.1532, zoom: 15 },
    santos: { lat: 38.7067, lng: -9.1563, zoom: 15 },
    estrela: { lat: 38.7102, lng: -9.1618, zoom: 15 },
  },
  porto: {
    ribeira: { lat: 41.1406, lng: -8.6119, zoom: 16 },
    cedofeita: { lat: 41.1485, lng: -8.6158, zoom: 15 },
    boavista: { lat: 41.1575, lng: -8.6296, zoom: 15 },
    foz: { lat: 41.1726, lng: -8.6843, zoom: 15 },
  },
  'ciudad-de-mexico': {
    condesa: { lat: 19.4123, lng: -99.1773, zoom: 15 },
    'roma-norte': { lat: 19.4208, lng: -99.1604, zoom: 15 },
    polanco: { lat: 19.4326, lng: -99.1945, zoom: 15 },
    juarez: { lat: 19.4259, lng: -99.1526, zoom: 15 },
    'del-valle': { lat: 19.3923, lng: -99.1734, zoom: 15 },
    coyoacan: { lat: 19.3502, lng: -99.1621, zoom: 15 },
    'san-miguel-chapultepec': { lat: 19.4062, lng: -99.1857, zoom: 15 },
  },
  'buenos-aires': {
    palermo: { lat: -34.5883, lng: -58.3930, zoom: 14 },
    recoleta: { lat: -34.5887, lng: -58.3924, zoom: 15 },
    'san-telmo': { lat: -34.6209, lng: -58.3708, zoom: 16 },
    belgrano: { lat: -34.5624, lng: -58.4622, zoom: 14 },
    caballito: { lat: -34.6165, lng: -58.4351, zoom: 15 },
  },
  medellin: {
    'el-poblado': { lat: 6.2102, lng: -75.5665, zoom: 15 },
    laureles: { lat: 6.2447, lng: -75.6053, zoom: 15 },
    envigado: { lat: 6.1667, lng: -75.5833, zoom: 15 },
    sabaneta: { lat: 6.1506, lng: -75.6166, zoom: 15 },
  },
}

export function NeighborhoodMap({ city, neighborhood, className = '' }: NeighborhoodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Efecto para cargar Google Maps (solo una vez)
  useEffect(() => {
    const loadGoogleMaps = async () => {
      // Si ya está cargado, no hacer nada
      if (window.google?.maps) {
        setMapLoaded(true)
        return
      }

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

    loadGoogleMaps()
  }, []) // Solo se ejecuta al montar

  // Efecto para inicializar/actualizar el mapa cuando cambian city/neighborhood
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google?.maps) return

    const citySlug = city.toLowerCase()
    const neighborhoodSlug = neighborhood.toLowerCase()

    // Obtener coordenadas del barrio
    const coords = NEIGHBORHOOD_COORDS[citySlug]?.[neighborhoodSlug] || {
      lat: 40.4168,
      lng: -3.7038,
      zoom: 13,
    }

    // Si el mapa no existe, crearlo
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
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
    } else {
      // Si ya existe, solo mover el centro y cambiar zoom
      mapInstanceRef.current.setCenter({ lat: coords.lat, lng: coords.lng })
      mapInstanceRef.current.setZoom(coords.zoom)
    }

    // Limpiar marcador anterior si existe
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    // Crear nuevo marcador
    markerRef.current = new window.google.maps.Marker({
      position: { lat: coords.lat, lng: coords.lng },
      map: mapInstanceRef.current,
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

    // Limpiar círculo anterior si existe
    if (circleRef.current) {
      circleRef.current.setMap(null)
    }

    // Crear nuevo círculo
    circleRef.current = new window.google.maps.Circle({
      center: { lat: coords.lat, lng: coords.lng },
      radius: 500,
      map: mapInstanceRef.current,
      fillColor: '#8B5CF6',
      fillOpacity: 0.1,
      strokeColor: '#8B5CF6',
      strokeOpacity: 0.3,
      strokeWeight: 2,
    })

    // Cleanup al desmontar
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
      if (circleRef.current) {
        circleRef.current.setMap(null)
      }
    }
  }, [city, neighborhood, mapLoaded])

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
