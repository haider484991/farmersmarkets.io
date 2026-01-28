import { User, ThumbsUp } from 'lucide-react'
import type { Review } from '@/types/database'
import { StarRating } from './StarRating'

interface ReviewListProps {
  reviews: Review[]
  showSource?: boolean
}

export function ReviewList({ reviews, showSource = false }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} showSource={showSource} />
      ))}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
  showSource?: boolean
}

function ReviewCard({ review, showSource }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-500" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">
                {review.author_name || 'Anonymous'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {review.rating && <StarRating rating={review.rating} size="sm" />}
                {showSource && review.source !== 'user' && (
                  <span className="text-xs text-gray-400 capitalize">
                    via {review.source}
                  </span>
                )}
              </div>
            </div>
            <time className="text-sm text-gray-500 flex-shrink-0">
              {formattedDate}
            </time>
          </div>

          {/* Content */}
          {review.content && (
            <p className="mt-3 text-gray-600 whitespace-pre-wrap">{review.content}</p>
          )}

          {/* Actions */}
          {review.helpful_count > 0 && (
            <div className="flex items-center gap-1 mt-4 text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4" />
              <span>{review.helpful_count} found this helpful</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

// Skeleton loader
export function ReviewListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-shimmer" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
              <div className="h-3 bg-gray-200 rounded animate-shimmer w-1/3" />
              <div className="h-16 bg-gray-200 rounded animate-shimmer w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
