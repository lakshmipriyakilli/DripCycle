'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/components/ui/Toast'
import { Search, Check } from 'lucide-react'

interface CollectionEditClientProps {
  collection: Record<string, unknown>
  allProducts: { id: string; name: string; sku: string; status: string }[]
  assignedIds: string[]
}

export default function CollectionEditClient({ collection, allProducts, assignedIds }: CollectionEditClientProps) {
  const router = useRouter()
  const [name, setName] = useState(collection.name as string)
  const [desc, setDesc] = useState(collection.description as string || '')
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedIds))
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  const toggleProduct = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const id = collection.id as string

    await supabase.from('collections').update({ name, description: desc || null }).eq('id', id)

    // Replace collection products
    await supabase.from('collection_products').delete().eq('collection_id', id)
    const rows = Array.from(selected).map((pid, i) => ({ collection_id: id, product_id: pid, sort_order: i }))
    if (rows.length) await supabase.from('collection_products').insert(rows)

    toast.success('Collection saved!')
    router.push('/admin/collections')
    setSaving(false)
  }

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-2xl space-y-6">
      <Input label="Collection Name" required value={name} onChange={e => setName(e.target.value)} />
      <Textarea label="Description" value={desc} onChange={e => setDesc(e.target.value)} rows={2} />

      <div>
        <p className="text-sm font-medium text-dc-cream mb-3">Products in this collection ({selected.size} selected)</p>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dc-muted" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-dc-charcoal border border-dc-grey text-dc-cream text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-dc-lime"
          />
        </div>
        <div className="bg-dc-charcoal border border-dc-grey max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-dc-muted text-sm p-4">No products found.</p>
          ) : filtered.map(product => {
            const isSelected = selected.has(product.id)
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-dc-grey/50 hover:bg-dc-grey/20 transition-colors ${isSelected ? 'bg-dc-lime/5' : ''}`}
              >
                <div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-dc-lime' : 'text-dc-cream'}`}>{product.name}</p>
                  <p className="text-dc-muted text-xs font-mono">{product.sku} · {product.status}</p>
                </div>
                {isSelected && <Check size={16} className="text-dc-lime flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={handleSave} loading={saving}>Save Collection</Button>
    </div>
  )
}
