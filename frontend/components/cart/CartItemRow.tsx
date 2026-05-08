'use client'

import { Trash2 } from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cart-store'
import { formatKwd } from '@/lib/prices'
import { cn } from '@/lib/utils'

interface CartItemRowProps {
  item: CartItem
  className?: string
}

const OFFER_LABELS: Record<string, string> = {
  one_piece: 'قطعة واحدة',
  two_pieces: 'قطعتين',
  three_pieces: '3 قطع',
  upsell_9kwd: 'عرض خاص - 9 KWD',
}

export function CartItemRow({ item, className }: CartItemRowProps) {
  const { removeItem } = useCartStore()

  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#D6E4E8]',
        className
      )}
    >
      {/* Image */}
      <div className="relative w-14 h-14 bg-[#EBF2F5] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[#142B3B] font-semibold text-sm leading-snug line-clamp-2">
          {item.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#506A77] text-xs">
            {OFFER_LABELS[item.offerId] || item.unitLabel}
          </span>
          {item.offerId === 'upsell_9kwd' && (
            <span className="text-[#D4AF37] text-xs font-medium">إضافة خاصة</span>
          )}
        </div>
        <p className="text-[#4A8B9A] font-bold text-sm mt-0.5">
          {formatKwd(item.priceKwd)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.productId, item.offerId)}
        className="p-1.5 text-[#8CA4B0] hover:text-[#B42318] hover:bg-[#FFF0F0] rounded-lg transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#B42318]"
        aria-label={`حذف ${item.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
