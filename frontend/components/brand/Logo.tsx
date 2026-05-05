import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { circle: 'w-8 h-8 text-base', arabic: 'text-lg', english: 'text-xs' },
    md: { circle: 'w-10 h-10 text-xl', arabic: 'text-xl', english: 'text-xs' },
    lg: { circle: 'w-12 h-12 text-2xl', arabic: 'text-2xl', english: 'text-sm' },
  }

  const s = sizes[size]

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-[#B97863] text-white font-bold flex-shrink-0',
          s.circle
        )}
        aria-hidden="true"
      >
        M
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold text-[#2F2523]', s.arabic)}>مهد بيبي</span>
        <span className={cn('text-[#7B5E57] font-medium mt-0.5', s.english)}>
          mahdbaby
        </span>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-[#B97863] focus:ring-offset-2 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
