/**
 * Atribución de campañas (first-touch).
 *
 * Guarda los parámetros utm_* / gclid / fbclid de la primera visita en localStorage
 * para poder adjuntarlos al evento `listing_published` aunque el anfitrión publique
 * días después de hacer clic en el anuncio.
 *
 * Es almacenamiento funcional de primera parte (no cookie de terceros, no tracking
 * cross-site): no depende del consentimiento de analítica, pero solo se ENVÍA a
 * PostHog cuando el usuario ha aceptado cookies (ver events.ts) o desde el servidor
 * como propiedad del evento de negocio.
 */

export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  gclid?: string
  fbclid?: string
  landing_path?: string
  referrer?: string
  first_seen_at?: string
}

const STORAGE_KEY = 'inhabitme_attribution'
const MAX_AGE_DAYS = 90
const PARAM_KEYS: Array<keyof Attribution> = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
]

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Attribution
    if (parsed.first_seen_at) {
      const ageDays = (Date.now() - Date.parse(parsed.first_seen_at)) / 86_400_000
      if (ageDays > MAX_AGE_DAYS) {
        window.localStorage.removeItem(STORAGE_KEY)
        return null
      }
    }
    return parsed
  } catch {
    return null
  }
}

/**
 * Lee la URL actual y, si trae parámetros de campaña y no hay una atribución
 * previa vigente, la guarda. First-touch: la primera campaña gana.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const params = new URLSearchParams(window.location.search)
    const incoming: Attribution = {}
    for (const key of PARAM_KEYS) {
      const value = params.get(key)
      if (value) incoming[key] = value.slice(0, 200)
    }
    const hasCampaignParams = Object.keys(incoming).length > 0
    if (!hasCampaignParams) return getAttribution()

    const existing = getAttribution()
    if (existing) return existing

    const attribution: Attribution = {
      ...incoming,
      landing_path: window.location.pathname,
      referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
      first_seen_at: new Date().toISOString(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
    return attribution
  } catch {
    return null
  }
}
