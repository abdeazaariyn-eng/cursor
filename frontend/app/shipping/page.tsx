import type { Metadata } from 'next'
import Link from 'next/link'
import { Truck, Phone, MapPin, Clock, ShieldCheck, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'الشحن والتوصيل | مهد بيبي',
  description:
    'تفاصيل الشحن والتوصيل في مهد بيبي — توصيل لكل دول الخليج، تأكيد قبل الشحن، ودفع عند الاستلام.',
}

export default function ShippingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#EBF2F5] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#C9DADD] rounded-full px-4 py-1.5 mb-5 font-bold text-sm text-[#142B3B] shadow-sm">
            <Truck className="w-4 h-4 text-[#4A8B9A]" />
            الشحن والتوصيل
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-4">
            توصيل آمن، تأكيد قبل الشحن، ودفع بعد ما تستلمين
          </h1>
          <p className="text-[#506A77] text-base md:text-lg leading-relaxed">
            نشحن لكل دول الخليج. كل طلب يتأكد بمكالمة قصيرة قبل ما يخرج من المستودع — عشان يوصلك
            صح من أول مرة.
          </p>
        </div>
      </section>

      {/* Highlights grid */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'تغطية الخليج كاملة',
                desc: 'السعودية، الكويت، الإمارات، البحرين، قطر، عُمان.',
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: 'تأكيد قبل الشحن',
                desc: 'نتصل عليك خلال 24 ساعة لتأكيد العنوان والتفاصيل.',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'مدة التوصيل',
                desc: '2–4 أيام عمل داخل المدن، 4–7 أيام للأطراف.',
              },
              {
                icon: <Package className="w-6 h-6" />,
                title: 'دفع عند الاستلام',
                desc: 'ما يطلب منك أي دفع مسبق — تدفعين بعد ما تستلمين.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#D6E4E8] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#4A8B9A]/10 text-[#4A8B9A] flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#142B3B] mb-1.5 text-base">{item.title}</h3>
                <p className="text-[#506A77] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-8 text-[#142B3B]">
            <div>
              <h2 className="text-xl font-bold mb-3">مناطق التوصيل ورسوم الشحن</h2>
              <div className="overflow-hidden rounded-2xl border border-[#D6E4E8]">
                <table className="w-full text-sm">
                  <thead className="bg-[#EBF2F5] text-[#142B3B]">
                    <tr>
                      <th className="text-right p-3 font-bold">الدولة</th>
                      <th className="text-right p-3 font-bold">مدة التوصيل</th>
                      <th className="text-right p-3 font-bold">رسوم الشحن</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#506A77]">
                    {[
                      ['السعودية', '2–5 أيام عمل', 'مجاني للطلبات فوق 150 ر.س'],
                      ['الكويت', '3–6 أيام عمل', 'مجاني للطلبات فوق 15 د.ك'],
                      ['الإمارات', '3–6 أيام عمل', 'مجاني للطلبات فوق 150 د.إ'],
                      ['البحرين / قطر / عُمان', '4–7 أيام عمل', 'حسب المنطقة — يظهر عند الدفع'],
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-[#D6E4E8]">
                        {row.map((c, j) => (
                          <td key={j} className="p-3">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[#6B8A99] text-xs mt-3">
                * الأيام محسوبة بأيام العمل (الأحد–الخميس) من بعد تأكيد الطلب.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">كيف تتم رحلة طلبك؟</h2>
              <ol className="flex flex-col gap-3 text-[#506A77]">
                {[
                  'تطلبين عبر الموقع وتختارين الدفع عند الاستلام.',
                  'يتصل عليك فريقنا خلال 24 ساعة لتأكيد العنوان والتفاصيل.',
                  'يخرج طلبك من المستودع ويُسلَّم لشركة الشحن.',
                  'تستلمين الطلب، تفحصينه، وبعدها تدفعين للمندوب.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-[#4A8B9A] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">الدفع عند الاستلام</h2>
              <p className="text-[#506A77] leading-relaxed">
                كل طلباتنا بالدفع عند الاستلام — بدون أي دفع مسبق أو إلكتروني.
                المندوب يسلّمك الطلب، وأنتِ تتأكدين من المحتوى والتغليف قبل ما تدفعين.
                هذي طريقتنا عشان تطلبين بدون أي قلق.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">تأخر الطلب أو ما وصل؟</h2>
              <p className="text-[#506A77] leading-relaxed">
                إذا تأخر الطلب أكثر من المدة المتوقعة، تواصلي معنا مباشرة على واتساب
                مع رقم الطلب، وفريقنا يتابع شركة الشحن نيابةً عنك ويرجع لك بحل خلال نفس اليوم.
              </p>
            </div>

            <div className="bg-[#E8F0EC] border border-[#3B8263]/20 rounded-2xl p-5 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-[#3B8263] flex-shrink-0 mt-0.5" />
              <p className="text-[#142B3B] text-sm leading-relaxed">
                <span className="font-bold">وعد مهد بيبي:</span>{' '}
                لو وصل طلبك ناقص، تالف، أو مختلف عن المطلوب — نستبدله مجاناً أو نسترجع لك المبلغ كاملاً.
                خلال 30 يوم من الاستلام، بدون أسئلة.{' '}
                <Link href="/returns" className="text-[#4A8B9A] underline font-bold">
                  تفاصيل سياسة الاستبدال
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
