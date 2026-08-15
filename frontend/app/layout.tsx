import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TrustStrip } from '@/components/layout/TrustStrip'
import { PixelScripts } from '@/components/tracking/PixelScripts'

// Dynamic imports for client-only drawer and modals
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then(mod => ({ default: mod.CartDrawer })), {
  loading: () => null,
  ssr: false,
})
const CheckoutModal = dynamic(() => import('@/components/checkout/CheckoutModal').then(mod => ({ default: mod.CheckoutModal })), {
  loading: () => null,
  ssr: false,
})
const UpsellModal = dynamic(() => import('@/components/checkout/UpsellModal').then(mod => ({ default: mod.UpsellModal })), {
  loading: () => null,
  ssr: false,
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
  fallback: ['sans-serif'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F8FA' },
    { media: '(prefers-color-scheme: dark)', color: '#142B3B' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'مهد بيبي | بوتيك مختار للأم والطفل في الخليج',
    template: '%s | مهد بيبي',
  },
  description:
    'بوتيك مختار للأم والطفل في الخليج. كل منتج مدروس، مطابق لمعايير SFDA، مع ضمان ذهبي 30 يوم ودفع عند الاستلام.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mahdbaby.shop'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
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
        <TrustStrip />
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <UpsellModal />
      </body>
    </html>
  )
}
