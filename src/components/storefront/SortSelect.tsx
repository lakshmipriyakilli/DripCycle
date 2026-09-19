'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

export default function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSort = searchParams.get('sort') || 'newest'

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', e.target.value)
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="relative">
      <select
        value={activeSort}
        onChange={handleChange}
        className="appearance-none bg-transparent border border-dc-grey text-dc-muted text-xs tracking-widest uppercase px-4 py-2 pr-8 hover:border-dc-lime hover:text-dc-lime transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-dc-lime"
        aria-label="Sort products"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-dc-charcoal text-dc-cream normal-case tracking-normal">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-dc-muted pointer-events-none" />
    </div>
  )
}
