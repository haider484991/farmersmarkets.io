import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Heart, Star, MapPin, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Profile } from '@/types/database'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your FarmersMarkets.io account, favorites, and reviews.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: Profile | null; error: unknown }

  // Fetch counts
  const { count: favoritesCount } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id) as { count: number | null; error: unknown }

  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id) as { count: number | null; error: unknown }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {profile?.display_name || user.email}
            </p>
          </div>
          <form action={handleSignOut}>
            <Button type="submit" variant="outline" leftIcon={<LogOut className="w-4 h-4" />}>
              Sign Out
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/favorites">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{favoritesCount || 0}</p>
                <p className="text-gray-600">Saved Markets</p>
              </div>
            </Card>
          </Link>

          <Link href="/my-reviews">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviewsCount || 0}</p>
                <p className="text-gray-600">Reviews Written</p>
              </div>
            </Card>
          </Link>

          <Link href="/near-me">
            <Card hover className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Find Markets</p>
                <p className="text-gray-600">Near your location</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/search"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Search for markets</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5 text-red-600" />
                <span>View saved markets</span>
              </Link>
              <Link
                href="/add-market"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Add a new market</span>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Display Name</label>
                <p className="text-gray-900">{profile?.display_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Member Since</label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
