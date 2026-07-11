import type { Guide } from '../types'

export const seasonalProduceGuide: Guide = {
  slug: 'seasonal-produce-guide',
  title: "What's in Season? A Month-by-Month Farmers Market Produce Guide",
  metaTitle: "What's in Season: Month-by-Month Farmers Market Produce Guide",
  description:
    'A complete month-by-month guide to what fruits and vegetables are in season at U.S. farmers markets, plus how to shop seasonally and eat with the calendar.',
  category: 'Seasonal Eating',
  emoji: '🗓️',
  readingTime: 8,
  updated: '2026-07-01',
  intro: [
    'One of the biggest differences between a farmers market and a grocery store is that the market changes with the seasons. Instead of the same shelves year-round, you get whatever local farms are harvesting that week — which means peak flavor, lower prices, and produce that was often picked within a day of being sold.',
    'Knowing roughly what to expect each month helps you plan meals, avoid disappointment ("Why are there no tomatoes in May?"), and take advantage of gluts when a crop is cheap and abundant. This guide walks through the year in the continental United States. Your exact timing will shift by a few weeks depending on how far north or south you live — a strawberry that shows up in April in Georgia may not arrive until June in Vermont.',
  ],
  sections: [
    {
      heading: 'How seasonal produce works',
      body: [
        'Fruits and vegetables have a natural harvest window. A farm can only sell what the ground and the weather have produced, so a market\'s tables are essentially a live readout of the local growing season. Cool-weather crops like spinach, peas, and radishes bookend the year in spring and fall. Heat-loving crops like tomatoes, peppers, melons, and corn dominate the height of summer. Storage crops like winter squash, apples, onions, and potatoes carry markets through late fall and winter.',
        'This is also why seasonal shopping saves money. When a crop hits its peak, farms have more of it than they can easily sell, so prices drop. Buying strawberries in June or tomatoes in August almost always costs less than chasing them out of season.',
      ],
      tip: 'Shopping seasonally is the single easiest way to eat better for less. Build your meals around whatever is abundant and cheap that week rather than deciding the menu first and hunting for ingredients.',
    },
    {
      heading: 'Spring (March – May)',
      body: [
        'Spring markets are all about tender, cool-weather greens and the first sweet crops after winter. This is the season for asparagus, which has a short and celebrated window, along with peas, radishes, spring onions, and leafy greens like spinach, arugula, and lettuces. In warmer regions, the first strawberries arrive in April and May. Rhubarb, ramps (wild leeks), and fresh herbs also show up now.',
      ],
      list: {
        title: 'Typical spring produce',
        items: [
          'Asparagus, peas, and fava beans',
          'Radishes, spring onions, and salad turnips',
          'Spinach, arugula, lettuce, and other tender greens',
          'Strawberries (in warmer regions, late spring)',
          'Rhubarb, ramps, and fresh herbs',
        ],
      },
    },
    {
      heading: 'Summer (June – August)',
      body: [
        'Summer is the peak of the farmers market year — the tables are fullest, the variety is widest, and prices on popular crops are at their lowest. Early summer brings berries, cherries, and stone fruit; midsummer brings the crops most people associate with markets: sweet corn, tomatoes, cucumbers, zucchini, peppers, eggplant, and melons.',
        'If you only shop at the market a few times a year, summer is when to go. It is also the best time to buy in bulk and preserve — freezing berries, making tomato sauce, or pickling cucumbers when they are cheapest.',
      ],
      list: {
        title: 'Typical summer produce',
        items: [
          'Tomatoes, sweet corn, cucumbers, and zucchini',
          'Peppers, eggplant, and green beans',
          'Blueberries, blackberries, raspberries, and cherries',
          'Peaches, plums, nectarines, and apricots',
          'Melons — watermelon, cantaloupe, and honeydew',
        ],
      },
      tip: 'Late summer is glut season. If you have ever wanted to try canning, freezing, or making sauce, August is when produce is cheap enough to make it worthwhile.',
    },
    {
      heading: 'Fall (September – November)',
      body: [
        'Fall is a transition. Summer crops linger into September, then give way to the hearty produce of autumn: winter squash, pumpkins, apples, pears, and root vegetables like carrots, beets, turnips, and sweet potatoes. Cool-weather greens such as kale, collards, and Brussels sprouts return and often taste sweeter after the first light frost.',
        'This is prime season for apples and cider in much of the country, and for storage crops you can keep for weeks in a cool pantry.',
      ],
      list: {
        title: 'Typical fall produce',
        items: [
          'Winter squash, pumpkins, and gourds',
          'Apples, pears, and cider',
          'Carrots, beets, turnips, and sweet potatoes',
          'Kale, collards, cabbage, and Brussels sprouts',
          'Late tomatoes and peppers (early fall)',
        ],
      },
    },
    {
      heading: 'Winter (December – February)',
      body: [
        'Many markets slow down or move indoors in winter, but they rarely disappear entirely. Winter markets lean on storage crops and season-extended greenhouse produce: potatoes, onions, garlic, winter squash, apples, and hardy greens grown under cover. You will also find more value-added and non-produce vendors this time of year — bakers, cheesemakers, meat and egg producers, honey, jams, and prepared foods.',
        'In the South and on the West Coast, winter markets can still be surprisingly abundant, with citrus, avocados, and cool-season vegetables thriving while the rest of the country is under snow.',
      ],
      list: {
        title: 'Typical winter produce',
        items: [
          'Potatoes, onions, garlic, and winter squash',
          'Storage apples and pears',
          'Greenhouse greens and microgreens',
          'Citrus and avocados (in warm regions)',
          'Eggs, meat, cheese, honey, and baked goods year-round',
        ],
      },
    },
    {
      heading: 'A quick seasonal cheat sheet',
      table: {
        caption: 'Approximate U.S. peak seasons — adjust a few weeks for your region.',
        headers: ['Produce', 'Peak season'],
        rows: [
          ['Asparagus', 'April – May'],
          ['Strawberries', 'May – June'],
          ['Sweet corn', 'July – September'],
          ['Tomatoes', 'July – September'],
          ['Peaches', 'June – August'],
          ['Watermelon', 'July – August'],
          ['Apples', 'September – November'],
          ['Winter squash', 'September – December'],
          ['Kale & collards', 'October – February'],
          ['Citrus (warm regions)', 'December – March'],
        ],
      },
    },
  ],
  faqs: [
    {
      question: 'Why does produce cost less when it is in season?',
      answer:
        'When a crop reaches its peak, local farms harvest more of it than they can easily sell, so supply is high and prices fall. Out of season, that same crop has to be shipped from far away or grown under expensive conditions, which raises the price.',
    },
    {
      question: 'Does the growing season change by region?',
      answer:
        'Yes. Warmer southern states and the West Coast start their seasons earlier and run later, while northern states have shorter windows. A crop that peaks in May in Georgia might not peak until July in Minnesota. Use this guide as a national baseline and expect a few weeks of drift for your area.',
    },
    {
      question: 'What can I buy at farmers markets in winter?',
      answer:
        'Winter markets rely on storage crops (potatoes, onions, squash, apples), greenhouse greens, and non-produce vendors selling eggs, meat, cheese, bread, honey, and prepared foods. In warm climates you will also find citrus and cool-season vegetables.',
    },
  ],
  related: ['beginners-guide', 'storing-produce', 'why-shop-local'],
  cta: {
    heading: 'Find a market and see what’s in season near you',
    text: 'Browse thousands of farmers markets across the country and check what local farms are harvesting this week.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
