'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImage } from '@/types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-dc-charcoal flex items-center justify-center">
        <span className="text-dc-mid text-sm tracking-widest uppercase">No images</span>
      </div>
    )
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  // Touch swipe support
  let touchStartX = 0
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className="relative aspect-[3/4] bg-dc-charcoal overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt_text || `${productName} — image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={activeIndex === 0}
        />

        {/* Nav arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-dc-black/70 p-2 text-dc-cream opacity-0 group-hover:opacity-100 transition-opacity hover:text-dc-lime"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-dc-black/70 p-2 text-dc-cream opacity-0 group-hover:opacity-100 transition-opacity hover:text-dc-lime"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-dc-black/70 px-2 py-1 text-xs text-dc-muted tracking-widest">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 relative overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-dc-lime'
                  : 'border-transparent hover:border-dc-mid'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${productName} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Mobile dot indicators */}
      {images.length > 1 && (
        <div className="flex gap-1.5 justify-center md:hidden" aria-hidden="true">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'bg-dc-lime w-4' : 'bg-dc-grey'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
