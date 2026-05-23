'use client'

import { useState } from 'react'

interface ProfitCalculatorProps {
  metricsAovKwd: number
}

export function ProfitCalculator({ metricsAovKwd }: ProfitCalculatorProps) {
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
    <div className="bg-[#FAF9F6] p-6 -mx-4 sm:mx-0 rounded-2xl min-h-screen text-[#2D3748]" dir="ltr">
      
      {/* 1. Inputs & Assumptions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] mb-6">
        <h2 className="text-xl font-bold mb-6 text-[#1A202C]">Inputs & Assumptions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Row 1 */}
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">AOV (KWD)</label>
            <p className="text-xs text-[#718096] mb-2">Live dashboard: {metricsAovKwd.toFixed(3)} KWD</p>
            <input 
              type="number" step="0.1" 
              value={aovKwd} onChange={e => setAovKwd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">KWD → USD Rate</label>
            <p className="text-xs text-[#718096] mb-2">Default: 1 KWD = 3.28 USD</p>
            <input 
              type="number" step="0.01" 
              value={exchangeRate} onChange={e => setExchangeRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Unit Selling Price (KWD)</label>
            <p className="text-xs text-[#718096] mb-2">→ Avg {avgPiecesPerOrder.toFixed(2)} pieces / order</p>
            <input 
              type="number" step="0.1" 
              value={unitSellingPriceKwd} onChange={e => setUnitSellingPriceKwd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Product Cost / Unit (USD)</label>
            <p className="text-xs text-[#718096] mb-2">Your COGS per unit</p>
            <input 
              type="number" step="0.1" 
              value={productCostUsd} onChange={e => setProductCostUsd(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Cost per Lead (USD)</label>
            <p className="text-xs text-[#718096] mb-2">CPL from your ad campaigns</p>
            <input 
              type="number" step="0.1" 
              value={cpl} onChange={e => setCpl(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Confirmation Rate (%)</label>
            <p className="text-xs text-[#718096] mb-2">% of leads that confirm</p>
            <input 
              type="number" 
              value={confirmationRate} onChange={e => setConfirmationRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Delivery Rate (%)</label>
            <p className="text-xs text-[#718096] mb-2">% of confirmed delivered</p>
            <input 
              type="number" 
              value={deliveryRate} onChange={e => setDeliveryRate(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A202C] mb-1">Leads at Scale</label>
            <p className="text-xs text-[#718096] mb-2">Number of leads for projection</p>
            <input 
              type="number" 
              value={leadsAtScale} onChange={e => setLeadsAtScale(Number(e.target.value))} 
              className="w-full border border-[#E2E8F0] rounded-xl p-3 font-semibold text-[#1A202C] focus:ring-2 focus:ring-[#2C7A51] outline-none" 
            />
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-4 border-t border-[#E2E8F0] pt-6">
          <div className="bg-[#1B4D3E] text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-sm font-semibold opacity-90">AOV (USD)</span>
            <span className="text-xl font-bold">${aovUsd.toFixed(2)}</span>
          </div>
          <div className="bg-[#F5F2EA] text-[#1A202C] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#E2E8F0]">
            <span className="text-sm font-semibold opacity-80">Avg Pieces / Order</span>
            <span className="text-xl font-bold">{avgPiecesPerOrder.toFixed(2)}</span>
          </div>
          <div className="bg-[#E6F4EA] text-[#2C7A51] px-4 py-2 rounded-xl flex items-center gap-2 border border-[#C6E5D1]">
            <span className="text-sm font-semibold opacity-90">Net / Delivered (ex-ads)</span>
            <span className="text-xl font-bold">{netPerDeliveredExAds >= 0 ? '+' : ''}${netPerDeliveredExAds.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. YOUR COD COST STRUCTURE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0] mb-6">
        <h3 className="text-xs font-bold text-[#718096] tracking-wider uppercase mb-4">Your COD Cost Structure</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#F5F2EA] p-4 rounded-2xl">
            <p className="text-xs font-bold text-[#4A5568] mb-1">Per Confirmed Lead</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${confirmationFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">Confirmation fee</p>
          </div>
          <div className="bg-[#F5F2EA] p-4 rounded-2xl">
            <p className="text-xs font-bold text-[#4A5568] mb-1">Per Delivered Order</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${deliveryFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">Delivery fee</p>
          </div>
          <div className="bg-[#F5F2EA] p-4 rounded-2xl">
            <p className="text-xs font-bold text-[#4A5568] mb-1">Per Returned Order</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${returnFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">Return fee</p>
          </div>
          <div className="bg-[#F5F2EA] p-4 rounded-2xl">
            <p className="text-xs font-bold text-[#4A5568] mb-1">Per Fulfilled Order</p>
            <p className="text-2xl font-bold text-[#2C7A51] mb-1">${fulfillmentFee.toFixed(2)}</p>
            <p className="text-xs text-[#718096]">Leaves warehouse</p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1 - Breakeven */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1A202C] mb-2">Section 1 — Breakeven Thresholds</h2>
          <p className="text-sm text-[#718096] mb-6">At your current AOV and cost structure, what are the minimum metrics you need to not lose money?</p>
          
          <div className={`rounded-2xl p-6 border ${currentProfitPerLead >= 0 ? 'bg-[#E6F4EA] border-[#C6E5D1]' : 'bg-[#FEEBC8] border-[#FEB2B2]'} mb-6`}>
            <p className="text-xs font-bold uppercase tracking-wider text-[#2D3748] mb-1">Current Profit Per Lead</p>
            <p className={`text-4xl font-extrabold ${currentProfitPerLead >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`}>
              {currentProfitPerLead >= 0 ? '+' : ''}${currentProfitPerLead.toFixed(2)}
            </p>
            <p className="text-sm mt-2 font-medium opacity-80">
              {currentProfitPerLead >= 0 ? 'Above breakeven at current rates' : 'Below breakeven at current rates'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#4A5568]">Max CPA (Per Delivered)</span>
              <span className="font-bold text-[#1A202C]">${breakEvenCpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#E2E8F0]">
              <span className="text-sm font-semibold text-[#4A5568]">Max CPL (Per Lead)</span>
              <span className="font-bold text-[#1A202C]">${breakEvenCpl.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 2 - Profit at Scale */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2E8F0]">
          <h2 className="text-xl font-bold text-[#1A202C] mb-2">Section 2 — Profit at Scale</h2>
          <p className="text-sm text-[#718096] mb-6">Full P&L projection for <span className="font-bold">{leadsAtScale.toLocaleString()}</span> leads.</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">Leads</p>
              <p className="font-bold text-[#1A202C] text-lg">{leadsAtScale.toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">Confirmed</p>
              <p className="font-bold text-[#1A202C] text-lg">{Math.round(confirmedOrders).toLocaleString()}</p>
            </div>
            <div className="bg-[#F5F2EA] rounded-xl p-3 text-center">
              <p className="text-xs font-bold text-[#718096] mb-1">Delivered</p>
              <p className="font-bold text-[#1A202C] text-lg">{Math.round(deliveredOrders).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-[#2C7A51]">Revenue</span>
              <span className="font-bold text-[#2C7A51]">${Math.round(totalRevenue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">Ad Spend</span>
              <span className="font-semibold text-[#1A202C]">${Math.round(totalAdSpend).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">Product COGS</span>
              <span className="font-semibold text-[#1A202C]">${Math.round(totalCogs).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">Delivery Fees</span>
              <span className="font-semibold text-[#1A202C]">${Math.round(totalDeliveryCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">Confirmation Fees</span>
              <span className="font-semibold text-[#1A202C]">${Math.round(totalConfirmationCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#718096]">Return Fees</span>
              <span className="font-semibold text-[#1A202C]">${Math.round(totalReturnCost).toLocaleString()}</span>
            </div>
            
            <div className="border-t border-[#E2E8F0] pt-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1A202C] text-base">Net Profit</span>
                <span className={`font-extrabold text-xl ${netProfit >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`}>
                  {netProfit >= 0 ? '+' : ''}${Math.round(netProfit).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E2E8F0]">
              <div>
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">ROI</p>
                <p className={`font-bold text-lg ${roi >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`}>{roi.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">Margin</p>
                <p className={`font-bold text-lg ${margin >= 0 ? 'text-[#2C7A51]' : 'text-[#C53030]'}`}>{margin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
