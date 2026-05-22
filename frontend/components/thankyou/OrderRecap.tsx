'use client'

import Image from 'next/image'
import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { formatKwd } from '@/lib/order-display'

interface OrderRecapProps {
  order: GetOrderResponse
}

export function OrderRecap({ order }: OrderRecapProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm p-5 mb-6">
      {/* Header with Order Number */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E8F0F3]">
        <h2 className="font-bold text-[#142B3B] text-base">📦 ملخص طلبك</h2>
        <span className="text-xs text-[#6B8A99] font-mono bg-[#EBF2F5] px-2.5 py-1 rounded-full">
          #{order.orderNumber}
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-3 mb-4">
        {order.items.map((item, idx) => {
          const product = PRODUCTS.find((p) => p.arabicName === item.productNameAr)
          return (
            <div key={idx} className="flex gap-3 pb-3 border-b border-[#E8F0F3] last:border-0 last:pb-0">
              {/* Product Image */}
              {product?.image && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#EBF2F5] flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={item.productNameAr}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#142B3B] text-sm font-semibold leading-snug mb-1 line-clamp-2">
                  {item.productNameAr}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[#6B8A99] text-xs">
                    {item.quantity > 1 ? `${item.quantity} قطع` : 'قطعة واحدة'}
                  </span>
                  {item.isUpsell && (
                    <span className="text-xs font-semibold text-[#F57F17] bg-[#FFF3C4] px-1.5 py-0.5 rounded">
                      🎁 عرض إضافي
                    </span>
                  )}
                </div>
              </div>

              {/* Price — right aligned, clear */}
              <div className="text-left flex-shrink-0 min-w-fit">
                <p className="text-[#142B3B] font-bold text-sm tabular-nums">
                  {formatKwd(item.priceKwd)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Section */}
      <div className="bg-[#F8FBFC] rounded-xl p-4 border border-[#E8F0F3]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#506A77] text-sm font-medium">المجموع:</span>
          <span className="text-[#142B3B] font-bold text-lg tabular-nums">
            {formatKwd(order.totalKwd)}
          </span>
        </div>
        <p className="text-[#6B8A99] text-xs font-medium">💳 يُدفع كاش عند الاستلام</p>
      </div>

      {/* Address/Phone Confirmation */}
      <div className="mt-4 p-3 bg-[#F8FBFC] rounded-lg border border-[#E8F0F3]">
        <p className="text-[#142B3B] text-xs font-semibold mb-2">
          🔍 تأكدي من البيانات في المكالمة:
        </p>
        <p className="text-[#6B8A99] text-xs">
          اسم • عنوان • رقم الجوال ← نتأكد منهم كل واحدة بنفس المكالمة
        </p>
      </div>
    </div>
  )
}
