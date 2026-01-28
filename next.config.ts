import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/market/:slug',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate=86400' }
        ]
      },
      {
        source: '/:state',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=86400, stale-while-revalidate=604800' }
        ]
      },
      {
        source: '/:state/:city',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=86400, stale-while-revalidate=604800' }
        ]
      },
    ];
  },
};

export default nextConfig;
