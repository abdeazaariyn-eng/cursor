'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Faq {
  q: string
  a: string
}

interface FaqSectionProps {
  faqs: Faq[]
  className?: string
}

export function FaqSection({ faqs, className }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-[#C9DADD] rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-right hover:bg-[#EBF2F5] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4A8B9A]"
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-[#142B3B] text-sm">{faq.q}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-[#4A8B9A] flex-shrink-0 ms-3 transition-transform duration-200',
                openIndex === i && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-[#506A77] text-sm leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
