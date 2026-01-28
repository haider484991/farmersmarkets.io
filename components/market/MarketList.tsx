import type { Market } from '@/types/database'
import { MarketCard, MarketCardSkeleton } from './MarketCard'

interface MarketListProps {
  markets: Market[]
  showFavoriteButton?: boolean
  userId?: string | null
  favoritedIds?: string[]
  emptyMessage?: string
}

export function MarketList({
  markets,
  showFavoriteButton = false,
  userId,
  favoritedIds = [],
  emptyMessage = 'No markets found',
}: MarketListProps) {
  if (markets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard
          key={market.id}
          market={market}
          showFavoriteButton={showFavoriteButton}
          userId={userId}
          isFavorited={favoritedIds.includes(market.id)}
        />
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
