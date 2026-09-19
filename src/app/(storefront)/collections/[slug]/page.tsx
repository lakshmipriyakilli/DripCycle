import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/storefront/ProductGrid'
import SectionHeading from '@/components/storefront/SectionHeading'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/types'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

async function getCollection(slug: string) {
  const supabase = await createClient()
  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!collection) return null

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(*)')
    .in('status', ['AVAILABLE', 'RESERVED', 'SOLD'])
    .in(
      'id',
      await supabase
        .from('collection_products')
        .select('product_id')
        .eq('collection_id', collection.id)
        .then(({ data }) => (data || []).map((r) => r.product_id))
    )
    .order('created_at', { ascending: false })

  return { collection, products: (products || []) as Product[] }
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getCollection(slug)
  if (!result) return { title: 'Collection Not Found' }
  return {
    title: result.collection.name,
    description: result.collection.description || `Shop the ${result.collection.name} collection at DripCycle.`,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const result = await getCollection(slug)
  if (!result) notFound()

  const { collection, products } = result

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/collections"
        className="inline-flex items-center gap-2 text-dc-muted hover:text-dc-lime transition-colors text-xs tracking-widest uppercase mb-8"
      >
        <ArrowLeft size={14} /> All Collections
      </Link>

      <SectionHeading
        title={collection.name.toUpperCase()}
        subtitle={collection.description || `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`}
      />

      <ProductGrid
        products={products}
        emptyTitle="Nothing in this collection yet."
        emptyDescription="Check back soon — new pieces are added regularly."
      />
    </div>
  )
}
