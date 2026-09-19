import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { Plus, Edit, Archive } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Package } from 'lucide-react'
import ProductStatusQuickChange from './ProductStatusQuickChange'

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(name), images:product_images(url, is_cover)')
    .not('status', 'eq', 'ARCHIVED')
    .order('created_at', { ascending: false })
  return data || []
}

function statusBadge(status: string) {
  const map: Record<string, { variant: 'available' | 'reserved' | 'sold' | 'draft'; label: string }> = {
    AVAILABLE: { variant: 'available', label: 'Available' },
    RESERVED: { variant: 'reserved', label: 'Reserved' },
    SOLD: { variant: 'sold', label: 'Sold' },
    DRAFT: { variant: 'draft', label: 'Draft' },
  }
  const s = map[status] || { variant: 'draft' as const, label: status }
  return <Badge variant={s.variant}>{s.label}</Badge>
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Products</h1>
          <p className="text-dc-muted text-sm mt-1">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-dc-lime text-dc-black px-5 py-2.5 text-sm font-bold tracking-widest uppercase hover:bg-[#a8f010] transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package size={48} />}
          title="No products yet."
          description="Add your first product to get started."
          action={
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-dc-lime text-dc-black px-5 py-2.5 text-sm font-bold tracking-widest uppercase">
              <Plus size={14} /> Add Product
            </Link>
          }
        />
      ) : (
        <div className="bg-dc-charcoal border border-dc-grey overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-dc-grey">
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Product</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">SKU</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Category</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Price</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Status</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Date</th>
                <th className="text-right px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const cover = (product.images as { url: string; is_cover: boolean }[])?.find((i) => i.is_cover) || (product.images as { url: string }[])?.[0]
                return (
                  <tr key={product.id} className="border-b border-dc-grey/50 hover:bg-dc-grey/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-dc-grey flex-shrink-0 overflow-hidden">
                          {cover && <img src={cover.url} alt={product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-dc-cream font-medium line-clamp-1">{product.name}</p>
                          <p className="text-dc-muted text-xs">Size: {product.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dc-muted font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-dc-muted">{(product.category as { name: string } | null)?.name || '—'}</td>
                    <td className="px-4 py-3 text-dc-cream font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <ProductStatusQuickChange productId={product.id} currentStatus={product.status} />
                    </td>
                    <td className="px-4 py-3 text-dc-muted text-xs">{formatDate(product.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-dc-muted hover:text-dc-lime transition-colors"
                          aria-label="Edit product"
                        >
                          <Edit size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
