'use client'

import { useState } from 'react'
import { ThemeProvider } from './theme/ThemeProvider'
import { CTASection } from './variants/cta/CTASection'
import { BookingRequestModal } from '@/components/bookings/BookingRequestModal'
import { AskQuestionModal } from '@/components/bookings/AskQuestionModal'
import { ListingTheme, THEME_PRESETS } from '@/lib/domain/listing-theme'

// ── Header variants ──────────────────────────────────────────────────────────
import { HeroHeader } from './variants/headers/HeroHeader'
import { SplitHeader } from './variants/headers/SplitHeader'
import { CompactHeader } from './variants/headers/CompactHeader'
import { MinimalHeader } from './variants/headers/MinimalHeader'
import { FullscreenHeader } from './variants/headers/FullscreenHeader'

// ── Gallery variants ─────────────────────────────────────────────────────────
import { GridGallery } from './variants/galleries/GridGallery'
import { MasonryGallery } from './variants/galleries/MasonryGallery'
import { SliderGallery } from './variants/galleries/SliderGallery'
import { FullscreenGallery } from './variants/galleries/FullscreenGallery'

// ── Icons ────────────────────────────────────────────────────────────────────
import {
  Bed, Bath, Wifi, Car, PawPrint, Wind, Thermometer,
  Building2, Calendar, Clock, CheckCircle, XCircle,
  Tv, Dumbbell, Utensils, Shirt, MapPin, Package, Users, Star,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
interface ThemedListingPageProps {
  listing: {
    id: string
    title: string
    city?: string
    city_name?: string
    country?: string
    neighborhood?: string
    rating?: number
    review_count?: number
    images?: string[]
    featured?: boolean
    description?: string
    monthly_price?: number
    currency?: string
    bedrooms?: number
    bathrooms?: number
    max_guests?: number
    size_sqm?: number
    floor?: number
    min_months?: number
    max_months?: number
    has_wifi?: boolean
    wifi_speed_mbps?: number
    has_parking?: boolean
    pets_allowed?: boolean
    has_ac?: boolean
    has_heating?: boolean
    has_elevator?: boolean
    has_dishwasher?: boolean
    has_washing_machine?: boolean
    has_dryer?: boolean
    has_tv?: boolean
    has_gym?: boolean
    has_pool?: boolean
    amenities?: any
  }
  theme?: ListingTheme
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(price: number, currency: string) {
  const curr = (currency || 'EUR').toUpperCase()
  const loc = curr === 'EUR' ? 'es-ES' : 'en-US'
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: curr,
    maximumFractionDigits: 0,
  }).format(price)
}

// ── AmenityBadge ─────────────────────────────────────────────────────────────
function AmenityBadge({
  active,
  icon: Icon,
  label,
}: {
  active?: boolean
  icon: any
  label: string
}) {
  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
        active
          ? 'border-green-200 bg-green-50'
          : 'border-gray-100 bg-gray-50 opacity-50'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-green-600' : 'text-gray-400'}`} />
      <span
        className={`text-sm font-medium flex-1 ${
          active ? 'text-gray-900' : 'text-gray-400 line-through'
        }`}
      >
        {label}
      </span>
      {active ? (
        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-gray-300 shrink-0" />
      )}
    </div>
  )
}

// ── GalleryRenderer ───────────────────────────────────────────────────────────
function GalleryRenderer({
  style,
  images,
  title,
  primaryColor,
}: {
  style: string
  images: string[]
  title: string
  primaryColor?: string
}) {
  if (!images || images.length === 0) return null

  switch (style) {
    case 'masonry':
      return <MasonryGallery images={images} title={title} />
    case 'slider':
      return <SliderGallery images={images} title={title} primaryColor={primaryColor} />
    case 'fullscreen':
      return <FullscreenGallery images={images} title={title} />
    case 'grid':
    default:
      return <GridGallery images={images} title={title} primaryColor={primaryColor} />
  }
}

// ── HeaderRenderer ────────────────────────────────────────────────────────────
function HeaderRenderer({
  headerStyle,
  listing,
  location,
  primaryColor,
}: {
  headerStyle: string
  listing: ThemedListingPageProps['listing']
  location: string
  primaryColor: string
}) {
  const images = listing.images?.filter(Boolean) || []
  const commonProps = {
    title: listing.title || '',
    location,
    rating: listing.rating,
    reviewCount: listing.review_count,
    primaryColor,
    isFeatured: !!listing.featured,
  }

  switch (headerStyle) {
    case 'split':
      return (
        <SplitHeader
          {...commonProps}
          images={images}
          featured={listing.featured}
        />
      )
    case 'compact':
      return <CompactHeader {...commonProps} images={images} />
    case 'minimal':
      return <MinimalHeader {...commonProps} />
    case 'fullscreen':
      return <FullscreenHeader {...commonProps} images={images} />
    case 'hero':
    default:
      return (
        <HeroHeader
          title={listing.title || ''}
          images={images}
          city={listing.city_name || listing.city}
          neighborhood={listing.neighborhood}
          featured={listing.featured}
          bedrooms={listing.bedrooms}
          bathrooms={listing.bathrooms}
          wifiSpeed={listing.wifi_speed_mbps}
        />
      )
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function ThemedListingPage({ listing, theme }: ThemedListingPageProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const activeTheme = theme || THEME_PRESETS.modern
  const colors = activeTheme?.colors || THEME_PRESETS.modern.colors
  const layout = activeTheme?.layout || THEME_PRESETS.modern.layout

  const city = listing.city_name || listing.city || ''
  const country = listing.country || ''
  const location = [listing.neighborhood, city, country].filter(Boolean).join(', ')
  const currency = listing.currency || 'EUR'
  const price = listing.monthly_price || 0
  const images = (listing.images || []).filter(Boolean)

  // Amenities — support both individual boolean columns and legacy JSON field
  const legacyAmenities = listing.amenities || {}
  const amenities = {
    wifi: listing.has_wifi ?? !!legacyAmenities.wifi,
    wifiSpeed: listing.wifi_speed_mbps ?? legacyAmenities.wifiSpeedMbps,
    parking: listing.has_parking ?? false,
    pets: listing.pets_allowed ?? false,
    ac: listing.has_ac ?? false,
    heating: listing.has_heating ?? false,
    elevator: listing.has_elevator ?? false,
    dishwasher: listing.has_dishwasher ?? false,
    washingMachine: listing.has_washing_machine ?? false,
    dryer: listing.has_dryer ?? false,
    tv: listing.has_tv ?? false,
    gym: listing.has_gym ?? false,
    pool: listing.has_pool ?? false,
  }

  // For headers that already show images[0] as a fullscreen/hero, start the
  // gallery from index 1 to avoid showing the main image twice.
  const heroStyleHeaders = ['hero', 'fullscreen']
  const galleryImages =
    heroStyleHeaders.includes(layout.header) && images.length > 1
      ? images.slice(1)
      : images

  // Whether to show the sticky sidebar (only for inline CTA variant)
  const showSidebar = layout.cta === 'inline'

  return (
    <ThemeProvider theme={activeTheme}>
      <div className="min-h-screen bg-gray-50">

        {/* ── HEADER (template-specific) ─────────────────────────────────── */}
        <HeaderRenderer
          headerStyle={layout.header}
          listing={listing}
          location={location}
          primaryColor={colors.primary}
        />

        {/* ── CONTENT ────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Gallery (after header) */}
          {galleryImages.length > 0 && (
            <div className="mb-8">
              <GalleryRenderer
                style={layout.gallery}
                images={galleryImages}
                title={listing.title || ''}
                primaryColor={colors.primary}
              />
            </div>
          )}

          <div className={`grid gap-8 ${showSidebar ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto'}`}>

            {/* ── LEFT COLUMN: Property details ─────────────────────────── */}
            <div className={`space-y-8 ${showSidebar ? 'lg:col-span-2' : ''}`}>

              {/* Quick stats */}
              {(listing.bedrooms !== undefined ||
                listing.bathrooms !== undefined ||
                listing.size_sqm ||
                listing.max_guests) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {listing.bedrooms !== undefined && (
                    <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                      <Bed className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                      <div className="text-2xl font-black text-gray-900">{listing.bedrooms}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {listing.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
                      </div>
                    </div>
                  )}
                  {listing.bathrooms !== undefined && (
                    <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                      <Bath className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                      <div className="text-2xl font-black text-gray-900">{listing.bathrooms}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {listing.bathrooms === 1 ? 'baño' : 'baños'}
                      </div>
                    </div>
                  )}
                  {listing.size_sqm && (
                    <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                      <Package className="h-6 w-6 text-green-500 mx-auto mb-1" />
                      <div className="text-2xl font-black text-gray-900">{listing.size_sqm}</div>
                      <div className="text-xs text-gray-500 font-medium">m²</div>
                    </div>
                  )}
                  {listing.max_guests && (
                    <div className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                      <Users className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                      <div className="text-2xl font-black text-gray-900">{listing.max_guests}</div>
                      <div className="text-xs text-gray-500 font-medium">huéspedes</div>
                    </div>
                  )}
                </div>
              )}

              {/* Stay duration */}
              {(listing.min_months || listing.max_months) && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
                    Duración de estancia
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {listing.min_months && (
                      <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-500">Mínimo</div>
                          <div className="font-bold text-gray-900">
                            {listing.min_months}{' '}
                            {listing.min_months === 1 ? 'mes' : 'meses'}
                          </div>
                        </div>
                      </div>
                    )}
                    {listing.max_months && (
                      <div className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-3">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-gray-500">Máximo</div>
                          <div className="font-bold text-gray-900">
                            {listing.max_months}{' '}
                            {listing.max_months === 1 ? 'mes' : 'meses'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {listing.description && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-black text-gray-900 mb-4">
                    Sobre este alojamiento
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Comodidades
                </h2>

                {/* Esenciales */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Esenciales
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <AmenityBadge
                      active={!!amenities.wifi}
                      icon={Wifi}
                      label={
                        amenities.wifiSpeed
                          ? `WiFi · ${amenities.wifiSpeed} Mbps`
                          : 'WiFi'
                      }
                    />
                    <AmenityBadge active={amenities.ac} icon={Wind} label="Aire acondicionado" />
                    <AmenityBadge active={amenities.heating} icon={Thermometer} label="Calefacción" />
                    <AmenityBadge active={amenities.elevator} icon={Building2} label="Ascensor" />
                  </div>
                </div>

                {/* Cocina y hogar */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Cocina y hogar
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <AmenityBadge active={amenities.washingMachine} icon={Shirt} label="Lavadora" />
                    <AmenityBadge active={amenities.dryer} icon={Shirt} label="Secadora" />
                    <AmenityBadge active={amenities.dishwasher} icon={Utensils} label="Lavavajillas" />
                    <AmenityBadge active={amenities.tv} icon={Tv} label="TV" />
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Extras
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <AmenityBadge active={amenities.parking} icon={Car} label="Parking incluido" />
                    <AmenityBadge active={amenities.pets} icon={PawPrint} label="Mascotas permitidas" />
                    <AmenityBadge active={amenities.gym} icon={Dumbbell} label="Gimnasio" />
                    <AmenityBadge active={amenities.pool} icon={Star} label="Piscina" />
                  </div>
                </div>
              </div>

              {/* Inline CTA (within content stream, for cozy/minimal templates) */}
              {layout.cta === 'inline' && (
                <CTASection
                  variant="inline"
                  colors={colors}
                  monthlyPrice={price}
                  onBooking={() => setShowBookingModal(true)}
                  onQuestion={() => setShowQuestionModal(true)}
                />
              )}
            </div>

            {/* ── RIGHT COLUMN: Sticky pricing sidebar (inline CTA only) ── */}
            {showSidebar && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-6 space-y-4">
                  {/* Price */}
                  <div>
                    <div className="text-3xl font-black text-gray-900">
                      {formatPrice(price, currency)}
                    </div>
                    <div className="text-sm text-gray-500">por mes · sin comisiones</div>
                  </div>

                  {/* Duration info */}
                  {(listing.min_months || listing.max_months) && (
                    <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                      <span className="font-semibold">Estancia:</span>{' '}
                      {listing.min_months &&
                        `mín. ${listing.min_months} mes${listing.min_months > 1 ? 'es' : ''}`}
                      {listing.min_months && listing.max_months && ' · '}
                      {listing.max_months &&
                        `máx. ${listing.max_months} mes${listing.max_months > 1 ? 'es' : ''}`}
                    </div>
                  )}

                  {/* CTA buttons */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-4 rounded-xl font-black text-white text-lg shadow-lg hover:opacity-90 transition"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    }}
                  >
                    Solicitar estancia
                  </button>
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="w-full py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition"
                  >
                    Hacer una pregunta
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Sin cargos hasta que el host acepte
                  </p>

                  {/* Quick stats summary */}
                  <div className="border-t pt-4 space-y-2">
                    {listing.bedrooms !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Bed className="h-4 w-4" /> Dormitorios
                        </span>
                        <span className="font-semibold">{listing.bedrooms}</span>
                      </div>
                    )}
                    {listing.bathrooms !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Bath className="h-4 w-4" /> Baños
                        </span>
                        <span className="font-semibold">{listing.bathrooms}</span>
                      </div>
                    )}
                    {listing.size_sqm && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Superficie</span>
                        <span className="font-semibold">{listing.size_sqm} m²</span>
                      </div>
                    )}
                    {listing.neighborhood && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> Barrio
                        </span>
                        <span className="font-semibold truncate ml-2">{listing.neighborhood}</span>
                      </div>
                    )}
                    {amenities.wifi && amenities.wifiSpeed && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Wifi className="h-4 w-4" /> WiFi
                        </span>
                        <span className="font-semibold">{amenities.wifiSpeed} Mbps</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FIXED / FLOATING CTA (non-inline variants) ─────────────────── */}
        {layout.cta !== 'inline' && (
          <CTASection
            variant={layout.cta as 'fixed' | 'floating'}
            colors={colors}
            monthlyPrice={price}
            onBooking={() => setShowBookingModal(true)}
            onQuestion={() => setShowQuestionModal(true)}
          />
        )}

        {/* ── MODALS ─────────────────────────────────────────────────────── */}
        <BookingRequestModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          property={listing}
        />
        <AskQuestionModal
          isOpen={showQuestionModal}
          onClose={() => setShowQuestionModal(false)}
          property={listing}
        />
      </div>
    </ThemeProvider>
  )
}
