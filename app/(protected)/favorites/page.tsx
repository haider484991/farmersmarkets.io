import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { MarketList } from '@/components/market/MarketList'
import type { Market } from '@/types/database'

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View and manage your saved farmers markets.',
}

export default async function FavoritesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/favorites')
  }

  // Fetch user's favorites with market details
  const { data: favorites } = await supabase
    .from('favorites')
    .select('market_id, markets(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: Array<{ market_id: string; markets: Market }> | null; error: unknown }

  const markets = favorites?.map((f) => f.markets).filter(Boolean) || []
  const favoritedIds = favorites?.map((f) => f.market_id) || []

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Favorites' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            {markets.length} saved market{markets.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {markets.length > 0 ? (
          <MarketList
            markets={markets as any}
            showFavoriteButton
            userId={user.id}
            favoritedIds={favoritedIds}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start exploring markets and save your favorites!
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Find Markets
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
