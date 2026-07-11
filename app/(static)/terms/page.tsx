import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for FarmersMarkets.io — the rules and conditions that govern your use of our farmers market directory.',
  alternates: {
    canonical: 'https://www.farmersmarkets.io/terms',
  },
}

const LAST_UPDATED = 'June 7, 2026'

export default function TermsOfServicePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10 text-gray-700 leading-relaxed">
          <section>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
              and use of FarmersMarkets.io (the &ldquo;Service&rdquo;). By
              accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Use of the Service
            </h2>
            <p>
              We grant you a personal, non-exclusive, non-transferable, revocable
              license to access and use the Service for your own non-commercial
              use, subject to these Terms. You agree not to misuse the Service,
              including by scraping data at scale, attempting to disrupt the
              Service, or using it for any unlawful purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Accounts
            </h2>
            <p>
              Some features require an account. You are responsible for
              safeguarding your login credentials and for any activity that
              occurs under your account. You agree to provide accurate
              information and to keep it up to date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User-Submitted Content
            </h2>
            <p>
              You may submit content such as reviews, ratings, and market
              listings. You retain ownership of your content, but you grant us a
              worldwide, royalty-free license to host, display, and distribute it
              in connection with the Service. You are solely responsible for the
              content you submit, and you agree not to post anything that is
              false, misleading, unlawful, infringing, or offensive. We may
              remove content at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Accuracy of Information
            </h2>
            <p>
              Market information is compiled from public sources, including the
              USDA Farmers Market Directory, and from user submissions. While we
              strive for accuracy, market hours, locations, and details change
              frequently. We do not warrant that any information on the Service
              is accurate, complete, or current. Please confirm details directly
              with a market before visiting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p>
              The Service, including its design, text, graphics, and software, is
              owned by FarmersMarkets.io and protected by intellectual property
              laws. The FarmersMarkets.io name and logo are our trademarks. You
              may not copy, modify, or create derivative works from the Service
              without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Third-Party Links and Advertising
            </h2>
            <p>
              The Service may contain links to third-party websites and may
              display third-party advertising, including ads served by Google
              AdSense. We are not responsible for the content, products, or
              practices of any third-party sites or advertisers. Your
              interactions with third parties are solely between you and the
              third party. See our{' '}
              <Link href="/privacy" className="text-green-600 hover:text-green-700">
                Privacy Policy
              </Link>{' '}
              for details on advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis without warranties of any kind, whether
              express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, FarmersMarkets.io shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Changes to These Terms
            </h2>
            <p>
              We may revise these Terms from time to time. The most current
              version will always be posted on this page with an updated
              &ldquo;Last updated&rdquo; date. Your continued use of the Service
              after changes take effect constitutes acceptance of the revised
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the United States and the
              state in which we operate, without regard to conflict-of-law
              principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Contact Us
            </h2>
            <p>
              Questions about these Terms? Contact us at{' '}
              <a
                href="mailto:hello@farmersmarkets.io"
                className="text-green-600 hover:text-green-700"
              >
                hello@farmersmarkets.io
              </a>{' '}
              or through our{' '}
              <Link href="/contact" className="text-green-600 hover:text-green-700">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
