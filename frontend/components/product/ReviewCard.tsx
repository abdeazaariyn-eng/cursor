import { StarRating } from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  name: string
  text: string
  stars?: number
  className?: string
}

export function ReviewCard({ name, text, stars = 5, className }: ReviewCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 border border-[#E8EEF1] flex flex-col',
        className
      )}
    >
      <StarRating rating={stars} size="sm" className="mb-4" />
      <p className="text-[#142B3B] text-sm leading-relaxed flex-1 mb-5">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-[#F0F4F6]">
        <div className="w-8 h-8 rounded-full bg-[#EBF2F5] flex items-center justify-center text-[#4A8B9A] font-semibold text-xs flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <span className="text-[#142B3B] text-sm font-semibold block">{name}</span>
          <span className="text-[#8CA4B0] text-xs">مشترية موثقة</span>
        </div>
      </div>
    </div>
  )
}
