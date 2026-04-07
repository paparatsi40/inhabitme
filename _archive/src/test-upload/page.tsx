'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CloudinaryUploader } from '@/components/properties/CloudinaryUploader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function TestUploadPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImagesUploaded = (urls: string[]) => {
    setUploadedImages(urls);
    console.log('Images uploaded:', urls);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/search" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚡ Demo: Cloudinary Upload (Profesional)
          </h1>
          <p className="text-gray-600">
            Sistema de upload usado por Netflix, Shopify y Airbnb
          </p>
        </div>

        {/* Upload Component */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Sube tus fotos</h2>
          <CloudinaryUploader
            onImagesUploaded={handleImagesUploaded}
            maxImages={10}
          />
        </div>

        {/* Results */}
        {uploadedImages.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">
                  ✅ {uploadedImages.length} imagen(es) subida(s) y optimizada(s)
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  URLs de Cloudinary CDN (optimizadas automáticamente):
                </p>
                <div className="bg-white rounded border border-green-200 p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(uploadedImages, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">⚡ Configurar Cloudinary (5 min):</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Ve a <a href="https://cloudinary.com/users/register/free" target="_blank" rel="noopener noreferrer" className="underline font-medium">cloudinary.com</a> y crea cuenta gratis (25GB)</li>
            <li>En el dashboard verás: <code className="bg-blue-100 px-1 rounded">Cloud Name</code>, <code className="bg-blue-100 px-1 rounded">API Key</code>, <code className="bg-blue-100 px-1 rounded">API Secret</code></li>
            <li>Cópialos al archivo <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
            <li>Ve a <strong>Settings → Upload → Upload Presets</strong></li>
            <li>Crea un preset llamado <code className="bg-blue-100 px-1 rounded">inhabitme_properties</code> (unsigned)</li>
            <li>Reinicia el servidor con <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
          </ol>
          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">💎 Ventajas sobre UploadThing:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>✅ 25GB gratis (vs 2GB)</li>
              <li>✅ Optimización automática de imágenes</li>
              <li>✅ Conversión a WebP/AVIF</li>
              <li>✅ Resize on-the-fly sin re-subir</li>
              <li>✅ CDN ultra-rápido (Cloudflare)</li>
              <li>✅ Usado por empresas Fortune 500</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}