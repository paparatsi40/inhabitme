'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface MasonryGalleryProps {
  images: string[]
  title: string
}

export function MasonryGallery({ images, title }: MasonryGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % (images?.length || 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1))
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images?.map((image, index) => (
          <div
            key={index}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image}
              alt={`${title} - Photo ${index + 1}`}
              width={600}
              height={400}
              className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full transition"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="max-w-5xl max-h-[90vh] relative">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Photo ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images?.length || 0}
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full transition"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  )
}
