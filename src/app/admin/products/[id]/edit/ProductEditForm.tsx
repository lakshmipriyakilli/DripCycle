'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { toast } from '@/components/ui/Toast'
import { PRODUCT_CONDITIONS, FIT_OPTIONS, SIZE_PRESETS, MEASUREMENT_FIELDS, TAG_SUGGESTIONS } from '@/lib/constants'
import ImageUploader from '@/components/admin/ImageUploader'
import type { Category, ProductCondition, Measurements } from '@/types'
import { Trash2 } from 'lucide-react'

interface ProductEditFormProps {
  product: Record<string, unknown>
  categories: Category[]
}

interface EditableImage {
  id?: string
  file?: File
  url: string
  storage_path?: string
  is_cover: boolean
  sort_order: number
}

export default function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const existingImages: EditableImage[] = ((product.images as Record<string, unknown>[]) || []).map((img) => ({
    id: img.id as string,
    url: img.url as string,
    storage_path: img.storage_path as string,
    is_cover: img.is_cover as boolean,
    sort_order: img.sort_order as number,
  }))

  const [images, setImages] = useState<EditableImage[]>(existingImages)
  const [name, setName] = useState(product.name as string || '')
  const [categoryId, setCategoryId] = useState(product.category_id as string || '')
  const [price, setPrice] = useState(String(product.price || ''))
  const [size, setSize] = useState(product.size as string || '')
  const [condition, setCondition] = useState(product.condition as ProductCondition || '' as ProductCondition)
  const [brand, setBrand] = useState(product.brand as string || '')
  const [color, setColor] = useState(product.color as string || '')
  const [fit, setFit] = useState(product.fit as string || '')
  const [material, setMaterial] = useState(product.material as string || '')
  const [measurements, setMeasurements] = useState<Measurements>((product.measurements as Measurements) || {})
  const [description, setDescription] = useState(product.description as string || '')
  const [tags, setTags] = useState(((product.tags as string[]) || []).join(', '))
  const [status, setStatus] = useState(product.status as string || 'DRAFT')
  const [isFeatured, setIsFeatured] = useState(product.is_featured as boolean || false)
  const [isNewDrop, setIsNewDrop] = useState(product.is_new_drop as boolean || false)

  const handleSave = async () => {
    if (!name || !categoryId || !price || !size || !condition) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSaving(true)
    const supabase = createClient()
    try {
      const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean)
      await supabase.from('products').update({
        name, category_id: categoryId, price: Number(price), size, condition,
        brand: brand || null, color: color || null, fit: fit || null, material: material || null,
        measurements: Object.keys(measurements).length ? measurements : null,
        description, tags: tagArr, status,
        is_featured: isFeatured, is_new_drop: isNewDrop,
      }).eq('id', product.id as string)

      // Upload any new images
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (img.file && !img.storage_path) {
          const file = img.file
          const ext = file.name.split('.').pop()
          const path = `${product.id}/${Date.now()}-${i}.${ext}`
          const { error: upErr } = await supabase.storage.from('product-images').upload(path, file)
          if (!upErr) {
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
            await supabase.from('product_images').insert({ product_id: product.id, storage_path: path, url: urlData.publicUrl, sort_order: i, is_cover: img.is_cover, alt_text: name })
          }
        } else if (img.id) {
          // Update cover/sort for existing images
          await supabase.from('product_images').update({ is_cover: img.is_cover, sort_order: i }).eq('id', img.id)
        }
      }

      toast.success('Product updated!')
      router.refresh()
    } catch { toast.error('Failed to save.') }
    setSaving(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('products').update({ status: 'ARCHIVED' }).eq('id', product.id as string)
    toast.success('Product archived.')
    router.push('/admin/products')
  }

  const conditionOptions = PRODUCT_CONDITIONS.map(c => ({ value: c.value, label: c.label }))
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))
  const statusOptions = ['DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED'].map(s => ({ value: s, label: s }))
  const fitOptions = [{ value: '', label: 'Select fit' }, ...FIT_OPTIONS.map(f => ({ value: f, label: f }))]

  return (
    <div className="max-w-2xl space-y-6">
      <ImageUploader images={images as Parameters<typeof ImageUploader>[0]['images']} onChange={(imgs) => setImages(imgs as EditableImage[])} />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input label="Product Name" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <Select label="Category" required value={categoryId} onChange={e => setCategoryId(e.target.value)} options={categoryOptions} placeholder="Select category" />
        <Select label="Status" value={status} onChange={e => setStatus(e.target.value)} options={statusOptions} />
        <Input label="Price (₹)" required type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <Input label="Size" required value={size} onChange={e => setSize(e.target.value)} />
        <div className="col-span-2">
          <Select label="Condition" required value={condition} onChange={e => setCondition(e.target.value as ProductCondition)} options={conditionOptions} placeholder="Select condition" />
        </div>
        <Input label="Brand" value={brand} onChange={e => setBrand(e.target.value)} />
        <Input label="Color" value={color} onChange={e => setColor(e.target.value)} />
        <Select label="Fit" value={fit} onChange={e => setFit(e.target.value)} options={fitOptions} />
        <Input label="Material" value={material} onChange={e => setMaterial(e.target.value)} />
      </div>

      <div>
        <p className="text-sm font-medium text-dc-cream mb-3">Measurements</p>
        <div className="grid grid-cols-2 gap-3">
          {MEASUREMENT_FIELDS.map(({ key, label }) => (
            <Input key={key} label={label} value={measurements[key] || ''} onChange={e => setMeasurements(m => ({ ...m, [key]: e.target.value }))} placeholder="e.g. 42 inches" />
          ))}
        </div>
      </div>

      <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} rows={4} />

      <div>
        <p className="text-sm font-medium text-dc-cream mb-2">Tags</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {TAG_SUGGESTIONS.map(tag => {
            const active = tags.split(',').map(t => t.trim()).includes(tag)
            return (
              <button key={tag} type="button" onClick={() => {
                const arr = tags.split(',').map(t => t.trim()).filter(Boolean)
                const newArr = active ? arr.filter(t => t !== tag) : [...arr, tag]
                setTags(newArr.join(', '))
              }} className={`px-3 py-1 text-xs font-medium tracking-widest uppercase border transition-colors ${active ? 'bg-dc-lime text-dc-black border-dc-lime' : 'border-dc-grey text-dc-muted hover:border-dc-lime hover:text-dc-lime'}`}>
                {tag}
              </button>
            )
          })}
        </div>
        <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="Vintage, Streetwear, Y2K…" helper="Comma-separated tags" />
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isNewDrop} onChange={e => setIsNewDrop(e.target.checked)} className="w-4 h-4 accent-dc-lime" />
          <span className="text-sm text-dc-cream">Mark as New Drop</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-dc-lime" />
          <span className="text-sm text-dc-cream">Feature on Homepage</span>
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dc-grey">
        <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
          <Trash2 size={16} /> Archive Product
        </button>
        <Button variant="primary" size="lg" onClick={handleSave} loading={saving}>Save Changes</Button>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Archive Product"
        message="This will hide the product from your public store. You can restore it by changing the status. Continue?"
        confirmLabel="Archive"
        loading={deleting}
      />
    </div>
  )
}
