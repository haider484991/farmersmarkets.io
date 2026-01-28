// Type for classname values
type ClassValue = string | undefined | null | false | ClassValue[]

// Simple classnames utility
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat()
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Format phone number for display
export function formatPhone(phone: string | null): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

// Format rating for display
export function formatRating(rating: number | null): string {
  if (rating === null) return 'N/A'
  return rating.toFixed(1)
}

// Get Google Maps directions URL
export function getDirectionsUrl(
  latitude: number | null,
  longitude: number | null,
  placeId?: string | null
): string {
  if (placeId) {
    return `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`
  }
  if (latitude && longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  }
  return ''
}

// Generate market slug from name and location
export function generateSlug(name: string, city?: string, state?: string): string {
  const parts = [name, city, state].filter(Boolean)
  return parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Get state name from state code
export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
  PR: 'Puerto Rico',
}

export function getStateName(stateCode: string): string {
  return STATE_NAMES[stateCode.toUpperCase()] || stateCode
}

// Get state code from state name
export function getStateCode(stateName: string): string | undefined {
  const entry = Object.entries(STATE_NAMES).find(
    ([, name]) => name.toLowerCase() === stateName.toLowerCase()
  )
  return entry?.[0]
}

// Get state slug from state code or name
export function getStateSlug(stateCodeOrName: string): string {
  const name = STATE_NAMES[stateCodeOrName.toUpperCase()] || stateCodeOrName
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Format day of week
export const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const

export type DayOfWeek = typeof DAYS_OF_WEEK[number]

export function formatDay(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

// Check if market is open today
export function isOpenToday(schedule: Record<string, { open: string; close: string } | null> | null): boolean {
  if (!schedule) return false
  const today = DAYS_OF_WEEK[new Date().getDay()]
  return schedule[today] !== null && schedule[today] !== undefined
}

// Get today's hours
export function getTodayHours(schedule: Record<string, { open: string; close: string } | null> | null): string | null {
  if (!schedule) return null
  const today = DAYS_OF_WEEK[new Date().getDay()]
  const hours = schedule[today]
  if (!hours) return null
  return `${hours.open} - ${hours.close}`
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format distance for display
export function formatDistance(miles: number): string {
  if (miles < 0.1) return 'Less than 0.1 mi'
  if (miles < 10) return `${miles.toFixed(1)} mi`
  return `${Math.round(miles)} mi`
}

// Pluralize word
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`)
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
