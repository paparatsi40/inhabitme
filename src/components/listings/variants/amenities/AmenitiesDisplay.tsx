'use client'

import { 
  Thermometer, Wind, Sunrise, Home, WashingMachine, 
  UtensilsCrossed, Building2, Car, Bell, ShieldCheck, 
  Lock, PawPrint, Cigarette, Check
} from 'lucide-react'
import { useTranslations } from 'next-intl'

interface AmenitiesDisplayProps {
  amenities: Record<string, boolean | number>
  variant: 'list' | 'grid' | 'badges' | 'icons'
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const AMENITY_ICONS: Record<string, any> = {
  has_heating: Thermometer,
  has_ac: Wind,
  has_balcony: Sunrise,
  has_terrace: Home,
  has_washer: WashingMachine,
  has_dryer: WashingMachine,
  has_dishwasher: UtensilsCrossed,
  has_full_kitchen: UtensilsCrossed,
  has_elevator: Building2,
  has_parking: Car,
  has_doorman: Bell,
  has_security_system: ShieldCheck,
  has_safe: Lock,
  allows_pets: PawPrint,
  allows_smoking: Cigarette,
}

const AMENITY_LABEL_KEYS: Record<string, string> = {
  has_heating: 'heating',
  has_ac: 'airConditioning',
  has_balcony: 'balcony',
  has_terrace: 'terrace',
  has_washer: 'washer',
  has_dryer: 'dryer',
  has_dishwasher: 'dishwasher',
  has_full_kitchen: 'fullyEquippedKitchen',
  has_elevator: 'elevator',
  has_parking: 'parking',
  has_doorman: 'concierge',
  floor_number: 'floorNumberLabel',
  has_security_system: 'securitySystem',
  has_safe: 'safe',
  allows_pets: 'petFriendly',
  allows_smoking: 'smokingAllowed',
}

export function AmenitiesDisplay({ amenities, variant, colors }: AmenitiesDisplayProps) {
  const t = useTranslations('propertyForm')
  const enabledAmenities = Object.entries(amenities)
    .filter(([key, value]) => value === true || (key === 'floor_number' && value))
    .map(([key, value]) => ({
      key,
      label: t(AMENITY_LABEL_KEYS[key] || 'amenities') || key,
      icon: AMENITY_ICONS[key] || Check,
      value: key === 'floor_number' ? value : true,
    }))

  if (enabledAmenities.length === 0) {
    return null
  }

  switch (variant) {
    case 'list':
      return <ListVariant amenities={enabledAmenities} colors={colors} />
    case 'grid':
      return <GridVariant amenities={enabledAmenities} colors={colors} t={t} />
    case 'badges':
      return <BadgesVariant amenities={enabledAmenities} colors={colors} />
    case 'icons':
      return <IconsVariant amenities={enabledAmenities} colors={colors} t={t} />
    default:
      return <GridVariant amenities={enabledAmenities} colors={colors} t={t} />
  }
}

// List Variant: Simple vertical list with checkmarks
function ListVariant({ amenities, colors }: any) {
  return (
    <div className="space-y-3">
      {amenities.map((amenity: any) => {
        const Icon = amenity.icon
        return (
          <div key={amenity.key} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{amenity.label}</span>
            {amenity.key === 'floor_number' && (
              <span className="text-gray-500">({amenity.value})</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Grid Variant: Cards with icons in grid
function GridVariant({ amenities, colors, t }: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {amenities.map((amenity: any) => {
        const Icon = amenity.icon
        return (
          <div
            key={amenity.key}
            className="flex items-center gap-3 p-4 rounded-xl border-2 hover:shadow-md transition"
            style={{ borderColor: `${colors.primary}40` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {amenity.label}
              </p>
              {amenity.key === 'floor_number' && (
                <p className="text-xs text-gray-500">{t('floorNumberLabel')} {amenity.value}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Badges Variant: Colorful badge chips
function BadgesVariant({ amenities, colors }: any) {
  return (
    <div className="flex flex-wrap gap-3">
      {amenities.map((amenity: any) => {
        const Icon = amenity.icon
        return (
          <div
            key={amenity.key}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white shadow-md hover:scale-105 transition"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{amenity.label}</span>
            {amenity.key === 'floor_number' && (
              <span className="text-xs opacity-90">({amenity.value})</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Icons Variant: Large icon circles
function IconsVariant({ amenities, colors, t }: any) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
      {amenities.map((amenity: any) => {
        const Icon = amenity.icon
        return (
          <div key={amenity.key} className="flex flex-col items-center gap-2 group">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {amenity.label.split(' ').slice(0, 2).join(' ')}
            </p>
            {amenity.key === 'floor_number' && (
              <p className="text-xs text-gray-500">{t('floorNumberLabel')} {amenity.value}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
