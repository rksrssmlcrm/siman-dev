import type { NextConfig } from 'next'

// API_INTERNAL_URL is the service-to-service URL for the FastAPI backend.
//   • Local dev without Docker: http://localhost:8000
//   • Docker Compose:           http://backend:8000  (service name from docker-compose)
//   • Staging/production:       NOT set — Caddy routes /api/* to the backend
//     before the request reaches Next.js, so this rewrite never fires.
//
// Filesystem routes (app/api/**) take precedence over rewrites.
// After removing the leads route stub there are no more app/api/ routes,
// so all /api/* traffic flows through this rewrite when API_INTERNAL_URL is set.

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const apiUrl = process.env.API_INTERNAL_URL
    if (!apiUrl) return []
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
