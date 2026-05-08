const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Probe the API with a no-cors request to distinguish a CORS misconfiguration
 * (server is reachable but headers are wrong) from a genuine network outage
 * (server is completely unreachable).  A no-cors fetch is never blocked by the
 * browser's CORS policy, so it succeeds with an opaque response whenever the
 * server can be reached at all.
 */
async function _classifyFetchError(): Promise<'cors_misconfigured' | 'offline'> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    await fetch(`${API_BASE}/health`, { mode: 'no-cors', signal: controller.signal })
    return 'cors_misconfigured'
  } catch {
    return 'offline'
  } finally {
    clearTimeout(timer)
  }
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    })

    // Parse JSON separately so a non-JSON body (e.g. an nginx error page)
    // is reported with the real HTTP status code rather than a fake NETWORK_ERROR.
    let data: unknown
    try {
      data = await res.json()
    } catch {
      throw new ApiError(
        'SERVER_ERROR',
        `خطأ في الخادم (${res.status})، حاولي مرة ثانية`,
        res.status,
      )
    }

    if (!res.ok) {
      const errorData = data as { error?: { code?: string; message?: string } }
      throw new ApiError(
        errorData?.error?.code || 'UNKNOWN_ERROR',
        errorData?.error?.message || 'حدث خطأ غير متوقع',
        res.status
      )
    }

    return data as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new ApiError('TIMEOUT', 'انتهت مهلة الاتصال، حاولي مرة ثانية')
    }
    // Distinguish CORS misconfiguration from a real network outage so the user
    // (and support team) sees an actionable message instead of the generic one.
    const errorType = await _classifyFetchError()
    if (errorType === 'cors_misconfigured') {
      throw new ApiError(
        'CORS_ERROR',
        'يتعذر الوصول إلى الخادم بسبب إعدادات غير صحيحة. يرجى المحاولة لاحقاً أو التواصل مع الدعم.',
      )
    }
    throw new ApiError('NETWORK_ERROR', 'تعذر الاتصال بالخادم، تأكدي من الاتصال بالإنترنت')
  } finally {
    clearTimeout(timeout)
  }
}

export interface CreateOrderPayload {
  customer: {
    name: string
    phone: string
  }
  items: Array<{
    productId: string
    offerId: string
  }>
  attribution: {
    landingPage?: string
    source?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmContent?: string
    utmTerm?: string
    fbp?: string
    fbc?: string
    ttp?: string
    ttclid?: string
    scClickId?: string
  }
  events: {
    leadEventId: string
    purchaseEventId: string
  }
}

export interface CreateOrderResponse {
  orderId: string
  orderNumber: string
  status: string
  totalKwd: number
  recommendedUpsell: {
    productId: string
    priceKwd: number
  } | null
}

export interface UpsellPayload {
  action: 'accepted' | 'skipped'
  productId?: string
}

export interface UpsellResponse {
  orderId: string
  upsellStatus: string
  totalKwd: number
}

export interface FinalizePayload {
  purchaseEventId: string
  browserEventSent: boolean
}

export interface FinalizeResponse {
  orderId: string
  orderNumber: string
  status: string
  thankYouUrl: string
}

export interface GetOrderResponse {
  orderId: string
  orderNumber: string
  status: string
  totalKwd: number
  customerName: string
  items: Array<{
    productNameAr: string
    offerId: string
    quantity: number
    priceKwd: number
    isUpsell: boolean
  }>
  createdAt: string
}

export const api = {
  createOrder: (body: CreateOrderPayload) =>
    apiFetch<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  upsell: (orderId: string, body: UpsellPayload) =>
    apiFetch<UpsellResponse>(`/orders/${orderId}/upsell`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  finalizeOrder: (orderId: string, body: FinalizePayload) =>
    apiFetch<FinalizeResponse>(`/orders/${orderId}/finalize`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getOrder: (orderId: string) =>
    apiFetch<GetOrderResponse>(`/orders/${orderId}`),
  trackEvent: (body: { eventName: string; eventId?: string; platform?: string }) =>
    apiFetch<any>('/tracking/event', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

export { ApiError }
