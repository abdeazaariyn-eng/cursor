'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import type { Product } from '@/data/products'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, className, onAddToCart }: ProductCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#F0E3DC] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#F7EDE8] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-5xl mb-3">
              {product.id === 'baby_head_protection_mask' ? '🛡️' :
               product.id === 'portable_baby_bottle_warmer' ? '🍼' : '💝'}
            </div>
            <p className="text-[#C9B0A8] text-xs">صورة توضيحية</p>
          </div>
        </div>
        {/* Badge overlay */}
        <div className="absolute top-3 end-3">
          <Badge variant="primary">{product.badge}</Badge>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Filter tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {product.badges.slice(0, 2).map((badge) => (
            <Badge key={badge} variant="blush" size="sm">{badge}</Badge>
          ))}
        </div>

        {/* Heading */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-[#2F2523] text-base leading-snug mb-1.5 hover:text-[#B97863] transition-colors">
            {product.cardHeading}
          </h3>
        </Link>

        <p className="text-[#7B5E57] text-sm leading-relaxed mb-3 flex-1">
          {product.cardSubheading}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={5} size="sm" />
          <span className="text-xs text-[#9A7D78]">(+50 تقييم)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-xs text-[#7B5E57]">من</span>
          <span className="text-xl font-bold text-[#B97863]">19</span>
          <span className="text-sm font-medium text-[#7B5E57]">KWD</span>
        </div>

        {/* CTA */}
        <Link href={`/products/${product.slug}`} className="block">
          <Button variant="primary" fullWidth size="md">
            اختاري العرض
          </Button>
        </Link>
      </div>
    </div>
  )
}
