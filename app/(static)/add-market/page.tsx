import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, CheckCircle, Clock, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add Your Market',
  description:
    'Add your farmers market to FarmersMarkets.io. Get your market listed in our directory and reach more customers.',
}

export default function AddMarketPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add Your Farmers Market
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your market listed on FarmersMarkets.io and connect with more
            customers
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Submit Information
              </h3>
              <p className="text-gray-600">
                Fill out the form with your market details including location,
                hours, and products.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. Review Process
              </h3>
              <p className="text-gray-600">
                Our team reviews submissions to ensure accuracy. This typically
                takes 1-3 business days.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Go Live
              </h3>
              <p className="text-gray-600">
                Once approved, your market appears in our directory and search
                results.
              </p>
            </div>
          </div>
        </section>

        {/* Submission Form */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Market Information
          </h2>

          <form className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="Downtown Farmers Market"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="contact@market.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                placeholder="https://www.yourmarket.com"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Description
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none resize-none"
                placeholder="Tell us about your market, the vendors, products available, and what makes it special..."
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Hours *
              </label>
              <textarea
                rows={3}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none resize-none"
                placeholder="Saturday: 8am - 2pm&#10;Sunday: 9am - 1pm"
              />
            </div>

            {/* Verification */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="verify"
                required
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="verify" className="text-sm text-gray-600">
                I confirm that I am authorized to submit this market listing and
                that the information provided is accurate.
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Submit Market
            </button>
          </form>
        </section>

        {/* Already listed */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Is your market already listed?{' '}
            <Link href="/contact" className="text-green-600 hover:underline">
              Contact us
            </Link>{' '}
            to claim or update your listing.
          </p>
        </div>
      </div>
    </div>
  )
}
