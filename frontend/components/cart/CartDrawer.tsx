'use client'

import { useEffect } from 'react'
import { X, ShoppingCart, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart-store'
import { useCheckoutStore } from '@/store/checkout-store'
import { Button } from '@/components/ui/Button'
import { CartItemRow } from './CartItemRow'
import { CrossSellCard } from './CrossSellCard'
import { getCrossSells, getProductById } from '@/data/products'
import { formatKwd } from '@/lib/prices'
import { fireInitiateCheckout } from '@/lib/events'
import { generateEventId } from '@/lib/events'

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotal, getSavings } = useCartStore()
  const { openCheckout } = useCheckoutStore()

  const total = getTotal()
  const savings = getSavings()

  const cartProductIds = items.map((i) => i.productId)
  const firstProduct = items[0]
  const crossSells = firstProduct
    ? getCrossSells(firstProduct.productId).filter(
        (p) => !cartProductIds.includes(p.id)
      )
    : []

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleCheckout = () => {
    closeCart()
    fireInitiateCheckout({
      value: total,
      contentIds: cartProductIds,
      eventId: generateEventId(),
    })
    openCheckout()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer - slides from left in RTL */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 start-0 w-full max-w-sm bg-[#F5F8FA] z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="سلة المشتريات"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#D6E4E8] bg-white">
              <div>
                <h2 className="font-bold text-[#142B3B] text-lg">طلبك جاهز تقريبا</h2>
                <p className="text-xs text-[#506A77] mt-0.5 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  دفع عند الاستلام، وتأكيد قبل الشحن.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-[#EBF2F5] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A8B9A]"
                aria-label="إغلاق السلة"
              >
                <X className="w-5 h-5 text-[#506A77]" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <ShoppingCart className="w-12 h-12 text-[#D4BEB7] mb-4" />
                  <p className="text-[#506A77] font-medium mb-2">سلتك فارغة</p>
                  <p className="text-[#6B8A99] text-sm">اختاري منتجاً لتبدأ طلبك</p>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-4">
                  {/* Cart Items */}
                  <div className="flex flex-col gap-3">
                    {items.map((item, i) => (
                      <CartItemRow key={`${item.productId}-${item.offerId}-${i}`} item={item} />
                    ))}
                  </div>

                  {/* Savings line */}
                  {savings > 0 && (
                    <div className="bg-[#EFF7F3] border border-[#C5E0D3] rounded-xl px-4 py-2 flex items-center justify-between">
                      <span className="text-[#267A4A] text-sm font-medium">وفرتِ</span>
                      <span className="text-[#267A4A] font-bold">{formatKwd(savings)}</span>
                    </div>
                  )}

                  {/* Cross-sells */}
                  {crossSells.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-[#142B3B] mb-2">
                        أمهات كثير يضيفون معها
                      </p>
                      <div className="flex flex-col gap-2">
                        {crossSells.slice(0, 2).map((product) => (
                          <CrossSellCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scarcity */}
                  <p className="text-xs text-[#6B8A99] text-center bg-[#EBF2F5] rounded-xl px-4 py-2">
                    العروض محدودة حسب الكمية المتوفرة هذا الأسبوع.
                  </p>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[#D6E4E8] bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#506A77] font-medium">الإجمالي</span>
                  <span className="text-[#142B3B] font-bold text-xl">{formatKwd(total)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  variant="primary"
                  fullWidth
                  size="lg"
                >
                  تأكيد الطلب
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
