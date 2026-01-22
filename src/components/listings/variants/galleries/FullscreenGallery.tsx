'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface FullscreenGalleryProps {
  images: string[]
  title: string
}

export function FullscreenGallery({ images, title }: FullscreenGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openGallery = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % (images?.length || 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1))
  }

  return (
    <>
      {/* Trigger: Hero image with overlay */}
      <div className="relative h-[70vh] cursor-pointer group" onClick={() => openGallery(0)}>
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
        
        <button className="absolute bottom-6 right-6 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition shadow-lg">
          <Maximize2 className="w-5 h-5" />
          Ver todas las fotos ({images?.length || 0})
        </button>

        {/* Thumbnails preview */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          {images?.slice(1, 4).map((image, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md cursor-pointer hover:scale-110 transition"
              onClick={(e) => {
                e.stopPropagation()
                openGallery(index + 1)
              }}
            >
              <Image
                src={image}
                alt={`Preview ${index + 2}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          {(images?.length || 0) > 4 && (
            <div className="w-16 h-16 rounded-lg bg-black/60 text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-md">
              +{(images?.length || 0) - 4}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold">{title}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="relative max-w-6xl max-h-full">
              <Image
                src={images[currentIndex]}
                alt={`${title} - Photo ${currentIndex + 1}`}
                width={1600}
                height={1200}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-white p-4 hover:bg-white/10 rounded-full transition backdrop-blur-sm"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 text-white p-4 hover:bg-white/10 rounded-full transition backdrop-blur-sm"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          {/* Bottom: Thumbnails strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                      index === currentIndex
                        ? 'border-white scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Counter */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full font-bold backdrop-blur-sm">
            {currentIndex + 1} / {images?.length || 0}
          </div>
        </div>
      )}
    </>
  )
}
