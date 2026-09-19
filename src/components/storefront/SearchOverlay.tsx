'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-dc-black/95 backdrop-blur-sm flex flex-col items-center justify-start pt-32 px-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-dc-muted hover:text-dc-cream transition-colors"
        aria-label="Close search"
      >
        <X size={24} />
      </button>

      <p className="text-dc-muted text-sm tracking-widest uppercase mb-6">Search products</p>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-dc-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, brand, or style…"
            className="w-full bg-dc-charcoal border border-dc-grey text-dc-cream placeholder-dc-mid px-12 py-5 text-lg focus:outline-none focus:border-dc-lime transition-colors"
            aria-label="Search query"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 text-dc-muted hover:text-dc-cream transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button type="submit" className="sr-only">Search</button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {['Vintage', 'Denim', 'Streetwear', 'Y2K', 'Jackets'].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              router.push(`/shop?q=${tag}`)
              onClose()
            }}
            className="px-4 py-2 text-xs tracking-widest uppercase border border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
