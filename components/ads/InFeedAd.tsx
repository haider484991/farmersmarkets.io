'use client'

import { AdUnit } from './AdUnit'
import { ADSENSE_SLOTS, ADSENSE_INFEED_LAYOUT_KEY, ADS_DEBUG } from '@/lib/adsense'
import { useAdsAllowed } from './useAdsAllowed'

/**
 * An in-feed ad placement sized to sit as one card inside a market grid.
 *
 * Unlike the other placements this returns a bare grid child with no outer
 * margin, so it lines up with the MarketCards around it. Renders nothing until
 * `inFeed` has a slot ID in lib/adsense.ts.
 */
export function InFeedAd({ className = '' }: { className?: string }) {
  const slot = ADSENSE_SLOTS.inFeed
  const adsAllowed = useAdsAllowed()

  if (!slot) {
    if (!ADS_DEBUG) return null
    return (
      <div className="flex min-h-[16rem] items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center">
        <p className="text-xs font-medium text-amber-800">
          Ad placement &ldquo;in-feed&rdquo; — no slot ID configured
        </p>
      </div>
    )
  }

  // Blocked location — leave the grid to close up around the gap.
  if (!adsAllowed) return null

  return (
    <div
      className={`flex flex-col justify-center ${className}`.trim()}
      data-ad-placement={ADS_DEBUG ? 'in-feed' : undefined}
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-wider text-gray-400">
        Advertisement
      </p>
      <AdUnit slot={slot} format="fluid" layoutKey={ADSENSE_INFEED_LAYOUT_KEY} />
    </div>
  )
}
