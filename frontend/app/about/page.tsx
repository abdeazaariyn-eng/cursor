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
          <h1 className="text-3xl md:text-4xl font-bold text-[#2F2523] mb-5">
            من نحن
          </h1>
          <p className="text-[#7B5E57] text-lg leading-relaxed">
            مهد بيبي يساعدك تعيشين أمومتك براحة أكثر، بتفاصيل صغيرة تحمي طفلك وتخفف عليك اليوم.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-lg max-w-none text-[#2F2523]">
            <h2 className="text-2xl font-bold text-[#2F2523] mb-5">قصة مهد بيبي</h2>
            <p className="text-[#7B5E57] text-base leading-relaxed mb-4">
              مهد بيبي بدأ من فكرة بسيطة: إن الأم تستاهل منتجات مختارة بعناية، مو مجرد كتالوج عشوائي.
            </p>
            <p className="text-[#7B5E57] text-base leading-relaxed mb-4">
              نحن نفهم التفاصيل الصغيرة في يوم الأم — لحظة الخوف لما الطفل يتحرك فجأة، توتر الرضاعة برا البيت، والحاجة لخصوصية ومرونة في أصعب المراحل.
            </p>
            <p className="text-[#7B5E57] text-base leading-relaxed">
              كل منتج في مهد بيبي يمر بمراجعة مبنية على الاستخدام الفعلي، النعومة، سهولة الاستخدام، وملاءمته للأم والطفل في الخليج.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F7EDE8] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#2F2523] text-center mb-10">
            قيمنا
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'الأمان أولاً',
                desc: 'نختار المنتجات بناءً على السلامة والراحة، مو فقط الشكل.',
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'نفهم الأم',
                desc: 'كل قرار نتخذه مبني على احتياجات الأم الحقيقية في يومها.',
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: 'اختيار مدروس',
                desc: 'مو كل منتج يدخل متجرنا — فقط اللي يستاهل ثقتك.',
              },
              {
                icon: <Package className="w-6 h-6" />,
                title: 'شفافية كاملة',
                desc: 'دفع عند الاستلام، وتواصل قبل الشحن — بدون مفاجآت.',
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
          <h2 className="text-2xl font-bold text-[#2F2523] mb-5">وعدنا لك</h2>
          <blockquote className="text-xl text-[#B97863] font-bold leading-relaxed mb-6 italic">
            "لأن الأشياء اللي تلامس طفلك وتدخل روتينك اليومي تستاهل اختيار أهدأ وأوثق."
          </blockquote>
          <p className="text-[#7B5E57] text-base leading-relaxed mb-8">
            نحن لسنا مجرد متجر. نحن نختار، نراجع، ونوصل لك المنتج اللي يفرق فعلاً في يومك.
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
