'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useCartStore } from '@/store/cart-store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items, openCart } = useCartStore()
  const itemCount = items.length

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#D6E4E8]'
          : 'bg-[#F5F8FA]'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Right: Logo (RTL = right side first) */}
          <Logo size="md" />

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="القائمة الرئيسية">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#506A77] hover:text-[#4A8B9A] font-medium transition-colors duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Left: Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={openCart}
              aria-label={`السلة ${itemCount > 0 ? `(${itemCount} منتج)` : ''}`}
              className="relative p-2 text-[#506A77] hover:text-[#4A8B9A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A8B9A] focus:ring-offset-2 rounded-full"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1 -start-1 bg-[#4A8B9A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#506A77] hover:text-[#4A8B9A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A8B9A] focus:ring-offset-2 rounded-full"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#D6E4E8] shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="القائمة المحمولة">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#506A77] hover:text-[#4A8B9A] hover:bg-[#EBF2F5] font-medium px-4 py-3 rounded-xl transition-colors duration-200 text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
