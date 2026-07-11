import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for FarmersMarkets.io — how we collect, use, and protect your information, including our use of cookies and third-party advertising such as Google AdSense.',
  alternates: {
    canonical: 'https://www.farmersmarkets.io/privacy',
  },
}

const LAST_UPDATED = 'June 7, 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10 text-gray-700 leading-relaxed">
          <section>
            <p>
              FarmersMarkets.io (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) operates the website{' '}
              <Link href="/" className="text-green-600 hover:text-green-700">
                farmersmarkets.io
              </Link>{' '}
              (the &ldquo;Service&rdquo;). This Privacy Policy explains what
              information we collect, how we use it, and the choices you have. By
              using the Service, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Information you provide.</strong> When you create an
                account, leave a review, save a favorite, or submit a market, we
                collect the information you choose to share, such as your email
                address and any content you post.
              </li>
              <li>
                <strong>Usage and log data.</strong> Like most websites, we
                automatically receive information your browser sends, such as
                your IP address, browser type, device information, pages
                visited, and the dates and times of your visits.
              </li>
              <li>
                <strong>Location data.</strong> If you use the &ldquo;Near
                Me&rdquo; feature, your browser may ask for permission to share
                your approximate location. This is used only to show nearby
                markets and is not stored on our servers.
              </li>
              <li>
                <strong>Cookies and similar technologies.</strong> We and our
                partners use cookies and similar technologies as described
                below.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Information
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>To provide, operate, and maintain the Service.</li>
              <li>To authenticate you and keep your account secure.</li>
              <li>
                To remember your preferences, favorites, and submitted content.
              </li>
              <li>
                To understand how the Service is used so we can improve it.
              </li>
              <li>To display relevant advertising that helps keep the Service free.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cookies and Web Beacons
            </h2>
            <p className="mb-4">
              Cookies are small data files stored on your device. We use them to
              keep you signed in, remember your settings, and measure traffic.
              Our advertising and analytics partners may also place cookies or
              web beacons to collect information about your visits to this and
              other websites. You can instruct your browser to refuse cookies or
              to indicate when a cookie is being sent; however, some parts of
              the Service may not function properly without them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Advertising and Google AdSense
            </h2>
            <div className="space-y-4">
              <p>
                We use third-party advertising companies, including{' '}
                <strong>Google AdSense</strong>, to serve ads when you visit the
                Service. These companies may use information about your visits to
                this and other websites in order to provide advertisements about
                goods and services that may interest you.
              </p>
              <p>
                Third-party vendors, including Google, use cookies to serve ads
                based on your prior visits to this website or other websites.
                Google&rsquo;s use of advertising cookies enables it and its
                partners to serve ads to you based on your visit to our site
                and/or other sites on the Internet.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  You may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    Google Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can opt out of a third-party vendor&rsquo;s use of cookies
                  for personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    www.aboutads.info/choices
                  </a>
                  .
                </li>
                <li>
                  For more information about how Google uses data when you use
                  our partners&rsquo; sites or apps, see{' '}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    Google&rsquo;s Privacy &amp; Terms
                  </a>
                  .
                </li>
              </ul>
              <p>
                Users in the European Economic Area, the United Kingdom, and
                other regions with applicable laws will be asked for consent
                before personalized ads or non-essential cookies are used, in
                accordance with Google&rsquo;s EU user consent policy.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Services
            </h2>
            <p>
              We rely on trusted third-party providers to operate the Service,
              including hosting, authentication and database services
              (Supabase), mapping and geolocation providers, and analytics and
              advertising providers (such as Google). These providers process
              data only as needed to perform their services and are bound by
              their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Choices and Rights
            </h2>
            <ul className="list-disc pl-6 space-y-3">
              <li>You can access, update, or delete your account information at any time.</li>
              <li>You can disable cookies through your browser settings.</li>
              <li>You can opt out of personalized advertising using the links above.</li>
              <li>
                Depending on where you live, you may have additional rights to
                access, correct, or delete your personal data. To make a
                request, contact us using the details below.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from loss,
              theft, misuse, and unauthorized access. However, no method of
              transmission over the Internet or electronic storage is completely
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Children&rsquo;s Privacy
            </h2>
            <p>
              The Service is not directed to children under the age of 13, and
              we do not knowingly collect personal information from children. If
              you believe a child has provided us with personal information,
              please contact us and we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will post
              the revised version on this page and update the &ldquo;Last
              updated&rdquo; date above. Your continued use of the Service after
              changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact
              us at{' '}
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
