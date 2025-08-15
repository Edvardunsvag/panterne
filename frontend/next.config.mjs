let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Optimizes for deployment
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  images: {
    unoptimized: true,   // May be needed for Azure App Service
  },
};

export default nextConfig;
