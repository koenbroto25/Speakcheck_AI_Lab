import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['tailwind-merge', 'clsx']
  },
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_GAS_API_URL: process.env.NEXT_PUBLIC_GAS_API_URL,
  }
};

export default nextConfig;
