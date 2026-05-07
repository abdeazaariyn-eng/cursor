import type { Metadata } from 'next'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'تواصل معنا | مهد بيبي',
  description: 'تواصلي مع فريق دعم مهد بيبي — دعم عربي متاح.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#EBF2F5] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#C9DADD] rounded-full px-4 py-1.5 mb-5 font-bold text-sm text-[#142B3B] shadow-sm">
            دعم عربي حقيقي
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#142B3B] mb-4">تواصلي معنا</h1>
          <p className="text-[#506A77] text-base md:text-lg leading-relaxed">
            فريق مهد بيبي يرد عليك بنفسه — مو روبوت، ولا رد جاهز. اسألي عن أي منتج، أي طلب،
            أو أي تفصيلة قبل ما تشترين.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="grid gap-5">
            {[
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: 'واتساب',
                desc: 'الطريقة الأسرع للتواصل معنا.',
                action: 'ابدئي المحادثة',
                href: 'https://wa.me/966XXXXXXXXX',
                placeholder: true,
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: 'البريد الإلكتروني',
                desc: 'راسلينا وراح نرد في أقرب وقت.',
                action: 'support@mahdbaby.shop',
                href: 'mailto:support@mahdbaby.shop',
                placeholder: false,
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 bg-white rounded-2xl border border-[#D6E4E8] p-5 shadow-sm hover:shadow-md hover:border-[#4A8B9A] transition-all duration-200"
              >
                <div className="w-12 h-12 bg-[#EBF2F5] rounded-xl flex items-center justify-center text-[#4A8B9A] flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#142B3B] mb-0.5">
                    {item.title}
                    {item.placeholder && (
                      <span className="text-[#6B8A99] text-xs font-normal mr-2">[أضيفي الرقم]</span>
                    )}
                  </p>
                  <p className="text-[#506A77] text-sm">{item.desc}</p>
                  <p className="text-[#4A8B9A] text-sm font-medium mt-1">{item.action}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 bg-[#EBF2F5] rounded-2xl p-5 text-center">
            <p className="text-[#506A77] text-sm leading-relaxed">
              أوقات الدعم: السبت — الخميس، 9 صباحاً — 10 مساءً بتوقيت السعودية.
              <br />
              راح نرد عليك في أقرب وقت ممكن.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
