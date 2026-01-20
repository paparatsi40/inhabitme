'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2 } from 'lucide-react'

interface GridGalleryProps {
  images: string[]
  title: string
  primaryColor?: string
}

export function GridGallery({ images, title, primaryColor = '#2563eb' }: GridGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  // Show up to 6 images in grid
  const displayImages = images.slice(0, 6)
  
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* Main large image */}
        <div 
          className="col-span-4 md:col-span-2 md:row-span-2 relative h-[300px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => setSelectedImage(displayImages[0])}
        >
          <Image
            src={displayImages[0] || '/placeholder.jpg'}
            alt={`${title} - Image 1`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        {/* Smaller images */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="col-span-2 md:col-span-1 relative h-[150px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${title} - Image ${index + 2}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        
        {/* Show more button */}
        {images.length > 6 && (
          <div className="col-span-2 md:col-span-1 relative h-[150px] md:h-[240px] rounded-xl overflow-hidden cursor-pointer">
            <Image
              src={displayImages[5]}
              alt={`${title} - More`}
              fill
              className="object-cover"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl"
              style={{ background: `${primaryColor}CC` }}
            >
              +{images.length - 6} more
            </div>
          </div>
        )}
      </div>
      
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
