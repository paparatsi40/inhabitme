'use client'

import Image from 'next/image'
import { MapPin, Star, Wifi, Crown, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FullscreenHeaderProps {
  title: string
  location: string
  rating?: number
  reviewCount?: number
  images: string[]
  primaryColor?: string
  isFeatured?: boolean
}

export function FullscreenHeader({
  title,
  location,
  rating,
  reviewCount,
  images,
  primaryColor = '#2563eb',
  isFeatured = false,
}: FullscreenHeaderProps) {
  const t = useTranslations('listingHeader')
  const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  const altText = title || 'Property image'
  
  return (
    <div className="relative h-screen min-h-[600px] -mt-8 mb-12">
      {/* Background Image */}
      <Image
        src={mainImage}
        alt={altText}
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        {/* Badges */}
        <div className="flex gap-3 mb-6">
          {isFeatured && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold backdrop-blur-md"
              style={{ background: `linear-gradient(135deg, ${primaryColor}99, ${primaryColor}DD)` }}
            >
              <Crown className="w-4 h-4" />
              {t('featuredListing')}
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
            <Wifi className="w-4 h-4" />
            {t('highSpeedWifi')}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-4 max-w-4xl drop-shadow-2xl">
          {title}
        </h1>
        
        {/* Meta Info */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{location}</span>
          </div>
          
          {rating && (
            <>
              <span className="text-white/50">•</span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-white/80">({reviewCount} {t('reviews')})</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
    </div>
  )
}
