'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/product/ProductCard'
import { PRODUCTS } from '@/data/products'
import { cn } from '@/lib/utils'

const FILTERS = [
  { label: 'الكل', value: 'all' },
  { label: 'للطفل', value: 'للطفل' },
  { label: 'للأم', value: 'للأم' },
  { label: 'للطلعات', value: 'للطلعات' },
  { label: 'هدايا', value: 'هدايا' },
]

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredProducts = PRODUCTS.filter((p) =>
    activeFilter === 'all' ? true : p.filterTags.includes(activeFilter)
  )

  return (
    <>
      {/* Collection Hero */}
      <section className="bg-[#EBF2F5] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#142B3B] mb-3">
            منتجات مختارة للأم والطفل
          </h1>
          <p className="text-[#506A77] text-base md:text-lg max-w-xl mx-auto">
            اختاري المنتج حسب المرحلة اللي تعيشينها الآن.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-[#D6E4E8] bg-white sticky top-16 sm:top-20 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4A8B9A] focus:ring-offset-2',
                  activeFilter === filter.value
                    ? 'bg-[#4A8B9A] text-white'
                    : 'bg-[#EBF2F5] text-[#506A77] hover:bg-[#EDDED7]'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#506A77] text-lg">لا توجد منتجات في هذا التصنيف.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bundle Education */}
      <section className="bg-[#EBF2F5] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#142B3B] text-center mb-8">
            ليش تطلبين أكثر من قطعة؟
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                qty: '1',
                label: 'قطعة واحدة',
                price: '19 KWD',
                reason: 'للتجربة الأولى والتأكد من الملاءمة.',
              },
              {
                qty: '2',
                label: 'قطعتين',
                price: '27 KWD',
                reason: 'وحدة في البيت ووحدة في شنطة الطفل أو للهدية. وفري 11 KWD.',
                highlight: true,
              },
              {
                qty: '3',
                label: '3 قطع',
                price: '33 KWD',
                reason: 'للبيت، السيارة، وعند جدتها. أو للهدايا. وفري 24 KWD.',
              },
            ].map((item) => (
              <div
                key={item.qty}
                className={cn(
                  'bg-white rounded-3xl p-5 text-center border',
                  item.highlight
                    ? 'border-[#4A8B9A] shadow-md'
                    : 'border-[#D6E4E8] shadow-sm'
                )}
              >
                {item.highlight && (
                  <span className="inline-block bg-[#4A8B9A] text-white text-xs font-bold px-3 py-0.5 rounded-full mb-3">
                    الأكثر اختياراً
                  </span>
                )}
                <div className="text-3xl font-bold text-[#4A8B9A] mb-1">{item.qty}</div>
                <p className="font-bold text-[#142B3B] mb-1">{item.label}</p>
                <p className="text-xl font-bold text-[#4A8B9A] mb-2">{item.price}</p>
                <p className="text-[#506A77] text-sm">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust FAQ */}
      <section className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#142B3B] text-center mb-8">أسئلة شائعة</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'هل الدفع عند الاستلام؟',
                a: 'نعم، الدفع فقط عند استلام الطلب. بدون أي دفع مسبق.',
              },
              {
                q: 'كيف يتم التأكيد؟',
                a: 'بعد تسجيل الطلب، راح نتواصل معك على رقم الجوال لتأكيده قبل الشحن.',
              },
              {
                q: 'ما هي سياسة الاستبدال؟',
                a: 'راجعي صفحة سياسة الاستبدال لكل التفاصيل.',
              },
              {
                q: 'هل المنتجات مناسبة للهدايا؟',
                a: 'نعم، التغليف مرتب ومناسب للهدايا.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#D6E4E8] p-5 shadow-sm"
              >
                <p className="font-bold text-[#142B3B] mb-2 text-sm">{faq.q}</p>
                <p className="text-[#506A77] text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
