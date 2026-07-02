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
  const cardImage = product.cardImage || product.image

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-[#D6E4E8] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#EBF2F5] overflow-hidden">
        <Image 
          src={cardImage}
          alt={product.shortName}
          fill
          className="object-cover"
        />
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
          <h3 className="font-bold text-[#142B3B] text-base leading-snug mb-1.5 hover:text-[#4A8B9A] transition-colors">
            {product.cardHeading}
          </h3>
        </Link>

        <p className="text-[#506A77] text-sm leading-relaxed mb-3 flex-1">
          {product.cardSubheading}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={5} size="sm" />
          <span className="text-xs text-[#6B8A99]">(+50 تقييم)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-xs text-[#506A77]">من</span>
          <span className="text-xl font-bold text-[#4A8B9A]">19</span>
          <span className="text-sm font-medium text-[#506A77]">KWD</span>
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
