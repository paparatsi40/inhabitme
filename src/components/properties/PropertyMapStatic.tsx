'use client';

import { MapPin } from 'lucide-react';

interface PropertyMapStaticProps {
  latitude?: number;
  longitude?: number;
  address: string;
  city: string;
  title: string;
}

// Coordenadas por defecto de ciudades españolas
const CITY_COORDS: Record<string, [number, number]> = {
  'Madrid': [40.4168, -3.7038],
  'Barcelona': [41.3874, 2.1686],
  'Valencia': [39.4699, -0.3763],
  'Sevilla': [37.3891, -5.9845],
  'Lisboa': [38.7223, -9.1393],
  'Porto': [41.1579, -8.6291],
};

export function PropertyMapStatic({ latitude, longitude, address, city, title }: PropertyMapStaticProps) {
  // Use provided coordinates or fallback to city center
  const lat = typeof latitude === 'number' ? latitude : (typeof latitude === 'string' ? parseFloat(latitude) : null);
  const lng = typeof longitude === 'number' ? longitude : (typeof longitude === 'string' ? parseFloat(longitude) : null);
  
  const coords: [number, number] = lat && lng 
    ? [lat, lng]
    : CITY_COORDS[city] || [40.4168, -3.7038];

  // OpenStreetMap static image URL
  const zoom = 15;
  const width = 800;
  const height = 400;
  
  // Using OpenStreetMap StaticMap API
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coords[1]-0.01},${coords[0]-0.01},${coords[1]+0.01},${coords[0]+0.01}&layer=mapnik&marker=${coords[0]},${coords[1]}`;

  return (
    <div className="space-y-3">
      <div className="h-96 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          style={{ border: 0 }}
          title={`Mapa de ${title}`}
        />
      </div>
      
      <div className="flex items-start gap-2 text-sm text-gray-600">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-gray-900">{address}</p>
          <p>{city}</p>
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
          >
            Ver en Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}