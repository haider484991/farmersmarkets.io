import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, BreadcrumbSchema } from '@/components/layout/Breadcrumbs'
import { GuideArticle } from '@/components/guides/GuideArticle'
import { getGuide, getGuideSlugs, getRelatedGuides } from '@/lib/guides'
import { SITE_URL } from '@/lib/utils'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}

  const title = guide.metaTitle || guide.title
  return {
    title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title,
      description: guide.description,
      type: 'article',
      url: `/guides/${guide.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: guide.description,
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const related = getRelatedGuides(guide)
  const url = `${SITE_URL}/guides/${guide.slug}`

  const breadcrumbs = [
    { label: 'Guides', href: '/guides' },
    { label: guide.title },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updated,
    dateModified: guide.updated,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Organization',
      name: 'FarmersMarkets.io',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FarmersMarkets.io',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
  }

  const faqSchema =
    guide.faqs && guide.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <GuideArticle guide={guide} related={related} />
    </div>
  )
}
