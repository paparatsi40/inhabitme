/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.inhabitme.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Solo un sitemap (no múltiples)
  changefreq: 'weekly',
  priority: 0.7,
  
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
  ],

  // Transformar URLs individuales (opcional)
  transform: async (config, path) => {
    // Páginas específicas con mayor prioridad
    if (path === '/' || path === '/en' || path === '/es') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // Ciudades con alta prioridad
    if (path.match(/^\/(en|es)?\/(madrid|barcelona|valencia)$/)) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Propiedades con prioridad media
    if (path.match(/^\/(en|es)?\/properties\/[^/]+$/)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      }
    }

    // Default para otras páginas
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
