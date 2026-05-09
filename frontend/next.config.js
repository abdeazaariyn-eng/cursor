// Next.js Performance Config
// Add to next.config.js or create it

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required by Dockerfile that copies .next/standalone
  output: 'standalone',

  // Image optimization
  images: {
    unoptimized: true,
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
