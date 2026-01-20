'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SliderGalleryProps {
  images: string[]
  title: string
  primaryColor?: string
}

export function SliderGallery({ images, title, primaryColor = '#2563eb' }: SliderGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }
  
  return (
    <div className="mb-8">
      <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[currentIndex] || '/placeholder.jpg'}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-lg"
              style={{ color: primaryColor }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition shadow-lg"
              style={{ color: primaryColor }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition ${
                index === currentIndex ? 'ring-2 ring-offset-2' : 'opacity-60 hover:opacity-100'
              }`}
              style={index === currentIndex ? { '--tw-ring-color': primaryColor } as React.CSSProperties : undefined}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
