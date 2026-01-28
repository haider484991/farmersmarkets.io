import Link from 'next/link'
import { MapPin, Search, Star, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SearchBar } from '@/components/search/SearchBar'
import { MarketList } from '@/components/market/MarketList'
import { Button } from '@/components/ui/Button'
import { STATE_NAMES } from '@/lib/utils'
import type { Market, Location } from '@/types/database'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured markets (highest rated)
  const { data: featuredMarkets } = await supabase
    .from('markets')
    .select('*')
    .eq('is_active', true)
    .not('google_rating', 'is', null)
    .order('google_rating', { ascending: false })
    .limit(6) as { data: Market[] | null; error: unknown }

  // Fetch state counts
  const { data: stateCounts } = await supabase
    .from('locations')
    .select('state_code, market_count')
    .eq('type', 'state')
    .gt('market_count', 0)
    .order('market_count', { ascending: false }) as { data: Pick<Location, 'state_code' | 'market_count'>[] | null; error: unknown }

  // Get total market count
  const { count: totalMarkets } = await supabase
    .from('markets')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true) as { count: number | null; error: unknown }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Find <span className="text-green-600">Farmers Markets</span>
              <br />
              Near You
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Discover {totalMarkets?.toLocaleString() || '5,000+'} farmers markets across the
              United States. Fresh produce, local artisans, and community
              connections await.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-2xl">
              <SearchBar size="lg" placeholder="Search by city, state, or market name..." />
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/near-me"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <MapPin className="w-4 h-4" />
                Find markets near me
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/states"
                className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                <Search className="w-4 h-4" />
                Browse by state
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      {featuredMarkets && featuredMarkets.length > 0 && (
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Top Rated Markets
                </h2>
                <p className="mt-2 text-gray-600">
                  Discover the highest-rated farmers markets in the country
                </p>
              </div>
              <Button href="/search?sort=rating" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View all
              </Button>
            </div>
            <MarketList markets={featuredMarkets} />
          </div>
        </section>
      )}

      {/* Browse by State */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Browse by State
            </h2>
            <p className="mt-2 text-gray-600">
              Find farmers markets in your state
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stateCounts?.slice(0, 12).map((state) => (
              <Link
                key={state.state_code}
                href={`/${STATE_NAMES[state.state_code!]?.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group"
              >
                <span className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                  {state.state_code}
                </span>
                <span className="text-sm text-gray-500">
                  {state.market_count} markets
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button href="/states" variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View all states
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Use FarmersMarkets.io?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comprehensive Directory
              </h3>
              <p className="text-gray-600">
                Access detailed information on thousands of farmers markets
                across all 50 states, including addresses, hours, and contact
                details.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ratings & Reviews
              </h3>
              <p className="text-gray-600">
                See real ratings and reviews from visitors to help you find the
                best markets with quality vendors and fresh produce.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Up-to-Date Information
              </h3>
              <p className="text-gray-600">
                Market hours, seasonal schedules, and product availability are
                regularly updated so you always have accurate information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Own a Farmers Market?
          </h2>
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
            Claim your listing to update your market&apos;s information, respond
            to reviews, and reach more customers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/add-market"
              variant="secondary"
              size="lg"
            >
              Add Your Market
            </Button>
            <Button
              href="/about"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            About Farmers Markets in the United States
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              Farmers markets have become an essential part of local food systems
              across America. These vibrant community gatherings connect consumers
              directly with local farmers, artisans, and food producers, offering
              fresh, seasonal produce and unique handcrafted goods.
            </p>
            <p>
              Shopping at farmers markets supports local agriculture, reduces food
              miles, and helps build stronger community connections. Many markets
              also accept SNAP/EBT benefits, making fresh, healthy food accessible
              to more families.
            </p>
            <p>
              FarmersMarkets.io provides the most comprehensive directory of
              farmers markets in the United States, sourced from the USDA Farmers
              Market Directory and enhanced with detailed business information
              including hours, contact details, and customer reviews.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
