'use client'

import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { getProductPayoffCopy } from '@/lib/order-display'

interface PayoffTimelineProps {
  order: GetOrderResponse
}

export function PayoffTimeline({ order }: PayoffTimelineProps) {
  // Get the first product in the order for product-specific copy
  const firstProductName = order.items[0]?.productNameAr
  const firstProduct = firstProductName ? PRODUCTS.find((p) => p.arabicName === firstProductName) : null

  const payoff = getProductPayoffCopy(firstProduct?.id)

  return (
    <div className="bg-gradient-to-br from-[#F8FBFC] to-[#EFF7F3] rounded-2xl border border-[#C5E0D3] p-5 mb-6">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">✨</div>
        <h2 className="font-bold text-[#142B3B] text-lg mb-1">وش الفرق اللي تتوقعين؟</h2>
        <p className="text-[#6B8A99] text-xs">
          آلاف الأمهات جربوه وقالوا كده 👇
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {/* Day 1 */}
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-[#FFF8E1] flex items-center justify-center flex-shrink-0 font-bold text-[#F57F17] text-sm">
            1️⃣
          </div>
          <div className="flex-1 pt-1">
            <p className="font-semibold text-[#142B3B] text-sm">اليوم الأول</p>
            <p className="text-[#6B8A99] text-xs mt-0.5">{payoff.day1}</p>
          </div>
        </div>

        {/* Week 1 */}
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-[#EFF7F3] flex items-center justify-center flex-shrink-0 font-bold text-[#267A4A] text-sm">
            📅
          </div>
          <div className="flex-1 pt-1">
            <p className="font-semibold text-[#142B3B] text-sm">بعد أسبوع</p>
            <p className="text-[#6B8A99] text-xs mt-0.5">{payoff.week1}</p>
          </div>
        </div>

        {/* Week 2+ */}
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-[#EDE7F6] flex items-center justify-center flex-shrink-0 font-bold text-[#7B1FA2] text-sm">
            🎯
          </div>
          <div className="flex-1 pt-1">
            <p className="font-semibold text-[#142B3B] text-sm">أسبوعين فما فوق</p>
            <p className="text-[#6B8A99] text-xs mt-0.5">{payoff.week2}</p>
          </div>
        </div>
      </div>

      {/* Reassurance line */}
      <div className="mt-4 p-3 bg-white rounded-lg text-center border border-[#C5E0D3]">
        <p className="text-[#267A4A] text-xs font-semibold">
          ✓ وإذا ما أعجبك، نسترجعه بدون أسئلة
        </p>
      </div>
    </div>
  )
}
