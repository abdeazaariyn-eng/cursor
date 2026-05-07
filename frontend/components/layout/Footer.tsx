import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { Package, Headphones, ShieldCheck } from 'lucide-react'

const PRODUCT_LINKS = [
  { href: '/products/baby-head-protection-mask', label: 'قناع الحماية' },
  { href: '/products/portable-baby-bottle-warmer', label: 'دفاية الزجاجات' },
  { href: '/products/wearable-electric-breast-pump', label: 'مضخة الثدي' },
]

const SUPPORT_LINKS = [
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
  { href: '/shipping', label: 'معلومات الشحن' },
  { href: '/returns', label: 'سياسة الاستبدال' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
]

export function Footer() {
  return (
    <footer className="bg-[#2F2523] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#B97863] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  M
                </div>
                <div>
                  <div className="font-bold text-lg text-white">مهد بيبي</div>
                  <div className="text-xs text-[#C9B0A8]">mahdbaby</div>
                </div>
              </div>
            </div>
            <p className="text-[#C9B0A8] text-sm leading-relaxed mb-4">
              بوتيك مختار لأمهات الخليج. اختيار مدروس، أمان معتمد، وضمان كامل — لأن طفلك يستاهل قرار صح.
            </p>
            {/* Trust Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#C9B0A8] text-sm">
                <ShieldCheck className="w-4 h-4 text-[#B97863]" />
                <span>مطابق لمعايير SFDA</span>
              </div>
              <div className="flex items-center gap-2 text-[#C9B0A8] text-sm">
                <Package className="w-4 h-4 text-[#B97863]" />
                <span>دفع عند الاستلام</span>
              </div>
              <div className="flex items-center gap-2 text-[#C9B0A8] text-sm">
                <Headphones className="w-4 h-4 text-[#B97863]" />
                <span>دعم عربي + ضمان 30 يوم</span>
              </div>
            </div>
          </div>


          {/* Support */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">الدعم والمعلومات</h3>
            <ul className="flex flex-col gap-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#C9B0A8] hover:text-[#B97863] text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">تواصلي معنا</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/966XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#C9B0A8] hover:text-[#B97863] text-sm transition-colors duration-200"
              >
                <span>📱</span>
                <span>واتساب [أضيفي الرقم]</span>
              </a>
              <a
                href="mailto:support@mahdbaby.shop"
                className="flex items-center gap-2 text-[#C9B0A8] hover:text-[#B97863] text-sm transition-colors duration-200"
              >
                <span>✉️</span>
                <span>support@mahdbaby.shop</span>
              </a>
            </div>

            <h3 className="font-bold text-base mt-6 mb-3 text-white">تابعينا</h3>
            <div className="flex gap-3">
              {['انستغرام'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="bg-[#3D2E2B] hover:bg-[#B97863] text-[#C9B0A8] hover:text-white text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                  aria-label={social}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar Removed as requested */}
      </div>
    </footer>
  )
}
