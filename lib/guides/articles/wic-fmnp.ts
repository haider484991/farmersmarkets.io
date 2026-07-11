import type { Guide } from '../types'

export const wicFmnpGuide: Guide = {
  slug: 'wic-fmnp',
  title: 'WIC & the Farmers Market Nutrition Program (FMNP), Explained',
  metaTitle: 'WIC at Farmers Markets: The FMNP Program Explained',
  description:
    'How WIC and senior benefits work at farmers markets through the Farmers Market Nutrition Program (FMNP) — who qualifies, what you can buy, and how to use the vouchers.',
  category: 'Food Assistance',
  emoji: '🧾',
  readingTime: 6,
  updated: '2026-07-01',
  intro: [
    'SNAP gets most of the attention, but it is not the only benefit you can use at a farmers market. Through the Farmers Market Nutrition Program (FMNP), families on WIC and many low-income seniors receive dedicated benefits to spend on fresh, local fruits and vegetables. It is essentially free produce money aimed specifically at farmers markets — and a lot of eligible people never use it simply because they do not know it exists.',
    'This guide explains what FMNP is, who qualifies, what you can buy, and how to use the benefits at the market. Because it is administered state by state, the details vary, so confirm the specifics with your local WIC or aging office.',
  ],
  sections: [
    {
      heading: 'What is the FMNP?',
      body: [
        'The Farmers Market Nutrition Program is a federal program, run through state agencies, that provides benefits to buy fresh produce directly from farmers. There are two branches: the WIC FMNP, for participants in the WIC program, and the Senior FMNP, for eligible older adults. Both give recipients benefits — traditionally paper vouchers, and increasingly electronic — that can only be spent on approved fresh, unprocessed fruits, vegetables, and herbs at participating markets and farm stands.',
      ],
    },
    {
      heading: 'How FMNP differs from SNAP',
      body: [
        'It is easy to confuse the two, but they are separate programs with different rules.',
      ],
      list: {
        items: [
          'SNAP covers a broad range of groceries; FMNP covers only fresh fruits, vegetables, and cut herbs.',
          'SNAP benefits are substantial and monthly; FMNP benefits are a smaller seasonal amount (often a set number of dollars per year).',
          'SNAP works at grocery stores and many markets; FMNP works only at authorized farmers markets and farm stands.',
          'You can often use both — FMNP vouchers for produce and SNAP for the rest of your shopping.',
        ],
      },
      tip: 'FMNP and SNAP stack. Many shoppers use FMNP vouchers for fruits and vegetables and SNAP tokens for other eligible foods on the same trip.',
    },
    {
      heading: 'Who qualifies?',
      body: [
        'Eligibility runs through two existing programs:',
      ],
      list: {
        items: [
          'WIC FMNP: You generally qualify if you are already enrolled in WIC — that is, pregnant, postpartum, or breastfeeding people and children up to age five who meet income guidelines.',
          'Senior FMNP: You generally qualify if you are an older adult (commonly 60 and over) with a household income below a set threshold.',
        ],
      },
    },
    {
      heading: 'What you can buy',
      body: [
        'FMNP benefits are strictly for fresh, locally grown, unprocessed produce. That means fruits, vegetables, and fresh-cut herbs grown by the farmer.',
      ],
      list: {
        title: 'Not eligible with FMNP',
        items: [
          'Processed or prepared items — jams, baked goods, cider, dried fruit, or nuts.',
          'Non-produce foods like honey, eggs, meat, cheese, or bread.',
          'Potted plants, flowers, and non-food goods.',
        ],
      },
    },
    {
      heading: 'How to get and use FMNP benefits',
      body: [
        'The process varies by state, but it generally looks like this:',
      ],
      list: {
        ordered: true,
        items: [
          'Contact your local WIC clinic (for WIC FMNP) or your area agency on aging or senior center (for Senior FMNP) to ask whether benefits are available and how they are distributed.',
          'Receive your vouchers or electronic benefits, usually seasonally during the summer and fall.',
          'Find an authorized market or farm stand — not every vendor is approved, so look for FMNP or "we accept WIC/Senior Farmers Market checks" signs.',
          'Choose eligible fresh produce and pay with your vouchers at a participating farmer.',
          'Spend before the expiration date — FMNP benefits are seasonal and do not roll over.',
        ],
      },
      tip: 'Vouchers usually expire at the end of the season, so use them while summer and fall produce is abundant rather than saving them.',
    },
    {
      heading: 'How to find participating markets',
      body: [
        'Because only authorized farmers and markets can accept FMNP, it is worth checking ahead. Ask your WIC or senior office for a list of participating markets in your area, and look for signage at the market information booth. Many markets that accept SNAP also participate in FMNP, though not always, so confirm before you shop.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can you use WIC at farmers markets?',
      answer:
        'Often yes, through the WIC Farmers Market Nutrition Program (FMNP), which provides WIC participants with seasonal benefits to spend on fresh fruits, vegetables, and herbs at authorized markets. It is separate from regular WIC food benefits and from SNAP.',
    },
    {
      question: 'What is the difference between SNAP and FMNP?',
      answer:
        'SNAP covers a broad range of groceries and works at stores and many markets. FMNP is a smaller, seasonal benefit that can only be spent on fresh, unprocessed fruits, vegetables, and herbs at authorized farmers markets and farm stands. You can often use both together.',
    },
    {
      question: 'Who qualifies for the Senior Farmers Market Nutrition Program?',
      answer:
        'Eligibility is set by each state, but the Senior FMNP generally serves older adults (commonly age 60 and over) with household income below a set limit. Contact your area agency on aging or a local senior center to check availability and apply.',
    },
    {
      question: 'What can I buy with FMNP vouchers?',
      answer:
        'Only fresh, locally grown, unprocessed fruits, vegetables, and cut herbs. FMNP does not cover honey, eggs, meat, baked goods, jams, dried fruit, plants, or flowers.',
    },
  ],
  related: ['snap-ebt-farmers-markets', 'beginners-guide', 'seasonal-produce-guide'],
  cta: {
    heading: 'Find a market that accepts benefits',
    text: 'Browse markets by state and check listings for accepted payment methods before you visit.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
