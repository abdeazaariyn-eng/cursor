/**
 * Frontend helpers for formatting order data and generating call-related copy.
 */

import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'

/**
 * Format number as Arabic dinar (د.ك)
 */
export function formatKwd(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return `د.ك ${num.toFixed(3)}`
}

/**
 * Determine call timing message based on order creation time.
 * Returns heading, description, and urgency flag for banner styling.
 */
export function getCallTimingMessage(
  createdAt: string
): { heading: string; description: string; urgent: boolean; etaMinutes?: number } {
  const orderDate = new Date(createdAt)
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.getDay() // 0 = Sunday, 5 = Friday, 6 = Saturday

  const isWorkingHours = hour >= 9 && hour < 21
  const isToday =
    orderDate.getDate() === now.getDate() &&
    orderDate.getMonth() === now.getMonth() &&
    orderDate.getFullYear() === now.getFullYear()

  // Friday/Saturday special handling (if needed; adjust based on your business)
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6

  if (isWorkingHours && isToday && !isWeekend) {
    // Calculate rough ETA (5-10 minutes from now)
    return {
      heading: 'راح نتصل فيك خلال أقل من 10 دقائق! 📞',
      description: 'فريقنا يتواصل معك خلال أقل من 10 دقائق لتأكيد طلبك والعنوان.',
      urgent: true,
      etaMinutes: 7,
    }
  }

  if (hour >= 21 || isWeekend) {
    return {
      heading: 'راح نتواصل معك بكرة الصبح 🌅',
      description: 'طلبك مسجل! فريقنا يتصل فيك أول شيء الصبح (من الساعة 9) لتأكيد العنوان والشحن.',
      urgent: false,
    }
  }

  return {
    heading: 'راح نتواصل معك الصبح 🌅',
    description: 'طلبك مسجل! فريقنا يتصل فيك من الساعة 9 صباحاً لتأكيد العنوان والشحن.',
    urgent: false,
  }
}

/**
 * Extract first name from full name.
 */
export function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(' ')
  return parts[0] || fullName
}

/**
 * Get product-specific payoff copy based on product ID.
 */
export function getProductPayoffCopy(
  productId?: string
): { day1: string; week1: string; week2: string } {
  const product = productId ? PRODUCTS.find((p) => p.id === productId) : null

  // Use product's payoffTimeline if available, otherwise fallback
  if (product && 'payoffTimeline' in product) {
    const timeline = (product as any).payoffTimeline
    if (timeline && timeline.day1) {
      return timeline
    }
  }

  // Generic fallback
  return {
    day1: 'تستخدمينه وتحسين الفرق فوراً 💫',
    week1: 'الطفل أكتر هدوء وأنتِ أكتر ارتياح 😌',
    week2: 'صار جزء من روتينك اليومي والنتايج واضحة ✨',
  }
}

/**
 * Get all suggested products based on order items.
 * Uses crossSellPriority from product data.
 */
export function getSuggestedProductsFromOrder(
  orderItems: GetOrderResponse['items']
): { primary: typeof PRODUCTS; secondary: typeof PRODUCTS } {
  const orderedIds = orderItems
    .map((item) => {
      const found = PRODUCTS.find((p) => p.arabicName === item.productNameAr)
      return found?.id
    })
    .filter(Boolean) as string[]

  // Collect suggested products from crossSellPriority
  const suggested = new Set<string>()
  orderItems.forEach((item) => {
    const product = PRODUCTS.find((p) => p.arabicName === item.productNameAr)
    if (product && 'crossSellPriority' in product) {
      const priorities = (product as any).crossSellPriority || []
      priorities.forEach((id: string) => {
        if (!orderedIds.includes(id)) {
          suggested.add(id)
        }
      })
    }
  })

  // Get actual product objects
  const suggestedProducts = Array.from(suggested)
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as typeof PRODUCTS

  // Primary: top 1-2 from crossSell, Secondary: fallback to other products
  const primary = suggestedProducts.slice(0, 2)
  const secondary = PRODUCTS.filter(
    (p) => !orderedIds.includes(p.id) && !suggestedProducts.includes(p)
  ).slice(0, 2)

  return { primary, secondary: primary.length < 2 ? secondary : [] }
}

/**
 * Delivery ETA message based on timezone / city (currently generic for Kuwait).
 */
export function getDeliveryEta(): string {
  return 'عادةً خلال 1–3 أيام عمل داخل الكويت'
}

/**
 * Generate WhatsApp message to add product to upcoming call.
 */
export function generateAddToCallWhatsAppMessage(
  orderNumber: string,
  productName: string
): string {
  return `مرحبا، طلبي رقم #${orderNumber} — أبي أضيف ${productName} للمكالمة 🎁`
}
