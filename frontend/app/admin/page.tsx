'use client'

import { useState, useEffect } from 'react'
import { Activity, MousePointerClick, ShoppingCart, TrendingUp, Search, Eye, X, Calculator } from 'lucide-react'
import { ProfitCalculator } from './ProfitCalculator'

// Add auth token to a simple API client here
function useAdminAuth() {
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null)
  
  const login = (u: string, p: string) => setCredentials({username: u, password: p})
  const logout = () => setCredentials(null)
  
  const authHeader = credentials 
    ? 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
    : ''
    
  return { credentials, login, logout, authHeader }
}

export default function AdminDashboard() {
  const { credentials, login, logout, authHeader }  = useAdminAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [activeTab, setActiveTab] = useState<'metrics'|'orders'|'profit'>('metrics')
  const [metrics, setMetrics] = useState({ orders: 0, revenue: 0, clicks: 0, conversion_rate: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      let url = `${API_BASE}/admin/metrics`
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      if (params.toString()) url += `?${params.toString()}`
      
      const res = await fetch(url, { headers: { 'Authorization': authHeader } })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      setMetrics(data)
      setError('')
    } catch (e: any) {
      setError(e.message)
      if (e.message === 'Unauthorized') logout()
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/admin/orders?limit=100`, { headers: { 'Authorization': authHeader } })
      if (!res.ok) throw new Error('Unauthorized')
      const data = await res.json()
      setOrders(data.orders || [])
      setError('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchOrderDetails = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/orders/${id}`, { headers: { 'Authorization': authHeader } })
      if (!res.ok) throw new Error('Failed to fetch details')
      const data = await res.json()
      setSelectedOrder(data)
    } catch(e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (credentials) {
      if (activeTab === 'metrics') fetchMetrics()
      if (activeTab === 'orders') fetchOrders()
    }
  }, [credentials, activeTab, startDate, endDate])

  if (!credentials) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#D6E4E8]">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#142B3B]">تسجيل الدخول للإدارة</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#4A8B9A] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#4A8B9A] outline-none" />
            </div>
            <button onClick={() => login(username, password)} className="w-full bg-[#142B3B] text-white py-3 rounded-xl font-bold hover:bg-[#1A384D] transition-colors">
              دخول
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-[#D6E4E8] overflow-hidden overflow-x-auto">
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'metrics' ? 'bg-[#142B3B] text-white' : 'text-[#506A77] hover:bg-gray-50'}`}
          >
            الإحصائيات
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'bg-[#142B3B] text-white' : 'text-[#506A77] hover:bg-gray-50'}`}
          >
            الطلبات
          </button>
          <button 
            onClick={() => setActiveTab('profit')}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'profit' ? 'bg-[#142B3B] text-white' : 'text-[#506A77] hover:bg-gray-50'}`}
          >
            حاسبة الربح
          </button>
        </div>
        
        {activeTab === 'metrics' && (
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="border rounded-lg p-2 text-sm" />
            <span>-</span>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="border rounded-lg p-2 text-sm" />
          </div>
        )}
      </div>

      {loading && <div className="text-center py-10 text-[#4A8B9A]">جاري التحميل...</div>}

      {activeTab === 'metrics' && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6E4E8]">
            <div className="flex items-center gap-3 mb-2 text-[#506A77]">
              <MousePointerClick className="w-5 h-5 text-blue-500" />
              <span className="font-bold">الزيارات / النقرات</span>
            </div>
            <div className="text-3xl font-extrabold text-[#142B3B]">{metrics.clicks}</div>
            <div className="text-xs text-gray-400 mt-2">من ايبيهات كويتية صحيحة</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6E4E8]">
            <div className="flex items-center gap-3 mb-2 text-[#506A77]">
              <ShoppingCart className="w-5 h-5 text-green-500" />
              <span className="font-bold">إجمالي الطلبات</span>
            </div>
            <div className="text-3xl font-extrabold text-[#142B3B]">{metrics.orders}</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6E4E8]">
            <div className="flex items-center gap-3 mb-2 text-[#506A77]">
              <Activity className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-bold">الإيرادات (د.ك)</span>
            </div>
            <div className="text-3xl font-extrabold text-[#142B3B]">{metrics.revenue.toFixed(3)}</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6E4E8]">
            <div className="flex items-center gap-3 mb-2 text-[#506A77]">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="font-bold">معدل التحويل</span>
            </div>
            <div className="text-3xl font-extrabold text-[#142B3B]">{metrics.conversion_rate}%</div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && !loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#D6E4E8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-[#D6E4E8]">
                <tr>
                  <th className="p-4 font-bold text-[#142B3B]">رقم الطلب</th>
                  <th className="p-4 font-bold text-[#142B3B]">العميل</th>
                  <th className="p-4 font-bold text-[#142B3B]">رقم الهاتف</th>
                  <th className="p-4 font-bold text-[#142B3B]">المبلغ</th>
                  <th className="p-4 font-bold text-[#142B3B]">الحالة</th>
                  <th className="p-4 font-bold text-[#142B3B]">التاريخ</th>
                  <th className="p-4 font-bold text-[#142B3B]"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b border-[#D6E4E8] hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium">{o.order_number}</td>
                    <td className="p-4 text-sm">{o.customer_name}</td>
                    <td className="p-4 text-sm" dir="ltr">{o.phone}</td>
                    <td className="p-4 text-sm font-bold text-[#D4AF37]">{o.total_kwd.toFixed(3)} د.ك</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleString('ar-KW')}</td>
                    <td className="p-4">
                      <button onClick={() => fetchOrderDetails(o.id)} className="text-[#4A8B9A] hover:text-[#142B3B] p-2 bg-[#EBF2F5] rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">لا يوجد طلبات</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'profit' && !loading && (
        <ProfitCalculator metricsAovKwd={metrics.orders > 0 ? metrics.revenue / metrics.orders : 0} />
      )}

      {/* Order Preview Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#D6E4E8] flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-extrabold text-[#142B3B]">طلب #{selectedOrder.orderNumber}</h3>
                <p className="text-sm text-[#506A77] mt-1">{new Date(selectedOrder.createdAt).toLocaleString('ar-KW')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F5F8FA] p-4 rounded-xl border border-[#D6E4E8]">
                  <p className="text-xs text-[#506A77] font-bold mb-1">اسم العميل</p>
                  <p className="font-bold text-[#142B3B]">{selectedOrder.customerName}</p>
                </div>
                <div className="bg-[#F5F8FA] p-4 rounded-xl border border-[#D6E4E8]">
                  <p className="text-xs text-[#506A77] font-bold mb-1">الحالة</p>
                  <p className="font-bold text-[#142B3B]">{selectedOrder.status}</p>
                </div>
              </div>

              <h4 className="font-bold text-lg mb-4 text-[#142B3B]">المنتجات</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-white border border-[#D6E4E8] p-4 rounded-xl shadow-sm">
                    <div>
                      <p className="font-bold text-[#142B3B]">{item.productNameAr}</p>
                      <p className="text-sm text-[#506A77]">الكمية: {item.quantity} {item.isUpsell && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded mr-2">Upsell</span>}</p>
                    </div>
                    <div className="font-extrabold text-lg text-[#142B3B]">
                      {item.priceKwd.toFixed(3)} د.ك
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#D6E4E8] flex justify-between items-center">
                <p className="font-bold text-xl text-[#142B3B]">الإجمالي</p>
                <p className="font-extrabold text-2xl text-[#D4AF37]">{selectedOrder.totalKwd.toFixed(3)} د.ك</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
