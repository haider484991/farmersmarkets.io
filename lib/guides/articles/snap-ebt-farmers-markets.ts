import type { Guide } from '../types'

export const snapEbtGuide: Guide = {
  slug: 'snap-ebt-farmers-markets',
  title: 'How to Use SNAP/EBT at Farmers Markets',
  metaTitle: 'How to Use SNAP/EBT at Farmers Markets (Step-by-Step Guide)',
  description:
    'A step-by-step guide to using SNAP/EBT benefits at farmers markets, including how market tokens work and how to double your dollars with Double Up Food Bucks.',
  category: 'Food Assistance',
  emoji: '💳',
  readingTime: 7,
  updated: '2026-07-01',
  intro: [
    'Farmers markets are not just for shoppers paying cash — a large and growing number accept SNAP/EBT (formerly food stamps), and many will even stretch those benefits further through matching programs. If you receive SNAP, you can use it to buy fresh, local fruits, vegetables, meat, eggs, dairy, bread, and plants that produce food.',
    'The process is a little different from swiping at a grocery store, but it is simple once you have done it once. This guide explains exactly how it works, what you can and cannot buy, and how programs like Double Up Food Bucks can double your money on fresh produce.',
  ],
  sections: [
    {
      heading: 'Do farmers markets accept SNAP/EBT?',
      body: [
        'Many do, but not all. Whether a market accepts SNAP depends on whether it has registered with the USDA as a SNAP retailer and set up the equipment to process EBT cards. Larger markets and those in or near cities are most likely to participate, but plenty of smaller markets do too.',
        'The easiest way to check is to look at the market\'s listing before you go, or simply look for signs at the market information booth once you arrive. On this site, individual market pages note accepted payment methods, including SNAP/EBT where we have that information.',
      ],
      tip: 'When in doubt, head to the market manager\'s or information booth first. They handle EBT transactions and can point you to which vendors accept market tokens.',
    },
    {
      heading: 'How the token system works',
      body: [
        'Most farmers markets do not have a card reader at every stall. Instead, they use a central token or scrip system. Here is the typical flow:',
      ],
      list: {
        ordered: true,
        title: 'Step by step',
        items: [
          'Go to the market\'s information or manager booth and tell them you want to use SNAP/EBT.',
          'Tell them the dollar amount you want to spend. They swipe your EBT card for that amount.',
          'You receive that amount in market tokens, wooden coins, or paper scrip — usually in $1 or $5 denominations.',
          'Spend the tokens like cash at any participating vendor for SNAP-eligible food.',
          'Vendors give change back on cash purchases, but generally not on SNAP tokens, so spend close to the token amount.',
        ],
      },
    },
    {
      heading: 'What you can and cannot buy',
      body: [
        'SNAP rules at the market are the same as at the grocery store. Your benefits cover foods meant to be taken home and eaten.',
      ],
      list: {
        title: 'Eligible with SNAP/EBT',
        items: [
          'Fruits and vegetables',
          'Meat, poultry, and fish',
          'Dairy products and eggs',
          'Breads and baked goods',
          'Seeds and plants that produce food (for example, tomato or herb seedlings)',
        ],
      },
      tip: 'SNAP cannot be used for hot or ready-to-eat foods, non-food items like soap or flowers, or anything meant to be eaten at the market. Those require cash or a card.',
    },
    {
      heading: 'Double your dollars: matching programs',
      body: [
        'This is the part many shoppers do not know about. A large number of markets participate in nutrition-incentive programs that match your SNAP spending on fresh fruits and vegetables — effectively giving you free produce money.',
        'The best known is Double Up Food Bucks, which typically matches SNAP dollar-for-dollar up to a daily limit (often $10–$20). Spend $10 in SNAP tokens and you receive another $10 in tokens that can only be used on fruits and vegetables. Programs go by different names in different states — Market Match, Fresh Bucks, Healthy Bucks, and others — but the idea is the same.',
      ],
      list: {
        title: 'How to use a matching program',
        items: [
          'Ask at the information booth whether the market offers SNAP matching and what the daily limit is.',
          'Swipe your EBT card as usual to get your regular tokens.',
          'You will also receive matching tokens or coupons for produce, up to the daily cap.',
          'Use the matching tokens specifically on fresh fruits and vegetables.',
        ],
      },
    },
    {
      heading: 'A few practical tips',
      list: {
        items: [
          'Bring your EBT card and photo ID the first time in case the market asks.',
          'Arrive earlier in the day for the best selection, especially on popular produce.',
          'Ask about daily matching limits so you can plan your spending to capture the full match.',
          'Keep unused tokens — most markets let you use them on a future visit, though matching coupons often expire sooner.',
        ],
      },
    },
  ],
  faqs: [
    {
      question: 'Can I get cash back from SNAP tokens?',
      answer:
        'No. Vendors do not give cash change on SNAP tokens, and the tokens themselves cannot be exchanged for cash. Spend close to the token value, and save any leftover tokens for your next visit.',
    },
    {
      question: 'What is Double Up Food Bucks?',
      answer:
        'It is a nutrition-incentive program offered at many farmers markets that matches your SNAP spending on fresh fruits and vegetables, usually up to a daily limit. Spend $10 in SNAP and you may receive another $10 to spend on produce. Similar programs run under names like Market Match, Fresh Bucks, and Healthy Bucks.',
    },
    {
      question: 'Do all farmers markets take EBT?',
      answer:
        'No. A market must register as a SNAP retailer and set up EBT equipment to participate. Many do, especially larger and urban markets, but always check the market listing or ask at the information booth before you shop.',
    },
    {
      question: 'Can I use WIC at farmers markets too?',
      answer:
        'Often, yes — through a separate program called the Farmers Market Nutrition Program (FMNP). It works differently from SNAP and uses its own vouchers. See our WIC and FMNP guide for details.',
    },
  ],
  related: ['wic-fmnp', 'beginners-guide', 'seasonal-produce-guide'],
  cta: {
    heading: 'Find a SNAP-friendly market near you',
    text: 'Browse markets by state and check each listing for accepted payment methods, including SNAP/EBT.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
