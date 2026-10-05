import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/Breadcrumbs'
import { STATE_NAMES, getStateSlug } from '@/lib/utils'
import type { Location } from '@/types/database'

export const metadata: Metadata = {
  title: 'Browse Farmers Markets by State',
  description:
    'Find farmers markets in all 50 US states. Browse our comprehensive directory to discover local farmers markets near you with fresh produce, artisan goods, and more.',
  openGraph: {
    title: 'Browse Farmers Markets by State | FarmersMarkets.io',
    description:
      'Find farmers markets in all 50 US states. Discover local markets with fresh produce and artisan goods.',
  },
}

export const revalidate = 86400 // Revalidate every 24 hours

export default async function StatesPage() {
  const supabase = await createClient()

  const { data: states } = await supabase
    .from('locations')
    .select('*')
    .eq('type', 'state')
    .order('name') as { data: Location[] | null; error: unknown }

  // Group states by region
  const regions: Record<string, string[]> = {
    Northeast: ['CT', 'DE', 'ME', 'MD', 'MA', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT', 'DC'],
    Southeast: ['AL', 'AR', 'FL', 'GA', 'KY', 'LA', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    Midwest: ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH', 'SD', 'WI'],
    Southwest: ['AZ', 'NM', 'OK', 'TX'],
    West: ['AK', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
    Territories: ['PR'],
  }

  const statesByCode = new Map(states?.map((s) => [s.state_code, s]) || [])

  const breadcrumbs = [{ label: 'Browse by State' }]

  // Calculate totals
  const totalMarkets = states?.reduce((sum, s) => sum + (s.market_count || 0), 0) || 0

  return (
    <div className="bg-gray-50 min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Farmers Markets by State
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse {totalMarkets.toLocaleString()} farmers markets across all 50 states
            and territories
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(regions).map(([region, stateCodes]) => {
          const regionStates = stateCodes
            .map((code) => statesByCode.get(code))
            .filter(Boolean)
            .filter((s) => s!.market_count > 0)

          if (regionStates.length === 0) return null

          return (
            <div key={region} className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {region}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {regionStates.map((state) => (
                  <Link
                    key={state!.state_code}
                    href={`/${state!.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                        {state!.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {state!.market_count} markets
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* SEO Content */}
      <div className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Find Farmers Markets in Your State
          </h2>
          <div className="prose prose-gray">
            <p>
              FarmersMarkets.io is your comprehensive guide to farmers markets
              across the United States. Whether you&apos;re looking for fresh
              vegetables, locally-raised meats, artisan cheeses, or handcrafted
              goods, our directory helps you find markets in every state.
            </p>
            <p>
              Each state page includes detailed information about markets
              including addresses, operating hours, products available, and
              accepted payment methods. Many markets accept SNAP/EBT benefits,
              making fresh, local food accessible to all communities.
            </p>
            <p>
              Use our state directory to explore farmers markets near you or plan
              visits when traveling. Support local farmers and discover the best
              your community has to offer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
