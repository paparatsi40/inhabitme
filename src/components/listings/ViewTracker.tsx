'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  listingId: string;
}

/**
 * Componente que registra automáticamente una vista cuando se monta
 * Se debe incluir en las páginas de listing detail
 */
export function ViewTracker({ listingId }: ViewTrackerProps) {
  useEffect(() => {
    // Generar o recuperar session ID del localStorage
    let sessionId = localStorage.getItem('inhabitme_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('inhabitme_session_id', sessionId);
    }

    // Registrar la vista
    const recordView = async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            referrer: document.referrer || null,
          }),
        });

        if (!response.ok) {
          console.warn('[ViewTracker] Failed to record view:', response.statusText);
        }
      } catch (error) {
        console.warn('[ViewTracker] Error recording view:', error);
        // No hacer nada si falla - el tracking no debe interrumpir la experiencia
      }
    };

    // Ejecutar después de 2 segundos para evitar registrar vistas muy cortas
    const timer = setTimeout(recordView, 2000);

    return () => clearTimeout(timer);
  }, [listingId]);

  // Este componente no renderiza nada
  return null;
}
