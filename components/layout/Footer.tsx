import Link from 'next/link'
import { MapPin } from 'lucide-react'

const footerLinks = {
  directory: [
    { name: 'Browse by State', href: '/states' },
    { name: 'Near Me', href: '/near-me' },
    { name: 'Search Markets', href: '/search' },
    { name: 'Add a Market', href: '/add-market' },
  ],
  popular: [
    { name: 'California', href: '/california' },
    { name: 'New York', href: '/new-york' },
    { name: 'Texas', href: '/texas' },
    { name: 'Florida', href: '/florida' },
    { name: 'Pennsylvania', href: '/pennsylvania' },
    { name: 'Illinois', href: '/illinois' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-8 w-8 text-green-500" />
              <span className="text-xl font-bold text-white">
                Farmers<span className="text-green-500">Markets</span>.io
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your complete guide to farmers markets across the United States.
              Find fresh, local produce near you.
            </p>
            <p className="text-xs text-gray-500">
              Data sourced from USDA Farmers Market Directory
            </p>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Directory
            </h3>
            <ul className="space-y-2">
              {footerLinks.directory.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular States
            </h3>
            <ul className="space-y-2">
              {footerLinks.popular.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} FarmersMarkets.io. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/sitemap.xml"
                className="text-sm text-gray-500 hover:text-gray-400"
              >
                Sitemap
              </Link>
              <span className="text-gray-600">|</span>
              <a
                href="https://www.ams.usda.gov/local-food-directories/farmersmarkets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-400"
              >
                USDA Data
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
