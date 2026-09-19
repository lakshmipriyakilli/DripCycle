import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types'

interface SimilarProductsProps {
  products: Product[]
  currentProductId: string
}

export default function SimilarProducts({ products, currentProductId }: SimilarProductsProps) {
  const filtered = products.filter((p) => p.id !== currentProductId).slice(0, 6)

  if (!filtered.length) return null

  return (
    <section className="mt-16 pt-12 border-t border-dc-grey">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-widest uppercase text-dc-cream">
          You Might Also Like
        </h2>
        <p className="text-dc-muted text-sm mt-1">More one-of-one finds</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((product) => {
          const cover = product.images?.find((i) => i.is_cover) || product.images?.[0]
          const isSold = product.status === 'SOLD'
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block"
              aria-label={product.name}
            >
              <div className="product-image-zoom relative aspect-[3/4] bg-dc-charcoal overflow-hidden mb-3">
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={cover.alt_text || product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'opacity-40 grayscale' : ''}`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-dc-grey flex items-center justify-center">
                    <span className="text-dc-mid text-xs tracking-wider uppercase">No image</span>
                  </div>
                )}
                {isSold && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="sold">Sold</Badge>
                  </div>
                )}
              </div>
              <p className="text-xs text-dc-muted tracking-widest uppercase truncate">{product.category?.name || 'DripCycle'}</p>
              <h3 className="text-sm font-medium text-dc-cream group-hover:text-dc-lime transition-colors line-clamp-1 mt-0.5">{product.name}</h3>
              <p className="text-sm font-bold text-dc-cream mt-1">{formatPrice(product.price)}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
