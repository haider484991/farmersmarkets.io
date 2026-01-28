'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, X } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  size?: 'sm' | 'md' | 'lg'
  showLocationButton?: boolean
  autoFocus?: boolean
  onSearch?: (query: string) => void
}

export function SearchBar({
  placeholder = 'Search markets, cities, or states...',
  defaultValue = '',
  size = 'md',
  showLocationButton = true,
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const sizeClasses = {
    sm: 'py-2 pl-10 pr-4 text-sm',
    md: 'py-3 pl-12 pr-4 text-base',
    lg: 'py-4 pl-14 pr-6 text-lg',
  }

  const iconSizes = {
    sm: 'w-4 h-4 left-3',
    md: 'w-5 h-5 left-4',
    lg: 'w-6 h-6 left-5',
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          router.push(
            `/near-me?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          )
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSizes[size]}`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full rounded-xl border bg-white
            ${sizeClasses[size]}
            ${
              isFocused
                ? 'border-green-500 ring-2 ring-green-500/20'
                : 'border-gray-300'
            }
            focus:outline-none transition-all
            placeholder:text-gray-400
          `}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Location button */}
        {showLocationButton && (
          <button
            type="button"
            onClick={handleLocationClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition-colors"
            aria-label="Use my location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}
