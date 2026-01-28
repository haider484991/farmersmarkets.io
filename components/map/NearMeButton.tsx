'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface NearMeButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NearMeButton({
  variant = 'primary',
  size = 'md',
  className,
}: NearMeButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false)
        router.push(
          `/near-me?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
        )
      },
      (err) => {
        setIsLoading(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Please enable location access')
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable')
            break
          case err.TIMEOUT:
            setError('Request timed out')
            break
          default:
            setError('Unable to get location')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  return (
    <div className="inline-flex flex-col items-start">
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        leftIcon={
          isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )
        }
        className={className}
      >
        {isLoading ? 'Getting location...' : 'Find Markets Near Me'}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
