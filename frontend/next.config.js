// Next.js Performance Config
// Add to next.config.js or create it

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression
  compress: true,
  
  // Minification
  swcMinify: true,
  
  // Output analysis
  productionBrowserSourceMaps: false,
  
  // Optimize packages
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
    ],
  },
}

module.exports = nextConfig
