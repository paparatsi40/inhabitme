/** @type {import('next').NextConfig} */
// Updated: 2026-04 - Performance pass: redirects permanentes, package imports optimizados

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
    // Ensure blog MDX content files are bundled in Vercel serverless functions.
    // Next.js file tracing can't detect dynamically-constructed paths like
    // path.join(process.cwd(), 'content', 'blog', locale), so we declare them explicitly.
    outputFileTracingIncludes: {
      "/[locale]/blog": ["./content/blog/**/*.mdx"],
      "/[locale]/blog/[slug]": ["./content/blog/**/*.mdx"],
    },
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.accounts.dev https://clerk.inhabitme.com https://*.clerk.accounts.dev https://js.stripe.com https://maps.googleapis.com https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src * blob: data:",
              "font-src 'self' https://fonts.gstatic.com https://vercel.live",
              "connect-src 'self' https://clerk.inhabitme.com https://*.clerk.accounts.dev https://api.stripe.com https://*.supabase.co https://*.cloudinary.com https://vercel.live",
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
    ];
  },

  async redirects() {
    return [
      // FIX — permanent: true (308) en vez de false (307)
      // 307 no se cachea → cada visita a "/" hace un round-trip al servidor
      // 308 se cachea en Vercel Edge → cero latencia en visitas repetidas
      {
        source: "/",
        destination: "/en",
        permanent: true,
      },

      // Dashboard fallback
      {
        source: "/dashboard",
        destination: "/en/dashboard",
        permanent: false, // mantener temporal: puede cambiar según auth
      },
      {
        source: "/dashboard/:path*",
        destination: "/en/dashboard/:path*",
        permanent: false,
      },

      // Legacy /listings → /properties
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

      // Trailing slash removal (SEO)
      {
        source: "/:path+/",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
