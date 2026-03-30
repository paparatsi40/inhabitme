'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Home,
  MapPin,
  Wifi,
  Euro,

  Zap,
  Monitor,
  Image as ImageIcon,
} from 'lucide-react'

import { CloudinaryUploader } from '@/components/properties/CloudinaryUploader'

type Step =
  | 'basic'
  | 'location'
  | 'workspace'
  | 'amenities'
  | 'pricing'
  | 'images'
  | 'preview'

interface EditPropertyClientProps {
  listing: any // The existing property data
}

export default function EditPropertyClient({ listing }: EditPropertyClientProps) {
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('propertyForm')
  const c = useTranslations('common')

  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Initialize form with existing data
  const [formData, setFormData] = useState({
    title: listing.title || '',
    description: listing.description || '',
    city_name: listing.city_name || '',
    city_slug: listing.city_slug || '',
    country: listing.country || 'Spain',
    neighborhood: typeof listing.neighborhood === 'string' ? listing.neighborhood : listing.neighborhood?.name || '',
    has_fast_wifi: listing.has_fast_wifi || false,
    wifi_speed_mbps: listing.wifi_speed_mbps || '',
    has_dedicated_workspace: listing.has_dedicated_workspace || false,
    has_monitor: listing.has_monitor || false,
    workspace_description: listing.workspace_description || '',
    bedrooms: listing.bedrooms || 1,
    bathrooms: listing.bathrooms || 1,
    is_furnished: listing.is_furnished || false,
    monthly_price: listing.monthly_price || '',
    min_months: listing.min_months || 1,
    max_months: listing.max_months || 12,
    utilities_included: listing.utilities_included || false,
    deposit_required: listing.deposit_required || '',
    images: listing.images || [],
  })

  const steps: Step[] = [
    'basic',
    'location',
    'workspace',
    'amenities',
    'pricing',
    'images',
    'preview',
  ]

  const stepIndex = steps.indexOf(currentStep)

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1])
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/properties/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || c('error'))
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/${params.locale as string}/dashboard/properties`)
      }, 2000)
    } catch (err: any) {
      console.error('[EditProperty] Error:', err)
      setError(err.message || c('error'))
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {c('success')}
            </h2>
            <p className="text-gray-600 mb-6">
              {c('loading')}
            </p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/${params.locale as string}/dashboard/properties`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {c('cancel')}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
            {c('edit')}
          </h1>
          <p className="text-gray-600">
            {t('reviewDescription')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    idx <= stepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx < stepIndex ? <Check className="h-5 w-5" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 w-8 mx-1 ${
                      idx < stepIndex ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardContent className="p-6 lg:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            {/* Step Content - Reuse the same structure as CreatePropertyClient */}
            {currentStep === 'basic' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('basicInfo')}</h2>
                </div>

                <div>
                  <Label htmlFor="title">{t('propertyTitle')}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    placeholder={t('placeholderTitle')}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('propertyDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={6}
                    placeholder={t('placeholderDescription')}
                  />
                </div>
              </div>
            )}

            {currentStep === 'location' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('location')}</h2>
                </div>

                <div>
                  <Label htmlFor="city_name">{t('city')}</Label>
                  <Input
                    id="city_name"
                    value={formData.city_name}
                    onChange={(e) => updateFormData('city_name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">{t('neighborhood')}</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => updateFormData('neighborhood', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="country">{t('country')}</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 'workspace' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('workspaceDigital')}</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_dedicated_workspace"
                    checked={formData.has_dedicated_workspace}
                    onCheckedChange={(checked) =>
                      updateFormData('has_dedicated_workspace', checked)
                    }
                  />
                  <Label htmlFor="has_dedicated_workspace">
                    {t('dedicatedDesk')}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_fast_wifi"
                    checked={formData.has_fast_wifi}
                    onCheckedChange={(checked) =>
                      updateFormData('has_fast_wifi', checked)
                    }
                  />
                  <Label htmlFor="has_fast_wifi">{t('highSpeedWifi')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_monitor"
                    checked={formData.has_monitor}
                    onCheckedChange={(checked) =>
                      updateFormData('has_monitor', checked)
                    }
                  />
                  <Label htmlFor="has_monitor">{t('extraMonitor')}</Label>
                </div>
              </div>
            )}

            {currentStep === 'amenities' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('amenities')}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">{t('bedroomsLabel')}</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      value={formData.bedrooms}
                      onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">{t('bathroomsLabel')}</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      value={formData.bathrooms}
                      onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_furnished"
                    checked={formData.is_furnished}
                    onCheckedChange={(checked) =>
                      updateFormData('is_furnished', checked)
                    }
                  />
                  <Label htmlFor="is_furnished">{t('furnished')}</Label>
                </div>
              </div>
            )}

            {currentStep === 'pricing' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Euro className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('pricingTitle')}</h2>
                </div>

                <div>
                  <Label htmlFor="monthly_price">{t('pricePerMonth')}</Label>
                  <Input
                    id="monthly_price"
                    type="number"
                    min="0"
                    value={formData.monthly_price}
                    onChange={(e) => updateFormData('monthly_price', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_months">{t('minStay')}</Label>
                    <Input
                      id="min_months"
                      type="number"
                      min="1"
                      value={formData.min_months}
                      onChange={(e) => updateFormData('min_months', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_months">{t('maxStayMonths')}</Label>
                    <Input
                      id="max_months"
                      type="number"
                      min="1"
                      value={formData.max_months}
                      onChange={(e) => updateFormData('max_months', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="utilities_included"
                    checked={formData.utilities_included}
                    onCheckedChange={(checked) =>
                      updateFormData('utilities_included', checked)
                    }
                  />
                  <Label htmlFor="utilities_included">{t('utilitiesIncluded')}</Label>
                </div>
              </div>
            )}

            {currentStep === 'images' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold">{t('photos')}</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {t('uploadedPhotos')}
                </p>

                <CloudinaryUploader
                  existingImages={formData.images}
                  onImagesUploaded={(images) => updateFormData('images', images)}
                />
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">{t('review')}</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('titleLabel')}</p>
                    <p className="font-semibold">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('location')}</p>
                    <p className="font-semibold">{formData.neighborhood}, {formData.city_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('pricingTitle')}</p>
                    <p className="font-semibold">€{formData.monthly_price}{c('perMonth')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('bedroomsLabel')}/{t('bathroomsLabel')}</p>
                    <p className="font-semibold">{formData.bedrooms} {t('bedroomsLabel')} · {formData.bathrooms} {t('bathroomsLabel')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={stepIndex === 0 || submitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('previous')}
              </Button>

              {currentStep !== 'preview' ? (
                <Button onClick={handleNext}>
                  {t('next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    c('save')
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
