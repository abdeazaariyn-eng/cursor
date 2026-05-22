'use client'

import { Phone, MapPin, CheckCircle } from 'lucide-react'

export function CallExpectations() {
  const items = [
    { icon: CheckCircle, text: 'نتأكد من اسمك وعنوانك', color: '#267A4A', bg: '#EFF7F3' },
    { icon: MapPin, text: 'نحدد أقرب وقت توصيل لك', color: '#4A8B9A', bg: '#EBF2F5' },
    { icon: Phone, text: 'نجاوب على أي سؤال عندك', color: '#7B1FA2', bg: '#EDE7F6' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm p-5 mb-6">
      <div className="text-center mb-4">
        <h2 className="font-bold text-[#142B3B] text-base mb-1">المكالمة بسيطة وسريعة</h2>
        <p className="text-[#6B8A99] text-xs">أقل من ٣٠ ثانية — بس نتأكد ونشحن لك</p>
      </div>

      <div className="flex gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex-1 text-center">
              <div
                className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <p className="text-[#142B3B] text-xs font-medium leading-snug">{item.text}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 bg-[#FFF8E1] rounded-lg p-2.5 text-center">
        <p className="text-[#F57F17] text-xs font-semibold">
          🎯 بعد المكالمة مباشرة — نشحن طلبك!
        </p>
      </div>
    </div>
  )
}
