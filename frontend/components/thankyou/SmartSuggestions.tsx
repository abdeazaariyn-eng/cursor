'use client'

import Image from 'next/image'
import Link from 'next/link'
import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { getSuggestedProductsFromOrder, generateAddToCallWhatsAppMessage } from '@/lib/order-display'
import { Plus, Star, ShoppingBag } from 'lucide-react'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+96550000000'

interface SmartSuggestionsProps {
  order: GetOrderResponse
}

export function SmartSuggestions({ order }: SmartSuggestionsProps) {
  const { primary, secondary } = getSuggestedProductsFromOrder(order.items)
  const suggestedProducts = primary.length > 0 ? primary : secondary

  if (suggestedProducts.length === 0) return null

  const handleAddToCall = (productName: string) => {
    const message = generateAddToCallWhatsAppMessage(order.orderNumber, productName)
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="mb-6">
      {/* Attention-Grabbing Header */}
      <div className="bg-gradient-to-r from-[#142B3B] to-[#1a4a5e] rounded-t-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShoppingBag className="w-4 h-4 text-[#FFD54F]" />
          <h2 className="font-bold text-white text-sm">أضيفيها لطلبك — نوصلهم مع بعض!</h2>
        </div>
        <p className="text-[#8BB8C9] text-xs">أمهات كثير أضافوا هالمنتجات وتوصيلة وحدة بدون رسوم إضافية</p>
      </div>

      {/* Products */}
      <div className="bg-white border-x border-b border-[#D6E4E8] rounded-b-2xl divide-y divide-[#E8F0F3]">
        {suggestedProducts.map((product) => (
          <div key={product.id} className="p-4">
            <div className="flex gap-3">
              {/* Image */}
              {product.image && (
                <Link href={`/products/${product.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#EBF2F5] shadow-sm">
                    <Image
                      src={product.image}
                      alt={product.shortName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-[#142B3B] text-sm font-bold line-clamp-1">{product.shortName}</h3>
                  {product.badge && (
                    <span className="text-[10px] font-bold text-[#F57F17] bg-[#FFF3C4] px-1.5 py-0.5 rounded flex-shrink-0">
                      {product.badge}
                    </span>
                  )}
                </div>

                <p className="text-[#6B8A99] text-xs leading-relaxed mb-2 line-clamp-2">
                  {product.cardSubheading}
                </p>

                {/* Mini stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#FFD54F] fill-[#FFD54F]" />
                  ))}
                  <span className="text-[10px] text-[#6B8A99] mr-1">({product.reviews.length} تقييمات)</span>
                </div>

                {/* Add to call CTA */}
                <button
                  onClick={() => handleAddToCall(product.shortName)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-[#4A8B9A] to-[#267A4A] text-white rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  أضيفيها لطلبك في المكالمة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[#6B8A99] text-xs text-center mt-3 font-medium">
        أخبرينا في المكالمة وبنضيفها — بدون أي تعقيد 🙌
      </p>
    </div>
  )
}
