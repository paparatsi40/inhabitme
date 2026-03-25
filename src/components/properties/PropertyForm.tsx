'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface PropertyFormProps {
  clerkId: string;
}

export function PropertyForm({ clerkId }: PropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    
    // Location
    city: '',
    country: 'España',
    address: '',
    zipCode: '',
    
    // Pricing
    monthlyPrice: '',
    depositAmount: '',
    
    // Property details
    bedrooms: '1',
    bathrooms: '1',
    squareMeters: '',
    floor: '',
    hasElevator: false,
    
    // Workspace (inhabitme differentiator!)
    hasDesk: true,
    hasErgonomicChair: false,
    wifiSpeed: '',
    hasSecondMonitor: false,
    
    // Amenities
    hasAC: false,
    hasHeating: true,
    hasWashingMachine: false,
    hasDishwasher: false,
    hasTV: false,
    hasParkingSpace: false,
    petsAllowed: false,
    smokingAllowed: false,
    
    // Availability
    minStayMonths: '1',
    maxStayMonths: '6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clerkId,
          monthlyPrice: parseFloat(formData.monthlyPrice),
          depositAmount: parseFloat(formData.depositAmount),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          squareMeters: formData.squareMeters ? parseInt(formData.squareMeters) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          wifiSpeed: formData.wifiSpeed ? parseInt(formData.wifiSpeed) : null,
          minStayMonths: parseInt(formData.minStayMonths),
          maxStayMonths: parseInt(formData.maxStayMonths),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/properties/${data.property.id}`);
      } else {
        alert('Error al crear la propiedad');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la propiedad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título del anuncio *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Apartamento moderno en Chamberí con workspace"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu alojamiento, el barrio, qué lo hace especial para teletrabajo..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Madrid"
              />
            </div>

            <div>
              <Label htmlFor="country">País *</Label>
              <select
                id="country"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="España">España</option>
                <option value="Portugal">Portugal</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Calle, número"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">Código postal</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="28010"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Precio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyPrice">Precio mensual (EUR/USD) *</Label>
              <Input
                id="monthlyPrice"
                type="number"
                required
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                placeholder="1400"
              />
            </div>

            <div>
              <Label htmlFor="depositAmount">Depósito (EUR/USD) *</Label>
              <Input
                id="depositAmount"
                type="number"
                required
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                placeholder="1400"
              />
              <p className="text-sm text-gray-500 mt-1">
                Normalmente equivalente a 1 mes de alquiler
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la propiedad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms">Habitaciones *</Label>
              <select
                id="bedrooms"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="bathrooms">Baños *</Label>
              <select
                id="bathrooms"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="squareMeters">Metros cuadrados</Label>
              <Input
                id="squareMeters"
                type="number"
                value={formData.squareMeters}
                onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                placeholder="75"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="floor">Piso</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="3"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="hasElevator"
                checked={formData.hasElevator}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasElevator: checked as boolean })
                }
              />
              <Label htmlFor="hasElevator" className="cursor-pointer">
                Tiene ascensor
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Amenities - El diferenciador de inhabitme! */}
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-900">🖥️ Workspace (Obligatorio)</CardTitle>
          <p className="text-sm text-blue-700">
            inhabitme se especializa en espacios para teletrabajo. Estos campos son muy importantes.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDesk"
                checked={formData.hasDesk}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasDesk: checked as boolean })
                }
              />
              <Label htmlFor="hasDesk" className="cursor-pointer font-medium">
                Escritorio dedicado *
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasErgonomicChair"
                checked={formData.hasErgonomicChair}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasErgonomicChair: checked as boolean })
                }
              />
              <Label htmlFor="hasErgonomicChair" className="cursor-pointer font-medium">
                Silla ergonómica
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSecondMonitor"
                checked={formData.hasSecondMonitor}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasSecondMonitor: checked as boolean })
                }
              />
              <Label htmlFor="hasSecondMonitor" className="cursor-pointer font-medium">
                Monitor externo incluido
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="wifiSpeed">Velocidad WiFi (Mbps) *</Label>
            <Input
              id="wifiSpeed"
              type="number"
              required
              value={formData.wifiSpeed}
              onChange={(e) => setFormData({ ...formData, wifiSpeed: e.target.value })}
              placeholder="300"
            />
            <p className="text-sm text-gray-600 mt-1">
              Realizaremos un test de velocidad para verificar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Standard Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Comodidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAC"
                checked={formData.hasAC}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasAC: checked as boolean })
                }
              />
              <Label htmlFor="hasAC" className="cursor-pointer">Aire acondicionado</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasHeating"
                checked={formData.hasHeating}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasHeating: checked as boolean })
                }
              />
              <Label htmlFor="hasHeating" className="cursor-pointer">Calefacción</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWashingMachine"
                checked={formData.hasWashingMachine}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasWashingMachine: checked as boolean })
                }
              />
              <Label htmlFor="hasWashingMachine" className="cursor-pointer">Lavadora</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDishwasher"
                checked={formData.hasDishwasher}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasDishwasher: checked as boolean })
                }
              />
              <Label htmlFor="hasDishwasher" className="cursor-pointer">Lavavajillas</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasTV"
                checked={formData.hasTV}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasTV: checked as boolean })
                }
              />
              <Label htmlFor="hasTV" className="cursor-pointer">TV</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasParkingSpace"
                checked={formData.hasParkingSpace}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasParkingSpace: checked as boolean })
                }
              />
              <Label htmlFor="hasParkingSpace" className="cursor-pointer">Plaza de parking</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="petsAllowed"
                checked={formData.petsAllowed}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, petsAllowed: checked as boolean })
                }
              />
              <Label htmlFor="petsAllowed" className="cursor-pointer">Se admiten mascotas</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="smokingAllowed"
                checked={formData.smokingAllowed}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, smokingAllowed: checked as boolean })
                }
              />
              <Label htmlFor="smokingAllowed" className="cursor-pointer">Se puede fumar</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Disponibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStayMonths">Estancia mínima (meses) *</Label>
              <select
                id="minStayMonths"
                required
                value={formData.minStayMonths}
                onChange={(e) => setFormData({ ...formData, minStayMonths: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="maxStayMonths">Estancia máxima (meses) *</Label>
              <select
                id="maxStayMonths"
                required
                value={formData.maxStayMonths}
                onChange={(e) => setFormData({ ...formData, maxStayMonths: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'mes' : 'meses'}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? 'Creando...' : 'Publicar propiedad'}
        </Button>
      </div>
    </form>
  );
}