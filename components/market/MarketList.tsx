import { Fragment } from 'react'
import type { Market } from '@/types/database'
import { MarketCard, MarketCardSkeleton } from './MarketCard'
import { InFeedAd } from '@/components/ads/InFeedAd'

interface MarketListProps {
  markets: Market[]
  showFavoriteButton?: boolean
  userId?: string | null
  favoritedIds?: string[]
  emptyMessage?: string
  /**
   * Drop an in-feed ad unit into the grid. Off by default so signed-in areas
   * (dashboard, favorites) stay ad-free unless a page opts in.
   */
  showAds?: boolean
  /** How many cards to show before the in-feed ad. */
  adAfter?: number
}

export function MarketList({
  markets,
  showFavoriteButton = false,
  userId,
  favoritedIds = [],
  emptyMessage = 'No markets found',
  showAds = false,
  adAfter = 6,
}: MarketListProps) {
  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  // Only worth an in-feed unit when there are enough cards for it to land
  // mid-grid rather than dangling off the end of a short list.
  const showInFeedAd = showAds && markets.length > adAfter

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market, i) => (
        <Fragment key={market.id}>
          {showInFeedAd && i === adAfter && <InFeedAd />}
          <MarketCard
            market={market}
            showFavoriteButton={showFavoriteButton}
            userId={userId}
            isFavorited={favoritedIds.includes(market.id)}
          />
        </Fragment>
      ))}
    </div>
  )
}

// Skeleton loader for MarketList
export function MarketListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MarketCardSkeleton key={i} />
      ))}
    </div>
  )
}
