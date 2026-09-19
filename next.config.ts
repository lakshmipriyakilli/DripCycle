import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaddqpcfywsuchnigjho.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Supabase Storage CDN resolves to private IPs in some local network setups.
    // Setting unoptimized=true bypasses Next.js's image proxy and serves URLs directly,
    // which is safe since Supabase already serves images via their own CDN.
    unoptimized: true,
  },
}

export default nextConfig
