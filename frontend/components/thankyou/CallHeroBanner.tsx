'use client'

import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { downloadVCard } from '@/lib/vcard'
import { getCallTimingMessage } from '@/lib/order-display'

interface CallHeroBannerProps {
  createdAt: string
  customerPhoneMasked: string
}

export function CallHeroBanner({ createdAt, customerPhoneMasked }: CallHeroBannerProps) {
  const callTiming = getCallTimingMessage(createdAt)

  const handleSaveNumber = () => {
    // Extract full number for vcard (with +965 prefix)
    const fullNumber = customerPhoneMasked.replace(/•/g, '0')
    downloadVCard(fullNumber)
  }

  return (
    <div
      className={`rounded-2xl p-6 mb-6 border-2 ${
        callTiming.urgent
          ? 'bg-gradient-to-br from-[#FFF8E1] to-[#FFFAF0] border-[#FFD54F] shadow-[0_0_20px_rgba(255,213,79,0.2)]'
          : 'bg-gradient-to-br from-[#F3E8FF] to-[#FAF5FF] border-[#CE93D8] shadow-[0_0_20px_rgba(206,147,216,0.1)]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Animated Phone Icon */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            callTiming.urgent ? 'bg-[#FFF3C4] animate-pulse' : 'bg-[#EDE7F6] animate-bounce'
          }`}
        >
          <Phone className={`w-6 h-6 ${callTiming.urgent ? 'text-[#F57F17]' : 'text-[#7B1FA2]'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 text-right">
          {/* Main heading */}
          <h2 className="font-bold text-[#142B3B] text-lg mb-2">{callTiming.heading}</h2>

          {/* Description */}
          <p className="text-[#506A77] text-sm leading-relaxed mb-3">{callTiming.description}</p>

          {/* Phone number highlight */}
          <div className="bg-white/80 rounded-xl p-3 mb-3 border border-black/5 backdrop-blur-sm">
            <p className="text-[#142B3B] text-sm font-semibold mb-1">📱 نتصل على:</p>
            <p className="text-[#4A8B9A] font-mono text-sm font-bold">{customerPhoneMasked}</p>
            <p className="text-[#6B8A99] text-xs mt-1">
              المكالمة قد تأتي من رقم غريب — لا تتجاهليها 🙏
            </p>
          </div>

          {/* Countdown (only when urgent) */}
          {callTiming.urgent && callTiming.etaMinutes && (
            <div className="mb-3 inline-block bg-[#F57F17]/10 text-[#F57F17] px-3 py-1 rounded-full text-xs font-semibold">
              ⏱️ متوقع خلال ~{callTiming.etaMinutes} دقائق
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleSaveNumber}
              variant="outline"
              className="flex-1 border-2 border-[#4A8B9A] text-[#4A8B9A] hover:bg-[#4A8B9A]/5 text-sm font-semibold"
            >
              💾 احفظي الرقم
            </Button>
            <a
              href={`https://wa.me/${customerPhoneMasked.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1eaa54] transition-colors text-sm font-semibold px-4 py-2"
            >
              💬 تواصلي واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
