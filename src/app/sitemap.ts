import { MetadataRoute } from 'next'
import { CITIES } from '@/config/cities'
import { getAllSlugs } from '@/lib/blog'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'
const LOCALES = ['en', 'es'] as const

function url(path: string): string {
  return `${BASE_URL}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ─── Static pages ──────────────────────────────────────────────────────────
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/search', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.4, changeFrequency: 'yearly' as const },
  ]

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((locale) => ({
      url: url(`/${locale}${path}`),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, url(`/${l}${path}`)])
        ),
      },
    }))
  )

  // ─── City pages ────────────────────────────────────────────────────────────
  const indexableCities = CITIES.filter((c) => c.indexable)

  const cityEntries: MetadataRoute.Sitemap = indexableCities.flatMap((city) =>
    LOCALES.map((locale) => ({
      url: url(`/${locale}/${city.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, url(`/${l}/${city.slug}`)])
        ),
      },
    }))
  )

  // ─── Neighborhood pages ────────────────────────────────────────────────────
  const neighborhoodEntries: MetadataRoute.Sitemap = indexableCities.flatMap((city) =>
    city.neighborhoods.flatMap((neighborhood) =>
      LOCALES.map((locale) => ({
        url: url(`/${locale}/${city.slug}/${neighborhood.slug}`),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, url(`/${l}/${city.slug}/${neighborhood.slug}`)])
          ),
        },
      }))
    )
  )

  // ─── Blog posts ────────────────────────────────────────────────────────────
  // We use EN slugs as the canonical set; ES articles mirror the same slugs
  const enSlugs = getAllSlugs('en')

  const blogEntries: MetadataRoute.Sitemap = enSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: url(`/${locale}/blog/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, url(`/${l}/blog/${slug}`)])
        ),
      },
    }))
  )

  return [...staticEntries, ...cityEntries, ...neighborhoodEntries, ...blogEntries]
}
