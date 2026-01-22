import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://www.inhabitme.com'
  
  const robots = `# robots.txt for inhabitme.com
# Allow all search engines to crawl the site

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /admin/
Disallow: /onboarding
Disallow: /onboarding/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1
`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}
