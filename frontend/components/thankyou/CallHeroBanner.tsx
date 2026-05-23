'use client'

import { Phone, PhoneIncoming, Clock } from 'lucide-react'
import { getCallTimingMessage } from '@/lib/order-display'

interface CallHeroBannerProps {
  createdAt: string
  customerPhoneMasked: string
}

export function CallHeroBanner({ createdAt, customerPhoneMasked }: CallHeroBannerProps) {
  const callTiming = getCallTimingMessage(createdAt)

  return (
    <div className="mb-6">
      {/* Main Banner */}
      <div
        className={`relative rounded-2xl overflow-hidden border-2 ${
          callTiming.urgent
            ? 'bg-gradient-to-br from-[#FFF8E1] via-[#FFFAF0] to-[#FFF3C4] border-[#FFD54F] shadow-lg shadow-[#FFD54F]/20'
            : 'bg-gradient-to-br from-[#EDE7F6] via-[#F3E8FF] to-[#FAF5FF] border-[#CE93D8] shadow-lg shadow-[#CE93D8]/10'
        }`}
      >
        {/* Urgency Ribbon */}
        {callTiming.urgent && (
          <div className="bg-[#F57F17] text-white text-center py-1.5 px-4">
            <p className="text-xs font-bold animate-pulse">
              ⏱️ فريقنا يتصل فيك الحين — خلال أقل من ١٠ دقائق!
            </p>
          </div>
        )}

        <div className="p-5">
          {/* Icon + Heading */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                callTiming.urgent
                  ? 'bg-[#F57F17] shadow-lg shadow-[#F57F17]/30'
                  : 'bg-[#7B1FA2] shadow-lg shadow-[#7B1FA2]/20'
              }`}
            >
              <PhoneIncoming className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-[#142B3B] text-lg leading-tight">{callTiming.heading}</h2>
              <p className="text-[#506A77] text-sm mt-1">{callTiming.description}</p>
            </div>
          </div>

          {/* Unknown Number Warning - THE MOST CRITICAL ELEMENT */}
          <div className="bg-white rounded-xl p-4 border-2 border-dashed border-[#F57F17]/40">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF3C4] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#F57F17]" />
              </div>
              <div className="flex-1">
                <p className="text-[#142B3B] font-bold text-sm mb-1">
                  ⚠️ مهم: ردي على المكالمة حتى لو الرقم غريب!
                </p>
                <p className="text-[#6B8A99] text-xs leading-relaxed">
                  فريقنا يتصل من عدة أرقام قد لا تعرفينها — لا تتجاهليها لأنها مكالمة تأكيد طلبك فقط.
                </p>
                <div className="bg-[#F8FBFC] border border-[#E8F0F3] rounded-lg p-2 mt-3">
                  <p className="text-[#506A77] text-xs font-semibold flex items-center gap-1">
                    <span>📱</span>
                    <span>سنتصل على رقمك:</span>
                    <span className="font-mono text-[#4A8B9A] font-bold" dir="ltr">{customerPhoneMasked}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-reassurance */}
          <p className="text-[#6B8A99] text-xs text-center mt-4">
            المكالمة سريعة — أقل من ٣٠ ثانية فقط لتأكيد عنوانك ✓
          </p>
        </div>
      </div>
    </div>
  )
}
