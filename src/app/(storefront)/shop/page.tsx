import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/storefront/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Category, Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse all pre-loved fashion at DripCycle. One-of-one pieces curated for style.',
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    sort?: string
    q?: string
    filter?: string
  }>
}

async function getShopData(params: Awaited<ShopPageProps['searchParams']>) {
  try {
    const supabase = await createClient()

    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    let query = supabase
      .from('products')
      .select('*, category:categories(id,name,slug), images:product_images(*)')
      .in('status', ['AVAILABLE', 'RESERVED', 'SOLD'])

    if (params.category) {
      const cat = (categories || []).find((c) => c.slug === params.category)
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (params.filter === 'new_drop') query = query.eq('is_new_drop', true)
    if (params.q) query = query.or(`name.ilike.%${params.q}%,tags.cs.{"${params.q}"}`)

    switch (params.sort) {
      case 'price_asc': query = query.order('price', { ascending: true }); break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'newest': query = query.order('created_at', { ascending: false }); break
      default: query = query.order('created_at', { ascending: false })
    }

    const { data: products } = await query
    return {
      products: (products || []) as Product[],
      categories: (categories || []) as Category[],
    }
  } catch {
    return { products: [] as Product[], categories: [] as Category[] }
  }
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
]

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const { products, categories } = await getShopData(params)

  const pageTitle = params.filter === 'new_drop'
    ? 'NEW DROP'
    : params.category
      ? (categories.find((c) => c.slug === params.category)?.name || 'SHOP').toUpperCase()
      : params.q
        ? `"${params.q}"`
        : 'ALL DRIPS'

  const available = products.filter(p => p.status === 'AVAILABLE').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-20">

      {/* Page header */}
      <div className="border-b border-dc-grey/40 pb-8 mb-10">
        <p className="text-section-number mb-3">Shop</p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-dc-cream leading-none">
            {pageTitle}
          </h1>
          <p className="text-dc-muted text-xs tracking-widest uppercase shrink-0 mb-1">
            {available} available
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 md:gap-12">

        {/* Sidebar filters */}
        <aside className="md:w-44 shrink-0">
          {/* Categories */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dc-muted mb-4">Category</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`text-xs tracking-wide transition-colors duration-150 ${!params.category && !params.filter ? 'text-dc-lime font-semibold' : 'text-dc-muted hover:text-dc-cream'}`}
                >
                  All
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=new_drop"
                  className={`text-xs tracking-wide transition-colors duration-150 ${params.filter === 'new_drop' ? 'text-dc-lime font-semibold' : 'text-dc-muted hover:text-dc-cream'}`}
                >
                  New Drop
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className={`text-xs tracking-wide transition-colors duration-150 ${params.category === cat.slug ? 'text-dc-lime font-semibold' : 'text-dc-muted hover:text-dc-cream'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dc-muted mb-4">Sort</p>
            <ul className="space-y-2">
              {SORT_OPTIONS.map(({ value, label }) => (
                <li key={value}>
                  <Link
                    href={`/shop?${params.category ? `category=${params.category}&` : ''}${params.filter ? `filter=${params.filter}&` : ''}sort=${value}`}
                    className={`text-xs tracking-wide transition-colors duration-150 ${params.sort === value || (!params.sort && value === 'newest') ? 'text-dc-lime font-semibold' : 'text-dc-muted hover:text-dc-cream'}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-dc-muted text-sm tracking-widest uppercase mb-4">No pieces found</p>
              <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-lime hover:text-dc-cream transition-colors">
                Clear filters <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
