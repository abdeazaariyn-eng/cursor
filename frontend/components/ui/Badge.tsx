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
    primary: 'bg-[#4A8B9A] text-white',
    gold: 'bg-[#D4AF37] text-white',
    sage: 'bg-[#6F9E8E] text-white',
    blush: 'bg-[#EBF2F5] text-[#506A77] border border-[#C9DADD]',
    outline: 'bg-transparent text-[#4A8B9A] border border-[#4A8B9A]',
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
