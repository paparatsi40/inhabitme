import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Wifi, Monitor, Bed, Bath, CheckCircle2 } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    country: string;
    monthlyPrice: number | { toNumber: () => number };
    bedrooms: number;
    bathrooms: number;
    hasDesk: boolean;
    wifiSpeed: number | null;
    wifiVerified: boolean;
    hasSecondMonitor: boolean;
    isVerified: boolean;
    images: { url: string }[];
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const price = typeof property.monthlyPrice === 'number' 
    ? property.monthlyPrice 
    : property.monthlyPrice.toNumber();

  const mainImage = property.images[0]?.url || property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop';

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {mainImage && !mainImage.includes('unsplash') ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {property.isVerified && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {property.city}, {property.country}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              <Bed className="h-3 w-3 mr-1" />
              {property.bedrooms} hab
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Bath className="h-3 w-3 mr-1" />
              {property.bathrooms} baños
            </Badge>
            {property.wifiSpeed && (
              <Badge variant="secondary" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                {property.wifiSpeed}mbps
              </Badge>
            )}
            {property.hasSecondMonitor && (
              <Badge variant="secondary" className="text-xs">
                <Monitor className="h-3 w-3 mr-1" />
                Monitor
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="pt-3 border-t">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-blue-600">
                  €{price.toLocaleString()}
                </span>
                <span className="text-gray-600 text-sm ml-1">/mes</span>
              </div>
              {property.hasDesk && (
                <Badge variant="outline" className="text-xs">
                  Workspace
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}