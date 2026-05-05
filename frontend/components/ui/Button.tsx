'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B97863] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-[#B97863] text-white hover:bg-[#A3674F] active:bg-[#8F5840]',
      secondary:
        'bg-[#F7EDE8] text-[#7B5E57] border border-[#E7D4CC] hover:bg-[#EDDED7] active:bg-[#E5D1C8]',
      ghost: 'bg-transparent text-[#7B5E57] hover:bg-[#F7EDE8]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin ms-2" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
