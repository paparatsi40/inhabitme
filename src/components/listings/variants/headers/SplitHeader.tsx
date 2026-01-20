'use client'

import Image from 'next/image'
import { MapPin, Star, Wifi, Crown } from 'lucide-react'

interface SplitHeaderProps {
  title: string
  location: string
  rating?: number
  reviewCount?: number
  images: string[]
  featured?: boolean
  primaryColor?: string
  isFeatured?: boolean
}

export function SplitHeader({
  title,
  location,
  rating,
  reviewCount,
  images,
  featured,
  primaryColor = '#2563eb',
  isFeatured = false,
}: SplitHeaderProps) {
  const mainImage = images[0] || '/placeholder.jpg'
  
  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-12">
      {/* Image Side */}
      <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Badges */}
        {isFeatured && (
          <div className="absolute top-4 left-4">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold text-sm backdrop-blur-md"
              style={{ background: `linear-gradient(135deg, ${primaryColor}99, ${primaryColor}DD)` }}
            >
              <Crown className="w-4 h-4" />
              Featured
            </div>
          </div>
        )}
        
        {/* WiFi Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
            <Wifi className="w-4 h-4" style={{ color: primaryColor }} />
            <span className="text-sm font-medium">High-Speed WiFi</span>
          </div>
        </div>
      </div>
      
      {/* Info Side */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
            <span className="text-lg">{location}</span>
          </div>
          
          {rating && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              {reviewCount && (
                <span className="text-gray-500">({reviewCount} reviews)</span>
              )}
            </div>
          )}
        </div>
        
        <div className="prose prose-lg">
          <p className="text-gray-700 leading-relaxed">
            Experience comfortable living in this beautiful space designed for digital nomads and medium-term stays.
            Fully equipped with everything you need for a productive and relaxing stay.
          </p>
        </div>
      </div>
    </div>
  )
}
