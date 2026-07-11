import type { Guide } from '../types'

export const storingProduceGuide: Guide = {
  slug: 'storing-produce',
  title: 'How to Store Fresh Produce So It Lasts Longer',
  metaTitle: 'How to Store Fresh Produce So It Lasts (Fruit & Veg Guide)',
  description:
    'Practical storage tips for keeping farmers market fruits and vegetables fresh longer — what to refrigerate, what to leave out, and how to cut food waste.',
  category: 'Kitchen Tips',
  emoji: '🥬',
  readingTime: 7,
  updated: '2026-07-01',
  intro: [
    'You bought a beautiful haul at the market — now how do you keep it from wilting before you can eat it? Farmers market produce is picked ripe and fresh, which means it tastes better but also that it was never bred for long shelf life like a lot of supermarket produce. Store it well and it will reward you; store it wrong and you will be composting half of it by Wednesday.',
    'This guide covers the simple rules that make the biggest difference, plus a quick reference for common fruits and vegetables. A little care here saves money and cuts the food waste that ends up in the average household bin.',
  ],
  sections: [
    {
      heading: 'The core rules of produce storage',
      body: [
        'Most storage advice comes down to a handful of principles about moisture, temperature, and a ripening gas called ethylene.',
      ],
      list: {
        title: 'Five rules that cover most produce',
        items: [
          'Do not wash produce until you are ready to use it — excess moisture speeds up rot. Wait to rinse berries, greens, and herbs until just before eating.',
          'Keep ethylene producers away from ethylene-sensitive items. Apples, bananas, tomatoes, and stone fruit give off ethylene gas that ripens (and over-ripens) nearby produce.',
          'Most vegetables like cool and humid; store them in the fridge crisper drawer, loosely bagged.',
          'Some produce hates the cold. Tomatoes, potatoes, onions, garlic, and most whole fruit ripening on the counter should stay at room temperature.',
          'Give leafy greens and herbs a little airflow and a little moisture — a loosely closed bag with a paper towel works well.',
        ],
      },
      tip: 'The number one mistake is washing everything as soon as you get home. Water on the surface of berries and greens is what turns them slimy. Wash right before you eat instead.',
    },
    {
      heading: 'What to keep on the counter',
      body: [
        'Some produce loses flavor or texture in the fridge and should live at room temperature, out of direct sun.',
      ],
      list: {
        items: [
          'Tomatoes — refrigeration kills their flavor and makes them mealy. Keep on the counter, stem-side down.',
          'Potatoes, onions, and garlic — store in a cool, dark, dry place with airflow, but keep potatoes and onions apart, as each makes the other spoil faster.',
          'Whole melons, peaches, plums, and nectarines — ripen on the counter, then refrigerate once ripe to slow them down.',
          'Winter squash and hard-skinned gourds — keep in a cool pantry for weeks or even months.',
          'Bananas, avocados, and pears — ripen at room temperature; move to the fridge to hold once ripe.',
        ],
      },
    },
    {
      heading: 'What belongs in the fridge',
      body: [
        'Most vegetables and many fruits last longest in the cool, humid environment of the refrigerator, ideally in the crisper drawer.',
      ],
      list: {
        items: [
          'Leafy greens, lettuce, and herbs — loosely bagged with a dry paper towel to absorb excess moisture.',
          'Carrots, beets, and radishes — remove the leafy tops (they pull moisture from the root), then bag and refrigerate.',
          'Broccoli, cauliflower, cabbage, and Brussels sprouts — crisper drawer, loosely wrapped.',
          'Berries — refrigerate unwashed and dry; only rinse right before eating.',
          'Corn — keep in the husk and refrigerate; its sugars turn to starch quickly, so eat within a couple of days.',
        ],
      },
    },
    {
      heading: 'How to store fresh herbs',
      body: [
        'Herbs are among the first things to wilt, but a couple of tricks keep them lively. Treat leafy, soft herbs like a bouquet of flowers: trim the stems and stand them in a jar with an inch of water. Basil prefers to stay on the counter this way, while parsley, cilantro, and mint do well in a jar loosely covered with a bag in the fridge. Woody herbs like rosemary and thyme keep well wrapped in a slightly damp towel in the fridge.',
      ],
    },
    {
      heading: 'Freezing and preserving the extras',
      body: [
        'When you buy in bulk during peak season — a flat of berries in June, a box of tomatoes in August — preserving lets you enjoy the market long after the crop is gone. Most berries freeze beautifully: spread them on a tray to freeze individually, then transfer to a bag so they do not clump. Tomatoes can be roasted and frozen or cooked down into sauce. Many vegetables freeze well after a quick blanch in boiling water. Herbs can be chopped and frozen in oil in ice-cube trays.',
      ],
      tip: 'Freeze berries in a single layer on a sheet pan first, then bag them. They will pour out loose instead of freezing into one solid brick.',
    },
    {
      heading: 'Quick storage reference',
      table: {
        caption: 'A fast cheat sheet for common market produce.',
        headers: ['Produce', 'Where to store'],
        rows: [
          ['Tomatoes', 'Counter, out of the fridge'],
          ['Leafy greens & herbs', 'Fridge, loosely bagged with a paper towel'],
          ['Berries', 'Fridge, unwashed until use'],
          ['Potatoes & onions', 'Cool, dark, dry — stored apart'],
          ['Carrots & beets', 'Fridge, tops removed'],
          ['Peaches & plums', 'Counter to ripen, then fridge'],
          ['Winter squash', 'Cool pantry, for weeks'],
          ['Sweet corn', 'Fridge in the husk, eat quickly'],
        ],
      },
    },
  ],
  faqs: [
    {
      question: 'Why should I not wash produce right when I get home?',
      answer:
        'Surface moisture accelerates spoilage, especially on berries, greens, and herbs. Washing traps water in nooks and crevices where mold and rot start. Wash produce right before you eat or cook it instead.',
    },
    {
      question: 'Why do my tomatoes go mealy in the fridge?',
      answer:
        'Cold temperatures break down the compounds that give tomatoes their flavor and firm texture. Store whole tomatoes at room temperature on the counter and only refrigerate cut ones briefly.',
    },
    {
      question: 'What produce should be kept apart from the rest?',
      answer:
        'Ethylene-producing items — apples, bananas, tomatoes, and stone fruit — speed up ripening in nearby produce. Keep them away from ethylene-sensitive items like leafy greens and broccoli. Also store potatoes and onions separately from each other.',
    },
  ],
  related: ['seasonal-produce-guide', 'beginners-guide', 'why-shop-local'],
  cta: {
    heading: 'Stock up at a market near you',
    text: 'Find local markets, check what’s in season, and put these storage tips to work on your next haul.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
