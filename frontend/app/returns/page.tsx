import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سياسة الاستبدال | مهد بيبي',
}

export default function ReturnsPage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#2F2523] mb-8">سياسة الاستبدال والإرجاع</h1>

        <div className="flex flex-col gap-8 text-[#2F2523]">
          <div className="bg-[#F7EDE8] rounded-2xl p-5">
            <p className="text-[#7B5E57] text-base leading-relaxed">
              رضاك يهمنا. إذا واجهتِ أي مشكلة مع طلبك، تواصلي معنا وراح نحل الأمر.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">شروط الاستبدال</h2>
            <ul className="text-[#7B5E57] leading-relaxed flex flex-col gap-2">
              <li>• المنتج لم يُستخدم وفي حالته الأصلية.</li>
              <li>• التواصل يكون خلال 7 أيام من استلام الطلب.</li>
              <li>• يجب التواصل معنا أولاً قبل إعادة أي منتج.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">كيف تطلبين الاستبدال؟</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              تواصلي معنا عبر واتساب أو البريد الإلكتروني مع رقم الطلب وسبب الاستبدال.
              فريقنا سيتواصل معك لترتيب الإجراءات.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">ملاحظات مهمة</h2>
            <ul className="text-[#7B5E57] leading-relaxed flex flex-col gap-2">
              <li>• الشحن الأصلي غير قابل للاسترداد.</li>
              <li>• المنتجات التي فُتحت واستُخدمت لا تُقبل للاستبدال لأسباب الصحة والسلامة.</li>
              <li>• سياسة الاستبدال لا تشمل الأضرار الناتجة عن الاستخدام غير الصحيح.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">تواصل معنا</h2>
            <Link href="/contact" className="text-[#B97863] underline font-medium">
              صفحة التواصل
            </Link>
          </div>

          <p className="text-[#9A7D78] text-sm">
            [هذه السياسة توضيحية — يرجى تحديثها بسياستك الفعلية قبل الإطلاق]
          </p>
        </div>
      </div>
    </section>
  )
}
