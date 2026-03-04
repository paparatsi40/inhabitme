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

          // Optional: basic CSP (enable only if you’ve verified all external scripts/fonts/images)
          // { key: 'Content-Security-Policy', value: "default-src 'self'; img-src *; object-src 'none';" },
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
      // Root path redirect (before next-intl middleware)
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

      // Remove trailing slashes (SEO consistency)
      {
        source: "/:path*/",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);