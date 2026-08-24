import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api/ads/geo (hit on every page view by the ad units; it resolves the
     *   visitor's location from request headers and needs no Supabase session,
     *   so keep the auth round-trip off that path)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/ads/geo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
