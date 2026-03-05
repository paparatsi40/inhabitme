/** @type {import('next').NextConfig} */
// Updated: 2026-03-03 - Next.js 16.1.x compatible config (Performance & SEO)

const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // Image optimization (secure + compatible)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
      // Supabase (use your exact project hostname; wildcards are not reliable here)
      {
        protocol: "https",
        hostname: "agjntynuysvwgzlcdmiq.supabase.co",
        pathname: "/**",
      },
    ],
  },

  // Security headers + optional CSP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },

          // Permissions Policy for better security
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // Content Security Policy - enabled for Best Practices score
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.accounts.dev https://clerk.inhabitme.com https://*.clerk.accounts.dev https://js.stripe.com https://maps.googleapis.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src * blob: data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://clerk.inhabitme.com https://*.clerk.accounts.dev https://api.stripe.com https://*.supabase.co https://*.cloudinary.com https://vercel.live; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live; object-src 'none'; media-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },

  // Rewrites to bypass i18n for SEO files
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/robots.txt",
        locale: false,
      },
      {
        source: "/sitemap.xml",
        destination: "/sitemap.xml",
        locale: false,
      },
    ];
  },

  // SEO redirects
  async redirects() {
    return [
      // Root -> default locale
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },

      // Legacy /listings to /properties redirect
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

      // Remove trailing slashes (SEO consistency) — EXCLUDE "/"
      {
        source: "/:path+/",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
