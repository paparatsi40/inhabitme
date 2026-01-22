'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface BackgroundUploaderProps {
  value?: string
  onChange: (url: string) => void
  isFoundingHost: boolean
}

export function BackgroundUploader({ value, onChange, isFoundingHost }: BackgroundUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB')
      return
    }

    setUploading(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'listing-backgrounds')

      // Upload to your preferred service (Cloudinary, S3, etc.)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      const imageUrl = data.url

      setPreview(imageUrl)
      onChange(imageUrl)
    } catch (error) {
      console.error('[BackgroundUploader] Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al subir la imagen: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  if (!isFoundingHost) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Background Personalizado</h3>
        </div>
        <p className="text-gray-700 mb-3">
          Añade una imagen de fondo personalizada para tu listing
        </p>
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            🎨 Fondo Personalizado
          </p>
          <p className="text-sm text-gray-600">
            Sube una imagen de fondo personalizada para hacer tu listing único.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Background Personalizado</h3>
          <p className="text-sm text-gray-600">
            Añade una imagen de fondo para hacer tu listing único
          </p>
        </div>
        {preview && (
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Eliminar
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-gray-200">
          <Image
            src={preview}
            alt="Background preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
              Cambiar imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
              <div className="text-center">
                <p className="text-base font-medium text-gray-700">
                  {uploading ? 'Subiendo...' : 'Click para subir imagen'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG hasta 5MB
                </p>
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Usa una imagen que represente el ambiente de tu propiedad. 
          Se aplicará un overlay para mantener la legibilidad del texto.
        </p>
      </div>
    </div>
  )
}
