import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  // Enable when ready to deploy
  poweredByHeader: false,

  // Optimize for production
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
};

export default nextConfig;
