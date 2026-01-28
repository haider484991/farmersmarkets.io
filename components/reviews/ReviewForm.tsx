'use client'

import { useState, useTransition } from 'react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface ReviewFormProps {
  marketId: string
  userId: string
  onSuccess?: () => void
}

export function ReviewForm({ marketId, userId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    startTransition(async () => {
      const supabase = createClient() as any

      // Get user profile for author name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single()

      const { error: insertError } = await supabase.from('reviews').insert({
        market_id: marketId,
        user_id: userId,
        author_name: profile?.display_name || 'User',
        rating,
        content: content.trim() || null,
        source: 'user',
      })

      if (insertError) {
        setError('Failed to submit review. Please try again.')
        return
      }

      // Reset form
      setRating(0)
      setContent('')
      onSuccess?.()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

      {/* Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      {/* Content */}
      <div className="mb-4">
        <label
          htmlFor="review-content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review (optional)
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none resize-none"
          placeholder="Share your experience at this market..."
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {/* Submit */}
      <Button type="submit" isLoading={isPending}>
        Submit Review
      </Button>
    </form>
  )
}

// Login prompt for unauthenticated users
export function ReviewLoginPrompt() {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
      <p className="text-gray-600 mb-4">
        Sign in to leave a review for this market
      </p>
      <Button href="/login" variant="primary">
        Sign In
      </Button>
    </div>
  )
}
