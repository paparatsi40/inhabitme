import Link from 'next/link'
import { Building2, MapPin, Wifi, Monitor, Bed, Bath } from 'lucide-react'

export function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-gray-400" />
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
              €{Number(property.monthlyPrice).toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">/mes</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
