'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { toast } from '@/components/ui/Toast'
import { Plus, Edit2, Check, X, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Category } from '@/types'
import { generateSlug } from '@/lib/utils'

interface CategoriesClientProps {
  initialCategories: Category[]
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const refresh = async () => {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories((data || []) as Category[])
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('categories').insert({
      name: newName.trim(),
      slug: generateSlug(newName),
      description: newDesc || null,
      is_active: true,
      sort_order: categories.length,
    })
    if (error) { toast.error('Failed to create category.') } else {
      toast.success('Category created!')
      setNewName(''); setNewDesc(''); setAdding(false)
      await refresh()
    }
    setSaving(false)
  }

  const handleToggle = async (cat: Category) => {
    const supabase = createClient()
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id)
    toast.success(`Category ${cat.is_active ? 'deactivated' : 'activated'}`)
    await refresh()
  }

  const handleEditSave = async (cat: Category) => {
    if (!editName.trim()) return
    const supabase = createClient()
    await supabase.from('categories').update({ name: editName.trim() }).eq('id', cat.id)
    toast.success('Category updated!')
    setEditingId(null)
    await refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-widest uppercase text-dc-cream">Categories</h1>
          <p className="text-dc-muted text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button variant="primary" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {adding && (
        <div className="bg-dc-charcoal border border-dc-lime p-6 mb-6 space-y-4">
          <h3 className="text-sm font-bold tracking-widest uppercase text-dc-cream">New Category</h3>
          <Input label="Name" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Jackets & Coats" />
          <Textarea label="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Brief description" rows={2} />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAdd} loading={saving}>Create</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-dc-charcoal border border-dc-grey overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-dc-muted text-sm">No categories yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dc-grey">
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Name</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Status</th>
                <th className="text-right px-4 py-3 text-dc-muted text-xs tracking-widest uppercase font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-dc-grey/50 hover:bg-dc-grey/10 transition-colors">
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="bg-dc-grey text-dc-cream px-2 py-1 text-sm border border-dc-lime focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleEditSave(cat)} className="text-dc-lime hover:text-dc-cream"><Check size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="text-dc-muted hover:text-dc-cream"><X size={16} /></button>
                      </div>
                    ) : (
                      <span className="text-dc-cream">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-dc-muted font-mono text-xs hidden md:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold tracking-widest uppercase ${cat.is_active ? 'text-dc-lime' : 'text-dc-muted'}`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => { setEditingId(cat.id); setEditName(cat.name) }} className="text-dc-muted hover:text-dc-lime transition-colors"><Edit2 size={15} /></button>
                      <button onClick={() => handleToggle(cat)} className={`transition-colors ${cat.is_active ? 'text-dc-lime hover:text-dc-muted' : 'text-dc-muted hover:text-dc-lime'}`}>
                        {cat.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
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
