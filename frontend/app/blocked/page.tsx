export default function BlockedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F8FA] px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-2xl font-bold text-[#142B3B] mb-3 font-arabic">
          المتجر غير متاح في منطقتك
        </h1>
        <p className="text-gray-500 font-arabic">
          عذراً، هذا المتجر متاح حالياً فقط للعملاء في الكويت.
        </p>
      </div>
    </div>
  )
}
