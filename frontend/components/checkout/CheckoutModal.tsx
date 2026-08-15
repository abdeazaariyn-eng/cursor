'use client'

import { useState } from 'react'
import { X, Package, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/store/cart-store'
import { useCheckoutStore } from '@/store/checkout-store'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { api, ApiError } from '@/lib/api'
import { formatKwd } from '@/lib/prices'
import { validatePhone } from '@/lib/phone'
import { generateEventId, getAttributionFromBrowser } from '@/lib/events'
import { getProductById } from '@/data/products'

const schema = z.object({
  name: z.string().trim().min(2, 'اكتبي اسمك عشان نأكد الطلب'),
  phone: z.string().refine(validatePhone, 'اكتبي رقم جوال صحيح (مثال: 5XXXXXXXX أو 05XXXXXXXX)'),
})

type FormValues = z.infer<typeof schema>

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, setPendingOrder, showUpsell } = useCheckoutStore()
  const { items, getTotal } = useCartStore()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = getTotal()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const handleClose = () => {
    closeCheckout()
    setServerError(null)
    reset()
  }

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) return
    setIsSubmitting(true)
    setServerError(null)

    const leadEventId = generateEventId()
    const purchaseEventId = generateEventId()
    const attribution = getAttributionFromBrowser()

    try {
      const response = await api.createOrder({
        customer: { name: values.name.trim(), phone: values.phone.trim() },
        items: items.map((item) => ({
          productId: item.productId,
          offerId: item.offerId,
          variantName: item.name,
          color: item.color,
        })),
        attribution: {
          landingPage: attribution.landingPage,
          source: attribution.source,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          utmContent: attribution.utmContent,
          utmTerm: attribution.utmTerm,
          fbp: attribution.fbp,
          fbc: attribution.fbc,
          ttp: attribution.ttp,
          ttclid: attribution.ttclid,
          scClickId: attribution.scClickId,
        },
        events: { leadEventId, purchaseEventId },
      })

      const upsellProductData = response.recommendedUpsell
        ? getProductById(response.recommendedUpsell.productId)
        : null

      setPendingOrder(
        response.orderId,
        response.orderNumber,
        response.totalKwd,
        upsellProductData
          ? {
              productId: upsellProductData.id,
              productName: upsellProductData.arabicName,
              priceKwd: 9,
              image: upsellProductData.image,
            }
          : null,
        values.phone.trim(),
      )

      reset()
      showUpsell()
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message)
      } else {
        setServerError('حدث خطأ غير متوقع. حاولي مرة ثانية.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={handleClose}
          >
            <motion.div
              key="checkout-modal"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="تأكيد الطلب"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#D6E4E8] flex-shrink-0 bg-white">
                <div>
                  <h2 className="font-bold text-[#142B3B] text-xl">تأكيد الطلب</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={5} size="sm" />
                    <span className="text-xs text-[#6B8A99]">+1,200 أم واثقة</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#EBF2F5] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A8B9A]"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5 text-[#506A77]" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Package className="w-12 h-12 text-[#8CA4B0] mb-3" />
                    <h3 className="text-base font-bold text-[#142B3B] mb-1">سلتك فارغة</h3>
                    <p className="text-xs text-[#6B8A99] mb-5">يرجى اختيار منتج قبل المتابعة لتأكيد الطلب</p>
                    <Button variant="primary" size="md" onClick={handleClose}>
                      تصفح المنتجات
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Order Summary */}
                    <div className="bg-[#EBF2F5] rounded-2xl p-4 mb-5">
                      <h3 className="text-sm font-semibold text-[#506A77] mb-2">ملخص طلبك</h3>
                      <div className="flex flex-col gap-1.5">
                        {items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-[#142B3B] font-medium">{item.name}</span>
                            <span className="text-[#4A8B9A] font-bold">{formatKwd(item.priceKwd)}</span>
                          </div>
                        ))}
                        <div className="border-t border-[#C9DADD] mt-2 pt-2 flex items-center justify-between">
                          <span className="font-bold text-[#142B3B]">الإجمالي</span>
                          <span className="font-bold text-[#4A8B9A] text-lg">{formatKwd(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* COD Trust */}
                    <div className="flex items-center gap-2 mb-5 text-[#267A4A] text-sm">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span>دفع عند الاستلام — بدون دفع مسبق</span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="checkout-name"
                          className="block text-sm font-semibold text-[#142B3B] mb-1.5"
                        >
                          الاسم <span aria-hidden="true" className="text-[#B42318]">*</span>
                        </label>
                        <input
                          id="checkout-name"
                          type="text"
                          autoComplete="name"
                          placeholder="اسمك الكريم"
                          className={`w-full border rounded-xl px-4 py-3 text-[#142B3B] placeholder:text-[#8CA4B0] focus:outline-none focus:ring-1 transition-colors text-base ${
                            errors.name
                              ? 'border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]'
                              : 'border-[#D4BEB7] focus:border-[#4A8B9A] focus:ring-[#4A8B9A]'
                          }`}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-[#B42318] text-sm mt-1" role="alert">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="checkout-phone"
                          className="block text-sm font-semibold text-[#142B3B] mb-1.5"
                        >
                          رقم الجوال <span aria-hidden="true" className="text-[#B42318]">*</span>
                        </label>
                        <input
                          id="checkout-phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder="5XXXXXXXX أو 05XXXXXXXX"
                          dir="ltr"
                          className={`w-full border rounded-xl px-4 py-3 text-[#142B3B] placeholder:text-[#8CA4B0] focus:outline-none focus:ring-1 transition-colors text-base text-right ${
                            errors.phone
                              ? 'border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]'
                              : 'border-[#D4BEB7] focus:border-[#4A8B9A] focus:ring-[#4A8B9A]'
                          }`}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-[#B42318] text-sm mt-1" role="alert">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Server error */}
                      {serverError && (
                        <div className="bg-[#FFF0F0] border border-[#F5C6C6] rounded-xl px-4 py-3 text-[#B42318] text-sm" role="alert">
                          {serverError}
                        </div>
                      )}

                      {/* Submit */}
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="lg"
                        loading={isSubmitting}
                      >
                        أكدي طلبي الآن
                      </Button>

                      {/* Microcopy */}
                      <p className="text-xs text-[#6B8A99] text-center leading-relaxed">
                        الدفع عند الاستلام، وراح نتواصل معك لتأكيد الطلب قبل الشحن.
                      </p>

                      {/* Privacy */}
                      <p className="text-xs text-[#6B8A99] text-center">
                        بمتابعة الطلب، أنتِ توافقين على{' '}
                        <a href="/privacy" className="text-[#4A8B9A] underline" target="_blank">
                          سياسة الخصوصية
                        </a>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
