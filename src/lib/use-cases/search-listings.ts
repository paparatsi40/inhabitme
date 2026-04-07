import { SearchFilters } from '@/lib/domain/search-filters'

export async function searchListings(filters: SearchFilters, signal?: AbortSignal) {
  // Construir query params
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  // Construir URL absoluta o relativa según el entorno
  const baseUrl = typeof window !== 'undefined' 
    ? '' // En el cliente, usar URL relativa
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // En el servidor, usar URL absoluta
  
  const url = `${baseUrl}/api/properties/search?${params.toString()}`;
  
  // Debug logging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[searchListings] Fetching URL:', url);
  }

  // Llamar a la API route
  const response = await fetch(url, { signal });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[searchListings] Response status:', response.status);
  }
  
  if (!response.ok) {
    console.error('[searchListings] API error:', response.statusText);
    return [];
  }

  const result = await response.json();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[searchListings] Response data:', result);
    console.log('[searchListings] result.data:', result.data);
    console.log('[searchListings] result.data length:', result.data?.length);
  }
  return result.data || [];
}
