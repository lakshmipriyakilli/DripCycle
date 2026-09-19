import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductEditForm from './ProductEditForm'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, images:product_images(*)').eq('id', id).single(),
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Edit Product</h1>
        <p className="text-dc-muted text-sm mt-1 font-mono">SKU: {product.sku}</p>
      </div>
      <ProductEditForm product={product} categories={categories || []} />
    </div>
  )
}
