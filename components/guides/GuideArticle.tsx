import Link from 'next/link'
import { ArrowRight, Lightbulb, Clock, CalendarDays } from 'lucide-react'
import type { Guide } from '@/lib/guides'
import { InContentAd } from '@/components/ads/InContentAd'

function anchorId(text: string, fallback: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base || fallback
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface GuideArticleProps {
  guide: Guide
  related: Guide[]
}

export function GuideArticle({ guide, related }: GuideArticleProps) {
  // Drop a single in-content ad slot after the second section (invisible until
  // a slot id is configured post-approval).
  const adAfter = Math.min(1, guide.sections.length - 1)

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <header className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-green-700 bg-green-50 rounded-full px-3 py-1">
          {guide.category}
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{guide.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {guide.readingTime} min read
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            Updated {formatDate(guide.updated)}
          </span>
        </div>
      </header>

      {/* Intro */}
      <div className="prose prose-lg prose-gray max-w-none">
        {guide.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Sections */}
      {guide.sections.map((section, si) => {
        const id = section.anchor || anchorId(section.heading, `section-${si + 1}`)
        return (
          <div key={si}>
            <section className="mt-10 scroll-mt-24" id={id}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>

              <div className="prose prose-lg prose-gray max-w-none">
                {section.body?.map((p, pi) => (
                  <p key={pi}>{p}</p>
                ))}
              </div>

              {section.list && (
                <div className="mt-4">
                  {section.list.title && (
                    <p className="font-semibold text-gray-900 mb-2">{section.list.title}</p>
                  )}
                  {section.list.ordered ? (
                    <ol className="list-decimal list-outside pl-5 space-y-2 text-gray-700 marker:text-green-600">
                      {section.list.items.map((it, ii) => (
                        <li key={ii} className="pl-1">{it}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700 marker:text-green-500">
                      {section.list.items.map((it, ii) => (
                        <li key={ii} className="pl-1">{it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {section.table && (
                <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-900">
                      <tr>
                        {section.table.headers.map((h, hi) => (
                          <th key={hi} className="px-4 py-3 font-semibold whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {section.table.rows.map((row, ri) => (
                        <tr key={ri} className="text-gray-700">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2.5 align-top">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {section.table.caption && (
                    <p className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                      {section.table.caption}
                    </p>
                  )}
                </div>
              )}

              {section.tip && (
                <div className="mt-5 flex gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
                  <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-900 m-0">{section.tip}</p>
                </div>
              )}
            </section>

            {si === adAfter && <InContentAd />}
          </div>
        )
      })}

      {/* FAQ */}
      {guide.faqs && guide.faqs.length > 0 && (
        <section className="mt-14 scroll-mt-24" id="faq">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {guide.faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-1 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {guide.cta && (
        <section className="mt-14 rounded-2xl bg-green-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white">{guide.cta.heading}</h2>
          <p className="mt-3 text-green-50 max-w-xl mx-auto">{guide.cta.text}</p>
          <Link
            href={guide.cta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-green-700 hover:bg-green-50 transition-colors"
          >
            {guide.cta.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}

      {/* Related guides */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="block rounded-xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="text-2xl">{g.emoji}</div>
                <h3 className="mt-2 font-semibold text-gray-900 leading-snug">{g.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
