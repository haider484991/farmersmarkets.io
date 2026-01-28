// Outscraper API integration for data enrichment
// Documentation: https://outscraper.com/google-maps-api-docs/

const OUTSCRAPER_API_URL = 'https://api.app.outscraper.com/maps/search-v3'

interface OutscraperResult {
  name: string
  place_id: string
  google_id: string
  full_address: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  country_code: string
  latitude: number
  longitude: number
  phone: string
  site: string
  email: string
  rating: number
  reviews: number
  photos_count: number
  photo: string
  photos: string[]
  working_hours: Record<string, string[]> | null
  business_status: string
  type: string
  subtypes: string[]
  verified: boolean
  popular_times: Record<string, Record<string, number>> | null
  price_level: string | null
}

interface OutscraperSearchParams {
  query: string
  limit?: number
  language?: string
  region?: string
}

export async function searchGoogleMaps(params: OutscraperSearchParams): Promise<OutscraperResult | null> {
  const apiKey = process.env.OUTSCRAPER_API_KEY

  if (!apiKey) {
    throw new Error('OUTSCRAPER_API_KEY environment variable is not set')
  }

  const searchParams = new URLSearchParams({
    query: params.query,
    limit: String(params.limit || 1),
    language: params.language || 'en',
    region: params.region || 'US',
    async: 'false',
  })

  const response = await fetch(`${OUTSCRAPER_API_URL}?${searchParams}`, {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Outscraper API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  // Response is nested array: [[result1, result2, ...]]
  const results = data.data?.[0]
  return results?.[0] || null
}

export async function searchGoogleMapsBatch(
  queries: string[],
  options?: { batchSize?: number; delayMs?: number }
): Promise<(OutscraperResult | null)[]> {
  const { batchSize = 20, delayMs = 2000 } = options || {}
  const results: (OutscraperResult | null)[] = []

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize)

    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(queries.length / batchSize)}`)

    const batchResults = await Promise.all(
      batch.map(query => searchGoogleMaps({ query, limit: 1 }).catch(() => null))
    )

    results.push(...batchResults)

    // Rate limiting delay between batches
    if (i + batchSize < queries.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  return results
}

// Build search query for a market
export function buildMarketSearchQuery(market: {
  name: string
  city?: string | null
  state?: string | null
  address?: string | null
}): string {
  const parts = [market.name]

  if (market.address) {
    parts.push(market.address)
  } else {
    if (market.city) parts.push(market.city)
    if (market.state) parts.push(market.state)
  }

  return parts.join(', ')
}

// Map Outscraper result to market update fields
export interface MarketEnrichmentData {
  phone: string | null
  website: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  google_place_id: string | null
  google_rating: number | null
  google_reviews_count: number
  directions_url: string | null
  business_status: string | null
  schedule: Record<string, { open: string; close: string } | null> | null
  popular_times: Record<string, Record<string, number>> | null
  photos: string[]
  featured_image: string | null
  last_enriched_at: string
}

export function mapOutscraperToMarket(result: OutscraperResult): MarketEnrichmentData {
  // Parse working hours into our schedule format
  let schedule: Record<string, { open: string; close: string } | null> | null = null

  if (result.working_hours) {
    schedule = {}
    const dayMap: Record<string, string> = {
      Monday: 'monday',
      Tuesday: 'tuesday',
      Wednesday: 'wednesday',
      Thursday: 'thursday',
      Friday: 'friday',
      Saturday: 'saturday',
      Sunday: 'sunday',
    }

    for (const [day, hours] of Object.entries(result.working_hours)) {
      const dayKey = dayMap[day]
      if (dayKey && hours && hours.length >= 2) {
        schedule[dayKey] = { open: hours[0], close: hours[1] }
      } else if (dayKey) {
        schedule[dayKey] = null
      }
    }
  }

  // Generate directions URL from place_id
  const directionsUrl = result.place_id
    ? `https://www.google.com/maps/dir/?api=1&destination_place_id=${result.place_id}`
    : result.latitude && result.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${result.latitude},${result.longitude}`
    : null

  return {
    phone: result.phone || null,
    website: result.site || null,
    email: result.email || null,
    latitude: result.latitude || null,
    longitude: result.longitude || null,
    google_place_id: result.place_id || null,
    google_rating: result.rating || null,
    google_reviews_count: result.reviews || 0,
    directions_url: directionsUrl,
    business_status: result.business_status || null,
    schedule,
    popular_times: result.popular_times || null,
    photos: result.photos?.slice(0, 5) || [],
    featured_image: result.photo || result.photos?.[0] || null,
    last_enriched_at: new Date().toISOString(),
  }
}

// Calculate enrichment cost estimate
export function estimateEnrichmentCost(marketCount: number): {
  baseCost: number
  withPhotosCost: number
  totalEstimate: number
} {
  const BASE_COST_PER_RECORD = 0.003
  const PHOTOS_COST_PER_RECORD = 0.002

  const baseCost = marketCount * BASE_COST_PER_RECORD
  const withPhotosCost = marketCount * PHOTOS_COST_PER_RECORD
  const totalEstimate = baseCost + withPhotosCost

  return {
    baseCost: Math.round(baseCost * 100) / 100,
    withPhotosCost: Math.round(withPhotosCost * 100) / 100,
    totalEstimate: Math.round(totalEstimate * 100) / 100,
  }
}
