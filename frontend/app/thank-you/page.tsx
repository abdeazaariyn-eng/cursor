'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle,
  Package,
  Truck,
  ShieldCheck,
  Star,
  Clock,
} from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/Button'
import { api, GetOrderResponse } from '@/lib/api'
import { PRODUCTS } from '@/data/products'
import { ReviewCard } from '@/components/product/ReviewCard'
import { CallHeroBanner } from '@/components/thankyou/CallHeroBanner'
import { CallExpectations } from '@/components/thankyou/CallExpectations'
import { OrderRecap } from '@/components/thankyou/OrderRecap'
import { PayoffTimeline } from '@/components/thankyou/PayoffTimeline'
import { SmartSuggestions } from '@/components/thankyou/SmartSuggestions'
import { getFirstName, getDeliveryEta } from '@/lib/order-display'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+96550000000'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get('order_id') ?? null
  const { clearCart, items } = useCartStore()
  const [order, setOrder] = useState<GetOrderResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length > 0) {
      clearCart()
    }
  }, [clearCart, items.length])

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    api.getOrder(orderId).then((data) => {
      setOrder(data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4A8B9A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#506A77]">جاري تحميل تفاصيل طلبك...</p>
        </div>
      </div>
    )
  }

  const firstName = order?.customerName ? getFirstName(order.customerName) : ''
  const deliveryEta = getDeliveryEta()

  const reviews = [
    { name: 'أم فهد', text: 'ردوا علي بسرعة وأكدوا الطلب، والتوصيل كان أسرع من المتوقع!', stars: 5 },
    { name: 'م. الشمري', text: 'المنتج وصل نظيف ومغلف حلو، وولدي حبه من أول يوم.', stars: 5 },
    { name: 'أم عبدالله', text: 'خدمة ممتازة، تواصلوا معي وأكدوا كل شي قبل الشحن.', stars: 5 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9F4] via-white to-white py-8 px-4">
      <div className="max-w-2xl w-full mx-auto">

        {/* ===== SUCCESS HEADER ===== */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-[#EFF7F3] rounded-full flex items-center justify-center animate-[bounce_1s_ease-in-out]">
              <CheckCircle className="w-11 h-11 text-[#267A4A]" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#142B3B] mb-2">
            {firstName ? `شكراً ${firstName}! طلبك مسجل ✨` : 'شكراً! طلبك مسجل ✨'}
          </h1>

          <p className="text-[#506A77] text-base leading-relaxed">
            اختيارك ممتاز! باقي خطوة وحدة بسيطة وطلبك في الطريق لك.
          </p>
        </div>

        {/* ===== 🔥 THE CALL HERO BANNER (MOST IMPORTANT) ===== */}
        {order && (
          <CallHeroBanner
            createdAt={order.createdAt}
            customerPhoneMasked={order.customerPhoneMasked}
          />
        )}

        {/* ===== WHAT WE'LL ASK ON THE CALL ===== */}
        <CallExpectations />

        {/* ===== ORDER RECAP (REDESIGNED) ===== */}
        {order && <OrderRecap order={order} />}

        {/* ===== WHAT HAPPENS NEXT (TIMELINE) ===== */}
        <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm p-5 mb-6">
          <h2 className="font-bold text-[#142B3B] text-base mb-4">وش يصير الحين؟</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EFF7F3] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-[#267A4A]" />
              </div>
              <div>
                <p className="text-[#142B3B] text-sm font-semibold">١. نتصل ونأكد</p>
                <p className="text-[#6B8A99] text-xs mt-0.5">نتأكد من عنوانك ونجهز طلبك للشحن</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF2F5] flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-[#4A8B9A]" />
              </div>
              <div>
                <p className="text-[#142B3B] text-sm font-semibold">٢. نجهز ونشحن</p>
                <p className="text-[#6B8A99] text-xs mt-0.5">طلبك يتغلف بعناية ويتسلم لشركة التوصيل</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFF8E1] flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-[#F57F17]" />
              </div>
              <div>
                <p className="text-[#142B3B] text-sm font-semibold">٣. يوصلك وتدفعين عند الباب</p>
                <p className="text-[#6B8A99] text-xs mt-0.5">
                  {deliveryEta} — لا دفع مسبق — تدفعين بس لما يوصل طلبك ✓
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PAYOFF TIMELINE ===== */}
        {order && <PayoffTimeline order={order} />}

        {/* ===== SOCIAL PROOF (REVIEWS) ===== */}
        <div className="mb-6">
          <h2 className="font-bold text-[#142B3B] text-base mb-3 text-center">أمهات مثلك اشتروا وقالوا:</h2>
          <div className="space-y-3">
            {reviews.map((review, idx) => (
              <ReviewCard key={idx} name={review.name} text={review.text} stars={review.stars} />
            ))}
          </div>
        </div>

        {/* ===== COD TRUST BADGE ===== */}
        <div className="bg-[#EFF7F3] border border-[#C5E0D3] rounded-2xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#267A4A]" />
            <p className="text-[#267A4A] font-bold text-sm">الدفع عند الاستلام — بدون أي رسوم مسبقة</p>
          </div>
          <p className="text-[#5A9A78] text-xs">
            ما نخصم منك ولا ريال حتى تستلمين طلبك وتتأكدين منه بنفسك.
          </p>
        </div>

        {/* ===== SMART PRODUCT SUGGESTIONS ===== */}
        {order && <SmartSuggestions order={order} />}

        {/* ===== SUPPORT ===== */}
        <div className="text-center mb-6">
          <p className="text-[#506A77] text-sm mb-2">
            أي سؤال؟ فريقنا موجود لك:
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#128C7E] font-medium text-sm px-4 py-2 rounded-full hover:bg-[#25D366]/20 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.546 4.093 1.504 5.82L0 24l6.335-1.652A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.91 0-3.72-.514-5.32-1.48l-.38-.23-3.96 1.04 1.06-3.87-.25-.39A9.787 9.787 0 012.18 12c0-5.42 4.4-9.82 9.82-9.82 5.42 0 9.82 4.4 9.82 9.82 0 5.42-4.4 9.82-9.82 9.82z"/>
            </svg>
            تواصلي واتساب
          </a>
        </div>

        {/* ===== BACK TO HOME ===== */}
        <div className="text-center">
          <Link href="/" className="text-[#4A8B9A] text-sm underline hover:text-[#366A77] transition-colors">
            العودة للرئيسية
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4A8B9A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#506A77]">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
