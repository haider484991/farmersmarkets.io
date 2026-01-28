import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { MarketSearchParams, PaginatedResponse, Market } from '@/types/database'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const params: MarketSearchParams = {
    q: searchParams.get('q') || undefined,
    state: searchParams.get('state') || undefined,
    city: searchParams.get('city') || undefined,
    products: searchParams.get('products')?.split(',') || undefined,
    payment_methods: searchParams.get('payment_methods')?.split(',') || undefined,
    day: searchParams.get('day') || undefined,
    lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
    lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined,
    radius: searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12,
    sort: (searchParams.get('sort') as 'rating' | 'distance' | 'name') || undefined,
  }

  try {
    const supabase = await createClient()
    const { page = 1, limit = 12 } = params
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('markets')
      .select('*', { count: 'exact' })
      .eq('is_active', true)

    // Text search
    if (params.q) {
      // Search in name, city, and state
      query = query.or(
        `name.ilike.%${params.q}%,city.ilike.%${params.q}%,state.ilike.%${params.q}%`
      )
    }

    // State filter
    if (params.state) {
      query = query.eq('state_code', params.state.toUpperCase())
    }

    // City filter
    if (params.city) {
      query = query.ilike('city', params.city)
    }

    // Products filter
    if (params.products && params.products.length > 0) {
      // Filter by products JSONB field
      params.products.forEach((product) => {
        query = query.eq(`products->>${product}`, 'true')
      })
    }

    // Payment methods filter
    if (params.payment_methods && params.payment_methods.length > 0) {
      params.payment_methods.forEach((method) => {
        query = query.eq(`payment_methods->>${method}`, 'true')
      })
    }

    // Sorting
    switch (params.sort) {
      case 'rating':
        query = query.order('google_rating', { ascending: false, nullsFirst: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      default:
        // Default: sort by rating then name
        query = query
          .order('google_rating', { ascending: false, nullsFirst: false })
          .order('name', { ascending: true })
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: markets, count, error } = await query as { data: Market[] | null; count: number | null; error: unknown }

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Failed to search markets' },
        { status: 500 }
      )
    }

    // For location-based search, we need to do additional filtering
    // since Supabase doesn't support earthdistance in direct queries easily
    let filteredMarkets: Market[] = markets || []

    if (params.lat && params.lng && params.radius) {
      const { lat, lng, radius } = params

      filteredMarkets = filteredMarkets.filter((market) => {
        if (!market.latitude || !market.longitude) return false

        // Haversine formula
        const R = 3959 // Earth's radius in miles
        const dLat = toRad(market.latitude - lat)
        const dLon = toRad(market.longitude - lng)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat)) *
            Math.cos(toRad(market.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c

        return distance <= radius
      })

      // Sort by distance if location-based
      if (params.sort === 'distance' || !params.sort) {
        filteredMarkets.sort((a, b) => {
          const distA = calculateDistance(lat, lng, a.latitude!, a.longitude!)
          const distB = calculateDistance(lat, lng, b.latitude!, b.longitude!)
          return distA - distB
        })
      }
    }

    const response: PaginatedResponse<Market> = {
      data: filteredMarkets,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
