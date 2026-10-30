import { Check, ShoppingBasket } from 'lucide-react'
import { GEAR, amazonUrl, type GearKey } from '@/lib/gear'
import { AmazonLink } from './AmazonLink'

interface GearPicksProps {
  heading: string
  intro?: string
  /** Plain reminders shown before the picks (cash, EBT card), not links. */
  notes?: string[]
  items: GearKey[]
  /** Reported with each click, e.g. "market" or "guide:storing-produce". */
  placement: string
  /** 'h3' when the block sits inside a guide section that already has an h2. */
  level?: 'h2' | 'h3'
  className?: string
}

/**
 * Amazon picks matched to the page. The affiliate disclosure sits inside the
 * block, next to the links, as Amazon's operating agreement asks.
 */
export function GearPicks({
  heading,
  intro,
  notes = [],
  items,
  placement,
  level = 'h2',
  className = '',
}: GearPicksProps) {
  const Heading = level
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <Heading className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
        <ShoppingBasket className="w-5 h-5 text-green-600" />
        {heading}
      </Heading>
      {intro && <p className="text-sm text-gray-600 mb-4">{intro}</p>}

      {notes.length > 0 && (
        <ul className="mb-4 space-y-1.5">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              {note}
            </li>
          ))}
        </ul>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((key) => {
          const g = GEAR[key]
          return (
            <li key={key} className="flex flex-col rounded-lg border border-green-100 bg-green-50/50 p-4">
              <p className="font-semibold text-gray-900 leading-snug">{g.name}</p>
              <p className="mt-1 flex-1 text-sm text-gray-600">{g.why}</p>
              <AmazonLink
                href={amazonUrl(g.asin)}
                product={key}
                placement={placement}
                className="mt-3 self-start rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                See it on Amazon
              </AmazonLink>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-xs text-gray-500">
        As an Amazon Associate, FarmersMarkets.io earns from qualifying purchases. Picks are ours;
        markets and vendors have no say in them.
      </p>
    </div>
  )
}
