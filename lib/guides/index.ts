import type { Guide } from './types'
import { beginnersGuide } from './articles/beginners-guide'
import { seasonalProduceGuide } from './articles/seasonal-produce-guide'
import { farmersMarketSeasonGuide } from './articles/farmers-market-season'
import { storingProduceGuide } from './articles/storing-produce'
import { snapEbtGuide } from './articles/snap-ebt-farmers-markets'
import { wicFmnpGuide } from './articles/wic-fmnp'
import { whyShopLocalGuide } from './articles/why-shop-local'
import { becomeAVendorGuide } from './articles/become-a-vendor'

export type { Guide } from './types'

// Ordered for the guides index page: getting started → seasonal → assistance →
// buying local → vendors.
export const guides: Guide[] = [
  beginnersGuide,
  seasonalProduceGuide,
  farmersMarketSeasonGuide,
  storingProduceGuide,
  snapEbtGuide,
  wicFmnpGuide,
  whyShopLocalGuide,
  becomeAVendorGuide,
]

export function getAllGuides(): Guide[] {
  return guides
}

export function getGuideSlugs(): string[] {
  return guides.map((g) => g.slug)
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}

/** Resolve a guide's `related` slugs to full guide objects (falls back to
 *  other guides if none are specified), capped at `limit`. */
export function getRelatedGuides(guide: Guide, limit = 3): Guide[] {
  const related = (guide.related || [])
    .map((slug) => getGuide(slug))
    .filter((g): g is Guide => Boolean(g))

  if (related.length >= limit) return related.slice(0, limit)

  // Top up with other guides so the section is never empty.
  const extras = guides.filter(
    (g) => g.slug !== guide.slug && !related.some((r) => r.slug === g.slug)
  )
  return [...related, ...extras].slice(0, limit)
}
