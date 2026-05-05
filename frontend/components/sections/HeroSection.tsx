import { cn } from '@/lib/utils'
import { TrustBadges } from '@/components/ui/TrustBadges'

interface HeroSectionProps {
  heading: string
  subheading?: string
  badge?: string
  showTrustBadges?: boolean
  children?: React.ReactNode
  className?: string
  variant?: 'home' | 'product' | 'page'
}

export function HeroSection({
  heading,
  subheading,
  badge,
  showTrustBadges = false,
  children,
  className,
  variant = 'home',
}: HeroSectionProps) {
  const backgrounds = {
    home: 'bg-gradient-to-b from-brand-blush to-brand-ivory',
    product: 'bg-brand-blush',
    page: 'bg-brand-ivory',
  }

  return (
    <section className={cn('relative overflow-hidden', backgrounds[variant], className)}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
        {badge && (
          <span className="inline-flex items-center gap-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold px-4 py-1.5 mb-6">
            ✦ {badge}
          </span>
        )}

        <h1
          className={cn(
            'font-bold text-brand-deep leading-tight text-balance',
            variant === 'home' ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl',
          )}
        >
          {heading}
        </h1>

        {subheading && (
          <p className="mt-4 text-brand-brown text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-balance">
            {subheading}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}

        {showTrustBadges && (
          <div className="mt-10">
            <TrustBadges />
          </div>
        )}
      </div>
    </section>
  )
}
