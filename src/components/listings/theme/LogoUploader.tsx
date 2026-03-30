'use client'

import { useState } from 'react'
import { Upload, Crown } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface LogoUploaderProps {
  value?: string
  onChange: (url: string) => void
  isFoundingHost: boolean
}

export function LogoUploader({ value, onChange, isFoundingHost }: LogoUploaderProps) {
  const t = useTranslations('listingCustomization.logoUploader')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert(t('invalidImage'))
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t('maxSize'))
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'listing-logos')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: t('unknownError') }))
        throw new Error(errorData.error || t('uploadFailed'))
      }

      const data = await res.json()
      const imageUrl = data.url

      setPreview(imageUrl)
      onChange(imageUrl)
    } catch (error) {
      console.error('[LogoUploader] Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : t('unknownError')
      alert(`${t('uploadErrorPrefix')}: ${errorMessage}`)
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
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{t('lockedTitle')}</h3>
        </div>
        <p className="text-gray-700 mb-3">{t('lockedDescription')}</p>
        <div className="bg-white border-2 border-purple-400 rounded-lg p-4">
          <p className="text-sm font-semibold text-purple-800 mb-2">🎨 {t('lockedCardTitle')}</p>
          <p className="text-sm text-gray-600">{t('lockedCardDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('title')}</h3>
          <p className="text-sm text-gray-600">{t('subtitle')}</p>
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          {preview ? (
            <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border-2 border-gray-200">
              <Image
                src={preview}
                alt={t('previewAlt')}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium">
                  {t('change')}
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
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
                  ) : (
                    <Upload className="h-10 w-10 text-gray-400" />
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {uploading ? t('uploading') : t('uploadLogo')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t('formatHint')}</p>
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
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">💡 {t('recommendations')}</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• {t('tipSquare')}</li>
              <li>• {t('tipTransparent')}</li>
              <li>• {t('tipSize')}</li>
              <li>• {t('tipType')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
