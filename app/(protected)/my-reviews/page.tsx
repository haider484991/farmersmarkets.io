import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Star, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { StarRating } from '@/components/reviews/StarRating'
import type { Review, Market } from '@/types/database'

export const metadata: Metadata = {
  title: 'My Reviews',
  description: 'View and manage your farmers market reviews.',
}

export default async function MyReviewsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my-reviews')
  }

  // Fetch user's reviews with market details
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, markets(name, slug, city, state_code)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Array<Review & { markets: Pick<Market, 'name' | 'slug' | 'city' | 'state_code'> }> | null; error: unknown }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Reviews' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">My Reviews</h1>
          <p className="mt-2 text-gray-600">
            {reviews?.length || 0} review{reviews?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Link
                      href={`/market/${(review.markets as any)?.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600"
                    >
                      {(review.markets as any)?.name}
                    </Link>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {(review.markets as any)?.city}, {(review.markets as any)?.state_code}
                    </p>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {review.rating && (
                  <div className="mb-3">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                )}

                {review.content && (
                  <p className="text-gray-600 whitespace-pre-wrap">{review.content}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No reviews yet
            </h2>
            <p className="text-gray-500 mb-6">
              Share your experience at farmers markets!
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Find Markets to Review
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
