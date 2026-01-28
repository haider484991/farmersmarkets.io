import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Navigation,
  Star,
  Mail,
  CheckCircle,
  Calendar,
  CreditCard,
  ShoppingBag,
} from 'lucide-react'
import type { Market, MarketSchedule, MarketProducts, PaymentMethods, SeoFeature } from '@/types/database'
import { formatPhone, formatDay, DAYS_OF_WEEK, type DayOfWeek } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { FavoriteButton } from './FavoriteButton'
import { SingleMarketMap } from '@/components/map/MapView'

interface MarketDetailProps {
  market: Market
  userId?: string | null
  isFavorited?: boolean
}

export function MarketDetail({ market, userId, isFavorited = false }: MarketDetailProps) {
  const schedule = market.schedule as MarketSchedule | null
  const products = market.products as MarketProducts | null
  const paymentMethods = market.payment_methods as PaymentMethods | null
  const photos = (market.photos as string[]) || []
  const allPhotos = market.featured_image
    ? [market.featured_image, ...photos.filter((p) => p !== market.featured_image)]
    : photos

  // Parse SEO features
  const seoFeatures = (market as Market & { seo_features?: SeoFeature[] | string }).seo_features
  const features: SeoFeature[] = seoFeatures
    ? (typeof seoFeatures === 'string' ? JSON.parse(seoFeatures) : seoFeatures)
    : []

  return (
    <div className="space-y-8">
      {/* Photo Gallery */}
      <div className="relative">
        {allPhotos.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 h-[400px]">
            {/* Main Image */}
            <div className="col-span-2 row-span-2 relative rounded-l-xl overflow-hidden">
              <Image
                src={allPhotos[0]}
                alt={market.name}
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
            </div>
            {/* Secondary Images */}
            {allPhotos.slice(1, 5).map((photo, index) => (
              <div
                key={index}
                className={`relative overflow-hidden ${
                  index === 1 ? 'rounded-tr-xl' : ''
                } ${index === 3 ? 'rounded-br-xl' : ''}`}
              >
                <Image
                  src={photo}
                  alt={`${market.name} photo ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
            {/* Fill empty slots */}
            {allPhotos.length < 5 &&
              Array.from({ length: 5 - allPhotos.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className={`bg-gray-200 ${
                    allPhotos.length + index === 1 ? 'rounded-tr-xl' : ''
                  } ${allPhotos.length + index === 4 ? 'rounded-br-xl' : ''}`}
                />
              ))}
          </div>
        ) : (
          <div className="h-[300px] bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
            <MapPin className="w-20 h-20 text-green-400" />
          </div>
        )}

        {/* Favorite Button */}
        {userId && (
          <div className="absolute top-4 right-4">
            <FavoriteButton
              marketId={market.id}
              userId={userId}
              initialFavorited={isFavorited}
              size="lg"
            />
          </div>
        )}

        {/* Verified Badge */}
        {market.is_verified && (
          <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{market.name}</h1>
          {/* Rating */}
          {market.google_rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-semibold">{market.google_rating.toFixed(1)}</span>
              </div>
              {market.google_reviews_count > 0 && (
                <span className="text-gray-500">
                  ({market.google_reviews_count.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}
          {/* Location */}
          <div className="flex items-start gap-2 mt-2 text-gray-600">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              {market.address && <p>{market.address}</p>}
              <p>
                {market.city}, {market.state_code} {market.zip_code}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {market.directions_url && (
            <Button
              href={market.directions_url}
              variant="primary"
              leftIcon={<Navigation className="w-4 h-4" />}
            >
              Get Directions
            </Button>
          )}
          {market.phone && (
            <Button
              href={`tel:${market.phone}`}
              variant="outline"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              {formatPhone(market.phone)}
            </Button>
          )}
          {market.website && (
            <Button
              href={market.website}
              variant="outline"
              leftIcon={<Globe className="w-4 h-4" />}
            >
              Website
            </Button>
          )}
        </div>
      </div>

      {/* Description */}
      {market.description && (
        <div className="prose prose-gray max-w-none">
          <p>{market.description}</p>
        </div>
      )}

      {/* Dynamic SEO Features - Unique Market Highlights */}
      {features.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What Makes This Market Special</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm border border-green-100"
              >
                <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                <div>
                  <span className="font-semibold text-green-700 block">{feature.label}</span>
                  <span className="text-sm text-gray-600">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hours */}
        {schedule && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              Hours
            </h2>
            <ul className="space-y-2">
              {DAYS_OF_WEEK.map((day) => {
                const hours = schedule[day]
                const isToday = DAYS_OF_WEEK[new Date().getDay()] === day
                return (
                  <li
                    key={day}
                    className={`flex justify-between text-sm ${
                      isToday ? 'font-semibold text-green-600' : 'text-gray-600'
                    }`}
                  >
                    <span>{formatDay(day)}</span>
                    <span>
                      {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Season */}
        {(market.season_start || market.season_end) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Calendar className="w-5 h-5 text-green-600" />
              Season
            </h2>
            <p className="text-gray-600">
              {market.season_start && (
                <>
                  Opens:{' '}
                  {new Date(market.season_start).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </>
              )}
              {market.season_start && market.season_end && <br />}
              {market.season_end && (
                <>
                  Closes:{' '}
                  {new Date(market.season_end).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })}
                </>
              )}
            </p>
          </div>
        )}

        {/* Products */}
        {products && Object.keys(products).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Products Available
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(products)
                .filter(([, available]) => available)
                .map(([product]) => (
                  <span
                    key={product}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize"
                  >
                    {product.replace(/_/g, ' ')}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {paymentMethods && Object.keys(paymentMethods).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <CreditCard className="w-5 h-5 text-green-600" />
              Payment Methods
            </h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(paymentMethods)
                .filter(([, accepted]) => accepted)
                .map(([method]) => (
                  <span
                    key={method}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full uppercase"
                  >
                    {method === 'snap' ? 'SNAP/EBT' : method === 'wic' ? 'WIC' : method}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Contact */}
        {(market.email || market.social_facebook || market.social_instagram) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Mail className="w-5 h-5 text-green-600" />
              Contact
            </h2>
            <div className="space-y-2">
              {market.email && (
                <a
                  href={`mailto:${market.email}`}
                  className="block text-sm text-gray-600 hover:text-green-600"
                >
                  {market.email}
                </a>
              )}
              {market.social_facebook && (
                <a
                  href={market.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-green-600"
                >
                  Facebook
                </a>
              )}
              {market.social_instagram && (
                <a
                  href={market.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 hover:text-green-600"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      {market.latitude && market.longitude && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            Location
          </h2>
          <SingleMarketMap
            latitude={Number(market.latitude)}
            longitude={Number(market.longitude)}
            name={market.name}
            height="300px"
          />
        </div>
      )}
    </div>
  )
}
