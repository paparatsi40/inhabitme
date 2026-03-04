'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CloudinaryUploaderProps {
  onImagesUploaded: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

export function CloudinaryUploader({ 
  onImagesUploaded, 
  existingImages = [], 
  maxImages = 10 
}: CloudinaryUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const isFirstRender = useRef(true);

  // Sync with parent when existingImages change (on mount/reset)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setImages(existingImages);
  }, [existingImages]);

  // Notify parent AFTER render completes (not during)
  useEffect(() => {
    // Small timeout to ensure we're outside of render phase
    const timeoutId = setTimeout(() => {
      onImagesUploaded(images);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [images, onImagesUploaded]);

  const handleSuccess = useCallback((result: any) => {
    if (result.event === 'success') {
      const newUrl = result.info.secure_url;
      setImages(prev => [...prev, newUrl]);
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const setAsMain = useCallback((index: number) => {
    setImages(prev => {
      const updated = [...prev];
      const [main] = updated.splice(index, 1);
      updated.unshift(main);
      return updated;
    });
  }, []);

  const remainingSlots = maxImages - images.length;

  return (
    <div className="space-y-4">
      {remainingSlots > 0 ? (
        <CldUploadWidget
          uploadPreset="inhabitme_properties"
          onSuccess={handleSuccess}
          options={{
            maxFiles: remainingSlots,
            multiple: remainingSlots > 1,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxFileSize: 5000000,
          }}
        >
          {({ open }) => {
            const safeOpen = () => {
              if (typeof open === 'function') {
                open();
              } else {
                console.error('[Cloudinary] Widget not initialized');
              }
            };

            return (
              <button
                type="button"
                onClick={safeOpen}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Haz click para subir imágenes
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, WebP hasta 5MB (máximo {maxImages} imágenes)
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {images.length}/{maxImages} imágenes subidas
                </p>
              </button>
            );
          }}
        </CldUploadWidget>
      ) : (
        <div className="border-2 border-gray-200 rounded-lg p-8 text-center opacity-50">
          <p className="text-lg font-medium text-gray-700">
            Límite de {maxImages} imágenes alcanzado
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
            >
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Principal
                </div>
              )}

              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Optimizada ⚡
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setAsMain(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Principal
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
