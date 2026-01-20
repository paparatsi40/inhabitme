'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookingRequestModal } from '@/components/bookings/BookingRequestModal'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { Building2, Bed, Bath, MapPin, Wifi, Monitor, Home } from 'lucide-react'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'

const mapContainerStyle = {
  width: '100%',
  height: '320px',
}

// Interfaz para tipar el listing
interface ListingProps {
  id: string
  title: string
  description: string
  images?: string[]
  city_name?: string
  city_country?: string
  neighborhood?: string | null
  monthly_price?: number
  min_months?: number
  max_months?: number
  bedrooms?: number
  bathrooms?: number
  has_desk?: boolean
  has_second_monitor?: boolean
  wifi_speed_mbps?: number | null
  furnished?: boolean
  latitude?: number
  longitude?: number
  owner_id: string
}

export function ListingDetailClient({ listing }: { listing: ListingProps }) {
  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  // Map temporarily disabled - using NeighborhoodMap component instead
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  // })
  const isLoaded = false // Placeholder

  // Usar imágenes reales o placeholder
  const images: string[] = listing.images && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop']

  // Coordenadas reales o fallback
  const coordinates = {
    lat: listing.latitude || 40.4168,
    lng: listing.longitude || -3.7038,
  }

  // Extraer nombre del neighborhood (puede ser string u objeto)
  const neighborhoodName = typeof listing.neighborhood === 'string' 
    ? listing.neighborhood 
    : (listing.neighborhood as any)?.name || null

  // Normalizar neighborhood para slug
  const neighborhoodSlug = neighborhoodName
    ? neighborhoodName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
    : null

  const citySlug = listing.city_name?.toLowerCase() || 'madrid'

  // Memoize breadcrumb items para evitar regeneraciones
  const breadcrumbItems = useMemo(() => [
    { name: listing.city_name || 'Ciudad', href: `/${citySlug}` },
    ...(neighborhoodName ? [{
      name: neighborhoodName,
      href: `/${citySlug}/${neighborhoodSlug}`
    }] : [])
  ], [listing.city_name, citySlug, neighborhoodName, neighborhoodSlug])

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumbs con Schema.org */}
      <Breadcrumbs
        items={breadcrumbItems}
        current={listing.title}
        className="mb-6"
      />

      {/* JSON-LD Breadcrumb Schema - Componente aislado */}
      <BreadcrumbJsonLd
        items={breadcrumbItems}
        currentTitle={listing.title}
        currentUrl={`/listings/${listing.id}`}
      />

      {/* GALERÍA OPTIMIZADA */}
      <div className="mb-8 relative">
        <div className="relative w-full h-[420px] rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={images[currentImage]}
            alt={listing.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {images.length > 1 && (
          <>
            {/* Botón Anterior */}
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition"
              aria-label="Imagen anterior"
            >
              <span className="text-lg">◀</span>
            </button>

            {/* Botón Siguiente */}
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition"
              aria-label="Imagen siguiente"
            >
              <span className="text-lg">▶</span>
            </button>

            {/* Indicadores de Imágenes */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === currentImage
                      ? 'bg-blue-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                />
              ))}
            </div>

            {/* Contador de Imágenes */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* TÍTULO Y UBICACIÓN */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-3">{listing.title}</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-5 w-5" />
          <p>
            {neighborhoodName && `${neighborhoodName}, `}
            {listing.city_name}, {listing.city_country}
          </p>
        </div>
      </div>

      {/* CARACTERÍSTICAS PRINCIPALES */}
      <div className="mb-8 flex flex-wrap items-center gap-4 text-gray-700">
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{listing.bedrooms || 1}</span>
          <span className="text-sm">habitación{(listing.bedrooms || 1) > 1 ? 'es' : ''}</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{listing.bathrooms || 1}</span>
          <span className="text-sm">baño{(listing.bathrooms || 1) > 1 ? 's' : ''}</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-blue-600" />
          <span className="text-sm">
            {listing.wifi_speed_mbps ? `${listing.wifi_speed_mbps} Mbps` : 'WiFi disponible'}
          </span>
        </div>
      </div>

      {/* PRECIO DESTACADO */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-end gap-2 mb-2">
          <p className="text-4xl font-bold text-blue-600">
            €{listing.monthly_price?.toLocaleString() || '0'}
          </p>
          <p className="text-gray-600 mb-1">/ mes</p>
        </div>
        <p className="text-gray-600 text-sm">
          Estancia: {listing.min_months || 1} - {listing.max_months || 12} meses
        </p>
        {listing.monthly_price && listing.min_months && (
          <p className="text-gray-500 text-xs mt-2">
            Total {listing.min_months} meses: €{((listing.monthly_price || 0) * (listing.min_months || 1)).toLocaleString()}
          </p>
        )}
      </div>

      {/* WORKSPACE DESTACADO */}
      <div className="mb-10 p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold">Espacio de Trabajo Verificado</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg text-center ${listing.has_desk ? 'bg-white border-2 border-green-500' : 'bg-white/50'}`}>
            <div className="text-2xl mb-2">🪑</div>
            <div className="text-sm font-medium">Escritorio</div>
            <div className="text-xs text-gray-600 mt-1">
              {listing.has_desk ? '✓ Incluido' : 'No disponible'}
            </div>
          </div>

          <div className={`p-4 rounded-lg text-center ${listing.has_second_monitor ? 'bg-white border-2 border-green-500' : 'bg-white/50'}`}>
            <div className="text-2xl mb-2">🖥️</div>
            <div className="text-sm font-medium">Monitor</div>
            <div className="text-xs text-gray-600 mt-1">
              {listing.has_second_monitor ? '✓ Disponible' : 'No incluido'}
            </div>
          </div>

          <div className={`p-4 rounded-lg text-center ${listing.wifi_speed_mbps && listing.wifi_speed_mbps >= 50 ? 'bg-white border-2 border-green-500' : 'bg-white'}`}>
            <div className="text-2xl mb-2">📶</div>
            <div className="text-sm font-medium">WiFi</div>
            <div className="text-xs text-gray-600 mt-1">
              {listing.wifi_speed_mbps ? `${listing.wifi_speed_mbps} Mbps` : 'Disponible'}
            </div>
          </div>

          <div className={`p-4 rounded-lg text-center ${listing.furnished ? 'bg-white border-2 border-green-500' : 'bg-white/50'}`}>
            <div className="text-2xl mb-2">🛋️</div>
            <div className="text-sm font-medium">Amueblado</div>
            <div className="text-xs text-gray-600 mt-1">
              {listing.furnished ? '✓ Completo' : 'No amueblado'}
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="mb-10 p-6 bg-white border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Descripción</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
          {listing.description}
        </p>
      </div>

      {/* UBICACIÓN - ENLACES SEO CRÍTICOS */}
      <div className="mb-10 p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold">Ubicación Perfecta</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 text-gray-700 mb-3">
            <Bed className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">{listing.bedrooms || 1} habitación{(listing.bedrooms || 1) > 1 ? 'es' : ''}</span>
            <span className="text-gray-400">•</span>
            <Bath className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">{listing.bathrooms || 1} baño{(listing.bathrooms || 1) > 1 ? 's' : ''}</span>
            {listing.wifi_speed_mbps && (
              <>
                <span className="text-gray-400">•</span>
                <Wifi className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">{listing.wifi_speed_mbps} Mbps</span>
              </>
            )}
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            Este alojamiento está ubicado en{' '}
            {neighborhoodName ? (
              <>
                <Link 
                  href={`/${citySlug}/${neighborhoodSlug}`}
                  className="text-purple-700 font-bold hover:text-purple-900 underline decoration-2 underline-offset-2"
                >
                  {neighborhoodName}
                </Link>
                , uno de los barrios más vibrantes de{' '}
              </>
            ) : (
              ''
            )}
            <Link 
              href={`/${citySlug}`}
              className="text-blue-700 font-bold hover:text-blue-900 underline decoration-2 underline-offset-2"
            >
              {listing.city_name}
            </Link>
            . Perfecto para <strong>estancias de {listing.min_months} a {listing.max_months} meses</strong>, 
            ideal para <strong>nómadas digitales</strong>, <strong>estudiantes internacionales</strong> y 
            profesionales en movilidad que buscan un espacio listo para vivir y trabajar.
          </p>
        </div>

        {neighborhoodName && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-200">
            <Link 
              href={`/${citySlug}/${neighborhoodSlug}`}
              className="flex-1"
            >
              <Button 
                variant="default" 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Más alojamientos en {neighborhoodName}
              </Button>
            </Link>
            <Link 
              href={`/${citySlug}`}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Explorar {listing.city_name}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* UBICACIÓN - Link al mapa interactivo */}
      {neighborhoodName && (
        <div className="mb-10 p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-bold">Ubicación</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Este alojamiento está en <strong>{neighborhoodName}</strong>, {listing.city_name}.
          </p>

          <Link href={`/${citySlug}/${neighborhoodSlug}`}>
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <MapPin className="h-4 w-4 mr-2" />
              Ver mapa interactivo del barrio
            </Button>
          </Link>

          <p className="text-xs text-gray-500 mt-4">
            📍 La dirección exacta se comparte tras confirmar disponibilidad
          </p>
        </div>
      )}

      {/* INFORMACIÓN DEL ANFITRIÓN */}
      <div className="mb-10 p-6 bg-white border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Anfitrión Verificado</h2>

        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            H
          </div>

          <div>
            <p className="font-semibold text-lg">Anfitrión Verificado</p>
            <p className="text-sm text-gray-600">
              ✓ Identidad verificada • ✓ Propiedad confirmada
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            🛡️ Este anfitrión ha verificado su identidad y la propiedad cumple con los estándares de InhabitMe.
            Los datos de contacto se comparten automáticamente tras confirmar tu interés.
          </p>
        </div>
      </div>

      {/* CTA PRINCIPAL */}
      <div className="sticky bottom-0 bg-white border-t pt-6 pb-4 -mx-6 px-6">
        <Button 
          onClick={() => setOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-bold rounded-full shadow-lg"
        >
          Request to Book
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          Solo pagas cuando el anfitrión acepta tu solicitud
        </p>
      </div>

      {/* MODAL DE BOOKING */}
      <BookingRequestModal
        isOpen={open}
        onClose={() => setOpen(false)}
        property={{
          id: listing.id,
          title: listing.title,
          price: {
            monthly: listing.monthly_price || 0
          },
          depositAmount: listing.monthly_price || 0
        }}
      />
    </main>
  )
}
