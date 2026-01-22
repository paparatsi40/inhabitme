import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'es'],

  // Default locale (English for international digital nomads)
  defaultLocale: 'en',
  
  // Show locale in URL except for sitemap/robots
  localePrefix: 'as-needed',
  
  // Paths that should bypass locale detection
  pathnames: {
    '/': '/',
    '/sitemap.xml': '/sitemap.xml',
    '/robots.txt': '/robots.txt',
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
