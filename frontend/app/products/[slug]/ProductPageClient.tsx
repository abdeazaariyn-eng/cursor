'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CheckCircle, ShoppingCart, ChevronRight, Star, Shield, Award,
  HeartPulse, Clock, Sparkles, Microscope, Baby, Leaf, Truck,
  Activity, Phone, BadgeCheck, Zap, Heart, Package,
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
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.id || '')
  const [added, setAdded] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const { addItem, openCart } = useCartStore()

  const crossSells = getCrossSells(product.id).slice(0, 2)
  const avgRating =
    product.reviews.reduce((s, r) => s + r.stars, 0) / product.reviews.length || 4.9
  const offer = OFFER_CONFIG[selectedOffer]
  const sectionImages = product.sectionImages

  // Use color specific image if available
  const activeColorObj = product.colors?.find(c => c.id === selectedColor)
  const displayImage = activeColorObj?.image || product.heroImage || product.image

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
      color: activeColorObj?.label,
      offerId: selectedOffer,
      quantity: priceData.quantity,
      unitLabel: priceData.label,
      priceKwd: priceData.priceKwd,
      originalPriceKwd: priceData.originalPriceKwd,
      image: displayImage || product.image,
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
      {/* ─── Announcement Bar ─── */}
      <div dir="rtl" className="bg-[#142B3B] text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold leading-relaxed">
        <span className="block sm:inline">🚚 توصيل لجميع المدن • 🛡️ ضمان استرجاع 30 يوم بدون أسئلة</span>
        <span className="hidden sm:inline"> • </span>
        <span className="block sm:inline text-[#D4AF37]">الدفع عند الاستلام ✓</span>
      </div>

      {/* ─── Breadcrumb ─── */}
      <div className="bg-[#F5F8FA] py-3 px-4 border-b border-[#D6E4E8]">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-[#506A77] font-medium" aria-label="breadcrumb">
            <Link href="/" className="hover:text-[#4A8B9A] transition-colors">الرئيسية</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <Link href="/products" className="hover:text-[#4A8B9A] transition-colors">المنتجات</Link>
            <ChevronRight className="w-3 h-3 rotate-180" />
            <span className="text-[#4A8B9A] font-bold">{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          1. HERO BUY BOX — Image LEFT, Buy Box RIGHT
      ═══════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#F5F8FA] to-white py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* ── Image (Left / top on mobile) ── */}
            <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden bg-[#EBF2F5] shadow-2xl border-[6px] border-white group">
              <Image
                src={displayImage}
                alt={product.arabicName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-[#142B3B]/10" />
              {/* Badge */}
              <div className="absolute top-6 end-6 z-20">
                <Badge variant="primary" className="shadow-lg text-sm px-5 py-2 font-bold">
                  {product.badge}
                </Badge>
              </div>
              {/* SFDA floating label */}
              <div className="absolute bottom-6 start-6 z-20 bg-[#142B3B]/88 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 max-w-[260px]">
                <div className="bg-[#D4AF37]/15 p-2 rounded-full border border-[#D4AF37]/30">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold text-white">معتمد SFDA</span>
                  <span className="block text-xs font-medium text-white/80">آمن تماماً لطفلك</span>
                </div>
              </div>
            </div>

            {/* ── Buy Box (Right) ── */}
            <div className="flex flex-col" id="buy-box">
              {/* Social proof / urgency pills */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full border border-red-100 shadow-sm">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-extrabold">طلب عالٍ جداً الآن 🔥</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-extrabold">متوفر — توصيل فوري</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-[#142B3B] leading-tight mb-4 tracking-tight">
                {product.heroHeading}
              </h1>
              <p className="text-[#506A77] text-lg md:text-xl leading-relaxed mb-6 font-medium">
                {product.heroSubheading}
              </p>

              {/* Review summary */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#D6E4E8]">
                <div className="flex items-center bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20">
                  <StarRating rating={avgRating} size="md" />
                  <span className="ml-2 mr-2 text-[#142B3B] font-bold text-sm">{avgRating.toFixed(1)}</span>
                </div>
                <span className="text-[#506A77] font-medium text-sm underline decoration-[#D6E4E8] underline-offset-4">
                  {(product.reviews.length * 142).toLocaleString()} أم سعودية وثقت رأيها
                </span>
              </div>

              {/* Emotional hook */}
              <div className="bg-gradient-to-r from-[#EBF2F5]/60 to-transparent rounded-2xl p-5 mb-8 border-r-4 border-[#4A8B9A]">
                <div className="flex items-start gap-3">
                  <HeartPulse className="w-6 h-6 text-[#4A8B9A] flex-shrink-0 mt-1" />
                  <p className="text-[#142B3B] text-base md:text-lg leading-relaxed font-bold">
                    &ldquo;{product.emotionalHook}&rdquo;
                  </p>
                </div>
              </div>

              {/* Offer selection */}
              <div className="mb-8 bg-white p-5 rounded-3xl shadow-sm border border-[#D6E4E8]">
                
                {/* Color Selection (if available) */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-[#E8F0F3]">
                    <p className="font-extrabold text-[#142B3B] mb-3 text-sm">
                      اختاري اللون: <span className="font-bold text-[#4A8B9A]">{activeColorObj?.label}</span>
                    </p>
                    <div className="flex gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={cn(
                            "relative w-14 h-14 rounded-full border-2 transition-all duration-200 shadow-sm overflow-hidden flex items-center justify-center",
                            selectedColor === color.id 
                              ? "border-[#4A8B9A] ring-2 ring-[#4A8B9A] ring-offset-2 scale-110 shadow-md" 
                              : "border-[#D6E4E8] hover:scale-105 hover:border-[#4A8B9A]/50"
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={color.label}
                          aria-label={`اختر اللون ${color.label}`}
                        >
                          {color.image && (
                            <Image 
                              src={color.image} 
                              alt={color.label} 
                              fill 
                              className="object-cover opacity-90"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="font-extrabold text-[#142B3B] mb-4 text-sm flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#4A8B9A]" />
                  اختاري العرض الأنسب (الكمية محدودة جداً):
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
                  'shadow-2xl text-xl h-16 rounded-2xl font-black transition-all duration-300 transform hover:-translate-y-1',
                  added && 'bg-[#267A4A] hover:bg-[#267A4A]'
                )}
              >
                {added ? (
                  <span className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" /> تمت الإضافة! جاري التجهيز...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 justify-center w-full">
                    <ShoppingCart className="w-6 h-6" />
                    اطلبي الآن — الدفع عند الاستلام ({formatKwd(offer.priceKwd)})
                  </span>
                )}
              </Button>

              {/* Micro trust row */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: <Award className="w-6 h-6 text-[#D4AF37]" />, label: 'ضمان ذهبي', sub: '30 يوم' },
                  { icon: <Truck className="w-6 h-6 text-[#4A8B9A]" />, label: 'توصيل سريع', sub: 'لجميع المدن' },
                  { icon: <Package className="w-6 h-6 text-green-600" />, label: 'دفع آمن', sub: 'عند الاستلام' },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center gap-2 p-3 bg-[#F5F8FA] rounded-xl border border-[#D6E4E8]">
                    {t.icon}
                    <span className="text-xs font-bold text-[#142B3B] leading-tight">{t.label}<br/>{t.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. PAIN & EMPATHY — Image LEFT, Text RIGHT
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden border-t border-[#D6E4E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Left */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-[#4A8B9A]/10 rounded-[3rem] rotate-6 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-[#EBF2F5] rounded-[2.5rem] flex flex-col items-center justify-center shadow-lg border border-white p-8 overflow-hidden">
                {sectionImages?.pain ? (
                  <>
                    <Image
                      src={sectionImages.pain}
                      alt={`مشهد يوضح تعب الأم مع ${product.shortName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142B3B]/70 via-[#142B3B]/25 to-white/5" />
                    <div className="absolute bottom-5 inset-x-5 z-20 rounded-2xl bg-[#142B3B]/88 backdrop-blur-md px-4 py-3 border border-white/10 shadow-2xl">
                      <p className="text-sm font-bold text-white text-center">نحس بجهدك وتعبك</p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center w-full">
                    <div className="text-7xl mb-4">🥺</div>
                    <p className="text-[#4A8B9A] font-bold text-center">[صورة تعبيرية لأم مرهقة أو قلقة]</p>
                    <p className="text-sm text-[#506A77] mt-2 text-center">نحس بجهدك وتعبك</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-8 -right-4 bg-white p-5 rounded-2xl shadow-xl border border-[#D6E4E8] max-w-[200px] z-10">
                <p className="text-sm font-bold text-[#142B3B] mb-1">&ldquo;{product.painHeading}&rdquo;</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />)}
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-[#4A8B9A]/10 text-[#4A8B9A] rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
                <HeartPulse className="w-4 h-4" />
                أنتِ مو لحالك
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-6 leading-tight">
                نعرف الضغط اللي تعيشينه كل يوم، بين الدوام والزوارات والبيت.
              </h2>
              <p className="text-[#506A77] text-lg md:text-xl mb-8 font-medium leading-relaxed">
                أمومتك ما تعني إنك تنسين راحتك. كل لحظة قلق، كل سهرة، وكل مشوار متعب — صممنا{' '}
                {product.shortName} عشان يشيل عنك هذا الحمل ويفك لك أزمة.
              </p>
              <div className="bg-[#EBF2F5]/60 p-6 rounded-2xl border border-[#D6E4E8]">
                <h3 className="font-bold text-[#142B3B] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#4A8B9A]" />
                  وش اللي بيتغير بيومك؟
                </h3>
                <ul className="space-y-4">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#142B3B] font-bold leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. INGREDIENTS & SCIENCE — Text LEFT, Image RIGHT
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#F0F8FF] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
                <Microscope className="w-4 h-4" />
                مواد صُنعت بحب واختُبرت بدقة
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-6 leading-tight">
                ما نساوم أبداً على جودة المواد اللي تلامس بشرة طفلك.
              </h2>
              <p className="text-[#506A77] text-lg mb-8 font-medium leading-relaxed">
                كل جزء في {product.shortName} مصنوع من مواد طبية فائقة الجودة، اختُبرت سريرياً لتكون آمنة تماماً وتمنع أي حساسية لطفلك الغالي.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: <Leaf className="w-6 h-6 text-green-600" />,
                    title: '100% BPA-Free — خالٍ من المواد السامة',
                    desc: 'لا BPA، لا BPS، لا فثالات. مواد لا تُطلق أي مركبات ضارة حتى عند التسخين المتكرر.',
                    bg: 'bg-green-50 border-green-100',
                  },
                  {
                    icon: <Baby className="w-6 h-6 text-[#4A8B9A]" />,
                    title: 'سيليكون طبي / نسيج هايبوالرجينيك',
                    desc: 'مصمم خصيصاً لبشرة الرضيع الرقيقة. لا احمرار، لا تهيج، لا حساسية — مضمون.',
                    bg: 'bg-[#FFF0EB] border-[#D6E4E8]',
                  },
                  {
                    icon: <Microscope className="w-6 h-6 text-blue-700" />,
                    title: 'مختبر سريرياً لبشرة الأطفال الحساسة',
                    desc: 'اختبارات تحسس، نعومة، ومقاومة حرارة — كلها أُجريت في مختبرات معتمدة دولياً.',
                    bg: 'bg-blue-50 border-blue-100',
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-[#2E8B57]" />,
                    title: 'مواد طبية درجة أولى — لا توافق على الثاني',
                    desc: 'نفس مستوى المواد المستخدمة في المستشفيات والعيادات المتخصصة في طب الأطفال.',
                    bg: 'bg-emerald-50 border-emerald-100',
                  },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border ${item.bg}`}>
                    <div className="bg-white p-2.5 rounded-xl shadow-sm flex-shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-[#142B3B] text-sm mb-1">{item.title}</h4>
                      <p className="text-[#506A77] text-xs font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Right */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/50 rounded-[3rem] -rotate-6 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-blue-50 p-8 overflow-hidden">
                {sectionImages?.materials ? (
                  <>
                    <Image
                      src={sectionImages.materials}
                      alt={`تفاصيل جودة مواد ${product.shortName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142B3B]/55 via-transparent to-white/10" />
                    <div className="absolute top-5 left-5 z-20 rounded-2xl bg-[#142B3B]/88 backdrop-blur-md px-4 py-2 border border-white/10 shadow-2xl max-w-[220px]">
                      <p className="text-xs font-bold text-white">تفاصيل جودة المواد الطبية</p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center w-full">
                    <div className="text-7xl mb-4">🔬</div>
                    <p className="text-blue-800 font-bold text-center text-sm">
                      [صورة مقربة (Macro) للمادة أو النسيج الطبي]
                    </p>
                    <p className="text-xs text-[#506A77] mt-2 text-center">تفاصيل جودة المواد الطبية</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-green-700 font-extrabold text-xl">100%</p>
                        <p className="text-green-600 text-xs font-semibold">BPA-Free</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-blue-700 font-extrabold text-xl">12+</p>
                        <p className="text-blue-600 text-xs font-semibold">اختبار جودة</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. SFDA AUTHORITY — Image LEFT, Text RIGHT
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#142B3B] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Left */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-white/5 rounded-[3rem] rotate-3 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-gradient-to-br from-[#1A384D] to-[#214358] rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl border border-[#29536C] p-8 overflow-hidden">
                {sectionImages?.authority ? (
                  <>
                    <Image
                      src={sectionImages.authority}
                      alt={`مشهد الثقة والجودة لمنتج ${product.shortName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142B3B]/75 via-[#142B3B]/25 to-transparent" />
                    <div className="absolute top-5 left-5 z-20 rounded-2xl bg-[#142B3B]/85 px-4 py-2 border border-white/10 shadow-2xl backdrop-blur-md">
                      <p className="text-xs font-bold text-white">اختيار مدروس ومعايير موثوقة</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Shield className="w-20 h-20 text-[#D4AF37] mb-5" />
                    <p className="text-white/90 font-bold text-base text-center leading-snug">
                      [صورة شهادة اعتماد SFDA أو شهادة مطابقة الجودة الدولية]
                    </p>
                  </>
                )}
                <div className="mt-8 bg-white/10 px-6 py-3 rounded-full flex items-center gap-3 border border-white/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-sm">اجتاز أكثر من 12 اختبار جودة</span>
                </div>
                {/* Stats row */}
                <div className="mt-5 grid grid-cols-2 gap-3 w-full">
                  <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-[#D4AF37] font-extrabold text-lg">SFDA</p>
                    <p className="text-white/60 text-xs">معتمد رسمياً</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-green-400 font-extrabold text-lg">30</p>
                    <p className="text-white/60 text-xs">يوم ضمان</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-4 py-1.5 mb-6 font-bold text-sm border border-[#D4AF37]/30">
                <BadgeCheck className="w-4 h-4" />
                السلطة الطبية والاعتماد
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                ليش دكاترة الأطفال والأمهات يثقون فينا؟
              </h2>
              <p className="text-[#8CA4B0] text-lg mb-8 leading-relaxed font-medium">
                لأن الراحة مو بس شعور، الراحة هي أمان موثق بالأرقام والشهادات. منتجاتنا مو عشوائية، هي حصيلة أبحاث واختبارات صارمة عشان تاخذينها وأنتِ مغمضة.
              </p>
              <ul className="space-y-6">
                {product.proofBlocks.map((proof, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl flex-shrink-0 mt-1 border border-white/5">
                      <Star className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                    </div>
                    <span className="text-white text-lg leading-relaxed font-bold">{proof}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white font-bold text-base text-center">
                  🏆 &quot;من أكثر المنتجات الموثوقة بين أمهات السعودية في 2026&quot;
                </p>
                <div className="flex justify-center mt-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. BEFORE → AFTER TRANSFORMATION — Text LEFT, Image RIGHT
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F8FA] overflow-hidden border-b border-[#D6E4E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#4A8B9A]/10 text-[#4A8B9A] rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
                <Zap className="w-4 h-4" />
                التحول الحقيقي
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-8 leading-tight">
                قبل {product.shortName}... وبعده.
              </h2>

              <div className="space-y-4">
                {/* Before */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <h4 className="font-extrabold text-red-700 text-sm mb-4 flex items-center gap-2">
                    <span className="bg-red-100 px-2 py-1 rounded-lg">قبل ❌</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {[
                      'قلق دائم وتوتر ما ينتهي',
                      'صعوبة في تنظيم الوقت والروتين',
                      'إرهاق من التنقل مع الطفل',
                      'خوف من منتجات غير موثوقة',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-red-700 text-sm font-medium">
                        <span className="text-red-400 font-bold">✗</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                  <h4 className="font-extrabold text-green-700 text-sm mb-4 flex items-center gap-2">
                    <span className="bg-green-100 px-2 py-1 rounded-lg">بعد ✅</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {[
                      'طمأنينة حقيقية وراحة بال تامة',
                      'روتين سلس وسهل ومنظم',
                      'حرية التنقل بدون أي توتر',
                      'منتج موثق ومضمون من SFDA',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-green-700 text-sm font-medium">
                        <span className="text-green-500 font-bold">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="shadow-xl font-black text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  اطلبي الآن — الدفع عند الاستلام
                </Button>
              </div>
            </div>

            {/* Image Right */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#4A8B9A]/10 rounded-[3rem] rotate-6 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-[#D6E4E8] p-8 overflow-hidden">
                {sectionImages?.beforeAfter ? (
                  <>
                    <Image
                      src={sectionImages.beforeAfter}
                      alt={`مشهد قبل وبعد استخدام ${product.shortName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#142B3B]/60 via-transparent to-white/5" />
                    <div className="absolute top-5 left-5 z-20 rounded-2xl bg-[#142B3B]/88 backdrop-blur-md px-4 py-2 border border-white/10 shadow-2xl">
                      <p className="text-xs font-bold text-white">الطمأنينة لها شكل</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-7xl mb-4">✨</div>
                    <p className="text-[#4A8B9A] font-bold text-center text-sm">
                      [صورة أم سعيدة ومرتاحة مع طفلها بعد الاستخدام]
                    </p>
                    <p className="text-xs text-[#506A77] mt-2 text-center">الطمأنينة لها شكل</p>
                  </>
                )}
                <div className="mt-6 bg-[#EBF2F5] rounded-2xl p-4 w-full text-center relative z-10">
                  <p className="text-[#142B3B] font-extrabold text-base">&ldquo;غيرت حياتي كلياً&rdquo;</p>
                  <p className="text-[#506A77] text-xs mt-1">— أم ريم، الرياض</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. HOW IT WORKS — Text LEFT, Image RIGHT
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
              <Clock className="w-4 h-4" />
              يوفر وقتك وجهدك
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-6 leading-tight">
              استخدام بديهي وسهل، بدون تعقيد ولا حوسة.
            </h2>
            <p className="text-[#506A77] text-lg mb-8 font-medium leading-relaxed">
              وقتك كأم ثمين جداً. صممنا هذا المنتج عشان يشتغل معاك من أول لحظة، بخطوات بسيطة وتكونين جاهزة.
            </p>

            <div className="space-y-6 relative before:absolute before:inset-y-0 before:start-[1.1rem] before:w-0.5 before:bg-[#D6E4E8]">
              {[
                { title: 'جهزي المنتج', desc: 'بدون تركيب معقد، جاهز للاستخدام الفوري من أول لحظة.' },
                { title: 'استخدميه بسهولة', desc: 'تصميم مريح يندمج مع روتينك وروتين طفلك بسلاسة تامة.' },
                { title: 'ارتاحي واستمتعي', desc: 'النتيجة الفورية اللي بتريح قلبك وتوفر طاقتك ووقتك.' },
              ].map((step, i) => (
                <div key={i} className="relative flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#4A8B9A] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10 shadow-md">
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-bold text-[#142B3B] text-lg mb-1">{step.title}</h4>
                    <p className="text-[#506A77] font-medium text-base leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. SOCIAL PROOF & REVIEWS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-[#F5F8FA] to-[#EBF2F5]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4A8B9A]/10 text-[#4A8B9A] rounded-full px-5 py-2 mb-6 font-extrabold text-sm border border-[#4A8B9A]/20 shadow-sm">
              <Star className="w-5 h-5 fill-current" />
              أكثر من {(product.reviews.length * 142).toLocaleString()} قصة نجاح حقيقية
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#142B3B] mb-6 tracking-tight">
              أمهات ارتاحوا قبلك،
              <br className="hidden md:block" />
              اسمعي تجاربهن الحقيقية.
            </h2>
            <p className="text-[#506A77] text-xl font-medium max-w-2xl mx-auto">
              هذي مو مجرد تقييمات. هذي قصص حقيقية من أمهات كانوا يعانون من نفس مشاكلك، واليوم روتينهن صار أسهل وأسعد.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {product.reviews.map((review, i) => (
              <div key={i} className="transform hover:-translate-y-2 transition-transform duration-300">
                <ReviewCard name={review.name} text={review.text} stars={review.stars} />
              </div>
            ))}
          </div>

          {/* Aggregate stats */}
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-[#D6E4E8]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { num: `${(product.reviews.length * 142).toLocaleString()}+`, label: 'أم استخدمته' },
                { num: '4.9', label: 'متوسط التقييم ⭐' },
                { num: '98%', label: 'نسبة الرضا' },
                { num: '30 يوم', label: 'ضمان الاسترجاع' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#4A8B9A] mb-1">{stat.num}</p>
                  <p className="text-[#506A77] text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 shadow-xl text-lg font-bold"
            >
              انضمي لهن واطلبي الحين
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. FAQ
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-[#D6E4E8]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#142B3B] mb-4">
              كل الأسئلة اللي في بالك... جاوبناها
            </h2>
            <p className="text-[#506A77] text-lg font-medium">
              عشان تطلبين وأنتِ متطمنة ومرتاحة 100%.
            </p>
          </div>
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border-2 border-[#D6E4E8] shadow-lg">
            <FaqSection faqs={product.faqs} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. DELIVERY & CONFIRMATION PROCESS
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5F8FA] border-t border-[#D6E4E8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#4A8B9A]/10 text-[#4A8B9A] rounded-full px-4 py-1.5 mb-4 font-bold text-sm">
              <Package className="w-4 h-4" />
              بعد ما تطلبين... وش يصير؟
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-4">
              عملية طلب شفافة 100% — بدون مفاجآت
            </h2>
            <p className="text-[#506A77] text-lg font-medium max-w-2xl mx-auto">
              نؤمن بالوضوح التام. هذا بالضبط اللي يصير بعد ما تضغطين &quot;اطلبي الآن&quot;.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="w-8 h-8 text-[#4A8B9A]" />,
                step: '01',
                title: 'مراجعة طلبك',
                desc: 'بمجرد إتمام طلبك، نراجعه فوراً في نظامنا ونجهز ملفك.',
                color: 'bg-[#FFF0EB] border-[#D6E4E8]',
              },
              {
                icon: <Phone className="w-8 h-8 text-blue-600" />,
                step: '02',
                title: 'تأكيد الطلب',
                desc: 'نتصل عليك خلال 24 ساعة لتأكيد الطلب والعنوان قبل الشحن.',
                color: 'bg-blue-50 border-blue-100',
              },
              {
                icon: <Package className="w-8 h-8 text-[#2E8B57]" />,
                step: '03',
                title: 'التجهيز والشحن',
                desc: 'نجهز طلبك بعناية ونشحنه من مستودعاتنا بأسرع وقت ممكن.',
                color: 'bg-emerald-50 border-emerald-100',
              },
              {
                icon: <Truck className="w-8 h-8 text-[#D4AF37]" />,
                step: '04',
                title: 'استلام وادفع',
                desc: 'يوصل لبيتك، تفحصينه، وتدفعين فقط عند الاستلام. ضمان 30 يوم.',
                color: 'bg-amber-50 border-amber-100',
              },
            ].map((item, i) => (
              <div key={i} className={`relative ${item.color} rounded-3xl p-6 border text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-[#4A8B9A]/15 font-extrabold text-5xl absolute top-3 right-4 leading-none">{item.step}</div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-[#142B3B] text-base mb-2">{item.title}</h4>
                  <p className="text-[#506A77] text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white rounded-3xl p-6 border border-[#D6E4E8] shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <Heart className="w-10 h-10 text-[#4A8B9A] flex-shrink-0" />
            <p className="text-[#142B3B] font-bold text-base leading-relaxed">
              راحة بالك الأهم. لذا الدفع عند الاستلام متاح دائماً — تدفعين بعد ما تشوفين المنتج وتتأكدين منه بنفسك.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. CROSS SELLS
      ═══════════════════════════════════════════ */}
      {crossSells.length > 0 && (
        <section className="py-20 bg-[#EBF2F5] border-t border-[#D6E4E8]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-[#142B3B] mb-4">
                أمهات ذكيات كملوا راحتهن مع هذي المنتجات
              </h2>
              <p className="text-[#506A77] text-lg font-medium">منتجات تكمل روتينك وتزيد راحتك.</p>
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
          11. GUARANTEE STRIP (Pre-footer)
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-[#142B3B] text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-black mb-4">ضمان مهد بيبي الذهبي — 30 يوم كاملة</h2>
          <p className="text-[#8CA4B0] text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            نحن واثقين جداً من جودة منتجاتنا. إذا ما حسيتِ بفرق حقيقي خلال 30 يوم من الاستلام،{' '}
            <span className="text-white font-bold">نرد لك فلوسك كاملة بدون أي أسئلة معقدة.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold">
            {[
              { icon: <CheckCircle className="w-4 h-4" />, label: 'استرجاع كامل خلال 30 يوم' },
              { icon: <CheckCircle className="w-4 h-4" />, label: 'بدون أسئلة أو شروط معقدة' },
              { icon: <CheckCircle className="w-4 h-4" />, label: 'عبر واتساب في دقائق' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-green-400">
                {item.icon}
                <span className="text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anchor for scroll */}
      <div id="buy-box-anchor" className="h-0 w-0" />

      {/* ═══════════════════════════════════════════
          12. STICKY ADD TO CART
      ═══════════════════════════════════════════ */}
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#D6E4E8] px-4 py-4 transition-transform duration-300 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]',
          isSticky ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex-1">
            <p className="font-black text-[#142B3B] text-[15px] line-clamp-1">{product.shortName}</p>
            <p className="text-[#4A8B9A] text-sm font-black mt-1 flex items-center gap-1">
              {formatKwd(OFFER_CONFIG[selectedOffer].priceKwd)}
              <span className="text-[10px] text-gray-400 font-medium line-through ms-1">
                {formatKwd(OFFER_CONFIG[selectedOffer].originalPriceKwd ?? 0)}
              </span>
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              document.getElementById('buy-box')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex-shrink-0 px-8 py-4 md:py-6 text-lg font-black shadow-xl"
          >
            اطلبي الآن
          </Button>
        </div>
      </div>
    </>
  )
}
