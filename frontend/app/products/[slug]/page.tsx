import { notFound } from 'next/navigation'
import { PRODUCTS, getProductBySlug } from '@/data/products'
import { ProductPageClient } from './ProductPageClient'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

interface Props {
  params: { slug: string }
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) return notFound()
  return <ProductPageClient product={product} />
}
