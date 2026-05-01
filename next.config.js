/** @type {import('next').NextConfig} */
// Updated: 2026-04 - Performance pass + Analytics integration (GA4, PostHog, Sentry)

const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-accordion",
      "@radix-ui/react-toast",
    ],
  },
  // Ensure blog MDX content files are bundled in Vercel serverless functions.
  outputFileTracingIncludes: {
    "/[locale]/blog": ["./content/blog/**/*.mdx"],
    "/[locale]/blog/[slug]": ["./content/blog/**/*.mdx"],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [35, 40, 45, 55, 60, 75],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      { protocol: "https", hostname: "images.clerk.dev", pathname: "/**" },
      { protocol: "https", hostname: "agjntynuysvwgzlcdmiq.supabase.co", pathname: "/**" },
    ],
  },

  // Security headers + CSP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: Clerk, Stripe, Maps, Vercel, GA4 (googletagmanager + google-analytics), PostHog, Sentry
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.accounts.dev https://clerk.inhabitme.com https://*.clerk.accounts.dev https://js.stripe.com https://maps.googleapis.com https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://us.i.posthog.com https://eu.i.posthog.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com https://*.sentry.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src * blob: data:",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live",
              // Connect: incluye endpoints de ingesta de GA, PostHog y Sentry
              "connect-src 'self' https://clerk.inhabitme.com https://*.clerk.accounts.dev https://api.stripe.com https://*.supabase.co https://*.cloudinary.com https://vercel.live https://www.google-analytics.com https://*.google-analytics.com https://us.i.posthog.com https://eu.i.posthog.com https://*.posthog.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live",
              "object-src 'none'",
              "media-src 'self'",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Rewrites para SEO files (sin locale prefix)
  async rewrites() {
    return [
      { source: "/robots.txt", destination: "/robots.txt", locale: false },
      { source: "/sitemap.xml", destination: "/sitemap.xml", locale: false },
      { source: "/favicon.ico", destination: "/favicon.svg", locale: false },
      // PostHog reverse proxy (recomendado para evitar ad-blockers).
      // Las requests del cliente irán a /ingest/* y se reescriben al host configurado.
      // OPT-IN: descomentar cuando los ad-blockers se vuelvan un problema real.
      // { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      // { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/en/dashboard",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "/en/dashboard/:path*",
        permanent: false,
      },
      {
        source: "/vision",
        destination: "/en/about",
        permanent: true,
      },
      {
        source: "/:locale/vision",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale/listings/:id",
        destination: "/:locale/properties/:id",
        permanent: true,
      },
      {
        source: "/listings/:id",
        destination: "/properties/:id",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "carlos-alfaro-mk",
  project: "inhabitme",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
