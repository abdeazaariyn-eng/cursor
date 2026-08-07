import { v4 as uuidv4 } from 'uuid'

export function generateEventId(): string {
  return uuidv4()
}

interface EventParams {
  value?: number
  currency?: string
  contentIds?: string[]
  contentName?: string
  orderId?: string
  eventId?: string
  /** Raw phone for advanced matching — Meta/Snap SDKs auto-hash; TikTok web pixel skipped (requires client-side SHA256) */
  phone?: string
}

const isPixelsEnabled = () =>
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_ENABLE_PIXELS === 'true'

const isDebug = () =>
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_ENABLE_DEBUG_TRACKING === 'true'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void
      identify: (params: Record<string, unknown>) => void
      page: () => void
    }
    snaptr?: {
      (action: 'init', pixelId: string, params?: Record<string, unknown>): void
      (action: 'track', eventName: string, params?: Record<string, unknown>): void
      (...args: unknown[]): void
    }
  }
}

/**
 * Normalize phone to digits-with-country-code for Meta/Snap advanced matching.
 * Meta: "Digits only including country code and area code" e.g. 96512345678
 * Snap: "Only digits with country code, area code and number" e.g. 96512345678
 * No hashing — Meta and Snap SDKs auto-hash.
 */
function normalizePhoneForPixel(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-().+]/g, '')
  // Kuwait: 8 digits starting with 4/5/6/9 (without country code)
  if (/^[4569]\d{7}$/.test(cleaned)) return `965${cleaned}`
  // Kuwait with country code already
  if (/^965[4569]\d{7}$/.test(cleaned)) return cleaned
  // Saudi: starts with 0 or 5 then 8 more digits
  if (/^05\d{8}$/.test(cleaned)) return `966${cleaned.slice(1)}`
  if (/^5\d{8}$/.test(cleaned)) return `966${cleaned}`
  // Saudi with country code
  if (/^9665\d{8}$/.test(cleaned)) return cleaned
  return null
}

export function fireMetaEvent(
  eventName: string,
  params: EventParams = {}
) {
  if (typeof window === 'undefined' || !isPixelsEnabled()) return
  if (!window.fbq) return
  try {
    const { eventId, phone, contentIds, contentName, orderId, ...rest } = params
    const eventData: Record<string, unknown> = { currency: 'KWD', ...rest }
    if (contentIds) eventData.content_ids = contentIds
    if (contentName) eventData.content_name = contentName
    if (orderId) eventData.order_id = orderId

    // Advanced matching: pass phone via fbq('init') update — Meta SDK auto-hashes
    if (phone && META_PIXEL_ID) {
      const normalized = normalizePhoneForPixel(phone)
      if (normalized) {
        window.fbq('init', META_PIXEL_ID, { ph: normalized })
      }
    }

    window.fbq(
      'track',
      eventName,
      eventData,
      ...(eventId ? [{ eventID: eventId }] : [])
    )
    if (isDebug()) console.log('[Meta]', eventName, params)
  } catch (e) {
    if (isDebug()) console.error('[Meta] error', e)
  }
}

export function fireTikTokEvent(
  eventName: string,
  params: EventParams = {}
) {
  if (typeof window === 'undefined' || !isPixelsEnabled()) return
  if (!window.ttq) return
  try {
    const { eventId, phone: _phone, contentIds, contentName, orderId, ...rest } = params
    const eventData: Record<string, unknown> = { currency: 'KWD', ...rest }
    if (contentIds) eventData.content_ids = contentIds
    if (contentName) eventData.content_name = contentName
    if (orderId) eventData.order_id = orderId

    // Pass event_id as 3rd arg for deduplication with TikTok CAPI
    const options = eventId ? { event_id: eventId } : undefined
    window.ttq.track(eventName, eventData, options)
    if (isDebug()) console.log('[TikTok]', eventName, params)
  } catch (e) {
    if (isDebug()) console.error('[TikTok] error', e)
  }
}

export function fireSnapEvent(
  eventName: string,
  params: EventParams = {}
) {
  if (typeof window === 'undefined' || !isPixelsEnabled()) return
  if (!window.snaptr) return
  try {
    const { eventId, phone, contentIds, orderId, value, ...rest } = params
    const eventData: Record<string, unknown> = { currency: 'KWD', ...rest }
    if (value !== undefined) eventData.price = value
    if (contentIds) eventData.item_ids = contentIds
    if (orderId) eventData.transaction_id = orderId
    // client_dedup_id: same ID used in Snap CAPI for deduplication (48h window)
    if (eventId) eventData.client_dedup_id = eventId

    // Advanced matching: re-init with phone before track — Snap SDK auto-hashes
    if (phone && SNAP_PIXEL_ID) {
      const normalized = normalizePhoneForPixel(phone)
      if (normalized) {
        window.snaptr('init', SNAP_PIXEL_ID, { user_phone_number: normalized })
      }
    }

    window.snaptr('track', eventName, eventData)
    if (isDebug()) console.log('[Snap]', eventName, params)
  } catch (e) {
    if (isDebug()) console.error('[Snap] error', e)
  }
}

export function firePageView() {
  if (!isPixelsEnabled()) return
  fireMetaEvent('PageView')
  fireTikTokEvent('PageView')
  fireSnapEvent('PAGE_VIEW')
}

export function fireViewContent(params: EventParams) {
  if (!isPixelsEnabled()) return
  fireMetaEvent('ViewContent', params)
  fireTikTokEvent('ViewContent', params)
  fireSnapEvent('VIEW_CONTENT', params)
}

export function fireAddToCart(params: EventParams): string {
  const eventId = params.eventId || generateEventId()
  if (!isPixelsEnabled()) return eventId
  fireMetaEvent('AddToCart', { ...params, eventId })
  fireTikTokEvent('AddToCart', { ...params, eventId })
  fireSnapEvent('ADD_CART', { ...params, eventId })
  return eventId
}

export function fireInitiateCheckout(params: EventParams): string {
  const eventId = params.eventId || generateEventId()
  if (!isPixelsEnabled()) return eventId
  fireMetaEvent('InitiateCheckout', { ...params, eventId })
  fireTikTokEvent('InitiateCheckout', { ...params, eventId })
  fireSnapEvent('START_CHECKOUT', { ...params, eventId })
  return eventId
}

export function firePurchase(params: EventParams): string {
  const eventId = params.eventId || generateEventId()
  if (!isPixelsEnabled()) return eventId
  // phone passed to Meta (fbq init re-call) and Snap (snaptr init re-call) for advanced matching
  // TikTok web pixel skipped for phone (requires SHA256 — handled by CAPI backend)
  fireMetaEvent('Purchase', { ...params, eventId })
  fireTikTokEvent('CompletePayment', { ...params, eventId })
  fireSnapEvent('PURCHASE', { ...params, eventId })
  return eventId
}

export function getAttributionFromBrowser(): Record<string, string | undefined> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)

  const getCookie = (name: string): string | undefined => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : undefined
  }

  return {
    landingPage: window.location.href,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc') || params.get('fbclid')
      ? `fb.1.${Date.now()}.${params.get('fbclid')}`
      : undefined,
    ttp: getCookie('_ttp'),
    ttclid: params.get('ttclid') || undefined,
    scClickId: params.get('ScCid') || undefined,
    source: params.get('utm_source') || undefined,
  }
}
