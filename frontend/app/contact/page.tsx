import type { Metadata } from 'next'
import { Phone, Mail, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'تواصل معنا | مهد بيبي',
  description: 'تواصلي مع فريق دعم مهد بيبي — دعم عربي متاح.',
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#F7EDE8] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-[#2F2523] mb-4">تواصل معنا</h1>
          <p className="text-[#7B5E57] text-base leading-relaxed">
            فريقنا موجود لمساعدتك. تواصلي معنا بالطريقة اللي تناسبك.
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
                className="flex items-center gap-4 bg-white rounded-2xl border border-[#F0E3DC] p-5 shadow-sm hover:shadow-md hover:border-[#B97863] transition-all duration-200"
              >
                <div className="w-12 h-12 bg-[#F7EDE8] rounded-xl flex items-center justify-center text-[#B97863] flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#2F2523] mb-0.5">
                    {item.title}
                    {item.placeholder && (
                      <span className="text-[#9A7D78] text-xs font-normal mr-2">[أضيفي الرقم]</span>
                    )}
                  </p>
                  <p className="text-[#7B5E57] text-sm">{item.desc}</p>
                  <p className="text-[#B97863] text-sm font-medium mt-1">{item.action}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 bg-[#F7EDE8] rounded-2xl p-5 text-center">
            <p className="text-[#7B5E57] text-sm leading-relaxed">
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
