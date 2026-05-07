import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Heart, Star, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'من نحن | مهد بيبي',
  description: 'تعرفي على مهد بيبي — متجر منتجات الأم والطفل المختارة بعناية لأمهات الخليج.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F7EDE8] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E7D4CC] rounded-full px-4 py-1.5 mb-5 font-bold text-sm text-[#2F2523] shadow-sm">
            بوتيك مختار للأم والطفل
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2F2523] mb-5">
            مهد بيبي — قائمة قصيرة، اختيار مدروس
          </h1>
          <p className="text-[#7B5E57] text-lg leading-relaxed">
            ما نبيع كل شي. نختار أساسيات الأم والطفل اللي تستاهل ثقتك، ونوصلها لكل دول الخليج
            بضمان كامل ودفع عند الاستلام.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none text-[#2F2523]">
            <h2 className="text-2xl font-bold text-[#2F2523] mb-5">قصة مهد بيبي</h2>
            <p className="text-[#7B5E57] text-base leading-relaxed mb-4">
              <span className="font-bold text-[#2F2523]">مهد</span> معناها المكان الآمن اللي يرتاح فيه الطفل.
              من هذا الإحساس بدأ مهد بيبي: متجر بوتيكي صغير لأمهات الخليج اللي يبون يقررون صح،
              من غير ما يضيعون ساعات يفحصون منتجات في أماكن ما يثقون فيها.
            </p>
            <p className="text-[#7B5E57] text-base leading-relaxed mb-4">
              المنتج اللي يدخل المتجر يمر بثلاثة فلاتر: <span className="font-bold">الأمان</span>{' '}
              (مواد طبية ومطابقة لمعايير SFDA)،{' '}
              <span className="font-bold">الفائدة الحقيقية</span> (يحل مشكلة فعلية في يوم الأم)،{' '}
              و<span className="font-bold">الجودة</span> (مصانع معروفة، ما نبيع مقلدات).
              لو ما عدّى الفلاتر الثلاثة كلها، ما يدخل البوتيك.
            </p>
            <p className="text-[#7B5E57] text-base leading-relaxed">
              نحن لسنا متجراً يبيع كل شي. نحن قائمة قصيرة، تثقين فيها لأنها مختارة من أم خليجية
              لأم خليجية مثلك.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F7EDE8] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2F2523] text-center mb-3">
            قيم البوتيك
          </h2>
          <p className="text-[#7B5E57] text-base text-center mb-10 max-w-xl mx-auto">
            هذي الأربع قيم هي اللي تحدد إيش يدخل مهد بيبي وإيش ما يدخل.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'الأمان أولاً',
                desc: 'مواد طبية، خالية من BPA، ومطابقة لمعايير SFDA — دائماً.',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'اختيار مدروس',
                desc: 'مو كل منتج يدخل البوتيك — فقط اللي يستاهل ثقتك.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'نفهم الأم الخليجية',
                desc: 'فريق عربي، تواصل عربي، ومنتجات تناسب يومنا الفعلي.',
              },
              {
                icon: <Package className="w-6 h-6" />,
                title: 'شفافية كاملة',
                desc: 'دفع عند الاستلام، تأكيد قبل الشحن، وضمان 30 يوم — بدون مفاجآت.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 text-center border border-[#F0E3DC] shadow-sm">
                <div className="text-[#B97863] flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#2F2523] mb-2">{item.title}</h3>
                <p className="text-[#7B5E57] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#2F2523] mb-5">وعد البوتيك</h2>
          <blockquote className="text-xl text-[#B97863] font-bold leading-relaxed mb-6 italic">
            "اختيار مدروس، أمان معتمد، وضمان كامل — لأن طفلك يستاهل قرار صح."
          </blockquote>
          <p className="text-[#7B5E57] text-base leading-relaxed mb-8">
            ما نبيعك منتج فقط. نبيعك راحة بال إنه مفحوص، مضمون، وفيه دعم بعد الشراء.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              تصفحي منتجاتنا
            </Button>
          </Link>
        </div>
      </section>

      {/* Legal note */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F7EDE8] rounded-2xl p-4 text-[#9A7D78] text-xs text-center leading-relaxed">
            منتجاتنا مختارة للاستخدام اليومي وتريح الروتين. لا نقدم ادعاءات طبية أو سريرية.
            استخدمي المنتجات حسب التعليمات المرفقة وتحت إشرافك الكريم.
          </div>
        </div>
      </section>
    </>
  )
}
