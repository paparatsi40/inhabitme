// src/lib/utils/slug.ts

/**
 * Convierte un slug de URL a nombre legible
 * madrid -> Madrid
 * chamberi -> Chamberi
 */
export function normalizeSlugToName(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Convierte slug de barrio a nombre real (maneja acentos)
 * malasana -> Malasaña
 */
export function slugToNeighborhood(slug: string): string {
  const map: Record<string, string> = {
    malasana: 'Malasaña'
  }

  return map[slug] ?? normalizeSlugToName(slug)
}
