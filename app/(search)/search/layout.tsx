import type { Metadata } from 'next'

/**
 * The search page is a client component, so its robots directive has to live in
 * a layout. Every filter combination (q, state, products, payment_methods, day,
 * sort) produces a distinct crawlable URL over the same 8,675 markets, which is
 * unbounded crawl waste and reads as thin duplicate content. Measured
 * 2026-08-19: /search had 0 clicks and 0 impressions across 91 days, so nothing
 * is lost by keeping it out of the index. `follow` is deliberate — the links out
 * to individual market pages should still be crawled.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
