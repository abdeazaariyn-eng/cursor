import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { img: 32, arabic: 'text-lg', english: 'text-xs' },
    md: { img: 48, arabic: 'text-xl', english: 'text-xs' },
    lg: { img: 64, arabic: 'text-2xl', english: 'text-sm' },
  }

  const s = sizes[size]

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex-shrink-0" style={{ width: s.img, height: s.img }}>
        <Image
          src="/logo.png"
          alt="Mahdbaby Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold text-[#142B3B]', s.arabic)}>مهد بيبي</span>
        <span className={cn('text-[#506A77] font-medium mt-0.5', s.english)}>
          mahdbaby
        </span>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-[#4A8B9A] focus:ring-offset-2 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
