'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { STATE_NAMES, DAYS_OF_WEEK, formatDay } from '@/lib/utils'

interface FiltersProps {
  selectedState?: string
  selectedProducts: string[]
  selectedPaymentMethods: string[]
  selectedDay?: string
  onStateChange: (state: string | undefined) => void
  onProductsChange: (products: string[]) => void
  onPaymentMethodsChange: (methods: string[]) => void
  onDayChange: (day: string | undefined) => void
  onClear: () => void
}

const PRODUCTS = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'meat', label: 'Meat' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'honey', label: 'Honey' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'baked', label: 'Baked Goods' },
  { value: 'prepared', label: 'Prepared Foods' },
  { value: 'crafts', label: 'Crafts' },
]

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'snap', label: 'SNAP/EBT' },
  { value: 'wic', label: 'WIC' },
]

export function Filters({
  selectedState,
  selectedProducts,
  selectedPaymentMethods,
  selectedDay,
  onStateChange,
  onProductsChange,
  onPaymentMethodsChange,
  onDayChange,
  onClear,
}: FiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const hasFilters =
    selectedState ||
    selectedProducts.length > 0 ||
    selectedPaymentMethods.length > 0 ||
    selectedDay

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      onProductsChange(selectedProducts.filter((p) => p !== product))
    } else {
      onProductsChange([...selectedProducts, product])
    }
  }

  const togglePaymentMethod = (method: string) => {
    if (selectedPaymentMethods.includes(method)) {
      onPaymentMethodsChange(selectedPaymentMethods.filter((m) => m !== method))
    } else {
      onPaymentMethodsChange([...selectedPaymentMethods, method])
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* State Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('state')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-700">State</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'state' ? 'rotate-180' : ''
              }`}
          />
        </button>
        {expandedSection === 'state' && (
          <div className="mt-3 max-h-48 overflow-y-auto">
            <select
              value={selectedState || ''}
              onChange={(e) => onStateChange(e.target.value || undefined)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All States</option>
              {Object.entries(STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedState && expandedSection !== 'state' && (
          <span className="text-sm text-green-600 mt-1 block">
            {STATE_NAMES[selectedState]}
          </span>
        )}
      </div>

      {/* Day Filters */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('day')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-700">Day Open</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'day' ? 'rotate-180' : ''
              }`}
          />
        </button>
        {expandedSection === 'day' && (
          <div className="mt-3 space-y-2">
            {DAYS_OF_WEEK.map((day) => (
              <label key={day} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="day"
                  checked={selectedDay === day}
                  onChange={() => onDayChange(selectedDay === day ? undefined : day)}
                  className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">{formatDay(day)}</span>
              </label>
            ))}
          </div>
        )}
        {selectedDay && expandedSection !== 'day' && (
          <span className="text-sm text-green-600 mt-1 block">
            {formatDay(selectedDay as typeof DAYS_OF_WEEK[number])}
          </span>
        )}
      </div>

      {/* Products Filter */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('products')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-700">Products</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'products' ? 'rotate-180' : ''
              }`}
          />
        </button>
        {expandedSection === 'products' && (
          <div className="mt-3 space-y-2">
            {PRODUCTS.map((product) => (
              <label key={product.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.value)}
                  onChange={() => toggleProduct(product.value)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">{product.label}</span>
              </label>
            ))}
          </div>
        )}
        {selectedProducts.length > 0 && expandedSection !== 'products' && (
          <span className="text-sm text-green-600 mt-1 block">
            {selectedProducts.length} selected
          </span>
        )}
      </div>

      {/* Payment Methods Filter */}
      <div>
        <button
          onClick={() => toggleSection('payment')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-700">Payment Methods</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${expandedSection === 'payment' ? 'rotate-180' : ''
              }`}
          />
        </button>
        {expandedSection === 'payment' && (
          <div className="mt-3 space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label key={method.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPaymentMethods.includes(method.value)}
                  onChange={() => togglePaymentMethod(method.value)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">{method.label}</span>
              </label>
            ))}
          </div>
        )}
        {selectedPaymentMethods.length > 0 && expandedSection !== 'payment' && (
          <span className="text-sm text-green-600 mt-1 block">
            {selectedPaymentMethods.length} selected
          </span>
        )}
      </div>
    </div>
  )
}
