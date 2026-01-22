import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://www.inhabitme.com'
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/en', priority: '1.0', changefreq: 'daily' },
    { url: '/search', priority: '0.9', changefreq: 'daily' },
    { url: '/en/search', priority: '0.9', changefreq: 'daily' },
    { url: '/founding-hosts', priority: '0.7', changefreq: 'weekly' },
    { url: '/en/founding-hosts', priority: '0.7', changefreq: 'weekly' },
  ]

  // Cities (high priority)
  const cities = [
    { slug: 'madrid', priority: '0.9' },
    { slug: 'barcelona', priority: '0.9' },
    { slug: 'valencia', priority: '0.9' },
  ]

  // Neighborhoods per city
  const neighborhoods = [
    // Madrid
    { city: 'madrid', slug: 'malasana', priority: '0.8' },
    { city: 'madrid', slug: 'chueca', priority: '0.8' },
    { city: 'madrid', slug: 'lavapies', priority: '0.8' },
    { city: 'madrid', slug: 'chamberi', priority: '0.8' },
    { city: 'madrid', slug: 'las-letras', priority: '0.8' },
    // Barcelona
    { city: 'barcelona', slug: 'gracia', priority: '0.8' },
    { city: 'barcelona', slug: 'eixample', priority: '0.8' },
    { city: 'barcelona', slug: 'born', priority: '0.8' },
    { city: 'barcelona', slug: 'poblenou', priority: '0.8' },
    // Valencia
    { city: 'valencia', slug: 'ruzafa', priority: '0.8' },
    { city: 'valencia', slug: 'cabanyal', priority: '0.8' },
  ]

  const now = new Date().toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${cities.map(city => `  <url>
    <loc>${baseUrl}/${city.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${city.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/${city.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/${city.slug}"/>
  </url>`).join('\n')}
${neighborhoods.map(n => `  <url>
    <loc>${baseUrl}/${n.city}/${n.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${n.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}/${n.city}/${n.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/${n.city}/${n.slug}"/>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
