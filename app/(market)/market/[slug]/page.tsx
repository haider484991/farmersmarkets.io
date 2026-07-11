import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/Breadcrumbs'
import { MarketDetail } from '@/components/market/MarketDetail'
import { NearbyMarkets } from '@/components/market/NearbyMarkets'
import { MarketSchema, MarketFAQSchema } from '@/components/seo/MarketSchema'
import { ReviewList } from '@/components/reviews/ReviewList'
import { ReviewForm, ReviewLoginPrompt } from '@/components/reviews/ReviewForm'
import { getStateSlug, calculateDistance } from '@/lib/utils'
import { buildMarketFaqs } from '@/lib/content'
import type { Market, Review } from '@/types/database'

interface MarketPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: market } = await supabase
    .from('markets')
    .select('name, city, state, state_code, meta_title, meta_description, seo_title, seo_description, seo_keywords, featured_image')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: Pick<Market, 'name' | 'city' | 'state' | 'state_code' | 'meta_title' | 'meta_description' | 'featured_image'> & { seo_title?: string; seo_description?: string; seo_keywords?: string[] } | null; error: unknown }

  if (!market) return {}

  // Prefer SEO-optimized title/description, fallback to meta, then generate default.
  // Fallback leads with the hooks people actually search ("hours", "schedule",
  // "directions") — see GSC query data — to lift CTR on near-miss rankings.
  const title =
    market.seo_title ||
    market.meta_title ||
    `${market.name}: Hours, Schedule & Directions | ${market.city}, ${market.state_code}`
  const description =
    market.seo_description ||
    market.meta_description ||
    `${market.name} in ${market.city}, ${market.state} — see days and hours, what's in season, directions, accepted payments, and reviews for this local farmers market.`

  // Use dynamic keywords if available
  const keywords = market.seo_keywords || [
    'farmers market',
    `${market.city} farmers market`,
    `${market.state} farmers market`,
    'local produce',
    'fresh produce',
  ]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/market/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/market/${slug}`,
      images: market.featured_image ? [{ url: market.featured_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: market.featured_image ? [market.featured_image] : undefined,
    },
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch market
  const { data: market } = await supabase
    .from('markets')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: Market | null; error: unknown }

  if (!market) {
    notFound()
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('market_id', market.id)
    .order('created_at', { ascending: false })
    .limit(10) as { data: Review[] | null; error: unknown }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user has favorited this market
  let isFavorited = false
  if (user) {
    const { data: favorite } = await supabase
      .from('favorites')
      .select('market_id')
      .eq('user_id', user.id)
      .eq('market_id', market.id)
      .single()
    isFavorited = !!favorite
  }

  // Nearby markets — real internal links to the closest markets (SEO + UX).
  // Bounding-box query (~50mi) then sort by true distance; fall back to
  // top-rated markets in the same state when coordinates are missing.
  let nearbyMarkets: (Market & { _distance?: number })[] = []
  if (market.latitude && market.longitude) {
    const lat = Number(market.latitude)
    const lng = Number(market.longitude)
    const box = 0.75 // ~50 miles of latitude
    const { data: candidates } = await supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .neq('id', market.id)
      .gte('latitude', lat - box)
      .lte('latitude', lat + box)
      .gte('longitude', lng - box)
      .lte('longitude', lng + box)
      .limit(50) as { data: Market[] | null; error: unknown }
    nearbyMarkets = (candidates || [])
      .map((m) => ({
        ...m,
        _distance:
          m.latitude && m.longitude
            ? calculateDistance(lat, lng, Number(m.latitude), Number(m.longitude))
            : 9999,
      }))
      .sort((a, b) => (a._distance ?? 9999) - (b._distance ?? 9999))
      .slice(0, 6)
  }
  if (nearbyMarkets.length === 0 && market.state_code) {
    const { data: candidates } = await supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .eq('state_code', market.state_code)
      .neq('id', market.id)
      .order('google_rating', { ascending: false, nullsFirst: false })
      .limit(6) as { data: Market[] | null; error: unknown }
    nearbyMarkets = candidates || []
  }

  // Real FAQ Q&A from actual market data (also emitted as FAQPage schema).
  const faqs = buildMarketFaqs(market)

  const stateSlug = getStateSlug(market.state_code || '')
  const breadcrumbs = [
    { label: 'States', href: '/states' },
    { label: market.state || '', href: `/${stateSlug}` },
    {
      label: market.city || '',
      href: `/${stateSlug}/${market.city?.toLowerCase().replace(/\s+/g, '-')}`,
    },
    { label: market.name },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Schema Markup */}
      <MarketSchema market={market} />
      <MarketFAQSchema market={market} />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <MarketDetail
          market={market}
          userId={user?.id}
          isFavorited={isFavorited}
        />

        {/* FAQ — visible content that mirrors the FAQPage structured data */}
        {faqs.length > 0 && (
          <section className="mt-12 bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-1 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews
            {reviews && reviews.length > 0 && (
              <span className="text-gray-500 font-normal ml-2">
                ({reviews.length})
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="lg:col-span-1">
              {user ? (
                <ReviewForm marketId={market.id} userId={user.id} />
              ) : (
                <ReviewLoginPrompt />
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewList reviews={reviews || []} showSource />
            </div>
          </div>
        </section>

        {/* Nearby Markets — real internal links to the closest markets */}
        <NearbyMarkets markets={nearbyMarkets} cityLabel={market.city || undefined} />

        {/* Hub links for crawl depth */}
        <section className="mt-8">
          <p className="text-gray-600">
            Looking for more? Browse all{' '}
            <a
              href={`/${stateSlug}/${market.city?.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-green-600 hover:underline font-medium"
            >
              farmers markets in {market.city}, {market.state_code}
            </a>{' '}
            or explore{' '}
            <a
              href={`/${stateSlug}`}
              className="text-green-600 hover:underline font-medium"
            >
              {market.state}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
