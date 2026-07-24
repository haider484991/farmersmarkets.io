// One-off: report image coverage across markets. Read-only.
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function count(query) {
  return query.then(({ count, error }) => {
    if (error) throw error
    return count
  })
}

const base = () => supabase.from('markets').select('*', { count: 'exact', head: true }).eq('is_active', true)

const total = await count(base())
const withFeatured = await count(base().not('featured_image', 'is', null))
const withLatLng = await count(base().not('latitude', 'is', null).not('longitude', 'is', null))
const withPlaceId = await count(base().not('google_place_id', 'is', null))

// photos is a JSON array; count rows where it is a non-empty array
const { data: photoSample } = await supabase
  .from('markets')
  .select('id, photos')
  .eq('is_active', true)
  .not('photos', 'is', null)
  .limit(1000)
const withPhotos = (photoSample || []).filter(
  (m) => Array.isArray(m.photos) && m.photos.length > 0
).length

console.log('=== IMAGE COVERAGE (active markets) ===')
console.log('total active markets: ', total)
console.log('with featured_image:  ', withFeatured, `(${((withFeatured / total) * 100).toFixed(1)}%)`)
console.log('MISSING featured_image:', total - withFeatured, `(${(((total - withFeatured) / total) * 100).toFixed(1)}%)`)
console.log('with google_place_id: ', withPlaceId)
console.log('with lat/long:        ', withLatLng, `(${((withLatLng / total) * 100).toFixed(1)}%)`)
console.log('(sampled) rows with >=1 photo in first 1000 non-null:', withPhotos)
