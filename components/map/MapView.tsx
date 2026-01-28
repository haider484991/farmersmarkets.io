'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MarketMarker {
  id: string
  name: string
  slug: string
  latitude: number
  longitude: number
  rating?: number | null
}

interface MapViewProps {
  markets: MarketMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  interactive?: boolean
  showPopups?: boolean
  onMarkerClick?: (marketId: string) => void
}

export function MapView({
  markets,
  center,
  zoom = 4,
  height = '400px',
  showPopups = true,
}: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [leafletIcon, setLeafletIcon] = useState<L.Icon | null>(null)

  useEffect(() => {
    setIsMounted(true)
    // Create icon on client side only
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      setLeafletIcon(icon)
    })
  }, [])

  // Calculate center from markets if not provided
  const mapCenter: [number, number] = center || calculateCenter(markets) || [39.8, -98.5]

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-xl flex items-center justify-center animate-pulse"
      >
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {leafletIcon && markets.map((market) => {
          if (!market.latitude || !market.longitude) return null
          return (
            <Marker
              key={market.id}
              position={[market.latitude, market.longitude]}
              icon={leafletIcon}
            >
              {showPopups && (
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-semibold text-gray-900 text-sm">{market.name}</h3>
                    {market.rating && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <span className="text-yellow-500">★</span> {market.rating.toFixed(1)}
                      </div>
                    )}
                    <a
                      href={`/market/${market.slug}`}
                      className="text-green-600 text-xs hover:underline mt-2 block"
                    >
                      View Details →
                    </a>
                  </div>
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

// Calculate center point from array of markets
function calculateCenter(
  markets: MarketMarker[]
): [number, number] | null {
  const validMarkets = markets.filter((m) => m.latitude && m.longitude)
  if (validMarkets.length === 0) return null

  const sumLat = validMarkets.reduce((sum, m) => sum + m.latitude, 0)
  const sumLng = validMarkets.reduce((sum, m) => sum + m.longitude, 0)

  return [sumLat / validMarkets.length, sumLng / validMarkets.length]
}

// Single market map (simpler version)
interface SingleMarketMapProps {
  latitude: number
  longitude: number
  name: string
  height?: string
}

export function SingleMarketMap({
  latitude,
  longitude,
  name,
  height = '300px',
}: SingleMarketMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [leafletIcon, setLeafletIcon] = useState<L.Icon | null>(null)

  useEffect(() => {
    setIsMounted(true)
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
      setLeafletIcon(icon)
    })
  }, [])

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-xl flex items-center justify-center animate-pulse"
      >
        <p className="text-gray-400">Loading map...</p>
      </div>
    )
  }

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {leafletIcon && (
          <Marker position={[latitude, longitude]} icon={leafletIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold">{name}</h3>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
