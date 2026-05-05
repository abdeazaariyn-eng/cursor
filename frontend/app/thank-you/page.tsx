'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Phone, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { Button } from '@/components/ui/Button'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { clearCart, items } = useCartStore()

  useEffect(() => {
    if (items.length > 0) {
      clearCart()
    }
  }, [clearCart, items.length])

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#EFF7F3] rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#267A4A]" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#2F2523] mb-3">
          تم استلام طلبك بنجاح
        </h1>

        <p className="text-[#7B5E57] text-base leading-relaxed mb-2">
          شكرا لاختيارك مهد بيبي. راح نتواصل معك على رقم الجوال لتأكيد الطلب قبل الشحن.
        </p>

        {orderId && (
          <p className="text-[#9A7D78] text-sm mb-6">
            رقم الطلب: <span className="font-mono font-bold text-[#B97863]">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}

        {/* Reminder */}
        <div className="bg-[#FFF9E6] border border-[#F5E0A0] rounded-2xl p-4 mb-8 flex items-start gap-3">
          <Phone className="w-5 h-5 text-[#D9A441] flex-shrink-0 mt-0.5" />
          <div className="text-right">
            <p className="font-semibold text-[#2F2523] text-sm mb-1">تذكير مهم</p>
            <p className="text-[#7B5E57] text-sm leading-relaxed">
              خليك قريبة من الجوال عشان نقدر نأكد الطلب بسرعة ونرسل لك طلبك في أقرب وقت.
            </p>
          </div>
        </div>

        {/* COD info */}
        <div className="bg-[#EFF7F3] border border-[#C5E0D3] rounded-2xl p-4 mb-8 text-center">
          <p className="text-[#267A4A] font-semibold text-sm mb-1">
            الدفع عند الاستلام فقط
          </p>
          <p className="text-[#5A9A78] text-xs">
            لا يوجد أي رسوم مسبقة. ادفعي بعد ما تستلمين الطلب وتتأكدين منه.
          </p>
        </div>

        {/* Support */}
        <p className="text-[#7B5E57] text-sm mb-6">
          إذا تحتاجين مساعدة تواصلي معنا:{' '}
          <a
            href="https://wa.me/966XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B97863] font-medium underline"
          >
            واتساب [أضيفي الرقم]
          </a>
        </p>

        {/* Soft cross-sell (no discount) */}
        <div className="border-t border-[#F0E3DC] pt-6 mb-6">
          <p className="text-[#7B5E57] text-sm mb-4">
            بينما تنتظرين طلبك، اكتشفي منتجاتنا الأخرى:
          </p>
          <Link href="/products">
            <Button variant="secondary" size="md">
              تصفحي المزيد من المنتجات
              <ArrowLeft className="w-4 h-4 me-2" />
            </Button>
          </Link>
        </div>

        <Link href="/" className="text-[#B97863] text-sm underline">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#B97863] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7B5E57]">جاري التحميل...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
