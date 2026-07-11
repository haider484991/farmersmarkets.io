import type { Guide } from '../types'

export const farmersMarketSeasonGuide: Guide = {
  slug: 'farmers-market-season',
  title: 'When Do Farmers Markets Open? A Guide to Market Season by Region',
  metaTitle: 'When Do Farmers Markets Open? Market Season Guide by Region',
  description:
    'When do farmers markets start and end? A regional guide to typical opening and closing months, plus how to find year-round and winter markets near you.',
  category: 'Seasonal Eating',
  emoji: '📆',
  readingTime: 6,
  updated: '2026-07-01',
  intro: [
    'If you have ever driven to a market only to find an empty parking lot, you know that timing matters. Most U.S. farmers markets are seasonal, opening in spring and closing in fall, though the exact months vary widely by region — and a growing number of markets now run year-round or move indoors for the winter.',
    'This guide explains the typical season by region, why markets follow the calendar they do, and how to find one that is open when you want to shop.',
  ],
  sections: [
    {
      heading: 'Why most markets are seasonal',
      body: [
        'A farmers market exists to sell what local farms are harvesting, so its calendar follows the local growing season. Where winters are long and cold, there is little to harvest for months at a time, so outdoor markets pause. Where the climate is mild, farms produce nearly year-round and markets can too. That is the whole logic behind opening and closing dates — they track when there is enough local product to fill the tables.',
      ],
    },
    {
      heading: 'Typical market season by region',
      body: [
        'These are general ranges. Individual markets set their own dates, so always confirm with the specific market before you go.',
      ],
      table: {
        caption: 'Approximate outdoor market seasons across U.S. regions.',
        headers: ['Region', 'Typical season'],
        rows: [
          ['Northeast & Upper Midwest', 'May/June – October/November'],
          ['Mid-Atlantic', 'April/May – November'],
          ['Pacific Northwest', 'May – October (some year-round)'],
          ['Mountain West', 'June – September/October'],
          ['Southeast', 'April – November (some year-round)'],
          ['Southwest & Southern California', 'Year-round in many areas'],
          ['Gulf Coast & Florida', 'Often year-round, busiest in cooler months'],
        ],
      },
    },
    {
      heading: 'Spring: opening season',
      body: [
        'Most markets open somewhere between April and June, depending on how far north they are. Early-season tables lean heavily on greens, asparagus, radishes, herbs, plants and seedlings, and non-produce vendors — meat, eggs, cheese, bread, and honey — while the first fruits are still weeks away. Opening day is often a local event worth catching.',
      ],
    },
    {
      heading: 'Summer to early fall: peak season',
      body: [
        'From roughly July through September, markets are at their fullest and most numerous. This is when the widest variety is available and when even small towns often have a weekly market. If you want the best of what markets offer, this is the window.',
      ],
      tip: 'Peak season is also the best time to discover new markets — many small or pop-up markets only operate during the busiest summer months.',
    },
    {
      heading: 'Late fall: closing season',
      body: [
        'Most outdoor markets wrap up between late October and November as the harvest winds down, frequently ending with a harvest or holiday market featuring squash, apples, root vegetables, and seasonal goods. Some close for good until spring; others transition to a reduced winter schedule or move indoors.',
      ],
    },
    {
      heading: 'Winter and year-round markets',
      body: [
        'Winter markets are more common than they used to be. In cold regions, some markets move into a barn, community center, or warehouse and run monthly or biweekly through the winter, focusing on storage crops, greenhouse greens, and value-added foods. In mild climates — much of California, the Southwest, and the Gulf Coast — markets often run every week all year, and winter can actually be the peak season for citrus and cool-weather vegetables.',
      ],
      list: {
        title: 'How to find an off-season market',
        items: [
          'Check the market\'s own listing for its season dates and any winter schedule.',
          'Look for "indoor" or "winter" markets, which are often run by the same organizers at a different venue.',
          'In warm regions, search normally — many markets simply never close.',
        ],
      },
    },
    {
      heading: 'How to confirm a market is open',
      body: [
        'Seasonal dates and even weekly hours change from year to year, so it is always worth a quick check before you drive over. Look at the market\'s listing for its season and hours, and when in doubt, call ahead or check the market\'s own page or social media for the current schedule. Weather, holidays, and venue changes can all shift a market day.',
      ],
    },
  ],
  faqs: [
    {
      question: 'What months are farmers markets open?',
      answer:
        'It depends on the region. In the Northeast and Upper Midwest, most run roughly May/June through October/November. In the South and West, seasons are longer, and in mild climates like Southern California and the Gulf Coast, many markets operate year-round.',
    },
    {
      question: 'Are there farmers markets in winter?',
      answer:
        'Yes. In cold regions, some markets move indoors and run monthly or biweekly through winter with storage crops and greenhouse greens. In warm climates, many markets run every week all year, and winter is peak citrus season.',
    },
    {
      question: 'How do I know if a specific market is open today?',
      answer:
        'Check the market\'s listing for its season and weekly hours, and confirm with the market\'s own page or social media before you go. Dates and hours can change year to year, and weather or holidays can affect a given market day.',
    },
  ],
  related: ['seasonal-produce-guide', 'beginners-guide', 'why-shop-local'],
  cta: {
    heading: 'Check hours for a market near you',
    text: 'Browse markets by state and see each market’s days, hours, and season before you head out.',
    href: '/states',
    label: 'Browse markets by state',
  },
}
