// Content model for editorial guides. Guides are rich, hand-written articles
// (not generated from market data) — this is the editorial layer that gives the
// site topical depth for readers and search engines alike.

export interface GuideList {
  title?: string
  ordered?: boolean
  items: string[]
}

export interface GuideTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

export interface GuideSection {
  heading: string
  /** Optional stable anchor id; derived from the heading when omitted. */
  anchor?: string
  /** Body paragraphs, in order. */
  body?: string[]
  /** An optional bulleted or numbered list rendered after the body. */
  list?: GuideList
  /** An optional data table (e.g. a seasonal produce calendar). */
  table?: GuideTable
  /** An optional highlighted callout / pro-tip. */
  tip?: string
}

export interface GuideFaq {
  question: string
  answer: string
}

export interface GuideCta {
  heading: string
  text: string
  href: string
  label: string
}

export interface Guide {
  slug: string
  /** H1 and default SEO title. */
  title: string
  /** Overrides the SEO <title> when the H1 would be too long/short. */
  metaTitle?: string
  /** Meta description and social summary. */
  description: string
  /** Short category label shown on cards and breadcrumbs. */
  category: string
  /** A single emoji used as a lightweight hero glyph. */
  emoji: string
  /** Estimated reading time in minutes. */
  readingTime: number
  /** ISO date (YYYY-MM-DD) the guide was last reviewed. */
  updated: string
  /** Opening paragraphs shown before the first section. */
  intro: string[]
  sections: GuideSection[]
  faqs?: GuideFaq[]
  /** Slugs of related guides to cross-link. */
  related?: string[]
  /** Optional closing call-to-action. */
  cta?: GuideCta
}
