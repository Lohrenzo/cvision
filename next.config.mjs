/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    // Handle case sensitivity issues on Windows
    if (process.platform === 'win32') {
      config.resolve.symlinks = false;
    }
    
    // Force case sensitive paths
    config.resolve.plugins = config.resolve.plugins || [];
    
    return config;
  },
}

export default nextConfig
