import type { Guide } from '../types'

export const marketBagsGuide: Guide = {
  slug: 'best-farmers-market-bags',
  title: 'The Best Farmers Market Bags, Totes, and Baskets',
  metaTitle: 'Best Farmers Market Bags, Totes & Baskets',
  description:
    'What to bring to carry a farmers market haul home: mesh produce bags, a sturdy tote or basket, a cooler bag for meat and eggs, and a cart for big trips.',
  category: 'Getting Started',
  emoji: '🧺',
  readingTime: 6,
  updated: '2026-10-30',
  intro: [
    'A weekly market trip adds up fast. Two pounds of tomatoes, a squash, a dozen eggs, a jar of honey, and a bunch of greens weigh more than most people expect, and a thin plastic bag gives out halfway back to the car. Vendors often have only a few bags to hand out, and some don’t have any.',
    'You don’t need much to carry a haul well. A few produce bags, one sturdy bag with a flat bottom, and something cold for meat and eggs cover most trips. This guide covers what works and why.',
  ],
  sections: [
    {
      heading: 'What makes a good market bag',
      body: [
        'The best market bags share four things. A wide, flat base keeps peaches and tomatoes from rolling into a crushed pile at the bottom. Long handles go over your shoulder, which leaves your hands free to pay and taste samples. A stiff or structured body stands open while vendors load it. And the bag should be washable, because berries leak and greens drip.',
      ],
      list: {
        title: 'Before you buy, check for',
        items: [
          'A flat base at least as wide as a quart of berries.',
          'Shoulder-length handles, not just short hand straps.',
          'Material you can wipe down or wash.',
          'A size you can actually carry full. Heavier is not better if it ends up too heavy to lift.',
        ],
      },
    },
    {
      heading: 'Mesh produce bags for loose fruit and vegetables',
      gear: ['produceBags'],
      body: [
        'Loose produce such as green beans, cherry tomatoes, apples, and mushrooms needs its own small bag. Reusable mesh bags do the job of the flimsy plastic ones and last for years. Because they are see-through, a vendor can weigh what’s inside without unpacking it. The mesh also lets greens breathe, so they don’t sweat on the ride home.',
      ],
    },
    {
      heading: 'A sturdy tote or basket to carry it all',
      gear: ['juteTote', 'marketTote', 'pocketTote'],
      body: [
        'Your main bag does the heavy lifting. Jute and heavy canvas are the classic choices because they hold their shape and survive a wet day. A stiff jute tote stands open on the ground while you shop. A canvas tote with a long strap is easier to carry for a long walk. Outside pockets are useful for the things that should stay upright, like a jar of honey, a bottle of cider, or a carton of eggs.',
        'If you like a basket, choose one with handles long enough for your shoulder or forearm. A basket protects soft fruit well, but it is harder to carry for long once it is full.',
      ],
    },
    {
      heading: 'An insulated cooler bag for meat, dairy, and eggs',
      gear: ['coolerBag'],
      body: [
        'If you buy meat, fish, cheese, butter, or eggs, bring a cooler bag, especially in summer. A car parked in the sun gets hot quickly, and perishables should not sit warm for long. Add an ice pack if you will run other errands before going home. A cooler bag also protects berries and salad greens, which wilt fast in heat.',
      ],
    },
    {
      heading: 'A rolling cart or wagon for big hauls',
      gear: ['rollingCart', 'wagon'],
      body: [
        'For bulk buying, such as canning tomatoes in August, a box of apples in the fall, flats of spring plants, or pumpkins in October, wheels beat carrying. A narrow rolling crate fits through a crowded market aisle and folds flat in the trunk. A folding wagon carries far more, which matters on a big lot or a long walk from parking.',
        'Busy markets can be tight, and a few ask shoppers to leave wagons at the edge during peak hours. If your market is crowded, go early or use the narrower cart.',
      ],
    },
    {
      heading: 'How to pack your haul so nothing gets crushed',
      list: {
        ordered: true,
        items: [
          'Shop for heavy, sturdy items last, or ask the vendor to hold them while you walk the market.',
          'Pack heavy things at the bottom: potatoes, squash, melons, onions, and jars.',
          'Put soft things on top: berries, peaches, tomatoes, and herbs.',
          'Keep eggs in their carton and upright, in a pocket or on top.',
          'Keep meat, dairy, and fish together in the cooler bag, away from produce.',
          'Get greens and herbs into the fridge first when you get home.',
        ],
      },
      tip: 'Ask berry vendors to keep berries in their cardboard pint or quart box. Berries carry and store best in the container they were picked into.',
    },
    {
      heading: 'A simple kit for every kind of trip',
      table: {
        caption: 'Mix and match. Most shoppers need only the first row most weeks.',
        headers: ['Trip', 'What to bring'],
        rows: [
          ['Quick weekly shop', '3–4 mesh produce bags and one sturdy tote'],
          ['Meat, cheese, or eggs on the list', 'Add an insulated cooler bag (and an ice pack in summer)'],
          ['Big summer haul', 'Tote, cooler bag, and a rolling cart'],
          ['Canning, apple, or pumpkin run', 'A folding wagon and a cooler bag'],
        ],
      },
    },
  ],
  faqs: [
    {
      question: 'Do farmers markets give you bags?',
      answer:
        'Some vendors have a few plastic or paper bags, but many don’t, and some cities restrict single-use bags. Bringing your own is the safe choice and makes checkout faster for everyone.',
    },
    {
      question: 'Are reusable mesh produce bags worth it?',
      answer:
        'Yes, if you shop regularly. They keep loose produce together, let vendors weigh items without unpacking, let greens breathe, and replace dozens of flimsy plastic bags over a season.',
    },
    {
      question: 'Can I bring a wagon to a farmers market?',
      answer:
        'Most markets allow wagons and carts. Very crowded markets may ask you to leave them at the edge during peak hours, so check the market’s rules or go early if it gets busy.',
    },
    {
      question: 'What size bag do I need for a farmers market?',
      answer:
        'One large tote with a flat base plus a few small produce bags covers a typical weekly trip for a household. Add a cooler bag for meat, dairy, or eggs, and wheels for bulk purchases.',
    },
  ],
  related: ['beginners-guide', 'storing-produce', 'how-to-store-fresh-herbs'],
  cta: {
    heading: 'Pack your bags and find a market',
    text: 'Look up hours, what’s sold, and accepted payments for farmers markets near you.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
