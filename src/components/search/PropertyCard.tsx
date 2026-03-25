import Link from 'next/link'
import { Building2, MapPin, Wifi, Monitor, Bed, Bath } from 'lucide-react'
import { getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency'

export function PropertyCard({ property }: { property: any }) {
  // Obtener la primera imagen o usar placeholder
  // Las imágenes pueden ser strings directos o objetos con .url
  const firstImage = property.images?.[0]
  const mainImage = (typeof firstImage === 'string' ? firstImage : firstImage?.url) 
    || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  
  console.log('[PropertyCard]', property.title, 'images:', property.images, 'mainImage:', mainImage)

  const currency = normalizeCurrency(property.currency ?? getCurrencyFromLocation(property.city?.country, property.city?.name))
  const locale = currency === 'EUR' ? 'es-ES' : 'en-US'
  const monthlyPriceFormatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(property.monthlyPrice || 0))
  
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img 
            src={mainImage} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{property.title}</h3>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.city.name}, {property.city.country}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              {property.bedrooms} hab
            </span>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              {property.bathrooms} baños
            </span>

            {property.wifiSpeed && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                <Wifi className="h-3 w-3 mr-1" />
                {property.wifiSpeed} mbps
              </span>
            )}

            {property.hasSecondMonitor && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center">
                <Monitor className="h-3 w-3 mr-1" />
                Monitor
              </span>
            )}
          </div>

          <div className="pt-3 border-t flex justify-between items-baseline">
            <span className="text-2xl font-bold text-blue-600">
              {monthlyPriceFormatted}
            </span>
            <span className="text-gray-600 text-sm">/mes</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
