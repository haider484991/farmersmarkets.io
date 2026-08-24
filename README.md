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

The AdSense loader script, the `google-adsense-account` meta tag and
`public/ads.txt` are already wired up for publisher `ca-pub-6873688003145340`.
What is *not* automatic is the ad units themselves — approval alone does not
put ads on the page.

### Fastest path: Auto ads

Auto ads need no slot IDs and no deploy — the loader script in
`app/layout.tsx` is all they require. Turn them on in **AdSense → Ads → By
site → farmersmarkets.io → Edit**, and Google places units itself. Placement
control is poor and they can be intrusive, so treat this as a way to confirm
serving works, then move to the manual units below.

### Manual units

1. In AdSense go to **Ads → By ad unit** and create three units:

   | Unit type            | Used for                              | Paste into    |
   | -------------------- | ------------------------------------- | ------------- |
   | Display ad           | Between page sections                 | `display`     |
   | In-article ad        | Inside guide/article body copy        | `article`     |
   | In-feed ad           | Inside the market listing grid        | `inFeed`      |

2. Copy each unit's numeric `data-ad-slot` value out of the snippet Google
   shows you, and paste it into `SLOT_IDS` in `lib/adsense.ts`.
3. Deploy. Any placement whose slot is still `''` renders nothing, so you can
   turn units on one at a time.

Slot IDs can also come from `NEXT_PUBLIC_ADSENSE_DISPLAY_SLOT`,
`NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT` and `NEXT_PUBLIC_ADSENSE_INFEED_SLOT`, but
the constants in `lib/adsense.ts` win. Prefer the constants — a stale env var
on the host has silently broken AdSense here before.

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

- draw a dashed outline wherever a placement sits, so a missing placement can
  be told apart from a unit that simply isn't filling, and
- add `data-adtest="on"` to every unit, which makes AdSense serve test ads.
  Test ads earn nothing but confirm the whole pipeline works.

### If ads still don't appear

- New units take a few hours (sometimes up to ~48h) to start filling.
- Check **AdSense → Policy centre** for "Ad serving has been limited".
- Repeatedly loading your own ads looks like invalid traffic; Google may serve
  blanks to your own IP. Use `data-adtest` above rather than reloading live ads.
- Ad blockers, Brave shields and DNS-level blockers hide units completely.
  Check in a clean browser profile with no extensions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
