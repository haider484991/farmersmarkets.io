import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/Breadcrumbs'
import { MarketList } from '@/components/market/MarketList'
import { STATE_NAMES } from '@/lib/utils'
import type { Location, Market } from '@/types/database'

interface CityPageProps {
  params: Promise<{ state: string; city: string }>
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const supabase = await createClient()

  // Find state
  const { data: stateLocation } = await supabase
    .from('locations')
    .select('name, state_code')
    .eq('type', 'state')
    .eq('slug', stateSlug)
    .single() as { data: Pick<Location, 'name' | 'state_code'> | null; error: unknown }

  if (!stateLocation || !stateLocation.state_code) return {}

  // Find city
  const { data: cityLocation } = await supabase
    .from('locations')
    .select('name')
    .eq('type', 'city')
    .eq('slug', citySlug)
    .eq('state_code', stateLocation.state_code)
    .single() as { data: Pick<Location, 'name'> | null; error: unknown }

  if (!cityLocation) return {}

  const cityName = cityLocation.name
  const stateName = stateLocation.name

  return {
    title: `Farmers Markets in ${cityName}, ${stateName}`,
    description: `Find farmers markets in ${cityName}, ${stateName}. Browse local markets with fresh produce, artisan goods, hours, and directions.`,
    openGraph: {
      title: `Farmers Markets in ${cityName}, ${stateName} | FarmersMarkets.io`,
      description: `Discover farmers markets in ${cityName}. Fresh produce, local vendors, and community markets.`,
    },
  }
}

export const revalidate = 86400 // Revalidate every 24 hours

export default async function CityPage({ params }: CityPageProps) {
  const { state: stateSlug, city: citySlug } = await params
  const supabase = await createClient()

  // Find state
  const { data: stateLocation } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'state')
    .eq('slug', stateSlug)
    .single() as { data: Location | null; error: unknown }

  if (!stateLocation || !stateLocation.state_code) {
    notFound()
  }

  const stateCode = stateLocation.state_code
  const stateName = stateLocation.name

  // Find city
  const { data: cityLocation } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'city')
    .eq('slug', citySlug)
    .eq('state_code', stateCode)
    .single() as { data: Location | null; error: unknown }

  if (!cityLocation) {
    notFound()
  }

  const cityName = cityLocation.name

  // Fetch markets for this city
  const { data: markets } = await supabase
    .from('markets')
    .select('*')
    .eq('state_code', stateCode)
    .ilike('city', cityName)
    .eq('is_active', true)
    .order('google_rating', { ascending: false, nullsFirst: false }) as { data: Market[] | null; error: unknown }

  // Fetch nearby cities
  const { data: nearbyCities } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'city')
    .eq('state_code', stateCode)
    .neq('slug', citySlug)
    .gt('market_count', 0)
    .order('market_count', { ascending: false })
    .limit(8) as { data: Location[] | null; error: unknown }

  const breadcrumbs = [
    { label: 'States', href: '/states' },
    { label: stateName, href: `/${stateSlug}` },
    { label: cityName },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Farmers Markets in {cityName}, {stateName}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {markets?.length || 0} farmers market{markets?.length !== 1 ? 's' : ''}{' '}
            in {cityName}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Markets List */}
        {markets && markets.length > 0 ? (
          <MarketList markets={markets} />
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No farmers markets found in {cityName}.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try browsing{' '}
              <Link href={`/${stateSlug}`} className="text-green-600 hover:underline">
                other cities in {stateName}
              </Link>
              .
            </p>
          </div>
        )}

        {/* Nearby Cities */}
        {nearbyCities && nearbyCities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Other Cities in {stateName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {nearbyCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${stateSlug}/${city.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {city.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {city.market_count} market{city.market_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Farmers Markets in {cityName}
          </h2>
          <div className="prose prose-gray max-w-none">
            <p>
              {cityName}, {stateName} has {markets?.length || 'several'} farmers
              market{markets?.length !== 1 ? 's' : ''} offering fresh, local
              produce and artisan goods to the community.
            </p>
            <p>
              Shopping at farmers markets in {cityName} supports local farmers
              and food producers while providing access to seasonal fruits and
              vegetables, locally-raised meats, dairy products, baked goods, and
              unique handcrafted items.
            </p>
            <p>
              Visit a farmers market in {cityName} to experience the best of
              local food and community. Check individual market listings for
              hours, location, and products available.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
