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
        'bg-white rounded-2xl border border-[#D6E4E8] p-5 shadow-sm',
        className
      )}
    >
      <StarRating rating={stars} size="sm" className="mb-3" />
      <p className="text-[#142B3B] text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#EBF2F5] flex items-center justify-center text-[#4A8B9A] font-bold text-sm flex-shrink-0">
          {name.charAt(0)}
        </div>
        <span className="text-[#506A77] text-sm font-medium">{name}</span>
        <span className="text-[#6B8A99] text-xs me-auto">✓ مشترية موثقة</span>
      </div>
    </div>
  )
}
