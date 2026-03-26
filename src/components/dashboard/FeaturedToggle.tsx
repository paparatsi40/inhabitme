'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star, Info } from 'lucide-react';

interface FeaturedToggleProps {
  propertyId: string;
  initialFeatured: boolean;
}

export function FeaturedToggle({ propertyId, initialFeatured }: FeaturedToggleProps) {
  const [featured, setFeatured] = useState(initialFeatured);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('dashboard');

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
        alert(t('featuredUpdateError'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t('featuredUpdateError'));
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
          {t('featuredLabel')}
        </span>
        
        <div className="group relative">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <strong>{t('featuredTooltipTitle')}:</strong> {t('featuredTooltipBody')}
          </div>
        </div>
      </div>
    </div>
  );
}
