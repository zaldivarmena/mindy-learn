/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Simplified configuration without complex polyfills
  
  // Configure Inngest webhook handling
  serverExternalPackages: ['inngest'],
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

module.exports = nextConfig;
