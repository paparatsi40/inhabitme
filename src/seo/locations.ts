// src/seo/locations.ts

export type Locale = 'en' | 'es'

export type NeighborhoodSeo = {
  /** Slug canónico usado en URL (debe coincidir con /[city]/[neighborhood]) */
  slug: string
  /** Nombre display (para H1, links, etc.) */
  name: string
  /** Control editorial: si este barrio debe ser indexable */
  indexable: boolean

  /**
   * Copy overrides (opcional).
   * Si está vacío, se usa el template genérico de tu page.
   */
  copy?: Partial<{
    intro: Record<Locale, string>
    idealForTitle: Record<Locale, string>
    idealFor: Record<Locale, string[]>
    faqTitle: Record<Locale, string>
    faqs: Record<Locale, { q: string; a: string }[]>
  }>
}

export type CitySeo = {
  /** Slug canónico usado en URL (debe coincidir con /[city]) */
  slug: string
  /** Nombre display */
  name: string
  /** País (útil para metadata, schema, copy) */
  country?: string
  /** Control editorial: si esta ciudad debe ser indexable */
  indexable: boolean

  /**
   * Copy overrides (opcional).
   * Si está vacío, se usa el template genérico de tu page.
   */
  copy?: Partial<{
    intro: Record<Locale, string>
    idealForTitle: Record<Locale, string>
    idealFor: Record<Locale, string[]>
    faqTitle: Record<Locale, string>
    faqs: Record<Locale, { q: string; a: string }[]>
  }>

  neighborhoods: NeighborhoodSeo[]
}

/**
 * Single Source of Truth (SSOT) para SEO.
 * - Define qué ciudades/barrios existen editorialmente para SEO
 * - Controla indexación sin depender de la DB
 * - Permite añadir copy premium por ciudad/barrio (sin reescribir pages)
 *
 * Nota: Mantén los slugs en minúsculas y con guiones.
 */
export const SEO_LOCATIONS: CitySeo[] = [
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'ES',
    indexable: true,
    // copy: { ... } // <- futuro: overrides premium por ciudad
    neighborhoods: [
      { slug: 'gracia', name: 'Gràcia', indexable: true },
      { slug: 'eixample', name: 'Eixample', indexable: true },
      { slug: 'el-born', name: 'El Born', indexable: true },
      // { slug: 'raval', name: 'El Raval', indexable: false }, // ejemplo de noindex editorial
    ],
  },
]

/** Helpers (sin acoplar a Next) */
export function getCitySeo(citySlug: string): CitySeo | undefined {
  return SEO_LOCATIONS.find((c) => c.slug === citySlug)
}

export function getNeighborhoodSeo(
  citySlug: string,
  neighborhoodSlug: string
): NeighborhoodSeo | undefined {
  const city = getCitySeo(citySlug)
  return city?.neighborhoods.find((n) => n.slug === neighborhoodSlug)
}

export function isCityIndexable(citySlug: string): boolean {
  const city = getCitySeo(citySlug)
  return Boolean(city?.indexable)
}

export function isNeighborhoodIndexable(
  citySlug: string,
  neighborhoodSlug: string
): boolean {
  const n = getNeighborhoodSeo(citySlug, neighborhoodSlug)
  return Boolean(n?.indexable)
}
