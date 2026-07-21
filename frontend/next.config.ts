import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    // Local dev only: proxy /api/* to a locally running FastAPI when BACKEND_URL is set.
    // In staging/production Caddy routes /api/* to the backend before Next.js.
    // Filesystem routes (app/api/**) still take precedence over this rewrite.
    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) return []
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
