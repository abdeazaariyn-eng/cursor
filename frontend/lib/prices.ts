export type OfferId = 'one_piece' | 'two_pieces' | 'three_pieces' | 'upsell_9kwd'

export interface OfferConfig {
  quantity: number
  priceKwd: number
  label: string
  description: string
  savings: string | null
  recommended?: boolean
  originalPriceKwd?: number
}

export const OFFER_CONFIG: Record<OfferId, OfferConfig> = {
  one_piece: {
    quantity: 1,
    priceKwd: 19,
    label: 'قطعة واحدة',
    description: 'للتجربة الأولى',
    savings: null,
    originalPriceKwd: 29,
  },
  two_pieces: {
    quantity: 2,
    priceKwd: 27,
    label: 'قطعتين',
    description: 'الأفضل للأم والشنطة',
    savings: 'وفري 31 دينار كويتي',
    originalPriceKwd: 58,
  },
  three_pieces: {
    quantity: 3,
    priceKwd: 33,
    label: '3 قطع',
    description: 'أفضل قيمة',
    savings: 'وفري 54 دينار كويتي',
    recommended: true,
    originalPriceKwd: 87,
  },
  upsell_9kwd: {
    quantity: 1,
    priceKwd: 99,
    label: 'عرض خاص',
    description: 'إضافة خاصة بعد الطلب',
    savings: null,
  },
}

export function formatKwd(amount: number): string {
  return `${amount} دينار كويتي`
}
