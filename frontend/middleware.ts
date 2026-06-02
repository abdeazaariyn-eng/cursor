import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_COUNTRIES = new Set(
  (process.env.ALLOWED_COUNTRIES || 'KW').split(',').map(c => c.trim().toUpperCase())
)

const WHITELIST_IPS = new Set(
  (process.env.WHITELIST_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean)
)

const BLOCKED_IPS = new Set(
  (process.env.BLOCKED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean)
)

const BLOCKED_PATH = '/blocked'

// In development we want to bypass strict geo checks so localhost/127.0.0.1 works
const IS_DEV = process.env.NODE_ENV !== 'production'
const DEV_BYPASS_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

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

  // Allow all requests in development (local testing) or from common dev hosts
  const hostHeader = request.headers.get('host')?.split(':')[0]?.toLowerCase() || ''
  if (IS_DEV || DEV_BYPASS_HOSTS.has(hostHeader)) {
    return NextResponse.next()
  }

  const ip =
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.ip ||
    ''

  // If we don't have an IP, block (strict geo restriction)
  if (!ip) {
    const blockedUrl = request.nextUrl.clone()
    blockedUrl.pathname = BLOCKED_PATH
    return NextResponse.rewrite(blockedUrl)
  }

  if (BLOCKED_IPS.has(ip)) {
    const blockedUrl = request.nextUrl.clone()
    blockedUrl.pathname = BLOCKED_PATH
    return NextResponse.rewrite(blockedUrl)
  }

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

  // Require a country and ensure it's in the allowlist (strict)
  if (country && ALLOWED_COUNTRIES.has(country)) {
    return NextResponse.next()
  }

  const blockedUrl = request.nextUrl.clone()
  blockedUrl.pathname = BLOCKED_PATH
  return NextResponse.rewrite(blockedUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
