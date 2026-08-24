import { NextResponse, type NextRequest } from 'next/server'
import { adsDecisionFromHeaders } from '@/lib/ads-geo'

// Runs at the edge, next to the visitor, so the ad components can wait on it
// without a noticeable delay.
export const runtime = 'edge'

// Must never be cached: the whole point is that the answer differs per
// visitor, while the pages that ask for it are cached CDN-wide.
export const dynamic = 'force-dynamic'

/**
 * Tells the browser whether ads may serve for this visitor.
 *
 * See lib/ads-geo.ts for why this is a separate request rather than part of
 * the page render.
 */
export function GET(request: NextRequest) {
  return NextResponse.json(
    { decision: adsDecisionFromHeaders(request.headers) },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}
