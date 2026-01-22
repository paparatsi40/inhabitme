'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

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

    hasDesk: true,
    wifiSpeed: 100,
    hasSecondMonitor: false,
    furnished: true,

    // Amenities - Clima y Confort
    hasHeating: false,
    hasAc: false,
    hasBalcony: false,
    hasTerrace: false,

    // Amenities - Hogar
    hasWashingMachine: false,
    hasDryer: false,
    hasDishwasher: false,
    hasKitchen: true,

    // Amenities - Edificio
    hasElevator: false,
    hasParking: false,
    hasDoorman: false,
    floorNumber: undefined as number | undefined,

    // Amenities - Estilo de vida
    petsAllowed: false,
    smokingAllowed: false,

    // Amenities - Seguridad
    hasSecuritySystem: false,
    hasSafe: false,

    monthlyPrice: 1000,
    minStayMonths: 1,
    maxStayMonths: 6,

    images: [] as string[],
  })

  const steps: { id: Step; title: string; icon: any }[] = [
    { id: 'basic', title: 'Información Básica', icon: Home },
    { id: 'location', title: 'Ubicación', icon: MapPin },
    { id: 'workspace', title: 'Workspace', icon: Wifi },
    { id: 'amenities', title: 'Comodidades', icon: Check },
    { id: 'pricing', title: 'Precios', icon: Euro },
    { id: 'images', title: 'Fotos', icon: ImageIcon },
    { id: 'preview', title: 'Revisar', icon: Check },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isSignedIn) return null

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setError('')
  }

  const validateStep = () => {
    setError('')

    switch (currentStep) {
      case 'basic':
        if (!formData.title || formData.title.length < 10) {
          setError('El título debe tener al menos 10 caracteres')
          return false
        }
        if (!formData.description || formData.description.length < 50) {
          setError('La descripción debe tener al menos 50 caracteres')
          return false
        }
        if (formData.bedrooms < 1) {
          setError('Debe tener al menos 1 habitación')
          return false
        }
        if (formData.bathrooms < 1) {
          setError('Debe tener al menos 1 baño')
          return false
        }
        break

      case 'location':
        if (!formData.city) {
          setError('La ciudad es obligatoria')
          return false
        }
        if (!formData.address) {
          setError('La dirección es obligatoria')
          return false
        }
        break

      case 'workspace':
        if (formData.wifiSpeed < 10) {
          setError('La velocidad WiFi debe ser al menos 10 Mbps')
          return false
        }
        break

      case 'pricing':
        if (formData.monthlyPrice < 100) {
          setError('El precio mensual debe ser al menos €100')
          return false
        }
        if (formData.minStayMonths < 1) {
          setError('La estancia mínima debe ser al menos 1 mes')
          return false
        }
        if (formData.maxStayMonths < formData.minStayMonths) {
          setError('La estancia máxima debe ser mayor o igual a la mínima')
          return false
        }
        break

      case 'images':
        if (formData.images.length === 0) {
          setError('Debes subir al menos una imagen')
          return false
        }
        break
    }

    return true
  }

  const nextStep = () => {
    if (validateStep() && currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setSubmitting(true)
    setError('')

    try {
      console.log('[CreateProperty] Enviando payload:', formData)

      const payload = {
        title: formData.title,
        description: formData.description,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        country: formData.country,
        city: formData.city,
        neighborhood: formData.neighborhood || null,
        address: formData.address,
        hasDesk: formData.hasDesk,
        hasSecondMonitor: formData.hasSecondMonitor,
        wifiSpeed: formData.wifiSpeed,
        furnished: formData.furnished,
        // Amenities
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
        floorNumber: formData.floorNumber || null,
        petsAllowed: formData.petsAllowed,
        smokingAllowed: formData.smokingAllowed,
        hasSecuritySystem: formData.hasSecuritySystem,
        hasSafe: formData.hasSafe,
        // Pricing
        monthlyPrice: formData.monthlyPrice,
        minStayMonths: formData.minStayMonths,
        maxStayMonths: formData.maxStayMonths,
        images: formData.images,
      }

      console.log('[CreateProperty] 🚀 Payload.images antes de enviar:', payload.images);
      console.log('[CreateProperty] 🚀 Payload.images es array?', Array.isArray(payload.images));
      console.log('[CreateProperty] 🚀 Payload.images.length:', payload.images?.length);

      const res = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      console.log('[CreateProperty] Respuesta status:', res.status)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('[CreateProperty] Error del servidor:', errorData)
        throw new Error(errorData.error || 'Error al crear la propiedad')
      }

      const data = await res.json()
      console.log('[CreateProperty] Propiedad creada exitosamente:', data)

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      console.error('[CreateProperty] Error capturado:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Cancelar
          </Link>
          <h1 className="text-xl font-bold">Publicar Propiedad</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2
                    ${idx <= currentStepIndex
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {idx < currentStepIndex ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{idx + 1}</span>
                  )}
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
            Paso {currentStepIndex + 1} de {steps.length}: {steps[currentStepIndex].title}
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

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-600 font-medium">
                ✅ ¡Propiedad creada con éxito! Redirigiendo...
              </p>
            </CardContent>
          </Card>
        )}

        {/* BASIC STEP */}
        {currentStep === 'basic' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <Home className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Información Básica</h2>
            </div>

            <div>
              <Label htmlFor="title">Título de la propiedad *</Label>
              <Input
                id="title"
                placeholder="Ej: Apartamento céntrico con WiFi rápido"
                value={formData.title}
                onChange={e => updateFormData({ title: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 10 caracteres ({formData.title.length}/10)
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe tu propiedad en detalle..."
                value={formData.description}
                onChange={e => updateFormData({ description: e.target.value })}
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 50 caracteres ({formData.description.length}/50)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Habitaciones *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={1}
                  value={formData.bedrooms}
                  onChange={e => updateFormData({ bedrooms: parseInt(e.target.value) || 1 })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Baños *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={1}
                  value={formData.bathrooms}
                  onChange={e => updateFormData({ bathrooms: parseInt(e.target.value) || 1 })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* LOCATION STEP */}
        {currentStep === 'location' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Ubicación</h2>
            </div>

            <div>
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={e => updateFormData({ country: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                placeholder="Ej: Madrid, Barcelona, Valencia..."
                value={formData.city}
                onChange={e => updateFormData({ city: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Barrio</Label>
              <Input
                id="neighborhood"
                placeholder="Ej: Malasaña, Eixample, El Carmen..."
                value={formData.neighborhood}
                onChange={e => updateFormData({ neighborhood: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>

            <div>
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                placeholder="Calle, número, piso..."
                value={formData.address}
                onChange={e => updateFormData({ address: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                No se mostrará públicamente hasta que reserves
              </p>
            </div>
          </div>
        )}

        {/* WORKSPACE STEP */}
        {currentStep === 'workspace' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <Wifi className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Espacio de Trabajo</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasDesk"
                  checked={formData.hasDesk}
                  onCheckedChange={checked => updateFormData({ hasDesk: checked as boolean })}
                />
                <Label htmlFor="hasDesk" className="cursor-pointer">
                  Escritorio dedicado
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSecondMonitor"
                  checked={formData.hasSecondMonitor}
                  onCheckedChange={checked => updateFormData({ hasSecondMonitor: checked as boolean })}
                />
                <Label htmlFor="hasSecondMonitor" className="cursor-pointer">
                  Monitor adicional disponible
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={formData.furnished}
                  onCheckedChange={checked => updateFormData({ furnished: checked as boolean })}
                />
                <Label htmlFor="furnished" className="cursor-pointer">
                  Amueblado
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="wifiSpeed">Velocidad WiFi (Mbps) *</Label>
              <Input
                id="wifiSpeed"
                type="number"
                min={10}
                value={formData.wifiSpeed}
                onChange={e => updateFormData({ wifiSpeed: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 10 Mbps. Recomendado: 50+ Mbps para videollamadas
              </p>
            </div>
          </div>
        )}

        {/* AMENITIES STEP */}
        {currentStep === 'amenities' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Comodidades</h2>
              <p className="text-sm text-gray-500">Marca todas las que apliquen</p>
            </div>

            {/* Clima y Confort */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🌡️ Clima y Confort</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasHeating"
                    checked={formData.hasHeating}
                    onCheckedChange={checked => updateFormData({ hasHeating: checked as boolean })}
                  />
                  <Label htmlFor="hasHeating" className="cursor-pointer">Calefacción</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAc"
                    checked={formData.hasAc}
                    onCheckedChange={checked => updateFormData({ hasAc: checked as boolean })}
                  />
                  <Label htmlFor="hasAc" className="cursor-pointer">Aire Acondicionado</Label>
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

            {/* Hogar y Comodidades */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🏠 Hogar y Comodidades</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWashingMachine"
                    checked={formData.hasWashingMachine}
                    onCheckedChange={checked => updateFormData({ hasWashingMachine: checked as boolean })}
                  />
                  <Label htmlFor="hasWashingMachine" className="cursor-pointer">Lavadora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDryer"
                    checked={formData.hasDryer}
                    onCheckedChange={checked => updateFormData({ hasDryer: checked as boolean })}
                  />
                  <Label htmlFor="hasDryer" className="cursor-pointer">Secadora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDishwasher"
                    checked={formData.hasDishwasher}
                    onCheckedChange={checked => updateFormData({ hasDishwasher: checked as boolean })}
                  />
                  <Label htmlFor="hasDishwasher" className="cursor-pointer">Lavavajillas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasKitchen"
                    checked={formData.hasKitchen}
                    onCheckedChange={checked => updateFormData({ hasKitchen: checked as boolean })}
                  />
                  <Label htmlFor="hasKitchen" className="cursor-pointer">Cocina Completa</Label>
                </div>
              </div>
            </div>

            {/* Edificio y Accesibilidad */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🏢 Edificio y Accesibilidad</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasElevator"
                    checked={formData.hasElevator}
                    onCheckedChange={checked => updateFormData({ hasElevator: checked as boolean })}
                  />
                  <Label htmlFor="hasElevator" className="cursor-pointer">Ascensor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasParking"
                    checked={formData.hasParking}
                    onCheckedChange={checked => updateFormData({ hasParking: checked as boolean })}
                  />
                  <Label htmlFor="hasParking" className="cursor-pointer">Parking/Garaje</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDoorman"
                    checked={formData.hasDoorman}
                    onCheckedChange={checked => updateFormData({ hasDoorman: checked as boolean })}
                  />
                  <Label htmlFor="hasDoorman" className="cursor-pointer">Portero/Conserje</Label>
                </div>
                <div>
                  <Label htmlFor="floorNumber" className="text-sm">Número de Piso (opcional)</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min={0}
                    max={50}
                    placeholder="Ej: 3"
                    value={formData.floorNumber || ''}
                    onChange={e => updateFormData({ floorNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Estilo de Vida */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🐾 Estilo de Vida</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petsAllowed"
                    checked={formData.petsAllowed}
                    onCheckedChange={checked => updateFormData({ petsAllowed: checked as boolean })}
                  />
                  <Label htmlFor="petsAllowed" className="cursor-pointer">Se Permiten Mascotas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smokingAllowed"
                    checked={formData.smokingAllowed}
                    onCheckedChange={checked => updateFormData({ smokingAllowed: checked as boolean })}
                  />
                  <Label htmlFor="smokingAllowed" className="cursor-pointer">Se Permite Fumar</Label>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div>
              <h3 className="font-semibold text-lg mb-3">🔒 Seguridad</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSecuritySystem"
                    checked={formData.hasSecuritySystem}
                    onCheckedChange={checked => updateFormData({ hasSecuritySystem: checked as boolean })}
                  />
                  <Label htmlFor="hasSecuritySystem" className="cursor-pointer">Sistema de Seguridad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasSafe"
                    checked={formData.hasSafe}
                    onCheckedChange={checked => updateFormData({ hasSafe: checked as boolean })}
                  />
                  <Label htmlFor="hasSafe" className="cursor-pointer">Caja Fuerte</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRICING STEP */}
        {currentStep === 'pricing' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <Euro className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Precios</h2>
            </div>

            <div>
              <Label htmlFor="monthlyPrice">Precio mensual (€) *</Label>
              <Input
                id="monthlyPrice"
                type="number"
                min={100}
                value={formData.monthlyPrice}
                onChange={e => updateFormData({ monthlyPrice: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo €100</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minStayMonths">Estancia mínima (meses) *</Label>
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
                <Label htmlFor="maxStayMonths">Estancia máxima (meses) *</Label>
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

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-blue-900 mb-2">Estimación de ingresos</p>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>
                    Estancia mínima ({formData.minStayMonths} meses):{' '}
                    <span className="font-bold">
                      €{(formData.monthlyPrice * formData.minStayMonths).toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Estancia máxima ({formData.maxStayMonths} meses):{' '}
                    <span className="font-bold">
                      €{(formData.monthlyPrice * formData.maxStayMonths).toLocaleString()}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* IMAGES STEP */}
        {currentStep === 'images' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Fotos</h2>
            </div>

            <CloudinaryUploader
              onImagesUploaded={urls => {
                console.log('[CreateProperty] Imágenes recibidas del uploader:', urls);
                updateFormData({ images: urls })
                console.log('[CreateProperty] FormData.images actualizado a:', urls);
              }}
              existingImages={formData.images}
              maxImages={10}
            />

            <p className="text-sm text-gray-500">
              {formData.images.length === 0
                ? 'Sube al menos 1 imagen de tu propiedad'
                : `${formData.images.length} imagen(es) subida(s)`}
            </p>
          </div>
        )}

        {/* PREVIEW STEP */}
        {currentStep === 'preview' && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Revisar Propiedad</h2>

            <Card className="bg-yellow-50 border-yellow-200 mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-yellow-800">
                  ⚠️ Revisa toda la información antes de publicar. Podrás editarla después.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Información Básica</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <p><span className="font-medium">Título:</span> {formData.title}</p>
                  <p><span className="font-medium">Descripción:</span> {formData.description}</p>
                  <p>
                    <span className="font-medium">Habitaciones:</span> {formData.bedrooms} |{' '}
                    <span className="font-medium">Baños:</span> {formData.bathrooms}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Ubicación</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <p><span className="font-medium">País:</span> {formData.country}</p>
                  <p><span className="font-medium">Ciudad:</span> {formData.city}</p>
                  {formData.neighborhood && (
                    <p><span className="font-medium">Barrio:</span> {formData.neighborhood}</p>
                  )}
                  <p><span className="font-medium">Dirección:</span> {formData.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Workspace</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <p><span className="font-medium">Escritorio:</span> {formData.hasDesk ? '✅ Sí' : '❌ No'}</p>
                  <p>
                    <span className="font-medium">Monitor adicional:</span>{' '}
                    {formData.hasSecondMonitor ? '✅ Sí' : '❌ No'}
                  </p>
                  <p><span className="font-medium">Amueblado:</span> {formData.furnished ? '✅ Sí' : '❌ No'}</p>
                  <p><span className="font-medium">WiFi:</span> {formData.wifiSpeed} Mbps</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Precios</h3>
                <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                  <p><span className="font-medium">Precio mensual:</span> €{formData.monthlyPrice}</p>
                  <p>
                    <span className="font-medium">Estancia:</span> {formData.minStayMonths} - {formData.maxStayMonths} meses
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Imágenes ({formData.images.length})
                </h3>
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay imágenes</p>
                )}
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
            Anterior
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
                  Publicando...
                </>
              ) : (
                'Publicar Propiedad'
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={submitting} className="min-w-[120px]">
              Siguiente
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
