import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CollectionEditClient from './CollectionEditClient'

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function CollectionEditPage({ params }: EditPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: collection }, { data: allProducts }] = await Promise.all([
    supabase.from('collections').select('*').eq('id', id).single(),
    supabase.from('products').select('id, name, sku, status').in('status', ['AVAILABLE', 'RESERVED', 'SOLD', 'DRAFT']).order('name'),
  ])

  const { data: assigned } = await supabase.from('collection_products').select('product_id').eq('collection_id', id)

  if (!collection) notFound()

  return (
    <div>
      <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream mb-8">Edit Collection: {collection.name}</h1>
      <CollectionEditClient
        collection={collection}
        allProducts={allProducts || []}
        assignedIds={(assigned || []).map(r => r.product_id)}
      />
    </div>
  )
}
