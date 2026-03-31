'use client'

import { useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface BackgroundUploaderProps {
  value?: string
  onChange: (url: string) => void
  isFoundingHost: boolean
}

export function BackgroundUploader({ value, onChange, isFoundingHost }: BackgroundUploaderProps) {
  const t = useTranslations('listingCustomization.backgroundUploader')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('errors.invalidImage'))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('errors.fileTooLarge'))
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
        const errorData = await res.json().catch(() => ({ error: t('errors.unknownError') }))
        throw new Error(errorData.error || t('errors.uploadFailed'))
      }

      const data = await res.json()
      const imageUrl = data.url

      setPreview(imageUrl)
      onChange(imageUrl)
    } catch (error) {
      console.error('[BackgroundUploader] Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : t('errors.unknownError')
      alert(t('errors.uploadImageWithMessage', { message: errorMessage }))
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
          <h3 className="text-lg font-bold text-gray-900">{t('title')}</h3>
        </div>
        <p className="text-gray-700 mb-3">
          {t('descriptionLocked')}
        </p>
        <div className="bg-white border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">
            {t('badgeTitle')}
          </p>
          <p className="text-sm text-gray-600">
            {t('badgeDescription')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('title')}</h3>
          <p className="text-sm text-gray-600">
            {t('description')}
          </p>
        </div>
        {preview && (
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            {t('remove')}
          </button>
        )}
      </div>

      {preview ? (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-gray-200">
          <Image
            src={preview}
            alt={t('previewAlt')}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
              {t('changeImage')}
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
                  {uploading ? t('uploading') : t('clickToUpload')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('formats')}
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
          {t('tip')}
        </p>
      </div>
    </div>
  )
}
