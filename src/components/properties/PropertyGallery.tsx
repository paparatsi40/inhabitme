'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && images.length > 0) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  // Placeholder images if none provided
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
  ];

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
        {/* Main Image */}
        <div 
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={displayImages[0]}
            alt={`${title} - Principal`}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>

        {/* Secondary Images */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(idx + 1)}
          >
            <img
              src={img}
              alt={`${title} - ${idx + 2}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            
            {/* Show all photos overlay on last image */}
            {idx === 3 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-medium">
                +{displayImages.length - 5} fotos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous button */}
          {displayImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-screen p-8">
            <img
              src={displayImages[selectedImage]}
              alt={`${title} - ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-white text-center mt-4">
              {selectedImage + 1} / {displayImages.length}
            </div>
          </div>

          {/* Next button */}
          {displayImages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
      )}
    </>
  );
}