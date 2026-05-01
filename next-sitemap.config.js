/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.inhabitme.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.5,

  // Opciones del robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/*',
          '/onboarding',
          '/_not-found',
          '/test',
          '/test-*',
          '/dashboard',
          '/dashboard/*',
          '/host/dashboard',
          '/sentry-example-page',
          '/api/sentry-example-api',
        ],
      },
    ],
    additionalSitemaps: [
      'https://www.inhabitme.com/sitemap.xml',
    ],
  },

  // Excluir rutas que no queremos en el sitemap
  exclude: [
    '/api/*',
    '/admin',
    '/admin/*',
    '/onboarding',
    '/test',
    '/test-*',
    '/_not-found',
    '/dashboard',
    '/dashboard/*',
    '/host/*',
    '/sentry-example-page',
    '/*/sentry-example-page',
    '/sign-in',
    '/sign-up',
    '/*/sign-in',
    '/*/sign-up',
    '/*/dashboard',
    '/*/dashboard/*',
    '/*/properties/new',
    '/*/bookings/*',
    '/*/reset-session',
    '/founding-host/*',
    '/*/founding-hosts/*',
  ],

  // Transformar URLs individuales con prioridades diferenciadas
  transform: async (config, path) => {
    const now = new Date().toISOString()

    // Home (root y por locale): prioridad máxima, daily
    if (path === '/' || path === '/en' || path === '/es') {
      return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: now }
    }

    // Páginas estratégicas globales: list-your-space, search
    if (path.match(/^\/(en|es)\/(list-your-space|search)$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: now }
    }

    // Ciudad activa: Austin (mayor prioridad porque tiene listings reales)
    if (path.match(/^\/(en|es)\/austin$/)) {
      return { loc: path, changefreq: 'daily', priority: 0.9, lastmod: now }
    }

    // Otras ciudades (waitlist mode): igual indexables pero menos priority
    if (path.match(/^\/(en|es)\/(madrid|barcelona|valencia|sevilla|lisboa|porto|ciudad-de-mexico|buenos-aires|medellin|miami)$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: now }
    }

    // Barrios: 65 URLs, alta cantidad pero contenido único
    if (path.match(/^\/(en|es)\/[a-z-]+\/[a-z-]+$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: now }
    }

    // Blog index
    if (path.match(/^\/(en|es)\/blog$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.7, lastmod: now }
    }

    // Posts del blog
    if (path.match(/^\/(en|es)\/blog\/[a-z0-9-]+$/)) {
      return { loc: path, changefreq: 'monthly', priority: 0.6, lastmod: now }
    }

    // Propiedades individuales (una vez existan)
    if (path.match(/^\/(en|es)\/properties\/[^/]+$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.6, lastmod: now }
    }

    if (path.match(/^\/(en|es)\/listings\/[^/]+$/)) {
      return { loc: path, changefreq: 'weekly', priority: 0.6, lastmod: now }
    }

    // About, Contact, FAQ — informacionales
    if (path.match(/^\/(en|es)\/(about|contact|faq)$/)) {
      return { loc: path, changefreq: 'monthly', priority: 0.5, lastmod: now }
    }

    // Páginas legales: indexables pero baja prioridad
    if (path.match(/^\/(en|es)\/(privacy|terms|cookies)$/)) {
      return { loc: path, changefreq: 'yearly', priority: 0.3, lastmod: now }
    }

    // Default
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: now }
  },
}
