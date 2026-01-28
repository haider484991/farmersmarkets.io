'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, User, Heart, MapPin } from 'lucide-react'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  user?: { id: string; email: string } | null
}

export function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              Farmers<span className="text-green-600">Markets</span>.io
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/states"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Browse by State
            </Link>
            <Link
              href="/near-me"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Near Me
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {user ? (
              <>
                <Link
                  href="/favorites"
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                  aria-label="Favorites"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-green-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} user={user} />
    </header>
  )
}
