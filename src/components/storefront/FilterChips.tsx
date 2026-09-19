'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface FilterChipsProps {
  categories: Category[]
}

export default function FilterChips({ categories }: FilterChipsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const setCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
      role="list"
      aria-label="Filter by category"
    >
      <button
        onClick={() => setCategory(null)}
        className={cn(
          'flex-shrink-0 px-4 py-2 text-xs font-semibold tracking-widest uppercase border transition-all duration-200',
          !activeCategory
            ? 'bg-dc-lime text-dc-black border-dc-lime'
            : 'bg-transparent text-dc-muted border-dc-grey hover:border-dc-lime hover:text-dc-lime'
        )}
        role="listitem"
        aria-pressed={!activeCategory}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.slug)}
          className={cn(
            'flex-shrink-0 px-4 py-2 text-xs font-semibold tracking-widest uppercase border transition-all duration-200',
            activeCategory === cat.slug
              ? 'bg-dc-lime text-dc-black border-dc-lime'
              : 'bg-transparent text-dc-muted border-dc-grey hover:border-dc-lime hover:text-dc-lime'
          )}
          role="listitem"
          aria-pressed={activeCategory === cat.slug}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
