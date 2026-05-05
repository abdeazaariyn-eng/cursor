import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft, Star, Shield, Award, CheckCircle, HeartPulse,
  Microscope, Leaf, Baby, Truck, Phone, Package, Clock,
  ShieldCheck, Sparkles, Activity, BadgeCheck, ShoppingCart,
} from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { ReviewCard } from '@/components/product/ReviewCard'
import { Button } from '@/components/ui/Button'
import { PRODUCTS } from '@/data/products'

export const metadata: Metadata = {
  title: 'مهد بيبي | منتجات مختارة للأمهات في الكويت والسعودية',
  description:
    'مهد بيبي — منتجات مختارة بعناية للأم والطفل. مواد طبية معتمدة، مطابقة لمعايير SFDA، دفع عند الاستلام وضمان ذهبي 30 يوم.',
}

const GLOBAL_REVIEWS = [
  {
    name: 'أم جاسم',
    text: 'المنتجات فكت لي أزمة في الزوارات! خصوصاً دفاية الحليب، الحين أطلع وأنا متطمنة.',
    stars: 5,
  },
  {
    name: 'أبرار المطيري',
    text: 'أول مرة أطلب وأنا واثقة، الدفع عند الاستلام وضمان 30 يوم خلاني أرتاح. والمنتج جودته خيال.',
    stars: 5,
  },
  {
    name: 'أم فهد',
    text: 'الخامة ممتازة ومطابقة للمواصفات الطبية. ولدي يرتاح فيها وماتسبب له أي حساسية.',
    stars: 5,
  },
  {
    name: 'أم محمد',
    text: 'من أحسن قرارات بعد الولادة إني اشتريت مضخة الثدي، غيرت حياتي كلياً. ما أتخيل يومي بدونها.',
    stars: 5,
  },
  {
    name: 'ر. القحطاني',
    text: 'اشتريت قناع الحماية هدية لأختي بعد ما جربته لنفسي. كل أم محتاجته لما الطفل يبدأ يحبو.',
    stars: 5,
  },
  {
    name: 'أم بندر',
    text: 'الضمان 30 يوم هو اللي خلاني أجرب، وبعد ما جربت ما بديت أفكر في الاسترجاع أبد! منتج رهيب.',
    stars: 5,
  },
]

export default function HomePage() {
  return (
    <>
      {/* ─── Announcement Bar ─── */}
      <div className="bg-[#2F2523] text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold">
        🚚 توصيل لجميع المدن • 🛡️ ضمان استرجاع 30 يوم بدون أسئلة • <span className="text-[#D9A441]">الدفع عند الاستلام ✓</span>
      </div>

      {/* ─── HERO ─── */}
      <section className="bg-gradient-to-b from-[#F7EDE8] to-[#FFF9F5] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B97863]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D9A441]/6 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="order-2 md:order-1 text-center md:text-right">
              <div className="inline-flex items-center gap-2 bg-[#B97863]/10 border border-[#B97863]/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <Star className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                <span className="text-[#7B5E57] text-sm font-bold">
                  الخيار الأول لأكثر من <span className="text-[#B97863]">1,500+</span> أم
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2F2523] leading-tight mb-6">
                استرجعي وقتك وراحتك،{' '}
                <span className="text-[#B97863]">يا أمنا العظيمة</span>
                <br />
                منتجات تشيل عنك ثقل كل يوم.
              </h1>

              <p className="text-[#7B5E57] text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-medium">
                بين الدوام، الزوارات، والخوف المستمر على طفلك... طاقتك ما تكفي. وفرنا لك منتجات{' '}
                <span className="font-bold text-[#B97863]">مثبتة علمياً ومعتمدة</span> عشان
                تطمنين على طفلك وترتاحين أنتِ.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start mb-8">
                <Link href="/products">
                  <Button
                    variant="primary"
                    size="lg"
                    className="shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    تصفحي المنتجات الآن
                    <ArrowLeft className="w-5 h-5 me-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-[#2F2523] font-bold text-sm bg-white px-4 py-3 rounded-xl border border-[#F0E3DC] shadow-sm">
                  <Award className="w-5 h-5 text-[#D9A441]" />
                  <span>ضمان ذهبي 30 يوم</span>
                </div>
              </div>

              <div className="flex items-center gap-5 justify-center md:justify-start text-[#7B5E57] text-sm font-medium flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                  <span>SFDA معتمدة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                  <span>دفع عند الاستلام</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                  <span>تأكيد قبل الشحن</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="order-1 md:order-2 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#B97863]/10 rounded-[3rem] rotate-3 scale-105 transform origin-center" />
              <div className="w-full max-w-md aspect-square bg-white rounded-3xl flex items-center justify-center shadow-2xl relative z-10 border border-[#F0E3DC] overflow-hidden">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">👶🤍</div>
                  <p className="text-[#B97863] text-sm font-bold">[صورة تعبيرية جذابة لأم وطفلها]</p>
                  <p className="text-[#7B5E57] text-xs mt-2">تعكس راحة الأم وسعادة طفلها</p>
                  {/* Floating trust badge */}
                  <div className="mt-6 bg-[#F7EDE8] rounded-2xl px-4 py-3 inline-flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2E8B57]" />
                    <span className="text-[#2F2523] text-xs font-bold">معتمد SFDA ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROOF STRIP ─── */}
      <section className="bg-white py-5 border-y border-[#F0E3DC] shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
            {[
              { icon: <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />)}</div>, label: 'موثوق من 1,500+ أم' },
              { icon: <Shield className="w-5 h-5 text-[#2E8B57]" />, label: 'مطابق لمواصفات SFDA' },
              { icon: <Microscope className="w-5 h-5 text-[#1A5F7A]" />, label: 'مواد مختبرة علمياً' },
              { icon: <Award className="w-5 h-5 text-[#D9A441]" />, label: 'ضمان 30 يوم' },
              { icon: <Package className="w-5 h-5 text-[#B97863]" />, label: 'دفع عند الاستلام' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#B97863]">{item.icon}</span>
                <span className="text-[#2F2523] font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PAIN / AGITATION ZIGZAG ─── */}
      <section className="py-20 bg-[#FFF9F5] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Left */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-[#B97863]/10 rounded-[3rem] rotate-6 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-[#F7EDE8] rounded-[2.5rem] flex flex-col items-center justify-center shadow-lg border border-white/80 p-8 overflow-hidden">
                <div className="text-7xl mb-4 text-center">🥺</div>
                <p className="text-[#B97863] font-bold text-center">[صورة تعبيرية لأم مرهقة]</p>
                <p className="text-sm text-[#7B5E57] mt-2 text-center">نحس بجهدك وتعبك كل يوم</p>
              </div>
              {/* Floating quote */}
              <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-[#F0E3DC] max-w-[200px] z-10">
                <p className="text-xs font-bold text-[#2F2523] mb-1">"أتعب بس ما أقدر أوقف"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#D9A441] fill-[#D9A441]" />)}
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-[#B97863]/10 text-[#B97863] rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
                <HeartPulse className="w-4 h-4" />
                أنتِ مو لحالك
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-6 leading-tight">
                هل تحسين بإنك ما تقدرين تلحقين على كل شيء؟
              </h2>
              <p className="text-[#7B5E57] text-lg mb-8 font-medium leading-relaxed">
                ما فيه أم ما مرت بهذا الإحساس. والحل مو إنك تتعبين أكثر، الحل إنك تختارين المنتجات الصح اللي تشيل عنك ضغط يومك.
              </p>
              <div className="space-y-4">
                {[
                  'القلق المستمر على سلامة طفلك في كل لحظة',
                  'الإرهاق من السهر والدوام وضغوط الحياة',
                  'صعوبة الخروج مع الطفل بدون توتر وانزعاج',
                  'الخوف من المنتجات المقلدة أو الخطرة على الطفل',
                  'الإحساس إنك تبذلين كل شيء لكن ما يكفي',
                ].map((pain, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#F0E3DC] shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-[#B97863]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#B97863] text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-[#2F2523] font-medium text-sm leading-relaxed">{pain}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-gradient-to-r from-[#B97863]/10 to-transparent p-5 rounded-2xl border-r-4 border-[#B97863]">
                <p className="text-[#2F2523] font-bold text-base leading-relaxed">
                  مهد بيبي موجود عشان يعطيك الحل الصح، المعتمد، والمضمون. عشان تطمنين وتقدرين ترتاحين.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT HIGHLIGHTS ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#D9A441]/10 text-[#2F2523] rounded-full px-4 py-1.5 mb-4 font-bold text-sm border border-[#D9A441]/20">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              منتجات مختارة بعناية
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-4">
              اختاري اللي يريح قلبك ويخفف يومك
            </h2>
            <p className="text-[#7B5E57] text-lg font-medium max-w-xl mx-auto">
              حلول عملية مبتكرة، مصممة خصيصاً للأم ولطفلها.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCIENCE & INGREDIENTS ZIGZAG ─── */}
      <section className="py-20 bg-[#F0F8FF] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 mb-6 font-bold text-sm">
                <Microscope className="w-4 h-4" />
                علم وليس مجرد وعود
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-6 leading-tight">
                منتجاتنا مو مجرد شكل حلو...
                <span className="block text-blue-700 mt-1">هي علم مدروس عشان طفلك.</span>
              </h2>
              <p className="text-[#7B5E57] text-lg mb-10 font-medium leading-relaxed">
                كل مادة تختارها لطفلك تدخل جسمه، تلامس بشرته، وتأثر في صحته. لذا ما نساوم في اختيارنا للمواد أبداً.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    icon: <Leaf className="w-7 h-7 text-green-500" />,
                    title: 'BPA-Free خالٍ من السموم',
                    desc: 'خالية تماماً من مادة BPA البلاستيكية الضارة التي تُطلق مواد سامة عند التسخين.',
                    bg: 'bg-green-50',
                  },
                  {
                    icon: <Baby className="w-7 h-7 text-[#B97863]" />,
                    title: 'نعومة طبية مضادة للتحسس',
                    desc: 'سيليكون طبي معتمد ونسيج هايبوالرجينيك لا يسبب أي احمرار لبشرة الرضيع الرقيقة.',
                    bg: 'bg-[#FFF0EB]',
                  },
                  {
                    icon: <Microscope className="w-7 h-7 text-blue-600" />,
                    title: 'اختبارات مختبرية صارمة',
                    desc: 'كل منتج يخضع لأكثر من 12 اختبار جودة في مختبرات معتمدة قبل وصوله لبيتك.',
                    bg: 'bg-blue-50',
                  },
                  {
                    icon: <Shield className="w-7 h-7 text-[#2E8B57]" />,
                    title: 'مواد طبية درجة أولى',
                    desc: 'نستخدم فقط المواد الطبية المرخصة المصممة للاستخدام الطبي الحساس والآمن.',
                    bg: 'bg-emerald-50',
                  },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} p-5 rounded-2xl border border-white shadow-sm`}>
                    <div className="mb-3">{item.icon}</div>
                    <h4 className="font-bold text-[#2F2523] mb-2 text-sm">{item.title}</h4>
                    <p className="text-xs text-[#7B5E57] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Right */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100/60 rounded-[3rem] -rotate-6 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border border-blue-100 p-8 overflow-hidden">
                <div className="text-8xl mb-4">🔬</div>
                <p className="text-blue-800 font-bold text-center text-sm">
                  [صورة مقربة (Macro) توضح جودة المادة الطبية أو النسيج]
                </p>
                <p className="text-xs text-[#7B5E57] mt-2 text-center">تفاصيل المواد الطبية المعتمدة</p>
                <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-green-700 font-extrabold text-lg">12+</p>
                    <p className="text-green-600 text-xs font-medium">اختبار جودة</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-blue-700 font-extrabold text-lg">100%</p>
                    <p className="text-blue-600 text-xs font-medium">BPA-Free</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SFDA AUTHORITY ZIGZAG ─── */}
      <section className="py-20 bg-[#2F2523] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 border border-white/20 rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 border border-white/10 rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image Left */}
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-white/5 rounded-[3rem] rotate-3 scale-105 transform origin-center" />
              <div className="relative aspect-square bg-gradient-to-br from-[#3D2E2B] to-[#4A3835] rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl border border-[#5A4541] p-8 overflow-hidden">
                <Shield className="w-20 h-20 text-[#D9A441] mb-5" />
                <p className="text-white/90 font-bold text-base text-center leading-snug mb-6">
                  [صورة شهادة اعتماد SFDA وشهادات الجودة الدولية]
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-[#D9A441] font-extrabold text-lg">SFDA</p>
                    <p className="text-white/60 text-xs">مطابق ومعتمد</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <p className="text-green-400 font-extrabold text-lg">12+</p>
                    <p className="text-white/60 text-xs">اختبار نجاح</p>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-[#F0E3DC] z-10">
                <Award className="w-10 h-10 text-[#D9A441]" />
                <div>
                  <p className="text-[#2F2523] font-bold text-sm">ضمان 30 يوم</p>
                  <p className="text-[#7B5E57] text-xs">استرجاع بدون أسئلة</p>
                </div>
              </div>
            </div>

            {/* Text Right */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-[#D9A441]/20 text-[#D9A441] rounded-full px-4 py-1.5 mb-6 font-bold text-sm border border-[#D9A441]/30">
                <BadgeCheck className="w-4 h-4" />
                المعيار الذهبي للأمان
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                لأن طفلك أغلى ما تملكين،{' '}
                <span className="text-[#D9A441]">ما نساوم على الأمان أبداً.</span>
              </h2>
              <p className="text-[#C9B0A8] text-lg mb-10 leading-relaxed font-medium">
                كل منتج في مهد بيبي يمر باختبارات صارمة قبل ما يوصل لبيتك. مو كلام فاضي، هي شهادات موثقة وأرقام حقيقية.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Shield className="w-6 h-6 text-[#2E8B57]" />,
                    title: 'متوافق مع معايير SFDA الكاملة',
                    desc: 'جميع الأجهزة مطابقة لمتطلبات هيئة الغذاء والدواء للسلامة والأمان الطبي.',
                  },
                  {
                    icon: <Microscope className="w-6 h-6 text-[#1A5F7A]" />,
                    title: 'مواد طبية معتمدة (BPA-Free)',
                    desc: 'خالية تماماً من المواد البلاستيكية الضارة. مختبرة سريرياً لبشرة الأطفال الحساسة.',
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6 text-[#D9A441]" />,
                    title: 'اجتاز أكثر من 12 اختبار جودة',
                    desc: 'اختبارات صلابة، سلامة المواد، مقاومة الحرارة، والتحسس الجلدي — كلها نجح فيها.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">{item.title}</h4>
                      <p className="text-[#9A7D78] text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / REVIEWS ─── */}
      <section className="py-20 bg-[#F7EDE8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#B97863]/10 text-[#B97863] rounded-full px-5 py-2 mb-6 font-extrabold text-sm border border-[#B97863]/20">
              <Star className="w-4 h-4 fill-current" />
              أكثر من 1,500 قصة نجاح حقيقية
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-4">
              أمهات ارتاحوا قبلك
            </h2>
            <p className="text-[#7B5E57] text-lg font-medium max-w-xl mx-auto">
              قصص حقيقية من أمهات جربوا الفرق بأنفسهن.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GLOBAL_REVIEWS.map((review, i) => (
              <div key={i} className="transform hover:-translate-y-1 transition-transform duration-300">
                <ReviewCard {...review} />
              </div>
            ))}
          </div>

          {/* Aggregate stats */}
          <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-[#F0E3DC]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { num: '1,500+', label: 'أم سعيدة' },
                { num: '4.9', label: 'متوسط التقييم ⭐' },
                { num: '98%', label: 'نسبة الرضا' },
                { num: '30 يوم', label: 'ضمان الاسترجاع' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl md:text-3xl font-extrabold text-[#B97863] mb-1">{stat.num}</p>
                  <p className="text-[#7B5E57] text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 30-DAY GUARANTEE ─── */}
      <section className="py-20 bg-white border-y border-[#F0E3DC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#D9A441]/20 to-[#B97863]/10 flex items-center justify-center border-4 border-[#D9A441]/30 shadow-2xl">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-[#D9A441] mx-auto mb-2" />
                    <p className="text-[#2F2523] font-extrabold text-2xl">30</p>
                    <p className="text-[#7B5E57] font-bold text-sm">يوم ضمان</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-[#4CAF50] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  100% مضمون
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#D9A441]/10 text-[#2F2523] rounded-full px-4 py-1.5 mb-6 font-bold text-sm border border-[#D9A441]/20">
                <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                الضمان الذهبي لمهد بيبي
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-6 leading-tight">
                جربي بدون أي مخاطرة.{' '}
                <span className="text-[#B97863]">مضمونة 30 يوم كاملة.</span>
              </h2>
              <p className="text-[#7B5E57] text-lg font-medium leading-relaxed mb-8">
                نحن واثقون جداً من جودة منتجاتنا. إذا ما حسيتِ بفرق حقيقي خلال 30 يوم من الاستلام،{' '}
                <span className="font-bold text-[#B97863]">نرد لك فلوسك كاملة بدون أي أسئلة.</span>
              </p>
              <ul className="space-y-4">
                {[
                  'استرجاع كامل خلال 30 يوم من تاريخ الاستلام',
                  'بدون أسئلة معقدة أو شروط مجحفة',
                  'عملية الاسترجاع سهلة وسريعة عبر واتساب',
                  'الدفع عند الاستلام يضمن لك المزيد من الطمأنينة',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
                    <span className="text-[#2F2523] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW TO ORDER ─── */}
      <section className="py-20 bg-[#FFF9F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 rounded-full px-4 py-1.5 mb-4 font-bold text-sm">
              <Clock className="w-4 h-4" />
              سهلة وسريعة في دقيقتين
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-4">
              كيف تطلبين؟ 4 خطوات بسيطة
            </h2>
            <p className="text-[#7B5E57] text-lg font-medium">
              بدون تعقيد، بدون دفع مسبق، ضمان كامل.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', icon: <ShoppingCart className="w-7 h-7" />, title: 'اختاري منتجك', desc: 'تصفحي المنتجات واختاري اللي يريح قلبك ويناسب طفلك.' },
              { num: '02', icon: <Phone className="w-7 h-7" />, title: 'أكملي بياناتك', desc: 'اكتبي اسمك ورقمك وعنوانك في دقيقة واحدة فقط.' },
              { num: '03', icon: <Activity className="w-7 h-7" />, title: 'تأكيد الطلب', desc: 'نتصل عليك خلال 24 ساعة لتأكيد الطلب قبل الشحن.' },
              { num: '04', icon: <Truck className="w-7 h-7" />, title: 'استلمي وادفعي', desc: 'يوصل لبيتك ✓ تفحصيه ✓ تدفعين عند الاستلام فقط.' },
            ].map((step, i) => (
              <div key={i} className="relative bg-white rounded-3xl p-6 shadow-sm border border-[#F0E3DC] text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="text-[#B97863]/20 font-extrabold text-6xl absolute top-3 right-4 leading-none">{step.num}</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#B97863]/10 flex items-center justify-center mx-auto mb-4 text-[#B97863]">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-[#2F2523] text-base mb-2">{step.title}</h4>
                  <p className="text-[#7B5E57] text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL URGENCY CTA ─── */}
      <section className="bg-gradient-to-br from-[#2F2523] to-[#3D2E2B] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 rounded-full px-4 py-1.5 mb-6 font-bold text-sm border border-red-400/20">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            الكميات محدودة جداً — طلبات اليوم تُشحن غداً
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            لا تأجلين راحتك وراحة طفلك
          </h2>
          <p className="text-[#C9B0A8] text-lg md:text-xl mb-10 font-medium leading-relaxed">
            اطلبي الآن وادفعي عند الاستلام. نتواصل معك لتأكيد الطلب خلال 24 ساعة،{' '}
            ومضمون بضماننا الذهبي لمدة 30 يوم كاملة.
          </p>
          <Link href="/products">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto px-12 py-4 text-lg shadow-2xl hover:-translate-y-1 transition-all duration-300 font-black"
            >
              اطلبي الآن — الدفع عند الاستلام
              <ArrowLeft className="w-5 h-5 me-2" />
            </Button>
          </Link>
          <div className="mt-8 flex items-center justify-center gap-6 text-[#C9B0A8] text-sm font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#D9A441]" />
              <span>SFDA معتمد</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D9A441]" />
              <span>ضمان 30 يوم</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#D9A441]" />
              <span>دفع عند الاستلام</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

