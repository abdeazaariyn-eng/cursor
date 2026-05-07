import { cn } from '@/lib/utils'
import { ShieldCheck, Headphones, Package, Star, Heart } from 'lucide-react'

interface TrustBadge {
  icon: React.ReactNode
  label: string
}

const BADGES: TrustBadge[] = [
  { icon: <Package className="w-4 h-4" />, label: 'دفع عند الاستلام' },
  { icon: <Headphones className="w-4 h-4" />, label: 'دعم عربي' },
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'تأكيد قبل الشحن' },
  { icon: <Star className="w-4 h-4" />, label: 'اختيار مهد بيبي' },
  { icon: <Heart className="w-4 h-4" />, label: 'تجارب أمهات' },
]

interface TrustBadgesProps {
  className?: string
  variant?: 'row' | 'grid'
  showAll?: boolean
}

export function TrustBadges({
  className,
  variant = 'row',
  showAll = false,
}: TrustBadgesProps) {
  const badges = showAll ? BADGES : BADGES.slice(0, 4)

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 gap-3', className)}>
        {badges.map((badge, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-[#EBF2F5] rounded-xl px-3 py-2"
          >
            <span className="text-[#4A8B9A] flex-shrink-0">{badge.icon}</span>
            <span className="text-sm font-medium text-[#506A77]">{badge.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-4 gap-y-2',
        className
      )}
    >
      {badges.map((badge, i) => (
        <div key={i} className="flex items-center gap-1.5 text-[#506A77]">
          <span className="text-[#4A8B9A]">{badge.icon}</span>
          <span className="text-sm font-medium whitespace-nowrap">{badge.label}</span>
        </div>
      ))}
    </div>
  )
}
