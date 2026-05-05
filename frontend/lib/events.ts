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
}

const isPixelsEnabled = () =>
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_ENABLE_PIXELS === 'true'

const isDebug = () =>
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_ENABLE_DEBUG_TRACKING === 'true'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    ttq?: {
      track: (event: string, params?: Record<string, unknown>) => void
      page: () => void
    }
    snaptr?: (action: string, event: string, params?: Record<string, unknown>) => void
  }
}

export function fireMetaEvent(
  eventName: string,
  params: EventParams = {}
) {
  if (typeof window === 'undefined' || !isPixelsEnabled()) return
  if (!window.fbq) return
  try {
    const { eventId, ...rest } = params
    window.fbq(
      'track',
      eventName,
      { currency: 'KWD', ...rest },
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
    window.ttq.track(eventName, { currency: 'KWD', ...params })
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
    window.snaptr('track', eventName, { currency: 'KWD', ...params })
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
  fireTikTokEvent('AddToCart', params)
  fireSnapEvent('ADD_CART', params)
  return eventId
}

export function fireInitiateCheckout(params: EventParams): string {
  const eventId = params.eventId || generateEventId()
  if (!isPixelsEnabled()) return eventId
  fireMetaEvent('InitiateCheckout', { ...params, eventId })
  fireTikTokEvent('InitiateCheckout', params)
  fireSnapEvent('START_CHECKOUT', params)
  return eventId
}

export function firePurchase(params: EventParams): string {
  const eventId = params.eventId || generateEventId()
  if (!isPixelsEnabled()) return eventId
  fireMetaEvent('Purchase', { ...params, eventId })
  fireTikTokEvent('CompletePayment', params)
  fireSnapEvent('PURCHASE', params)
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
