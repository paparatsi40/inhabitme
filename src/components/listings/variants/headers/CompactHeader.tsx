'use client'

import Image from 'next/image'
import { MapPin, Star, Wifi, Crown } from 'lucide-react'

interface CompactHeaderProps {
  title: string
  location: string
  rating?: number
  reviewCount?: number
  images: string[]
  primaryColor?: string
  isFeatured?: boolean
}

export function CompactHeader({
  title,
  location,
  rating,
  reviewCount,
  images,
  primaryColor = '#2563eb',
  isFeatured = false,
}: CompactHeaderProps) {
  const mainImage = images[0] || '/placeholder.jpg'
  
  return (
    <div className="mb-8">
      {/* Compact Image Banner */}
      <div className="relative h-[250px] rounded-xl overflow-hidden mb-6">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges on image */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isFeatured && (
            <div
              className="flex items-center gap-1 px-3 py-1 rounded-full text-white font-semibold text-xs backdrop-blur-md"
              style={{ background: `linear-gradient(135deg, ${primaryColor}99, ${primaryColor}DD)` }}
            >
              <Crown className="w-3 h-3" />
              Featured
            </div>
          )}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
            <Wifi className="w-3 h-3" style={{ color: primaryColor }} />
            WiFi
          </div>
        </div>
        
        {/* Title on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h1>
        </div>
      </div>
      
      {/* Info Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
          <span>{location}</span>
        </div>
        
        {rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            {reviewCount && (
              <span className="text-sm text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
