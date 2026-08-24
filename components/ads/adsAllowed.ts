'use client'

import { AD_BLOCKED_LOCATIONS, type AdsGeoDecision } from '@/lib/ads-geo'

/**
 * One in-flight request per page load, shared by every ad unit on the page.
 * Client-side navigation keeps the same JS context, so this survives it too.
 */
let pending: Promise<boolean> | null = null

/**
 * Whether ads may serve for this visitor.
 *
 * Asks /api/ads/geo, which resolves the visitor's location from their request
 * headers. The page itself cannot answer this — it is CDN-cached and identical
 * for every region (see lib/ads-geo.ts).
 *
 * Falls back to allowing ads if the request fails. A blocked location is one
 * city; a failed request would otherwise be every visitor on the site.
 */
export function adsAllowed(): Promise<boolean> {
  // Nothing is blocked — skip the request entirely.
  if (AD_BLOCKED_LOCATIONS.length === 0) return Promise.resolve(true)

  pending ??= fetch('/api/ads/geo', { cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { decision?: AdsGeoDecision } | null) => body?.decision !== 'block')
    .catch(() => true)

  return pending
}
