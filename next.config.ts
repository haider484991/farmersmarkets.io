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
      // NOTE: `/:state` and `/:state/:city` match ANY one- and two-segment
      // path — /market/:slug and /api/markets included — and path-to-regexp
      // here ignores custom param patterns (`/:state((?!api$)[^/]+)` still
      // matches /api/*), so the sources themselves cannot exclude anything.
      // Instead the more specific rules BELOW these override them: rules run
      // in order and the last value for a header key wins. Keep the market
      // and API rules after the directory rules, or they are silently
      // overridden back to the directory cache (which is exactly the bug the
      // /market rule had when it sat first).
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
      // Market pages: fresh for 1h so ratings/reviews/hours update same-day,
      // but with the same 7-day stale-while-revalidate window as the
      // directory pages. SWR is what keeps the Vercel bill flat: after the
      // hour the CDN keeps serving the cached copy instantly and re-renders
      // once in the background, so origin work happens only when a page
      // actually gets traffic — never 8,000 pages x 24 renders a day — and
      // visitors (Googlebot included) never wait on a blocking re-render for
      // any page visited within the week.
      {
        source: '/market/:slug',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate=604800' }
        ]
      },
      // Safe default for every API route: never CDN-cached. Without this,
      // any new two-segment /api route silently inherits the day-long
      // directory cache above.
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' }
        ]
      },
      // Search API, deliberately cacheable: it serves the same public
      // directory data as /market/:slug, so it gets the same freshness
      // window. The CDN caches per full URL, so each query-string
      // combination is its own entry. Keeps /search and /near-me fast
      // without the accidental day-long staleness this route used to
      // inherit from `/:state/:city`.
      {
        source: '/api/markets',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate=86400' }
        ]
      },
    ];
  },
};

export default nextConfig;
