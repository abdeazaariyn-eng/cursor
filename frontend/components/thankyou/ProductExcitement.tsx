'use client'

import Image from 'next/image'
import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS, Product } from '@/data/products'
import { Sparkles, Heart, TrendingUp, Gift } from 'lucide-react'

interface ProductExcitementProps {
  order: GetOrderResponse
}

export function ProductExcitement({ order }: ProductExcitementProps) {
  const orderedProducts = order.items
    .map((item) => PRODUCTS.find((p) => p.arabicName === item.productNameAr))
    .filter(Boolean) as Product[]

  if (orderedProducts.length === 0) return null

  const mainProduct = orderedProducts[0]

  return (
    <div className="bg-gradient-to-br from-white via-[#FAFCFF] to-[#F0F9F4] rounded-2xl border border-[#D6E4E8] shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#142B3B] to-[#1a4a5e] p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#FFD54F]" />
          <h2 className="font-bold text-white text-base">اختيارك ذكي — وهذا اللي يميزه!</h2>
        </div>
        <p className="text-[#8BB8C9] text-xs">آلاف الأمهات اختاروا نفس المنتج وشافوا الفرق</p>
      </div>

      <div className="p-5">
        {/* Product Hero */}
        <div className="flex gap-4 items-center mb-5">
          {mainProduct.image && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#EBF2F5] flex-shrink-0 shadow-md">
              <Image
                src={mainProduct.image}
                alt={mainProduct.shortName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-[#142B3B] text-sm mb-1">{mainProduct.shortName}</h3>
            <p className="text-[#6B8A99] text-xs leading-relaxed">{mainProduct.emotionalHook}</p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {mainProduct.benefits.slice(0, 4).map((benefit, idx) => {
            const icons = [Heart, TrendingUp, Gift, Sparkles]
            const colors = ['#E91E63', '#267A4A', '#F57F17', '#7B1FA2']
            const bgColors = ['#FCE4EC', '#EFF7F3', '#FFF8E1', '#EDE7F6']
            const Icon = icons[idx]
            return (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#E8F0F3]"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: bgColors[idx] }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: colors[idx] }} />
                </div>
                <p className="text-[#142B3B] text-xs leading-snug font-medium">{benefit}</p>
              </div>
            )
          })}
        </div>

        {/* Proof Block */}
        {mainProduct.proofBlocks.length > 0 && (
          <div className="bg-[#F8FBFC] rounded-xl p-4 border border-[#E8F0F3]">
            <p className="text-[#267A4A] text-xs font-bold mb-2 flex items-center gap-1">
              <span>✅</span>
              <span>ليش هالمنتج مختلف:</span>
            </p>
            <ul className="space-y-1.5">
              {mainProduct.proofBlocks.map((block, idx) => (
                <li key={idx} className="text-[#506A77] text-xs flex items-start gap-2">
                  <span className="text-[#267A4A] font-bold mt-0.5">•</span>
                  <span>{block}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
