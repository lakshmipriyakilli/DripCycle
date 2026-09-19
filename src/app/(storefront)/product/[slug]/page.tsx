import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductGallery from '@/components/storefront/ProductGallery'
import WhatsAppCTA from '@/components/storefront/WhatsAppCTA'
import SimilarProducts from '@/components/storefront/SimilarProducts'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { PRODUCT_CONDITIONS } from '@/lib/constants'
import type { Product } from '@/types'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(*)')
    .eq('slug', slug)
    .single()
  if (!data || data.status === 'DRAFT' || data.status === 'ARCHIVED') return null
  // Sort images by sort_order
  if (data.images) {
    data.images.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
  }
  return data as Product
}

async function getSimilarProducts(product: Product): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug), images:product_images(id,url,alt_text,is_cover,sort_order)')
    .eq('category_id', product.category_id)
    .in('status', ['AVAILABLE', 'RESERVED', 'SOLD'])
    .neq('id', product.id)
    .limit(8)
  return (data || []) as Product[]
}

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('whatsapp_number').single()
  return data
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }

  const coverImage = product.images?.find((i) => i.is_cover) || product.images?.[0]
  return {
    title: product.name,
    description: product.description || `${product.name} — ${formatPrice(product.price)} — Size ${product.size}. Shop pre-loved at DripCycle.`,
    openGraph: {
      title: `${product.name} | DripCycle`,
      description: product.description || `${product.name} — ${formatPrice(product.price)}`,
      images: coverImage ? [{ url: coverImage.url, alt: product.name }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()])

  if (!product) notFound()

  const similarProducts = await getSimilarProducts(product)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dripcycle.vercel.app'
  const conditionInfo = PRODUCT_CONDITIONS.find((c) => c.value === product.condition)
  const isSold = product.status === 'SOLD'
  const isReserved = product.status === 'RESERVED'

  const measurements = product.measurements as Record<string, string> | null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Back */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-dc-muted hover:text-dc-lime transition-colors text-xs tracking-widest uppercase mb-8"
      >
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            {isSold && <Badge variant="sold">SOLD OUT</Badge>}
            {isReserved && <Badge variant="reserved">RESERVED</Badge>}
            {product.is_new_drop && !isSold && <Badge variant="new-drop">NEW DROP</Badge>}
            <Badge variant="one-of-one">1 OF 1</Badge>
          </div>

          {/* Category */}
          {product.category && (
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-xs text-dc-muted tracking-widest uppercase hover:text-dc-lime transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          {/* Name & Price */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-dc-cream leading-tight mb-3">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-dc-cream">{formatPrice(product.price)}</p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-dc-grey p-4">
              <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Size</p>
              <p className="text-dc-cream font-semibold">{product.size}</p>
            </div>
            <div className="border border-dc-grey p-4">
              <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Condition</p>
              <p className="text-dc-cream font-semibold">{product.condition}</p>
              {conditionInfo?.description && (
                <p className="text-dc-muted text-xs mt-1">{conditionInfo.description}</p>
              )}
            </div>
            {product.brand && (
              <div className="border border-dc-grey p-4">
                <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Brand</p>
                <p className="text-dc-cream font-semibold">{product.brand}</p>
              </div>
            )}
            {product.color && (
              <div className="border border-dc-grey p-4">
                <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Color</p>
                <p className="text-dc-cream font-semibold">{product.color}</p>
              </div>
            )}
            {product.fit && (
              <div className="border border-dc-grey p-4">
                <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Fit</p>
                <p className="text-dc-cream font-semibold">{product.fit}</p>
              </div>
            )}
            {product.material && (
              <div className="border border-dc-grey p-4">
                <p className="text-xs text-dc-muted tracking-widest uppercase mb-1">Material</p>
                <p className="text-dc-cream font-semibold">{product.material}</p>
              </div>
            )}
          </div>

          {/* Measurements */}
          {measurements && Object.keys(measurements).length > 0 && (
            <div>
              <p className="text-xs text-dc-muted tracking-widest uppercase mb-3">Measurements (approx.)</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(measurements).map(([key, val]) => val && (
                  <div key={key} className="flex justify-between text-sm border-b border-dc-grey pb-1">
                    <span className="text-dc-muted capitalize">{key}</span>
                    <span className="text-dc-cream font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs text-dc-muted tracking-widest uppercase mb-3">About this piece</p>
              <p className="text-dc-cream/80 leading-relaxed text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?q=${tag}`}
                  className="text-xs text-dc-muted border border-dc-grey px-3 py-1 hover:border-dc-lime hover:text-dc-lime transition-colors tracking-widest uppercase"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <WhatsAppCTA
              product={product}
              whatsappNumber={settings?.whatsapp_number || ''}
              siteUrl={siteUrl}
            />
            {isSold && (
              <Link href="/shop" className="block mt-4 text-center text-sm text-dc-lime hover:underline tracking-widest uppercase">
                View similar finds →
              </Link>
            )}
          </div>

          {/* SKU & date */}
          <div className="pt-4 border-t border-dc-grey flex justify-between text-xs text-dc-mid">
            <span>SKU: {product.sku}</span>
            <span>Listed {formatDate(product.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Similar products */}
      <SimilarProducts products={similarProducts} currentProductId={product.id} />
    </div>
  )
}
