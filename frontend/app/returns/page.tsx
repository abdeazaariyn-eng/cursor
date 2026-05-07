import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سياسة الاستبدال | مهد بيبي',
}

export default function ReturnsPage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-3">
          الضمان الذهبي — 30 يوم بدون أسئلة
        </h1>
        <p className="text-[#506A77] text-base md:text-lg leading-relaxed mb-8">
          نحن واثقون من البوتيك. لو ما عجبك المنتج لأي سبب خلال 30 يوم من الاستلام،
          نسترجع لك المبلغ كامل أو نستبدله — بدون استجواب وبدون شروط مجحفة.
        </p>

        <div className="flex flex-col gap-8 text-[#142B3B]">
          <div className="bg-[#E8F0EC] border border-[#3B8263]/20 rounded-2xl p-5">
            <p className="text-[#142B3B] text-base leading-relaxed">
              <span className="font-bold">وعد البوتيك:</span> إذا وصل الطلب تالف، ناقص، أو مختلف عن المطلوب —
              نتحمل المسؤولية كاملة ونحل الأمر خلال 24 ساعة.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">شروط الضمان الذهبي</h2>
            <ul className="text-[#506A77] leading-relaxed flex flex-col gap-2">
              <li>• فترة الضمان 30 يوم كاملة من تاريخ الاستلام.</li>
              <li>• المنتج بحالته الأصلية مع علبته الأصلية.</li>
              <li>• التواصل معنا أولاً عبر واتساب لترتيب الاستبدال أو الإرجاع.</li>
              <li>• لا نسأل عن السبب — لو غيّرتي رأيك، نقبله.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">كيف تطلبين الاستبدال؟</h2>
            <p className="text-[#506A77] leading-relaxed">
              تواصلي معنا عبر واتساب أو البريد الإلكتروني مع رقم الطلب وسبب الاستبدال.
              فريقنا سيتواصل معك لترتيب الإجراءات.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">ملاحظات مهمة</h2>
            <ul className="text-[#506A77] leading-relaxed flex flex-col gap-2">
              <li>• الشحن الأصلي غير قابل للاسترداد.</li>
              <li>• المنتجات التي فُتحت واستُخدمت لا تُقبل للاستبدال لأسباب الصحة والسلامة.</li>
              <li>• سياسة الاستبدال لا تشمل الأضرار الناتجة عن الاستخدام غير الصحيح.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">تواصل معنا</h2>
            <Link href="/contact" className="text-[#4A8B9A] underline font-medium">
              صفحة التواصل
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
