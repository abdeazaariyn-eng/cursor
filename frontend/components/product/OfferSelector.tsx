'use client'

import { cn } from '@/lib/utils'
import type { OfferId } from '@/lib/prices'
import { OFFER_CONFIG, formatKwd } from '@/lib/prices'
import { Check } from 'lucide-react'

interface OfferSelectorProps {
  selectedOffer: OfferId
  onChange: (offer: OfferId) => void
  className?: string
}

const OFFER_IDS: OfferId[] = ['one_piece', 'two_pieces', 'three_pieces']

export function OfferSelector({
  selectedOffer,
  onChange,
  className,
}: OfferSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} role="radiogroup" aria-label="اختاري العرض">
      {OFFER_IDS.map((offerId) => {
        const offer = OFFER_CONFIG[offerId]
        const isSelected = selectedOffer === offerId

        return (
          <button
            key={offerId}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(offerId)}
            className={cn(
              'w-full flex items-center justify-between rounded-2xl border-2 p-4 text-right transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A8B9A] focus:ring-offset-2',
              isSelected
                ? 'border-[#4A8B9A] bg-[#EBF2F5] shadow-sm'
                : 'border-[#C9DADD] bg-white hover:border-[#78AAB7]'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Selection indicator */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  isSelected ? 'border-[#4A8B9A] bg-[#4A8B9A]' : 'border-[#D4BEB7]'
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>

              {/* Offer info */}
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'font-bold text-base',
                      isSelected ? 'text-[#4A8B9A]' : 'text-[#142B3B]'
                    )}
                  >
                    {offer.label}
                  </span>
                  {offer.recommended && (
                    <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      أفضل قيمة
                    </span>
                  )}
                </div>
                <div className="text-sm text-[#506A77] mt-0.5">{offer.description}</div>
              </div>
            </div>

            {/* Price + Savings */}
            <div className="text-left flex-shrink-0">
              <div
                className={cn(
                  'font-bold text-lg',
                  isSelected ? 'text-[#4A8B9A]' : 'text-[#142B3B]'
                )}
              >
                {formatKwd(offer.priceKwd)}
              </div>
              {offer.savings && (
                <div className="text-[#267A4A] text-xs font-semibold mt-0.5">
                  {offer.savings}
                </div>
              )}
              {offer.originalPriceKwd && offer.originalPriceKwd > offer.priceKwd && (
                <div className="text-[#6B8A99] text-xs line-through">
                  {formatKwd(offer.originalPriceKwd ?? 0)}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
