'use client'

import { CheckCircle } from 'lucide-react'

export function CallExpectations() {
  return (
    <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-[#267A4A] flex-shrink-0" />
        <h2 className="font-bold text-[#142B3B] text-base">وش نسأل في المكالمة؟</h2>
      </div>

      <div className="bg-[#F8FBFC] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-6 h-6 rounded-full bg-[#267A4A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
            ✓
          </span>
          <span className="text-[#142B3B]">اسمك صحيح ؟</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-6 h-6 rounded-full bg-[#267A4A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
            ✓
          </span>
          <span className="text-[#142B3B]">العنوان صحيح ؟</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-6 h-6 rounded-full bg-[#267A4A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
            ✓
          </span>
          <span className="text-[#142B3B]">الكمية كويسة ؟</span>
        </div>
      </div>

      <p className="text-[#6B8A99] text-xs text-center mt-3 font-medium">
        أقل من 30 ثانية — ونخليك تروحين روحك 🚀
      </p>
    </div>
  )
}
