import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'es'],

  // Default locale (English for international digital nomads)
  defaultLocale: 'en',
  
  // Always show locale prefix
  localePrefix: 'always',
  
  // Disable locale detection to avoid locale cookie writes on already-localized routes
  localeDetection: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
