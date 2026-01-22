/** @type {import('next').NextConfig} */
// Updated: 2026-01-21 - Performance & SEO Boost

const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

// Optional: PWA (enable when ready)
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// });

const nextConfig = {
  reactStrictMode: true,
  compress: true, // 🆕 Enable Gzip/Brotli compression
  swcMinify: true, // 🆕 Ensure modern minification is active

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'img.clerk.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // ESLint (evitar que rompa el build)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security headers + optional CSP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          // Optional: basic CSP
          // { key: 'Content-Security-Policy', value: "default-src 'self'; img-src *; object-src 'none';" },
        ],
      },
    ];
  },

  // Optional: manual redirection from non-www to www (backup to Vercel redirect)
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'inhabitme.com',
          },
        ],
        destination: 'https://www.inhabitme.com',
        permanent: true,
      },
    ];
  },
};

// Export config with i18n support
module.exports = withNextIntl(nextConfig);
