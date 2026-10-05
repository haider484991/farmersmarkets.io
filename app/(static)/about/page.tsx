import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Database, Star, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about FarmersMarkets.io - your comprehensive guide to farmers markets across the United States. Discover our mission to connect communities with local food.',
}

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About FarmersMarkets.io
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive guide to finding farmers markets across the United States
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="prose prose-lg prose-gray">
            <p>
              FarmersMarkets.io was created with a simple mission: to make it
              easy for everyone to find and support local farmers markets. We
              believe that connecting communities with local food sources is
              essential for building healthier, more sustainable food systems.
            </p>
            <p>
              By providing comprehensive, accurate information about farmers
              markets across the country, we help consumers find fresh, local
              produce while supporting the farmers and artisans who make these
              markets possible.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comprehensive Directory
                </h3>
                <p className="text-gray-600">
                  Access detailed information on thousands of farmers markets
                  including addresses, hours, and products available.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Reliable Data
                </h3>
                <p className="text-gray-600">
                  Our data comes from the USDA Farmers Market Directory,
                  enhanced with additional business information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ratings & Reviews
                </h3>
                <p className="text-gray-600">
                  See what others are saying about markets and share your own
                  experiences to help the community.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  Market owners can claim and update their listings to ensure
                  accurate, up-to-date information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Data</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              Our market data is sourced from the{' '}
              <a
                href="https://www.ams.usda.gov/local-food-directories/farmersmarkets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                USDA Farmers Market Directory
              </a>
              , the most comprehensive federal database of farmers markets in the
              United States.
            </p>
            <p className="text-gray-600">
              We enhance this data with additional business information including
              phone numbers, websites, photos, and customer ratings to provide
              the most complete market listings possible.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 bg-green-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Own a Farmers Market?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Claim your listing to update your market information, respond to
            reviews, and connect with more customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-market"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your Market
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
