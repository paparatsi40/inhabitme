/**
 * URL Utilities for SEO
 * 
 * Helper functions for URL normalization, validation, and SEO best practices
 */

/**
 * Normalize a URL slug to lowercase with hyphens
 */
export function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces to hyphens
    .replace(/[^\w\-]+/g, '')    // remove special chars
    .replace(/\-\-+/g, '-')      // multiple hyphens to single
    .replace(/^-+/, '')          // trim start hyphen
    .replace(/-+$/, '')          // trim end hyphen
}

/**
 * Check if a URL should have trailing slash removed
 */
export function shouldRemoveTrailingSlash(pathname: string): boolean {
  // Don't remove trailing slash from root paths
  if (pathname === '/' || pathname === '') return false
  
  // Remove trailing slash from all other paths
  return pathname.endsWith('/')
}

/**
 * Normalize pathname (remove trailing slash, lowercase)
 */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  
  // Remove trailing slash (except for root)
  let normalized = pathname.endsWith('/') 
    ? pathname.slice(0, -1) 
    : pathname
    
  // Convert to lowercase for consistency
  normalized = normalized.toLowerCase()
  
  return normalized
}

/**
 * Check if URL has mixed case (bad for SEO)
 */
export function hasMixedCase(pathname: string): boolean {
  return pathname !== pathname.toLowerCase()
}

/**
 * Build a clean URL with proper locale and path
 */
export function buildCleanUrl({
  locale,
  path,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com',
  includeTrailingSlash = false,
}: {
  locale: 'en' | 'es'
  path: string
  baseUrl?: string
  includeTrailingSlash?: boolean
}): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  // Normalize the path
  const normalizedPath = normalizePathname(cleanPath)
  
  // Build URL
  const url = `${baseUrl}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
  
  // Add trailing slash if requested
  return includeTrailingSlash && !url.endsWith('/') ? `${url}/` : url
}

/**
 * Validate if a slug is SEO-friendly
 */
export function isValidSlug(slug: string): boolean {
  // Must be lowercase
  if (slug !== slug.toLowerCase()) return false
  
  // Must only contain alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(slug)) return false
  
  // Must not start or end with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) return false
  
  // Must not have consecutive hyphens
  if (slug.includes('--')) return false
  
  return true
}

/**
 * Extract city and neighborhood from pathname
 */
export function parseCityPath(pathname: string): {
  locale?: string
  city?: string
  neighborhood?: string
} | null {
  // Remove leading slash
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname
  
  // Split path
  const segments = path.split('/').filter(Boolean)
  
  if (segments.length === 0) return null
  
  // Check if first segment is a locale
  const possibleLocale = segments[0]
  const isLocale = ['en', 'es'].includes(possibleLocale)
  
  if (isLocale) {
    // Format: /en/madrid or /en/madrid/malasana
    return {
      locale: segments[0],
      city: segments[1],
      neighborhood: segments[2],
    }
  }
  
  // Format without locale: /madrid or /madrid/malasana
  return {
    city: segments[0],
    neighborhood: segments[1],
  }
}

/**
 * Generate SEO-friendly breadcrumbs from URL
 */
export function generateBreadcrumbs(pathname: string, baseUrl?: string): Array<{
  name: string
  url: string
}> {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'
  const segments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs = [
    { name: 'Home', url }
  ]
  
  let currentPath = ''
  
  for (const segment of segments) {
    currentPath += `/${segment}`
    
    // Capitalize and format segment
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({
      name,
      url: `${url}${currentPath}`,
    })
  }
  
  return breadcrumbs
}

/**
 * Check if pathname matches a known city
 */
export function isCityPath(pathname: string, cities: string[] = ['madrid', 'barcelona', 'valencia']): boolean {
  const parsed = parseCityPath(pathname)
  if (!parsed || !parsed.city) return false
  
  return cities.includes(parsed.city.toLowerCase())
}

/**
 * Redirect map for old URLs to new ones
 */
export const URL_REDIRECTS: Record<string, string> = {
  // Old listing URLs to new property URLs
  '/listings': '/properties',
  
  // Add more legacy redirects as needed
  // '/old-path': '/new-path',
}

/**
 * Get redirect destination for a given path
 */
export function getRedirectDestination(pathname: string): string | null {
  // Check exact matches first
  if (URL_REDIRECTS[pathname]) {
    return URL_REDIRECTS[pathname]
  }
  
  // Check if path starts with any redirect source
  for (const [source, destination] of Object.entries(URL_REDIRECTS)) {
    if (pathname.startsWith(source + '/')) {
      // Replace the source part with destination
      return pathname.replace(source, destination)
    }
  }
  
  return null
}
