import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { ADSENSE_CLIENT_ID, ADSENSE_SCRIPT_SRC } from "@/lib/adsense";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FarmersMarkets.io - Find Local Farmers Markets Near You",
    template: "%s | FarmersMarkets.io",
  },
  description:
    "Discover 8,000+ farmers markets across the United States. Find fresh, local produce, artisan goods, hours, directions, and reviews. Search by state, city, or find markets near you.",
  keywords: [
    "farmers market",
    "farmers market near me",
    "local farmers market",
    "fresh produce",
    "local produce",
    "organic food",
    "farm fresh",
    "farmers market directory",
    "local food",
    "buy local",
    "farm to table",
    "fresh vegetables",
    "fresh fruits",
    "artisan food",
    "SNAP farmers market",
  ],
  authors: [{ name: "FarmersMarkets.io" }],
  creator: "FarmersMarkets.io",
  publisher: "FarmersMarkets.io",
  metadataBase: new URL("https://www.farmersmarkets.io"),
  // NOTE: no site-wide `alternates.canonical` here on purpose — a static value
  // in the root layout is inherited by every route and made all 4,300 pages
  // canonicalize to the homepage. Each page now sets its own self-referencing
  // canonical; pages without one self-canonicalize to their own URL by default.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.farmersmarkets.io",
    siteName: "FarmersMarkets.io",
    title: "FarmersMarkets.io - Find Local Farmers Markets Near You",
    description:
      "Discover 8,000+ farmers markets across the United States. Find fresh produce, hours, directions, and reviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmersMarkets.io - Find Local Farmers Markets Near You",
    description:
      "Discover 8,000+ farmers markets across the USA. Find fresh produce, hours & directions.",
    creator: "@farmersmarkets",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Food & Drink",
  verification: {
    google: "Md58xNR6UmA8giVrK2VU9M86wwq18i6C_CI48I8zp98",
  },
  other: {
    // Google AdSense site verification meta tag.
    "google-adsense-account": ADSENSE_CLIENT_ID,
  },
};

// JSON-LD Structured Data for Organization and WebSite
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.farmersmarkets.io/#organization",
      name: "FarmersMarkets.io",
      url: "https://www.farmersmarkets.io",
      logo: {
        "@type": "ImageObject",
        url: "https://www.farmersmarkets.io/icon.png",
      },
      sameAs: [],
      description: "The comprehensive directory of farmers markets across the United States.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.farmersmarkets.io/#website",
      url: "https://www.farmersmarkets.io",
      name: "FarmersMarkets.io",
      description: "Find local farmers markets near you",
      publisher: {
        "@id": "https://www.farmersmarkets.io/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.farmersmarkets.io/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google AdSense loader — required for ad serving and AdSense site review.
            Plain <script> so it is server-rendered into the raw <head> exactly as
            AdSense's crawler expects. */}
        <script
          async
          src={ADSENSE_SCRIPT_SRC}
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen flex-col">
          <Header user={user ? { id: user.id, email: user.email || "" } : null} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
