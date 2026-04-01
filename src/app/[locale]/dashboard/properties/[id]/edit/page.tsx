'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2, Home, MapPin, Wifi, Euro, Zap } from 'lucide-react'
import Link from 'next/link'

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const listingId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    city: '',
    neighborhood: '',
    hasDesk: false,
    wifiSpeed: 0,
    hasSecondMonitor: false,
    furnished: false,
    // Amenities
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
    monthlyPrice: 1000,
    minStayMonths: 1,
    maxStayMonths: 12,
  })

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
      return
    }

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`)
        if (!res.ok) throw new Error('Failed to fetch listing')
        
        const data = await res.json()
        
        // Verificar que data existe
        if (!data) {
          throw new Error('No data received')
        }
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          city: data.city_name || '',
          neighborhood: data.neighborhood || '',
          hasDesk: data.has_desk || false,
          wifiSpeed: data.wifi_speed_mbps || 0,
          hasSecondMonitor: data.has_second_monitor || false,
          furnished: data.furnished || false,
          hasHeating: data.has_heating || false,
          hasAc: data.has_ac || false,
          hasBalcony: data.has_balcony || false,
          hasTerrace: data.has_terrace || false,
          hasWashingMachine: data.has_washing_machine || false,
          hasDryer: data.has_dryer || false,
          hasDishwasher: data.has_dishwasher || false,
          hasKitchen: data.has_kitchen || false,
          hasElevator: data.has_elevator || false,
          hasParking: data.has_parking || false,
          hasDoorman: data.has_doorman || false,
          floorNumber: data.floor_number || undefined,
          petsAllowed: data.pets_allowed || false,
          smokingAllowed: data.smoking_allowed || false,
          hasSecuritySystem: data.has_security_system || false,
          hasSafe: data.has_safe || false,
          monthlyPrice: data.monthly_price || 1000,
          minStayMonths: data.min_months || 1,
          maxStayMonths: data.max_months || 12,
        })
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isSignedIn) {
      fetchListing()
    }
  }, [isLoaded, isSignedIn, listingId, router])

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/properties/${listingId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al actualizar')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl font-bold">Editar Propiedad</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Messages */}
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
                ✅ ¡Cambios guardados! Redirigiendo...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Basic Info */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Home className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Información Básica</h2>
          </div>

          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => updateFormData({ title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => updateFormData({ description: e.target.value })}
              rows={6}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Habitaciones</Label>
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
              <Label htmlFor="bathrooms">Baños</Label>
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

        {/* Location */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Ubicación</h2>
          </div>

          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={e => updateFormData({ city: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="neighborhood">Barrio</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={e => updateFormData({ neighborhood: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Workspace */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow mb-6">
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
              <Label htmlFor="hasDesk" className="cursor-pointer">Escritorio dedicado</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSecondMonitor"
                checked={formData.hasSecondMonitor}
                onCheckedChange={checked => updateFormData({ hasSecondMonitor: checked as boolean })}
              />
              <Label htmlFor="hasSecondMonitor" className="cursor-pointer">Monitor adicional</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={formData.furnished}
                onCheckedChange={checked => updateFormData({ furnished: checked as boolean })}
              />
              <Label htmlFor="furnished" className="cursor-pointer">Amueblado</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="wifiSpeed">Velocidad WiFi (Mbps)</Label>
            <Input
              id="wifiSpeed"
              type="number"
              min={10}
              value={formData.wifiSpeed}
              onChange={e => updateFormData({ wifiSpeed: parseInt(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Comodidades</h2>
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

          {/* Hogar */}
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

          {/* Edificio */}
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
                <Label htmlFor="floorNumber" className="text-sm">Número de Piso</Label>
                <Input
                  id="floorNumber"
                  type="number"
                  min={0}
                  max={50}
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

        {/* Pricing */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Euro className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Precios</h2>
          </div>

          <div>
            <Label htmlFor="monthlyPrice">Precio mensual (€)</Label>
            <Input
              id="monthlyPrice"
              type="number"
              min={100}
              value={formData.monthlyPrice}
              onChange={e => updateFormData({ monthlyPrice: parseInt(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStayMonths">Estancia mínima (meses)</Label>
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
              <Label htmlFor="maxStayMonths">Estancia máxima (meses)</Label>
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
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
