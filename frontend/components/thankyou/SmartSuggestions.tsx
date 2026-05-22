'use client'

import Image from 'next/image'
import Link from 'next/link'
import { GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { getSuggestedProductsFromOrder, generateAddToCallWhatsAppMessage, formatKwd } from '@/lib/order-display'

interface SmartSuggestionsProps {
  order: GetOrderResponse
}

export function SmartSuggestions({ order }: SmartSuggestionsProps) {
  const { primary, secondary } = getSuggestedProductsFromOrder(order.items)
  const suggestedProducts = primary.length > 0 ? primary : secondary

  if (suggestedProducts.length === 0) {
    return null
  }

  const handleAddToCall = (productName: string) => {
    const message = generateAddToCallWhatsAppMessage(order.orderNumber, productName)
    const whatsappLink = `https://wa.me/965${order.customerPhoneMasked?.replace(/\D/g, '').slice(-8) || '50000000'}?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, '_blank')
  }

  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <h2 className="font-bold text-[#142B3B] text-base mb-1">
          🎁 أمهات كثير أخذوها مع طلبهم
        </h2>
        <p className="text-[#6B8A99] text-xs">منتجات تكمل تجربتك وتفرق معك</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-[#D6E4E8] p-4 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            {product.image && (
              <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#EBF2F5] mb-3">
                <Image
                  src={product.image}
                  alt={product.shortName}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Name */}
            <h3 className="text-[#142B3B] text-sm font-semibold leading-snug mb-2 line-clamp-2">
              {product.shortName}
            </h3>

            {/* Description */}
            <p className="text-[#6B8A99] text-xs leading-relaxed mb-3 line-clamp-2">
              {product.cardSubheading}
            </p>

            {/* Badge & Price Row */}
            <div className="flex items-center justify-between mb-3 mt-auto">
              <div className="flex gap-1 flex-wrap">
                {product.badges?.slice(0, 2).map((badge, idx) => (
                  <span key={idx} className="text-[#4A8B9A] text-xs font-semibold bg-[#EBF2F5] px-2 py-1 rounded">
                    {badge}
                  </span>
                ))}
              </div>
              {/* Price is dynamic from products, but we don't have it here — could add it to suggested products */}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleAddToCall(product.shortName)}
              className="w-full py-2.5 bg-gradient-to-r from-[#4A8B9A] to-[#267A4A] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              + أضيفيها للمكالمة
            </button>

            {/* View Product Link */}
            <Link
              href={`/products/${product.slug}`}
              className="text-center mt-2 text-[#4A8B9A] text-xs underline hover:text-[#366A77] transition-colors"
            >
              اكتشفي التفاصيل
            </Link>
          </div>
        ))}
      </div>

      <p className="text-[#6B8A99] text-xs text-center mt-4 font-medium">
        اختاري ما تبغوا — فريقنا بيضيفها لطلبك في المكالمة 🙌
      </p>
    </div>
  )
}
