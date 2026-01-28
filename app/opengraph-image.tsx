import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FarmersMarkets.io - Find Local Farmers Markets Near You'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: '#16a34a',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 700 }}>
            <span style={{ color: '#111827' }}>Farmers</span>
            <span style={{ color: '#16a34a' }}>Markets</span>
            <span style={{ color: '#111827' }}>.io</span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: '#374151',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Find Local Farmers Markets Near You
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            marginTop: 50,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#16a34a' }}>8,000+</div>
            <div style={{ fontSize: 20, color: '#6b7280' }}>Markets</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#16a34a' }}>50</div>
            <div style={{ fontSize: 20, color: '#6b7280' }}>States</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#16a34a' }}>Free</div>
            <div style={{ fontSize: 20, color: '#6b7280' }}>Directory</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 18,
            color: '#9ca3af',
          }}
        >
          farmersmarkets.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
