import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/storefront/ProductCard'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import type { Collection } from '@/types'

export const metadata = {
  title: 'Collections',
  description: 'Browse curated collections at DripCycle — Vintage, Streetwear, New Drop and more.',
}

async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return (data || []) as Collection[]
  } catch {
    return []
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="pt-20 md:pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-b border-dc-grey/40 pb-8 mb-12 md:mb-16">
        <p className="text-section-number mb-3">DripCycle</p>
        <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase text-dc-cream leading-none">
          COLLECTIONS
        </h1>
      </div>

      {collections.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-dc-muted text-sm tracking-widest uppercase mb-4">No collections yet</p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-dc-lime hover:text-dc-cream transition-colors">
            Browse All Pieces <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Editorial layout — alternating full/half width */}
          <div className="space-y-4 md:space-y-2">
            {collections.map((col, i) => {
              const isWide = i % 3 === 0
              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className={`group relative flex overflow-hidden bg-dc-charcoal ${
                    isWide ? 'h-[60vw] sm:h-[50vw] md:h-[45vw] max-h-[600px]' : 'h-[50vw] sm:h-[40vw] md:h-[35vw] max-h-[480px]'
                  }`}
                >
                  {/* Image or dark placeholder */}
                  {col.image_url ? (
                    <Image
                      src={col.image_url}
                      alt={col.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 80vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-dc-charcoal" />
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dc-black/80 via-dc-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-end p-6 md:p-10 w-full">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-dc-cream/50 mb-2">
                          Collection {String(i + 1).padStart(2, '0')}
                        </p>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase text-dc-cream group-hover:text-dc-lime transition-colors duration-300 leading-none">
                          {col.name}
                        </h2>
                        {col.description && (
                          <p className="text-dc-cream/60 text-xs md:text-sm mt-2 max-w-md leading-relaxed">
                            {col.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 ml-6">
                        <div className="w-10 h-10 border border-dc-cream/30 group-hover:border-dc-lime group-hover:bg-dc-lime transition-all duration-300 flex items-center justify-center">
                          <ArrowRight size={16} className="text-dc-cream group-hover:text-dc-black transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
