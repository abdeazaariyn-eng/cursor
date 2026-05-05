import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'gold' | 'sage' | 'blush' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'blush',
  size = 'sm',
  className,
}: BadgeProps) {
  const variants = {
    primary: 'bg-[#B97863] text-white',
    gold: 'bg-[#D9A441] text-white',
    sage: 'bg-[#6F9E8E] text-white',
    blush: 'bg-[#F7EDE8] text-[#7B5E57] border border-[#E7D4CC]',
    outline: 'bg-transparent text-[#B97863] border border-[#B97863]',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
