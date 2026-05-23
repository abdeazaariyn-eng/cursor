'use client'

import { useState } from 'react'
import { Calculator, DollarSign, TrendingUp, AlertCircle, Percent, Target } from 'lucide-react'

interface ProfitCalculatorProps {
  metricsAovKwd: number
}

export function ProfitCalculator({ metricsAovKwd }: ProfitCalculatorProps) {
  const [leads, setLeads] = useState<number>(1000)
  const [cpl, setCpl] = useState<number>(5.0)
  const [confirmationRate, setConfirmationRate] = useState<number>(60)
  const [deliveryRate, setDeliveryRate] = useState<number>(65)
  const [productCost, setProductCost] = useState<number>(10)
  const [avgItemsPerOrder, setAvgItemsPerOrder] = useState<number>(1.2)
  const [exchangeRate, setExchangeRate] = useState<number>(3.28)

  // Use the actual AOV from metrics if available, otherwise fallback to a default KWD value (e.g. 15 KWD)
  const aovKwd = metricsAovKwd > 0 ? metricsAovKwd : 15.0
  const aovUsd = aovKwd * exchangeRate
  
  const cr = confirmationRate / 100
  const dr = deliveryRate / 100
  
  // Fixed Costs
  const confirmationCallCost = 1.7
  const deliveryFee = 6.99
  const returnFee = 5.99

  // --- Break-even Calculations ---
  const cogsPerOrder = productCost * avgItemsPerOrder
  // Non-Ad Cost per Delivered Order:
  // For 1 delivered order, we need (1 / DR) confirmed orders.
  // Confirmed orders cost = (1 / DR) * 1.7
  // Returned orders = (1 / DR) - 1
  // Return cost = Returned orders * 5.99
  const nonAdCostPerDelivered = cogsPerOrder + deliveryFee + (confirmationCallCost / (dr || 0.01)) + (returnFee * (1 - (dr || 0.01)) / (dr || 0.01))
  
  const breakEvenCpa = Math.max(0, aovUsd - nonAdCostPerDelivered)
  // 1 Lead results in (CR * DR) Delivered Orders
  const breakEvenCpl = breakEvenCpa * cr * dr

  // --- Funnel & Profit (Scaling) ---
  const totalAdSpend = leads * cpl
  const confirmedOrders = leads * cr
  const totalConfirmationCost = confirmedOrders * confirmationCallCost
  
  const deliveredOrders = confirmedOrders * dr
  const totalDeliveryCost = deliveredOrders * deliveryFee
  
  const returnedOrders = confirmedOrders - deliveredOrders
  const totalReturnCost = returnedOrders * returnFee
  
  const totalCogs = deliveredOrders * cogsPerOrder
  
  const grossRevenue = deliveredOrders * aovUsd
  const totalCosts = totalAdSpend + totalConfirmationCost + totalDeliveryCost + totalReturnCost + totalCogs
  
  const netProfit = grossRevenue - totalCosts
  const roi = totalAdSpend > 0 ? (netProfit / totalAdSpend) * 100 : 0
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#142B3B] flex items-center gap-2">
          <Calculator className="w-6 h-6 text-[#4A8B9A]" />
          حاسبة الربح والتوسع
        </h2>
        <div className="bg-[#EFF7F3] px-4 py-2 rounded-lg border border-[#C5E0D3] text-sm">
          <span className="text-[#506A77]">متوسط قيمة الطلب الفعلي: </span>
          <span className="font-bold text-[#267A4A]">{aovKwd.toFixed(3)} د.ك</span>
          <span className="text-[#6B8A99] mr-2">({aovUsd.toFixed(2)}$)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- Inputs Section --- */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#D6E4E8] shadow-sm space-y-4">
          <h3 className="font-bold text-[#142B3B] border-b border-[#E8F0F3] pb-3 mb-4">المتغيرات (Inputs)</h3>
          
          <div>
            <label className="block text-xs font-bold text-[#506A77] mb-1">عدد العملاء المحتملين (Leads)</label>
            <input type="number" value={leads} onChange={e => setLeads(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A] focus:ring-1 focus:ring-[#4A8B9A]" dir="ltr" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#506A77] mb-1">تكلفة العميل المحتمل ($ CPL)</label>
            <input type="number" step="0.1" value={cpl} onChange={e => setCpl(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#506A77] mb-1">معدل التأكيد (%)</label>
            <input type="number" value={confirmationRate} onChange={e => setConfirmationRate(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#506A77] mb-1">معدل التسليم (%)</label>
            <input type="number" value={deliveryRate} onChange={e => setDeliveryRate(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
          </div>

          <div className="pt-4 border-t border-[#E8F0F3]">
            <label className="block text-xs font-bold text-[#506A77] mb-1">تكلفة المنتج للقطعة ($)</label>
            <input type="number" step="0.5" value={productCost} onChange={e => setProductCost(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#506A77] mb-1">متوسط عدد القطع في الطلب (Avg Items)</label>
            <input type="number" step="0.1" value={avgItemsPerOrder} onChange={e => setAvgItemsPerOrder(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
            <p className="text-[10px] text-[#6B8A99] mt-1">مهم لحساب التكلفة الفعلية بناءً على متوسط قيمة الطلب (AOV).</p>
          </div>

          <div className="pt-4 border-t border-[#E8F0F3]">
            <label className="block text-xs font-bold text-[#506A77] mb-1">سعر الصرف (دينار كويتي = دولار)</label>
            <input type="number" step="0.01" value={exchangeRate} onChange={e => setExchangeRate(Number(e.target.value))} className="w-full border border-[#D6E4E8] rounded-lg p-2.5 text-sm outline-none focus:border-[#4A8B9A]" dir="ltr" />
          </div>
        </div>

        {/* --- Results Section --- */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Section 1: Break-even */}
          <div className="bg-gradient-to-br from-[#142B3B] to-[#1A384D] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-10 blur-2xl"></div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D4AF37]" />
              نقطة التعادل (Break-even)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-sm text-[#8BB8C9] mb-1">أقصى تكلفة مسموحة للطلب الناجح (Break-even CPA)</p>
                <div className="text-3xl font-extrabold text-[#D4AF37]">${breakEvenCpa.toFixed(2)}</div>
                <p className="text-xs text-white/60 mt-2">إذا زادت تكلفة الإعلانات للطلب الناجح عن هذا الرقم، ستبدأ بالخسارة.</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-sm text-[#8BB8C9] mb-1">أقصى تكلفة مسموحة للعميل المحتمل (Break-even CPL)</p>
                <div className="text-3xl font-extrabold text-[#D4AF37]">${breakEvenCpl.toFixed(2)}</div>
                <p className="text-xs text-white/60 mt-2">التكلفة المستهدفة في الإعلانات لكل Lead لعدم الخسارة.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Profit Projection */}
          <div className="bg-white rounded-2xl border border-[#D6E4E8] shadow-sm overflow-hidden">
            <div className="bg-[#F8FBFC] p-4 border-b border-[#E8F0F3]">
              <h3 className="font-bold text-[#142B3B] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#267A4A]" />
                حساب الربح بعد التوسع (Profit Projection)
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-[#F5F8FA] rounded-xl border border-[#E8F0F3] text-center">
                  <p className="text-xs text-[#506A77] font-bold mb-1">الطلبات المؤكدة</p>
                  <p className="text-xl font-bold text-[#142B3B]">{Math.round(confirmedOrders)}</p>
                </div>
                <div className="p-4 bg-[#F5F8FA] rounded-xl border border-[#E8F0F3] text-center">
                  <p className="text-xs text-[#506A77] font-bold mb-1">الطلبات المستلمة</p>
                  <p className="text-xl font-bold text-[#267A4A]">{Math.round(deliveredOrders)}</p>
                </div>
                <div className="p-4 bg-[#F5F8FA] rounded-xl border border-[#E8F0F3] text-center">
                  <p className="text-xs text-[#506A77] font-bold mb-1">الطلبات المرتجعة</p>
                  <p className="text-xl font-bold text-[#E91E63]">{Math.round(returnedOrders)}</p>
                </div>
                <div className="p-4 bg-[#F5F8FA] rounded-xl border border-[#E8F0F3] text-center">
                  <p className="text-xs text-[#506A77] font-bold mb-1">الإيرادات (Gross)</p>
                  <p className="text-xl font-bold text-[#142B3B]">${Math.round(grossRevenue).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-[#E8F0F3] pt-6 mb-6">
                <h4 className="text-sm font-bold text-[#142B3B] mb-4">ملخص التكاليف:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#506A77]">تكلفة الإعلانات (Ad Spend):</span>
                    <span className="font-semibold text-[#E91E63]">${Math.round(totalAdSpend).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#506A77]">تكلفة تأكيد الطلبات (Call Center):</span>
                    <span className="font-semibold text-[#E91E63]">${Math.round(totalConfirmationCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#506A77]">تكلفة الشحن والتسليم:</span>
                    <span className="font-semibold text-[#E91E63]">${Math.round(totalDeliveryCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#506A77]">تكلفة المرتجعات:</span>
                    <span className="font-semibold text-[#E91E63]">${Math.round(totalReturnCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#506A77]">تكلفة المنتجات (COGS):</span>
                    <span className="font-semibold text-[#E91E63]">${Math.round(totalCogs).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E8F0F3]">
                    <span className="font-bold text-[#142B3B]">إجمالي التكاليف:</span>
                    <span className="font-bold text-[#E91E63]">${Math.round(totalCosts).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${netProfit >= 0 ? 'bg-[#EFF7F3] border-[#C5E0D3]' : 'bg-[#FCE4EC] border-[#F8BBD0]'}`}>
                  <p className="text-sm text-[#506A77] font-bold mb-1">صافي الربح (Net Profit)</p>
                  <p className={`text-2xl font-extrabold ${netProfit >= 0 ? 'text-[#267A4A]' : 'text-[#E91E63]'}`}>
                    ${Math.round(netProfit).toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${roi >= 0 ? 'bg-[#EFF7F3] border-[#C5E0D3]' : 'bg-[#FCE4EC] border-[#F8BBD0]'}`}>
                  <p className="text-sm text-[#506A77] font-bold mb-1">العائد على الإعلانات (ROI)</p>
                  <p className={`text-2xl font-extrabold ${roi >= 0 ? 'text-[#267A4A]' : 'text-[#E91E63]'}`}>
                    {roi.toFixed(1)}%
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${profitMargin >= 0 ? 'bg-[#EFF7F3] border-[#C5E0D3]' : 'bg-[#FCE4EC] border-[#F8BBD0]'}`}>
                  <p className="text-sm text-[#506A77] font-bold mb-1">هامش الربح (Margin)</p>
                  <p className={`text-2xl font-extrabold ${profitMargin >= 0 ? 'text-[#267A4A]' : 'text-[#E91E63]'}`}>
                    {profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
