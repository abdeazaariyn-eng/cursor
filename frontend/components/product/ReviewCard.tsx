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
        'bg-white rounded-2xl border border-[#F0E3DC] p-5 shadow-sm',
        className
      )}
    >
      <StarRating rating={stars} size="sm" className="mb-3" />
      <p className="text-[#2F2523] text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F7EDE8] flex items-center justify-center text-[#B97863] font-bold text-sm flex-shrink-0">
          {name.charAt(0)}
        </div>
        <span className="text-[#7B5E57] text-sm font-medium">{name}</span>
        <span className="text-[#9A7D78] text-xs me-auto">✓ مشترية موثقة</span>
      </div>
    </div>
  )
}
