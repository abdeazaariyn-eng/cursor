import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | مهد بيبي',
}

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-[#2F2523] mb-8">سياسة الخصوصية</h1>

        <div className="flex flex-col gap-8 text-[#2F2523]">
          <div>
            <h2 className="text-xl font-bold mb-3">المعلومات التي نجمعها</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              عند تقديمك للطلب، نجمع اسمك ورقم جوالك فقط. هذه المعلومات تُستخدم لتأكيد طلبك والتواصل معك قبل الشحن.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">كيف نستخدم معلوماتك</h2>
            <ul className="text-[#7B5E57] leading-relaxed flex flex-col gap-2">
              <li>• تأكيد الطلب والتواصل معك قبل الشحن.</li>
              <li>• معالجة الطلب وترتيب التوصيل.</li>
              <li>• تحسين تجربتك على الموقع.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">البيانات وبيئات التسويق</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              نستخدم أدوات تحليلية وإعلانية (Meta، TikTok، Snapchat) لتحسين إعلاناتنا. أي بيانات تُرسل لهذه المنصات تكون مُشفَّرة ومُخصَّرة حسب معايير كل منصة. لا نشارك معلوماتك الشخصية الكاملة مع أطراف ثالثة.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">الكوكيز</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              نستخدم ملفات الكوكيز لتحسين تجربتك وتحليل حركة الموقع. يمكنك تعطيل الكوكيز من إعدادات متصفحك.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">حماية البيانات</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              نحفظ بياناتك بأمان في قواعد بيانات محمية. رقم جوالك يُستخدم فقط للتواصل المتعلق بطلبك.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">تواصل معنا</h2>
            <p className="text-[#7B5E57] leading-relaxed">
              إذا كان لديك أي استفسار عن خصوصيتك، تواصلي معنا على:{' '}
              <a href="mailto:support@mahdbaby.shop" className="text-[#B97863] underline">
                support@mahdbaby.shop
              </a>
            </p>
          </div>

          <p className="text-[#9A7D78] text-sm">
            آخر تحديث: مايو 2026
          </p>
        </div>
      </div>
    </section>
  )
}
