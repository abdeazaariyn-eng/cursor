import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_COUNTRIES = new Set(
  (process.env.ALLOWED_COUNTRIES || 'KW').split(',').map(c => c.trim().toUpperCase())
)

const WHITELIST_IPS = new Set(
  (process.env.WHITELIST_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean)
)

const BLOCKED_PATH = '/blocked'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname === BLOCKED_PATH ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|css|js|woff2?)$/)
  ) {
    return NextResponse.next()
  }

  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.ip ||
    ''

  if (WHITELIST_IPS.has(ip)) {
    return NextResponse.next()
  }

  // Cloudflare, Vercel, and most CDNs set this header
  const country = (
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-vercel-ip-country') ||
    request.geo?.country ||
    ''
  ).toUpperCase()

  if (!country || ALLOWED_COUNTRIES.has(country)) {
    return NextResponse.next()
  }

  const blockedUrl = request.nextUrl.clone()
  blockedUrl.pathname = BLOCKED_PATH
  return NextResponse.rewrite(blockedUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
