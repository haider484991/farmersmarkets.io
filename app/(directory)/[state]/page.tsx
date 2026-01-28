import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/Breadcrumbs'
import { MarketList } from '@/components/market/MarketList'
import { Button } from '@/components/ui/Button'
import { STATE_NAMES, getStateCode } from '@/lib/utils'
import type { Location, Market } from '@/types/database'

interface StatePageProps {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state: stateSlug } = await params
  const stateName = Object.entries(STATE_NAMES).find(
    ([, name]) => name.toLowerCase().replace(/\s+/g, '-') === stateSlug
  )?.[1]

  if (!stateName) return {}

  return {
    title: `Farmers Markets in ${stateName}`,
    description: `Find farmers markets in ${stateName}. Browse local markets with fresh produce, artisan goods, and more. Get directions, hours, and contact information.`,
    openGraph: {
      title: `Farmers Markets in ${stateName} | FarmersMarkets.io`,
      description: `Discover farmers markets across ${stateName}. Fresh produce, local vendors, and community events.`,
    },
  }
}

export const revalidate = 86400 // Revalidate every 24 hours

export default async function StatePage({ params }: StatePageProps) {
  const { state: stateSlug } = await params
  const supabase = await createClient()

  // Find state by slug
  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'state')
    .eq('slug', stateSlug)
    .single() as { data: Location | null; error: unknown }

  if (!location || !location.state_code) {
    notFound()
  }

  const stateName = location.name
  const stateCode = location.state_code

  // Fetch markets for this state
  const { data: markets } = await supabase
    .from('markets')
    .select('*')
    .eq('state_code', stateCode)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsFirst: false })
    .limit(12) as { data: Market[] | null; error: unknown }

  // Fetch cities with markets in this state
  const { data: cities } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'city')
    .eq('state_code', stateCode)
    .gt('market_count', 0)
    .order('market_count', { ascending: false })
    .limit(20) as { data: Location[] | null; error: unknown }

  // Get total count for this state
  const { count: totalMarkets } = await supabase
    .from('markets')
    .select('*', { count: 'exact', head: true })
    .eq('state_code', stateCode)
    .eq('is_active', true) as { count: number | null; error: unknown }

  const breadcrumbs = [
    { label: 'States', href: '/states' },
    { label: stateName },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Farmers Markets in {stateName}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover {totalMarkets?.toLocaleString() || 0} farmers markets across{' '}
            {stateName}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Cities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Cities
              </h2>
              <ul className="space-y-2">
                {cities?.map((city) => (
                  <li key={city.id}>
                    <Link
                      href={`/${stateSlug}/${city.slug}`}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-green-600 transition-colors py-1"
                    >
                      <span>{city.name}</span>
                      <span className="text-gray-400">{city.market_count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {cities && cities.length >= 20 && (
                <Link
                  href={`/search?state=${stateCode}`}
                  className="block mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View all cities →
                </Link>
              )}
            </div>
          </div>

          {/* Main Content - Markets */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Farmers Markets in {stateName}
              </h2>
              <Button href={`/search?state=${stateCode}`} variant="outline" size="sm">
                View all
              </Button>
            </div>

            {markets && markets.length > 0 ? (
              <MarketList markets={markets} />
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No markets found in {stateName} yet.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Check back soon or{' '}
                  <Link href="/add-market" className="text-green-600 hover:underline">
                    add a market
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Farmers Markets in {stateName}
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              {stateName} is home to {totalMarkets?.toLocaleString() || 'many'}{' '}
              farmers markets offering fresh, locally-grown produce and artisan
              goods. From small community markets to large urban gatherings, you
              can find a wide variety of options throughout the state.
            </p>
            <p>
              Farmers markets in {stateName} typically offer seasonal fruits and
              vegetables, locally-raised meats, dairy products, baked goods,
              honey, flowers, and handcrafted items. Many markets also feature
              live music, cooking demonstrations, and family-friendly activities.
            </p>
            <p>
              Use our directory to find farmers markets near you in {stateName}.
              Each listing includes the market&apos;s address, operating hours,
              products available, and accepted payment methods including SNAP/EBT.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900">
                How many farmers markets are in {stateName}?
              </h3>
              <p className="mt-1 text-gray-600">
                There are currently {totalMarkets?.toLocaleString() || 'many'}{' '}
                farmers markets listed in {stateName} on FarmersMarkets.io.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                When are farmers markets open in {stateName}?
              </h3>
              <p className="mt-1 text-gray-600">
                Market hours vary by location. Most markets operate on weekends,
                with Saturday being the most popular day. Some urban markets
                operate on weekdays as well. Check individual market listings for
                specific hours.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Do farmers markets in {stateName} accept SNAP/EBT?
              </h3>
              <p className="mt-1 text-gray-600">
                Many farmers markets in {stateName} accept SNAP/EBT benefits.
                Check the individual market listing for payment options, or
                contact the market directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate static params for popular states
export async function generateStaticParams() {
  return Object.entries(STATE_NAMES).map(([, name]) => ({
    state: name.toLowerCase().replace(/\s+/g, '-'),
  }))
}
