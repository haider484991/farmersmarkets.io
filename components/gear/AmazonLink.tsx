'use client'

import { track } from '@vercel/analytics'
import type { ReactNode } from 'react'

interface AmazonLinkProps {
  href: string
  product: string
  /** Where the link sits, e.g. "market" or "guide:storing-produce". */
  placement: string
  className?: string
  children: ReactNode
}

/** An Amazon affiliate link that records an `affiliate_click` event in Vercel Web Analytics. */
export function AmazonLink({ href, product, placement, className, children }: AmazonLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      onClick={() => track('affiliate_click', { product, placement })}
    >
      {children}
    </a>
  )
}
