This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Google AdSense

Publisher `ca-pub-6873688003145340`. The loader script, the
`google-adsense-account` meta tag, `public/ads.txt` and three live ad units are
all wired up.

### Ad units

Slot IDs live in `SLOT_IDS` in `lib/adsense.ts`:

| Placement | Slot         | AdSense unit type            |
| --------- | ------------ | ---------------------------- |
| `display` | `4993028680` | Display, responsive          |
| `article` | `6173982485` | In-article, fluid            |
| `inFeed`  | `3547819147` | In-feed, fluid               |

The in-feed unit also needs `ADSENSE_INFEED_LAYOUT_KEY` — AdSense generates the
layout key alongside the slot ID and the two only work as a pair, so replace
both together if you rebuild that unit. A placement whose slot is `''` renders
nothing, so units can be turned off one at a time.

Slot IDs can also come from `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT`,
`NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT` and `NEXT_PUBLIC_ADSENSE_INFEED_SLOT`, but
the constants in `lib/adsense.ts` win. Prefer the constants — a stale env var
on the host has silently broken AdSense here before.

### Geo blocking

Ads serve everywhere **except** the locations listed in `AD_BLOCKED_LOCATIONS`
in `lib/ads-geo.ts`, currently Dallas, Texas. Edit that array to change it;
`region` and `country` are both required, since they are what separate Dallas,
Texas from Dallas, Georgia and Dallas, Oregon.

The check deliberately does not happen while rendering the page. Market, state
and city pages are CDN-cached (`s-maxage`, below), so whichever region
requested a page first would have its decision cached and served to everyone
else. Instead:

1. `/api/ads/geo` resolves the visitor's location from Vercel's
   `x-vercel-ip-*` headers and answers `no-store`.
2. `AdUnit` waits on that answer before calling `adsbygoogle.push()`. A unit
   that is never pushed makes no ad request and records no impression — this
   is what actually enforces the block.
3. `AdFrame` hides the surrounding "Advertisement" label and spacing too.

That route lives three segments deep (`/api/ads/geo`, not `/api/ads-geo`) on
purpose: the `/:state/:city` rule in `next.config.ts` matches *any* two-segment
path and would otherwise give it a day-long CDN cache. Regex guards such as
`/:state((?!api$)[^/]+)` do not help — Next 16's path-to-regexp ignores custom
param patterns.

Two limits worth knowing:

- **IP geolocation is approximate.** A Dallas visitor on a VPN, or on mobile
  data routed through another city, will not be caught. Suburbs report their
  own names — Plano, Irving, Richardson, Garland — so add them to
  `AD_BLOCKED_LOCATIONS` if you meant the metro rather than the city proper.
- **Unknown locations are allowed.** Local development and any non-Vercel host
  send no geo headers, and a failed `/api/ads/geo` request falls back to
  allowing ads. Blocking on failure would take down every ad on the site
  rather than just the ones in Dallas.

### Where the ads are

| Page                   | Placements                                        |
| ---------------------- | ------------------------------------------------- |
| Home                   | display, between the two content sections         |
| `/[state]`             | in-feed in the grid, display above the SEO copy   |
| `/[state]/[city]`      | in-feed in the grid, display above the SEO copy   |
| `/market/[slug]`       | display after the listing and before the hub links |
| `/guides/[slug]`       | in-content, after the first section               |

`/search` and `/near-me` are deliberately left out: AdSense policy does not
allow content ads on search results pages. Signed-in pages (dashboard,
favorites) are ad-free — `MarketList` only renders an in-feed unit when a page
passes `showAds`.

### Checking your work

Set `NEXT_PUBLIC_ADS_DEBUG=1` (never in production) to:

- draw a dashed outline wherever a placement sits if its slot is unset, so a
  missing placement can be told apart from a unit that simply isn't filling, and
- add `data-adtest="on"` to every unit, which makes AdSense serve test ads.
  Test ads earn nothing but confirm the whole pipeline works.

### If ads still don't appear

- New units take a few hours (sometimes up to ~48h) to start filling.
- Check **AdSense → Policy centre** for "Ad serving has been limited".
- Repeatedly loading your own ads looks like invalid traffic; Google may serve
  blanks to your own IP. Use `data-adtest` above rather than reloading live ads.
- Ad blockers, Brave shields and DNS-level blockers hide units completely.
  Check in a clean browser profile with no extensions.
- If you are testing from Dallas, this is working as configured. Check
  `/api/ads/geo` in the browser — `{"decision":"block"}` means the geo rule
  fired, not that AdSense is broken.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
