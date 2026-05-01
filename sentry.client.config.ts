/**
 * Sentry runtime config for the BROWSER.
 *
 * Cargado automáticamente por @sentry/nextjs cuando la app inicia en el cliente.
 */
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,

    // Sample rates conservadores: 100% errores, 10% performance traces
    tracesSampleRate: 0.1,

    // Replay solo en errores (ahorra cuota): 0% sesiones normales, 100% sesiones con error
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // En dev no enviamos a Sentry para no llenar la cuota
    enabled: process.env.NODE_ENV === 'production',

    // Filtros: ignorar errores de extensiones, ad blockers, etc.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      // Errores típicos de extensiones del navegador
      /chrome-extension:\/\//,
      /moz-extension:\/\//,
    ],
  })
}
