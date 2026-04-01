'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
  Bed,
  Bath,
  Zap,
  Monitor,
  Image as ImageIcon,
} from 'lucide-react'

import { CloudinaryUploader } from '@/components/properties/CloudinaryUploader'
import { CITIES } from '@/config/cities'

type Step =
  | 'basic'
  | 'location'
  | 'workspace'
  | 'amenities'
  | 'pricing'
  | 'images'
  | 'preview'

function CreatePropertyContent() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const t = useTranslations('propertyForm')
  const locale = useLocale()

  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,

    country: 'España',
    city: '',
    neighborhood: '',
    address: '',

    hasDedicatedDesk: true,
    wifiSpeed: 50,

    hasHeating: false,
    hasAc: false,
    hasBalcony: false,
    hasTerrace: false,

    hasWashingMachine: false,
    hasDryer: false,
    hasDishwasher: false,
    hasKitchen: false,

    hasElevator: false,
    hasParking: false,
    hasDoorman: false,
    floorNumber: undefined as number | undefined,

    petsAllowed: false,
    smokingAllowed: false,

    hasSecuritySystem: false,
    hasSafe: false,

    pricePerNight: 50,
    pricePerWeek: 300,
    pricePerMonth: 800,
    currency: 'EUR',
    minStayMonths: 1,
    maxStayMonths: 12,

    images: [] as string[],
  })

  // Obtener ciudades disponibles filtradas por país (ordenadas alfabéticamente)
  const availableCities = useMemo(() => {
    if (!formData.country) return []
    return CITIES.filter(c => c.country === formData.country)
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [formData.country])

  // Obtener barrios de la ciudad seleccionada
  const availableNeighborhoods = useMemo(() => {
    if (!formData.city) return []
    const cityConfig = CITIES.find(c => c.name === formData.city)
    if (!cityConfig) return []
    return [...cityConfig.neighborhoods].sort((a, b) => a.name.localeCompare(b.name))
  }, [formData.city])

  // Lista de países disponibles
  const availableCountries = useMemo(() => {
    const countries = new Set(CITIES.map(c => c.country))
    return Array.from(countries).sort()
  }, [])

  const steps: { id: Step; title: string; icon: any }[] = [
    { id: 'basic', title: 'Información Básica', icon: Home },
    { id: 'location', title: t('steps.location'), icon: MapPin },
    { id: 'workspace', title: t('steps.workspace'), icon: Wifi },
    { id: 'amenities', title: t('amenities'), icon: Check },
    { id: 'pricing', title: t('steps.pricing'), icon: Euro },
    { id: 'images', title: t('steps.images'), icon: ImageIcon },
    { id: 'preview', title: 'Revisar', icon: Check },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(`/${locale}/sign-in`)
    }
  }, [isLoaded, isSignedIn, router, locale])

  const updateFormData = (updates: Partial<typeof formData>) => {
    // Si cambia el país, resetear ciudad y barrio
    if ('country' in updates && updates.country !== formData.country) {
      setFormData(prev => ({ 
        ...prev, 
        ...updates,
        city: '',
        neighborhood: '' 
      }))
      return
    }
    
    // Si cambia la ciudad, resetear el barrio
    if ('city' in updates && updates.city !== formData.city) {
      setFormData(prev => ({ 
        ...prev, 
        ...updates,
        neighborhood: '' 
      }))
      return
    }
    
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleImagesUploaded = (images: string[]) => {
    updateFormData({ images })
  }

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setError('Debes iniciar sesión para publicar')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const normalizedMinStayMonths = Math.min(12, Math.max(1, Number(formData.minStayMonths) || 1))
      const normalizedMaxStayMonths = Math.min(12, Math.max(normalizedMinStayMonths, Number(formData.maxStayMonths) || 12))

      const submitData = {
        ...formData,
        floorNumber: formData.floorNumber ?? null,
        monthlyPrice: formData.pricePerMonth,
        minStayMonths: normalizedMinStayMonths,
        maxStayMonths: normalizedMaxStayMonths,
        amenities: {
          hasDesk: formData.hasDedicatedDesk,
          hasWifi: formData.wifiSpeed >= 10,
          wifiSpeed: formData.wifiSpeed,
          hasHeating: formData.hasHeating,
          hasAc: formData.hasAc,
          hasBalcony: formData.hasBalcony,
          hasTerrace: formData.hasTerrace,
          hasWashingMachine: formData.hasWashingMachine,
          hasDryer: formData.hasDryer,
          hasDishwasher: formData.hasDishwasher,
          hasKitchen: formData.hasKitchen,
          hasElevator: formData.hasElevator,
          hasParking: formData.hasParking,
          hasDoorman: formData.hasDoorman,
          floorNumber: formData.floorNumber ?? null,
          petsAllowed: formData.petsAllowed,
          smokingAllowed: formData.smokingAllowed,
          hasSecuritySystem: formData.hasSecuritySystem,
          hasSafe: formData.hasSafe,
        },
      }

      console.log('[CreateProperty] Sending data:', submitData)

      const res = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData),
      })

      let responseData: any = {}
      try {
        const responseText = await res.clone().text()
        console.log('[CreateProperty] Response text:', responseText.substring(0, 500))
        if (responseText) {
          responseData = await res.json()
        }
      } catch (e) {
        console.error('[CreateProperty] Failed to parse JSON response:', e)
        const text = await res.text()
        console.log('[CreateProperty] Raw response:', text.substring(0, 500))
        setError('Error del servidor: respuesta no válida')
        return
      }

      if (res.status === 401) {
        console.error('[CreateProperty] ❌ Usuario no autenticado - redirigiendo a login')
        window.location.href = `/${locale}/sign-in`
        return
      }

      if (!res.ok) {
        console.error('[CreateProperty] ❌ Error del servidor:', responseData)
        setError(responseData?.error || `Error del servidor: ${responseData?.message || 'Error desconocido'}`)
        return
      }

      console.log('[CreateProperty] ✅ Propiedad creada:', responseData)
      setSuccess(true)

      setTimeout(() => {
        router.push(`/${locale}/dashboard`)
      }, 1500)
    } catch (err: any) {
      console.error('[CreateProperty] ❌ Error:', err)
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Propiedad publicada! 🎉</h2>
        <p className="text-gray-600">Redirigiendo a tu dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={`/${locale}/dashboard`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">{t('publishProperty')}</h1>
            <div className="w-5" />
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center mb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    idx <= currentStepIndex ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      idx < currentStepIndex
                        ? 'bg-blue-600 text-white'
                        : idx === currentStepIndex
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 mx-2 ${
                      idx < currentStepIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {t('step')} {currentStepIndex + 1} {t('of')} {steps.length}: {steps[currentStepIndex].title}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form Content */}
        {/* BASIC INFO STEP */}
        {currentStep === 'basic' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              {t('basicInfo')}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('propertyTitle')} *</Label>
                <Input
                  id="title"
                  placeholder={t('placeholderTitle')}
                  value={formData.title}
                  onChange={e => updateFormData({ title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">{t('propertyDescription')} *</Label>
                <Textarea
                  id="description"
                  placeholder={t('placeholderDescription')}
                  value={formData.description}
                  onChange={e => updateFormData({ description: e.target.value })}
                  className="mt-1"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">{t('bedroomsLabel')} *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bedrooms}
                    onChange={e => updateFormData({ bedrooms: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">{t('bathroomsLabel')} *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bathrooms}
                    onChange={e => updateFormData({ bathrooms: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOCATION STEP */}
        {currentStep === 'location' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              {t('location')}
            </h2>

            <div className="space-y-4">
              {/* Country */}
              <div>
                <Label htmlFor="country">{t('country')} *</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={e => updateFormData({ country: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mt-1"
                >
                  {availableCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city">{t('city')} *</Label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={e => updateFormData({ city: e.target.value })}
                  disabled={!formData.country}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mt-1 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {formData.country ? t('selectCity') : t('selectCountryFirst')}
                  </option>
                  {availableCities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              {/* Neighborhood */}
              <div>
                <Label htmlFor="neighborhood">{t('neighborhood')} *</Label>
                <select
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={e => updateFormData({ neighborhood: e.target.value })}
                  disabled={!formData.city || availableNeighborhoods.length === 0}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white mt-1 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {formData.city 
                      ? (availableNeighborhoods.length > 0 ? t('selectNeighborhood') : t('noNeighborhoods'))
                      : t('selectCityFirst')
                    }
                  </option>
                  {availableNeighborhoods.map(neighborhood => (
                    <option key={neighborhood.slug} value={neighborhood.name}>{neighborhood.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="address">{t('address')} *</Label>
                <Textarea
                  id="address"
                  placeholder={t('placeholderAddress')}
                  value={formData.address}
                  onChange={e => updateFormData({ address: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE STEP */}
        {currentStep === 'workspace' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              {t('workspaceDigital')}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg">
                <Checkbox
                  id="hasDedicatedDesk"
                  checked={formData.hasDedicatedDesk}
                  onCheckedChange={checked => updateFormData({ hasDedicatedDesk: checked as boolean })}
                />
                <Label htmlFor="hasDedicatedDesk" className="cursor-pointer font-medium">
                  {t('dedicatedDesk')}
                </Label>
              </div>

              <div>
                <Label htmlFor="wifiSpeed">{t('wifiSpeed')} *</Label>
                <Input
                  id="wifiSpeed"
                  type="number"
                  min={10}
                  value={formData.wifiSpeed}
                  onChange={e => updateFormData({ wifiSpeed: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('minWifi')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AMENITIES STEP */}
        {currentStep === 'amenities' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">{t('amenities')}</h2>
              <p className="text-sm text-gray-500">{t('checkAllThatApply')}</p>
            </div>

            {/* Climate & Comfort */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('climateComfort')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasHeating"
                    checked={formData.hasHeating}
                    onCheckedChange={checked => updateFormData({ hasHeating: checked as boolean })}
                  />
                  <Label htmlFor="hasHeating" className="cursor-pointer">{t('heating')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAc"
                    checked={formData.hasAc}
                    onCheckedChange={checked => updateFormData({ hasAc: checked as boolean })}
                  />
                  <Label htmlFor="hasAc" className="cursor-pointer">{t('airConditioning')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasBalcony"
                    checked={formData.hasBalcony}
                    onCheckedChange={checked => updateFormData({ hasBalcony: checked as boolean })}
                  />
                  <Label htmlFor="hasBalcony" className="cursor-pointer">Balcón</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasTerrace"
                    checked={formData.hasTerrace}
                    onCheckedChange={checked => updateFormData({ hasTerrace: checked as boolean })}
                  />
                  <Label htmlFor="hasTerrace" className="cursor-pointer">Terraza</Label>
                </div>
              </div>
            </div>

            {/* Home & Amenities */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('homeAmenities')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWashingMachine"
                    checked={formData.hasWashingMachine}
                    onCheckedChange={checked => updateFormData({ hasWashingMachine: checked as boolean })}
                  />
                  <Label htmlFor="hasWashingMachine" className="cursor-pointer">{t('washer')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDryer"
                    checked={formData.hasDryer}
                    onCheckedChange={checked => updateFormData({ hasDryer: checked as boolean })}
                  />
                  <Label htmlFor="hasDryer" className="cursor-pointer">{t('dryer')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDishwasher"
                    checked={formData.hasDishwasher}
                    onCheckedChange={checked => updateFormData({ hasDishwasher: checked as boolean })}
                  />
                  <Label htmlFor="hasDishwasher" className="cursor-pointer">{t('dishwasher')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasKitchen"
                    checked={formData.hasKitchen}
                    onCheckedChange={checked => updateFormData({ hasKitchen: checked as boolean })}
                  />
                  <Label htmlFor="hasKitchen" className="cursor-pointer">{t('fullyEquippedKitchen')}</Label>
                </div>
              </div>
            </div>

            {/* Building & Accessibility */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('buildingAccessibility')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasElevator"
                    checked={formData.hasElevator}
                    onCheckedChange={checked => updateFormData({ hasElevator: checked as boolean })}
                  />
                  <Label htmlFor="hasElevator" className="cursor-pointer">{t('elevator')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasParking"
                    checked={formData.hasParking}
                    onCheckedChange={checked => updateFormData({ hasParking: checked as boolean })}
                  />
                  <Label htmlFor="hasParking" className="cursor-pointer">{t('parking')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDoorman"
                    checked={formData.hasDoorman}
                    onCheckedChange={checked => updateFormData({ hasDoorman: checked as boolean })}
                  />
                  <Label htmlFor="hasDoorman" className="cursor-pointer">{t('concierge')}</Label>
                </div>
                <div>
                  <Label htmlFor="floorNumber" className="text-sm">{t('floorNumberLabel')}</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min={0}
                    max={50}
                    placeholder={t('floorNumberPlaceholder')}
                    value={formData.floorNumber || ''}
                    onChange={e => updateFormData({ floorNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('lifestyle')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petsAllowed"
                    checked={formData.petsAllowed}
                    onCheckedChange={checked => updateFormData({ petsAllowed: checked as boolean })}
                  />
                  <Label htmlFor="petsAllowed" className="cursor-pointer">{t('petFriendly')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onCheckedChange={checked => updateFormData({ smokingAllowed: checked as boolean })}
                  />
                  <Label htmlFor="smokingAllowed" className="cursor-pointer">{t('smokingAllowed')}</Label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="font-semibold text-lg mb-3">{t('security')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSecuritySystem"
                    checked={formData.hasSecuritySystem}
                    onCheckedChange={checked => updateFormData({ hasSecuritySystem: checked as boolean })}
                  />
                  <Label htmlFor="hasSecuritySystem" className="cursor-pointer">{t('securitySystem')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSafe"
                    checked={formData.hasSafe}
                    onCheckedChange={checked => updateFormData({ hasSafe: checked as boolean })}
                  />
                  <Label htmlFor="hasSafe" className="cursor-pointer">{t('safe')}</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRICING STEP */}
        {currentStep === 'pricing' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Euro className="h-5 w-5 text-blue-600" />
              {t('pricingTitle')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pricePerNight">{t('pricePerNight')} *</Label>
                  <Input
                    id="pricePerNight"
                    type="number"
                    min={1}
                    value={formData.pricePerNight}
                    onChange={e => updateFormData({ pricePerNight: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerWeek">{t('pricePerWeek')} *</Label>
                  <Input
                    id="pricePerWeek"
                    type="number"
                    min={1}
                    value={formData.pricePerWeek}
                    onChange={e => updateFormData({ pricePerWeek: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pricePerMonth">{t('pricePerMonth')} *</Label>
                  <Input
                    id="pricePerMonth"
                    type="number"
                    min={1}
                    value={formData.pricePerMonth}
                    onChange={e => updateFormData({ pricePerMonth: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStayMonths">{t('minStayMonthsLabel')}</Label>
                  <Input
                    id="minStayMonths"
                    type="number"
                    min={1}
                    max={12}
                    value={formData.minStayMonths}
                    onChange={e => updateFormData({ minStayMonths: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxStayMonths">{t('maxStayMonthsLabel')}</Label>
                  <Input
                    id="maxStayMonths"
                    type="number"
                    min={1}
                    max={12}
                    value={formData.maxStayMonths}
                    onChange={e => updateFormData({ maxStayMonths: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {t('priceTip')}
                </p>
                <p className="text-xs text-yellow-700 mt-2">
                  {t('stayTermsHint')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* IMAGES STEP */}
        {currentStep === 'images' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              {t('photos')}
            </h2>

            <CloudinaryUploader
              onImagesUploaded={handleImagesUploaded}
              existingImages={formData.images}
              maxImages={10}
            />

            {formData.images.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">{t('uploadedPhotos')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${t('photos')} ${idx + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW STEP */}
        {currentStep === 'preview' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Check className="h-5 w-5 text-blue-600" />
              {t('review')}
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600">
                {t('reviewDescription')}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>{t('titleLabel')}:</strong> {formData.title}
                </div>
                <div>
                  <strong>{t('location')}:</strong> {formData.city}, {formData.country}
                </div>
                <div>
                  <strong>{t('bedroomsLabel')}:</strong> {formData.bedrooms} | <strong>{t('bathroomsLabel')}:</strong>{' '}
                  {formData.bathrooms}
                </div>
                <div>
                  <strong>{t('wifiLabel')}:</strong> {formData.wifiSpeed} Mbps
                </div>
                <div>
                  <strong>{t('priceMonthLabel')}:</strong> {formData.pricePerMonth} EUR
                </div>
                <div>
                  <strong>{t('stayRangeLabel')}:</strong> {formData.minStayMonths}–{formData.maxStayMonths} {t('monthsLabel')}
                </div>
                <div>
                  <strong>{t('photosLabel')}:</strong> {formData.images.length}
                </div>
              </div>

              <div className="border-t pt-4">
                <strong>{t('descriptionLabel')}:</strong>
                <p className="mt-2 text-gray-600">{formData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep || submitting}
            className="min-w-[120px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('previous')}
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                t('publishProperty')
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={submitting} className="min-w-[120px]">
              {t('next')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CreatePropertyClient() {
  return <CreatePropertyContent />
}