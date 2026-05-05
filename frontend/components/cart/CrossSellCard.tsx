'use client'

import { Plus } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import type { Product } from '@/data/products'
import { OFFER_CONFIG } from '@/lib/prices'
import { formatKwd } from '@/lib/prices'
import { fireAddToCart, generateEventId } from '@/lib/events'

interface CrossSellCardProps {
  product: Product
}

const CROSS_SELL_REASONS: Record<string, string> = {
  baby_head_protection_mask: 'حماية إضافية لطفلك أثناء الحركة',
  portable_baby_bottle_warmer: 'أكملي روتين التغذية برا البيت',
  wearable_electric_breast_pump: 'راحة أكثر في يومك كأم مرضعة',
}

export function CrossSellCard({ product }: CrossSellCardProps) {
  const { addItem, openCart } = useCartStore()
  const offer = OFFER_CONFIG['one_piece']

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.arabicName,
      offerId: 'one_piece',
      quantity: 1,
      unitLabel: 'قطعة واحدة',
      priceKwd: offer.priceKwd,
      originalPriceKwd: offer.originalPriceKwd,
      image: product.imagePlaceholder,
    })

    fireAddToCart({
      value: offer.priceKwd,
      contentIds: [product.id],
      contentName: product.arabicName,
      eventId: generateEventId(),
    })
  }

  return (
    <div className="flex items-center gap-3 bg-[#F7EDE8] rounded-xl p-3 border border-[#E7D4CC]">
      {/* Image */}
      <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 flex items-center justify-center text-xl">
        {product.id === 'baby_head_protection_mask' ? '🛡️' :
         product.id === 'portable_baby_bottle_warmer' ? '🍼' : '💝'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[#2F2523] font-semibold text-xs leading-snug line-clamp-1">
          {product.shortName}
        </p>
        <p className="text-[#7B5E57] text-xs mt-0.5 line-clamp-1">
          {CROSS_SELL_REASONS[product.id] || product.cardSubheading}
        </p>
        <p className="text-[#B97863] font-bold text-sm mt-0.5">
          {formatKwd(offer.priceKwd)}
        </p>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        className="flex items-center gap-1 bg-[#B97863] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#A3674F] transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B97863]"
        aria-label={`أضيفي ${product.arabicName} للسلة`}
      >
        <Plus className="w-3.5 h-3.5" />
        أضيفي
      </button>
    </div>
  )
}
