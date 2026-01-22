'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface PreferenceToggleProps {
  preferenceKey: string;
  label: string;
  description: string;
  initialValue: boolean;
  onUpdate?: (key: string, value: boolean) => void;
}

export function PreferenceToggle({
  preferenceKey,
  label,
  description,
  initialValue,
  onUpdate,
}: PreferenceToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const newValue = !enabled;
    setIsUpdating(true);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: preferenceKey,
          value: newValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preference');
      }

      setEnabled(newValue);
      onUpdate?.(preferenceKey, newValue);
    } catch (error) {
      console.error('[PreferenceToggle] Error updating preference:', error);
      // Revertir el cambio si falla
      alert('Error al actualizar la preferencia. Por favor, intenta de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {isUpdating && (
          <span className="text-xs text-gray-400">Guardando...</span>
        )}
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
}
