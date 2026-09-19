'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { toast } from '@/components/ui/Toast'
import { Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react'
import { generateSlug } from '@/lib/utils'
import type { Collection } from '@/types'

interface CollectionsClientProps {
  initialCollections: Collection[]
}

export default function CollectionsClient({ initialCollections }: CollectionsClientProps) {
  const [collections, setCollections] = useState(initialCollections)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [saving, setSaving] = useState(false)

  const refresh = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('collections').select('*').order('sort_order')
    setCollections((data || []) as Collection[])
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('collections').insert({
      name: newName.trim(), slug: generateSlug(newName),
      description: newDesc || null, is_active: true, sort_order: collections.length,
    })
    if (error) { toast.error('Failed to create collection.') } else {
      toast.success('Collection created!')
      setNewName(''); setNewDesc(''); setAdding(false)
      await refresh()
    }
    setSaving(false)
  }

  const handleToggle = async (col: Collection) => {
    const supabase = createClient()
    await supabase.from('collections').update({ is_active: !col.is_active }).eq('id', col.id)
    toast.success(`Collection ${col.is_active ? 'deactivated' : 'activated'}`)
    await refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Collections</h1>
          <p className="text-dc-muted text-sm mt-1">{collections.length} collections</p>
        </div>
        <Button variant="primary" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add Collection
        </Button>
      </div>

      {adding && (
        <div className="bg-dc-charcoal border border-dc-lime p-6 mb-6 space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-dc-cream">New Collection</h3>
          <Input label="Name" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Summer Streetwear" />
          <Textarea label="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAdd} loading={saving}>Create</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-dc-charcoal border border-dc-grey overflow-hidden">
        {collections.length === 0 ? (
          <div className="p-8 text-center text-dc-muted text-sm">No collections yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dc-grey">
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Collection</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Status</th>
                <th className="text-right px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.id} className="border-b border-dc-grey/50 hover:bg-dc-grey/10 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-dc-cream font-medium">{col.name}</p>
                    {col.description && <p className="text-dc-muted text-xs mt-0.5 line-clamp-1">{col.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-dc-muted font-mono text-xs hidden md:table-cell">{col.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold tracking-widest uppercase ${col.is_active ? 'text-dc-lime' : 'text-dc-muted'}`}>
                      {col.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/collections/${col.id}/edit`} className="text-dc-muted hover:text-dc-lime transition-colors">
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleToggle(col)} className={`transition-colors ${col.is_active ? 'text-dc-lime hover:text-dc-muted' : 'text-dc-muted hover:text-dc-lime'}`}>
                        {col.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
