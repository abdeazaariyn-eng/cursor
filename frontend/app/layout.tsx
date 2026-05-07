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
    default: 'مهد بيبي | بوتيك مختار للأم والطفل في الخليج',
    template: '%s | مهد بيبي',
  },
  description:
    'بوتيك مختار للأم والطفل في الخليج. كل منتج مدروس، مطابق لمعايير SFDA، مع ضمان ذهبي 30 يوم ودفع عند الاستلام.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahdbaby.shop'),
  openGraph: {
    title: 'مهد بيبي — بوتيك مختار للأم والطفل',
    description:
      'اختيار مدروس، أمان معتمد، وضمان كامل — لأن طفلك يستاهل قرار صح.',
    locale: 'ar_SA',
    type: 'website',
    siteName: 'مهد بيبي',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مهد بيبي',
    description: 'بوتيك مختار للأم والطفل في الخليج — مطابق لمعايير SFDA.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={ibmPlexArabic.variable}>
      <body className="bg-[#F5F8FA] text-[#142B3B] font-arabic antialiased">
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
