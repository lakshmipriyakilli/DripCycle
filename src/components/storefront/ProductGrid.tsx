import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export default function ProductGrid({
  products,
  loading = false,
  emptyTitle = 'Nothing here yet.',
  emptyDescription = 'Check back soon — new drips drop regularly.',
}: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={8} />

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={48} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
