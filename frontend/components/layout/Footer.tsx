'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { 
  Package, Headphones, ShieldCheck, 
  Info, Mail, Phone,
  RotateCcw, Lock, Instagram, Twitter, Facebook, ChevronDown
} from 'lucide-react'

// Icon definitions first
const Shield = () => <ShieldCheck className="w-4 h-4" />
const Flame = () => <Package className="w-4 h-4" />
const Heart = () => <Package className="w-4 h-4" />

const PRODUCT_LINKS = [
  { href: '/products/baby-head-protection-mask', icon: Shield, label: 'قناع الحماية' },
  { href: '/products/portable-baby-bottle-warmer', icon: Flame, label: 'دفاية الزجاجات' },
  { href: '/products/wearable-electric-breast-pump', icon: Heart, label: 'مضخة الثدي' },
]

const SUPPORT_LINKS = [
  { href: '/about', icon: Info, label: 'من نحن' },
  { href: '/contact', icon: Mail, label: 'تواصل معنا' },
  { href: '/shipping', icon: Package, label: 'معلومات الشحن' },
  { href: '/returns', icon: RotateCcw, label: 'سياسة الاستبدال' },
  { href: '/privacy', icon: Lock, label: 'سياسة الخصوصية' },
]

const SOCIAL_LINKS = [
  { icon: Instagram, href: '#', label: 'انستغرام' },
  { icon: Facebook, href: '#', label: 'فيسبوك' },
  { icon: Twitter, href: '#', label: 'تويتر' },
]

// Accordion Section Component
function AccordionSection({ title, icon: Icon, children }: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:block">
      {/* Mobile Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between py-4 px-4 border-b border-[#1A384D] hover:bg-[#1A384D] transition-colors"
      >
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#4A8B9A]" />}
          {title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-[#4A8B9A] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Mobile Accordion Content */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 bg-[#0F1E28]">{children}</div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block">
        <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#4A8B9A]" />}
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#142B3B] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Desktop Grid, Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section - Always Visible */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Mahdbaby Logo"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg text-white">مهد بيبي</div>
                  <div className="text-xs text-[#8CA4B0]">mahdbaby</div>
                </div>
              </div>
            </div>
            <p className="text-[#8CA4B0] text-sm leading-relaxed mb-4">
              بوتيك مختار لأمهات الخليج. اختيار مدروس، أمان معتمد، وضمان كامل — لأن طفلك يستاهل قرار صح.
            </p>
            {/* Trust Badges with Icons */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-[#8CA4B0] text-sm hover:text-[#4A8B9A] transition-colors">
                <div className="bg-[#1A384D] p-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-[#4A8B9A]" />
                </div>
                <span>مطابق لمعايير SFDA</span>
              </div>
              <div className="flex items-center gap-3 text-[#8CA4B0] text-sm hover:text-[#4A8B9A] transition-colors">
                <div className="bg-[#1A384D] p-2 rounded-lg">
                  <Package className="w-4 h-4 text-[#4A8B9A]" />
                </div>
                <span>دفع عند الاستلام</span>
              </div>
              <div className="flex items-center gap-3 text-[#8CA4B0] text-sm hover:text-[#4A8B9A] transition-colors">
                <div className="bg-[#1A384D] p-2 rounded-lg">
                  <Headphones className="w-4 h-4 text-[#4A8B9A]" />
                </div>
                <span>دعم عربي + ضمان 30 يوم</span>
              </div>
            </div>
          </div>

          {/* Products - Accordion on Mobile */}
          <AccordionSection title="المنتجات" icon={Package}>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 text-[#8CA4B0] hover:text-[#4A8B9A] text-sm transition-colors duration-200 group"
                  >
                    <div className="bg-[#1A384D] p-2 rounded-lg group-hover:bg-[#4A8B9A] transition-colors">
                      <Package className="w-3.5 h-3.5 text-[#4A8B9A] group-hover:text-white" />
                    </div>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* Support - Accordion on Mobile */}
          <AccordionSection title="الدعم والمعلومات" icon={Info}>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 text-[#8CA4B0] hover:text-[#4A8B9A] text-sm transition-colors duration-200 group"
                  >
                    <div className="bg-[#1A384D] p-2 rounded-lg group-hover:bg-[#4A8B9A] transition-colors">
                      <link.icon className="w-3.5 h-3.5 text-[#4A8B9A] group-hover:text-white" />
                    </div>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* Contact & Social - Accordion on Mobile */}
          <AccordionSection title="تواصلي معنا" icon={Phone}>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href="https://wa.me/966XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#8CA4B0] hover:text-[#4A8B9A] text-sm transition-colors duration-200 group"
              >
                <div className="bg-[#1A384D] p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#4A8B9A] group-hover:text-white" />
                </div>
                <span>واتساب</span>
              </a>
              <a
                href="mailto:support@mahdbaby.shop"
                className="flex items-center gap-2.5 text-[#8CA4B0] hover:text-[#4A8B9A] text-sm transition-colors duration-200 group"
              >
                <div className="bg-[#1A384D] p-2 rounded-lg group-hover:bg-[#4A8B9A] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#4A8B9A] group-hover:text-white" />
                </div>
                <span>support@mahdbaby.shop</span>
              </a>
            </div>

            <div className="md:hidden border-t border-[#1A384D] pt-3">
              <h4 className="font-bold text-sm text-white mb-3">تابعينا</h4>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1A384D] hover:bg-[#4A8B9A] text-[#8CA4B0] hover:text-white p-2.5 rounded-lg transition-all duration-200"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Social */}
            <div className="hidden md:block pt-3 border-t border-[#1A384D] mt-3">
              <h4 className="font-bold text-sm text-white mb-3">تابعينا</h4>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1A384D] hover:bg-[#4A8B9A] text-[#8CA4B0] hover:text-white p-2.5 rounded-lg transition-all duration-200"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </footer>
  )
}
