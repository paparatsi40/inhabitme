import { SearchFilters } from '@/lib/domain/search-filters'

export async function searchListings(filters: SearchFilters) {
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
  
  const url = `${baseUrl}/api/listings/search?${params.toString()}`;

  // Llamar a la API route
  const response = await fetch(url);
  
  if (!response.ok) {
    console.error('Search API error:', response.statusText);
    return [];
  }

  const result = await response.json();
  return result.data || [];
}
