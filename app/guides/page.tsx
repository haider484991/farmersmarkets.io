import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { getAllGuides } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Farmers Market Guides & Resources',
  description:
    'Practical guides to farmers markets: what’s in season, how to use SNAP/EBT and WIC benefits, tips for first-timers, how to store fresh produce, and how to become a vendor.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Farmers Market Guides & Resources | FarmersMarkets.io',
    description:
      'Practical, in-depth guides to shopping, saving, and selling at farmers markets across the United States.',
    url: '/guides',
    type: 'website',
  },
}

export default function GuidesIndexPage() {
  const guides = getAllGuides()
  const [featured, ...rest] = guides

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Farmers Market Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            In-depth, practical guides to shopping, saving, and selling at farmers
            markets — from seasonal produce to SNAP benefits to becoming a vendor.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured guide */}
        {featured && (
          <Link
            href={`/guides/${featured.slug}`}
            className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-green-300 hover:shadow-lg transition-all mb-10"
          >
            <div className="grid md:grid-cols-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 md:py-0">
                <span className="text-7xl">{featured.emoji}</span>
              </div>
              <div className="md:col-span-2 p-8">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 rounded-full px-3 py-1">
                  {featured.category}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 group-hover:text-green-700">
                  {featured.title}
                </h2>
                <p className="mt-3 text-gray-600">{featured.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {featured.readingTime} min read
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid of remaining guides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">{guide.emoji}</div>
              <span className="mt-3 inline-block self-start text-xs font-semibold uppercase tracking-wider text-green-700">
                {guide.category}
              </span>
              <h2 className="mt-1 text-lg font-semibold text-gray-900 leading-snug group-hover:text-green-700">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
                {guide.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {guide.readingTime} min read
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
