import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import type { Market } from '@/types/database'
import { formatDistance } from '@/lib/utils'

export interface NearbyMarket extends Market {
  _distance?: number
}

interface NearbyMarketsProps {
  markets: NearbyMarket[]
  cityLabel?: string
}

/**
 * Renders the closest markets as real, crawlable internal links with
 * descriptive anchors — this passes relevance + internal PageRank to sibling
 * market pages, which is a primary lever for lifting near-miss rankings.
 */
export function NearbyMarkets({ markets, cityLabel }: NearbyMarketsProps) {
  if (!markets.length) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Farmers Markets Near {cityLabel || 'Here'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map((m) => (
          <Link
            key={m.id}
            href={`/market/${m.slug}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900 leading-snug">{m.name}</h3>
              {typeof m._distance === 'number' && m._distance < 9999 && (
                <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                  {formatDistance(m._distance)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{[m.city, m.state_code].filter(Boolean).join(', ')}</span>
            </div>
            {m.google_rating && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-700">
                  {m.google_rating.toFixed(1)}
                </span>
                {m.google_reviews_count > 0 && (
                  <span className="text-gray-400">
                    ({m.google_reviews_count.toLocaleString()})
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
