'use client'

import { Truck, Award, CreditCard, ShieldCheck } from 'lucide-react'

const TRUST_FEATURES = [
  {
    icon: <Truck className="w-7 h-7" />,
    title: 'توصيل سريع',
    description: 'شحن لجميع المدن',
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    iconBg: 'bg-green-100',
    color: 'text-green-600',
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: 'ضمان 30 يوم',
    description: 'استرجاع بدون أسئلة',
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    iconBg: 'bg-amber-100',
    color: 'text-amber-600',
  },
  {
    icon: <CreditCard className="w-7 h-7" />,
    title: 'دفع عند الاستلام',
    description: 'بدون دفع مسبق',
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconBg: 'bg-blue-100',
    color: 'text-blue-600',
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'معايير SFDA',
    description: 'معتمد وآمن',
    bg: 'bg-gradient-to-br from-teal-50 to-teal-100',
    iconBg: 'bg-teal-100',
    color: 'text-teal-600',
  },
]

export function TrustStrip() {
  return (
    <section className="bg-white py-8 sm:py-12 border-t border-[#D6E4E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature, i) => (
            <div key={i} className={`${feature.bg} p-6 rounded-2xl text-center transition-transform hover:scale-105 duration-300`}>
              <div className={`${feature.iconBg} ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-[#142B3B] text-sm mb-1">{feature.title}</h3>
              <p className="text-[#506A77] text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-4">
              {TRUST_FEATURES.map((feature, i) => (
                <div key={i} className={`${feature.bg} p-5 rounded-xl flex-shrink-0 w-40 text-center`}>
                  <div className={`${feature.iconBg} ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-[#142B3B] text-xs mb-0.5">{feature.title}</h3>
                  <p className="text-[#506A77] text-xs leading-tight">{feature.description}</p>
                </div>
              ))}
            </div>
            {/* Scroll hint for mobile */}
            <p className="text-center text-[#8CA4B0] text-xs mt-3">اسحبي لليمين</p>
          </div>
        </div>
      </div>
    </section>
  )
}
