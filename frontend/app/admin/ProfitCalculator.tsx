'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'

interface ProfitCalculatorProps {
  metricsAovKwd: number
}

const DICT = {
  en: {
    inputsTitle: "Inputs & Assumptions",
    aovLabel: "AOV (KWD)",
    aovDesc: "Live dashboard",
    rateLabel: "KWD → USD Rate",
    rateDesc: "Default: 1 KWD = 3.28 USD",
    unitPriceLabel: "Unit Selling Price (KWD)",
    unitPriceDesc: "→ Avg {0} pieces / order",
    productCostLabel: "Product Cost / Unit (USD)",
    productCostDesc: "Your COGS per unit",
    cplLabel: "Cost per Lead (USD)",
    cplDesc: "CPL from your ad campaigns",
    crLabel: "Confirmation Rate (%)",
    crDesc: "% of leads that confirm",
    drLabel: "Delivery Rate (%)",
    drDesc: "% of confirmed delivered",
    leadsLabel: "Leads at Scale",
    leadsDesc: "Number of leads for projection",
    aovUsdBadge: "AOV (USD)",
    avgPiecesBadge: "Avg Pieces / Order",
    netExAdsBadge: "Net / Delivered (ex-ads)",
    costStructureTitle: "Your COD Cost Structure",
    perConfirmed: "Per Confirmed Lead",
    perDelivered: "Per Delivered Order",
    perReturned: "Per Returned Order",
    perFulfilled: "Per Fulfilled Order",
    confFee: "Confirmation fee",
    delFee: "Delivery fee",
    retFee: "Return fee",
    fulFee: "Leaves warehouse",
    sec1Title: "Section 1 — Breakeven Thresholds",
    sec1Desc: "At your current AOV and cost structure, what are the minimum metrics you need to not lose money?",
    currProfitLead: "Current Profit Per Lead",
    aboveBreakeven: "Above breakeven at current rates",
    belowBreakeven: "Below breakeven at current rates",
    maxCpa: "Max CPA (Per Delivered)",
    maxCpl: "Max CPL (Per Lead)",
    sec2Title: "Section 2 — Profit at Scale",
    sec2Desc: "Full P&L projection for {0} leads.",
    leads: "Leads",
    confirmed: "Confirmed",
    delivered: "Delivered",
    revenue: "Revenue",
    adSpend: "Ad Spend",
    productCogs: "Product COGS",
    deliveryFees: "Delivery Fees",
    confFees: "Confirmation Fees",
    returnFees: "Return Fees",
    netProfit: "Net Profit",
    roi: "ROI",
    margin: "Margin",
  },
  ar: {
    inputsTitle: "المدخلات والافتراضات",
    aovLabel: "متوسط قيمة الطلب (د.ك)",
    aovDesc: "من لوحة التحكم",
    rateLabel: "سعر الصرف (د.ك → دولار)",
    rateDesc: "الافتراضي: 1 د.ك = 3.28 دولار",
    unitPriceLabel: "سعر بيع القطعة (د.ك)",
    unitPriceDesc: "→ متوسط {0} قطع / طلب",
    productCostLabel: "تكلفة المنتج للقطعة ($)",
    productCostDesc: "تكلفة البضاعة المباعة للقطعة",
    cplLabel: "تكلفة العميل المحتمل ($)",
    cplDesc: "تكلفة الـ Lead من حملاتك",
    crLabel: "معدل التأكيد (%)",
    crDesc: "نسبة التأكيد من الـ Leads",
    drLabel: "معدل التسليم (%)",
    drDesc: "نسبة التسليم من المؤكد",
    leadsLabel: "عدد الـ Leads للتوسع",
    leadsDesc: "العدد المستخدم لحساب التوقعات",
    aovUsdBadge: "متوسط الطلب ($)",
    avgPiecesBadge: "متوسط القطع / طلب",
    netExAdsBadge: "الصافي / مستلم (بدون إعلانات)",
    costStructureTitle: "هيكلة تكاليف الدفع عند الاستلام",
    perConfirmed: "لكل طلب مؤكد",
    perDelivered: "لكل طلب مستلم",
    perReturned: "لكل طلب مرتجع",
    perFulfilled: "لكل طلب تم تجهيزه",
    confFee: "رسوم التأكيد",
    delFee: "رسوم التوصيل",
    retFee: "رسوم الاسترجاع",
    fulFee: "رسوم الخروج من المستودع",
    sec1Title: "القسم الأول — نقاط التعادل",
    sec1Desc: "بناءً على متوسط طلبك وتكاليفك، ما هي الأرقام المطلوبة لتجنب الخسارة؟",
    currProfitLead: "الربح الحالي لكل Lead",
    aboveBreakeven: "أعلى من نقطة التعادل",
    belowBreakeven: "أقل من نقطة التعادل (خسارة)",
    maxCpa: "أقصى تكلفة طلب مستلم (CPA)",
    maxCpl: "أقصى تكلفة عميل محتمل (CPL)",
    sec2Title: "القسم الثاني — الربح بعد التوسع",
    sec2Desc: "توقعات الأرباح والخسائر الشاملة لـ {0} عميل محتمل.",
    leads: "العملاء المحتملين",
    confirmed: "الطلبات المؤكدة",
    delivered: "الطلبات المستلمة",
    revenue: "الإيرادات",
    adSpend: "تكلفة الإعلانات",
    productCogs: "تكلفة المنتجات",
    deliveryFees: "تكاليف التوصيل",
    confFees: "تكاليف التأكيد",
    returnFees: "تكاليف الاسترجاع",
    netProfit: "صافي الربح",
    roi: "العائد على الإعلانات (ROI)",
    margin: "هامش الربح",
  }
}

export function ProfitCalculator({ metricsAovKwd }: ProfitCalculatorProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const t = DICT[lang]
  const isRtl = lang === 'ar'

  // Inputs matching the image layout
  const [aovKwd, setAovKwd] = useState<number>(metricsAovKwd > 0 ? metricsAovKwd : 15.0)
  const [exchangeRate, setExchangeRate] = useState<number>(3.28)
  const [unitSellingPriceKwd, setUnitSellingPriceKwd] = useState<number>(10)
  const [productCostUsd, setProductCostUsd] = useState<number>(5)
  const [cpl, setCpl] = useState<number>(5.0)
  const [confirmationRate, setConfirmationRate] = useState<number>(60)
  const [deliveryRate, setDeliveryRate] = useState<number>(65)
  const [leadsAtScale, setLeadsAtScale] = useState<number>(1000)

  // Derived Values
  const cr = confirmationRate / 100
  const dr = deliveryRate / 100
  
  const aovUsd = aovKwd * exchangeRate
  const avgPiecesPerOrder = unitSellingPriceKwd > 0 ? aovKwd / unitSellingPriceKwd : 1

  // Fixed Costs from user
  const confirmationFee = 1.70
  const deliveryFee = 6.99
  const returnFee = 5.99
  const fulfillmentFee = 0.00

  // Per Delivered Order Economics
  const cogsPerOrder = productCostUsd * avgPiecesPerOrder
  const confirmationCostPerDelivered = dr > 0 ? confirmationFee / dr : 0
  const returnCostPerDelivered = dr > 0 ? ((1 - dr) / dr) * returnFee : 0
  const fulfillmentCostPerDelivered = dr > 0 ? fulfillmentFee / dr : 0

  const totalExAdsCostPerDelivered = cogsPerOrder + deliveryFee + confirmationCostPerDelivered + returnCostPerDelivered + fulfillmentCostPerDelivered
  const netPerDeliveredExAds = aovUsd - totalExAdsCostPerDelivered

  // Break-even
  const breakEvenCpa = Math.max(0, netPerDeliveredExAds)
  const breakEvenCpl = breakEvenCpa * cr * dr
  const currentProfitPerLead = (breakEvenCpl - cpl)

  // Profit at Scale
  const confirmedOrders = leadsAtScale * cr
  const deliveredOrders = confirmedOrders * dr
  const returnedOrders = confirmedOrders - deliveredOrders

  const totalRevenue = deliveredOrders * aovUsd
  const totalAdSpend = leadsAtScale * cpl
  const totalCogs = deliveredOrders * cogsPerOrder
  const totalDeliveryCost = deliveredOrders * deliveryFee
  const totalConfirmationCost = confirmedOrders * confirmationFee
  const totalReturnCost = returnedOrders * returnFee
  const totalFulfillmentCost = confirmedOrders * fulfillmentFee

  const totalCosts = totalAdSpend + totalCogs + totalDeliveryCost + totalConfirmationCost + totalReturnCost + totalFulfillmentCost
  const netProfit = totalRevenue - totalCosts
  const roi = totalAdSpend > 0 ? (netProfit / totalAdSpend) * 100 : 0
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  return (
    <div className={`bg-[#FAF9F6] p-4 sm:p-6 -mx-4 sm:mx-0 rounded-2xl min-h-screen text-[#2D3748] transition-all duration-300 ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header with Language Toggle */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E2E8F0] hover:bg-gray-50 transition-colors text-sm font-bold text-[#4A5568]"
        >
          <Globe className="w-4 h-4 text-[#2C7A51]" />
          {lang === 'en' ? 'العربية' : 'English'}
        </button>
      </div>

      {/* 1. Inputs & Assumptions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] mb-6">
        <h2 className="text-xl font-bold mb-6 text-[#1A202C]">{t.inputsTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.aovLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.aovDesc}: {metricsAovKwd.toFixed(3)} KWD</p>
            <input 
              type="number" step="0.1" 
              value={aovKwd} onChange={e => setAovKwd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.rateLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.rateDesc}</p>
            <input 
              type="number" step="0.01" 
              value={exchangeRate} onChange={e => setExchangeRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.unitPriceLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.unitPriceDesc.replace('{0}', avgPiecesPerOrder.toFixed(2))}</p>
            <input 
              type="number" step="0.1" 
              value={unitSellingPriceKwd} onChange={e => setUnitSellingPriceKwd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.productCostLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.productCostDesc}</p>
            <input 
              type="number" step="0.1" 
              value={productCostUsd} onChange={e => setProductCostUsd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.cplLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.cplDesc}</p>
            <input 
              type="number" step="0.1" 
              value={cpl} onChange={e => setCpl(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.crLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.crDesc}</p>
            <input 
              type="number" 
              value={confirmationRate} onChange={e => setConfirmationRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.drLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.drDesc}</p>
            <input 
              type="number" 
              value={deliveryRate} onChange={e => setDeliveryRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">{t.leadsLabel}</label>
            <p className="text-xs text-[#718096] mb-2">{t.leadsDesc}</p>
            <input 
              type="number" 
              value={leadsAtScale} onChange={e => setLeadsAtScale(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none text-left" 
              dir="ltr"
            />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-6">
          <div className="bg-[#1B4D3E] text-white px-4 py-2 rounded-xl flex items-center gap-2" dir="ltr">
            <span className="text-sm font-semibold opacity-90">{t.aovUsdBadge}</span>
            <span className="text-xl font-bold">${aovUsd.toFixed(2)}</span>
          </div>
          <div className="bg-[#F5F2EA] text-[#1A202C] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#E2E8F0]" dir="ltr">
            <span className="text-sm font-semibold opacity-80">{t.avgPiecesBadge}</span>
            <span className="text-xl font-bold">{avgPiecesPerOrder.toFixed(2)}</span>
          </div>
          <div className="bg-[#E6F4EA] text-[#2C7A51] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#C6E5D1]" dir="ltr">
            <span className="text-sm font-semibold opacity-90">{t.netExAdsBadge}</span>
            <span className="text-xl font-bold">{netPerDeliveredExAds >= 0 ? '+' : ''}${netPerDeliveredExAds.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. YOUR COD COST STRUCTURE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] mb-6">
        <h3 className="text-xs font-bold text-[#718096] tracking-wider uppercase mb-4">{t.costStructureTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" dir="ltr">
          <div className={`bg-[#F5F2EA] p-4 rounded-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#4A5568] mb-1">{t.perConfirmed}</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${confirmationFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">{t.confFee}</p>
          </div>
          <div className={`bg-[#F5F2EA] p-4 rounded-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#4A5568] mb-1">{t.perDelivered}</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${deliveryFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">{t.delFee}</p>
          </div>
          <div className={`bg-[#F5F2EA] p-4 rounded-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#4A5568] mb-1">{t.perReturned}</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${returnFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">{t.retFee}</p>
          </div>
          <div className={`bg-[#F5F2EA] p-4 rounded-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#4A5568] mb-1">{t.perFulfilled}</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${fulfillmentFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">{t.fulFee}</p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1 - Breakeven */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1A202C] mb-2">{t.sec1Title}</h2>
          <p className="text-sm text-[#718096] mb-6">{t.sec1Desc}</p>
          
          <div className={`rounded-2xl p-6 border ${currentProfitPerLead >= 0 ? 'bg-[#E6F4EA] border-[#C6E5D1]' : 'bg-[#FEEBC8] border-[#FEB2B2]'} mb-6`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D3748] mb-1">{t.currProfitLead}</p>
            <p className={`text-4xl font-extrabold ${currentProfitPerLead >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`} dir="ltr">
              {currentProfitPerLead >= 0 ? '+' : ''}${currentProfitPerLead.toFixed(2)}
            </p>
            <p className="text-sm mt-2 font-medium opacity-80">
              {currentProfitPerLead >= 0 ? t.aboveBreakeven : t.belowBreakeven}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#4A5568]">{t.maxCpa}</span>
              <span className="font-bold text-[#1A202C]" dir="ltr">${breakEvenCpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#4A5568]">{t.maxCpl}</span>
              <span className="font-bold text-[#1A202C]" dir="ltr">${breakEvenCpl.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 2 - Profit at Scale */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1A202C] mb-2">{t.sec2Title}</h2>
          <p className="text-sm text-[#718096] mb-6">{t.sec2Desc.replace('{0}', leadsAtScale.toLocaleString())}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">{t.leads}</p>
              <p className="font-bold text-[#1A202C] text-lg" dir="ltr">{leadsAtScale.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">{t.confirmed}</p>
              <p className="font-bold text-[#1A202C] text-lg" dir="ltr">{Math.round(confirmedOrders).toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">{t.delivered}</p>
              <p className="font-bold text-[#1A202C] text-lg" dir="ltr">{Math.round(deliveredOrders).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-[#2C7A51]">{t.revenue}</span>
              <span className="font-bold text-[#2C7A51]" dir="ltr">${Math.round(totalRevenue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">{t.adSpend}</span>
              <span className="font-semibold text-[#1A202C]" dir="ltr">${Math.round(totalAdSpend).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">{t.productCogs}</span>
              <span className="font-semibold text-[#1A202C]" dir="ltr">${Math.round(totalCogs).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">{t.deliveryFees}</span>
              <span className="font-semibold text-[#1A202C]" dir="ltr">${Math.round(totalDeliveryCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">{t.confFees}</span>
              <span className="font-semibold text-[#1A202C]" dir="ltr">${Math.round(totalConfirmationCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">{t.returnFees}</span>
              <span className="font-semibold text-[#1A202C]" dir="ltr">${Math.round(totalReturnCost).toLocaleString()}</span>
            </div>
            
            <div className="border-t border-[#E2E8F0] pt-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1A202C] text-base">{t.netProfit}</span>
                <span className={`font-extrabold text-xl ${netProfit >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`} dir="ltr">
                  {netProfit >= 0 ? '+' : ''}${Math.round(netProfit).toLocaleString()}
                </span>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E2E8F0] ${isRtl ? 'text-right' : 'text-left'}`}>
              <div>
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">{t.roi}</p>
                <p className={`font-bold text-lg ${roi >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`} dir="ltr">{roi.toFixed(1)}%</p>
              </div>
              <div className={isRtl ? 'text-left' : 'text-right'}>
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">{t.margin}</p>
                <p className={`font-bold text-lg ${margin >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`} dir="ltr">{margin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
