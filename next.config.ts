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
  async redirects() {
    return [
      // Force the apex host to the canonical www host with a PERMANENT (308)
      // redirect so link equity consolidates. (The host may also do this; a
      // permanent redirect here guarantees it and replaces any 307.)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'farmersmarkets.io' }],
        destination: 'https://www.farmersmarkets.io/:path*',
        permanent: true,
      },
    ]
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
