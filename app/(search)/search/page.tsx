'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SearchBar } from '@/components/search/SearchBar'
import { Filters } from '@/components/search/Filters'
import { MarketList, MarketListSkeleton } from '@/components/market/MarketList'
import { Button } from '@/components/ui/Button'
import type { Market, PaginatedResponse } from '@/types/database'
import { debounce } from '@/lib/utils'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [markets, setMarkets] = useState<Market[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter states
  const [selectedState, setSelectedState] = useState<string | undefined>(
    searchParams.get('state') || undefined
  )
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    searchParams.get('products')?.split(',').filter(Boolean) || []
  )
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>(
    searchParams.get('payment_methods')?.split(',').filter(Boolean) || []
  )
  const [selectedDay, setSelectedDay] = useState<string | undefined>(
    searchParams.get('day') || undefined
  )
  const [sortBy, setSortBy] = useState<'rating' | 'name' | undefined>(
    (searchParams.get('sort') as 'rating' | 'name') || undefined
  )

  // Fetch markets
  const fetchMarkets = useCallback(async () => {
    setIsLoading(true)

    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedState) params.set('state', selectedState)
    if (selectedProducts.length > 0) params.set('products', selectedProducts.join(','))
    if (selectedPaymentMethods.length > 0)
      params.set('payment_methods', selectedPaymentMethods.join(','))
    if (selectedDay) params.set('day', selectedDay)
    if (sortBy) params.set('sort', sortBy)
    params.set('page', String(page))
    params.set('limit', '12')

    try {
      const response = await fetch(`/api/markets?${params}`)
      const data: PaginatedResponse<Market> = await response.json()

      setMarkets(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch markets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [query, selectedState, selectedProducts, selectedPaymentMethods, selectedDay, sortBy, page])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedState) params.set('state', selectedState)
    if (selectedProducts.length > 0) params.set('products', selectedProducts.join(','))
    if (selectedPaymentMethods.length > 0)
      params.set('payment_methods', selectedPaymentMethods.join(','))
    if (selectedDay) params.set('day', selectedDay)
    if (sortBy) params.set('sort', sortBy)

    router.replace(`/search?${params}`, { scroll: false })
  }, [query, selectedState, selectedProducts, selectedPaymentMethods, selectedDay, sortBy, router])

  // Fetch on filter change
  useEffect(() => {
    fetchMarkets()
  }, [fetchMarkets])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      setQuery(q)
      setPage(1)
    }, 300),
    []
  )

  const clearFilters = () => {
    setSelectedState(undefined)
    setSelectedProducts([])
    setSelectedPaymentMethods([])
    setSelectedDay(undefined)
    setPage(1)
  }

  const hasFilters =
    selectedState ||
    selectedProducts.length > 0 ||
    selectedPaymentMethods.length > 0 ||
    selectedDay

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Search Farmers Markets
          </h1>
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchBar
                defaultValue={query}
                onSearch={debouncedSearch}
                placeholder="Search by name, city, or state..."
                showLocationButton={false}
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {hasFilters && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Filters
                selectedState={selectedState}
                selectedProducts={selectedProducts}
                selectedPaymentMethods={selectedPaymentMethods}
                selectedDay={selectedDay}
                onStateChange={(state) => {
                  setSelectedState(state)
                  setPage(1)
                }}
                onProductsChange={(products) => {
                  setSelectedProducts(products)
                  setPage(1)
                }}
                onPaymentMethodsChange={(methods) => {
                  setSelectedPaymentMethods(methods)
                  setPage(1)
                }}
                onDayChange={(day) => {
                  setSelectedDay(day)
                  setPage(1)
                }}
                onClear={clearFilters}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{total}</span>{' '}
                    {total === 1 ? 'market' : 'markets'} found
                    {query && (
                      <>
                        {' '}
                        for &quot;<span className="font-medium">{query}</span>&quot;
                      </>
                    )}
                  </>
                )}
              </p>

              {/* Sort */}
              <select
                value={sortBy || ''}
                onChange={(e) => {
                  setSortBy((e.target.value as 'rating' | 'name') || undefined)
                  setPage(1)
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Sort by: Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedState && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {selectedState}
                    <button onClick={() => setSelectedState(undefined)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedDay && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize">
                    {selectedDay}
                    <button onClick={() => setSelectedDay(undefined)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedProducts.map((product) => (
                  <span
                    key={product}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize"
                  >
                    {product}
                    <button
                      onClick={() =>
                        setSelectedProducts(selectedProducts.filter((p) => p !== product))
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {selectedPaymentMethods.map((method) => (
                  <span
                    key={method}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full uppercase"
                  >
                    {method}
                    <button
                      onClick={() =>
                        setSelectedPaymentMethods(
                          selectedPaymentMethods.filter((m) => m !== method)
                        )
                      }
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Market List */}
            {isLoading ? (
              <MarketListSkeleton count={6} />
            ) : markets.length > 0 ? (
              <>
                <MarketList markets={markets} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No markets found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your filters or search terms.
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
              <Filters
                selectedState={selectedState}
                selectedProducts={selectedProducts}
                selectedPaymentMethods={selectedPaymentMethods}
                selectedDay={selectedDay}
                onStateChange={(state) => {
                  setSelectedState(state)
                  setPage(1)
                }}
                onProductsChange={(products) => {
                  setSelectedProducts(products)
                  setPage(1)
                }}
                onPaymentMethodsChange={(methods) => {
                  setSelectedPaymentMethods(methods)
                  setPage(1)
                }}
                onDayChange={(day) => {
                  setSelectedDay(day)
                  setPage(1)
                }}
                onClear={clearFilters}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowMobileFilters(false)}
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
