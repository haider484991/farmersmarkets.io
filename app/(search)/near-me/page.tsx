'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Loader2 } from 'lucide-react'
import { MarketList, MarketListSkeleton } from '@/components/market/MarketList'
import { Button } from '@/components/ui/Button'
import type { Market, PaginatedResponse } from '@/types/database'
import { calculateDistance, formatDistance } from '@/lib/utils'

type LocationState = 'idle' | 'requesting' | 'success' | 'error'

interface MarketWithDistance extends Market {
  distance?: number
}

export default function NearMePage() {
  const searchParams = useSearchParams()

  const [locationState, setLocationState] = useState<LocationState>('idle')
  const [locationError, setLocationError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [markets, setMarkets] = useState<MarketWithDistance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [radius, setRadius] = useState(25) // miles

  // Check for location params in URL
  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (lat && lng) {
      const latitude = parseFloat(lat)
      const longitude = parseFloat(lng)
      if (!isNaN(latitude) && !isNaN(longitude)) {
        setUserLocation({ lat: latitude, lng: longitude })
        setLocationState('success')
      }
    }
  }, [searchParams])

  // Request location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setLocationState('error')
      return
    }

    setLocationState('requesting')
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationState('success')
      },
      (error) => {
        let message = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out.'
            break
        }
        setLocationError(message)
        setLocationState('error')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }, [])

  // Fetch markets when location is available
  useEffect(() => {
    if (!userLocation) return

    const fetchNearbyMarkets = async () => {
      setIsLoading(true)

      try {
        const params = new URLSearchParams({
          lat: String(userLocation.lat),
          lng: String(userLocation.lng),
          radius: String(radius),
          limit: '24',
          sort: 'distance',
        })

        const response = await fetch(`/api/markets?${params}`)
        const data: PaginatedResponse<Market> = await response.json()

        // Add distance to each market
        const marketsWithDistance = data.data.map((market) => ({
          ...market,
          distance:
            market.latitude && market.longitude
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  market.latitude,
                  market.longitude
                )
              : undefined,
        }))

        // Sort by distance
        marketsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))

        setMarkets(marketsWithDistance)
      } catch (error) {
        console.error('Failed to fetch markets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNearbyMarkets()
  }, [userLocation, radius])

  // Auto-request location on mount if not already provided
  useEffect(() => {
    if (locationState === 'idle' && !searchParams.get('lat')) {
      requestLocation()
    }
  }, [locationState, searchParams, requestLocation])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Farmers Markets Near You
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Find fresh produce and local goods at markets in your area
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Status */}
        {locationState === 'idle' || locationState === 'requesting' ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Loader2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-lg text-gray-600">Getting your location...</p>
            <p className="text-sm text-gray-400 mt-2">
              Please allow location access when prompted
            </p>
          </div>
        ) : locationState === 'error' ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">{locationError}</p>
            <Button onClick={requestLocation} variant="primary" className="mt-4">
              Try Again
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Or{' '}
              <a href="/search" className="text-green-600 hover:underline">
                search by location manually
              </a>
            </p>
          </div>
        ) : (
          <>
            {/* Radius Selector */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing markets within{' '}
                <span className="font-semibold">{radius} miles</span>
                {userLocation && (
                  <span className="text-sm text-gray-400 ml-2">
                    ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="radius" className="text-sm text-gray-600">
                  Radius:
                </label>
                <select
                  id="radius"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                  <option value={100}>100 miles</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {isLoading ? (
              <MarketListSkeleton count={6} />
            ) : markets.length > 0 ? (
              <div className="space-y-6">
                {/* Market Cards with Distance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {markets.map((market) => (
                    <article
                      key={market.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <a href={`/market/${market.slug}`} className="block p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {market.name}
                          </h3>
                          {market.distance !== undefined && (
                            <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                              {formatDistance(market.distance)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {market.city}, {market.state_code}
                        </p>
                        {market.google_rating && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <span className="text-yellow-500">★</span>
                            {market.google_rating.toFixed(1)}
                            {market.google_reviews_count > 0 && (
                              <span>({market.google_reviews_count})</span>
                            )}
                          </div>
                        )}
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  No markets found within {radius} miles of your location.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try expanding your search radius or{' '}
                  <a href="/search" className="text-green-600 hover:underline">
                    search by name
                  </a>
                  .
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
