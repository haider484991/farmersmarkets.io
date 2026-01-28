'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = hoverRating || rating

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => interactive && setHoverRating(0)}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating
        const isHalfFilled = starValue - 0.5 <= displayRating && starValue > displayRating

        return (
          <button
            key={index}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'text-yellow-400 fill-yellow-400'
                  : isHalfFilled
                  ? 'text-yellow-400 fill-yellow-400/50'
                  : 'text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
