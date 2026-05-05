'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { useCartStore, type CartItem as CartItemType } from '@/store/cart-store'
import { formatKwd } from '@/lib/prices'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCartStore()

  return (
    <div className="flex items-center gap-3 p-3 bg-brand-ivory rounded-2xl">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-blush flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-deep text-sm leading-tight truncate">{item.name}</p>
        <p className="text-brand-brown text-xs mt-0.5">{item.unitLabel}</p>
        {item.originalPriceKwd && item.originalPriceKwd > item.priceKwd && (
          <p className="text-brand-sage text-xs font-medium mt-0.5">
            وفرتِ {formatKwd(item.originalPriceKwd - item.priceKwd)}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="font-bold text-brand-primary text-sm">{formatKwd(item.priceKwd)}</span>
        <button
          onClick={() => removeItem(item.productId, item.offerId)}
          className="text-gray-400 hover:text-brand-error transition-colors p-1 rounded-lg hover:bg-red-50"
          aria-label="إزالة المنتج"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
