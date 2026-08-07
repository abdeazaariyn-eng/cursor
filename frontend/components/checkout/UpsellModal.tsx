'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { useCheckoutStore } from '@/store/checkout-store'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { formatKwd } from '@/lib/prices'
import { firePurchase, generateEventId } from '@/lib/events'

const UPSELL_DURATION = 12

export function UpsellModal() {
  const router = useRouter()
  const { isUpsellShown, pendingOrderId, pendingOrderTotal, upsellProduct, customerPhone, hideUpsell, reset } =
    useCheckoutStore()
  const { clearCart } = useCartStore()

  const [timeLeft, setTimeLeft] = useState(UPSELL_DURATION)
  const [isProcessing, setIsProcessing] = useState(false)

  const finalize = useCallback(
    async (upsellAction: 'accepted' | 'skipped') => {
      if (!pendingOrderId || isProcessing) return
      setIsProcessing(true)

      try {
        if (upsellAction === 'accepted' && upsellProduct) {
          await api.upsell(pendingOrderId, {
            action: 'accepted',
            productId: upsellProduct.productId,
          })
        } else {
          await api.upsell(pendingOrderId, { action: 'skipped' })
        }

        const purchaseEventId = generateEventId()

        const finalResponse = await api.finalizeOrder(pendingOrderId, {
          purchaseEventId,
          browserEventSent: true,
        })

        const finalTotal = finalResponse.orderNumber ? pendingOrderTotal + (upsellAction === 'accepted' && upsellProduct ? 9 : 0) : pendingOrderTotal

        firePurchase({
          value: finalTotal,
          eventId: purchaseEventId,
          orderId: finalResponse.orderNumber,
          phone: customerPhone ?? undefined,
        })

        clearCart()
        reset()
        hideUpsell()
        router.push(`/thank-you?order_id=${pendingOrderId}`)
      } catch (err) {
        console.error('Finalize error:', err)
        clearCart()
        reset()
        hideUpsell()
        if (pendingOrderId) {
          router.push(`/thank-you?order_id=${pendingOrderId}`)
        }
      }
    },
    [pendingOrderId, pendingOrderTotal, upsellProduct, isProcessing, clearCart, reset, hideUpsell, router]
  )

  useEffect(() => {
    if (!isUpsellShown) return
    setTimeLeft(UPSELL_DURATION)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          finalize('skipped')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isUpsellShown, finalize])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference * (1 - timeLeft / UPSELL_DURATION)

  return (
    <AnimatePresence>
      {isUpsellShown && upsellProduct && (
        <motion.div
          key="upsell-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            key="upsell-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="عرض خاص"
          >
            {/* Gold header */}
            <div className="bg-[#D4AF37] px-5 py-3 text-center">
              <p className="text-white font-bold text-sm">عرض خاص قبل ما نجهز طلبك</p>
            </div>

            <div className="p-5">
              {/* Countdown timer */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 rotate-[-90deg]" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#EBF2F5"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-[#142B3B] text-xl">{timeLeft}</span>
                  </div>
                </div>
              </div>

              {/* Product */}
              <div className="bg-[#EBF2F5] rounded-2xl p-4 mb-4 text-center">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-xl overflow-hidden bg-white">
                  <img src={upsellProduct.image} alt={upsellProduct.productName} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-[#142B3B] text-sm mb-1">
                  {upsellProduct.productName}
                </p>
                <p className="text-[#506A77] text-xs leading-relaxed mb-3">
                  أضيفيه مع نفس الطلب بسعر{' '}
                  <span className="text-[#D4AF37] font-bold">9 KWD فقط</span>.
                  العرض يظهر مرة واحدة بعد تأكيد الطلب.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-[#4A8B9A]">9 KWD</span>
                  <span className="text-[#6B8A99] text-sm line-through">19 KWD</span>
                </div>
              </div>

              {/* Trust */}
              <p className="text-xs text-[#267A4A] text-center mb-4">
                بدون رسوم دفع الآن، الدفع عند الاستلام.
              </p>

              {/* إضافة خاصة label */}
              <p className="text-xs text-center text-[#6B8A99] mb-3">
                إضافة خاصة بعد الطلب - 9 KWD
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => finalize('accepted')}
                  variant="primary"
                  fullWidth
                  loading={isProcessing}
                  size="lg"
                >
                  أضيفيه لطلبي
                </Button>
                <Button
                  onClick={() => finalize('skipped')}
                  variant="ghost"
                  fullWidth
                  disabled={isProcessing}
                  size="md"
                >
                  لا شكرا، كملي الطلب
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
