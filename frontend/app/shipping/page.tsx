import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'معلومات الشحن | مهد بيبي',
}

export default function ShippingPage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#2F2523] mb-8">معلومات الشحن والتوصيل</h1>

        <div className="flex flex-col gap-8 text-[#2F2523]">
          <div className="bg-[#F7EDE8] rounded-2xl p-5">
            <p className="text-[#7B5E57] text-base leading-relaxed">
              نتواصل معك لتأكيد الطلب قبل الشحن، وهذا يضمن وصول طلبك بالشكل الصحيح.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">مناطق التوصيل</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              [أضيفي مناطق التوصيل التي تخدمونها — المملكة العربية السعودية، الكويت، وغيرها]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">مدة التوصيل</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              [أضيفي مدة التوصيل المتوقعة حسب المنطقة — مثلاً: 3-7 أيام عمل]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">رسوم الشحن</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              [أضيفي تفاصيل رسوم الشحن أو إذا كان الشحن مجاني]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">الدفع عند الاستلام</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              جميع طلباتنا تُدفع عند الاستلام. لا يوجد أي دفع مسبق أو إلكتروني مطلوب.
              عند وصول طلبك، تتحققين منه وتدفعين للمندوب.
            </p>
          </div>

          <p className="text-[#9A7D78] text-sm">
            [هذه الصفحة توضيحية — يرجى تحديثها بمعلومات الشحن الفعلية قبل الإطلاق]
          </p>
        </div>
      </div>
    </section>
  )
}
