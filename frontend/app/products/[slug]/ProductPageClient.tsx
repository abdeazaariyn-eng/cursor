'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle, ShoppingCart, ChevronRight, Star, Shield, Award,
  HeartPulse, Clock, Leaf, Truck,
  Phone, Baby, Package, Microscope,
} from 'lucide-react'
import { OfferSelector } from '@/components/product/OfferSelector'
import { ReviewCard } from '@/components/product/ReviewCard'
import { FaqSection } from '@/components/product/FaqSection'
import { ProductCard } from '@/components/product/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { useCartStore } from '@/store/cart-store'
import { fireAddToCart, generateEventId } from '@/lib/events'
import { formatKwd, OFFER_CONFIG, type OfferId } from '@/lib/prices'
import { getCrossSells, type Product } from '@/data/products'
import { cn } from '@/lib/utils'

interface Props {
  product: Product
}

export function ProductPageClient({ product }: Props) {
  const [selectedOffer, setSelectedOffer] = useState<OfferId>('two_pieces')
  const [added, setAdded] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const { addItem, openCart } = useCartStore()

  const crossSells = getCrossSells(product.id).slice(0, 2)
  const avgRating =
    product.reviews.reduce((s, r) => s + r.stars, 0) / product.reviews.length || 4.9
  const offer = OFFER_CONFIG[selectedOffer]

  useEffect(() => {
    const handleScroll = () => {
      const buyBox = document.getElementById('buy-box')
      if (buyBox) {
        setIsSticky(buyBox.getBoundingClientRect().bottom < 100)
      } else {
        setIsSticky(window.scrollY > 500)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAddToCart = () => {
    const priceData = OFFER_CONFIG[selectedOffer]
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.shortName,
      offerId: selectedOffer,
      quantity: priceData.quantity,
      unitLabel: priceData.label,
      priceKwd: priceData.priceKwd,
      originalPriceKwd: priceData.originalPriceKwd,
      image: product.image,
    })
    fireAddToCart({
      value: priceData.priceKwd,
      contentIds: [product.id],
      contentName: product.arabicName,
      eventId: generateEventId(),
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      openCart()
    }, 700)
  }

  return (
    <>
      {/* ─── Breadcrumb ─── */}
      <div className="bg-[#F5F8FA] py-3 px-4 border-b border-[#E8EEF1]">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#506A77]" aria-label="breadcrumb">
            <Link href="/" className="hover:text-[#4A8B9A] transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180 text-[#B0C4CE]" />
            <Link href="/products" className="hover:text-[#4A8B9A] transition-colors">المنتجات</Link>
            <ChevronRight className="w-3 h-3 rotate-180 text-[#B0C4CE]" />
            <span className="text-[#142B3B] font-semibold">{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          1. HERO — Product image + Buy box
      ═══════════════════════════════════════════ */}
      <section className="bg-[#F5F8FA] pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-sm group">
                <Image
                  src={product.image}
                  alt={product.arabicName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-5 end-5">
                  <Badge variant="primary" className="text-xs px-4 py-1.5 font-semibold shadow-sm">
                    {product.badge}
                  </Badge>
                </div>
              </div>
              {/* Trust chip beneath image */}
              <div className="flex items-center justify-center gap-6 mt-5 text-xs text-[#506A77]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#3B8263]" />
                  مطابق لمعايير SFDA
                </span>
                <span className="w-px h-3 bg-[#D6E4E8]" />
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ضمان 30 يوم
                </span>
                <span className="w-px h-3 bg-[#D6E4E8]" />
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#4A8B9A]" />
                  دفع عند الاستلام
                </span>
              </div>
            </div>

            {/* Buy Box */}
            <div className="flex flex-col" id="buy-box">
              <h1 className="text-3xl md:text-[2.75rem] font-extrabold text-[#142B3B] leading-[1.2] mb-4 tracking-tight">
                {product.heroHeading}
              </h1>
              <p className="text-[#506A77] text-lg leading-relaxed mb-6">
                {product.heroSubheading}
              </p>

              {/* Rating — minimal */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#E8EEF1]">
                <StarRating rating={avgRating} size="md" />
                <span className="text-[#142B3B] font-semibold text-sm">{avgRating.toFixed(1)}</span>
                <span className="text-[#506A77] text-sm">
                  ({(product.reviews.length * 142).toLocaleString()} تقييم)
                </span>
              </div>

              {/* Offer selection */}
              <div className="mb-8">
                <p className="font-semibold text-[#142B3B] mb-3 text-sm">
                  اختاري العرض المناسب:
                </p>
                <OfferSelector selectedOffer={selectedOffer} onChange={setSelectedOffer} />
              </div>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                className={cn(
                  'text-lg h-14 rounded-2xl font-bold transition-all duration-300',
                  added && 'bg-[#3B8263] hover:bg-[#3B8263]'
                )}
              >
                {added ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> تمت الإضافة
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center w-full">
                    <ShoppingCart className="w-5 h-5" />
                    اطلبي الآن — {formatKwd(offer.priceKwd)}
                  </span>
                )}
              </Button>

              <p className="text-center text-xs text-[#506A77] mt-3">
                الدفع عند الاستلام · طلبات اليوم تُشحن غداً
              </p>

              {/* Emotional hook — as a quiet quote */}
              <blockquote className="mt-8 border-r-2 border-[#4A8B9A] pr-4 text-[#506A77] text-base leading-relaxed italic">
                &ldquo;{product.emotionalHook}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. WHY THIS PRODUCT — Benefits
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">لماذا {product.shortName}؟</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] leading-tight">
              {product.painHeading}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto">
            {product.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#EBF2F5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-[#4A8B9A]" />
                </div>
                <p className="text-[#142B3B] text-base leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. MATERIALS & QUALITY
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F8FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">الجودة والمواد</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] leading-tight">
              ما نساوم على جودة المواد اللي تلامس بشرة طفلك
            </h2>
            <p className="text-[#506A77] text-lg mt-4 leading-relaxed">
              كل جزء في {product.shortName} مصنوع من مواد طبية فائقة الجودة، اختُبرت لتكون آمنة تماماً.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              {
                icon: <Leaf className="w-5 h-5 text-[#3B8263]" />,
                title: 'خالٍ من المواد الضارة',
                desc: 'لا BPA، لا BPS، لا فثالات — مواد آمنة حتى عند الاستخدام المتكرر.',
              },
              {
                icon: <Baby className="w-5 h-5 text-[#4A8B9A]" />,
                title: 'مناسب للبشرة الحساسة',
                desc: 'مصمم لبشرة الرضيع الرقيقة. لا احمرار، لا تهيج.',
              },
              {
                icon: <Microscope className="w-5 h-5 text-[#506A77]" />,
                title: 'مختبر سريرياً',
                desc: 'اختبارات نعومة ومقاومة أُجريت في مختبرات معتمدة دولياً.',
              },
              {
                icon: <Shield className="w-5 h-5 text-[#3B8263]" />,
                title: 'مواد طبية درجة أولى',
                desc: 'نفس مستوى المواد المستخدمة في المستشفيات المتخصصة.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8EEF1]">
                <div className="w-10 h-10 rounded-xl bg-[#F5F8FA] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="font-bold text-[#142B3B] text-[15px] mb-1.5">{item.title}</h4>
                <p className="text-[#506A77] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. TRUST & AUTHORITY
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#142B3B]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[#D4AF37] font-semibold text-sm mb-3 tracking-wide">الاعتماد والموثوقية</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              ليش الأمهات يثقون فينا؟
            </h2>
            <p className="text-[#8CA4B0] text-lg mt-4 leading-relaxed">
              لأن الراحة هي أمان موثق بالأرقام والشهادات — منتجاتنا حصيلة أبحاث واختبارات صارمة.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {[
              { value: 'SFDA', label: 'معتمد رسمياً', color: 'text-[#D4AF37]' },
              { value: '30 يوم', label: 'ضمان استرجاع كامل', color: 'text-white' },
              { value: '98%', label: 'نسبة رضا الأمهات', color: 'text-white' },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6 px-4 rounded-2xl bg-white/[0.05] border border-white/[0.08]">
                <p className={cn('text-2xl font-extrabold mb-1', stat.color)}>{stat.value}</p>
                <p className="text-[#8CA4B0] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-5 max-w-3xl mx-auto">
            {product.proofBlocks.map((proof, i) => (
              <li key={i} className="flex items-start gap-4">
                <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-white/90 text-base leading-relaxed">{proof}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">كيف يُستخدم</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] leading-tight">
              استخدام بديهي، بدون تعقيد
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'جهزي المنتج', desc: 'جاهز للاستخدام الفوري — بدون تركيب معقد.' },
              { num: '02', title: 'استخدميه بسهولة', desc: 'تصميم مريح يندمج مع روتينك وروتين طفلك بسلاسة.' },
              { num: '03', title: 'ارتاحي واستمتعي', desc: 'نتيجة فورية تريح قلبك وتوفر طاقتك ووقتك.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <span className="text-[#4A8B9A]/20 font-extrabold text-5xl block mb-3">{step.num}</span>
                <h4 className="font-bold text-[#142B3B] text-lg mb-2">{step.title}</h4>
                <p className="text-[#506A77] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. REVIEWS
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F8FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">تجارب حقيقية</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] leading-tight mb-3">
              أمهات جربوا قبلك
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-[#506A77]">
              <StarRating rating={avgRating} size="sm" />
              <span className="font-semibold text-[#142B3B]">{avgRating.toFixed(1)}</span>
              <span>من {(product.reviews.length * 142).toLocaleString()} تقييم</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {product.reviews.map((review, i) => (
              <ReviewCard key={i} name={review.name} text={review.text} stars={review.stars} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. FAQ
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">أسئلة شائعة</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B]">
              كل اللي في بالك... جاوبناه
            </h2>
          </div>
          <FaqSection faqs={product.faqs} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. ORDER PROCESS
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F5F8FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">بعد الطلب</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B]">
              عملية شفافة — بدون مفاجآت
            </h2>
          </div>

          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle className="w-6 h-6 text-[#4A8B9A]" />, title: 'مراجعة فورية', desc: 'نراجع طلبك ونجهز ملفك.' },
              { icon: <Phone className="w-6 h-6 text-[#4A8B9A]" />, title: 'تأكيد خلال 24 ساعة', desc: 'نتصل لتأكيد العنوان قبل الشحن.' },
              { icon: <Package className="w-6 h-6 text-[#4A8B9A]" />, title: 'تجهيز وشحن', desc: 'يُحضّر ويُشحن بأسرع وقت.' },
              { icon: <Truck className="w-6 h-6 text-[#4A8B9A]" />, title: 'استلام وادفع', desc: 'يوصلك، تتأكدين منه، وتدفعين.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-[#E8EEF1]">
                  {item.icon}
                </div>
                <h4 className="font-bold text-[#142B3B] text-sm mb-1">{item.title}</h4>
                <p className="text-[#506A77] text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. CROSS SELLS
      ═══════════════════════════════════════════ */}
      {crossSells.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-t border-[#E8EEF1]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-[#4A8B9A] font-semibold text-sm mb-3 tracking-wide">قد يعجبك أيضاً</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#142B3B]">
                منتجات تكمل روتينك
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {crossSells.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          10. GUARANTEE STRIP
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#142B3B]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Award className="w-12 h-12 text-[#D4AF37] mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            ضمان مهد بيبي الذهبي — 30 يوم
          </h2>
          <p className="text-[#8CA4B0] text-base leading-relaxed mb-8 max-w-xl mx-auto">
            إذا ما حسيتِ بفرق حقيقي خلال 30 يوم، نرد لك فلوسك كاملة بدون أي أسئلة.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {['استرجاع كامل خلال 30 يوم', 'بدون شروط', 'عبر واتساب في دقائق'].map((label, i) => (
              <span key={i} className="flex items-center gap-1.5 text-white/80">
                <CheckCircle className="w-3.5 h-3.5 text-[#3B8263]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STICKY BAR
      ═══════════════════════════════════════════ */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E8EEF1] px-4 py-3 transition-transform duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]',
          isSticky ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#142B3B] text-sm truncate">{product.shortName}</p>
            <p className="text-[#4A8B9A] text-sm font-bold mt-0.5">
              {formatKwd(OFFER_CONFIG[selectedOffer].priceKwd)}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-shrink-0 px-6 font-bold"
          >
            اطلبي الآن
          </Button>
        </div>
      </div>
    </>
  )
}
