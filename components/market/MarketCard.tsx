import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Clock, Phone, ExternalLink } from 'lucide-react'
import type { Market } from '@/types/database'
import { formatPhone, getTodayHours, isOpenToday } from '@/lib/utils'
import { FavoriteButton } from './FavoriteButton'

interface MarketCardProps {
  market: Market
  showFavoriteButton?: boolean
  userId?: string | null
  isFavorited?: boolean
}

export function MarketCard({
  market,
  showFavoriteButton = false,
  userId,
  isFavorited = false,
}: MarketCardProps) {
  const todayHours = getTodayHours(market.schedule as Record<string, { open: string; close: string } | null> | null)
  const isOpen = isOpenToday(market.schedule as Record<string, { open: string; close: string } | null> | null)

  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-hidden group">
      {/* Image */}
      <Link href={`/market/${market.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        {market.featured_image ? (
          <Image
            src={market.featured_image}
            alt={market.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-green-400" />
          </div>
        )}
        {market.is_verified && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
            Verified
          </span>
        )}
        {showFavoriteButton && userId && (
          <div className="absolute top-3 right-3">
            <FavoriteButton
              marketId={market.id}
              userId={userId}
              initialFavorited={isFavorited}
            />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/market/${market.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-1">
            {market.name}
          </h3>
        </Link>

        {/* Rating */}
        {market.google_rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {market.google_rating.toFixed(1)}
            </span>
            {market.google_reviews_count > 0 && (
              <span className="text-sm text-gray-500">
                ({market.google_reviews_count} reviews)
              </span>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {market.city}, {market.state_code}
          </span>
        </div>

        {/* Hours */}
        {todayHours && (
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className={isOpen ? 'text-green-600' : 'text-gray-500'}>
              {isOpen ? 'Open today' : 'Closed today'}: {todayHours}
            </span>
          </div>
        )}

        {/* Phone & Website */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          {market.phone && (
            <a
              href={`tel:${market.phone}`}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{formatPhone(market.phone)}</span>
              <span className="sm:hidden">Call</span>
            </a>
          )}
          {market.website && (
            <a
              href={market.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Website
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

// Skeleton loader for MarketCard
export function MarketCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="aspect-[16/10] bg-gray-200 animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-shimmer w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-2/3" />
      </div>
    </div>
  )
}
