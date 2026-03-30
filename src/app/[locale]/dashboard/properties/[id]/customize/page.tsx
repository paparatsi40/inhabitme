'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { THEME_PRESETS, TEMPLATE_METADATA, ListingTheme, TemplateId } from '@/lib/domain/listing-theme'
import dynamic from 'next/dynamic'
import { BackgroundUploader } from '@/components/listings/theme/BackgroundUploader'
import { LogoUploader } from '@/components/listings/theme/LogoUploader'
import { Check, Palette, Layout, Eye, Save, Loader2, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

const ThemedListingPage = dynamic(
  () => import('@/components/listings/ThemedListingPage').then((m) => m.ThemedListingPage),
  { ssr: false, loading: () => <div className="p-8 text-sm text-gray-500">Loading preview...</div> }
)

export default function CustomizeListingPage() {
  const t = useTranslations('listingCustomization')
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string
  
  const [listing, setListing] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern')
  const [customTheme, setCustomTheme] = useState<ListingTheme>(THEME_PRESETS.modern)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [customBackground, setCustomBackground] = useState<string>('')
  const [customLogo, setCustomLogo] = useState<string>('')
  const [isFoundingHost, setIsFoundingHost] = useState(true) // Todos los hosts tienen acceso completo
  
  // Fetch listing data
  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          const mappedListing = {
            ...data,
            city: data.city_name,
            country: data.city_country,
            monthly_price: data.monthly_price || 1000,
          }
          setListing(mappedListing)
        }
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Error fetching listing:', error)
        }
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    fetchListing()

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [listingId])
  
  // Update theme when template changes
  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName)
    setCustomTheme(THEME_PRESETS[templateName as keyof typeof THEME_PRESETS])
  }
  
  // Update color
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }))
  }
  
  // Save theme
  const handleSave = async () => {
    setSaving(true)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(`/api/listings/${listingId}/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
        body: JSON.stringify({
          template: selectedTemplate,
          customizations: customTheme,
          // Agregar logo y background personalizados
          advanced: {
            customLogo: customLogo || null,
          },
          background: {
            ...customTheme.background,
            ...(customBackground && {
              type: 'image',
              image: {
                url: customBackground,
                overlay: 0.5
              }
            })
          }
        })
      })

      clearTimeout(timeoutId)

      if (res.ok) {
        alert(t('saveSuccess'))
        router.push(`/${params.locale as string}/dashboard/properties`)
      } else {
        const payload = await res.json().catch(() => ({}))
        alert(payload.error || t('saveFailedWithStatus', { status: res.status }))
      }
    } catch (error: any) {
      clearTimeout(timeoutId)
      console.error('Error saving theme:', error)
      if (error?.name === 'AbortError') {
        alert(t('saveTimeout'))
      } else {
        alert(t('saveFailed'))
      }
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }
  
  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t('listingNotFound')}</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/${params.locale as string}/dashboard/properties`)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('back')}
            </button>
            <div className="border-l pl-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-sm text-gray-600">{listing.title}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? t('edit') : t('preview')}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t('save')}
            </button>
          </div>
        </div>
      </div>
      
      {showPreview ? (
        /* Full Preview */
        <div className="p-4">
          <ThemedListingPage listing={listing} theme={customTheme} />
        </div>
      ) : (
        /* Editor Mode */
        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">{t('chooseTemplate')}</h2>
              </div>
              
              <div className="space-y-3">
                {(Object.entries(THEME_PRESETS) as [TemplateId, ListingTheme][]).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleTemplateChange(key)}
                    className={`w-full p-4 rounded-xl border-2 transition text-left ${
                      selectedTemplate === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold capitalize">{key}</h3>
                      {selectedTemplate === key && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{TEMPLATE_METADATA[key].description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Picker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">{t('colors')}</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('primaryColor')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('secondaryColor')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accentColor')}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={customTheme.colors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customTheme.colors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Uploader - Founding Host */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <BackgroundUploader
                value={customBackground}
                onChange={setCustomBackground}
                isFoundingHost={isFoundingHost}
              />
            </div>
            
            {/* Logo Uploader - Founding Host */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <LogoUploader
                value={customLogo}
                onChange={setCustomLogo}
                isFoundingHost={isFoundingHost}
              />
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">{t('preview')}</h2>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <div className="transform scale-75 origin-top-left" style={{ width: '133.33%', height: 'auto' }}>
                  <ThemedListingPage listing={listing} theme={customTheme} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
