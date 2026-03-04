'use client'

import Image from 'next/image'
import { MapPin, Star, Wifi } from 'lucide-react'

interface HeroHeaderProps {
  title: string
  images: string[]
  city?: string
  neighborhood?: string
  featured?: boolean
  bedrooms?: number
  bathrooms?: number
  wifiSpeed?: number
}

export function HeroHeader({
  title,
  images,
  city,
  neighborhood,
  featured,
  bedrooms,
  bathrooms,
  wifiSpeed
}: HeroHeaderProps) {
  const mainImage = images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  const altText = title || 'Property image'

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={mainImage}
        alt={altText}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <div className="max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm font-bold rounded-full">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </span>
            )}
            {wifiSpeed && wifiSpeed >= 50 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                <Wifi className="h-3 w-3" />
                {wifiSpeed}+ Mbps
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          
          {/* Location & Details */}
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>
                {neighborhood && `${neighborhood}, `}
                {city}
              </span>
            </div>
            
            {bedrooms && (
              <>
                <span>•</span>
                <span>{bedrooms} habitación{bedrooms > 1 ? 'es' : ''}</span>
              </>
            )}
            
            {bathrooms && (
              <>
                <span>•</span>
                <span>{bathrooms} baño{bathrooms > 1 ? 's' : ''}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
