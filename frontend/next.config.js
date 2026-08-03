/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 604800,
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
    optimizeCss: true,
    parallelServerBuildTraces: true,
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/(.*)\\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
    {
      source: '/products/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
      ],
    },
  ],

  poweredByHeader: false,
}

module.exports = nextConfig
