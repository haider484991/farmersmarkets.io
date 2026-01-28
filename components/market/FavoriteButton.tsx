'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FavoriteButtonProps {
  marketId: string
  userId: string
  initialFavorited: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({
  marketId,
  userId,
  initialFavorited,
  size = 'md',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleToggle = () => {
    startTransition(async () => {
      const supabase = createClient()

      if (isFavorited) {
        // Remove from favorites
        const { error } = await (supabase as any)
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('market_id', marketId)

        if (!error) {
          setIsFavorited(false)
        }
      } else {
        // Add to favorites
        const { error } = await (supabase as any)
          .from('favorites')
          .insert({ user_id: userId, market_id: marketId })

        if (!error) {
          setIsFavorited(true)
        }
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-full
        bg-white/90 backdrop-blur-sm shadow-md
        hover:bg-white transition-all
        disabled:opacity-50
      `}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`
          ${iconSizes[size]}
          transition-colors
          ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'}
        `}
      />
    </button>
  )
}
