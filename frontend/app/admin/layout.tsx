import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Mahdbaby',
  robots: { index: false, follow: false }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#F5F8FA] font-arabic text-[#142B3B]" dir="rtl">
      {/* Admin specific header */}
      <header className="bg-white border-b border-[#D6E4E8] py-4 px-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-[#142B3B]">مهد بيبي | لوحة التحكم</h1>
          <div className="flex gap-4">
            <span className="text-sm font-medium text-[#506A77]">المدير</span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  )
}
