'use client'

import Link from 'next/link'
import { MapPin, Search, Heart, User, LogOut, Info, Plus } from 'lucide-react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  user?: { id: string; email: string } | null
}

export function MobileNav({ isOpen, onClose, user }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <nav className="px-4 py-4 space-y-2">
        <Link
          href="/states"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <MapPin className="h-5 w-5" />
          Browse by State
        </Link>
        <Link
          href="/near-me"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <MapPin className="h-5 w-5" />
          Near Me
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <Search className="h-5 w-5" />
          Search Markets
        </Link>
        <Link
          href="/about"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <Info className="h-5 w-5" />
          About
        </Link>
        <Link
          href="/add-market"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={onClose}
        >
          <Plus className="h-5 w-5" />
          Add a Market
        </Link>

        <hr className="my-2 border-gray-200" />

        {user ? (
          <>
            <Link
              href="/favorites"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              <Heart className="h-5 w-5" />
              My Favorites
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              <User className="h-5 w-5" />
              Dashboard
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full"
                onClick={onClose}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
              onClick={onClose}
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}
