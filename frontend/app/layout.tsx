import type { Metadata } from 'next'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CheckoutModal } from '@/components/checkout/CheckoutModal'
import { UpsellModal } from '@/components/checkout/UpsellModal'
import { PixelScripts } from '@/components/tracking/PixelScripts'

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'مهد بيبي | منتجات مختارة للأم والطفل',
    template: '%s | مهد بيبي',
  },
  description:
    'منتجات مختارة للأم والطفل، تخفف عليك تفاصيل اليوم وتخليك تطمنين أكثر. دفع عند الاستلام، دعم عربي.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahdbaby.shop'),
  openGraph: {
    title: 'مهد بيبي',
    description: 'منتجات مختارة للأم والطفل، تخفف عليك تفاصيل اليوم وتخليك تطمنين أكثر.',
    locale: 'ar_SA',
    type: 'website',
    siteName: 'مهد بيبي',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مهد بيبي',
    description: 'منتجات مختارة للأم والطفل',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className="bg-[#FFF9F5] text-[#2F2523] font-arabic antialiased">
        <PixelScripts />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <UpsellModal />
      </body>
    </html>
  )
}
