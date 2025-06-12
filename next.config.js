/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  optimizeFonts: false,
};

module.exports = nextConfig;