// Google Places API (New) integration — pulls real business photos for markets.
//
// Uses the official Places API v1. For your volume (a few thousand markets) this
// stays inside Google's free monthly tier, so it costs $0 — no scraping, no
// blocking, no CAPTCHAs. Requires a Maps API key with the "Places API (New)"
// enabled, provided via the GOOGLE_MAPS_API_KEY environment variable.
//
// The photo media endpoint is called with skipHttpRedirect=true, which returns a
// public googleusercontent.com URL (no API key embedded), matching the format of
// the existing Outscraper-sourced images.

const BASE = 'https://places.googleapis.com/v1'

export interface PlacePhotoResult {
  placeId: string | null
  featuredImage: string | null
  photos: string[]
}

interface ApiPhoto {
  name: string
  widthPx?: number
  heightPx?: number
}

interface ApiPlace {
  id?: string
  photos?: ApiPhoto[]
  displayName?: { text?: string }
  formattedAddress?: string
}

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) throw new Error('GOOGLE_MAPS_API_KEY environment variable is not set')
  return key
}

/** Find a place by free-text query (name + city + state). Returns id + photos. */
async function searchPlace(textQuery: string): Promise<ApiPlace | null> {
  const res = await fetch(`${BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': 'places.id,places.photos,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery, maxResultCount: 1, regionCode: 'US' }),
  })
  if (!res.ok) throw new Error(`searchText ${res.status}: ${(await res.text()).slice(0, 160)}`)
  const data = await res.json()
  return data.places?.[0] || null
}

/** Look up a known place by id. Returns photos. */
async function getPlace(placeId: string): Promise<ApiPlace | null> {
  const res = await fetch(`${BASE}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': 'id,photos,displayName,formattedAddress',
    },
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`getPlace ${res.status}: ${(await res.text()).slice(0, 160)}`)
  return res.json()
}

/** Resolve a photo resource name to a public googleusercontent URL (no key). */
async function resolvePhotoUrl(photoName: string, maxWidthPx = 1200): Promise<string | null> {
  const url =
    `${BASE}/${photoName}/media` +
    `?maxWidthPx=${maxWidthPx}&skipHttpRedirect=true&key=${encodeURIComponent(apiKey())}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  return data.photoUri || null
}

/**
 * Fetch real Google photos for one market.
 * @param market  name/city/state used for text search; place_id used directly when present.
 * @param maxPhotos  how many photos to resolve (first becomes featured_image).
 */
export async function fetchMarketPhotos(
  market: {
    name: string
    city?: string | null
    state?: string | null
    address?: string | null
    google_place_id?: string | null
  },
  maxPhotos = 4
): Promise<PlacePhotoResult> {
  // Prefer a known place_id; otherwise search by name + location.
  let place: ApiPlace | null = null
  if (market.google_place_id) {
    place = await getPlace(market.google_place_id)
  }
  if (!place) {
    const query = [market.name, market.address || market.city, market.state]
      .filter(Boolean)
      .join(', ')
    place = await searchPlace(query)
  }

  if (!place) return { placeId: null, featuredImage: null, photos: [] }

  const photoNames = (place.photos || []).slice(0, maxPhotos).map((p) => p.name)
  const urls: string[] = []
  for (const name of photoNames) {
    const u = await resolvePhotoUrl(name)
    if (u) urls.push(u)
  }

  return {
    placeId: place.id || market.google_place_id || null,
    featuredImage: urls[0] || null,
    photos: urls,
  }
}
