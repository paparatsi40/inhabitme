'use client';

import { useState } from 'react';
import { Star, Info } from 'lucide-react';

interface FeaturedToggleProps {
  propertyId: string;
  initialFeatured: boolean;
  isFoundingHost?: boolean;
}

export function FeaturedToggle({ propertyId, initialFeatured, isFoundingHost = false }: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/properties/${propertyId}/toggle-featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      });

      if (res.ok) {
        setFeatured(!featured);
      } else {
        alert('Error al actualizar Featured');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar Featured');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          featured ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-300'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            featured ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <div className="flex items-center gap-2">
        <Star className={`h-4 w-4 ${featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${featured ? 'text-yellow-700' : 'text-gray-600'}`}>
          Featured
        </span>
        
        {isFoundingHost && (
          <div className="group relative">
            <Info className="h-4 w-4 text-blue-500 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <strong className="text-yellow-400">🏆 Founding Host 2026:</strong> Featured es gratis para ti durante todo 2026. Sin costo adicional.
            </div>
          </div>
        )}
        
        {!isFoundingHost && (
          <div className="group relative">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <strong>Featured Listing:</strong> Tu propiedad aparece primero en búsquedas. Pagas €20-40 adicionales según duración de la reserva (ejemplo: €99 vs €79 normal para 2-3 meses).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
