import type { Metadata } from 'next'

/**
 * /near-me resolves its results from the visitor's geolocation in the browser,
 * so a crawler only ever sees an empty shell — nothing worth indexing, and the
 * lat/lng query params multiply it into unbounded URLs. Measured 2026-08-19:
 * 0 clicks and 0 impressions across 91 days. The "near me" queries this site
 * actually wins are served by individual /market/* pages, which are unaffected.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function NearMeLayout({ children }: { children: React.ReactNode }) {
  return children
}
