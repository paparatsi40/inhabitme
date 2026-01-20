'use client'

import { MapPin, Star } from 'lucide-react'

interface MinimalHeaderProps {
  title: string
  location: string
  rating?: number
  reviewCount?: number
  primaryColor?: string
}

export function MinimalHeader({
  title,
  location,
  rating,
  reviewCount,
  primaryColor = '#2563eb',
}: MinimalHeaderProps) {
  return (
    <div className="mb-12 py-8 border-b border-gray-200">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{title}</h1>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" style={{ color: primaryColor }} />
            <span>{location}</span>
          </div>
          
          {rating && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-gray-500">({reviewCount} reviews)</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
