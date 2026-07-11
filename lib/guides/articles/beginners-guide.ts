import type { Guide } from '../types'

export const beginnersGuide: Guide = {
  slug: 'beginners-guide',
  title: "A Beginner's Guide to Shopping at Farmers Markets",
  metaTitle: "Farmers Market Tips: A Beginner's Guide to Shopping Smart",
  description:
    'New to farmers markets? Learn what to bring, when to arrive, how to pay, and simple etiquette so you shop with confidence and get the best of what local farms offer.',
  category: 'Getting Started',
  emoji: '🧺',
  readingTime: 6,
  updated: '2026-07-01',
  intro: [
    'Your first trip to a farmers market can feel a little different from the grocery store — there are no aisles, prices are not always on signs, and the selection changes every week. But that is exactly what makes markets great: the food is fresher, the people selling it usually grew it, and you can ask anything you want about how it was raised.',
    'This guide covers the practical basics so you can walk in like a regular: what to bring, when to go, how payment works, and a few unwritten rules that make the whole thing run smoothly.',
  ],
  sections: [
    {
      heading: 'What to bring',
      body: [
        'A little preparation makes the trip smoother. You do not need much, but a few items will save you hassle.',
      ],
      list: {
        title: 'Farmers market packing list',
        items: [
          'Reusable bags or a basket — many vendors have limited bags, and a sturdy tote handles heavy produce better.',
          'Cash in small bills — the single most useful thing to bring. Many vendors prefer cash and change for a $20 can be scarce early in the day.',
          'A cooler bag or ice pack if you are buying meat, dairy, or eggs and will not head straight home.',
          'Your EBT card if you use SNAP — most markets that accept it use a token system at the info booth.',
          'A rough idea of a few meals so you can shop with a plan but stay flexible.',
        ],
      },
      tip: 'Cash is king at markets. Bring a mix of ones and fives — you will move faster, and small vendors will appreciate not having to break a large bill.',
    },
    {
      heading: 'When to arrive: early vs. late',
      body: [
        'There is a genuine trade-off in timing, and the right answer depends on what you want.',
        'Arrive early — right when the market opens — for the best and widest selection. Popular items like berries, specialty greens, flowers, and anything in short supply often sell out within the first hour or two. Early is also less crowded and gives you time to talk with vendors.',
        'Arrive late — in the last hour — if you care more about deals than selection. Many vendors would rather sell the last of their produce at a discount than pack it up, so late shopping can mean lower prices, though the pickings are thinner.',
      ],
    },
    {
      heading: 'How to pay',
      body: [
        'Payment at markets is more varied than at a store. Cash is always accepted and is often the smoothest option. Many vendors now take cards or mobile payments too, but do not count on every stall having a reader — especially smaller farms.',
        'If you use SNAP/EBT, you typically swipe once at the market\'s information booth and receive tokens to spend at participating vendors. Many markets also match SNAP dollars on produce through programs like Double Up Food Bucks.',
      ],
    },
    {
      heading: 'Simple market etiquette',
      body: [
        'Markets have a friendly, low-key culture. A few small courtesies go a long way.',
      ],
      list: {
        items: [
          'Ask before touching or squeezing produce — some vendors prefer to hand-pick for you.',
          'Have your payment ready when it is your turn, especially during a busy rush.',
          'Ask questions — vendors love talking about their food, and it is the best way to learn what is good that week.',
          'Bring your own bags and pack your own purchases to keep lines moving.',
          'Keep dogs and strollers clear of narrow stall fronts so others can shop.',
        ],
      },
    },
    {
      heading: 'Getting the most out of your visit',
      body: [
        'Once you are comfortable, a few habits will make you a better market shopper. Do a quick lap before buying so you know what is available and can compare quality and prices. Build your meals around whatever is abundant that week rather than sticking rigidly to a list. And do not be afraid to buy a little of something unfamiliar — markets are a great place to try an heirloom tomato variety or a vegetable you have never cooked.',
        'Finally, get to know a few vendors. Regulars often get the first pick of new crops, tips on how to cook something, and the occasional bonus handful thrown into the bag.',
      ],
      tip: 'Do one full walk-through before spending a dollar. You will shop smarter when you know what the whole market has to offer.',
    },
  ],
  faqs: [
    {
      question: 'Should I bring cash or can I use a card?',
      answer:
        'Bring cash, ideally in small bills. Many vendors accept cards or mobile payments now, but not all do, and cash keeps lines moving. If you use SNAP/EBT, you can usually swipe once at the market booth for tokens.',
    },
    {
      question: 'What time is best to go to a farmers market?',
      answer:
        'Go early — right at opening — for the widest selection and freshest pick. Go in the last hour if you want end-of-day deals and do not mind a thinner selection.',
    },
    {
      question: 'Do I need to bring my own bags?',
      answer:
        'It helps a lot. Vendors often have limited bags, and a reusable tote or basket handles heavy produce far better. Bring a cooler bag too if you are buying meat, dairy, or eggs.',
    },
  ],
  related: ['seasonal-produce-guide', 'snap-ebt-farmers-markets', 'storing-produce'],
  cta: {
    heading: 'Ready for your first visit?',
    text: 'Find a farmers market near you and check its hours, directions, and what vendors offer before you go.',
    href: '/near-me',
    label: 'Find markets near me',
  },
}
