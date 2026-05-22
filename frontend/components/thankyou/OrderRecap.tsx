'use client'

import Image from 'next/image'
import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { formatKwd } from '@/lib/order-display'
import { Package } from 'lucide-react'

interface OrderRecapProps {
  order: GetOrderResponse
}

export function OrderRecap({ order }: OrderRecapProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm overflow-hidden mb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F8FBFC] border-b border-[#E8F0F3]">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#4A8B9A]" />
          <span className="font-semibold text-[#142B3B] text-sm">طلبك</span>
        </div>
        <span className="text-xs text-[#6B8A99] font-mono">#{order.orderNumber}</span>
      </div>

      <div className="p-4">
        {/* Items - Clean, minimal */}
        <div className="space-y-3 mb-4">
          {order.items.map((item, idx) => {
            const product = PRODUCTS.find((p) => p.arabicName === item.productNameAr)
            return (
              <div key={idx} className="flex items-center gap-3">
                {product?.image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#EBF2F5] flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={item.productNameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[#142B3B] text-sm font-medium leading-snug line-clamp-1">
                    {item.productNameAr}
                  </p>
                  <span className="text-[#6B8A99] text-xs">
                    {item.quantity > 1 ? `×${item.quantity}` : ''}
                    {item.isUpsell && ' 🎁 عرض خاص'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Simple Total */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8F0F3]">
          <span className="text-[#506A77] text-sm">المجموع — كاش عند الاستلام</span>
          <span className="text-[#142B3B] font-bold text-base tabular-nums">
            {formatKwd(order.totalKwd)}
          </span>
        </div>
      </div>
    </div>
  )
}
