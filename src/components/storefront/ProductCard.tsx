import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

const CONDITION_SHORT: Record<string, string> = {
  'New': 'New',
  'Like New': 'Like New',
  'Excellent': 'Excellent',
  'Very Good': 'V. Good',
  'Good': 'Good',
  'Vintage/Distressed': 'Vintage',
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = product.images || []
  const coverImage = images.find((i) => i.is_cover) || images[0]
  const hoverImage = images[1]

  const isSold = product.status === 'SOLD'
  const isReserved = product.status === 'RESERVED'
  const isDraft = product.status === 'DRAFT'
  const conditionShort = CONDITION_SHORT[product.condition] || product.condition

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatPrice(product.price)}`}
    >
      {/* Image */}
      <div className="product-image-wrap relative aspect-[3/4] bg-dc-charcoal mb-3 overflow-hidden">
        {coverImage ? (
          <>
            <Image
              src={coverImage.url}
              alt={coverImage.alt_text || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-500 ${hoverImage ? 'group-hover:opacity-0' : ''} ${isSold ? 'grayscale opacity-60' : ''}`}
              priority={priority}
            />
            {/* Hover image */}
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isSold ? 'grayscale opacity-60' : ''}`}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-dc-mid text-[10px] tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Status overlays */}
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-dc-black/80 text-dc-cream text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-2">
              SOLD
            </span>
          </div>
        )}
        {isReserved && (
          <div className="absolute top-3 right-3">
            <span className="bg-dc-black/90 text-amber-400 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1">
              RESERVED
            </span>
          </div>
        )}

        {/* ONE OF ONE badge */}
        {!isSold && !isReserved && (
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-dc-lime text-dc-black text-[9px] font-black tracking-[0.15em] uppercase px-2 py-1">
              1 OF 1
            </span>
          </div>
        )}

        {/* New drop */}
        {product.is_new_drop && !isSold && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-dc-black/80 text-dc-lime text-[9px] font-semibold tracking-[0.2em] uppercase px-2 py-1">
              NEW DROP
            </span>
          </div>
        )}
      </div>

      {/* Metadata — minimal */}
      <div className="space-y-1">
        <p className="text-dc-cream text-xs font-medium tracking-wide leading-tight line-clamp-1 group-hover:text-dc-lime transition-colors duration-200">
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-dc-cream text-sm font-bold tracking-tight">
            {isSold ? <span className="text-dc-muted line-through">{formatPrice(product.price)}</span> : formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-dc-muted text-[10px] tracking-widest uppercase">{product.size}</span>
            <span className="text-dc-grey">·</span>
            <span className="text-dc-muted text-[10px] tracking-widest uppercase">{conditionShort}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
