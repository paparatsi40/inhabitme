'use client';

import { useState, useEffect } from 'react';
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
  const [uploading, setUploading] = useState(false);

  // Note: We DON'T sync with existingImages to avoid overwriting local state
  // The component maintains its own state and notifies parent via onImagesUploaded

  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success') {
      const newUrl = result.info.secure_url;
      console.log('[CloudinaryUploader] Nueva imagen subida:', newUrl);
      
      // CRITICAL: Use functional setState to avoid stale closure
      setImages(prev => {
        const updatedImages = [...prev, newUrl];
        console.log('[CloudinaryUploader] Array actualizado:', updatedImages);
        // Call parent callback with updated array
        onImagesUploaded(updatedImages);
        return updatedImages;
      });
    }
  };

  const removeImage = (index: number) => {
    // CRITICAL: Use functional setState to avoid stale closure
    setImages(prev => {
      const updatedImages = prev.filter((_, i) => i !== index);
      onImagesUploaded(updatedImages);
      return updatedImages;
    });
  };

  const setAsMain = (index: number) => {
    const updatedImages = [...images];
    const [mainImage] = updatedImages.splice(index, 1);
    updatedImages.unshift(mainImage);
    setImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="inhabitme_properties"
        onSuccess={handleUploadSuccess}
        options={{
          maxFiles: maxImages - images.length,
          multiple: true,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 5000000, // 5MB
          sources: ['local', 'url', 'camera'],
          showPoweredBy: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#3B82F6",
              tabIcon: "#3B82F6",
              menuIcons: "#5A5A5A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#3B82F6",
              action: "#3B82F6",
              inactiveTabIcon: "#0E0E0E",
              error: "#F44235",
              inProgress: "#3B82F6",
              complete: "#20B832",
              sourceBg: "#F8F9FA"
            }
          }
        }}
      >
        {({ open }) => (
          <div 
            onClick={() => images.length < maxImages && open()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer ${
              images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {uploading ? 'Subiendo...' : 'Haz click para subir imágenes'}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WebP hasta 5MB (máximo {maxImages} imágenes)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {images.length}/{maxImages} imágenes subidas
            </p>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              ⚡ Powered by Cloudinary - Optimización automática
            </p>
          </div>
        )}
      </CldUploadWidget>

      {/* Image Preview Grid */}
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
              
              {/* Main Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Principal
                </div>
              )}

              {/* Cloudinary Badge */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Optimizada ⚡
              </div>

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
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

      {/* Info & Tips */}
      {images.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">✨ Ventajas de Cloudinary:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Optimización automática de tamaño y calidad</li>
                <li>Conversión a formatos modernos (WebP)</li>
                <li>CDN global ultra-rápido</li>
                <li>Lazy loading automático</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}